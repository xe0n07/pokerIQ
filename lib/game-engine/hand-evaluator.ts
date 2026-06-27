import type { Card, HandCategory, HandEvaluation } from "@/types/poker";

const CATEGORY_SCORE: Record<HandCategory, number> = {
  "high-card": 0,
  "one-pair": 1,
  "two-pair": 2,
  "three-of-a-kind": 3,
  straight: 4,
  flush: 5,
  "full-house": 6,
  "four-of-a-kind": 7,
  "straight-flush": 8,
  "royal-flush": 9,
};

const LABELS: Record<HandCategory, string> = {
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

function sortDesc(values: number[]) {
  return [...values].sort((a, b) => b - a);
}

function compareScore(a: number[], b: number[]) {
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i += 1) {
    const av = a[i] ?? -1;
    const bv = b[i] ?? -1;
    if (av !== bv) {
      return av - bv;
    }
  }
  return 0;
}

function getStraightHigh(values: number[]) {
  const unique = [...new Set(values)].sort((a, b) => a - b);
  if (unique.includes(14)) {
    unique.unshift(1);
  }
  let run = 1;
  let bestHigh = -1;
  for (let i = 1; i < unique.length; i += 1) {
    if (unique[i] === unique[i - 1] + 1) {
      run += 1;
      if (run >= 5) {
        bestHigh = unique[i] === 1 ? 5 : unique[i];
      }
    } else if (unique[i] !== unique[i - 1]) {
      run = 1;
    }
  }
  return bestHigh;
}

function evaluateFive(cards: Card[]): HandEvaluation {
  const values = cards.map((card) => card.value);
  const sorted = sortDesc(values);
  const suitCounts = new Map<string, number>();
  const valueCounts = new Map<number, number>();
  cards.forEach((card) => {
    suitCounts.set(card.suit, (suitCounts.get(card.suit) ?? 0) + 1);
    valueCounts.set(card.value, (valueCounts.get(card.value) ?? 0) + 1);
  });

  const flush = [...suitCounts.values()].some((count) => count === 5);
  const straightHigh = getStraightHigh(values);
  const isStraight = straightHigh !== -1;

  const groups = [...valueCounts.entries()].sort((a, b) => {
    if (b[1] !== a[1]) {
      return b[1] - a[1];
    }
    return b[0] - a[0];
  });

  let category: HandCategory = "high-card";
  let kickers: number[] = sorted;

  if (flush && isStraight) {
    if (straightHigh === 14 && sorted.includes(10)) {
      category = "royal-flush";
      kickers = [14];
    } else {
      category = "straight-flush";
      kickers = [straightHigh];
    }
  } else if (groups[0][1] === 4) {
    category = "four-of-a-kind";
    const quad = groups[0][0];
    const kicker = groups.find((group) => group[0] !== quad)?.[0] ?? 0;
    kickers = [quad, kicker];
  } else if (groups[0][1] === 3 && groups[1]?.[1] === 2) {
    category = "full-house";
    kickers = [groups[0][0], groups[1][0]];
  } else if (flush) {
    category = "flush";
    kickers = sorted;
  } else if (isStraight) {
    category = "straight";
    kickers = [straightHigh];
  } else if (groups[0][1] === 3) {
    category = "three-of-a-kind";
    const trip = groups[0][0];
    const others = groups
      .filter((group) => group[0] !== trip)
      .map((group) => group[0])
      .sort((a, b) => b - a);
    kickers = [trip, ...others];
  } else if (groups[0][1] === 2 && groups[1]?.[1] === 2) {
    category = "two-pair";
    const highPair = Math.max(groups[0][0], groups[1][0]);
    const lowPair = Math.min(groups[0][0], groups[1][0]);
    const kicker = groups.find((group) => group[1] === 1)?.[0] ?? 0;
    kickers = [highPair, lowPair, kicker];
  } else if (groups[0][1] === 2) {
    category = "one-pair";
    const pair = groups[0][0];
    const others = groups
      .filter((group) => group[0] !== pair)
      .map((group) => group[0])
      .sort((a, b) => b - a);
    kickers = [pair, ...others];
  }

  return {
    category,
    score: [CATEGORY_SCORE[category], ...kickers],
    label: LABELS[category],
    bestFive: cards,
  };
}

function combinations(cards: Card[], choose: number) {
  const output: Card[][] = [];
  const path: Card[] = [];

  const walk = (start: number) => {
    if (path.length === choose) {
      output.push([...path]);
      return;
    }
    for (let i = start; i < cards.length; i += 1) {
      path.push(cards[i]);
      walk(i + 1);
      path.pop();
    }
  };

  walk(0);
  return output;
}

export function compareEvaluations(a: HandEvaluation, b: HandEvaluation) {
  return compareScore(a.score, b.score);
}

export function evaluateHand(cards: Card[]): HandEvaluation {
  if (cards.length < 5 || cards.length > 7) {
    throw new Error(`Expected 5-7 cards, got ${cards.length}`);
  }

  const candidateHands = cards.length === 5 ? [cards] : combinations(cards, 5);
  let best = evaluateFive(candidateHands[0]);

  for (let i = 1; i < candidateHands.length; i += 1) {
    const current = evaluateFive(candidateHands[i]);
    if (compareEvaluations(current, best) > 0) {
      best = current;
    }
  }
  return best;
}
