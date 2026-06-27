export const SUITS = ["spades", "hearts", "diamonds", "clubs"] as const;
export const RANKS = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
] as const;

export type Suit = (typeof SUITS)[number];
export type Rank = (typeof RANKS)[number];

export type Card = {
  id: string;
  suit: Suit;
  rank: Rank;
  value: number;
};

export type HandCategory =
  | "high-card"
  | "one-pair"
  | "two-pair"
  | "three-of-a-kind"
  | "straight"
  | "flush"
  | "full-house"
  | "four-of-a-kind"
  | "straight-flush"
  | "royal-flush";

export type HandEvaluation = {
  category: HandCategory;
  score: number[];
  label: string;
  bestFive: Card[];
};

export type PlayerId = "hero" | "rock" | "maniac" | "shark" | "novice";

export type BotArchetypeKey = Exclude<PlayerId, "hero">;

export type BotArchetype = {
  name: string;
  emoji: string;
  style: "tight-passive" | "loose-aggressive" | "tight-aggressive" | "loose-passive";
  exploitTip: string;
  vpip: number;
  pfr: number;
  aggression: number;
  bluffFreq: number;
  foldToRaise: number;
};

export type PlayerActionType = "fold" | "check" | "call" | "raise";

export type PlayerAction = {
  playerId: PlayerId;
  type: PlayerActionType;
  amount: number;
  phase: GamePhase;
};

export type GamePhase =
  | "WAITING"
  | "POSTING_BLINDS"
  | "DEALING"
  | "PRE_FLOP"
  | "FLOP"
  | "TURN"
  | "RIVER"
  | "SHOWDOWN"
  | "HAND_COMPLETE";

export type SeatPosition = {
  top: string;
  left: string;
  transform: string;
};

export type ReadStats = {
  handsSeen: number;
  vpipHands: number;
  raises: number;
  opportunitiesToFoldToRaise: number;
  foldToRaiseCount: number;
  bluffsShown: number;
};

export type PlayerState = {
  id: PlayerId;
  name: string;
  emoji: string;
  chips: number;
  isHero: boolean;
  folded: boolean;
  isAllIn: boolean;
  hasActed: boolean;
  currentBet: number;
  totalContribution: number;
  cards: Card[];
  lastAction?: string;
  seat: SeatPosition;
  readStats: ReadStats;
  archetype?: BotArchetypeKey;
};

export type SidePot = {
  amount: number;
  eligible: PlayerId[];
};

export type HandHistoryEntry = {
  handId: string;
  playedAt: number;
  heroCards: Card[];
  communityCards: Card[];
  result: "won" | "lost" | "folded";
  potSize: number;
  chipDelta: number;
  xpEarned: number;
  serverSeedHash: string;
  serverSeed: string;
  summary: string;
};

export type XPEventId =
  | "correct_fold"
  | "correct_call"
  | "bluff_success"
  | "read_confirmed"
  | "hand_reviewed"
  | "survived_session"
  | "won_underdog"
  | "first_hand"
  | "reach_30k"
  | "reach_bond"
  | "hand_win";

export type PlayerProfile = {
  uid: string;
  displayName: string;
  email?: string;
  photoURL?: string;
  chipStack: number;
  totalXP: number;
  tier: string;
  chipTitle: string;
  handsPlayed: number;
  handsWon: number;
  totalWon: number;
  totalLost: number;
  biggestPot: number;
  winRate: number;
};
