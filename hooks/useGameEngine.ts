"use client";

import { useEffect } from "react";
import { useGameStore } from "@/store/game-store";

export function useGameEngine() {
  const init = useGameStore((state) => state.init);
  const phase = useGameStore((state) => state.phase);
  const turnIndex = useGameStore((state) => state.turnIndex);
  const players = useGameStore((state) => state.players);

  useEffect(() => {
    init();
  }, [init]);

  const currentPlayer = players[turnIndex];
  return { phase, currentPlayer };
}
