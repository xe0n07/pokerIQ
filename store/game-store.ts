"use client";

import { create } from "zustand";
import { ARCHETYPES } from "@/lib/bot/archetypes";
import { decideBotAction, estimatePreflopStrength } from "@/lib/bot/bot-engine";
import { CHIP_TITLES, getChipTitleByStack, getTierByXP } from "@/lib/constants/titles";
import { BIG_BLIND, RESET_STACK, SMALL_BLIND, STARTING_STACK } from "@/lib/constants/poker-rules";
import { createDeck, dealCards, shuffleDeck } from "@/lib/game-engine/deck";
import { evaluateHand } from "@/lib/game-engine/hand-evaluator";
import { calculateSidePots, distributePots } from "@/lib/game-engine/pot-calculator";
import { createSeededRandom, generateServerSeed, getSeedHash } from "@/lib/game-engine/rng";
import { sumXP } from "@/lib/xp/xp-engine";
import type {
  GamePhase,
  HandEvaluation,
  HandHistoryEntry,
  PlayerActionType,
  PlayerId,
  PlayerState,
  ReadStats,
  SeatPosition,
  XPEventId,
} from "@/types/poker";

const PLAYER_ORDER: PlayerId[] = ["hero", "rock", "maniac", "shark", "novice"];

const SEATS: Record<PlayerId, SeatPosition> = {
  hero: { top: "72%", left: "50%", transform: "translate(-50%, -50%)" },
  rock: { top: "18%", left: "18%", transform: "translate(-50%, -50%)" },
  maniac: { top: "18%", left: "82%", transform: "translate(-50%, -50%)" },
  shark: { top: "52%", left: "15%", transform: "translate(-50%, -50%)" },
  novice: { top: "52%", left: "85%", transform: "translate(-50%, -50%)" },
};

function defaultReadStats(): ReadStats {
  return {
    handsSeen: 0,
    vpipHands: 0,
    raises: 0,
    opportunitiesToFoldToRaise: 0,
    foldToRaiseCount: 0,
    bluffsShown: 0,
  };
}

function createInitialPlayers(): PlayerState[] {
  return [
    {
      id: "hero",
      name: "You",
      emoji: "💰",
      chips: STARTING_STACK,
      isHero: true,
      folded: false,
      isAllIn: false,
      hasActed: false,
      currentBet: 0,
      totalContribution: 0,
      cards: [],
      seat: SEATS.hero,
      readStats: defaultReadStats(),
    },
    {
      id: "rock",
      name: ARCHETYPES.rock.name,
      emoji: ARCHETYPES.rock.emoji,
      archetype: "rock",
      chips: STARTING_STACK,
      isHero: false,
      folded: false,
      isAllIn: false,
      hasActed: false,
      currentBet: 0,
      totalContribution: 0,
      cards: [],
      seat: SEATS.rock,
      readStats: defaultReadStats(),
    },
    {
      id: "maniac",
      name: ARCHETYPES.maniac.name,
      emoji: ARCHETYPES.maniac.emoji,
      archetype: "maniac",
      chips: STARTING_STACK,
      isHero: false,
      folded: false,
      isAllIn: false,
      hasActed: false,
      currentBet: 0,
      totalContribution: 0,
      cards: [],
      seat: SEATS.maniac,
      readStats: defaultReadStats(),
    },
    {
      id: "shark",
      name: ARCHETYPES.shark.name,
      emoji: ARCHETYPES.shark.emoji,
      archetype: "shark",
      chips: STARTING_STACK,
      isHero: false,
      folded: false,
      isAllIn: false,
      hasActed: false,
      currentBet: 0,
      totalContribution: 0,
      cards: [],
      seat: SEATS.shark,
      readStats: defaultReadStats(),
    },
    {
      id: "novice",
      name: ARCHETYPES.novice.name,
      emoji: ARCHETYPES.novice.emoji,
      archetype: "novice",
      chips: STARTING_STACK,
      isHero: false,
      folded: false,
      isAllIn: false,
      hasActed: false,
      currentBet: 0,
      totalContribution: 0,
      cards: [],
      seat: SEATS.novice,
      readStats: defaultReadStats(),
    },
  ];
}

