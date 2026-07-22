import React, { useState } from 'react';
import { Camera, Shield, ShieldCheck, Check, X as XIcon, Trash2, CheckSquare, Square } from 'lucide-react';
import { useWedding } from '../../../contexts/WeddingContext';
import { useGallery, Photo } from '../../../hooks/useGallery';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebaseAuth';

export const ModerationTab = () => {
  const { session, updateConfig } = useWedding();
  const { photos, isLoading, error } = useGallery('pending');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleToggleModeration = async () => {
    await updateConfig({ moderationEnabled: !session.moderationEnabled });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-12 text-center">
        <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-500 font-medium">Chargement de la modération...</p>
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

  const selectAll = () => {
    if (selectedIds.size === photos.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(photos.map(p => p.id)));
    }
  };

  const handleApproveSelected = async () => {
    if (!window.confirm(`Valider ces ${selectedIds.size} photo(s) pour le diaporama ?`)) return;
    for (const id of Array.from(selectedIds)) {
      try {
        await updateDoc(doc(db, 'photos', id), { status: 'approved' });
      } catch (err) {}
    }
    setSelectedIds(new Set());
    setIsSelectionMode(false);
  };

  const handleDeleteSelected = async () => {
    if (!window.confirm(`Rejeter et supprimer ces ${selectedIds.size} photo(s) ?`)) return;
    for (const id of Array.from(selectedIds)) {
      try {
        await deleteDoc(doc(db, 'photos', id));
      } catch (err) {}
    }
    setSelectedIds(new Set());
    setIsSelectionMode(false);
  };

  const handleApproveSingle = async (photoId: string) => {
    try {
      await updateDoc(doc(db, 'photos', photoId), { status: 'approved' });
      setSelectedPhoto(null);
    } catch (err) {}
  };

  const handleDeleteSingle = async (photoId: string) => {
    if (!window.confirm("Voulez-vous vraiment rejeter cette photo ?")) return;
    try {
      await deleteDoc(doc(db, 'photos', photoId));
      setSelectedPhoto(null);
    } catch (err) {}
  };

  return (
    <div className="space-y-6">
      <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-indigo-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-500" />
            Mode Modération
          </h3>
          <p className="text-sm text-indigo-700 mt-1">
            Si activé, les photos des invités devront être validées ici avant d'apparaître sur le diaporama et la galerie publique.
          </p>
        </div>
        <button
          onClick={handleToggleModeration}
          className={`px-5 py-3 rounded-xl font-bold transition-all whitespace-nowrap shadow-sm flex items-center gap-2 ${
            session.moderationEnabled 
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
              : 'bg-white hover:bg-slate-50 text-indigo-700 border-2 border-indigo-200'
          }`}
        >
          {session.moderationEnabled ? (
            <><ShieldCheck className="w-5 h-5" /> Désactiver la Modération</>
          ) : (
            <><Shield className="w-5 h-5" /> Activer la Modération</>
          )}
        </button>
      </div>

      {!session.moderationEnabled ? (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-16 text-center opacity-70">
          <Shield className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-800 mb-2">La modération est inactive</h3>
          <p className="text-slate-500">Toutes les photos envoyées par les invités s'affichent automatiquement.</p>
        </div>
      ) : photos.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-16 text-center">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Aucune photo en attente</h3>
          <p className="text-slate-500">Toutes les photos ont été traitées !</p>
        </div>
      ) : (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-2xl font-bold text-slate-900">En attente de validation</h3>
              <p className="text-slate-500">{photos.length} photo(s) à traiter</p>
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
                        onClick={handleApproveSelected}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                      >
                        <Check className="w-4 h-4" /> Valider ({selectedIds.size})
                      </button>
                      <button 
                        onClick={handleDeleteSelected}
                        className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" /> Rejeter ({selectedIds.size})
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
                  <CheckSquare className="w-4 h-4" /> Sélection multiple
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
                className={`group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 ${isSelectionMode && selectedIds.has(photo.id) ? 'ring-4 ring-indigo-500 ring-offset-2 scale-95' : ''}`}
              >
                {isSelectionMode && (
                  <div className="absolute top-2 left-2 z-20">
                    {selectedIds.has(photo.id) ? (
                      <CheckSquare className="w-6 h-6 text-indigo-500 fill-white" />
                    ) : (
                      <Square className="w-6 h-6 text-white drop-shadow-md" />
                    )}
                  </div>
                )}
                {!isSelectionMode && (
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent flex justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <button onClick={(e) => { e.stopPropagation(); handleApproveSingle(photo.id); }} className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-full">
                      <Check className="w-5 h-5" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteSingle(photo.id); }} className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full">
                      <XIcon className="w-5 h-5" />
                    </button>
                  </div>
                )}
                <img 
                  src={photo.thumbnailUrl} 
                  alt={photo.caption || `Photo`} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute top-0 inset-x-0 bg-gradient-to-b from-black/50 to-transparent p-3">
                  <p className="text-white font-medium text-sm truncate">{photo.guestName}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Lightbox pour la modération */}
          {selectedPhoto && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
              <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setSelectedPhoto(null)} />
              <div className="relative z-10 w-full max-w-5xl max-h-full flex flex-col bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                <div className="flex items-center justify-between p-4 bg-black/40 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                      <Shield className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">À valider</p>
                      <p className="text-slate-400 text-xs">Par {selectedPhoto.guestName}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedPhoto(null)} className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                    <XIcon className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="flex-1 min-h-0 relative bg-black/20 flex items-center justify-center p-4">
                  <img src={selectedPhoto.url} alt={selectedPhoto.caption} className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl" />
                </div>
                
                <div className="p-6 bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex-1">
                    {selectedPhoto.caption && (
                      <p className="text-white/90 text-lg mb-1">"{selectedPhoto.caption}"</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button 
                      onClick={() => handleDeleteSingle(selectedPhoto.id)}
                      className="flex-1 sm:flex-none px-6 py-3 bg-slate-800 hover:bg-red-500/20 text-red-400 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                    >
                      <XIcon className="w-5 h-5" /> Rejeter
                    </button>
                    <button 
                      onClick={() => handleApproveSingle(selectedPhoto.id)}
                      className="flex-1 sm:flex-none px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                    >
                      <Check className="w-5 h-5" /> Valider
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
