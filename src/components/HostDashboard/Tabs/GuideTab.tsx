import React from 'react';
import { BookOpen, MapPin, Monitor, Smartphone, Video } from 'lucide-react';

export const GuideTab = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h3 className="font-serif text-2xl font-bold text-slate-900 mb-2">Guide de l'Animation</h3>
        <p className="text-slate-500 text-sm">Comment organiser cette animation le jour de votre mariage.</p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-md">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-lg text-slate-900 mb-2">1. L'installation en salle (Le jour J)</h4>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              Pour profiter pleinement de l'animation, vous aurez besoin de :
            </p>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-slate-400" /> Un ordinateur portable relié au vidéoprojecteur
              </li>
              <li className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-slate-400" /> Une connexion internet (Wi-Fi de la salle ou partage 4G/5G)
              </li>
              <li className="flex items-center gap-2">
                <Video className="w-4 h-4 text-slate-400" /> Les QR Codes imprimés disposés sur les tables
              </li>
            </ul>
          </div>
        </div>

        <div className="flex items-start gap-4 mb-6">
          <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-lg text-slate-900 mb-2">2. Lancer la magie</h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              Sur l'ordinateur branché au vidéoprojecteur, connectez-vous à cet espace Mariés. Allez dans l'onglet <strong>Diaporama</strong>, et cliquez sur <strong>Plein Écran</strong>. Le diaporama tournera en boucle automatiquement et affichera les nouvelles photos au fur et à mesure qu'elles seront envoyées par vos invités !
            </p>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-sm text-slate-600 leading-relaxed">
        <h4 className="font-serif font-bold text-slate-900 mb-2">💡 Conseil pour l'animateur / DJ</h4>
        <p>
          Demandez à votre DJ ou au maître de cérémonie de faire une petite annonce au début du repas : 
          <br /><br />
          <em className="italic text-slate-500">"Chers invités, au centre de vos tables se trouve un QR Code. Flashez-le avec votre téléphone pour envoyer vos photos de la soirée directement sur l'écran géant, accompagnées d'un petit mot pour les mariés !"</em>
        </p>
      </div>
    </div>
  );
};
