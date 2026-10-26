import React, { useState } from 'react';
import { QrCode, Play, Image as ImageIcon, BookOpen, Shield } from 'lucide-react';
import { useWedding } from '../../contexts/WeddingContext';
import { SetupForm } from './SetupForm';
import { QRCodeTab } from './Tabs/QRCodeTab';
import { GalleryTab } from './Tabs/GalleryTab';
import { SlideshowTab } from './Tabs/SlideshowTab';
import { GuideTab } from './Tabs/GuideTab';
import { ModerationTab } from './Tabs/ModerationTab';
import { ActiveTab, ThemeColor } from '../../types';
import { THEMES } from '../../constants';

export const HostDashboard = () => {
  const { session, needsAuth, hostUser, isLoggingIn, handleHostLogin, setRole } = useWedding();
  const [activeTab, setActiveTab] = useState<ActiveTab>('qr');

  if (needsAuth || !hostUser) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-xl text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-inner">
          <Shield className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-slate-900 mb-2">Espace Mariés Sécurisé</h2>
        <p className="text-slate-500 text-sm leading-relaxed mb-8">
          Veuillez vous connecter avec votre compte Google organisateur pour gérer votre album, modérer les photos et projeter le diaporama.
        </p>
        <button
          onClick={handleHostLogin}
          disabled={isLoggingIn}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2"
        >
          {isLoggingIn ? "Connexion en cours..." : "Se connecter avec Google"}
        </button>
        <button
          onClick={() => setRole('landing')}
          className="mt-4 text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors block mx-auto"
        >
          Retour à l'accueil
        </button>
      </div>
    );
  }

  if (!session.active) {
    return <SetupForm />;
  }

  const themeColor: ThemeColor = (session?.themeColor as ThemeColor) || 'rose';
  const styles = THEMES[themeColor] || THEMES.rose;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex overflow-x-auto bg-white rounded-2xl p-2 mb-8 border border-slate-100 shadow-sm print:hidden">
        <button 
          onClick={() => setActiveTab('qr')}
          className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
            activeTab === 'qr' ? `${styles.bg} ${styles.primary} shadow-sm` : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <QrCode className="w-4 h-4" /> <span className="hidden sm:inline">QR Code Table</span><span className="inline sm:hidden">QR</span>
        </button>

        <button 
          onClick={() => setActiveTab('gallery')}
          className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
            activeTab === 'gallery' ? `${styles.bg} ${styles.primary} shadow-sm` : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <ImageIcon className="w-4 h-4" /> <span className="hidden sm:inline">Galerie</span><span className="inline sm:hidden">Galerie</span>
        </button>
        <button 
          onClick={() => setActiveTab('moderation')}
          className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
            activeTab === 'moderation' ? `${styles.bg} ${styles.primary} shadow-sm` : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <Shield className="w-4 h-4" /> <span className="hidden sm:inline">Modération</span><span className="inline sm:hidden">Modération</span>
        </button>
        <button 
          onClick={() => setActiveTab('slideshow')}
          className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
            activeTab === 'slideshow' ? `${styles.bg} ${styles.primary} shadow-sm` : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <Play className="w-4 h-4" /> <span className="hidden sm:inline">Diaporama Live</span><span className="inline sm:hidden">Diaporama</span>
        </button>
        <button 
          onClick={() => setActiveTab('guide')}
          className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
            activeTab === 'guide' ? `${styles.bg} ${styles.primary} shadow-sm` : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-4 h-4" /> <span className="hidden sm:inline">Guide Pratique</span><span className="inline sm:hidden">Guide</span>
        </button>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeTab === 'qr' && <QRCodeTab />}
        {activeTab === 'gallery' && <GalleryTab />}
        {activeTab === 'moderation' && <ModerationTab />}
        {activeTab === 'slideshow' && <SlideshowTab />}
        {activeTab === 'guide' && <GuideTab />}
      </div>
    </div>
  );
};
