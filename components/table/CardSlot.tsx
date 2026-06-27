import { motion } from "framer-motion";
import type { Card } from "@/types/poker";

const suitSymbol: Record<Card["suit"], string> = {
  spades: "♠",
  hearts: "♥",
  diamonds: "♦",
  clubs: "♣",
};

export function CardSlot({ card, hidden = false }: { card?: Card; hidden?: boolean }) {
  if (!card) {
    return <div className="h-16 w-11 rounded-md border border-dashed border-white/20 bg-white/5" />;
  }

  if (hidden) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-16 w-11 rounded-md border border-white/20 bg-gradient-to-br from-slate-800 to-slate-950"
      />
    );
  }

  const red = card.suit === "hearts" || card.suit === "diamonds";
  return (
    <motion.div
      initial={{ opacity: 0, y: -12, rotateY: 90 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{ duration: 0.2 }}
      className={`h-16 w-11 rounded-md border bg-[#F5F0E8] px-1 py-0.5 text-[10px] font-bold shadow-md ${red ? "text-red-700" : "text-slate-900"}`}
    >
      <div>{card.rank}</div>
      <div className="text-right text-sm leading-4">{suitSymbol[card.suit]}</div>
    </motion.div>
  );
}
