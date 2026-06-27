"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useGameStore } from "@/store/game-store";

export default function ProfilePage() {
  const handHistory = useGameStore((state) => state.handHistory);
  const heroXP = useGameStore((state) => state.heroXP);
  const heroTier = useGameStore((state) => state.heroTier);
  const heroTitle = useGameStore((state) => state.heroChipTitle);
  const chips = useGameStore((state) => state.players[0]?.chips ?? 0);

  const stats = useMemo(() => {
    const handsPlayed = handHistory.length;
    const handsWon = handHistory.filter((hand) => hand.result === "won").length;
    const totalWon = handHistory.filter((hand) => hand.chipDelta > 0).reduce((sum, hand) => sum + hand.chipDelta, 0);
    const totalLost = handHistory
      .filter((hand) => hand.chipDelta < 0)
      .reduce((sum, hand) => sum + Math.abs(hand.chipDelta), 0);
    return {
      handsPlayed,
      handsWon,
      winRate: handsPlayed ? Math.round((handsWon / handsPlayed) * 100) : 0,
      totalWon,
      totalLost,
      biggestPot: handHistory.reduce((max, hand) => Math.max(max, hand.potSize), 0),
    };
  }, [handHistory]);

  return (
    <div className="min-h-screen bg-[#0A1A0F] px-4 py-8 text-[#F0EDE6]">
      <main className="mx-auto max-w-5xl space-y-4">
        <header className="flex items-center justify-between">
          <h1 className="text-4xl font-semibold">Profile</h1>
          <div className="flex gap-2">
            <Link href="/game" className="rounded-md border border-white/15 px-3 py-2 text-sm text-[#B8C7BB]">
              Back to game
            </Link>
            <Link href="/learn" className="rounded-md border border-white/15 px-3 py-2 text-sm text-[#B8C7BB]">
              Learn
            </Link>
          </div>
        </header>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-white/10 bg-black/20 p-4">
            <div className="text-sm text-[#B8C7BB]">Chip Stack</div>
            <div className="mt-2 font-mono text-xl text-emerald-300">${chips.toLocaleString()}</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/20 p-4">
            <div className="text-sm text-[#B8C7BB]">Tier</div>
            <div className="mt-2 text-xl">{heroTier}</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/20 p-4">
            <div className="text-sm text-[#B8C7BB]">Chip Title</div>
            <div className="mt-2 text-xl">{heroTitle}</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/20 p-4">
            <div className="text-sm text-[#B8C7BB]">XP</div>
            <div className="mt-2 font-mono text-xl text-amber-300">{heroXP.toLocaleString()}</div>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-xl border border-white/10 bg-black/20 p-4">
            <div className="text-sm text-[#B8C7BB]">Hands</div>
            <div className="mt-2">{stats.handsPlayed}</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/20 p-4">
            <div className="text-sm text-[#B8C7BB]">Win Rate</div>
            <div className="mt-2">{stats.winRate}%</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/20 p-4">
            <div className="text-sm text-[#B8C7BB]">Total Won</div>
            <div className="mt-2 text-emerald-300">+${stats.totalWon.toLocaleString()}</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/20 p-4">
            <div className="text-sm text-[#B8C7BB]">Total Lost</div>
            <div className="mt-2 text-rose-300">-${stats.totalLost.toLocaleString()}</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/20 p-4">
            <div className="text-sm text-[#B8C7BB]">Biggest Pot</div>
            <div className="mt-2">${stats.biggestPot.toLocaleString()}</div>
          </div>
        </section>

        <section className="rounded-xl border border-white/10 bg-black/20 p-4">
          <h2 className="text-2xl font-semibold">Hand History</h2>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/10 text-[#B8C7BB]">
                <tr>
                  <th className="px-2 py-2">Hand</th>
                  <th className="px-2 py-2">Result</th>
                  <th className="px-2 py-2">Pot</th>
                  <th className="px-2 py-2">Chip Δ</th>
                  <th className="px-2 py-2">XP</th>
                </tr>
              </thead>
              <tbody>
                {handHistory.map((hand) => (
                  <tr key={hand.handId} className="border-b border-white/5">
                    <td className="px-2 py-2">{hand.handId}</td>
                    <td className="px-2 py-2">{hand.result}</td>
                    <td className="px-2 py-2">${hand.potSize.toLocaleString()}</td>
                    <td className={`px-2 py-2 ${hand.chipDelta >= 0 ? "text-emerald-300" : "text-rose-300"}`}>
                      {hand.chipDelta >= 0 ? "+" : ""}
                      {hand.chipDelta.toLocaleString()}
                    </td>
                    <td className="px-2 py-2">+{hand.xpEarned}</td>
                  </tr>
                ))}
                {handHistory.length === 0 ? (
                  <tr>
                    <td className="px-2 py-3 text-[#B8C7BB]" colSpan={5}>
                      No hands yet. Play your first hand on the game page.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
