import React, { useState, useEffect } from 'react';
import { Play, Pause, Maximize2, Settings, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useWedding } from '../../../contexts/WeddingContext';
import { useGallery } from '../../../hooks/useGallery';

export const SlideshowTab = () => {
  const { session } = useWedding();
  const { photos, isLoading } = useGallery('approved');
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [speed, setSpeed] = useState(4); // seconds

  // Auto-play effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && photos.length > 0) {
      interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % photos.length);
      }, speed * 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, photos.length, speed]);

  // If new photo arrives, jump to it if not playing
  useEffect(() => {
    if (!isPlaying && photos.length > 0 && currentIndex === 0) {
      // By default, index 0 is the newest photo because we order by 'desc'
      setCurrentIndex(0);
    }
  }, [photos.length, isPlaying]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (isLoading && photos.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-12 text-center">
        <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-500 font-medium">Préparation du diaporama...</p>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-16 text-center">
        <h3 className="text-xl font-bold text-slate-800 mb-2">Aucune photo pour l'instant</h3>
        <p className="text-slate-500">Le diaporama démarrera dès que les invités enverront la première photo.</p>
      </div>
    );
  }

  const currentPhoto = photos[currentIndex];

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentPhoto.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {/* Background Blurred Ken Burns Image */}
            <motion.img 
              src={currentPhoto.url} 
              alt="background"
              initial={{ scale: 1.0 }}
              animate={{ scale: 1.2, x: [0, 20], y: [0, -10] }}
              transition={{ duration: speed + 2, ease: "linear" }}
              className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-30"
            />
            
            {/* Main Image with subtle zoom */}
            <motion.img 
              src={currentPhoto.url} 
              alt={currentPhoto.caption}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1.05 }}
              transition={{ duration: speed + 2, ease: "linear" }}
              className="max-w-full max-h-screen object-contain relative z-10 drop-shadow-2xl"
            />

            {/* Cinematic Text Overlay */}
            <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-end p-16 bg-gradient-to-t from-black/90 via-black/30 to-transparent">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 1.2 }}
                className="max-w-5xl"
              >
                <p className="text-white font-serif italic text-5xl mb-4 drop-shadow-lg">{currentPhoto.guestName}</p>
                {currentPhoto.caption && <p className="text-white/90 text-2xl leading-relaxed drop-shadow-md font-light">{currentPhoto.caption}</p>}
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Controls Overlay (appears on hover) */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-end opacity-0 hover:opacity-100 transition-opacity duration-300 z-50">
          <button 
            onClick={toggleFullscreen}
            className="text-white/50 hover:text-white bg-black/50 p-3 rounded-full backdrop-blur-md"
          >
            <Minimize2 className="w-6 h-6" />
          </button>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 z-50">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="text-white bg-black/50 hover:bg-black/70 p-4 rounded-full backdrop-blur-md transition-colors"
          >
            {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Diaporama Live</h3>
          <p className="text-slate-500">Projetez les photos en temps réel sur grand écran</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
            <Settings className="w-4 h-4 text-slate-400" />
            <select 
              value={speed} 
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="bg-transparent text-sm font-medium text-slate-700 outline-none"
            >
              <option value={3}>Rapide (3s)</option>
              <option value={5}>Normal (5s)</option>
              <option value={8}>Lent (8s)</option>
            </select>
          </div>
          
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-sm ${
              isPlaying 
                ? 'bg-amber-100 text-amber-700 hover:bg-amber-200 border border-amber-200' 
                : 'bg-rose-500 text-white hover:bg-rose-600 hover:shadow-md'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? 'Pause' : 'Lecture'}
          </button>
          
          <button 
            onClick={toggleFullscreen}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold flex items-center gap-2 transition-all shadow-md"
          >
            <Maximize2 className="w-4 h-4" />
            Plein Écran
          </button>
        </div>
      </div>

      <div className="bg-black aspect-video rounded-3xl overflow-hidden relative shadow-2xl border-4 border-slate-900 group">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentPhoto.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <motion.img 
              src={currentPhoto.url} 
              alt="background"
              initial={{ scale: 1.0 }}
              animate={{ scale: 1.15, x: [0, 10], y: [0, -5] }}
              transition={{ duration: speed + 2, ease: "linear" }}
              className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-30"
            />
            
            <motion.img 
              src={currentPhoto.url} 
              alt={currentPhoto.caption}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1.02 }}
              transition={{ duration: speed + 2, ease: "linear" }}
              className="w-full h-full object-contain relative z-10"
            />
          </motion.div>
        </AnimatePresence>
        
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        <div className="absolute z-20 bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 opacity-0 group-hover:opacity-100 pointer-events-none">
          <p className="text-white font-serif italic text-2xl mb-1">{currentPhoto.guestName}</p>
          {currentPhoto.caption && <p className="text-white/90 text-sm font-light">{currentPhoto.caption}</p>}
        </div>
      </div>
    </div>
  );
};