function activePlayers(players: PlayerState[]) {
  return players.filter((player) => !player.folded);
}

function findNextActiveIndex(players: PlayerState[], start: number) {
  for (let i = 1; i <= players.length; i += 1) {
    const idx = (start + i) % players.length;
    if (!players[idx].folded && !players[idx].isAllIn) {
      return idx;
    }
  }
  return start;
}

type PendingWin = {
  amount: number;
  xpEarned: number;
  bonusXp: number;
  isPremiumBoost: boolean;
};

type GameState = {
  phase: GamePhase;
  players: PlayerState[];
  deck: ReturnType<typeof createDeck>;
  communityCards: ReturnType<typeof createDeck>;
  dealerIndex: number;
  turnIndex: number;
  currentBet: number;
  lastRaiseSize: number;
  pot: number;
  handNumber: number;
  heroXP: number;
  heroTier: string;
  heroChipTitle: string;
  raiseTarget: number;
  logs: string[];
  handHistory: HandHistoryEntry[];
  lastHandXP: number;
  lastBonusXP: number;
  winStreak: number;
  lastWinners: PlayerId[];
  serverSeed: string;
  serverSeedHash: string;
  handNonce: number;
  heroStartOfHandChips: number;
  warningText: string | null;
  pendingWin: PendingWin | null;
  premiumTickets: number;
  dailyBonusClaimed: boolean;
  premiumBoostUntilHand: number | null;
  questProgress: number;
  foldLockUsed: boolean;

  init: () => void;
  startHand: () => void;
  heroFold: () => void;
  heroCallOrCheck: () => void;
  heroRaise: (raiseTo: number) => void;
  botAct: () => void;
  setRaiseTarget: (target: number) => void;
  clearPendingWin: () => void;
  claimDailyBonus: () => void;
  activatePremiumBoost: () => void;
};

function resetForNewHand(players: PlayerState[]) {
  return players.map((player) => {
    const shouldReset = player.chips <= 0;
    return {
      ...player,
      chips: shouldReset ? RESET_STACK : player.chips,
      folded: false,
      isAllIn: false,
      hasActed: false,
      currentBet: 0,
      totalContribution: 0,
      cards: [],
      lastAction:
        shouldReset && player.isHero ? "Reset to $5,000. Welcome back, Mr. Bond." : undefined,
      readStats: {
        ...player.readStats,
        handsSeen: player.isHero ? player.readStats.handsSeen : player.readStats.handsSeen + 1,
      },
    };
  });
}

