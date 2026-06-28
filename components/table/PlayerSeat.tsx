import { motion } from "framer-motion";
import { CardSlot } from "@/components/table/CardSlot";
import { ChipStack } from "@/components/table/ChipStack";
import type { PlayerState } from "@/types/poker";
import type { CSSProperties } from "react";

/**
 * Seat positions tuned for the 560px-tall oval table (rounded-[190px]).
 * Keyed by player.id — add/rename entries to match your actual player IDs.
 *
 * Layout:
 *            [Dealer]
 *   [left-top]        [right-top]
 *   [left-mid]        [right-mid]
 *            [hero]
 */
const SEAT_STYLES: Record<string, CSSProperties> = {
  // ── Hero — bottom-center ─────────────────────────────────────────────────
  hero: {
    bottom: "30px",
    left: "50%",
    transform: "translateX(-50%)",
  }
};

/** Fallback so unknown IDs don't disappear. */
function getSeatStyle(player: PlayerState): CSSProperties {
  return SEAT_STYLES[player.id] ?? (player.seat as CSSProperties) ?? {};
}

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
  const isHero = player.isHero;

  return (
    <motion.div
      animate={
        winner
          ? {
              boxShadow:
                "0 0 0 2px rgba(201,168,76,0.85), 0 0 22px rgba(201,168,76,0.35)",
            }
          : {}
      }
      className={[
        "absolute rounded-xl border backdrop-blur-sm transition-opacity",
        // Hero: wider card, gold border; bots: compact, subtle border
        isHero
          ? "w-44 p-3 border-amber-400/40 bg-black/55"
          : "w-36 p-2 border-white/10 bg-black/50",
        player.folded ? "opacity-40" : "opacity-100",
        isTurn ? "ring-2 ring-amber-400/70" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={getSeatStyle(player)}
    >
      {/* ── Name row ────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 min-w-0">
        <span className="text-base leading-none shrink-0">{player.emoji}</span>
        <span
          className={[
            "truncate font-semibold leading-tight",
            isHero ? "text-sm text-amber-300" : "text-xs text-[#F0EDE6]",
          ].join(" ")}
        >
          {player.name}
        </span>
      </div>

      {/* ── Chip stack ──────────────────────────────────────────────────── */}
      <div className="mt-1.5">
        <ChipStack chips={player.chips} highlight={winner} />
      </div>

      {/* ── Last action — fixed height so cards don't jump ──────────────── */}
      <div className="mt-1 h-3.5 text-[10px] leading-none text-amber-200/80 truncate">
        {player.lastAction ?? ""}
      </div>

      {/* ── Hole cards ──────────────────────────────────────────────────── */}
      <div className="mt-1.5 flex gap-1">
        <CardSlot
          card={player.cards[0]}
          hidden={!player.isHero && !revealCards}
        />
        <CardSlot
          card={player.cards[1]}
          hidden={!player.isHero && !revealCards}
        />
      </div>
    </motion.div>
  );
}