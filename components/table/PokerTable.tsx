"use client";

import { motion } from "framer-motion";
import { ActionBar } from "@/components/table/ActionBar";
import { CardSlot } from "@/components/table/CardSlot";
import { PlayerSeat } from "@/components/table/PlayerSeat";
import { PotDisplay } from "@/components/table/PotDisplay";
import { ReadPanel } from "@/components/table/ReadPanel";
import { BIG_BLIND } from "@/lib/constants/poker-rules";
import { useGameStore } from "@/store/game-store";

export function PokerTable() {
  const phase = useGameStore((state) => state.phase);
  const players = useGameStore((state) => state.players);
  const turnIndex = useGameStore((state) => state.turnIndex);
  const currentBet = useGameStore((state) => state.currentBet);
  const raiseTarget = useGameStore((state) => state.raiseTarget);
  const communityCards = useGameStore((state) => state.communityCards);
  const pot = useGameStore((state) => state.pot);
  const lastWinners = useGameStore((state) => state.lastWinners);
  const heroFold = useGameStore((state) => state.heroFold);
  const heroCallOrCheck = useGameStore((state) => state.heroCallOrCheck);
  const heroRaise = useGameStore((state) => state.heroRaise);
  const setRaiseTarget = useGameStore((state) => state.setRaiseTarget);

  const hero = players[0];
  const toCall = Math.max(0, currentBet - hero.currentBet);
  const minRaise = Math.min(hero.currentBet + hero.chips, Math.max(currentBet + BIG_BLIND, hero.currentBet + BIG_BLIND));
  const maxRaise = hero.currentBet + hero.chips;
  const canAct = phase !== "HAND_COMPLETE" && players[turnIndex]?.id === "hero" && !hero.folded && !hero.isAllIn;

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_250px]">
      <div className="rounded-3xl border border-amber-400/40 bg-[#0D3320]/60 p-4 shadow-[inset_0_0_80px_rgba(0,0,0,0.45)]">
        <PotDisplay phase={phase} pot={pot} />
        <div className="relative mt-4 h-[560px] overflow-hidden rounded-[190px] border-8 border-amber-900/50 bg-[radial-gradient(circle_at_50%_45%,#14532d_0%,#052e1b_70%,#03180f_100%)]">
          <motion.div
            animate={{ rotate: [0, 1, 0, -1, 0] }}
            transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,0.02) 5px, rgba(255,255,255,0.02) 10px)",
            }}
          />

          {players.map((player, index) => (
            <PlayerSeat
              key={player.id}
              player={player}
              isTurn={index === turnIndex}
              revealCards={phase === "HAND_COMPLETE"}
              winner={lastWinners.includes(player.id)}
            />
          ))}

          <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <CardSlot key={`board-${index}`} card={communityCards[index]} />
            ))}
          </div>
        </div>

        <div className="mt-4">
          <ActionBar
            toCall={toCall}
            minRaise={minRaise}
            maxRaise={maxRaise}
            raiseTarget={raiseTarget}
            canAct={canAct}
            onFold={heroFold}
            onCallCheck={heroCallOrCheck}
            onRaise={() => heroRaise(raiseTarget)}
            onRaiseChange={setRaiseTarget}
          />
        </div>
      </div>

      <ReadPanel bots={players.filter((player) => !player.isHero)} />
    </div>
  );
}
