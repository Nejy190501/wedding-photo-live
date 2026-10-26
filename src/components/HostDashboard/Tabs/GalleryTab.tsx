import React, { useState, useEffect } from 'react';
import { Camera, Image as ImageIcon, Download, Maximize2, X, ChevronLeft, ChevronRight, Play, Trash2, CheckSquare, Square, Archive } from 'lucide-react';
import { useWedding } from '../../../contexts/WeddingContext';
import { useGallery, Photo } from '../../../hooks/useGallery';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebaseAuth';

export const GalleryTab = () => {
  const { session } = useWedding();
  const { photos, isLoading, error } = useGallery();
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-12 text-center">
        <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-500 font-medium">Chargement de la galerie...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-3xl border border-rose-100 shadow-xl p-12 text-center text-rose-500">
        <p>{error}</p>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-16 text-center">
        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Camera className="w-10 h-10 text-slate-300" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">La galerie est vide</h3>
        <p className="text-slate-500">Vos invités n'ont pas encore partagé de photos.</p>
      </div>
    );
  }

  const navigatePhoto = (direction: 'next' | 'prev') => {
    if (!selectedPhoto) return;
    const currentIndex = photos.findIndex(p => p.id === selectedPhoto.id);
    let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (newIndex >= photos.length) newIndex = 0;
    if (newIndex < 0) newIndex = photos.length - 1;
    setSelectedPhoto(photos[newIndex]);
  };

  const toggleSelection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const selectAll = () => {
    if (selectedIds.size === photos.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(photos.map(p => p.id)));
    }
  };

  const handleDeleteSelected = async () => {
    if (!window.confirm(`Voulez-vous vraiment supprimer ces ${selectedIds.size} photo(s) ? Cette action est irréversible.`)) {
      return;
    }
    
    // We iterate over the selected IDs and delete documents in Firestore
    for (const id of Array.from(selectedIds)) {
      try {
        await deleteDoc(doc(db, 'photos', id));
      } catch (err) {
        console.error("Erreur de suppression pour", id, err);
      }
    }
    setSelectedIds(new Set());
    setIsSelectionMode(false);
  };

  const handleDeleteSingle = async (photoId: string) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette photo ?")) return;
    try {
      await deleteDoc(doc(db, 'photos', photoId));
      setSelectedPhoto(null);
    } catch (err) {
      console.error("Erreur suppression", err);
    }
  };

  const handleDownloadZip = async () => {
    if (selectedIds.size === 0) return;
    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      // Dynamic imports to prevent top-level module crashes and save bundle size
      const JSZipModule = await import('jszip');
      const JSZip = JSZipModule.default || JSZipModule;
      
      const FileSaverModule = await import('file-saver');
      const saveAs = FileSaverModule.saveAs || (FileSaverModule as any).default?.saveAs || FileSaverModule.default;

      const zip = new JSZip();
      const photosToDownload = photos.filter(p => selectedIds.has(p.id));

      let processed = 0;
      const CONCURRENCY = 5;

      const downloadPhoto = async (photo: typeof photosToDownload[0]) => {
        try {
          const response = await fetch(photo.url);
          const blob = await response.blob();
          
          const extension = blob.type.split('/')[1] || 'jpg';
          const filename = `${photo.guestName.replace(/[^a-zA-Z0-9]/g, '_')}_${photo.id}.${extension}`;
          
          zip.file(filename, blob);
        } catch (err) {
          console.error("Erreur téléchargement photo", photo.id, err);
        } finally {
          processed++;
          setDownloadProgress(Math.round((processed / photosToDownload.length) * 100));
        }
      };

      // Process downloads in concurrent batches of 5
      for (let i = 0; i < photosToDownload.length; i += CONCURRENCY) {
        const chunk = photosToDownload.slice(i, i + CONCURRENCY);
        await Promise.all(chunk.map(downloadPhoto));
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const zipFileName = `${session.weddingName ? session.weddingName.replace(/[^a-zA-Z0-9]/g, '_') : 'Mariage'}_Photos.zip`;
      saveAs(content, zipFileName);
    } catch (err) {
      console.error("Erreur génération ZIP ou import des librairies", err);
      alert("Une erreur est survenue lors de la création du ZIP.");
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
      setIsSelectionMode(false);
      setSelectedIds(new Set());
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Galerie de l'événement</h3>
          <p className="text-slate-500">{photos.length} photo{photos.length > 1 ? 's' : ''} partagée{photos.length > 1 ? 's' : ''}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isSelectionMode ? (
            <>
              <button 
                onClick={selectAll}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
              >
                {selectedIds.size === photos.length ? 'Tout désélectionner' : 'Tout sélectionner'}
              </button>
              
              {selectedIds.size > 0 && (
                <>
                  <button 
                    onClick={handleDeleteSelected}
                    className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> Supprimer ({selectedIds.size})
                  </button>
                  <button 
                    onClick={handleDownloadZip}
                    disabled={isDownloading}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {isDownloading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ZIP ({downloadProgress}%)
                      </>
                    ) : (
                      <>
                        <Archive className="w-4 h-4" /> ZIP ({selectedIds.size})
                      </>
                    )}
                  </button>
                </>
              )}

              <button 
                onClick={() => { setIsSelectionMode(false); setSelectedIds(new Set()); }}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-sm font-medium transition-colors"
              >
                Annuler
              </button>
            </>
          ) : (
            <button 
              onClick={() => setIsSelectionMode(true)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <CheckSquare className="w-4 h-4" /> Sélectionner
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo) => (
          <div 
            key={photo.id} 
            onClick={() => {
              if (isSelectionMode) {
                const newSet = new Set(selectedIds);
                if (newSet.has(photo.id)) newSet.delete(photo.id);
                else newSet.add(photo.id);
                setSelectedIds(newSet);
              } else {
                setSelectedPhoto(photo);
              }
            }}
            className={`group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 ${isSelectionMode && selectedIds.has(photo.id) ? 'ring-4 ring-rose-500 ring-offset-2 scale-95' : ''}`}
          >
            {isSelectionMode && (
              <div className="absolute top-2 left-2 z-20">
                {selectedIds.has(photo.id) ? (
                  <CheckSquare className="w-6 h-6 text-rose-500 fill-white" />
                ) : (
                  <Square className="w-6 h-6 text-white drop-shadow-md" />
                )}
              </div>
            )}
            <img 
              src={photo.thumbnailUrl} 
              alt={photo.caption || `Photo de ${photo.guestName}`} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
              <p className="text-white font-medium truncate">{photo.guestName}</p>
              {photo.caption && <p className="text-white/80 text-xs truncate mt-1">{photo.caption}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setSelectedPhoto(null)} />
          
          <button 
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-md transition-all z-10"
          >
            <X className="w-6 h-6" />
          </button>

          <button 
            onClick={(e) => { e.stopPropagation(); navigatePhoto('prev'); }}
            className="absolute left-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-4 z-10 hidden sm:block"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>

          <button 
            onClick={(e) => { e.stopPropagation(); navigatePhoto('next'); }}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-4 z-10 hidden sm:block"
          >
            <ChevronRight className="w-10 h-10" />
          </button>

          <div className="relative z-0 max-w-5xl max-h-[90vh] flex flex-col items-center">
            <img 
              src={selectedPhoto.url} 
              alt={selectedPhoto.caption}
              className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
            />
            <div className="mt-6 text-center">
              <p className="text-white font-bold text-xl mb-1">{selectedPhoto.guestName}</p>
              <p className="text-white/70">{selectedPhoto.caption}</p>
              
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                <a 
                  href={selectedPhoto.url}
                  target="_blank"
                  rel="noreferrer"
                  download={selectedPhoto.name}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-md"
                >
                  <Download className="w-4 h-4" />
                  Télécharger (HD)
                </a>
                
                <button 
                  onClick={() => handleDeleteSingle(selectedPhoto.id)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-red-500/20 hover:bg-red-500/40 text-red-100 rounded-full transition-colors backdrop-blur-md"
                >
                  <Trash2 className="w-4 h-4" />
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
