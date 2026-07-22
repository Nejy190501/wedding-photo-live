import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { doc, getDoc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { WeddingSession, Role, ThemeColor } from '../types';
import { initAuth, googleSignIn, logoutHost, anonymousSignIn, db } from '../firebaseAuth';

interface WeddingContextType {
  role: Role;
  setRole: (role: Role) => void;
  session: WeddingSession;
  setSession: (session: WeddingSession) => void;
  loadingSession: boolean;
  
  hostUser: User | null;
  needsAuth: boolean;
  isLoggingIn: boolean;
  handleHostLogin: () => Promise<void>;
  handleDisconnect: () => Promise<void>;
  updateConfig: (config: Partial<WeddingSession>) => Promise<void>;
}

const WeddingContext = createContext<WeddingContextType | undefined>(undefined);

export const WeddingProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<Role>('landing');
  const [session, setSession] = useState<WeddingSession>({ active: false });
  const [loadingSession, setLoadingSession] = useState(true);

  const [hostUser, setHostUser] = useState<User | null>(null);
  const [needsAuth, setNeedsAuth] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Parse URL role parameter on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roleParam = params.get('role');
    if (roleParam === 'guest') {
      setRole('guest');
    } else if (roleParam === 'host') {
      setRole('host');
    }
  }, []);

  // Listen to Auth State
  useEffect(() => {
    const unsubscribe = initAuth(
      async (user) => {
        setHostUser(user);
        setNeedsAuth(false);
      },
      () => {
        setNeedsAuth(true);
        setHostUser(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // Sync session from Firestore in real-time
  useEffect(() => {
    // Guest needs anonymous login to read/write if Firestore rules require auth
    if (!hostUser && role === 'guest') {
      anonymousSignIn();
    }

    setLoadingSession(true);
    const configDoc = doc(db, 'config', 'main');
    
    const unsubscribe = onSnapshot(configDoc, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSession({
          active: true,
          weddingName: data.weddingName,
          folderName: data.folderName,
          guestGalleryEnabled: data.guestGalleryEnabled,
          themeColor: data.themeColor,
          hostEmail: data.hostEmail,
          hostName: data.hostName,
          moderationEnabled: data.moderationEnabled
        });
      } else {
        setSession({ active: false });
      }
      setLoadingSession(false);
    }, (err) => {
      console.error('Error fetching session:', err);
      setLoadingSession(false);
    });

    return () => unsubscribe();
  }, [hostUser, role]);

  const handleHostLogin = async () => {
    setIsLoggingIn(true);
    try {
      const user = await googleSignIn();
      if (user) {
        setHostUser(user);
        setNeedsAuth(false);
        setRole('host');
      }
    } catch (err) {
      console.error('Login failed:', err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleDisconnect = async () => {
    const confirmed = window.confirm("Êtes-vous sûr de vouloir déconnecter cet album de mariage ? Cela désactivera l'accès.");
    if (!confirmed) return;

    try {
      await updateDoc(doc(db, 'config', 'main'), { active: false });
      await logoutHost();
      setRole('landing');
      alert("Session déconnectée.");
    } catch (err) {
      console.error(err);
    }
  };

  const updateConfig = async (config: Partial<WeddingSession>) => {
    try {
      await setDoc(doc(db, 'config', 'main'), { ...config, active: true }, { merge: true });
    } catch (err) {
      console.error("Error updating config:", err);
      throw err;
    }
  };

  return (
    <WeddingContext.Provider value={{
      role, setRole,
      session, setSession, loadingSession,
      hostUser, needsAuth, isLoggingIn,
      handleHostLogin, handleDisconnect, updateConfig
    }}>
      {children}
    </WeddingContext.Provider>
  );
};

export const useWedding = () => {
  const context = useContext(WeddingContext);
  if (context === undefined) {
    throw new Error('useWedding must be used within a WeddingProvider');
  }
  return context;
};
