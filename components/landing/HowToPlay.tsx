"use client";

import { HandRankings } from "@/components/landing/HandRankings";

const steps = [
  {
    phase: "Pre-Game",
    title: "The Deal",
    description: "Two private hole cards land face-down. These are yours alone — guard them.",
    icon: "🃏",
    color: "amber",
  },
  {
    phase: "Round 1",
    title: "Pre-Flop",
    description: "First betting round. Decide to fold, call, or raise based on hand strength and position.",
    icon: "💭",
    color: "blue",
  },
  {
    phase: "Round 2",
    title: "The Flop",
    description: "Three community cards are revealed. Re-evaluate your hand and read the table texture.",
    icon: "🎴",
    color: "teal",
  },
  {
    phase: "Round 3",
    title: "The Turn",
    description: "The fourth card. A key inflection point — commit for value or control the pot.",
    icon: "⚡",
    color: "purple",
  },
  {
    phase: "Round 4",
    title: "The River",
    description: "Final board card. Your last move based on the complete board and opponent patterns.",
    icon: "🌊",
    color: "green",
  },
  {
    phase: "Resolution",
    title: "Showdown",
    description: "Cards revealed. The best five-card hand takes the pot.",
    icon: "🏆",
    color: "amber",
  },
];

const colorMap: Record<string, { dot: string; line: string; bg: string; text: string; phase: string }> = {
  amber: {
    dot: "bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.5)]",
    line: "bg-amber-400/20",
    bg: "bg-amber-400/8 border-amber-400/15",
    text: "text-amber-300",
    phase: "text-amber-400/60",
  },
  blue: {
    dot: "bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.5)]",
    line: "bg-blue-400/20",
    bg: "bg-blue-400/8 border-blue-400/15",
    text: "text-blue-300",
    phase: "text-blue-400/60",
  },
  teal: {
    dot: "bg-teal-400 shadow-[0_0_12px_rgba(45,212,191,0.5)]",
    line: "bg-teal-400/20",
    bg: "bg-teal-400/8 border-teal-400/15",
    text: "text-teal-300",
    phase: "text-teal-400/60",
  },
  purple: {
    dot: "bg-purple-400 shadow-[0_0_12px_rgba(167,139,250,0.5)]",
    line: "bg-purple-400/20",
    bg: "bg-purple-400/8 border-purple-400/15",
    text: "text-purple-300",
    phase: "text-purple-400/60",
  },
  green: {
    dot: "bg-green-400 shadow-[0_0_12px_rgba(74,222,128,0.5)]",
    line: "bg-green-400/20",
    bg: "bg-green-400/8 border-green-400/15",
    text: "text-green-300",
    phase: "text-green-400/60",
  },
};

const highlights = [
  {
    icon: "👁️",
    title: "Read before you bet",
    desc: "Timing, bet sizing, and patterns reveal more than the cards themselves.",
  },
  {
    icon: "📍",
    title: "Position is power",
    desc: "Acting last gives you information no card can. Use it every hand.",
  },
  {
    icon: "🎭",
    title: "Play the player",
    desc: "Each bot has a fixed archetype. Diagnose it early, exploit it ruthlessly.",
  },
];

export function HowToPlay() {
  return (
    <section id="how-to-play" className="rounded-2xl border border-white/8 bg-[#071510]/60 px-6 py-10 md:px-10 md:py-14">
      <header className="mb-10">
        <span className="font-mono text-xs tracking-[0.18em] text-amber-400/60 uppercase">
          Game Structure
        </span>
        <h2
          className="mt-2 text-3xl font-bold text-white md:text-4xl"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        >
          How to Play Texas Hold&apos;em
        </h2>
        <p className="mt-2 max-w-xl text-[#7a9e80] text-sm leading-relaxed">
          Six rounds, four betting streets, infinite reads. Follow the sequence — then learn to break it.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        {/* Timeline */}
        <div className="relative">
          {/* Vertical connector line */}
          <div className="absolute left-[17px] top-6 bottom-6 w-px bg-gradient-to-b from-amber-400/30 via-white/10 to-amber-400/20 hidden sm:block" aria-hidden="true" />

          <div className="space-y-3">
            {steps.map((step, i) => {
              const c = colorMap[step.color];
              return (
                <div key={step.title} className="flex gap-5 items-start">
                  {/* Timeline dot */}
                  <div className="relative flex-shrink-0 hidden sm:flex flex-col items-center">
                    <div className={`relative z-10 mt-1 w-[34px] h-[34px] rounded-full flex items-center justify-center text-base border border-white/10 bg-[#071510] ${c.dot}`}>
                      <span role="img" aria-hidden="true" className="text-sm">{step.icon}</span>
                    </div>
                  </div>

                  {/* Card */}
                  <div className={`flex-1 rounded-xl border ${c.bg} p-4 transition-all duration-200 hover:border-white/15`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-mono text-[9px] tracking-widest uppercase ${c.phase}`}>{step.phase}</span>
                    </div>
                    <h3 className="font-semibold text-white text-sm">{step.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-white/50">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pro tips sidebar */}
        <div className="space-y-4">
          <div className="rounded-xl border border-amber-400/15 bg-amber-400/[0.05] p-5">
            <h3 className="font-semibold text-amber-200 text-sm mb-4 flex items-center gap-2">
              <span aria-hidden="true">🎯</span> Pro Tactics
            </h3>
            <div className="space-y-4">
              {highlights.map(({ icon, title, desc }) => (
                <div key={title} className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center text-base">
                    <span role="img" aria-label={title}>{icon}</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white/80">{title}</p>
                    <p className="text-xs text-white/40 mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick odds reference */}
          <div className="rounded-xl border border-white/8 bg-white/[0.03] p-5">
            <h3 className="font-semibold text-white/70 text-sm mb-3 flex items-center gap-2">
              <span aria-hidden="true">🎲</span> Pocket pair odds
            </h3>
            <div className="space-y-2">
              {[
                { hand: "AA or KK", odds: "1 in 110" },
                { hand: "Any pair", odds: "1 in 17" },
                { hand: "Suited connectors", odds: "1 in 25" },
              ].map(({ hand, odds }) => (
                <div key={hand} className="flex justify-between items-center py-1 border-b border-white/5 last:border-0">
                  <span className="text-xs text-white/50">{hand}</span>
                  <span className="font-mono text-xs text-amber-300/70">{odds}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hand Rankings */}
      <div className="mt-12 pt-10 border-t border-white/8">
        <div className="flex items-center justify-between mb-1">
          <span className="font-mono text-xs tracking-[0.18em] text-amber-400/60 uppercase">Reference</span>
        </div>
        <h3
          className="text-2xl font-bold text-white"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        >
          Hand Rankings
        </h3>
        <HandRankings />
      </div>
    </section>
  );
}