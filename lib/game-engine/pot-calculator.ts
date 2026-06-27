import { compareEvaluations } from "@/lib/game-engine/hand-evaluator";
import type { HandEvaluation, PlayerId, SidePot } from "@/types/poker";

type Contribution = {
  playerId: PlayerId;
  amount: number;
  folded: boolean;
};

export function calculateSidePots(contributions: Contribution[]): SidePot[] {
  const active = contributions.filter((contribution) => contribution.amount > 0);
  if (active.length === 0) {
    return [];
  }

  const sorted = [...active].sort((a, b) => a.amount - b.amount);
  const sidePots: SidePot[] = [];
  let previous = 0;

  for (let i = 0; i < sorted.length; i += 1) {
    const level = sorted[i].amount;
    const layer = level - previous;
    if (layer <= 0) {
      continue;
    }

    const contenders = sorted.slice(i);
    const potAmount = layer * contenders.length;
    const eligible = contenders.filter((player) => !player.folded).map((player) => player.playerId);

    sidePots.push({
      amount: potAmount,
      eligible,
    });
    previous = level;
  }

  return sidePots;
}

export function distributePots(
  pots: SidePot[],
  handRanks: Partial<Record<PlayerId, HandEvaluation>>,
  seatOrder: PlayerId[],
) {
  const payouts: Partial<Record<PlayerId, number>> = {};

  for (const pot of pots) {
    const eligibleEvaluated = pot.eligible
      .map((id) => ({ id, evaluation: handRanks[id] }))
      .filter((entry): entry is { id: PlayerId; evaluation: HandEvaluation } => Boolean(entry.evaluation));

    if (eligibleEvaluated.length === 0) {
      continue;
    }

    let best = eligibleEvaluated[0].evaluation;
    for (const entry of eligibleEvaluated.slice(1)) {
      if (compareEvaluations(entry.evaluation, best) > 0) {
        best = entry.evaluation;
      }
    }

    const winners = eligibleEvaluated
      .filter((entry) => compareEvaluations(entry.evaluation, best) === 0)
      .map((entry) => entry.id);

    const baseShare = Math.floor(pot.amount / winners.length);
    const oddChip = pot.amount - baseShare * winners.length;
    winners.forEach((winner) => {
      payouts[winner] = (payouts[winner] ?? 0) + baseShare;
    });

    if (oddChip > 0) {
      const orderedWinners = [...winners].sort(
        (a, b) => seatOrder.indexOf(a) - seatOrder.indexOf(b),
      );
      payouts[orderedWinners[0]] = (payouts[orderedWinners[0]] ?? 0) + oddChip;
    }
  }

  return payouts;
}
