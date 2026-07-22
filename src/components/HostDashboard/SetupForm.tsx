import React from 'react';
import { Heart, AlertCircle } from 'lucide-react';
import { useHostSetup } from '../../hooks/useHostSetup';
import { THEMES } from '../../constants';
import { ThemeColor } from '../../types';

export const SetupForm = () => {
  const { formData, isSubmitting, submitError, handleChange, handleSubmit } = useHostSetup();

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl border border-slate-100 shadow-xl">
      <div className="text-center mb-8">
        <span className="p-3 bg-rose-50 text-rose-600 rounded-full inline-block mb-3">
          <Heart className="w-8 h-8 fill-current" />
        </span>
        <h2 className="text-2xl font-serif font-bold text-slate-900">Configurez votre Album</h2>
        <p className="text-slate-500 text-sm">Créez votre album sécurisé dans le cloud (Firebase) et donnez vie à votre livre d'or.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {submitError && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{submitError}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Nom de votre mariage</label>
          <input 
            type="text"
            name="weddingName"
            required
            value={formData.weddingName}
            onChange={handleChange}
            placeholder="Ex: Sophie & Julien"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium"
          />
        </div>

        <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
          <input 
            type="checkbox"
            name="guestGalleryEnabled"
            id="guestGallery"
            checked={formData.guestGalleryEnabled}
            onChange={handleChange}
            className="w-5 h-5 rounded text-rose-600 focus:ring-rose-500 border-slate-300 mt-0.5"
          />
          <label htmlFor="guestGallery" className="text-xs text-slate-600 leading-relaxed cursor-pointer">
            <strong>Permettre la Galerie aux invités</strong> : Les invités pourront également voir et défiler les photos envoyées par les autres personnes de la salle sur leur téléphone.
          </label>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">Thème couleur du mariage</label>
          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {(Object.keys(THEMES) as ThemeColor[]).map((col) => {
              const isSelected = formData.themeColor === col;
              let activeClasses = "";
              if (col === 'rose') activeClasses = "border-rose-600 bg-rose-50 text-rose-900 font-bold scale-105";
              else if (col === 'emerald') activeClasses = "border-emerald-700 bg-emerald-50 text-emerald-950 font-bold scale-105";
              else if (col === 'violet') activeClasses = "border-violet-600 bg-violet-50 text-violet-900 font-bold scale-105";
              else if (col === 'amber') activeClasses = "border-amber-600 bg-amber-50 text-amber-900 font-bold scale-105";
              else activeClasses = "border-slate-800 bg-slate-100 text-slate-950 font-bold scale-105";

              return (
                <label
                  key={col}
                  className={`cursor-pointer py-2.5 sm:py-3 rounded-xl font-medium text-[10px] sm:text-xs capitalize border-2 transition-all block text-center ${
                    isSelected ? activeClasses : 'border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  <input 
                    type="radio"
                    name="themeColor"
                    value={col}
                    checked={isSelected}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <div className={`w-3 h-3 rounded-full mx-auto mb-1 ${
                    col === 'rose' ? 'bg-rose-500' :
                    col === 'emerald' ? 'bg-emerald-600' :
                    col === 'violet' ? 'bg-violet-600' :
                    col === 'amber' ? 'bg-amber-500' : 'bg-slate-700'
                  }`} />
                  {col === 'rose' ? 'Rose' :
                   col === 'emerald' ? 'Sage' :
                   col === 'violet' ? 'Lavande' :
                   col === 'amber' ? 'Ambre' : 'Moderne'}
                </label>
              );
            })}
          </div>
        </div>

        <button 
          type="submit"
          className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Configuration en cours..." : "Créer & Lancer l'album"}
        </button>
      </form>
    </div>
  );
};
