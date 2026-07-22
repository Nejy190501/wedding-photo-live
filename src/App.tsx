import React from "react";
import { Heart } from "lucide-react";
import { WeddingProvider, useWedding } from "./contexts/WeddingContext";
import { Header } from "./components/Header";
import { LandingPage } from "./components/LandingPage";
import { GuestSpace } from "./components/GuestSpace";
import { HostDashboard } from "./components/HostDashboard/HostDashboard";
import { THEMES } from "./constants";
import { ThemeColor } from "./types";

const MainContent = () => {
  const { role, session, loadingSession } = useWedding();
  const themeColor: ThemeColor = (session?.themeColor as ThemeColor) || "rose";
  const styles = THEMES[themeColor] || THEMES.rose;

  if (loadingSession) {
    return (
      <div
        className={`min-h-screen ${styles.bg} flex items-center justify-center font-sans`}
      >
        <div className="text-center">
          <Heart
            className={`w-12 h-12 ${styles.primary} mx-auto mb-4 animate-pulse fill-current`}
          />
          <p className={`font-medium ${styles.text}`}>
            Chargement de la magie...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${styles.bg} font-sans selection:bg-rose-200 selection:text-rose-900 transition-colors duration-500`}
    >
      <Header />

      <main className="p-4 sm:p-6 pb-24">
        {role === "landing" && <LandingPage />}
        {role === "guest" && <GuestSpace />}
        {role === "host" && <HostDashboard />}
      </main>

      {/* Footer */}
      {role === "landing" && (
        <footer className="mt-20 pb-8 text-center text-slate-500 text-sm">
          <p>Créé avec ❤️ pour rendre votre journée inoubliable.</p>
          <p className="mt-2 text-xs">
            © {new Date().getFullYear()} Wedding Photo Live - Application PWA
            sécurisée
          </p>
        </footer>
      )}
    </div>
  );
};

function App() {
  return (
    <WeddingProvider>
      <MainContent />
    </WeddingProvider>
  );
}

export default App;
