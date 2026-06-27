export const STARTING_STACK = 5_000;
export const RESET_STACK = 5_000;
export const SMALL_BLIND = 50;
export const BIG_BLIND = 100;
export const BOT_THINK_MIN_MS = 1500;
export const BOT_THINK_MAX_MS = 2500;

export const PHASE_TO_BOARD_CARDS: Record<string, number> = {
  PRE_FLOP: 0,
  FLOP: 3,
  TURN: 4,
  RIVER: 5,
};

export const HAND_RANKINGS = [
  "Royal Flush",
  "Straight Flush",
  "Four of a Kind",
  "Full House",
  "Flush",
  "Straight",
  "Three of a Kind",
  "Two Pair",
  "One Pair",
  "High Card",
];