function executeAction(
  state: GameState,
  actorIndex: number,
  action: PlayerActionType,
  raiseTo?: number,
): Partial<GameState> {
  const players = state.players.map((player) => ({ ...player }));
  const actor = players[actorIndex];

  if (!actor || actor.folded || actor.isAllIn) {
    return {};
  }

  const toCall = Math.max(0, state.currentBet - actor.currentBet);
  const effectiveAction =
    action === "fold" && state.foldLockUsed ? (toCall > 0 ? "call" : "check") : action;

  let currentBet = state.currentBet;
  let lastRaiseSize = state.lastRaiseSize;
  let pot = state.pot;
  const logs = [...state.logs];

  const pay = (amount: number) => {
    const committed = Math.min(amount, actor.chips);
    actor.chips -= committed;
    actor.currentBet += committed;
    actor.totalContribution += committed;
    pot += committed;
    actor.isAllIn = actor.chips === 0;
    return committed;
  };

  switch (effectiveAction) {
    case "fold": {
      actor.folded = true;
      actor.hasActed = true;
      actor.lastAction = "Fold";
      logs.unshift(`${actor.name} folds`);
      if (actor.archetype && toCall > 0) {
        actor.readStats.opportunitiesToFoldToRaise += 1;
        actor.readStats.foldToRaiseCount += 1;
      }

      const livePlayers = activePlayers(players);
      if (livePlayers.length === 1) {
        const winner = livePlayers[0];
        winner.chips += pot;
        const heroWon = winner.id === "hero";
        const boostActive = (state.premiumBoostUntilHand ?? -1) >= state.handNumber;
        const xpMultiplier = boostActive ? 2 : 1;
        const bonusXP = heroWon ? Math.floor((5 + Math.random() * 46) * xpMultiplier) : 0;
        const xpEvents: XPEventId[] = [];
        if (state.handNumber === 1) xpEvents.push("first_hand");
        if (heroWon) xpEvents.push("hand_win");

        const handXP = sumXP(xpEvents) + bonusXP;
        const heroXP = state.heroXP + handXP;
        const heroTier = getTierByXP(heroXP).name;
        const heroChipTitle = getChipTitleByStack(players[0].chips).title;

        const handResult: HandHistoryEntry = {
          handId: `hand-${state.handNumber}`,
          playedAt: Date.now(),
          heroCards: players[0].cards,
          communityCards: state.communityCards,
          result: heroWon ? "won" : players[0].folded ? "folded" : "lost",
          potSize: pot,
          chipDelta: players[0].chips - state.heroStartOfHandChips,
          xpEarned: handXP,
          serverSeedHash: state.serverSeedHash,
          serverSeed: state.serverSeed,
          summary: `${winner.name} won an uncontested pot.`,
        };

        return {
          players,
          pot: 0,
          phase: "HAND_COMPLETE",
          turnIndex: actorIndex,
          currentBet,
          lastRaiseSize,
          logs: [`${winner.name} wins uncontested for $${pot}`, ...logs].slice(0, 20),
          handHistory: [handResult, ...state.handHistory].slice(0, 40),
          lastWinners: [winner.id],
          heroXP,
          heroTier,
          heroChipTitle,
          lastHandXP: handXP,
          lastBonusXP: bonusXP,
          winStreak: heroWon ? state.winStreak + 1 : 0,
          warningText:
            players[0].chips < STARTING_STACK * 0.3
              ? "⚠️ Your stack is running low. Don't let The Maniac rattle you."
              : null,
          pendingWin: heroWon
            ? {
                amount: players[0].chips - state.heroStartOfHandChips,
                xpEarned: handXP,
                bonusXp: bonusXP,
                isPremiumBoost: boostActive,
              }
            : null,
          premiumTickets: state.premiumTickets + (heroWon ? 1 : 0),
          questProgress: heroWon ? state.questProgress + 1 : state.questProgress,
          foldLockUsed: true,
        };
      }

      return {
        players,
        turnIndex: findNextActiveIndex(players, actorIndex),
        logs: logs.slice(0, 20),
        foldLockUsed: true,
      };
    }

    case "check":
      if (toCall === 0) {
        actor.hasActed = true;
        actor.lastAction = "Check";
        logs.unshift(`${actor.name} checks`);
        break;
      }

      // fall through to call when there is a bet to call
    case "call": {
      const committed = pay(toCall);
      actor.hasActed = true;
      actor.lastAction = toCall > 0 ? `Call $${committed}` : "Check";
      logs.unshift(toCall > 0 ? `${actor.name} calls $${committed}` : `${actor.name} checks`);
      if (actor.archetype && actor.totalContribution > SMALL_BLIND) {
        actor.readStats.vpipHands += 1;
      }
      break;
    }

    case "raise": {
      const minRaiseTo = Math.min(
        actor.currentBet + actor.chips,
        Math.max(state.currentBet + state.lastRaiseSize, BIG_BLIND),
      );
      const target = Math.max(minRaiseTo, Math.min(raiseTo ?? minRaiseTo, actor.currentBet + actor.chips));
      const committed = pay(target - actor.currentBet);
      const previousBet = currentBet;
      currentBet = actor.currentBet;
      lastRaiseSize = Math.max(BIG_BLIND, currentBet - previousBet);

      actor.hasActed = true;
      actor.lastAction = `Raise to $${actor.currentBet}`;
      logs.unshift(`${actor.name} raises to $${actor.currentBet}`);

      players.forEach((player, idx) => {
        if (idx !== actorIndex && !player.folded && !player.isAllIn) {
          player.hasActed = false;
        }
      });

      if (actor.archetype) {
        actor.readStats.vpipHands += 1;
        actor.readStats.raises += 1;
        if (toCall === 0 && committed > BIG_BLIND) {
          actor.readStats.bluffsShown += 1;
        }
      }
      break;
    }

    default:
      return {};
  }

  const livePlayers = activePlayers(players);
  const everyoneAllInOrFolded = players.every((player) => player.folded || player.isAllIn);
  const activeNotAllIn = players.filter((player) => !player.folded && !player.isAllIn);
  const bettingClosed =
    activeNotAllIn.length === 0 ||
    activeNotAllIn.every((player) => player.hasActed && player.currentBet === currentBet);

  if (livePlayers.length === 1) {
    const winner = livePlayers[0];
    winner.chips += pot;
    const heroWon = winner.id === "hero";
    const boostActive = (state.premiumBoostUntilHand ?? -1) >= state.handNumber;
    const xpMultiplier = boostActive ? 2 : 1;
    const bonusXP = heroWon ? Math.floor((5 + Math.random() * 46) * xpMultiplier) : 0;
    const xpEvents: XPEventId[] = [];
    if (state.handNumber === 1) xpEvents.push("first_hand");
    if (heroWon) xpEvents.push("hand_win");
    if (players[0].chips >= 30_000 && state.heroStartOfHandChips < 30_000) {
      xpEvents.push("reach_30k");
    }
    if (players[0].chips >= 100_000 && state.heroStartOfHandChips < 100_000) {
      xpEvents.push("reach_bond");
    }

    const handXP = sumXP(xpEvents) + bonusXP;
    const heroXP = state.heroXP + handXP;
    const heroTier = getTierByXP(heroXP).name;
    const heroChipTitle = getChipTitleByStack(players[0].chips).title;
    const heroEval = evaluations.hero;

    const handResult: HandHistoryEntry = {
      handId: `hand-${state.handNumber}`,
      playedAt: Date.now(),
      heroCards: players[0].cards,
      communityCards: board,
      result: heroWon ? "won" : players[0].folded ? "folded" : "lost",
      potSize: pot,
      chipDelta: players[0].chips - state.heroStartOfHandChips,
      xpEarned: handXP,
      serverSeedHash: state.serverSeedHash,
      serverSeed: state.serverSeed,
      summary: `${winners
        .map((id) => players.find((player) => player.id === id)?.name ?? id)
        .join(" & ")} won with ${heroEval?.label ?? "best hand"}.`,
    };

    return {
      players,
      pot: 0,
      phase: "HAND_COMPLETE",
      turnIndex: actorIndex,
      currentBet,
      lastRaiseSize,
      logs: [`${winner.name} wins uncontested for $${pot}`, ...logs].slice(0, 20),
      handHistory: [handResult, ...state.handHistory].slice(0, 40),
      lastWinners: [winner.id],
      heroXP,
      heroTier,
      heroChipTitle,
      lastHandXP: handXP,
      lastBonusXP: bonusXP,
      winStreak: heroWon ? state.winStreak + 1 : 0,
      warningText:
        players[0].chips < STARTING_STACK * 0.3
          ? "⚠️ Your stack is running low. Don't let The Maniac rattle you."
          : null,
      pendingWin: heroWon
        ? {
            amount: players[0].chips - state.heroStartOfHandChips,
            xpEarned: handXP,
            bonusXp: bonusXP,
            isPremiumBoost: boostActive,
          }
        : null,
      premiumTickets: state.premiumTickets + (heroWon ? 1 : 0),
      questProgress: heroWon ? state.questProgress + 1 : state.questProgress,
      foldLockUsed: state.foldLockUsed,
    };
  }

  if (bettingClosed || everyoneAllInOrFolded) {
    const nextPhase: GamePhase =
      state.phase === "PRE_FLOP"
        ? "FLOP"
        : state.phase === "FLOP"
          ? "TURN"
          : state.phase === "TURN"
            ? "RIVER"
            : "SHOWDOWN";

    if (nextPhase === "SHOWDOWN") {
      const board = [...state.communityCards];
      let deck = [...state.deck];
      while (board.length < 5) {
        const dealt = dealCards(deck, 1);
        board.push(dealt.cards[0]!);
        deck = dealt.rest;
      }

      const evaluations: Partial<Record<PlayerId, HandEvaluation>> = {};
      players
        .filter((player) => !player.folded)
        .forEach((player) => {
          evaluations[player.id] = evaluateHand([...player.cards, ...board]);
        });

      const sidePots = calculateSidePots(
        players.map((player) => ({
          playerId: player.id,
          amount: player.totalContribution,
          folded: player.folded,
        })),
      );
      const payouts = distributePots(sidePots, evaluations, PLAYER_ORDER);
      Object.entries(payouts).forEach(([id, amount]) => {
        const player = players.find((entry) => entry.id === id);
        if (player) {
          player.chips += amount ?? 0;
        }
      });

      const maxPayout = Math.max(...Object.values(payouts), 0);
      const winners = PLAYER_ORDER.filter((id) => (payouts[id] ?? 0) === maxPayout && maxPayout > 0);
      const heroWon = winners.includes("hero");
      const boostActive = (state.premiumBoostUntilHand ?? -1) >= state.handNumber;
      const xpMultiplier = boostActive ? 2 : 1;
      const bonusXP = heroWon ? Math.floor((5 + Math.random() * 46) * xpMultiplier) : 0;
      const xpEvents: XPEventId[] = [];
      if (state.handNumber === 1) xpEvents.push("first_hand");
      if (heroWon) xpEvents.push("hand_win");
      if (players[0].chips >= 30_000 && state.heroStartOfHandChips < 30_000) {
        xpEvents.push("reach_30k");
      }
      if (players[0].chips >= 100_000 && state.heroStartOfHandChips < 100_000) {
        xpEvents.push("reach_bond");
      }

      const handXP = sumXP(xpEvents) + bonusXP;
      const heroXP = state.heroXP + handXP;
      const heroTier = getTierByXP(heroXP).name;
      const heroChipTitle = getChipTitleByStack(players[0].chips).title;
      const heroEval = evaluations.hero;

      const handResult: HandHistoryEntry = {
        handId: `hand-${state.handNumber}`,
        playedAt: Date.now(),
        heroCards: players[0].cards,
        communityCards: board,
        result: heroWon ? "won" : players[0].folded ? "folded" : "lost",
        potSize: pot,
        chipDelta: players[0].chips - state.heroStartOfHandChips,
        xpEarned: handXP,
        serverSeedHash: state.serverSeedHash,
        serverSeed: state.serverSeed,
        summary: `${winners
          .map((id) => players.find((player) => player.id === id)?.name ?? id)
          .join(" & ")} won with ${heroEval?.label ?? "best hand"}.`,
      };

      return {
        players,
        communityCards: board,
        deck,
        phase: "HAND_COMPLETE",
        turnIndex: actorIndex,
        currentBet,
        lastRaiseSize,
        pot: 0,
        logs: [`Showdown: ${handResult.summary}`, ...logs].slice(0, 20),
        handHistory: [handResult, ...state.handHistory].slice(0, 40),
        lastWinners: winners,
        heroXP,
        heroTier,
        heroChipTitle,
        lastHandXP: handXP,
        lastBonusXP: bonusXP,
        winStreak: heroWon ? state.winStreak + 1 : 0,
        warningText:
          players[0].chips < STARTING_STACK * 0.3
            ? "⚠️ Your stack is running low. Don't let The Maniac rattle you."
            : null,
        pendingWin: heroWon
          ? {
              amount: players[0].chips - state.heroStartOfHandChips,
              xpEarned: handXP,
              bonusXp: bonusXP,
              isPremiumBoost: boostActive,
            }
          : null,
        premiumTickets: state.premiumTickets + (heroWon ? 1 : 0),
        questProgress: heroWon ? state.questProgress + 1 : state.questProgress,
        foldLockUsed: false,
      };
    }

    const boardCardCount = nextPhase === "FLOP" ? 3 : nextPhase === "TURN" ? 4 : 5;
    const board = [...state.communityCards];
    let deck = [...state.deck];
    while (board.length < boardCardCount) {
      const dealt = dealCards(deck, 1);
      board.push(dealt.cards[0]!);
      deck = dealt.rest;
    }

    players.forEach((player) => {
      player.currentBet = 0;
      player.hasActed = player.folded || player.isAllIn;
    });

    const nextIndex = findNextActiveIndex(players, state.dealerIndex);

    return {
      players,
      deck,
      communityCards: board,
      phase: nextPhase,
      turnIndex: nextIndex,
      currentBet: 0,
      lastRaiseSize: BIG_BLIND,
      raiseTarget: BIG_BLIND,
      logs,
      pot,
      foldLockUsed: false,
    };
  }

  const nextTurn = findNextActiveIndex(players, actorIndex);
  const hero = players[0];
  const minRaiseTo = Math.max(currentBet + lastRaiseSize, hero.currentBet + BIG_BLIND);

  return {
    players,
    turnIndex: nextTurn,
    currentBet,
    lastRaiseSize,
    pot,
    logs,
    raiseTarget: Math.min(minRaiseTo, hero.currentBet + hero.chips),
    foldLockUsed: state.foldLockUsed,
  };
}

