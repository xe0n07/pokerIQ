import Link from "next/link";

const sections = [
  {
    title: "1. What is Texas Hold'em?",
    body: "Each player gets two private cards, and five community cards are shared. Build the best 5-card hand.",
  },
  {
    title: "2. The Deck and Card Values",
    body: "A standard 52-card deck. Ace can be high (A-K-Q-J-10) or low (A-2-3-4-5) in straights.",
  },
  {
    title: "3. Hand Rankings",
    body: "Royal Flush, Straight Flush, Four of a Kind, Full House, Flush, Straight, Trips, Two Pair, Pair, High Card.",
  },
  {
    title: "4. Table Positions",
    body: "UTG acts first pre-flop, BTN acts last. Position gives information and control.",
  },
  {
    title: "5. Betting Rounds",
    body: "Pre-Flop, Flop, Turn, River. Every round allows fold/check/call/raise decisions.",
  },
  {
    title: "6. Pot Odds and Calls",
    body: "Compare what you must call versus what you can win to choose profitable calls.",
  },
  {
    title: "7. Reading Opponents",
    body: "Track aggression, fold frequency, and bluff tendency. PokerIQ's Read Panel teaches this live.",
  },
  {
    title: "8. Common Beginner Mistakes",
    body: "Calling too much pre-flop, bluffing random players, chasing every draw, and ignoring position.",
  },
  {
    title: "9. Glossary",
    body: "VPIP, PFR, c-bet, check-raise, value bet, and range are core terms to master.",
  },
];

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-[#0A1A0F] px-4 py-8 text-[#F0EDE6]">
      <main className="mx-auto max-w-4xl space-y-4">
        <header className="flex items-center justify-between">
          <h1 className="text-4xl font-semibold">Learn Poker</h1>
          <Link href="/game" className="rounded-md border border-white/15 px-3 py-2 text-sm text-[#B8C7BB]">
            Back to game
          </Link>
        </header>
        <div className="space-y-3">
          {sections.map((section) => (
            <section key={section.title} className="rounded-xl border border-white/10 bg-black/20 p-5">
              <h2 className="text-xl font-semibold">{section.title}</h2>
              <p className="mt-2 text-[#B8C7BB]">{section.body}</p>
            </section>
          ))}
        </div>
        <div className="rounded-xl border border-amber-300/25 bg-black/25 p-6 text-center">
          <p className="text-xl">Ready to practice?</p>
          <Link href="/game" className="mt-3 inline-block rounded-full bg-[#C9A84C] px-6 py-3 font-semibold text-black">
            Deal Me In
          </Link>
        </div>
      </main>
    </div>
  );
}
