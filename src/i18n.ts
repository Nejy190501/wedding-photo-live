export type Language = 'fr' | 'en' | 'de';

export const translations = {
  fr: {
    // GuestSpace
    welcome: "Bienvenue au Mariage de",
    guestbook: "Livre d'or Photo - Espace Invités",
    subtitle: "Flashez, écrivez, partagez vos plus beaux clichés en direct avec les mariés.",
    successTitle: "Photo envoyée ! 🎉",
    successDesc: "Votre souvenir a bien été envoyé et enregistré dans l'album des mariés. Merci !",
    sendAnother: "Envoyer une autre photo",
    firstName: "Votre Prénom / Nom",
    firstNamePlaceholder: "Ex: Tante Sophie",
    messageLabel: "Un petit mot pour les mariés ?",
    optional: "(facultatif)",
    messagePlaceholder: "Félicitations pour ce magnifique mariage ! 🥂",
    photoLabel: "Votre Photo",
    touchToChoose: "Touchez pour choisir",
    takeOrChoose: "Prenez une photo ou choisissez dans votre galerie",
    uploading: "Envoi en cours...",
    sendPhoto: "Envoyer la photo",
    guestGallery: "Galerie des Invités",
    beTheFirst: "Soyez le premier à envoyer une photo !",
    
    // QRCode Tab (Print)
    shareLook: "Partagez votre regard",
    step1: "Scannez le QR Code avec votre téléphone",
    step2: "Prenez ou choisissez des photos de la soirée",
    step3: "Laissez-nous un petit vœu tendre !",
    noAppNeeded: "Aucune application ni inscription requise",
  },
  en: {
    // GuestSpace
    welcome: "Welcome to the Wedding of",
    guestbook: "Photo Guestbook - Guest Area",
    subtitle: "Snap, write, and share your best moments live with the newlyweds.",
    successTitle: "Photo sent! 🎉",
    successDesc: "Your memory has been successfully sent and saved in the couple's album. Thank you!",
    sendAnother: "Send another photo",
    firstName: "Your Name",
    firstNamePlaceholder: "Ex: Aunt Sophie",
    messageLabel: "A little message for the newlyweds?",
    optional: "(optional)",
    messagePlaceholder: "Congratulations on this beautiful wedding! 🥂",
    photoLabel: "Your Photo",
    touchToChoose: "Tap to choose",
    takeOrChoose: "Take a photo or pick from your gallery",
    uploading: "Sending...",
    sendPhoto: "Send photo",
    guestGallery: "Guest Gallery",
    beTheFirst: "Be the first to send a photo!",

    // QRCode Tab (Print)
    shareLook: "Share your perspective",
    step1: "Scan the QR Code with your phone",
    step2: "Take or choose photos from the evening",
    step3: "Leave us a sweet little wish!",
    noAppNeeded: "No app or registration required",
  },
  de: {
    // GuestSpace
    welcome: "Willkommen zur Hochzeit von",
    guestbook: "Foto-Gästebuch - Gästebereich",
    subtitle: "Fotografieren, schreiben und teilen Sie Ihre besten Momente live mit dem Brautpaar.",
    successTitle: "Foto gesendet! 🎉",
    successDesc: "Ihre Erinnerung wurde erfolgreich gesendet und im Album des Paares gespeichert. Danke!",
    sendAnother: "Ein weiteres Foto senden",
    firstName: "Ihr Name",
    firstNamePlaceholder: "Z.B.: Tante Sophie",
    messageLabel: "Eine kleine Nachricht für das Brautpaar?",
    optional: "(optional)",
    messagePlaceholder: "Herzlichen Glückwunsch zu dieser wunderschönen Hochzeit! 🥂",
    photoLabel: "Ihr Foto",
    touchToChoose: "Zum Auswählen tippen",
    takeOrChoose: "Machen Sie ein Foto oder wählen Sie aus Ihrer Galerie",
    uploading: "Wird gesendet...",
    sendPhoto: "Foto senden",
    guestGallery: "Gäste-Galerie",
    beTheFirst: "Seien Sie der Erste, der ein Foto sendet!",

    // QRCode Tab (Print)
    shareLook: "Teilen Sie Ihre Perspektive",
    step1: "Scannen Sie den QR-Code mit Ihrem Handy",
    step2: "Machen oder wählen Sie Fotos vom Abend",
    step3: "Hinterlassen Sie uns einen kleinen Wunsch!",
    noAppNeeded: "Keine App oder Registrierung erforderlich",
  }
};

export const getTranslation = (lang: Language, key: keyof typeof translations['fr']) => {
  return translations[lang][key] || translations['fr'][key];
};
