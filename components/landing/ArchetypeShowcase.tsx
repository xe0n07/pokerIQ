const archetypes = [
  {
    name: "The Rock",
    style: "Plays few hands. Rarely bluffs.",
    exploit: "Steal blinds. Fold to aggression.",
  },
  {
    name: "The Maniac",
    style: "Bets and raises constantly. High variance.",
    exploit: "Trap with strong hands. Call down lighter.",
  },
  {
    name: "The Shark",
    style: "Balanced ranges. Reads timing and sizing.",
    exploit: "Randomize your patterns. Avoid predictability.",
  },
  {
    name: "The Calling Station",
    style: "Calls too wide. Rarely folds post-flop.",
    exploit: "Value bet thin. Never bluff.",
  },
];

export function ArchetypeShowcase() {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-8 md:p-12">
      <header className="max-w-2xl">
        <h2 className="text-3xl font-medium text-white md:text-4xl">Opponent Archetypes</h2>
        <p className="mt-2 text-white/60">Identify the player. Adjust your strategy.</p>
      </header>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {archetypes.map(({ name, style, exploit }) => (
          <article
            key={name}
            className="rounded-lg border border-white/10 bg-white/3 p-5 transition-colors hover:border-white/20 hover:bg-white/5"
          >
            <h3 className="font-medium text-white">{name}</h3>
            <p className="mt-2 text-sm text-white/60">{style}</p>
            <p className="mt-3 text-sm text-white/40">
              <span className="font-medium text-white/70">Exploit:</span> {exploit}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}