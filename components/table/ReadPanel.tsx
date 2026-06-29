  import { ARCHETYPES } from "@/lib/bot/archetypes";
import type { PlayerState } from "@/types/poker";

function percentage(numerator: number, denominator: number) {
  return denominator === 0 ? 0 : Math.round((numerator / denominator) * 100);
}

export function ReadPanel({ bots }: { bots: PlayerState[] }) {
  return (
    <aside className="space-y-3 rounded-2xl border border-white/10 bg-black/35 p-4">
      <h3 className="text-sm font-semibold tracking-wide text-amber-300">Read Panel</h3>
      {bots.map((bot) => {
        const archetype = bot.archetype ? ARCHETYPES[bot.archetype] : undefined;
        const vpip = percentage(bot.readStats.vpipHands, Math.max(bot.readStats.handsSeen, 1));
        const aggressionLabel =
          bot.readStats.raises >= 4 ? "High" : bot.readStats.raises >= 2 ? "Medium" : "Low";

        return (
          <div key={bot.id} className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-[#F0EDE6]">
            <div className="font-semibold text-white">{bot.name}</div>
            <div className="mt-1 text-xs uppercase tracking-[0.24em] text-amber-200">
              {archetype?.style ?? "Unknown style"}
            </div>
            <div className="mt-3 grid gap-2 text-sm text-[#B8C7BB] sm:grid-cols-2">
              <div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-white/40">VPIP</div>
                <div className="mt-1 text-white">{vpip}%</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-white/40">Aggression</div>
                <div className="mt-1 text-white">{aggressionLabel}</div>
              </div>
            </div>
          </div>
        );
      })}
    </aside>
  );
}
