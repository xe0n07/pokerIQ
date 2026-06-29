"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useGameStore } from "@/store/game-store";

function playCelebrationSound() {
  if (typeof window === "undefined") return;

  const AudioCtxCtor =
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

  if (!AudioCtxCtor) return;

  const audioCtx = new AudioCtxCtor();
  const master = audioCtx.createGain();
  master.gain.value = 0.05;
  master.connect(audioCtx.destination);

  const note = (frequency: number, start: number, duration: number) => {
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(frequency, start);
    gainNode.gain.setValueAtTime(0.001, start);
    gainNode.gain.exponentialRampToValueAtTime(0.08, start + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, start + duration);
    osc.connect(gainNode).connect(master);
    osc.start(start);
    osc.stop(start + duration);
  };

  const now = audioCtx.currentTime;
  note(523.25, now, 0.14);
  note(659.25, now + 0.12, 0.14);
  note(783.99, now + 0.24, 0.2);

  void audioCtx.resume();
  window.setTimeout(() => {
    void audioCtx.close();
  }, 700);
}

export function WinCelebration() {
  const pendingWin = useGameStore((state) => state.pendingWin);
  const clearPendingWin = useGameStore((state) => state.clearPendingWin);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!pendingWin) {
      setVisible(false);
      return;
    }

    setVisible(true);
    playCelebrationSound();

    const timer = window.setTimeout(() => {
      setVisible(false);
      clearPendingWin();
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [pendingWin, clearPendingWin]);

  if (!pendingWin || !visible) return null;

  const confettiPieces = Array.from({ length: 16 }, (_, index) => ({
    left: `${(index * 7) % 100}%`,
    delay: index * 0.02,
    color: index % 2 === 0 ? "bg-amber-300" : "bg-emerald-300",
  }));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -10 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 px-4"
      >
        <div className="relative overflow-hidden rounded-[28px] border border-amber-300/40 bg-[#0b1b11]/95 px-8 py-8 text-center shadow-[0_0_80px_rgba(245,158,11,0.35)]">
          {confettiPieces.map((piece, index) => (
            <motion.span
              key={`${piece.left}-${index}`}
              initial={{ y: -30, opacity: 0, rotate: 0 }}
              animate={{ y: [0, 110, 140], opacity: [0, 1, 0], rotate: 360 }}
              transition={{ duration: 1.2, delay: piece.delay, ease: "easeOut" }}
              className={`absolute top-3 h-3 w-3 ${piece.color}`}
              style={{ left: piece.left }}
            />
          ))}

          <p className="text-[12px] font-semibold uppercase tracking-[0.4em] text-amber-300">
            Hand Complete
          </p>
          <h2 className="mt-2 text-5xl font-black uppercase tracking-[0.25em] text-[#FDE68A]">
            Win
          </h2>
          <p className="mt-4 text-3xl font-semibold text-emerald-300">
            +${pendingWin.amount.toLocaleString()}
          </p>
          <p className="mt-2 text-sm text-[#B8C7BB]">
            +{pendingWin.xpEarned} XP
            {pendingWin.bonusXp > 0 ? ` • +${pendingWin.bonusXp} bonus XP` : ""}
          </p>
          {pendingWin.isPremiumBoost ? (
            <p className="mt-2 text-xs uppercase tracking-[0.3em] text-amber-200">
              VIP boost active
            </p>
          ) : null}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}