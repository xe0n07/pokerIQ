import Link from "next/link";
import { ArchetypeShowcase } from "@/components/landing/ArchetypeShowcase";
import { Hero } from "@/components/landing/Hero";
import { HowToPlay } from "@/components/landing/HowToPlay";
import { LeaderboardPreview } from "@/components/landing/LeaderboardPreview";
import logoPng from "./logo.png";

const ladderMilestones = [
  { chips: "$5,000", title: "Rookie", desc: "Starting stack", icon: "🐟", unlocked: true },
  { chips: "$15,000", title: "Pro", desc: "Consistency over luck", icon: "⚙️", unlocked: false },
  { chips: "$30,000", title: "Expert", desc: "Reads are your edge", icon: "🦈", unlocked: false },
  { chips: "$75,000", title: "Master", desc: "Fear the reraise", icon: "💎", unlocked: false },
  { chips: "$100,000", title: "Elite", desc: "Cool under pressure", icon: "🎩", unlocked: false },
  { chips: "$250,000", title: "James Bond", desc: "The final table", icon: "👑", unlocked: false },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#070f0a] text-[#F0EDE6]">
      {/* Nav */}
      <div className="sticky top-0 z-50 px-6 pt-3 pb-0">
        <header className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-[#070f0a]/90 px-5 py-3 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-400/15 border border-amber-400/20">
              <img src={logoPng.src} alt="P" width={20} height={20} />
            </div>
            <span
              className="font-mono text-sm tracking-[0.18em] text-amber-300 font-bold"
            >
              POKERIQ
            </span>
          </div>

          <nav className="flex items-center gap-1 text-sm">
            {[
              { href: "/game", label: "Game" },
              { href: "/leaderboard", label: "Leaderboard" },
              { href: "/profile", label: "Profile" },
              { href: "/learn", label: "Learn" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="rounded-lg px-3 py-1.5 text-[#7a9e80] transition-colors hover:bg-white/5 hover:text-white"
              >
                {label}
              </Link>
            ))}
            <Link
              href="/game"
              className="ml-2 rounded-full bg-amber-400 px-4 py-1.5 text-sm font-semibold text-black transition-all hover:bg-amber-300 active:scale-95"
            >
              Play Free
            </Link>
          </nav>
        </header>
      </div>

      {/* Main content */}
      <main className="flex flex-col gap-5 px-6 py-4 pb-16">
        <Hero />

        {/* James Bond Ladder */}
        <section className="rounded-2xl border border-white/8 bg-[#071510]/60 px-6 py-10 md:px-10 md:py-12">
          <div className="mb-8">
            <span className="font-mono text-xs tracking-[0.18em] text-amber-400/60 uppercase">
              Progression
            </span>
            <h2
              className="mt-2 text-3xl font-bold text-white md:text-4xl"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              The James Bond Ladder
            </h2>
            <p className="mt-2 text-sm text-[#7a9e80] max-w-xl">
              Every chip milestone unlocks a new title. Earn your way from the felt to the final table.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ladderMilestones.map(({ chips, title, desc, icon, unlocked }) => (
              <div
                key={title}
                className={`group relative flex items-start gap-4 rounded-xl border p-4 transition-all duration-200 ${
                  unlocked
                    ? "border-amber-400/25 bg-amber-400/[0.06] hover:border-amber-400/40"
                    : "border-white/[0.07] bg-white/[0.02] hover:border-white/12 hover:bg-white/[0.04]"
                }`}
              >
                <div
                  className={`flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-xl text-xl border transition-colors ${
                    unlocked ? "bg-amber-400/15 border-amber-400/20" : "bg-white/5 border-white/8"
                  }`}
                >
                  <span role="img" aria-label={title}>{icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className={`font-semibold text-sm ${unlocked ? "text-amber-200" : "text-white/80"}`}>
                      {title}
                    </h3>
                    {unlocked && (
                      <span className="flex-shrink-0 rounded-full bg-amber-400/20 border border-amber-400/30 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-amber-400">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="font-mono text-xs text-amber-300/60 mt-0.5">{chips}</p>
                  <p className="text-xs text-white/30 mt-1">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Progress indicator */}
          <div className="mt-6 rounded-xl border border-white/8 bg-white/[0.03] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/40">Rookie → Pro</span>
              <span className="font-mono text-xs text-amber-300/60">$5,000 / $15,000</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/8 overflow-hidden">
              <div className="h-full w-[33%] rounded-full bg-gradient-to-r from-amber-600 to-amber-400" />
            </div>
            <p className="mt-1.5 text-[10px] text-white/20 font-mono">$10,000 more chips to advance</p>
          </div>
        </section>

        <HowToPlay />
        <ArchetypeShowcase />
        <LeaderboardPreview />

        {/* Final CTA */}
        <section className="relative overflow-hidden rounded-2xl border border-amber-400/20 bg-[#071510]">
          {/* Background glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 80% 100% at 50% 120%, rgba(201,168,76,0.10) 0%, transparent 65%)",
            }}
            aria-hidden="true"
          />

          <div className="relative z-10 px-8 py-14 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber-400/50 mb-4">
              Free to play · No deposit · Virtual chips only
            </p>
            <h2
              className="text-3xl font-bold text-white md:text-4xl lg:text-5xl"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              $5,000 is waiting for you.
            </h2>
            <p className="mt-3 text-[#7a9e80] max-w-md mx-auto">
              No real money. No luck. Just your reads against four adaptive AI opponents.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/game"
                className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-8 py-4 font-semibold text-black text-base transition-all hover:bg-amber-300 hover:shadow-[0_0_32px_rgba(201,168,76,0.3)] active:scale-95"
              >
                Deal Me In
                <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <a
                href="#how-to-play"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-8 py-4 text-white/60 transition-all hover:border-white/25 hover:text-white/90"
              >
                Learn the game
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="flex items-center justify-between py-4 border-t border-white/5 text-xs text-white/20 font-mono flex-wrap gap-2">
          <span>POKERIQ © 2025 — Virtual chips only. No real-money gambling.</span>
          <div className="flex gap-4">
            <Link href="/learn" className="hover:text-white/50 transition-colors">Learn</Link>
            <Link href="/profile" className="hover:text-white/50 transition-colors">Profile</Link>
          </div>
        </footer>
      </main>
    </div>
  );
}