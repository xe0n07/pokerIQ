import { evaluateHand } from "./hand-evaluator";
import type { Card } from "@/types/poker";

const HAND_CATEGORY_LABELS: Record<string, string> = {
  "high-card": "High Card",
  "one-pair": "One Pair",
  "two-pair": "Two Pair",
  "three-of-a-kind": "Three of a Kind",
  straight: "Straight",
  flush: "Flush",
  "full-house": "Full House",
  "four-of-a-kind": "Four of a Kind",
  "straight-flush": "Straight Flush",
  "royal-flush": "Royal Flush",
};

function countValues(cards: Card[]) {
  return cards.reduce<Record<number, number>>((acc, card) => {
    acc[card.value] = (acc[card.value] ?? 0) + 1;
    return acc;
  }, {});
}

function countSuits(cards: Card[]) {
  return cards.reduce<Record<string, number>>((acc, card) => {
    acc[card.suit] = (acc[card.suit] ?? 0) + 1;
    return acc;
  }, {});
}

function uniqueSortedValues(cards: Card[]) {
  return Array.from(new Set(cards.map((card) => card.value))).sort((a, b) => a - b);
}

function isSequential(values: number[]) {
  if (values.length < 3) return false;
  for (let i = 1; i < values.length; i += 1) {
    if (values[i] !== values[i - 1] + 1) {
      return false;
    }
  }
  return true;
}

export function describeHand(cards: Card[]) {
  if (cards.length < 2) {
    return "Waiting for cards";
  }

  if (cards.length >= 5) {
    const evaluation = evaluateHand(cards);
    return HAND_CATEGORY_LABELS[evaluation.category] ?? evaluation.label ?? "Unknown Hand";
  }

  const values = uniqueSortedValues(cards);
  const valueCounts = Object.values(countValues(cards)).sort((a, b) => b - a);
  const suitCounts = Object.values(countSuits(cards));
  const isFlushDraw = suitCounts.some((count) => count === cards.length && cards.length >= 2);
  const hasStraightPotential = isSequential(values);

  if (valueCounts[0] === 3) {
    return "Three of a Kind";
  }

  if (valueCounts[0] === 2 && valueCounts[1] === 2) {
    return "Two Pair";
  }

  if (valueCounts[0] === 2) {
    return cards.length === 2 ? "Pocket Pair" : "One Pair";
  }

  if (isFlushDraw) {
    return cards.length === 2 ? "Suited Cards" : "Flush Draw";
  }

  if (hasStraightPotential) {
    return cards.length === 2 ? "Connected Cards" : "Straight Draw";
  }

  return cards.length === 2
    ? `High Cards (${cards[0].rank}, ${cards[1].rank})`
    : "High Cards";
}