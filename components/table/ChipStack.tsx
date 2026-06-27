import { motion } from "framer-motion";

export function ChipStack({ chips, highlight = false }: { chips: number; highlight?: boolean }) {
  return (
    <motion.div
      animate={highlight ? { scale: [1, 1.06, 1] } : { scale: 1 }}
      transition={{ duration: 0.4 }}
      className="rounded-full border border-amber-300/40 bg-black/40 px-3 py-1 font-mono text-xs text-amber-300"
    >
      ${chips.toLocaleString()}
    </motion.div>
  );
}
