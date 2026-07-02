// filepath: d:\pokerIQ\poker-web\hooks\useAuth.ts
"use client";

import { useEffect, useMemo, useState } from "react";
import type { User } from "firebase/auth";
import { signInWithGoogle, signOutUser, subscribeAuth } from "@/lib/firebase/auth";
import { upsertProfile } from "@/lib/firebase/firestore";
import { STARTING_STACK } from "@/lib/constants/poker-rules";
import { getChipTitleByStack, getTierByXP } from "@/lib/constants/titles";
import type { PlayerProfile } from "@/types/poker";

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

      // Persist basic profile server-side (email as unique id if available)
      if (nextUser && nextUser.email) {
        const profile: PlayerProfile = {
          uid: nextUser.email, // use email as unique id per requirement
          displayName: nextUser.displayName ?? nextUser.email.split("@")[0],
          email: nextUser.email,
          photoURL: nextUser.photoURL ?? undefined,
          createdAt: new Date().toISOString(),
          chipStack: STARTING_STACK,
          totalXP: 0,
          tier: getTierByXP(0).name,
          chipTitle: getChipTitleByStack(STARTING_STACK).title,
          handsPlayed: 0,
          handsWon: 0,
          totalWon: 0,
          totalLost: 0,
          biggestPot: 0,
          winRate: 0,
        };
        // don't await — best-effort upsert
        void upsertProfile(profile).catch(() => {
          /* ignore firestore errors in guest mode */
        });
      }
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
      if (!authEnabled || signingIn) return;
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
      if (!authEnabled) return;
      await signOutUser();
    },
  };
}