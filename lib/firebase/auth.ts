import {
  AuthErrorCodes,
  GoogleAuthProvider,
  browserPopupRedirectResolver,
  getAuth,
  initializeAuth,
  onAuthStateChanged,
  signInWithRedirect,
  signInWithPopup,
  signOut,
  type Auth,
  type UserCredential,
  type User,
} from "firebase/auth";
import { getFirebaseApp } from "@/lib/firebase/config";

let authInstance: Auth | null = null;
let signInInFlight: Promise<UserCredential | null> | null = null;

export function getFirebaseAuth() {
  const app = getFirebaseApp();
  if (!app) {
    return null;
  }
  if (authInstance) {
    return authInstance;
  }

  try {
    authInstance = initializeAuth(app, {
      popupRedirectResolver: browserPopupRedirectResolver,
    });
  } catch {
    authInstance = getAuth(app);
  }
  return authInstance;
}

export async function signInWithGoogle() {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error("Firebase is not configured.");
  }

  if (signInInFlight) {
    return signInInFlight;
  }

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  signInInFlight = (async () => {
    try {
      return await signInWithPopup(auth, provider);
    } catch (error) {
      const code = (error as { code?: string }).code ?? "";

      if (
        code === AuthErrorCodes.POPUP_BLOCKED ||
        code === AuthErrorCodes.POPUP_CLOSED_BY_USER ||
        code === `auth/${AuthErrorCodes.POPUP_BLOCKED}` ||
        code === `auth/${AuthErrorCodes.POPUP_CLOSED_BY_USER}`
      ) {
        await signInWithRedirect(auth, provider);
        return null;
      }

      if (
        code === AuthErrorCodes.EXPIRED_POPUP_REQUEST ||
        code === `auth/${AuthErrorCodes.EXPIRED_POPUP_REQUEST}` ||
        code === "auth/cancelled-popup-request"
      ) {
        return null;
      }

      throw error;
    } finally {
      signInInFlight = null;
    }
  })();

  return signInInFlight;
}

export async function signOutUser() {
  const auth = getFirebaseAuth();
  if (!auth) {
    return;
  }
  await signOut(auth);
}

export function subscribeAuth(callback: (user: User | null) => void) {
  const auth = getFirebaseAuth();
  if (!auth) {
    callback(null);
    return () => undefined;
  }
  return onAuthStateChanged(auth, callback);
}
