import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseAuth';
import { get, update } from 'idb-keyval';

const OFFLINE_QUEUE_KEY = 'wedding_offline_queue';

interface OfflineUpload {
  id: string;
  blob: Blob;
  name: string;
  guestName: string;
  caption: string;
  status: string;
}

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/cxq1k0ko/image/upload';
const CLOUDINARY_UPLOAD_PRESET = 'mariage';

export interface GuestPhotoItem {
  id: string;
  file: File;
  previewUrl: string;
}

export const useGuestUpload = (moderationEnabled: boolean = false) => {
  const [guestName, setGuestName] = useState('');
  const [photoItems, setPhotoItems] = useState<GuestPhotoItem[]>([]);
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isOfflineSyncing, setIsOfflineSyncing] = useState(false);

  const photos = photoItems.map(item => item.file);
  const previewUrls = photoItems.map(item => item.previewUrl);

  useEffect(() => {
    const handleOnline = () => {
      syncOfflineUploads();
    };
    window.addEventListener('online', handleOnline);
    // Try to sync on mount if online
    if (navigator.onLine) {
      syncOfflineUploads();
    }
    return () => window.removeEventListener('online', handleOnline);
  }, []);

  const syncOfflineUploads = async () => {
    if (isOfflineSyncing) return;
    setIsOfflineSyncing(true);

    try {
      const queue = await get<OfflineUpload[]>(OFFLINE_QUEUE_KEY) || [];
      if (queue.length === 0) return;

      console.log(`Syncing ${queue.length} offline uploads...`);
      const remainingQueue: OfflineUpload[] = [];

      for (const item of queue) {
        try {
          const formData = new FormData();
          formData.append('file', item.blob, item.name);
          formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
          const cleanName = item.guestName.replace(/[^a-zA-Z0-9]/g, '_');
          formData.append('context', `guestName=${cleanName}`);

          const response = await fetch(CLOUDINARY_URL, {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) throw new Error('Cloudinary error during sync');

          const cloudinaryData = await response.json();
          await addDoc(collection(db, 'photos'), {
            name: cloudinaryData.public_id,
            guestName: item.guestName,
            caption: item.caption,
            url: cloudinaryData.secure_url,
            createdAt: serverTimestamp(),
            status: item.status,
            likes: 0
          });
        } catch (err) {
          console.error("Failed to sync item:", item.id, err);
          remainingQueue.push(item); // Keep in queue if failed
        }
      }

      await update(OFFLINE_QUEUE_KEY, () => remainingQueue);

    } catch (err) {
      console.error("Offline sync error", err);
    } finally {
      setIsOfflineSyncing(false);
    }
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const newItems: GuestPhotoItem[] = [];
      let hasTooLargeFile = false;

      for (const file of newFiles) {
        // Increase limit to 50MB to support raw 8K photos from high-end smartphones
        if (file.size > 50 * 1024 * 1024) {
          hasTooLargeFile = true;
          continue;
        }
        const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}-${file.name}`;
        newItems.push({
          id,
          file,
          previewUrl: URL.createObjectURL(file),
        });
      }

      if (hasTooLargeFile) {
        setErrorMessage('Certaines photos sont trop volumineuses et ont été ignorées (max 50MB).');
      } else {
        setErrorMessage('');
      }

      setPhotoItems(prev => [...prev, ...newItems]);
      setUploadStatus('idle');
      // Reset input element value to allow re-selecting same files if desired
      e.target.value = '';
    }
  };

  const removePhoto = (idOrIndex: string | number) => {
    setPhotoItems(prev => {
      let itemToRemove: GuestPhotoItem | undefined;
      let nextItems: GuestPhotoItem[];

      if (typeof idOrIndex === 'number') {
        itemToRemove = prev[idOrIndex];
        nextItems = prev.filter((_, index) => index !== idOrIndex);
      } else {
        itemToRemove = prev.find(item => item.id === idOrIndex);
        nextItems = prev.filter(item => item.id !== idOrIndex);
      }

      if (itemToRemove?.previewUrl) {
        const urlToRevoke = itemToRemove.previewUrl;
        // Delay revocation slightly so exiting animation can complete without blanking out
        setTimeout(() => {
          try {
            URL.revokeObjectURL(urlToRevoke);
          } catch (e) {
            // ignore
          }
        }, 1000);
      }

      return nextItems;
    });
  };

  // Helper function to optimize image before upload to ensure FAST uploads
  // while keeping stunning 4K quality (max dimension 3840px)
  const optimizeImage = async (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(url);
        
        // Max dimension for 4K quality
        const MAX_DIMENSION = 3840;
        let width = img.width;
        let height = img.height;
        
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          if (width > height) {
            height = Math.round((height * MAX_DIMENSION) / width);
            width = MAX_DIMENSION;
          } else {
            width = Math.round((width * MAX_DIMENSION) / height);
            height = MAX_DIMENSION;
          }
        }
        
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file); // Fallback to original if canvas fails
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Export as JPEG with 92% quality (virtually lossless visually, but much lighter)
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              resolve(file); // Fallback
            }
          },
          'image/jpeg',
          0.92
        );
      };
      
      img.onerror = () => {
        // Fallback: If the browser cannot read the format (e.g. some HEIC/RAW files),
        // we skip local optimization and resolve with the original file.
        // Cloudinary will natively handle and convert these formats server-side.
        resolve(file);
      };
      img.src = url;
    });
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (photos.length === 0) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    setUploadStatus('idle');
    setErrorMessage('');

    try {
      const cleanName = (guestName || 'Invite').replace(/[^a-zA-Z0-9]/g, '_');
      
      let processedCount = 0;

      for (const photo of photos) {
        // Smart local optimization for blazing fast uploads without quality loss
        const optimizedPhotoBlob = await optimizeImage(photo);
        
        const formData = new FormData();
        formData.append('file', optimizedPhotoBlob, photo.name);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        formData.append('context', `guestName=${cleanName}`);

        try {
          if (!navigator.onLine) {
            throw new Error('OFFLINE');
          }

          const cloudinaryResponse = await fetch(CLOUDINARY_URL, {
            method: 'POST',
            body: formData,
          });

          if (!cloudinaryResponse.ok) {
            throw new Error('NETWORK_ERROR');
          }

          const cloudinaryData = await cloudinaryResponse.json();
          const downloadURL = cloudinaryData.secure_url;

          // 2. Save metadata to Firestore
          await addDoc(collection(db, 'photos'), {
            name: cloudinaryData.public_id,
            guestName: guestName || 'Invité Anonyme',
            caption: message,
            url: downloadURL,
            createdAt: serverTimestamp(),
            status: moderationEnabled ? 'pending' : 'approved',
            likes: 0
          });

        } catch (err: any) {
          // Si hors ligne ou erreur réseau, on met en file d'attente
          if (err.message === 'OFFLINE' || err.message === 'NETWORK_ERROR' || err.message.includes('Failed to fetch')) {
            console.log('Mode hors ligne détecté. Mise en file d\'attente de la photo...');
            const newOfflineItem: OfflineUpload = {
              id: Date.now().toString() + Math.random().toString(),
              blob: optimizedPhotoBlob,
              name: photo.name,
              guestName: guestName || 'Invité Anonyme',
              caption: message,
              status: moderationEnabled ? 'pending' : 'approved'
            };
            
            await update(OFFLINE_QUEUE_KEY, (val) => {
              const queue = val || [];
              queue.push(newOfflineItem);
              return queue;
            });
            
            // On signale tout de même un succès à l'utilisateur car c'est géré en arrière-plan
          } else {
            throw err;
          }
        }

        processedCount++;
        setUploadProgress(Math.round((processedCount / photos.length) * 100));
      }

      setUploadStatus('success');
      photoItems.forEach(p => {
        try {
          URL.revokeObjectURL(p.previewUrl);
        } catch (e) {}
      });
      setPhotoItems([]);
      setMessage('');
      
    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      setErrorMessage(error.message || 'Erreur inattendue lors du transfert.');
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 2000);
    }
  };

  const resetUpload = () => {
    photoItems.forEach(p => {
      try {
        URL.revokeObjectURL(p.previewUrl);
      } catch (e) {}
    });
    setPhotoItems([]);
    setMessage('');
    setUploadStatus('idle');
  };

  return {
    guestName, setGuestName,
    photos, previewUrls, photoItems, handlePhotoSelect, removePhoto,
    message, setMessage,
    isUploading, uploadProgress, uploadStatus, errorMessage,
    handleUpload, resetUpload
  };
};
