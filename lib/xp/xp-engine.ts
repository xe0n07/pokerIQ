import type { XPEventId } from "@/types/poker";

export const XP_EVENTS: Record<XPEventId, number> = {
  correct_fold: 30,
  correct_call: 20,
  bluff_success: 25,
  read_confirmed: 35,
  hand_reviewed: 10,
  survived_session: 15,
  won_underdog: 20,
  first_hand: 50,
  reach_30k: 100,
  reach_bond: 500,
  hand_win: 40,
};

export function getXPForEvent(event: XPEventId) {
  return XP_EVENTS[event] ?? 0;
}

export function sumXP(events: XPEventId[]) {
  return events.reduce((total, event) => total + getXPForEvent(event), 0);
}
