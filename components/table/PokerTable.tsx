"use client";

import { motion } from "framer-motion";
import { ActionBar } from "@/components/table/ActionBar";
import { CardSlot } from "@/components/table/CardSlot";
import { PlayerSeat } from "@/components/table/PlayerSeat";
import { PotDisplay } from "@/components/table/PotDisplay";
import { ReadPanel } from "@/components/table/ReadPanel";
import { BIG_BLIND } from "@/lib/constants/poker-rules";
import { describeHand } from "@/lib/game-engine/hand-analyzer";
import { useGameStore } from "@/store/game-store";

// Dealer avatar — place dealer.png inside /public/images/
const DEALER_IMAGE = "/images/dealer.png";

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
  const botAct = useGameStore((state) => state.botAct);

  const hero = players[0];
  const toCall = Math.max(0, currentBet - hero.currentBet);
  const minRaise = Math.min(
    hero.currentBet + hero.chips,
    Math.max(currentBet + BIG_BLIND, hero.currentBet + BIG_BLIND)
  );
  const maxRaise = hero.currentBet + hero.chips;
  const canAct =
    phase !== "HAND_COMPLETE" &&
    players[turnIndex]?.id === "hero" &&
    !hero.folded &&
    !hero.isAllIn;

  const heroHandDescription = describeHand([...hero.cards, ...communityCards]);

  // ensure fold continues the game: fold then schedule bot action (next actor)
  const handleFold = () => {
    // call store fold first
    heroFold();
    // schedule next bot action asynchronously so folding doesn't block render
    window.setTimeout(() => {
      try {
        const s = useGameStore.getState();
        s.botAct?.();
      } catch {
        /* ignore */
      }
    }, 0);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_250px]">
      <div className="rounded-4xl border border-amber-400/40 bg-[#0D3320]/60 p-4 shadow-[inset_0_0_80px_rgba(0,0,0,0.45)]">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <PotDisplay phase={phase} pot={pot} />
          <div className="rounded-full border border-white/10 bg-black/40 px-4 py-2 text-xs text-[#F0EDE6]">
            {hero.cards.length === 2 ? "Hand insight shown on your seat" : "Waiting for cards"}
          </div>
        </div>
        <div className="relative mt-2 h-[500px] overflow-hidden rounded-[150px] border-8 border-amber-900/50 bg-[radial-gradient(circle_at_50%_45%,#14532d_0%,#052e1b_70%,#03180f_100%)]">
          {/* Felt texture overlay */}
          <motion.div
            animate={{ rotate: [0, 1, 0, -1, 0] }}
            transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,0.02) 5px, rgba(255,255,255,0.02) 10px)",
            }}
          />

          {/* ── Dealer avatar — top-center of the table ── */}
          <div className="absolute left-1/2 top-4 -translate-x-1/2 flex flex-col items-center gap-1 z-10">
            <div
              className="
                relative h-32 w-32
                rounded-full
                ring-2 ring-amber-400/60
                shadow-[0_0_12px_rgba(251,191,36,0.25)]
                overflow-hidden
                bg-[#000000]
              "
            >
              <img
                src={DEALER_IMAGE}
                alt="Dealer"
                className="h-full w-full object-cover object-top scale-[1.15] translate-y-[4px]"
                draggable={false}
              />
            </div>
            <span
              className="
                rounded-full
                bg-black/60
                px-2.5 py-0.5
                text-[10px] font-semibold tracking-wide
                text-amber-300/90
                border border-amber-400/20
                whitespace-nowrap
              "
            >
              Ava
            </span>
          </div>

          {/* Bot + hero seats */}
          {players.map((player, index) => (
            <PlayerSeat
              key={player.id}
              player={player}
              isTurn={index === turnIndex}
              revealCards={phase === "HAND_COMPLETE"}
              winner={lastWinners.includes(player.id)}
              handInsight={player.id === "hero" ? heroHandDescription : undefined}
            />
          ))}

          {/* Community cards */}
          <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 gap-5">
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
            onFold={handleFold}
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