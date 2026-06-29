"use client";

import Link from "next/link";

const leaders = [
  { rank: 1, name: "Max", chips: 126440, winRate: "63%", title: "Casino Royale", streak: 12, avatar: "AR" },
  { rank: 2, name: "Leonardo", chips: 99210, winRate: "58%", title: "James Bond", streak: 7, avatar: "RS" },
  { rank: 3, name: "The Rock", chips: 74300, winRate: "56%", title: "High Roller", streak: 4, avatar: "FS" },
  { rank: 4, name: "You", chips: 5000, winRate: "—", title: "Fish", streak: 0, avatar: "YOU", isUser: true },
];

const maxChips = 126440;

const rankStyles: Record<number, { badge: string; text: string; icon: string }> = {
  1: { badge: "bg-amber-400/20 border-amber-400/40", text: "text-amber-300", icon: "🥇" },
  2: { badge: "bg-slate-400/15 border-slate-400/30", text: "text-slate-300", icon: "🥈" },
  3: { badge: "bg-amber-700/20 border-amber-700/30", text: "text-amber-600", icon: "🥉" },
  4: { badge: "bg-white/5 border-white/10", text: "text-white/30", icon: "—" },
};

export function LeaderboardPreview() {
  return (
    <section className="rounded-2xl border border-white/8 bg-[#071510]/60 px-6 py-10 md:px-10 md:py-14">
      <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
        <div>
          <span className="font-mono text-xs tracking-[0.18em] text-amber-400/60 uppercase">Season standings</span>
          <h2
            className="mt-2 text-3xl font-bold text-white md:text-4xl"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Leaderboard
          </h2>
        </div>
        <Link
          href="/leaderboard"
          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-4 py-2 text-xs text-white/50 transition-all hover:border-white/20 hover:text-white/80"
        >
          Full standings
          <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto -mx-1">
        <table className="w-full text-left text-sm min-w-[520px]" role="table">
          <thead>
            <tr className="border-b border-white/8">
              <th className="pb-3 pl-1 font-mono text-[10px] tracking-widest uppercase text-white/25 w-10">Rank</th>
              <th className="pb-3 font-mono text-[10px] tracking-widest uppercase text-white/25">Player</th>
              <th className="pb-3 font-mono text-[10px] tracking-widest uppercase text-white/25 text-right pr-4 hidden sm:table-cell">Title</th>
              <th className="pb-3 font-mono text-[10px] tracking-widest uppercase text-white/25 text-right pr-4 hidden md:table-cell">Win %</th>
              <th className="pb-3 font-mono text-[10px] tracking-widest uppercase text-white/25 text-right">Chips</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {leaders.map(({ rank, name, chips, winRate, title, streak, avatar, isUser }) => {
              const rs = rankStyles[rank];
              const barWidth = Math.round((chips / maxChips) * 100);
              return (
                <tr
                  key={name}
                  className={`group relative transition-colors duration-150 ${isUser ? "bg-amber-400/[0.04]" : "hover:bg-white/[0.02]"}`}
                >
                  {/* Rank */}
                  <td className="py-4 pl-1">
                    <div className={`inline-flex h-7 w-7 items-center justify-center rounded-lg border font-mono text-xs font-bold ${rs.badge} ${rs.text}`}>
                      {rank}
                    </div>
                  </td>

                  {/* Player */}
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className={`flex-shrink-0 flex h-9 w-9 items-center justify-center rounded-full font-mono font-bold text-xs border ${isUser ? "bg-amber-400/20 border-amber-400/30 text-amber-300" : "bg-white/5 border-white/10 text-white/50"}`}>
                        {avatar.slice(0, 2)}
                      </div>
                      <div>
                        <div className={`font-semibold text-sm ${isUser ? "text-amber-200" : "text-white"}`}>
                          {name}
                          {isUser && (
                            <span className="ml-2 rounded-full bg-amber-400/15 border border-amber-400/25 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-amber-400">
                              You
                            </span>
                          )}
                        </div>
                        {/* Chip bar */}
                        <div className="mt-1 flex items-center gap-2">
                          <div className="h-1 w-20 rounded-full bg-white/5 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${isUser ? "bg-amber-400/50" : rank === 1 ? "bg-amber-400" : rank === 2 ? "bg-slate-400" : "bg-amber-700/70"}`}
                              style={{ width: `${barWidth}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Title */}
                  <td className="py-4 pr-4 text-right hidden sm:table-cell">
                    <span className="font-mono text-[11px] text-white/30">{title}</span>
                  </td>

                  {/* Win rate */}
                  <td className="py-4 pr-4 text-right hidden md:table-cell">
                    <span className={`font-mono text-sm font-medium ${winRate !== "—" ? "text-green-400/70" : "text-white/20"}`}>
                      {winRate}
                    </span>
                  </td>

                  {/* Chips */}
                  <td className="py-4 text-right">
                    <div>
                      <span className={`font-mono text-sm font-bold ${isUser ? "text-amber-300" : "text-white/80"}`}>
                        ${chips.toLocaleString()}
                      </span>
                      {streak > 0 && (
                        <div className="mt-0.5 text-right">
                          <span className="font-mono text-[9px] text-orange-400/60">
                            🔥 {streak}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* CTA row */}
      <div className="mt-6 flex items-center gap-3 rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-4">
        <div className="flex-1">
          <p className="text-sm text-white/60">
            <span className="text-white/80 font-medium">You&apos;re ranked #4</span> with $5,000 in chips. Play more hands to climb.
          </p>
        </div>
        <Link
          href="/game"
          className="flex-shrink-0 inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-4 py-2 text-xs font-semibold text-black transition-all hover:bg-amber-300 active:scale-95"
        >
          Play now
        </Link>
      </div>
    </section>
  );
}