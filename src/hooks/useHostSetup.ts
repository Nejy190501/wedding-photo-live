import { useState, ChangeEvent, FormEvent } from 'react';
import { useWedding } from '../contexts/WeddingContext';
import { ThemeColor } from '../types';

export const useHostSetup = () => {
  const { session, updateConfig, hostUser } = useWedding();
  const [formData, setFormData] = useState({
    weddingName: session.weddingName || '',
    weddingDate: session.weddingDate || '',
    folderName: session.folderName || 'Photos de Mariage',
    guestGalleryEnabled: session.guestGalleryEnabled ?? true,
    themeColor: (session.themeColor || 'rose') as ThemeColor,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setIsSubmitting(true);

    try {
      if (!formData.weddingName.trim()) {
        throw new Error('Le nom du mariage est requis');
      }

      await updateConfig({
        weddingName: formData.weddingName,
        weddingDate: formData.weddingDate,
        folderName: formData.folderName,
        guestGalleryEnabled: formData.guestGalleryEnabled,
        themeColor: formData.themeColor,
        hostEmail: hostUser?.email || '',
        hostName: hostUser?.displayName || '',
      });
      
    } catch (err: any) {
      console.error(err);
      setSubmitError(err.message || 'Erreur lors de la configuration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return { formData, isSubmitting, submitError, handleChange, handleSubmit };
};
