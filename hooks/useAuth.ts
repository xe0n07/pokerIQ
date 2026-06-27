"use client";

import { useEffect, useMemo, useState } from "react";
import type { User } from "firebase/auth";
import { signInWithGoogle, signOutUser, subscribeAuth } from "@/lib/firebase/auth";

type AuthState = {
  user: User | null;
  loading: boolean;
  signingIn: boolean;
  authEnabled: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
};

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeAuth((nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const authEnabled = useMemo(
    () =>
      Boolean(
        process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
          process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
          process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
          process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      ),
    [],
  );

  return {
    user,
    loading,
    signingIn,
    authEnabled,
    signIn: async () => {
      if (!authEnabled || signingIn) {
        return;
      }
      setSigningIn(true);
      try {
        await signInWithGoogle();
      } catch (error) {
        console.error("Google sign-in failed:", error);
      } finally {
        setSigningIn(false);
      }
    },
    signOut: async () => {
      if (!authEnabled) {
        return;
      }
      await signOutUser();
    },
  };
}
