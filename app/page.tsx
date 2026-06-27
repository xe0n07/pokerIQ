import Link from "next/link";
import { ArchetypeShowcase } from "@/components/landing/ArchetypeShowcase";
import { Hero } from "@/components/landing/Hero";
import { HowToPlay } from "@/components/landing/HowToPlay";
import { LeaderboardPreview } from "@/components/landing/LeaderboardPreview";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A1A0F] px-4 py-6 text-[#F0EDE6]">
      <main className="mx-auto flex max-w-6xl flex-col gap-5">
        <header className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 py-3">
          <span className="font-mono text-sm tracking-widest text-amber-300">POKERIQ</span>
          <nav className="flex items-center gap-3 text-sm text-[#B8C7BB]">
            <Link href="/game">Game</Link>
            <Link href="/leaderboard">Leaderboard</Link>
            <Link href="/profile">Profile</Link>
            <Link href="/learn">Learn</Link>
          </nav>
        </header>

        <Hero />

        <section className="rounded-2xl border border-white/10 bg-black/20 p-6">
          <h2 className="text-2xl font-semibold">The James Bond Ladder</h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "$5,000 → Fish",
              "$15,000 → Grinder",
              "$30,000 → Shark",
              "$75,000 → High Roller",
              "$100,000 → James Bond",
              "$250,000 → Casino Royale",
            ].map((entry) => (
              <div key={entry} className="rounded-lg border border-white/10 bg-black/25 p-3 text-sm text-[#B8C7BB]">
                {entry}
              </div>
            ))}
          </div>
        </section>

        <HowToPlay />
        <ArchetypeShowcase />
        <LeaderboardPreview />

        <section className="rounded-2xl border border-amber-300/30 bg-black/25 p-8 text-center">
          <p className="text-3xl font-semibold">$5,000 is waiting for you.</p>
          <p className="mt-2 text-[#B8C7BB]">No deposit. No real money. Just your skill.</p>
          <Link href="/game" className="mt-5 inline-block rounded-full bg-[#C9A84C] px-6 py-3 font-semibold text-black">
            Deal Me In
          </Link>
        </section>
      </main>
    </div>
  );
}
