import { describe, expect, it } from "vitest";
import { evaluateHand } from "@/lib/game-engine/hand-evaluator";
import type { Card, Rank, Suit } from "@/types/poker";

const valueMap: Record<Rank, number> = {
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  "10": 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14,
};

function card(rank: Rank, suit: Suit): Card {
  return { id: `${rank}-${suit}`, rank, suit, value: valueMap[rank] };
}

describe("evaluateHand", () => {
  it("recognizes four of a kind", () => {
    const result = evaluateHand([
      card("K", "hearts"),
      card("K", "diamonds"),
      card("K", "clubs"),
      card("K", "spades"),
      card("A", "hearts"),
    ]);
    expect(result.label).toBe("Four of a Kind");
  });

  it("recognizes wheel straight", () => {
    const result = evaluateHand([
      card("A", "spades"),
      card("2", "hearts"),
      card("3", "diamonds"),
      card("4", "clubs"),
      card("5", "spades"),
      card("K", "hearts"),
      card("Q", "diamonds"),
    ]);
    expect(result.label).toBe("Straight");
    expect(result.score[1]).toBe(5);
  });

  it("handles split-pot equivalent hands", () => {
    const board = [
      card("A", "spades"),
      card("K", "spades"),
      card("Q", "spades"),
      card("J", "spades"),
      card("10", "spades"),
    ];
    const hero = evaluateHand([...board, card("2", "clubs"), card("3", "clubs")]);
    const villain = evaluateHand([...board, card("4", "diamonds"), card("5", "diamonds")]);
    expect(hero.score).toEqual(villain.score);
  });
});
