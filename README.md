# PokerIQ — GitHub Copilot Build Brief
## From Zero to MVP: Offline Texas Hold'em Web App

---

## 1. WHAT WE ARE BUILDING

PokerIQ is a **single-player offline poker web app** — Texas Hold'em against AI bots —
designed around one philosophy: **"Poker is the game where you play the player, not the
cards."** Opponent psychology, decision-making, and reading behaviour are first-class
mechanics, not background flavour.

Think **Chess.com for Poker**:
- Chess.com taught the world to play chess through rankings, puzzles, and stats.
- PokerIQ does the same for poker — skill tracking, player archetypes, and a learning loop
  after every hand.

**This is 100% offline for MVP.** No multiplayer. No real money. No backend server needed
beyond Next.js API routes. All game state runs in the browser.

---

## 2. TECH STACK (NON-NEGOTIABLE)

```
Frontend:     Next.js 14 (App Router) + TypeScript
Styling:      Tailwind CSS + shadcn/ui + Radix UI primitives
Animations:   Framer Motion
State:        Zustand (global game state)
Auth:         Firebase Auth (Google + email login)
Database:     Firebase Firestore (player profile, hand history, XP, stats)
Fonts:        Playfair Display (display/headings) + Inter (body) + JetBrains Mono (chip counts/stats)
Package mgr:  pnpm
Linting:      ESLint + Prettier
```

---

## 3. LEADERBOARD PAGE

Globally ranked by **chip stack** (primary) + **win rate** (secondary tiebreaker).

Show per row:
- Rank number (#1, #2, #3...)
- Avatar + name
- Chip title badge (James Bond 🔫, Shark 🦈 etc.)
- Current chip stack
- Hands played
- Win rate %
- Net profit (total won minus total lost)

---

## 4. GAMIFICATION (from "You Think You Are Smart" principles)

Apply these specific techniques throughout the app:

**Loss aversion** — When chips drop below 30% of starting stack, show:
"⚠️ Your stack is running low. Don't let The Maniac rattle you."

**Streak counters** — Track consecutive winning hands. Display above the action bar:
"🔥 3 hand win streak — keep going"

**Progress visibility** — Always show XP bar to next tier. Never let it be off-screen
at the table.

**Social proof** — On the leaderboard page: "347 players reached James Bond this week."

**Variable reward** — After every win, a random "bonus XP" drop (between +5 and +50).
The randomness creates anticipation. Show as a spinning animation before landing.

**Identity labels** — Once you earn "James Bond," the entire UI shifts: golden border on
table, card backs change to a tuxedo pattern, dealer announces "Mr. Bond" in flavour text.

**Beginner's luck** — First 3 hands are slightly rigged in the player's favour (bot AI
plays 20% weaker). Gives new users an early win to hook them. Do not document this
behaviour to users.

**Sunk cost nudge** — When a player tries to quit mid-session: "You've played 12 hands.
Your best hand was a full house worth $4,200. One more?"

---
