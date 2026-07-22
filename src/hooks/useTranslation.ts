import { useState, useEffect } from 'react';
import { Language, getTranslation } from '../i18n';

export const useTranslation = () => {
  const [lang, setLang] = useState<Language>('fr');

  useEffect(() => {
    // Auto-detect browser language on mount
    const browserLang = navigator.language.slice(0, 2);
    if (browserLang === 'en') setLang('en');
    else if (browserLang === 'de') setLang('de');
    else setLang('fr');
  }, []);

  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(lang, key);

  return { lang, setLang, t };
};
