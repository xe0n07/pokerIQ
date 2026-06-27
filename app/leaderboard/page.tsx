"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ARCHETYPES } from "@/lib/bot/archetypes";
import { useGameStore } from "@/store/game-store";

export default function LeaderboardPage() {
  const players = useGameStore((state) => state.players);
  const heroChipTitle = useGameStore((state) => state.heroChipTitle);
  const handHistory = useGameStore((state) => state.handHistory);

  const rows = useMemo(
    () =>
      [...players]
        .map((player) => {
          const wins = handHistory.filter((entry) => entry.result === "won" && (player.id === "hero")).length;
          const handsPlayed = Math.max(handHistory.length, 1);
          return {
            ...player,
            chipTitle: player.isHero ? heroChipTitle : player.archetype ? ARCHETYPES[player.archetype].name : "Bot",
            handsPlayed,
            winRate: Math.round((wins / handsPlayed) * 100),
            netProfit: player.chips - 5_000,
          };
        })
        .sort((a, b) => (b.chips === a.chips ? b.winRate - a.winRate : b.chips - a.chips)),
    [handHistory, heroChipTitle, players],
  );

  return (
    <div className="min-h-screen bg-[#0A1A0F] px-4 py-8 text-[#F0EDE6]">
      <main className="mx-auto max-w-4xl space-y-4">
        <header className="flex items-center justify-between">
          <h1 className="text-4xl font-semibold">Leaderboard</h1>
          <Link href="/game" className="rounded-md border border-white/15 px-3 py-2 text-sm text-[#B8C7BB]">
            Back to game
          </Link>
        </header>
        <p className="text-[#B8C7BB]">347 players reached James Bond this week.</p>
        <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/25">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 text-[#B8C7BB]">
              <tr>
                <th className="px-4 py-3">Rank</th>
                <th className="px-4 py-3">Player</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Stack</th>
                <th className="px-4 py-3">Hands</th>
                <th className="px-4 py-3">Win Rate</th>
                <th className="px-4 py-3">Net Profit</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => {
                const medalClass =
                  index === 0 ? "bg-yellow-500/10" : index === 1 ? "bg-slate-400/10" : index === 2 ? "bg-amber-800/20" : "";
                return (
                  <tr key={row.id} className={`border-b border-white/5 ${medalClass}`}>
                    <td className="px-4 py-3">#{index + 1}</td>
                    <td className="px-4 py-3">
                      {row.isHero ? "👑 You" : `${row.emoji} ${row.name}`}
                    </td>
                    <td className="px-4 py-3">{row.chipTitle}</td>
                    <td className="px-4 py-3 font-mono text-emerald-300">${row.chips.toLocaleString()}</td>
                    <td className="px-4 py-3">{row.handsPlayed}</td>
                    <td className="px-4 py-3">{row.winRate}%</td>
                    <td className="px-4 py-3">{row.netProfit >= 0 ? "+" : ""}{row.netProfit.toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
