"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { PokerTable } from "@/components/table/PokerTable";
import { useAuth } from "@/hooks/useAuth";
import { useBotAction } from "@/hooks/useBotAction";
import { useGameEngine } from "@/hooks/useGameEngine";
import { CasinoSfx } from "@/lib/audio/casino-sfx";
import { useGameStore } from "@/store/game-store";

export default function GamePage() {
  useGameEngine();
  useBotAction();
  const { user, authEnabled, signingIn, signIn, signOut } = useAuth();

  const phase = useGameStore((state) => state.phase);
  const players = useGameStore((state) => state.players);
  const logs = useGameStore((state) => state.logs);
  const handNumber = useGameStore((state) => state.handNumber);
  const heroXP = useGameStore((state) => state.heroXP);
  const heroTier = useGameStore((state) => state.heroTier);
  const heroChipTitle = useGameStore((state) => state.heroChipTitle);
  const warningText = useGameStore((state) => state.warningText);
  const winStreak = useGameStore((state) => state.winStreak);
  const lastHandXP = useGameStore((state) => state.lastHandXP);
  const lastBonusXP = useGameStore((state) => state.lastBonusXP);
  const startHand = useGameStore((state) => state.startHand);
  const hero = players[0];
  const prevPhase = useRef(phase);
  const prevTopLog = useRef(logs[0]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "f") {
        useGameStore.getState().heroFold();
      }
      if (event.key.toLowerCase() === "c") {
        useGameStore.getState().heroCallOrCheck();
      }
      if (event.key.toLowerCase() === "r") {
        const state = useGameStore.getState();
        state.heroRaise(state.raiseTarget);
      }
      if (event.key.toLowerCase() === "a") {
        const state = useGameStore.getState();
        const allIn = state.players[0].currentBet + state.players[0].chips;
        state.heroRaise(allIn);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (phase !== prevPhase.current && ["FLOP", "TURN", "RIVER"].includes(phase)) {
      CasinoSfx.playCard();
    }
    if (phase === "HAND_COMPLETE" && prevPhase.current !== "HAND_COMPLETE") {
      CasinoSfx.playWin();
    }
    prevPhase.current = phase;
  }, [phase]);

  useEffect(() => {
    const topLog = logs[0];
    if (!topLog || topLog === prevTopLog.current) {
      return;
    }

    if (topLog.includes("fold")) {
      CasinoSfx.playFold();
    } else if (topLog.includes("check")) {
      CasinoSfx.playCheck();
    } else if (topLog.includes("call") || topLog.includes("raise")) {
      CasinoSfx.playChips();
    } else if (topLog.includes("wins") || topLog.includes("Showdown")) {
      CasinoSfx.playWin();
    } else if (topLog.includes("Hand #")) {
      CasinoSfx.playCard();
    }
    prevTopLog.current = topLog;
  }, [logs]);

  return (
    <div className="min-h-screen bg-[#0A1A0F] px-4 py-6 text-[#F0EDE6]">
      <div className="mx-auto flex max-w-[1700px] flex-col gap-4">
        <header className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-amber-300">PokerIQ Table</p>
            <p className="text-sm text-[#B8C7BB]">
              Hand #{handNumber} • {heroChipTitle} • Tier {heroTier}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="rounded-md border border-white/10 px-3 py-1.5 text-[#B8C7BB]">
              Landing
            </Link>
            <Link href="/leaderboard" className="rounded-md border border-white/10 px-3 py-1.5 text-[#B8C7BB]">
              Leaderboard
            </Link>
            {authEnabled ? (
              user ? (
                <button onClick={() => void signOut()} className="rounded-md border border-white/10 px-3 py-1.5 text-[#B8C7BB]">
                  Sign out
                </button>
              ) : (
                <button
                  onClick={() => void signIn()}
                  disabled={signingIn}
                  className="rounded-md border border-amber-300/40 px-3 py-1.5 text-amber-200 disabled:opacity-60"
                >
                  {signingIn ? "Signing in..." : "Sign in with Google"}
                </button>
              )
            ) : (
              <span className="rounded-md border border-white/10 px-3 py-1.5 text-xs text-[#B8C7BB]">
                Firebase not configured (guest mode)
              </span>
            )}
          </div>
        </header>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div className="space-y-4">
            <div className="rounded-xl border border-white/10 bg-black/20 p-3 text-sm">
              <div className="grid gap-2 sm:grid-cols-4">
                <div>
                  <div className="text-[#B8C7BB]">Stack</div>
                  <div className="font-mono text-emerald-300">${hero.chips.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[#B8C7BB]">XP</div>
                  <div className="font-mono text-amber-300">{heroXP.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[#B8C7BB]">Streak</div>
                  <div className="font-mono text-orange-300">🔥 {winStreak}</div>
                </div>
                <div>
                  <div className="text-[#B8C7BB]">Last Hand XP</div>
                  <div className="font-mono text-sky-300">
                    +{lastHandXP}
                    {lastBonusXP > 0 ? ` (+${lastBonusXP} bonus)` : ""}
                  </div>
                </div>
              </div>
              {warningText ? <p className="mt-2 text-amber-200">{warningText}</p> : null}
            </div>

            <PokerTable />

            {phase === "HAND_COMPLETE" ? (
              <button onClick={startHand} className="w-full rounded-xl bg-[#C9A84C] px-5 py-3 font-semibold text-black">
                Deal Next Hand
              </button>
            ) : null}
          </div>

          <aside className="rounded-xl border border-white/10 bg-black/20 p-4">
            <h3 className="mb-3 text-sm font-semibold tracking-wide text-amber-300">Table Log</h3>
            <div className="space-y-2 text-xs text-[#B8C7BB]">
              {logs.slice(0, 14).map((entry, index) => (
                <p key={`${entry}-${index}`}>{entry}</p>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
