import React from "react";
import { Heart, LogOut } from "lucide-react";
import { useWedding } from "../contexts/WeddingContext";
import { THEMES } from "../constants";
import { ThemeColor } from "../types";

export const Header = () => {
  const {
    role,
    setRole,
    session,
    needsAuth,
    isLoggingIn,
    hostUser,
    handleHostLogin,
    handleDisconnect,
  } = useWedding();
  const themeColor: ThemeColor = (session?.themeColor as ThemeColor) || "rose";
  const styles = THEMES[themeColor] || THEMES.rose;

  return (
    <header
      className={`${styles.bg} backdrop-blur-md border-b border-white/20 sticky top-0 z-50 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between print:hidden transition-colors duration-300`}
    >
      <div
        className={`flex items-center gap-2 sm:gap-3 ${role !== "guest" ? "cursor-pointer group" : ""}`}
        onClick={() => role !== "guest" && setRole("landing")}
      >
        <div
          className={`p-1.5 sm:p-2 rounded-xl bg-white/50 ${styles.primary} ${role !== "guest" ? "group-hover:scale-105 transition-transform" : ""} backdrop-blur-sm`}
        >
          <Heart className="w-5 h-5 sm:w-6 sm:h-6 fill-current animate-pulse" />
        </div>
        <div>
          <span className="font-serif text-base sm:text-lg font-bold tracking-tight text-slate-950 block leading-tight transition-colors">
            Wedding Photo Live
          </span>
          <span className="text-[8px] sm:text-[10px] block font-mono text-slate-500 uppercase tracking-widest leading-none mt-0.5 transition-colors">
            Livre d'or instantané
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {role === "landing" && (
          <>
            <button
              onClick={() => setRole("guest")}
              className="text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-2 sm:px-3 py-2"
            >
              <span className="hidden xs:inline">Espace Invités</span>
              <span className="inline xs:hidden">Invités</span>
            </button>
            <button
              onClick={needsAuth ? handleHostLogin : () => setRole("host")}
              className={`text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 rounded-full transition-all ${styles.accent}`}
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                "Connexion..."
              ) : needsAuth ? (
                <>
                  <span className="hidden xs:inline">Espace Mariés</span>
                  <span className="inline xs:hidden">Mariés</span>
                </>
              ) : (
                <>
                  <span className="hidden xs:inline">Mon Tableau de Bord</span>
                  <span className="inline xs:hidden">Tableau</span>
                </>
              )}
            </button>
          </>
        )}

        {role === "host" && (
          <div className="flex items-center gap-1.5 sm:gap-2">
            {hostUser && (
              <div className="hidden md:flex flex-col items-end mr-2">
                <span className="text-xs font-semibold text-slate-800">
                  {hostUser.displayName}
                </span>
                <span className="text-[10px] text-slate-500">
                  {hostUser.email}
                </span>
              </div>
            )}
            <button
              onClick={handleDisconnect}
              title="Déconnecter"
              className="p-1.5 sm:p-2 text-slate-400 hover:text-red-500 transition-colors bg-slate-50 hover:bg-red-50 rounded-full"
            >
              <LogOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setRole("landing")}
              className="text-xs font-semibold uppercase tracking-wider text-slate-600 bg-slate-100 hover:bg-slate-200 px-2.5 sm:px-3 py-1.5 rounded-md transition-all"
            >
              Accueil
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
