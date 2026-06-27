import { motion } from "framer-motion";
import { CardSlot } from "@/components/table/CardSlot";
import { ChipStack } from "@/components/table/ChipStack";
import type { PlayerState } from "@/types/poker";

export function PlayerSeat({
  player,
  isTurn,
  revealCards = false,
  winner = false,
}: {
  player: PlayerState;
  isTurn: boolean;
  revealCards?: boolean;
  winner?: boolean;
}) {
  return (
    <motion.div
      animate={winner ? { boxShadow: "0 0 0 2px rgba(201,168,76,0.85), 0 0 22px rgba(201,168,76,0.35)" } : {}}
      className={`absolute w-40 rounded-xl border border-white/10 bg-black/45 p-3 backdrop-blur-sm ${player.folded ? "opacity-45" : ""} ${isTurn ? "ring-2 ring-amber-400/70" : ""}`}
      style={player.seat}
    >
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="truncate font-medium text-sm text-[#F0EDE6]">
          {player.emoji} {player.name}
        </span>
      </div>
      <ChipStack chips={player.chips} highlight={winner} />
      <div className="mt-1 h-4 text-[11px] text-amber-200/90">{player.lastAction}</div>
      <div className="mt-2 flex gap-1">
        <CardSlot card={player.cards[0]} hidden={!player.isHero && !revealCards} />
        <CardSlot card={player.cards[1]} hidden={!player.isHero && !revealCards} />
      </div>
    </motion.div>
  );
}
