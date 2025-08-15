"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInAnonymously,
  setPersistence,
  browserLocalPersistence,
  signOut as firebaseSignOut,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  User,
} from "firebase/auth";
import { auth } from "@/lib/auth";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  signInWithEmail: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const setupAuth = async () => {
      try {
        await setPersistence(auth, browserLocalPersistence);

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          try {
            if (firebaseUser) {
              setUser(firebaseUser);
            } else if (process.env.NEXT_PUBLIC_ALLOW_ANONYMOUS === "true") {
              const result = await signInAnonymously(auth);
              setUser(result.user);
            } else {
              setUser(null);
            }
          } catch (err) {
            console.error("Error during anonymous sign-in:", err);
          } finally {
            setLoading(false);
          }
        });

        return unsubscribe;
      } catch (err) {
        console.error("Auth setup error:", err);
        setLoading(false);
      }
    };

    const unsubscribePromise = setupAuth();

    return () => {
      unsubscribePromise.then((unsubscribe) => {
        if (typeof unsubscribe === "function") unsubscribe();
      });
    };
  }, []);

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUser(null);
  };

  const signInWithEmail = async (email: string, password: string) => {
    const result = await firebaseSignInWithEmailAndPassword(
      auth,
      email,
      password
    );
    setUser(result.user);
  };

  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{ user, loading: false, signOut, signInWithEmail }}
    >
      {children}
    </AuthContext.Provider>
  );
};
