export const TIERS = [
  { name: "Fish", minXP: 0, badge: "🐟", color: "#7FB3D3" },
  { name: "Grinder", minXP: 500, badge: "⚙️", color: "#A9CCE3" },
  { name: "Shark", minXP: 1500, badge: "🦈", color: "#2ECC71" },
  { name: "Reg", minXP: 3500, badge: "🎯", color: "#F39C12" },
  { name: "Crusher", minXP: 7000, badge: "💎", color: "#8E44AD" },
  { name: "James Bond", minXP: 12000, badge: "🔫", color: "#C9A84C" },
  { name: "Casino Royale", minXP: 20000, badge: "👑", color: "#E74C3C" },
] as const;

export const CHIP_TITLES = [
  { title: "Fish", threshold: 0 },
  { title: "Grinder", threshold: 15_000 },
  { title: "Shark", threshold: 30_000 },
  { title: "High Roller", threshold: 75_000 },
  { title: "James Bond", threshold: 100_000 },
  { title: "Casino Royale", threshold: 250_000 },
] as const;

export const EARNINGS_RANKS = [
  { title: "Rookie", threshold: 0 },
  { title: "Hot Streak", threshold: 50_000 },
  { title: "Contender", threshold: 120_000 },
  { title: "Elite", threshold: 250_000 },
  { title: "Prodigy", threshold: 400_000 },
  { title: "James Bond", threshold: 500_000 },
  { title: "Casino Royale", threshold: 750_000 },
] as const;

export function getTierByXP(totalXP: number) {
  return [...TIERS].reverse().find((tier) => totalXP >= tier.minXP) ?? TIERS[0];
}

export function getChipTitleByStack(stack: number) {
  return [...CHIP_TITLES].reverse().find((title) => stack >= title.threshold) ?? CHIP_TITLES[0];
}

export function getRankByEarnings(earnings: number) {
  return [...EARNINGS_RANKS].reverse().find((rank) => earnings >= rank.threshold) ?? EARNINGS_RANKS[0];
}
