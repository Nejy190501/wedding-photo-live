import { useState, useEffect, useCallback, useMemo } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebaseAuth';
import { Photo } from '../types';

export type { Photo };

export const useGallery = (filterStatus?: 'pending' | 'approved' | 'rejected' | 'all') => {
  const [allPhotos, setAllPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    const q = query(collection(db, 'photos'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedPhotos: Photo[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        
        // Optimize Cloudinary URLs for smooth performance with 150+ users
        // `f_auto,q_auto` ensures the browser gets WebP/AVIF instead of heavy JPEGs or unsupported HEIC
        const rawUrl = data.url || '';
        const fullUrl = rawUrl.replace('/upload/', '/upload/f_auto,q_auto/');
        const thumbnailUrl = rawUrl.replace('/upload/', '/upload/c_fill,w_400,h_400,f_auto,q_auto/');

        fetchedPhotos.push({
          id: doc.id,
          name: data.name,
          createdTime: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
          guestName: data.guestName || 'Invité',
          caption: data.caption || '',
          url: fullUrl,
          thumbnailUrl: thumbnailUrl,
          likes: data.likes || 0,
          status: data.status || 'approved'
        });
      });
      
      setAllPhotos(fetchedPhotos);
      setIsLoading(false);
      setError(null);
    }, (err) => {
      console.error('Error fetching photos from firestore:', err);
      setError('Erreur lors du chargement des photos.');
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const photos = useMemo(() => {
    if (!filterStatus || filterStatus === 'all') {
      return allPhotos;
    }
    return allPhotos.filter(p => p.status === filterStatus);
  }, [allPhotos, filterStatus]);

  const toggleLikePhoto = useCallback(async (photoId: string) => {
    try {
      const photoRef = doc(db, 'photos', photoId);
      // For simplicity, we just increment. A real system would track user IDs.
      // But for a wedding, simple increment per click is fun (or we can use localStorage to prevent spam)
      await updateDoc(photoRef, {
        likes: increment(1)
      });
    } catch (err) {
      console.error('Error liking photo:', err);
    }
  }, []);

  return { photos, isLoading, error, toggleLikePhoto };
};
