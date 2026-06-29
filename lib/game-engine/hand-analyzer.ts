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

export function describeHand(cards: Card[]) {
  if (cards.length < 2) {
    return "Waiting for cards";
  }

  const evaluation = evaluateHand(cards);
  const label = HAND_CATEGORY_LABELS[evaluation.category] ?? "Unknown Hand";
  return evaluation.label ? `${label} — ${evaluation.label}` : label;
}