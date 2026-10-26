import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Printer, Info } from 'lucide-react';
import { useWedding } from '../../../contexts/WeddingContext';
import { useTranslation } from '../../../hooks/useTranslation';
import { Language } from '../../../i18n';
import { translations } from '../../../i18n';

export const QRCodeTab = () => {
  const { session } = useWedding();
  const { lang, setLang, t } = useTranslation();
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [publicUrl, setPublicUrl] = useState('');
  const [isMultilingual, setIsMultilingual] = useState(false);

  useEffect(() => {
    setPublicUrl(window.location.origin);
  }, []);

  useEffect(() => {
    if (session.active && publicUrl) {
      const cleanUrl = publicUrl.replace(/\/$/, '');
      const guestUrl = `${cleanUrl}?role=guest`;
      
      QRCode.toDataURL(guestUrl, {
        width: 350,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        }
      })
      .then(setQrCodeUrl)
      .catch(err => console.error('QR code generation error:', err));
    }
  }, [session, publicUrl]);

  const handleLanguageSelect = (printLang: Language | 'multi') => {
    if (printLang === 'multi') {
      setIsMultilingual(true);
    } else {
      setIsMultilingual(false);
      setLang(printLang);
    }
  };

  const executePrint = () => {
    window.print();
  };

  return (
    <div className="grid md:grid-cols-12 gap-8 items-start">
      <div className="md:col-span-8 bg-white p-6 sm:p-12 rounded-3xl border border-slate-100 shadow-xl max-w-lg mx-auto text-center relative overflow-hidden print:fixed print:inset-0 print:flex print:flex-col print:items-center print:justify-center print:bg-white print:z-50 print:p-12 print:border-none print:shadow-none print:max-w-none print:rounded-none" id="print-area">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-400 to-pink-500 print:hidden" />
        
        <div className="font-serif italic text-rose-500 text-lg mb-2">
          {isMultilingual ? (
            <div className="flex flex-col gap-1">
              <span>{translations.fr.shareLook}</span>
              <span className="text-sm opacity-80">{translations.en.shareLook} • {translations.de.shareLook}</span>
            </div>
          ) : t('shareLook')}
        </div>
        <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-2">{session.weddingName}</h3>
        {session.weddingDate && (
          <p className="font-serif italic text-slate-500 mb-8 text-lg sm:text-xl print:text-2xl">{session.weddingDate}</p>
        )}
        
        <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl w-fit max-w-full mx-auto mb-8 border border-slate-100 shadow-inner">
          {qrCodeUrl ? (
            <img src={qrCodeUrl} alt="Wedding QR Code" className="w-48 h-48 sm:w-64 sm:h-64 print:w-80 print:h-80 mx-auto object-contain" />
          ) : (
            <div className="w-48 h-48 sm:w-64 sm:h-64 print:w-80 print:h-80 flex items-center justify-center font-mono text-xs text-slate-400">Génération...</div>
          )}
        </div>

        <div className="text-slate-800 text-sm max-w-xs mx-auto space-y-4 mb-8 print:max-w-md print:text-lg print:space-y-6">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 shrink-0 mt-0.5 rounded-full bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center font-bold text-xs">1</span>
            {isMultilingual ? (
              <div className="flex flex-col text-left gap-1">
                <span className="font-medium">{translations.fr.step1}</span>
                <span className="text-slate-500 italic text-sm">{translations.en.step1}</span>
                <span className="text-slate-500 italic text-sm">{translations.de.step1}</span>
              </div>
            ) : (
              <span className="font-medium text-left">{t('step1')}</span>
            )}
          </div>
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 shrink-0 mt-0.5 rounded-full bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center font-bold text-xs">2</span>
            {isMultilingual ? (
              <div className="flex flex-col text-left gap-1">
                <span className="font-medium">{translations.fr.step2}</span>
                <span className="text-slate-500 italic text-sm">{translations.en.step2}</span>
                <span className="text-slate-500 italic text-sm">{translations.de.step2}</span>
              </div>
            ) : (
              <span className="font-medium text-left">{t('step2')}</span>
            )}
          </div>
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 shrink-0 mt-0.5 rounded-full bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center font-bold text-xs">3</span>
            {isMultilingual ? (
              <div className="flex flex-col text-left gap-1">
                <span className="font-medium">{translations.fr.step3}</span>
                <span className="text-slate-500 italic text-sm">{translations.en.step3}</span>
                <span className="text-slate-500 italic text-sm">{translations.de.step3}</span>
              </div>
            ) : (
              <span className="font-medium text-left">{t('step3')}</span>
            )}
          </div>
        </div>

        <div className="text-[11px] font-mono text-slate-400 mt-6 tracking-wide border-t pt-6 uppercase print:text-sm print:mt-12 print:pt-8 flex flex-col gap-1">
          {isMultilingual ? (
            <>
              <span>{translations.fr.noAppNeeded}</span>
              <span>{translations.en.noAppNeeded}</span>
              <span>{translations.de.noAppNeeded}</span>
            </>
          ) : (
            t('noAppNeeded')
          )}
        </div>
      </div>

      <div className="md:col-span-4 space-y-6 print:hidden">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md">
          <h4 className="font-serif font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
            <Printer className="w-5 h-5 text-slate-600" /> Options d'impression
          </h4>
          <p className="text-slate-500 text-xs mb-6 leading-relaxed">
            Imprimez ce QR code sur de jolies cartes ou des chevalets de table. Vos invités pourront flasher le code en toute discrétion depuis leur place.
          </p>
          
          <div className="space-y-6">
            {/* Step 1 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-900 text-white text-xs font-bold">1</span>
                <span className="text-sm font-bold text-slate-800">Choisissez la langue</span>
              </div>
              
              <div className="space-y-3">
                <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-1">
                  <button 
                    onClick={() => handleLanguageSelect('fr')}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${!isMultilingual && lang === 'fr' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                  >
                    <span className="text-base">🇫🇷</span> FR
                  </button>
                  <button 
                    onClick={() => handleLanguageSelect('en')}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${!isMultilingual && lang === 'en' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                  >
                    <span className="text-base">🇬🇧</span> EN
                  </button>
                  <button 
                    onClick={() => handleLanguageSelect('de')}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${!isMultilingual && lang === 'de' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                  >
                    <span className="text-base">🇩🇪</span> DE
                  </button>
                </div>

                <button 
                  onClick={() => handleLanguageSelect('multi')}
                  className={`w-full py-3 rounded-2xl text-sm font-bold transition-all border-2 flex items-center justify-center gap-2 ${
                    isMultilingual 
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm' 
                      : 'border-slate-100 bg-white hover:border-indigo-200 hover:bg-indigo-50/30 text-slate-600'
                  }`}
                >
                  🌍 Version Multilingue (FR, EN, DE)
                </button>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

            {/* Step 2 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-900 text-white text-xs font-bold">2</span>
                <span className="text-sm font-bold text-slate-800">C'est prêt !</span>
              </div>
              <button 
                onClick={executePrint}
                className="w-full bg-slate-900 hover:bg-black text-white font-bold py-4 rounded-2xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
              >
                <Printer className="w-5 h-5 group-hover:scale-110 transition-transform" /> Lancer l'impression
              </button>
            </div>
          </div>
        </div>

        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 shadow-md">
          <h4 className="font-serif font-bold text-lg text-emerald-900 mb-2 flex items-center gap-2">
            <Info className="w-5 h-5 text-emerald-500" /> Toujours en ligne
          </h4>
          <p className="text-emerald-700 text-xs leading-relaxed">
            Votre application est hébergée dans le Cloud (Firebase). L'adresse de ce QR Code est permanente, vous pouvez l'imprimer sans crainte !
          </p>
        </div>
      </div>
    </div>
  );
};
