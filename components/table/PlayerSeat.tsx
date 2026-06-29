"use client";

import { motion } from "framer-motion";
import { CardSlot } from "@/components/table/CardSlot";
import { ChipStack } from "@/components/table/ChipStack";
import type { PlayerState } from "@/types/poker";
import type { CSSProperties } from "react";

const SEAT_STYLES: Record<string, CSSProperties> = {
  hero: {
    bottom: "30px",
    left: "50%",
    transform: "translateX(-50%)",
  },
};

function getSeatStyle(player: PlayerState): CSSProperties {
  return SEAT_STYLES[player.id] ?? (player.seat as CSSProperties) ?? {};
}

export function PlayerSeat({
  player,
  isTurn,
  revealCards = false,
  winner = false,
  handInsight,
}: {
  player: PlayerState;
  isTurn: boolean;
  revealCards?: boolean;
  winner?: boolean;
  handInsight?: string | null;
}) {
  const isHero = player.isHero;

  return (
    <motion.div
      animate={
        winner
          ? {
              boxShadow:
                "0 0 0 2px rgba(242, 201, 76, 0.85), 0 0 22px rgba(242, 201, 76, 0.25)",
            }
          : {}
      }
      className={[
        "absolute rounded-xl border backdrop-blur-sm transition-opacity select-none",
        isHero
          ? "w-44 p-3 border-amber-300/30 bg-black/60"
          : "w-36 p-2 border-white/10 bg-black/55",
        player.folded ? "opacity-50" : "opacity-100",
        isTurn ? "ring-2 ring-amber-400/60" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={getSeatStyle(player)}
    >
      <div className="relative">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[11px] uppercase tracking-[0.3em] text-amber-200">
            {isHero ? "YOU" : player.name}
          </span>
          <div className="ml-auto text-xs text-[#B8C7BB]">{player.lastAction ?? ""}</div>
        </div>

        {/* Hand insight badge - inside seat, top-right */}
        {isHero && handInsight ? (
          <div
            className="absolute right-0 top-0 translate-y-[-12%] translate-x-[8%] flex items-center gap-2 rounded-full border border-white/8 bg-[#07150f]/90 px-2 py-1 text-[11px] font-semibold text-emerald-200 shadow-sm"
            title={handInsight}
            aria-hidden={false}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="opacity-95">
              <path d="M12 2v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 7l6 3 6-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 21h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="max-w-[92px] truncate">{handInsight}</span>
          </div>
        ) : null}
      </div>

      <div className="mt-2 flex items-center justify-between gap-2">
        <ChipStack chips={player.chips} highlight={winner} />
      </div>

      <div className="mt-2 flex gap-1">
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