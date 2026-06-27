import { HandRankings } from "@/components/landing/HandRankings";

const steps = [
  "The Deal — each player gets 2 private cards.",
  "Pre-Flop — first betting round.",
  "The Flop — three community cards and betting.",
  "The Turn — fourth community card and betting.",
  "The River — final card and final betting round.",
  "Showdown — best 5-card hand wins the pot.",
];

export function HowToPlay() {
  return (
    <section id="how-to-play" className="rounded-2xl border border-white/10 bg-white/5 p-8 md:p-12">
      <header className="max-w-2xl">
        <h2 className="text-3xl font-medium text-white md:text-4xl">How to Play Texas Hold'em</h2>
        <p className="mt-2 text-white/60">Six streets. One winner.</p>
      </header>
      <ol className="mt-8 max-w-2xl space-y-3 text-white/70">
        {steps.map((step, i) => (
          <li key={step} className="flex gap-3 text-base">
            <span className="font-mono text-white/30 shrink-0">{i + 1}.</span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
      <div className="mt-12">
        <h3 className="text-xl font-medium text-white">Hand Rankings</h3>
        <HandRankings />
      </div>
    </section>
  );
}