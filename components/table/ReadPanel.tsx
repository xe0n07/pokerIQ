import { ARCHETYPES } from "@/lib/bot/archetypes";
import type { PlayerState } from "@/types/poker";

function percentage(numerator: number, denominator: number) {
  if (denominator === 0) {
    return 0;
  }
  return Math.round((numerator / denominator) * 100);
}

export function ReadPanel({ bots }: { bots: PlayerState[] }) {
  return (
    <aside className="space-y-3 rounded-2xl border border-white/10 bg-black/35 p-4">
      <h3 className="text-sm font-semibold tracking-wide text-amber-300">Read Panel</h3>
      {bots.map((bot) => {
        const archetype = bot.archetype ? ARCHETYPES[bot.archetype] : undefined;
        const vpip = percentage(bot.readStats.vpipHands, Math.max(bot.readStats.handsSeen, 1));
        const foldToRaisePct = percentage(
          bot.readStats.foldToRaiseCount,
          Math.max(bot.readStats.opportunitiesToFoldToRaise, 1),
        );
        const aggressionLabel = bot.readStats.raises >= 4 ? "High" : bot.readStats.raises >= 2 ? "Medium" : "Low";

        return (
          <div key={bot.id} className="rounded-lg border border-white/10 bg-black/30 p-3 text-xs text-[#F0EDE6]">
            <div className="font-semibold">
              {bot.emoji} {bot.name}
            </div>
            <div className="text-white/65">{archetype?.style ?? "bot"}</div>
            <div className="mt-1 grid grid-cols-2 gap-y-1 text-white/80">
              <span>Hands</span>
              <span>{bot.readStats.handsSeen}</span>
              <span>VPIP</span>
              <span>{vpip}%</span>
              <span>Aggro</span>
              <span>{aggressionLabel}</span>
              <span>FvRaise</span>
              <span>{foldToRaisePct}%</span>
            </div>
          </div>
        );
      })}
    </aside>
  );
}
