"use client";

import { useRef, useEffect, useState } from "react";

const archetypes = [
  {
    id: "Rocky",
    name: "The Rock",
    subtitle: "Tight · Passive",
    style: "Plays few hands, almost never bluffs. Folds to pressure and waits for premiums.",
    exploit: "Steal blinds relentlessly. Fold to any real aggression.",
    icon: "🪨",
    color: "from-slate-800/80 to-slate-900/60",
    borderColor: "border-slate-600/30",
    accentColor: "text-slate-300",
    chipColor: "bg-slate-700/50 text-slate-300 border-slate-600/40",
    glowColor: "rgba(100,116,139,0.15)",
    tag: "Predictable",
    tagStyle: "bg-slate-700/40 text-slate-400 border-slate-600/30",
    stats: { aggression: 10, bluffFreq: 5, foldToPressure: 85 },
  },
  {
    id: "Manish",
    name: "Manish",
    subtitle: "Loose · Aggressive",
    style: "Bets and raises on nearly every street. High variance, tilts opponents.",
    exploit: "Trap with strong hands. Call down lighter than usual.",
    icon: "🔥",
    color: "from-red-950/80 to-red-900/40",
    borderColor: "border-red-700/30",
    accentColor: "text-red-300",
    chipColor: "bg-red-900/40 text-red-300 border-red-700/30",
    glowColor: "rgba(239,68,68,0.12)",
    tag: "High Variance",
    tagStyle: "bg-red-900/40 text-red-400 border-red-700/30",
    stats: { aggression: 95, bluffFreq: 75, foldToPressure: 15 },
  },
  {
    id: "Max",
    name: "Max",
    subtitle: "Balanced · Adaptive",
    style: "Balanced ranges, reads timing and sizing, randomizes patterns. The hardest to exploit.",
    exploit: "Vary your bet sizing. Stay unpredictable. Avoid patterns.",
    icon: "🦈",
    color: "from-cyan-950/80 to-cyan-900/40",
    borderColor: "border-cyan-700/30",
    accentColor: "text-cyan-300",
    chipColor: "bg-cyan-900/40 text-cyan-300 border-cyan-700/30",
    glowColor: "rgba(34,211,238,0.10)",
    tag: "Most Dangerous",
    tagStyle: "bg-cyan-900/40 text-cyan-400 border-cyan-700/30",
    stats: { aggression: 60, bluffFreq: 35, foldToPressure: 40 },
  },
  {
    id: "Leonardo",
    name: "Leonardo",
    subtitle: "Loose · Passive",
    style: "Calls too wide post-flop, rarely folds. Chases draws, hates folding.",
    exploit: "Value-bet thin. Never bluff. Print chips with strong hands.",
    icon: "🎰",
    color: "from-emerald-950/80 to-emerald-900/40",
    borderColor: "border-emerald-700/30",
    accentColor: "text-emerald-300",
    chipColor: "bg-emerald-900/40 text-emerald-300 border-emerald-700/30",
    glowColor: "rgba(52,211,153,0.10)",
    tag: "Easy Money",
    tagStyle: "bg-emerald-900/40 text-emerald-400 border-emerald-700/30",
    stats: { aggression: 20, bluffFreq: 8, foldToPressure: 15 },
  },
];

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setWidth(value); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-[10px] text-white/40 uppercase tracking-wider">{label}</span>
        <span className="font-mono text-[10px] text-white/40">{value}%</span>
      </div>
      <div className="h-1 w-full rounded-full bg-white/8 overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-1000 ease-out`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

export function ArchetypeShowcase() {
  return (
    <section className="rounded-2xl border border-white/8 bg-[#071510]/80 px-6 py-10 md:px-10 md:py-14">
      <header className="mb-10">
        <span className="font-mono text-xs tracking-[0.18em] text-amber-400/60 uppercase">
          Opponent Intelligence
        </span>
        <h2
          className="mt-2 text-3xl font-bold text-white md:text-4xl"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        >
          Know your enemy.
        </h2>
        <p className="mt-2 max-w-xl text-[#7a9e80] text-sm leading-relaxed">
          Every bot in PokerIQ is built on a real archetype. Identify the pattern, adapt your strategy, and extract maximum value.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {archetypes.map(({ id, name, subtitle, style, exploit, icon, color, borderColor, accentColor, chipColor, glowColor, tag, tagStyle, stats }) => (
          <article
            key={id}
            className={`group relative rounded-xl border ${borderColor} bg-gradient-to-b ${color} p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl overflow-hidden`}
            style={{ "--glow": glowColor } as React.CSSProperties}
          >
            {/* Hover glow blob */}
            <div
              className="absolute -top-6 -right-6 h-24 w-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl pointer-events-none"
              style={{ background: glowColor }}
              aria-hidden="true"
            />

            {/* Tag */}
            <div className="mb-4 flex items-center justify-between">
              <span className={`inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[10px] tracking-wider uppercase ${tagStyle}`}>
                {tag}
              </span>
              <span className="text-xl" role="img" aria-label={name}>{icon}</span>
            </div>

            {/* Name */}
            <h3 className="text-base font-semibold text-white leading-tight">{name}</h3>
            <p className={`mt-0.5 font-mono text-[10px] tracking-widest uppercase ${accentColor} opacity-70`}>{subtitle}</p>

            {/* Description */}
            <p className="mt-3 text-xs leading-relaxed text-white/50">{style}</p>

            {/* Stats */}
            <div className="mt-4 space-y-2">
              <StatBar
                label="Aggression"
                value={stats.aggression}
                color={id === "rock" ? "bg-slate-400" : id === "maniac" ? "bg-red-400" : id === "shark" ? "bg-cyan-400" : "bg-emerald-400"}
              />
              <StatBar
                label="Bluff freq"
                value={stats.bluffFreq}
                color={id === "rock" ? "bg-slate-400" : id === "maniac" ? "bg-red-400" : id === "shark" ? "bg-cyan-400" : "bg-emerald-400"}
              />
              <StatBar
                label="Fold to pressure"
                value={stats.foldToPressure}
                color={id === "rock" ? "bg-slate-400" : id === "maniac" ? "bg-red-400" : id === "shark" ? "bg-cyan-400" : "bg-emerald-400"}
              />
            </div>

            {/* Exploit chip */}
            <div className={`mt-5 rounded-lg border ${chipColor} bg-opacity-50 p-3`}>
              <p className="mb-1 font-mono text-[9px] uppercase tracking-widest text-white/30">Exploit</p>
              <p className="text-[11px] leading-snug text-white/70">{exploit}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}