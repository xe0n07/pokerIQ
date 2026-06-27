export function PotDisplay({ pot, phase }: { pot: number; phase: string }) {
  return (
    <div className="mx-auto flex w-fit items-center gap-3 rounded-full border border-white/10 bg-black/40 px-4 py-2 font-mono text-sm text-[#F0EDE6]">
      <span>{phase.replace("_", " ")}</span>
      <span className="text-emerald-300">POT ${pot.toLocaleString()}</span>
    </div>
  );
}
