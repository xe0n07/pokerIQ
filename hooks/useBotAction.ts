"use client";

import { useEffect } from "react";
import { BOT_THINK_MAX_MS, BOT_THINK_MIN_MS } from "@/lib/constants/poker-rules";
import { useGameStore } from "@/store/game-store";

export function useBotAction() {
  const phase = useGameStore((state) => state.phase);
  const turnIndex = useGameStore((state) => state.turnIndex);
  const players = useGameStore((state) => state.players);
  const botAct = useGameStore((state) => state.botAct);

  useEffect(() => {
    const actor = players[turnIndex];
    if (!actor || actor.isHero || actor.folded || actor.isAllIn || phase === "HAND_COMPLETE") {
      return;
    }

    const delay =
      BOT_THINK_MIN_MS + Math.floor(Math.random() * (BOT_THINK_MAX_MS - BOT_THINK_MIN_MS + 1));
    const timer = window.setTimeout(() => {
      botAct();
    }, delay);

    return () => window.clearTimeout(timer);
  }, [botAct, phase, players, turnIndex]);
}
