"use client";

const rankings = [
  {
    name: "Royal Flush",
    desc: "A K Q J T — all same suit. The unbeatable hand.",
    example: "A♠ K♠ Q♠ J♠ T♠",
    rarity: "Mythic",
    rarityColor: "text-amber-300",
    rarityBg: "bg-amber-400/10 border-amber-400/20",
    suitColor: "text-amber-200",
  },
  {
    name: "Straight Flush",
    desc: "Five consecutive cards of the same suit.",
    example: "9♥ 8♥ 7♥ 6♥ 5♥",
    rarity: "Legendary",
    rarityColor: "text-purple-300",
    rarityBg: "bg-purple-400/10 border-purple-400/20",
    suitColor: "text-red-300",
  },
  {
    name: "Four of a Kind",
    desc: "All four of the same rank plus any kicker.",
    example: "K♣ K♦ K♥ K♠ 3♦",
    rarity: "Epic",
    rarityColor: "text-violet-300",
    rarityBg: "bg-violet-400/10 border-violet-400/20",
    suitColor: "text-white/70",
  },
  {
    name: "Full House",
    desc: "Three of a kind plus a pair.",
    example: "A♠ A♥ A♦ K♣ K♦",
    rarity: "Rare",
    rarityColor: "text-blue-300",
    rarityBg: "bg-blue-400/10 border-blue-400/20",
    suitColor: "text-white/70",
  },
  {
    name: "Flush",
    desc: "Any five cards of the same suit, non-sequential.",
    example: "A♣ J♣ 8♣ 4♣ 2♣",
    rarity: "Uncommon",
    rarityColor: "text-teal-300",
    rarityBg: "bg-teal-400/10 border-teal-400/20",
    suitColor: "text-white/70",
  },
  {
    name: "Straight",
    desc: "Five consecutive cards of mixed suits.",
    example: "9♠ 8♥ 7♦ 6♣ 5♥",
    rarity: "Uncommon",
    rarityColor: "text-teal-300",
    rarityBg: "bg-teal-400/10 border-teal-400/20",
    suitColor: "text-white/70",
  },
  {
    name: "Three of a Kind",
    desc: "Three cards of the same rank with two kickers.",
    example: "Q♠ Q♥ Q♦ 7♣ 2♦",
    rarity: "Common",
    rarityColor: "text-green-300",
    rarityBg: "bg-green-400/10 border-green-400/20",
    suitColor: "text-white/70",
  },
  {
    name: "Two Pair",
    desc: "Two distinct pairs with one kicker.",
    example: "J♠ J♥ 5♦ 5♣ K♠",
    rarity: "Common",
    rarityColor: "text-green-300",
    rarityBg: "bg-green-400/10 border-green-400/20",
    suitColor: "text-white/70",
  },
  {
    name: "One Pair",
    desc: "A single pair with three kickers.",
    example: "T♠ T♥ A♦ 8♣ 3♠",
    rarity: "Common",
    rarityColor: "text-green-300",
    rarityBg: "bg-green-400/10 border-green-400/20",
    suitColor: "text-white/70",
  },
  {
    name: "High Card",
    desc: "No combination. Highest card plays.",
    example: "A♠ K♥ 9♦ 6♣ 2♠",
    rarity: "Basic",
    rarityColor: "text-white/40",
    rarityBg: "bg-white/5 border-white/10",
    suitColor: "text-white/70",
  },
];

export function HandRankings() {
  return (
    <div className="mt-6 grid gap-2 sm:grid-cols-2">
      {rankings.map(({ name, desc, example, rarity, rarityColor, rarityBg, suitColor }, i) => (
        <article
          key={name}
          className="group flex items-start gap-4 rounded-xl border border-white/[0.07] bg-white/[0.03] p-4 transition-all duration-200 hover:border-white/15 hover:bg-white/[0.06]"
        >
          {/* Rank number */}
          <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-lg bg-white/5 border border-white/8">
            <span className="font-mono text-xs font-bold text-white/30">{i + 1}</span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-semibold text-sm text-white leading-none">{name}</h4>
              <span className={`inline-flex items-center rounded-full border px-1.5 py-0.5 font-mono text-[9px] tracking-wider uppercase ${rarityBg} ${rarityColor}`}>
                {rarity}
              </span>
            </div>
            <p className="mt-1 text-xs text-white/40 leading-relaxed">{desc}</p>
            <p className={`mt-1.5 font-mono text-xs ${suitColor} tracking-wider`}>{example}</p>
          </div>
        </article>
      ))}
    </div>
  );
}