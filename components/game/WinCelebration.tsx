"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/store/game-store";
import { CasinoSfx } from "@/lib/audio/casino-sfx";

export function WinCelebration() {
  const phase = useGameStore((s) => s.phase);
  const lastWinners = useGameStore((s) => s.lastWinners);
  const pendingWin = useGameStore((s) => s.pendingWin);
  const clearPendingWin = useGameStore((s) => s.clearPendingWin);
  const startHand = useGameStore((s) => s.startHand);
  const router = useRouter();

  const prevPhase = useRef<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [outcome, setOutcome] = useState<"win" | "lose" | null>(null);
  const [buttonsDisabled, setButtonsDisabled] = useState(true);

  // timers
  const showTimer = useRef<number | null>(null);
  const enableTimer = useRef<number | null>(null);

  useEffect(() => {
    // Clear timers on unmount or next run
    return () => {
      if (showTimer.current !== null) {
        window.clearTimeout(showTimer.current);
        showTimer.current = null;
      }
      if (enableTimer.current !== null) {
        window.clearTimeout(enableTimer.current);
        enableTimer.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (phase === "HAND_COMPLETE" && prevPhase.current !== "HAND_COMPLETE") {
      const heroWon = Array.isArray(lastWinners) && lastWinners.includes("hero");
      setOutcome(heroWon ? "win" : "lose");
      setButtonsDisabled(true);

      // clear any previous timers
      if (showTimer.current !== null) {
        window.clearTimeout(showTimer.current);
        showTimer.current = null;
      }
      if (enableTimer.current !== null) {
        window.clearTimeout(enableTimer.current);
        enableTimer.current = null;
      }

      if (heroWon) {
        // show immediately for wins
        setVisible(true);
        CasinoSfx.playWin();
        // enable buttons after 10s (existing behaviour)
        enableTimer.current = window.setTimeout(() => {
          setButtonsDisabled(false);
        }, 10000);
      } else {
        // DELAY defeat modal by 7 seconds
        showTimer.current = window.setTimeout(() => {
          setVisible(true);
          CasinoSfx.playLose();
          // after visible, enable buttons after 5s (keeps previous UX)
          enableTimer.current = window.setTimeout(() => {
            setButtonsDisabled(false);
          }, 5000);
        }, 7000);
      }
    }

    prevPhase.current = phase;
  }, [phase, lastWinners]);

  if (!visible || !outcome) return null;

  const winAmount = pendingWin?.amount ? `+$${pendingWin.amount.toLocaleString()}` : "You won the pot";
  const loseMessage = "Mission failed. Learn the read and return stronger.";

  const playAgain = () => {
    clearPendingWin();
    startHand();
    setVisible(false);
  };

  const goToStore = () => {
    router.push("/shop/checkout?amount=10000");
  };

  const exitToLobby = () => {
    clearPendingWin();
    router.push("/");
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="fixed inset-0 z-[70] flex items-center justify-center bg-black/55 px-4"
      >
        <motion.div
          initial={{ y: 16, scale: 0.98, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          exit={{ y: 8, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-[#08140f]/95 p-6 shadow-2xl"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-wider text-amber-200">{outcome === "win" ? "Victory" : "Defeat"}</div>
              <h3 className="mt-2 text-2xl font-semibold">{outcome === "win" ? "Mission Complete" : "Hand Lost"}</h3>
            </div>

            <div className="text-right">
              <div className="text-sm font-mono text-amber-300">{outcome === "win" ? winAmount : "-"}</div>
              <div className="mt-1 text-xs text-[#B8C7BB]">{outcome === "win" ? `+${pendingWin?.xpEarned ?? 0} XP` : loseMessage}</div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={playAgain}
              disabled={buttonsDisabled}
              className="win-cta"
            >
              Play Again
            </button>

            <button
              onClick={goToStore}
              disabled={buttonsDisabled}
              className="win-btn-secondary"
            >
              Buy 10k Chips
            </button>

            <button
              onClick={exitToLobby}
              disabled={buttonsDisabled}
              className="win-btn-secondary"
            >
              Exit to Lobby
            </button>
          </div>

          <div className="mt-4 text-xs text-[#9fb29a]">
            Note: chips are virtual and for in-game progression only. No real-money gambling is supported.
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}