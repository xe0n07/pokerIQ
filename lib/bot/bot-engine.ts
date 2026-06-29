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
  difficultyBias?: number;
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
  const difficultyBias = input.difficultyBias ?? 0;
  const noise = (Math.random() - 0.5) * 0.16;
  const effectiveStrength = clamped(
    input.holeStrength + noise + difficultyBias * 0.4 - (input.beginnerLuckWeakening ? 0.16 : 0),
  );
  const callPressure = input.toCall / Math.max(input.chips, 1);

  const foldThreshold = clamped(
    0.16 + (1 - archetype.vpip / 100) * 0.18 + callPressure * 0.16 - difficultyBias * 0.18,
  );
  const raiseThreshold = clamped(
    0.56 - archetype.pfr / 220 - archetype.aggression / 15 + callPressure * 0.1 + difficultyBias * 0.08,
  );

  if (input.toCall > 0 && effectiveStrength < foldThreshold) {
    return { action: "fold" };
  }

  const canRaise = input.chips > input.toCall + 1;
  const bluffChance =
    Math.random() < Math.min(0.7, archetype.bluffFreq + difficultyBias * 0.22);

  if (
    canRaise &&
    (effectiveStrength > raiseThreshold ||
      (effectiveStrength > 0.38 && bluffChance))
  ) {
    const multiplier = 2 + Math.floor(Math.random() * 2);
    const raiseTarget = Math.min(
      input.minRaiseTo + multiplier * input.highestBet,
      input.currentBet + input.chips,
    );
    return { action: "raise", raiseTo: Math.max(input.minRaiseTo, raiseTarget) };
  }

  if (input.toCall === 0) {
    return { action: "check" };
  }

  if (effectiveStrength > foldThreshold - 0.08 || (effectiveStrength > 0.35 && Math.random() < 0.7)) {
    return { action: "call" };
  }

  return { action: "fold" };
}
