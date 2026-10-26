import React, { useState, useEffect } from "react";
import {
  Heart,
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Camera,
  Languages,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import { useWedding } from "../contexts/WeddingContext";
import { useGuestUpload } from "../hooks/useGuestUpload";
import { useTranslation } from "../hooks/useTranslation";
import { Language } from "../i18n";
import { THEMES } from "../constants";
import { ThemeColor } from "../types";

const MicroSparkleBurst = () => {
  const sparkles = [0, 60, 120, 180, 240, 300];
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20">
      {sparkles.map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const x = Math.cos(rad) * 40;
        const y = Math.sin(rad) * 40;
        return (
          <motion.div
            key={i}
            initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
            animate={{ x, y, scale: [0, 1.2, 0], opacity: [1, 0.8, 0] }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute w-2 h-2 rounded-full bg-rose-400"
          />
        );
      })}
    </div>
  );
};

const ElegantSuccessBadge = () => {
  return (
    <div className="relative w-20 h-20 mx-auto flex items-center justify-center mb-2">
      {/* Soft ambient blur ring */}
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.6, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 rounded-full bg-gradient-to-tr from-rose-200 to-pink-200 blur-lg"
      />
      {/* Outer subtle gradient ring */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 20 }}
        className="relative w-18 h-18 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 p-0.5 shadow-xl shadow-rose-500/20 flex items-center justify-center"
      >
        <div className="w-full h-full rounded-full bg-white flex items-center justify-center shadow-inner">
          <svg className="w-9 h-9 text-rose-500" viewBox="0 0 24 24" fill="none">
            <motion.path
              d="M5 13l4 4L19 7"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.4, ease: "easeOut" }}
            />
          </svg>
        </div>
      </motion.div>
      {/* Delicate sparkle accent */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        className="absolute -top-1 -right-1 text-amber-400"
      >
        <Sparkles className="w-5 h-5 fill-amber-300 drop-shadow-sm" />
      </motion.div>
    </div>
  );
};

