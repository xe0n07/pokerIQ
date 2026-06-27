import { ARCHETYPES } from "@/lib/bot/archetypes";
import type { BotArchetypeKey, PlayerActionType } from "@/types/poker";

type BotDecisionInput = {
  archetype: BotArchetypeKey;
  toCall: number;
  currentBet: number;
  highestBet: number;
  chips: number;
  holeStrength: number;
  beginnerLuckWeakening: boolean;
  minRaiseTo: number;
};

export type BotDecision = {
  action: PlayerActionType;
  raiseTo?: number;
};

function clamped(value: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

export function estimatePreflopStrength(values: number[]) {
  const sorted = [...values].sort((a, b) => b - a);
  const pairBoost = sorted[0] === sorted[1] ? 0.35 : 0;
  const highCardBoost = (sorted[0] + sorted[1]) / 28;
  return clamped(0.15 + pairBoost + highCardBoost * 0.5);
}

export function decideBotAction(input: BotDecisionInput): BotDecision {
  const archetype = ARCHETYPES[input.archetype];
  const noise = (Math.random() - 0.5) * 0.2;
  const effectiveStrength = clamped(
    input.holeStrength + noise - (input.beginnerLuckWeakening ? 0.2 : 0),
  );
  const callPressure = input.toCall / Math.max(input.chips, 1);

  const foldThreshold = clamped(0.2 + (1 - archetype.vpip / 100) * 0.5 + callPressure * 0.4);
  const raiseThreshold = clamped(
    0.62 - archetype.pfr / 240 - archetype.aggression / 14 + callPressure * 0.15,
  );

  if (input.toCall > 0 && effectiveStrength < foldThreshold) {
    return { action: "fold" };
  }

  const canRaise = input.chips > input.toCall + 1;
  if (
    canRaise &&
    (effectiveStrength > raiseThreshold ||
      (effectiveStrength < 0.35 && Math.random() < archetype.bluffFreq * 0.4))
  ) {
    const multiplier = 2 + Math.floor(Math.random() * 2);
    const raiseTarget = Math.min(input.minRaiseTo + multiplier * input.highestBet, input.currentBet + input.chips);
    return { action: "raise", raiseTo: Math.max(input.minRaiseTo, raiseTarget) };
  }

  if (input.toCall === 0) {
    return { action: "check" };
  }

  return { action: "call" };
}
