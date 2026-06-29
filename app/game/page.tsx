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
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";
import { SignInPrompt } from "@/components/game/SignInPrompt";

export default function GamePage() {
  useGameEngine();
  useBotAction();
  const { user, authEnabled, signingIn, signIn, signOut } = useAuth();

  const phase = useGameStore((s) => s.phase);
  const players = useGameStore((s) => s.players);
  const logs = useGameStore((s) => s.logs);
  const lastWinners = useGameStore((s) => s.lastWinners);
  const handNumber = useGameStore((s) => s.handNumber);
  const turnIndex = useGameStore((s) => s.turnIndex);
  const currentBet = useGameStore((s) => s.currentBet);
  const raiseTarget = useGameStore((s) => s.raiseTarget);
  const communityCards = useGameStore((s) => s.communityCards);
  const pot = useGameStore((s) => s.pot);
  const heroFold = useGameStore((s) => s.heroFold);
  const heroCallOrCheck = useGameStore((s) => s.heroCallOrCheck);
  const heroRaise = useGameStore((s) => s.heroRaise);
  const setRaiseTarget = useGameStore((s) => s.setRaiseTarget);
  const startHand = useGameStore((s) => s.startHand);

  // restored selectors for top bars / stats
  const hero = players && players.length > 0 ? players[0] : { chips: 0, folded: false, isAllIn: false, cards: [], currentBet: 0 };
  const heroXP = useGameStore((s) => s.heroXP);
  const heroTier = useGameStore((s) => s.heroTier);
  const heroChipTitle = useGameStore((s) => s.heroChipTitle);
  const winStreak = useGameStore((s) => s.winStreak);
  const lastHandXP = useGameStore((s) => s.lastHandXP);
  const lastBonusXP = useGameStore((s) => s.lastBonusXP);
  const premiumTickets = useGameStore((s) => s.premiumTickets);
  const premiumBoostUntilHand = useGameStore((s) => s.premiumBoostUntilHand);
  const questProgress = useGameStore((s) => s.questProgress);
  const claimDailyBonus = useGameStore((s) => s.claimDailyBonus);
  const activatePremiumBoost = useGameStore((s) => s.activatePremiumBoost);

  // keep track of previous hand number so we can reset per-hand flags when a new hand starts
  const prevHandRef = useRef<number | null>(null);

  // Ensure per-hand flags (folded/isAllIn/currentBet) are cleared when a new hand begins.
  // This prevents a permanent "folded" state carrying across hands which made the hero unable to play next hand.
  useEffect(() => {
    // skip initial mount
    if (prevHandRef.current === null) {
      prevHandRef.current = handNumber;
      return;
    }

    if (handNumber !== prevHandRef.current) {
      // new hand started — reset per-player transient flags safely via Zustand setState
      const s = useGameStore.getState();
      const updated = s.players.map((p) => ({
        ...p,
        folded: false,
        isAllIn: false,
        currentBet: 0,
      }));
      // apply minimal state update — keep other store logic intact
      useGameStore.setState({ players: updated });
      prevHandRef.current = handNumber;
    }
  }, [handNumber]);

  // AUDIO: register sounds and ensure audio unlocked on first user gesture
  useEffect(() => {
    // Register sound files (idempotent)
    void CasinoSfx.registerSounds({
      call: "/sounds/3.wav",
      fold: "/sounds/5.wav",
      raise: "/sounds/3.wav",
      check: "/sounds/3.wav",
      lose: "/sounds/5.wav",
      win: "/sounds/4.wav",
      chips: "/sounds/3.wav",
      card: "/sounds/6.wav",
    });

    const onFirstInteraction = () => {
      // unlock context and ensure preloads are attempted after a user gesture
      CasinoSfx.unlockAudioContext();
      void CasinoSfx.registerSounds({
        call: "/sounds/3.wav",
        fold: "/sounds/5.wav",
        raise: "/sounds/3.wav",
        check: "/sounds/3.wav",
        lose: "/sounds/5.wav",
        win: "/sounds/4.wav",
        chips: "/sounds/3.wav",
        card: "/sounds/6.wav",
      });
    };

    window.addEventListener("pointerdown", onFirstInteraction, { once: true });
    return () => window.removeEventListener("pointerdown", onFirstInteraction);
  }, []);

  // Play audio on phase and log changes
  const prevPhase = useRef<string | null>(null);
  const prevTopLog = useRef<string | null>(logs[0] ?? null);

  useEffect(() => {
    if (phase !== prevPhase.current && ["FLOP", "TURN", "RIVER"].includes(phase)) {
      CasinoSfx.playCard();
    }

    if (phase === "HAND_COMPLETE" && prevPhase.current !== "HAND_COMPLETE") {
      if (Array.isArray(lastWinners) && lastWinners.includes("hero")) {
        CasinoSfx.playWin();
      } else {
        CasinoSfx.playLose();
      }
    }

    prevPhase.current = phase;
  }, [phase, lastWinners]);

  useEffect(() => {
    const top = logs[0] ?? null;
    if (!top || top === prevTopLog.current) return;

    const t = top.toLowerCase();
    if (t.includes("fold")) CasinoSfx.playFold();
    else if (t.includes("check")) CasinoSfx.playCheck();
    else if (t.includes("call")) CasinoSfx.playCall();
    else if (t.includes("raise")) CasinoSfx.playRaise();
    else if (t.includes("wins")) CasinoSfx.playWin();
    else if (t.includes("hand #")) CasinoSfx.playCard();

    prevTopLog.current = top;
  }, [logs]);

  // LOGIN PROMPT after 2 hands (once)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  useEffect(() => {
    try {
      const prompted = window.localStorage.getItem("login_prompt_shown");
      if (!user && handNumber >= 2 && !prompted) {
        setShowLoginPrompt(true);
      }
    } catch {
      /* ignore */
    }
  }, [handNumber, user]);

  const handleSkipLogin = () => {
    try {
      window.localStorage.setItem("login_prompt_shown", "1");
    } catch {}
    setShowLoginPrompt(false);
  };

  // TIMER (movable, visible when hero's turn)
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [timerPosition, setTimerPosition] = useState({ x: 0, y: 112 });
  const [draggingTimer, setDraggingTimer] = useState(false);
  const timerRef = useRef<number | null>(null);
  const timerDragRef = useRef({ startX: 0, startY: 0, originX: 0, originY: 0 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    setTimerPosition({ x: Math.max(12, window.innerWidth - 260 - 24), y: 112 });
  }, []);

  const handleTimerDragStart = (
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();
    const clientX = "touches" in event ? event.touches[0].clientX : (event as React.MouseEvent).clientX;
    const clientY = "touches" in event ? event.touches[0].clientY : (event as React.MouseEvent).clientY;
    timerDragRef.current = {
      startX: clientX,
      startY: clientY,
      originX: timerPosition.x,
      originY: timerPosition.y,
    };
    setDraggingTimer(true);
  };

  useEffect(() => {
    if (!draggingTimer) return;

    const handleMove = (event: MouseEvent | TouchEvent) => {
      const clientX = "touches" in event ? (event as TouchEvent).touches[0].clientX : (event as MouseEvent).clientX;
      const clientY = "touches" in event ? (event as TouchEvent).touches[0].clientY : (event as MouseEvent).clientY;
      const deltaX = clientX - timerDragRef.current.startX;
      const deltaY = clientY - timerDragRef.current.startY;
      setTimerPosition({
        x: Math.min(Math.max(8, timerDragRef.current.originX + deltaX), window.innerWidth - 248),
        y: Math.min(Math.max(8, timerDragRef.current.originY + deltaY), window.innerHeight - 88),
      });
    };

    const handleEnd = () => setDraggingTimer(false);

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchend", handleEnd);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [draggingTimer]);

  const isHeroTurn =
    turnIndex === 0 &&
    phase !== "HAND_COMPLETE" &&
    !hero.folded &&
    !hero.isAllIn &&
    phase !== "WAITING";

  // timer interval management
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
          // schedule fold asynchronously and then resume engine
          window.setTimeout(() => {
            const s = useGameStore.getState();
            s.heroFold();
            s.botAct?.();
          }, 0);
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
    const onKeyDown = (event: KeyboardEvent) => {
      // ignore when typing into inputs
      const active = document.activeElement;
      if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA" || (active as HTMLElement).isContentEditable)) {
        return;
      }

      const key = event.key?.toLowerCase();

      // schedule store updates asynchronously to avoid "setState during render" warnings
      if (key === "f") {
        window.setTimeout(() => {
          const s = useGameStore.getState();
          s.heroFold();
          // resume engine: ask bot to act if appropriate
          s.botAct?.();
        }, 0);
      } else if (key === "c") {
        window.setTimeout(() => {
          const s = useGameStore.getState();
          s.heroCallOrCheck();
        }, 0);
      } else if (key === "r") {
        window.setTimeout(() => {
          const s = useGameStore.getState();
          s.heroRaise(s.raiseTarget);
        }, 0);
      } else if (key === "a") {
        window.setTimeout(() => {
          const s = useGameStore.getState();
          const hero = s.players[0];
          const allInAmount = hero.currentBet + hero.chips;
          s.heroRaise(allInAmount);
        }, 0);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // TIMER: ensure fold call is scheduled async to avoid render-time setState and resume bot actions
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
          // schedule fold asynchronously and then resume engine
          window.setTimeout(() => {
            const s = useGameStore.getState();
            s.heroFold();
            s.botAct?.();
          }, 0);
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

  return (
    <>
      <WinCelebration />
      <div className="min-h-screen bg-[#0A1A0F] px-4 py-6 text-[#F0EDE6]">
        <div className="mx-auto flex max-w-[1700px] flex-col gap-4">
          <header className="flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 bg-black/20">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-amber-300">PokerIQ Table</p>
              <p className="text-sm text-[#B8C7BB]">Hand #{handNumber} • {heroChipTitle} • Tier {heroTier}</p>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/" className="rounded-md border border-white/10 px-3 py-1.5 text-[#B8C7BB]">Landing</Link>
              <Link href="/leaderboard" className="rounded-md border border-white/10 px-3 py-1.5 text-[#B8C7BB]">Leaderboard</Link>
              <Link href="/profile" className="rounded-md border border-white/10 px-3 py-1.5 text-[#B8C7BB]">Profile</Link>

              {user ? (
                <div className="flex items-center gap-2">
                  <ProfileAvatar src={user.photoURL ?? undefined} alt={user.displayName ?? user.email ?? "Profile"} />
                  <button onClick={() => void signOut()} className="rounded-md border border-white/10 px-3 py-1.5 text-[#B8C7BB]">Sign out</button>
                </div>
              ) : authEnabled ? (
                <button onClick={() => void signIn()} disabled={signingIn} className="rounded-md border border-amber-300/40 px-3 py-1.5 text-amber-200">
                  {signingIn ? "Signing in..." : "Sign in"}
                </button>
              ) : (
                <span className="rounded-md border border-white/10 px-3 py-1.5 text-xs text-[#B8C7BB]">Guest</span>
              )}
            </div>
          </header>

          {/* RESTORED Top Stats / Readout bar */}
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
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
                    <div className="font-mono text-amber-300">{winStreak}</div>
                  </div>
                  <div>
                    <div className="text-[#B8C7BB]">Last Hand XP</div>
                    <div className="font-mono text-sky-300">
                      +{lastHandXP}
                      {lastBonusXP > 0 ? ` (+${lastBonusXP} bonus)` : ""}
                    </div>
                  </div>
                </div>

                <div className="mt-3 grid gap-3 rounded-lg border border-white/10 bg-[#09150d] p-3 md:grid-cols-[1.15fr_0.85fr]">
                  <div>
                    <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.3em] text-amber-300">
                      <span>Quest</span>
                      <span>{questProgress}/3</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-white/10">
                      <div className="h-2 rounded-full bg-amber-400" style={{ width: `${Math.min(100, Math.round((questProgress/3)*100))}%` }} />
                    </div>
                    <p className="mt-2 text-xs text-[#B8C7BB]">Win 3 hands to unlock the next prestige badge.</p>

                    <p className="mt-3 text-xs text-emerald-200">Players reached {heroChipTitle} this week.</p>
                  </div>

                  <div className="rounded-lg border border-white/10 bg-black/20 p-3 vip-panel">
                    <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.3em] text-amber-300">
                      <span>VIP Progression</span>
                      <span>{premiumTickets} tickets</span>
                    </div>

                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => claimDailyBonus()}
                        className={`btn-action btn-emerald`}
                      >
                        Claim Daily
                      </button>

                      <button
                        onClick={() => activatePremiumBoost()}
                        disabled={premiumTickets < 3}
                        className={`btn-action ${premiumTickets >= 3 ? "btn-warn btn-pop" : "btn-ghost"}`}
                      >
                        Boost x2 XP
                      </button>
                    </div>

                    {premiumBoostUntilHand ? (
                      <p className="mt-2 text-xs text-amber-200">VIP boost until hand #{premiumBoostUntilHand}.</p>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Poker table & action bar */}
              <PokerTable />

              {phase === "HAND_COMPLETE" && (
                <div className="mt-4 sm:mt-6">
                  <button onClick={startHand} className="mx-auto block w-full max-w-md rounded-2xl bg-amber-400 px-6 py-4 text-center text-lg font-semibold text-black shadow-xl">
                    Deal Next Hand
                  </button>
                </div>
              )}
            </div>

            {/* Right column: table history + other panels */}
            <aside className="rounded-xl border border-white/10 bg-black/20 p-4">
              <h3 className="mb-3 text-sm font-semibold tracking-wide text-amber-300">Table Log</h3>
              <div className="space-y-2 max-h-[420px] overflow-y-auto text-xs text-[#B8C7BB]">
                {logs.slice(0, 50).map((entry, i) => (
                  <p key={`${entry}-${i}`} className="leading-snug">
                    {entry}
                  </p>
                ))}
              </div>
            </aside>
          </div>
        </div>

        {/* movable timer */}
        {isHeroTurn ? (
          <div
            className="fixed z-50 rounded-[24px] border border-amber-300/30 bg-[#112112]/95 px-3 py-2 text-left shadow-[0_24px_60px_rgba(0,0,0,0.28)] backdrop-blur-sm"
            style={{ left: timerPosition.x, top: timerPosition.y, width: 240 }}
            onMouseDown={(e) => e.preventDefault()}
          >
            <div
              onMouseDown={handleTimerDragStart}
              onTouchStart={handleTimerDragStart}
              className="mb-2 flex cursor-grab items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-xs uppercase tracking-[0.32em] text-amber-200"
            >
              <span>Your move</span>
              <span className="text-[#B8C7BB]">Drag</span>
            </div>

            <div className="flex items-center justify-between gap-3 px-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/10 text-xl font-semibold text-amber-100">
                {timerSeconds}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white">Auto-fold timer</p>
                <p className="mt-1 text-[11px] text-[#B8C7BB]">Move the timer if it’s in the way.</p>
              </div>
            </div>

            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-amber-400 transition-all duration-200"
                style={{ width: `${(timerSeconds / 60) * 100}%` }}
              />
            </div>
          </div>
        ) : null}
      </div>

      {showLoginPrompt && !user ? <SignInPrompt onSignIn={() => signIn()} onSkip={handleSkipLogin} /> : null}
    </>
  );
}