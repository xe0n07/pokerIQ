import {
  collection,
  doc,
  getFirestore,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import type { HandHistoryEntry, PlayerProfile } from "@/types/poker";
import { getFirebaseApp } from "@/lib/firebase/config";

function getDb() {
  const app = getFirebaseApp();
  if (!app) {
    return null;
  }
  return getFirestore(app);
}

export async function upsertProfile(profile: PlayerProfile) {
  const db = getDb();
  if (!db) {
    return;
  }
  await setDoc(doc(db, "users", profile.uid), { ...profile, updatedAt: serverTimestamp() }, { merge: true });
}

export async function saveHandHistory(uid: string, hand: HandHistoryEntry) {
  const db = getDb();
  if (!db) {
    return;
  }
  const handRef = doc(collection(db, "users", uid, "handHistory"), hand.handId);
  await setDoc(handRef, { ...hand, playedAt: serverTimestamp() });
}

export async function updateLeaderboard(uid: string, payload: Partial<PlayerProfile>) {
  const db = getDb();
  if (!db) {
    return;
  }
  const leaderboardRef = doc(db, "leaderboard", uid);
  await setDoc(leaderboardRef, { ...payload, updatedAt: serverTimestamp() }, { merge: true });
}

export async function patchUser(uid: string, payload: Partial<PlayerProfile>) {
  const db = getDb();
  if (!db) {
    return;
  }
  await updateDoc(doc(db, "users", uid), payload);
}