const initialState = {
  phase: "WAITING",
  players: createInitialPlayers(),
  deck: [],
  communityCards: [],
  dealerIndex: 0,
  turnIndex: 0,
  currentBet: 0,
  lastRaiseSize: BIG_BLIND,
  pot: 0,
  handNumber: 0,
  heroXP: 0,
  heroTier: "Fish",
  heroChipTitle: CHIP_TITLES[0].title,
  raiseTarget: BIG_BLIND,
  logs: ["Welcome to PokerIQ."],
  handHistory: [],
  lastHandXP: 0,
  lastBonusXP: 0,
  winStreak: 0,
  lastWinners: [],
  serverSeed: "",
  serverSeedHash: "",
  handNonce: 0,
  heroStartOfHandChips: STARTING_STACK,
  warningText: null,
  pendingWin: null,
  premiumTickets: 0,
  dailyBonusClaimed: false,
  premiumBoostUntilHand: null,
  questProgress: 0,
  foldLockUsed: false,
};

export const useGameStore = create<GameState>((set, get) => ({
  ...initialState,

  init: () => {
    const state = get();
    if (state.handNumber === 0 && state.phase === "WAITING") {
      state.startHand();
    }
  },

  startHand: () => {
    const state = get();
    const handNumber = state.handNumber + 1;
    const dealerIndex = state.handNumber === 0 ? 0 : (state.dealerIndex + 1) % PLAYER_ORDER.length;
    const serverSeed = generateServerSeed();
    const serverSeedHash = getSeedHash(serverSeed);
    const handNonce = state.handNonce + 1;
    const random = createSeededRandom(serverSeed, handNonce);
    const prepared = resetForNewHand(state.players);

    let deck = shuffleDeck(createDeck(), random);
    const dealtPlayers = prepared.map((player) => {
      const dealt = dealCards(deck, 2);
      deck = dealt.rest;
      return {
        ...player,
        cards: dealt.cards,
      };
    });

    const sbIndex = (dealerIndex + 1) % dealtPlayers.length;
    const bbIndex = (dealerIndex + 2) % dealtPlayers.length;

    const postBlind = (index: number, amount: number, label: "SB" | "BB") => {
      const player = dealtPlayers[index]!;
      const committed = Math.min(amount, player.chips);
      player.chips -= committed;
      player.currentBet += committed;
      player.totalContribution += committed;
      player.hasActed = false;
      player.lastAction = `${label} $${committed}`;
      player.isAllIn = player.chips === 0;
    };

    postBlind(sbIndex, SMALL_BLIND, "SB");
    postBlind(bbIndex, BIG_BLIND, "BB");

    const turnIndex = findNextActiveIndex(dealtPlayers, bbIndex);
    const hero = dealtPlayers[0];
    const minRaiseTo = Math.max(BIG_BLIND + BIG_BLIND, hero.currentBet + BIG_BLIND);

    set({
      phase: "PRE_FLOP",
      players: dealtPlayers,
      deck,
      communityCards: [],
      dealerIndex,
      turnIndex,
      currentBet: BIG_BLIND,
      lastRaiseSize: BIG_BLIND,
      pot: SMALL_BLIND + BIG_BLIND,
      handNumber,
      raiseTarget: Math.min(minRaiseTo, hero.currentBet + hero.chips),
      logs: [
        `Hand #${handNumber} started. Blinds ${SMALL_BLIND}/${BIG_BLIND}.`,
        `Provably fair hash: ${serverSeedHash.slice(0, 16)}...`,
      ],
      lastWinners: [],
      serverSeed,
      serverSeedHash,
      handNonce,
      heroStartOfHandChips: hero.chips + hero.currentBet,
      lastHandXP: 0,
      lastBonusXP: 0,
      pendingWin: null,
      foldLockUsed: false,
    });
  },

  heroFold: () => {
    const state = get();
    if (state.phase === "HAND_COMPLETE" || state.players[state.turnIndex]?.id !== "hero") {
      return;
    }

    set((prev) => executeAction(prev, prev.turnIndex, "fold"));
  },

  heroCallOrCheck: () => {
    const state = get();
    if (state.phase === "HAND_COMPLETE" || state.players[state.turnIndex]?.id !== "hero") {
      return;
    }

    const hero = state.players[0];
    const toCall = Math.max(0, state.currentBet - hero.currentBet);

    set((prev) => executeAction(prev, prev.turnIndex, toCall > 0 ? "call" : "check"));
  },

  heroRaise: (raiseTo: number) => {
    const state = get();
    if (state.phase === "HAND_COMPLETE" || state.players[state.turnIndex]?.id !== "hero") {
      return;
    }

    set((prev) => executeAction(prev, prev.turnIndex, "raise", raiseTo));
  },

  botAct: () => {
    const state = get();
    const actor = state.players[state.turnIndex];
    if (!actor || actor.isHero || actor.folded || actor.isAllIn || state.phase === "HAND_COMPLETE") {
      return;
    }

    const toCall = Math.max(0, state.currentBet - actor.currentBet);
    const minRaiseTo = Math.max(state.currentBet + state.lastRaiseSize, actor.currentBet + BIG_BLIND);
    const difficultyBias = Math.min(
      0.26,
      (state.handNumber - 1) * 0.025 + (actor.chips < STARTING_STACK * 0.5 ? 0.05 : 0),
    );

    const decision = decideBotAction({
      archetype: actor.archetype!,
      toCall,
      currentBet: actor.currentBet,
      highestBet: state.currentBet,
      chips: actor.chips,
      holeStrength: estimatePreflopStrength(actor.cards.map((card) => card.value)),
      beginnerLuckWeakening: state.handNumber <= 3,
      minRaiseTo,
      difficultyBias,
    });

    set((prev) => executeAction(prev, prev.turnIndex, decision.action, decision.raiseTo));
  },

  setRaiseTarget: (target: number) => {
    const state = get();
    const hero = state.players[0];
    const minRaise = Math.max(state.currentBet + state.lastRaiseSize, hero.currentBet + BIG_BLIND);
    const maxRaise = hero.currentBet + hero.chips;

    set({ raiseTarget: Math.max(minRaise, Math.min(target, maxRaise)) });
  },

  clearPendingWin: () => {
    set({ pendingWin: null });
  },

  claimDailyBonus: () => {
    const state = get();
    if (state.dailyBonusClaimed) return;

    set((prev) => ({
      heroXP: prev.heroXP + 75,
      heroTier: getTierByXP(prev.heroXP + 75).name,
      premiumTickets: prev.premiumTickets + 3,
      dailyBonusClaimed: true,
      logs: [`Daily bonus granted: +3 VIP tickets and +75 XP.`, ...prev.logs].slice(0, 20),
    }));
  },

  activatePremiumBoost: () => {
    const state = get();
    if (state.premiumTickets < 3) return;

    set((prev) => ({
      premiumTickets: prev.premiumTickets - 3,
      premiumBoostUntilHand: prev.handNumber + 3,
      logs: [`VIP boost active for the next 3 hands.`, ...prev.logs].slice(0, 20),
    }));
  },
}));
