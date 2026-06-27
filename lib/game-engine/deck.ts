import { RANKS, SUITS, type Card } from "@/types/poker";

const rankValue: Record<(typeof RANKS)[number], number> = {
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

export function createDeck(): Card[] {
  return SUITS.flatMap((suit) =>
    RANKS.map((rank) => ({
      id: `${rank}-${suit}`,
      suit,
      rank,
      value: rankValue[rank],
    })),
  );
}

export function shuffleDeck(deck: Card[], random: () => number): Card[] {
  const arr = [...deck];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function dealCards(deck: Card[], count: number) {
  return {
    cards: deck.slice(0, count),
    rest: deck.slice(count),
  };
}
