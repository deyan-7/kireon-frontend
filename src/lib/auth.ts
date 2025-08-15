import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInAnonymously,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import config from "@/config";

export const firebaseApp = initializeApp(config.firebaseConfig);
export const auth = getAuth(firebaseApp);

const provider = new GoogleAuthProvider();

provider.setCustomParameters({
  hd: "deyan7.de",
});

export const googleSignIn = async (): Promise<User | null> => {
  try {
    const result = await signInWithPopup(auth, provider);
    const email = result.user.email;

    if (!email?.endsWith("@deyan7.de")) {
      console.error("Unauthorized domain:", email);
      await signOut(auth);
      return null;
    }

    return result.user;
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    return null;
  }
};

export const ensureAnonymousUser = async (): Promise<void> => {
  if (!auth.currentUser) {
    await signInAnonymously(auth);
  }
};
