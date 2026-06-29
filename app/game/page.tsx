"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { WinCelebration } from "@/components/game/WinCelebration";
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
  const premiumTickets = useGameStore((state) => state.premiumTickets);
  const premiumBoostUntilHand = useGameStore((state) => state.premiumBoostUntilHand);
  const questProgress = useGameStore((state) => state.questProgress);
  const claimDailyBonus = useGameStore((state) => state.claimDailyBonus);
  const lastWinners = useGameStore((state) => state.lastWinners);
  const activatePremiumBoost = useGameStore((state) => state.activatePremiumBoost);
  const startHand = useGameStore((state) => state.startHand);
  const turnIndex = useGameStore((state) => state.turnIndex);
  const heroFold = useGameStore((state) => state.heroFold);
  const hero = players[0];

  const [timerSeconds, setTimerSeconds] = useState(60);
  const timerRef = useRef<number | null>(null);
  const prevPhase = useRef(phase);
  const prevTopLog = useRef(logs[0]);

  const isHeroTurn =
    turnIndex === 0 &&
    phase !== "HAND_COMPLETE" &&
    !hero.folded &&
    !hero.isAllIn &&
    phase !== "WAITING";

  const isBondMode =
    heroChipTitle.toLowerCase().includes("bond") || heroTier.toLowerCase().includes("bond");
  const questGoal = 3;
  const questPercent = Math.min(100, Math.round((questProgress / questGoal) * 100));
  const premiumBoostActive = premiumBoostUntilHand !== null && premiumBoostUntilHand >= handNumber;
  const showSunkCostNudge = handNumber >= 8 && phase !== "HAND_COMPLETE";
  const socialProof = `${(heroXP + 347).toLocaleString()} players reached ${heroChipTitle} this week.`;

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
    if (!isHeroTurn) {
      setTimerSeconds(60);
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    setTimerSeconds(60);

    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
    }

    timerRef.current = window.setInterval(() => {
      setTimerSeconds((current) => {
        if (current <= 1) {
          if (timerRef.current !== null) {
            window.clearInterval(timerRef.current);
            timerRef.current = null;
          }
          heroFold();
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isHeroTurn, heroFold]);

  useEffect(() => {
    if (phase !== prevPhase.current && ["FLOP", "TURN", "RIVER"].includes(phase)) {
      CasinoSfx.playCard();
    }

    if (phase === "HAND_COMPLETE" && prevPhase.current !== "HAND_COMPLETE") {
      if (lastWinners.includes("hero")) {
        CasinoSfx.playWin();
      } else {
        CasinoSfx.playLose();
      }
    }

    prevPhase.current = phase;
  }, [phase, lastWinners]);

  useEffect(() => {
    const topLog = logs[0];
    if (!topLog || topLog === prevTopLog.current) {
      return;
    }

    if (topLog.includes("fold")) {
      CasinoSfx.playFold();
    } else if (topLog.includes("check")) {
      CasinoSfx.playCheck();
    } else if (topLog.includes("call")) {
      CasinoSfx.playCall();
    } else if (topLog.includes("raise")) {
      CasinoSfx.playRaise();
    } else if (topLog.includes("wins")) {
      CasinoSfx.playWin();
    } else if (topLog.includes("Hand #")) {
      CasinoSfx.playCard();
    }

    prevTopLog.current = topLog;
  }, [logs]);

  return (
    <>
      <WinCelebration />
      <div className="min-h-screen bg-[#0A1A0F] px-4 py-6 text-[#F0EDE6]">
        <div className="mx-auto flex max-w-[1700px] flex-col gap-4">
          <header
            className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 ${
              isBondMode
                ? "border-amber-400/50 bg-amber-400/10 shadow-[0_0_30px_rgba(245,158,11,0.12)]"
                : "border-white/10 bg-black/20"
            }`}
          >
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-amber-300">PokerIQ Table</p>
              <p className="text-sm text-[#B8C7BB]">
                Hand #{handNumber} • {heroChipTitle} • Tier {heroTier}
              </p>
              {isBondMode ? (
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.3em] text-amber-200">
                  Mr. Bond Mode
                </p>
              ) : null}
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

          {isHeroTurn ? (
            <div className="fixed right-4 top-28 z-50 flex justify-end px-4">
              <div
                role="status"
                aria-live="polite"
                className="flex w-full max-w-[280px] items-center gap-4 rounded-[28px] border border-amber-300/30 bg-[#112112]/95 px-4 py-3 text-left shadow-[0_24px_60px_rgba(0,0,0,0.28)] backdrop-blur-sm"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400/10 text-2xl font-semibold text-amber-100">
                  {timerSeconds}
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-[0.32em] text-amber-200">
                    Your move
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white">
                    Decide before auto-fold
                  </p>
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-amber-400 transition-all duration-200"
                      style={{ width: `${(timerSeconds / 60) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : null}

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

                <div className="mt-4 grid gap-3 rounded-lg border border-white/10 bg-[#09150d] p-3 md:grid-cols-[1.15fr_0.85fr]">
                  <div>
                    <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.3em] text-amber-300">
                      <span>Quest</span>
                      <span>{questProgress}/{questGoal}</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-white/10">
                      <div
                        className="h-2 rounded-full bg-amber-400 transition-all"
                        style={{ width: `${questPercent}%` }}
                      />
                    </div>
                    <p className="mt-2 text-xs text-[#B8C7BB]">
                      Win 3 hands to unlock your next prestige badge.
                    </p>

                    <p className="mt-3 text-xs text-emerald-200">{socialProof}</p>

                    {showSunkCostNudge ? (
                      <p className="mt-3 rounded-lg border border-amber-300/20 bg-amber-500/10 p-2 text-sm text-amber-200">
                        You’ve played {handNumber} hands. One more?
                      </p>
                    ) : null}
                  </div>

                  <div className="rounded-lg border border-white/10 bg-black/20 p-3">
                    <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.3em] text-amber-300">
                      <span>VIP Progression</span>
                      <span>{premiumTickets} tickets</span>
                    </div>

                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => claimDailyBonus()}
                        className="flex-1 rounded-md border border-emerald-400/30 bg-emerald-500/10 px-2 py-2 text-xs text-emerald-200"
                      >
                        Claim Daily Bonus
                      </button>
                      <button
                        onClick={() => activatePremiumBoost()}
                        disabled={premiumTickets < 3}
                        className="flex-1 rounded-md border border-amber-400/30 bg-amber-500/10 px-2 py-2 text-xs text-amber-200 disabled:opacity-50"
                      >
                        Boost x2 XP
                      </button>
                    </div>

                    {premiumBoostActive ? (
                      <p className="mt-2 text-xs text-amber-200">
                        VIP boost active until hand #{premiumBoostUntilHand}.
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>

              <PokerTable />

              {phase === "HAND_COMPLETE" ? (
                <button
                  onClick={startHand}
                  className="w-full rounded-xl bg-[#C9A84C] px-5 py-3 font-semibold text-black"
                >
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
    </>
  );
}