const leaders = [
  { rank: 1, name: "AceRaptor", chips: 126440, winRate: "63%" },
  { rank: 2, name: "RiverSaint", chips: 99210, winRate: "58%" },
  { rank: 3, name: "FoldSniper", chips: 74300, winRate: "56%" },
  { rank: 4, name: "You", chips: 5000, winRate: "—" },
];

export function LeaderboardPreview() {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-8 md:p-12">
      <header className="max-w-2xl">
        <h2 className="text-3xl font-medium text-white md:text-4xl">Leaderboard</h2>
        <p className="mt-2 text-white/60">Top players this season.</p>
      </header>
      <div className="mt-8 overflow-x-auto">
        <table className="w-full text-left text-sm" role="table">
          <thead>
            <tr className="border-b border-white/10">
              <th className="pb-3 font-mono text-white/40 w-12">Rank</th>
              <th className="pb-3 font-medium text-white">Player</th>
              <th className="pb-3 font-mono text-white/40 text-right pr-4">Chips</th>
              <th className="pb-3 font-mono text-white/40 text-right pr-4">Win %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {leaders.map(({ rank, name, chips, winRate }) => (
              <tr key={name} className={rank === 4 ? "bg-white/3" : ""}>
                <td className="py-3 font-mono text-white/40">{rank}</td>
                <td className="py-3 font-medium text-white">{name}</td>
                <td className="py-3 font-mono text-white/60 text-right pr-4">{chips.toLocaleString()}</td>
                <td className="py-3 font-mono text-white/60 text-right pr-4">{winRate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}