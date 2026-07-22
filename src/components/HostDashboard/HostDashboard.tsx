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
  const { session } = useWedding();
  const [activeTab, setActiveTab] = useState<ActiveTab>('qr');

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
