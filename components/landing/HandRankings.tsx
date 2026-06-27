"use client";

const rankings = [
  { name: "Royal Flush", desc: "A♠ K♠ Q♠ J♠ T♠ — Unbeatable." },
  { name: "Straight Flush", desc: "9♥ 8♥ 7♥ 6♥ 5♥ — Five sequential suited." },
  { name: "Four of a Kind", desc: "K♣ K♦ K♥ K♠ 3♦ — Quads plus kicker." },
  { name: "Full House", desc: "A♠ A♥ A♦ K♣ K♦ — Trips plus a pair." },
  { name: "Flush", desc: "A♣ J♣ 8♣ 4♣ 2♣ — Five same suit, any order." },
  { name: "Straight", desc: "9♠ 8♥ 7♦ 6♣ 5♥ — Five sequential, mixed suits." },
  { name: "Three of a Kind", desc: "Q♠ Q♥ Q♦ 7♣ 2♦ — Trips with two kickers." },
  { name: "Two Pair", desc: "J♠ J♥ 5♦ 5♣ K♠ — Two distinct pairs." },
  { name: "Pair", desc: "T♠ T♥ A♦ 8♣ 3♠ — One pair, three kickers." },
  { name: "High Card", desc: "A♠ K♥ 9♦ 6♣ 2♠ — No combination. Ace high." },
];

export function HandRankings() {
  return (
    <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {rankings.map(({ name, desc }, i) => (
        <article
          key={name}
          className="rounded-lg border border-white/10 bg-white/3 p-4 transition-colors hover:border-white/20 hover:bg-white/5"
        >
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-white/30 text-sm">{i + 1}.</span>
            <h4 className="font-medium text-white">{name}</h4>
          </div>
          <p className="mt-2 text-sm text-white/50">{desc}</p>
        </article>
      ))}
    </div>
  );
}