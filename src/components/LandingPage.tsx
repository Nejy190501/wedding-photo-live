import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Camera, Heart, Settings } from 'lucide-react';
import { useWedding } from '../contexts/WeddingContext';

export const LandingPage = () => {
  const { session, needsAuth, isLoggingIn, setRole, handleHostLogin } = useWedding();

  return (
    <div className="max-w-4xl mx-auto py-12 md:py-20 text-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6 inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full border border-slate-100 shadow-sm"
      >
        <Sparkles className="w-4 h-4 text-amber-500" />
        <span className="text-xs font-medium text-slate-600">Le plus beau jour de votre vie en photos</span>
      </motion.div>

      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-4xl md:text-6xl font-serif font-black tracking-tight text-slate-950 mb-6 leading-tight"
      >
        Rassemblez toutes les photos de vos invités <span className="italic text-rose-600 font-normal">en temps réel</span>
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-12 leading-relaxed"
      >
        Les invités flashent un QR Code sur leur table et envoient leurs plus beaux clichés instantanément. Pas d'application à télécharger, aucun compte à créer pour eux. Tout arrive directement dans votre album Cloud en temps réel !
      </motion.p>

      <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-3xl mx-auto text-left">
        {/* Guests side */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-xl flex flex-col justify-between"
        >
          <div>
            <div className="p-3 bg-rose-50 text-rose-600 w-fit rounded-xl mb-6">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-serif text-slate-900 mb-2">Espace Invités</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Vous êtes au mariage ? Prenez ou choisissez vos photos, ajoutez un petit mot tendre pour les mariés, et envoyez !
            </p>
          </div>
          {session.active ? (
            <button 
              onClick={() => setRole('guest')}
              className="w-full text-center bg-rose-600 hover:bg-rose-700 text-white font-medium py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4 fill-current" /> Accéder à l'espace Invité ({session.weddingName})
            </button>
          ) : (
            <button 
              onClick={() => setRole('guest')}
              className="w-full text-center bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium py-3 rounded-xl transition-all"
            >
              Accéder à l'espace Invité (Démo)
            </button>
          )}
        </motion.div>

        {/* Hosts side */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-xl flex flex-col justify-between"
        >
          <div>
            <div className="p-3 bg-indigo-50 text-indigo-600 w-fit rounded-xl mb-6">
              <Settings className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-serif text-slate-900 mb-2">Espace Mariés</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Configurez votre mariage, connectez-vous, générez vos QR Codes de table et projetez le diaporama en temps réel !
            </p>
          </div>
          <button 
            onClick={needsAuth ? handleHostLogin : () => setRole('host')}
            className="w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? 'Connexion en cours...' : (needsAuth ? 'Se connecter avec Google' : 'Accéder au Tableau de Bord')}
          </button>
        </motion.div>
      </div>

      <div className="mt-20">
        <h2 className="text-2xl font-serif font-bold text-slate-900 mb-12 text-center">Comment ça fonctionne ?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-rose-100 text-rose-700 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">1</div>
            <h4 className="font-serif font-bold text-slate-900 mb-2">Générez votre QR Code</h4>
            <p className="text-slate-500 text-sm leading-relaxed">Le couple se connecte, définit le nom du mariage et télécharge le fichier QR code prêt à imprimer pour ses tables.</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-rose-100 text-rose-700 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">2</div>
            <h4 className="font-serif font-bold text-slate-900 mb-2">Les invités partagent</h4>
            <p className="text-slate-500 text-sm leading-relaxed">Aucun compte Google ou application n'est requis pour vos invités. Ils scannent le QR Code, écrivent un vœu et envoient leurs clichés en 3 secondes.</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-rose-100 text-rose-700 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">3</div>
            <h4 className="font-serif font-bold text-slate-900 mb-2">Galerie live & Diaporama</h4>
            <p className="text-slate-500 text-sm leading-relaxed">Toutes les photos sont projetées en temps réel sur l'écran de la salle grâce au Diaporama animé automatique, et archivées à jamais sur votre Drive.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