export const GuestSpace = () => {
  const [hasSelectedLang, setHasSelectedLang] = React.useState(false);
  const { session } = useWedding();
  const themeColor: ThemeColor = (session?.themeColor as ThemeColor) || "rose";
  const styles = THEMES[themeColor] || THEMES.rose;

  const { lang, setLang, t } = useTranslation();

  const [greetingIdx, setGreetingIdx] = useState(0);
  const [selectingLang, setSelectingLang] = useState<string | null>(null);

  const {
    guestName,
    setGuestName,
    photos: selectedPhotos,
    photoItems,
    handlePhotoSelect,
    removePhoto,
    message,
    setMessage,
    isUploading,
    uploadProgress,
    uploadStatus,
    errorMessage,
    handleUpload,
    resetUpload,
  } = useGuestUpload(session?.moderationEnabled || false);

  useEffect(() => {
    if (uploadStatus === "success") {
      // Elegant soft harmonic chime
      try {
        const AudioContext =
          window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContext();

        [587.33, 880].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gainNode = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, ctx.currentTime);

          gainNode.gain.setValueAtTime(0, ctx.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.04 - idx * 0.015, ctx.currentTime + 0.04);
          gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);

          osc.connect(gainNode);
          gainNode.connect(ctx.destination);

          osc.start(ctx.currentTime + idx * 0.04);
          osc.stop(ctx.currentTime + 0.6);
        });
      } catch (e) {
        // Ignore audio errors
      }

      // Smooth subtle haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate([35, 20, 35]);
      }

      // Elegant Pinterest/Instagram-style micro-confetti shimmer (single soft champagne-rose burst)
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.55 },
        colors: ["#fda4af", "#f43f5e", "#fb7185", "#fde047", "#fbcfe8"],
        ticks: 90,
        gravity: 0.9,
        scalar: 0.8,
        shapes: ["circle"],
        zIndex: 9999,
      });

      const timer = setTimeout(() => {
        confetti({
          particleCount: 16,
          angle: 90,
          spread: 70,
          origin: { y: 0.58 },
          colors: ["#fda4af", "#f43f5e", "#fef08a"],
          ticks: 80,
          gravity: 0.75,
          scalar: 0.65,
          shapes: ["circle"],
          zIndex: 9999,
        });
      }, 160);

      return () => clearTimeout(timer);
    }
  }, [uploadStatus]);

  useEffect(() => {
    if (!hasSelectedLang) {
      const interval = setInterval(() => {
        setGreetingIdx((prev) => (prev + 1) % 3);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [hasSelectedLang]);

  const handleLanguageSelect = (langId: Language) => {
    setSelectingLang(langId);
    setLang(langId);
    setTimeout(() => {
      setHasSelectedLang(true);
    }, 800);
  };

  if (!hasSelectedLang) {
    // Liste enrichie d'émojis de mariage pour l'animation
    const floatingEmojis = [
      {
        emoji: "✨",
        left: "10%",
        top: "15%",
        delay: 0,
        duration: 4,
        size: "text-3xl",
      },
      {
        emoji: "🥂",
        left: "80%",
        top: "25%",
        delay: 1,
        duration: 5,
        size: "text-5xl",
      },
      {
        emoji: "📸",
        left: "15%",
        top: "70%",
        delay: 2,
        duration: 6,
        size: "text-5xl",
      },
      {
        emoji: "🎉",
        left: "85%",
        top: "80%",
        delay: 0.5,
        duration: 4.5,
        size: "text-4xl",
      },
      {
        emoji: "💖",
        left: "5%",
        top: "45%",
        delay: 1.5,
        duration: 3.5,
        size: "text-3xl",
      },
      {
        emoji: "💍",
        left: "70%",
        top: "10%",
        delay: 2.5,
        duration: 5.5,
        size: "text-4xl",
      },
      {
        emoji: "🕊️",
        left: "30%",
        top: "5%",
        delay: 0.8,
        duration: 4.8,
        size: "text-3xl",
      },
      {
        emoji: "🌸",
        left: "90%",
        top: "50%",
        delay: 1.2,
        duration: 4.2,
        size: "text-4xl",
      },
      {
        emoji: "🎶",
        left: "25%",
        top: "85%",
        delay: 3,
        duration: 5,
        size: "text-3xl",
      },
      {
        emoji: "💃",
        left: "60%",
        top: "90%",
        delay: 1.8,
        duration: 6,
        size: "text-5xl",
      },
      {
        emoji: "🕺",
        left: "40%",
        top: "12%",
        delay: 0.3,
        duration: 5.2,
        size: "text-4xl",
      },
      {
        emoji: "💐",
        left: "95%",
        top: "35%",
        delay: 2.2,
        duration: 4.5,
        size: "text-3xl",
      },
      {
        emoji: "🎂",
        left: "5%",
        top: "95%",
        delay: 1.1,
        duration: 5.8,
        size: "text-4xl",
      },
      {
        emoji: "✨",
        left: "50%",
        top: "75%",
        delay: 0.7,
        duration: 3.8,
        size: "text-2xl",
      },
    ];

    return (
      <div className="max-w-md mx-auto min-h-[75vh] flex flex-col items-center justify-center relative px-4 overflow-hidden">
        {/* Floating Emojis Background */}
        <div className="absolute inset-0 pointer-events-none">
          {floatingEmojis.map((item, i) => (
            <motion.div
              key={i}
              initial={{ y: 0, opacity: 0 }}
              animate={{
                y: [0, -30, 0],
                x: [0, i % 2 === 0 ? 15 : -15, 0],
                rotate: [0, i % 3 === 0 ? 15 : -15, 0],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: item.duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: item.delay,
              }}
              className={`absolute ${item.size} drop-shadow-sm`}
              style={{ left: item.left, top: item.top }}
            >
              {item.emoji}
            </motion.div>
          ))}
        </div>

        <div className="absolute inset-0 bg-gradient-to-tr from-rose-100/40 via-white/20 to-pink-50/40 rounded-full blur-3xl animate-pulse-glow -z-10" />

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="text-center space-y-4 mb-12 relative z-10 w-full"
        >
          <div className="relative inline-block">
            <div
              className={`absolute inset-0 bg-rose-200 rounded-full blur-xl animate-pulse-glow`}
            />
            <Languages
              className={`w-16 h-16 ${styles.primary} relative z-10 animate-pulse`}
            />
          </div>

          <div className="h-16 flex items-center justify-center relative mt-4">
            <AnimatePresence mode="wait">
              <motion.h2
                key={greetingIdx}
                initial={{ y: 20, opacity: 0, filter: "blur(4px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                exit={{ y: -20, opacity: 0, filter: "blur(4px)" }}
                transition={{ duration: 0.4 }}
                className="font-serif text-5xl font-bold text-slate-900 tracking-tight drop-shadow-sm absolute"
              >
                {["Bienvenue", "Welcome", "Willkommen"][greetingIdx]}
              </motion.h2>
            </AnimatePresence>
          </div>

          <p className="text-slate-500 text-base font-medium bg-white/50 backdrop-blur-sm p-4 rounded-2xl shadow-sm border border-white/60 mx-auto max-w-[280px]">
            Veuillez choisir votre langue
            <br />
            <span className="text-slate-400">Choose your language</span>
            <br />
            <span className="text-slate-400">Wählen Sie Ihre Sprache</span>
          </p>
        </motion.div>

        <div className="flex items-center justify-center gap-4 w-full max-w-md relative z-10">
          {[
            { id: "fr", emoji: "🇫🇷", label: "Français" },
            { id: "en", emoji: "🇬🇧", label: "English" },
            { id: "de", emoji: "🇩🇪", label: "Deutsch" },
          ].map((item, index) => {
            const isSelected = selectingLang === item.id;
            const isOtherSelected =
              selectingLang !== null && selectingLang !== item.id;

            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{
                  opacity: isOtherSelected ? 0.3 : 1,
                  y: isSelected ? -10 : 0,
                  scale: isSelected ? 1.1 : 1,
                }}
                transition={{
                  duration: 0.4,
                  delay: selectingLang ? 0 : 0.2 + index * 0.1,
                }}
                whileHover={!selectingLang ? { scale: 1.05, y: -4 } : {}}
                whileTap={!selectingLang ? { scale: 0.95 } : {}}
                onClick={() =>
                  !selectingLang && handleLanguageSelect(item.id as Language)
                }
                className={`flex flex-col items-center justify-center gap-3 flex-1 aspect-square p-2 sm:p-4 backdrop-blur-md rounded-3xl border-2 shadow-xl transition-all group overflow-hidden relative ${
                  isSelected
                    ? "bg-rose-100 border-rose-400 shadow-rose-200/50 ring-4 ring-rose-100"
                    : "bg-white/90 border-white shadow-rose-100/40 hover:border-rose-300 hover:bg-rose-50/80"
                }`}
              >
                {isSelected && <MicroSparkleBurst />}

                {isSelected && (
                  <motion.div
                    layoutId="highlight"
                    className="absolute inset-0 bg-gradient-to-tr from-rose-200/50 to-pink-100/50"
                  />
                )}

                {/* Glossy sheen effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-tr from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-in-out" />

                <div
                  className={`text-4xl sm:text-5xl transition-transform drop-shadow-md relative z-10 ${
                    isSelected
                      ? "scale-125 -translate-y-1"
                      : "group-hover:scale-110 group-hover:rotate-6"
                  }`}
                >
                  {item.emoji}
                </div>
                <span
                  className={`font-bold tracking-wide relative z-10 ${
                    isSelected
                      ? "text-rose-600 text-base sm:text-lg"
                      : "text-slate-700 text-sm sm:text-base"
                  }`}
                >
                  {item.label}
                </span>

                {isSelected && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0, rotate: -180 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    transition={{ type: "spring", bounce: 0.6, delay: 0.2 }}
                    className="absolute top-2 right-2 bg-green-500 rounded-full text-white p-1 shadow-lg"
                  >
                    <CheckCircle className="w-5 h-5" />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto relative">
      {/* Language Switcher */}
      <div className="absolute top-0 right-0 flex gap-2">
        {(["fr", "en", "de"] as Language[]).map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`w-8 h-8 rounded-full border-2 transition-all ${lang === l ? "border-rose-500 shadow-md scale-110" : "border-transparent opacity-60 hover:opacity-100"}`}
          >
            {l === "fr" ? "🇫🇷" : l === "en" ? "🇬🇧" : "🇩🇪"}
          </button>
        ))}
      </div>

      <div className="text-center mb-8 mt-12">
        <span
          className={`p-2 rounded-full ${styles.primary} bg-rose-50 inline-block mb-3`}
        >
          <Heart className="w-6 h-6 fill-current animate-pulse" />
        </span>
        <h2 className="font-serif text-2xl font-bold text-slate-900 leading-tight transition-colors">
          {session.active
            ? `${t("welcome")} ${session.weddingName} !`
            : t("guestbook")}
        </h2>
        <p className="text-slate-500 text-xs mt-1 transition-colors">
          {t("subtitle")}
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white/80 backdrop-blur-xl p-6 sm:p-8 rounded-[2rem] border border-white/50 shadow-2xl shadow-rose-900/5 mb-8 relative overflow-hidden transition-colors"
      >
        {/* Subtle decorative glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-rose-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-pink-200/40 rounded-full blur-3xl pointer-events-none" />

        {uploadStatus === "success" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-center py-8 px-2 space-y-5 relative z-10"
          >
            <ElegantSuccessBadge />

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.4 }}
              className="space-y-1.5"
            >
              <h3 className="text-2xl font-bold font-serif text-slate-900 transition-colors">
                {t("successTitle") || "Merci beaucoup !"}
              </h3>
              <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed transition-colors">
                {t("successDesc") ||
                  "Vos photos ont été ajoutées avec succès au livre d'or."}
              </p>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                const form = document.querySelector("form");
                if (form) form.reset();
                resetUpload();
              }}
              className={`mt-3 px-7 py-3.5 rounded-2xl text-sm font-bold shadow-md hover:shadow-lg transition-all ${styles.accent} flex items-center justify-center gap-2 mx-auto`}
            >
              <Camera className="w-4 h-4" />
              {t("sendAnother") || "Envoyer d'autres photos"}
            </motion.button>
          </motion.div>
        ) : (
          <form onSubmit={handleUpload} className="space-y-6 relative z-10">
            {uploadStatus === "error" && errorMessage && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 ml-1 transition-colors">
                {t("firstName")}
              </label>
              <input
                type="text"
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder={t("firstNamePlaceholder")}
                className="w-full px-5 py-4 rounded-2xl bg-white/50 border border-slate-200/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 font-medium text-slate-700 shadow-inner transition-all placeholder:text-slate-400 "
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 ml-1 transition-colors">
                {t("messageLabel")}{" "}
                <span className="text-slate-400 font-normal lowercase transition-colors">
                  {t("optional")}
                </span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t("messagePlaceholder")}
                rows={2}
                className="w-full px-5 py-4 rounded-2xl bg-white/50 border border-slate-200/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 font-medium text-slate-700 shadow-inner transition-all placeholder:text-slate-400 resize-none"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 ml-1 transition-colors">
                {t("photoLabel")}
              </label>
              <div className="border-2 border-dashed border-rose-200/60 rounded-3xl p-8 text-center hover:bg-rose-50/50 hover:border-rose-400 transition-all group relative overflow-hidden bg-white/40 backdrop-blur-sm shadow-sm cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  disabled={isUploading}
                />
                <div className="flex flex-col items-center gap-3 relative z-10">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`p-4 rounded-2xl bg-gradient-to-tr from-rose-100 to-rose-50 ${styles.primary} shadow-sm group-hover:shadow-md transition-all`}
                  >
                    <Upload className="w-7 h-7" />
                  </motion.div>
                  <div>
                    <span
                      className={`font-bold ${styles.primary} text-base transition-colors`}
                    >
                      {t("touchToChoose")}
                    </span>
                    <p className="text-xs text-slate-400 mt-1.5 font-medium transition-colors">
                      {t("takeOrChoose")}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {photoItems.length > 0 && (
              <motion.div
                layout
                className="grid grid-cols-3 gap-3"
              >
                <AnimatePresence mode="popLayout">
                  {photoItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{
                        opacity: 0,
                        scale: 0.6,
                        transition: { duration: 0.2, ease: "easeOut" }
                      }}
                      transition={{
                        layout: { type: "spring", stiffness: 380, damping: 28 },
                        opacity: { duration: 0.2 },
                        scale: { duration: 0.2 }
                      }}
                      className="relative aspect-square rounded-2xl overflow-hidden border-2 border-white shadow-md group bg-slate-100 ring-1 ring-slate-900/5"
                    >
                      <img
                        src={item.previewUrl}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />

                      {!isUploading && (
                        <motion.button
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.85 }}
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            removePhoto(item.id);
                          }}
                          className="absolute top-1.5 right-1.5 bg-black/60 hover:bg-rose-500 text-white rounded-full p-1.5 backdrop-blur-md transition-all z-10 shadow-md active:scale-90"
                          aria-label="Supprimer la photo"
                        >
                          <X className="w-3.5 h-3.5 stroke-[2.5]" />
                        </motion.button>
                      )}

                      {isUploading && (
                        <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex flex-col items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-2 border-rose-200 border-t-rose-600 mb-1" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {photoItems.length > 0 && isUploading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden shadow-inner"
              >
                <div
                  className="bg-gradient-to-r from-rose-400 to-rose-600 h-full transition-all duration-300 relative"
                  style={{ width: `${uploadProgress}%` }}
                >
                  <div className="absolute top-0 right-0 bottom-0 w-10 bg-gradient-to-r from-transparent to-white/50 animate-pulse" />
                </div>
              </motion.div>
            )}

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={
                !(isUploading || photoItems.length === 0)
                  ? { scale: 1.02 }
                  : {}
              }
              whileTap={
                !(isUploading || photoItems.length === 0)
                  ? { scale: 0.98 }
                  : {}
              }
              type="submit"
              disabled={isUploading || photoItems.length === 0}
              className={`w-full py-4 rounded-2xl font-bold text-white shadow-xl transition-all flex items-center justify-center gap-2 overflow-hidden relative ${
                isUploading || photoItems.length === 0
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                  : "bg-gradient-to-r from-rose-500 to-pink-600 hover:shadow-rose-500/30"
              }`}
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white" />
                  <span className="tracking-wide">
                    {t("uploading")} {Math.round(uploadProgress)}%
                  </span>
                </>
              ) : (
                <>
                  <div className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity" />
                  <Upload className="w-5 h-5 relative z-10" />
                  <span className="tracking-wide relative z-10">
                    Envoyer{" "}
                    {photoItems.length > 1
                      ? `(${photoItems.length})`
                      : ""}
                  </span>
                </>
              )}
            </motion.button>
          </form>
        )}
      </motion.div>
    </div>
  );
};
