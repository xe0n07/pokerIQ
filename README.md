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

No Socket.io. No Redis. No Railway. No multiplayer. Keep it simple for MVP.

---

## 3. PROJECT STRUCTURE

```
pokeriq/
├── app/
│   ├── page.tsx                  ← Landing page
│   ├── game/
│   │   └── page.tsx              ← Texas Hold'em table
│   ├── profile/
│   │   └── page.tsx              ← Player profile + stats
│   ├── leaderboard/
│   │   └── page.tsx              ← Global rankings
│   ├── learn/
│   │   └── page.tsx              ← How to play / rules
│   └── api/
│       └── hand-result/route.ts  ← Save hand to Firestore
├── components/
│   ├── table/
│   │   ├── PokerTable.tsx        ← Main SVG felt table
│   │   ├── PlayerSeat.tsx        ← Individual player/bot seat
│   │   ├── CardSlot.tsx          ← Animated card component
│   │   ├── ChipStack.tsx         ← Chip animation
│   │   ├── ActionBar.tsx         ← Fold/Call/Raise buttons
│   │   ├── PotDisplay.tsx        ← Centre pot counter
│   │   └── ReadPanel.tsx         ← Opponent psychology stats sidebar
│   ├── landing/
│   │   ├── Hero.tsx
│   │   ├── HowToPlay.tsx
│   │   ├── HandRankings.tsx
│   │   ├── ArchetypeShowcase.tsx
│   │   └── LeaderboardPreview.tsx
│   └── ui/                       ← shadcn components
├── lib/
│   ├── game-engine/
│   │   ├── deck.ts               ← 52-card deck, shuffle, deal
│   │   ├── hand-evaluator.ts     ← 7-card hand ranking (Cactus Kev algorithm)
│   │   ├── rng.ts                ← Provably fair seed + HMAC shuffle
│   │   └── pot-calculator.ts     ← Side pots, all-in logic
│   ├── bot/
│   │   ├── archetypes.ts         ← Bot personality definitions
│   │   └── bot-engine.ts         ← Bot decision logic per archetype
│   ├── xp/
│   │   └── xp-engine.ts          ← XP calculation per hand event
│   ├── firebase/
│   │   ├── config.ts
│   │   ├── auth.ts
│   │   └── firestore.ts          ← Read/write helpers
│   └── constants/
│       ├── poker-rules.ts        ← Hand rankings, bet limits
│       └── titles.ts             ← James Bond thresholds etc.
├── store/
│   └── game-store.ts             ← Zustand store: table state, chips, history
├── hooks/
│   ├── useGameEngine.ts
│   ├── useAuth.ts
│   └── useBotAction.ts
└── types/
    └── poker.ts                  ← All shared TypeScript types
```

---

## 4. LANDING PAGE (Build this first)

### Visual design

**Palette:**
- Background: `#0A1A0F` (near-black casino green)
- Felt surface: `#0D3320` (deep poker table green)
- Gold accent: `#C9A84C` (chips, highlights, CTAs)
- Card white: `#F5F0E8` (warm cream, not pure white)
- Text primary: `#F0EDE6`
- Text muted: `#7A8C7E`

**Typography:**
- Display: `Playfair Display` — headings, hero, player titles
- Body: `Inter` — descriptions, UI text
- Data: `JetBrains Mono` — chip counts, stats, XP numbers

**Signature design element:** An animated poker table viewed from above (SVG or canvas),
rotating slowly, with cards being dealt in a loop — visible as the hero background. Not a
static image. It breathes.

### Sections (in order)

#### 4.1 Hero Section
- Full-screen, dark casino green background
- Animated poker table SVG behind the headline
- Headline: **"Play the Player. Not the Cards."**
- Subheadline: "The world's first poker game built around psychology, reads, and skill progression."
- Two CTAs:
  - **"Play Now — Free"** → `/game` (primary, gold button)
  - **"How to Play"** → smooth scroll to rules section (secondary, ghost button)
- Floating chip stack animation on the left
- A live XP ticker showing "1,243 hands played today" (fake counter, animated upward)

#### 4.2 The James Bond Ladder (Milestone titles)
Show the progression system visually. A horizontal or vertical ladder of titles:

```
Starting chips: $5,000 (everyone starts here)

$5,000       →  Fish          "Just sat down."
$15,000      →  Grinder       "You know your hands."
$30,000      →  Shark         "Opponents fear you."
$75,000      →  High Roller   "The table respects you."
$1,00,000    →  James Bond    "The legend. The myth."
$2,50,000    →  Casino Royale "You ARE the house."
```

Display these as animated cards flipping to reveal each title. Gold foil effect on
"James Bond" and "Casino Royale".

#### 4.3 How to Play (Beginner Rules)
Step-by-step Texas Hold'em rules. Clean, visual, scannable:

1. **The Deal** — Each player gets 2 private cards (hole cards)
2. **Pre-Flop** — First betting round. Fold, call, or raise.
3. **The Flop** — 3 community cards revealed. Second betting round.
4. **The Turn** — 4th community card. Third betting round.
5. **The River** — 5th and final card. Last betting round.
6. **Showdown** — Best 5-card hand from 7 cards wins the pot.

Include an interactive hand rankings card (click to expand each one):
Royal Flush → Straight Flush → Four of a Kind → Full House → Flush →
Straight → Three of a Kind → Two Pair → Pair → High Card

Each with a visual card representation and a one-line description.

#### 4.4 Opponent Archetypes (Psychology Layer)
Show the 4 bot personalities players will face. Card-style display, each with:
- Name + icon
- Play style in one sentence
- Weakness the player can exploit

```
The Rock       🪨  Tight, rarely bluffs. Exploit: steal his blinds relentlessly.
The Maniac     💥  Bets everything, every hand. Exploit: wait for strong hands, call wide.
The Shark      🦈  Reads you perfectly. Exploit: be unpredictable, mix up your sizing.
The Novice     🐟  Random, inconsistent. Exploit: value bet thin, never bluff.
```

#### 4.5 The Read Panel Preview
Show a screenshot or animated mockup of the Read Panel feature:
"See exactly how your opponents are playing in real time."
Stats shown: Hands played, Aggression score, Bluff tendency, Fold frequency.

#### 4.6 Leaderboard Preview
Animated top-10 leaderboard with fake names, chip counts, titles, and win rates.
Shows the global ranking system. "Where will you rank?"

#### 4.7 Final CTA
Full-width dark section. Large text: **"$5,000 is waiting for you."**
Subtext: "No deposit. No real money. Just your skill."
Gold "Deal Me In" button → `/game`

---

## 5. TEXAS HOLD'EM TABLE (The actual game)

This is the core product. Build it to be as close to a real casino table as possible.

### 5.1 Table Layout

```
┌─────────────────────────────────────────────────────────────┐
│  [Bot 3 — The Rock 🪨]          [Bot 4 — The Maniac 💥]     │
│   🂠 🂠   $12,400                  🂠 🂠   $8,200              │
│                                                             │
│         ┌─────────────────────────────────┐                 │
│         │   🂡 🂲 🃇  |  🃑  |  🂮        │  ← Community    │
│         │        POT: $2,400              │     cards       │
│         └─────────────────────────────────┘                 │
│                                                             │
│  [Bot 2 — The Shark 🦈]          [Bot 5 — The Novice 🐟]   │
│   🂠 🂠   $31,000                  🂠 🂠   $3,800              │
│                                                             │
│              ┌──────────────────────────┐                   │
│              │  YOU  💰 $47,200         │                   │
│              │  🂡 🃁   [HERO]          │                   │
│              └──────────────────────────┘                   │
│                                                             │
│    [FOLD]          [CHECK/CALL $400]        [RAISE ▲]      │
│                   Raise to: [  $800  ] [+] [-]             │
└─────────────────────────────────────────────────────────────┘
                                              [READ PANEL →]
```

### 5.2 Game Engine (lib/game-engine/)

#### deck.ts
```typescript
// 52 cards: suits = ['♠','♥','♦','♣'], ranks = ['2'...'A']
// Card = { suit: Suit, rank: Rank, value: number }
// Functions: createDeck(), shuffleDeck(deck, seed), dealCards(deck, n)
```

#### hand-evaluator.ts
Implement a proper 7-card hand evaluator. Use the **Two Plus Two algorithm** or a
lookup-table approach. Must correctly rank:
- Royal Flush (highest)
- Straight Flush
- Four of a Kind
- Full House
- Flush
- Straight
- Three of a Kind
- Two Pair
- One Pair
- High Card (lowest)

Must handle kickers correctly. Must handle all edge cases (wheel straight A-2-3-4-5,
Broadway A-K-Q-J-10).

#### rng.ts
```typescript
// Provably fair shuffle
// 1. Generate serverSeed (crypto.randomUUID())
// 2. Hash it: SHA-256(serverSeed) → show to player before deal
// 3. After hand: reveal serverSeed so player can verify
// Fisher-Yates shuffle seeded by HMAC-SHA256(serverSeed, handNonce)
```

#### pot-calculator.ts
```typescript
// Handle: main pot, side pots when players are all-in
// Track: each player's contribution to pot per street
// Calculate: correct pot split on showdown
```

### 5.3 Bot AI Engine (lib/bot/)

#### archetypes.ts
```typescript
type BotArchetype = {
  name: string
  style: 'tight-passive' | 'loose-aggressive' | 'tight-aggressive' | 'loose-passive'
  vpip: number          // % of hands played voluntarily (0–100)
  pfr: number           // % of hands raised preflop
  aggression: number    // postflop aggression factor
  bluffFreq: number     // % of missed draws that become bluffs
  foldToRaise: number   // % of time folds to a 3-bet
}

const ARCHETYPES: Record<string, BotArchetype> = {
  rock:    { vpip: 15, pfr: 12, aggression: 1.2, bluffFreq: 0.05, foldToRaise: 0.70 },
  maniac:  { vpip: 75, pfr: 55, aggression: 4.5, bluffFreq: 0.60, foldToRaise: 0.15 },
  shark:   { vpip: 26, pfr: 20, aggression: 2.8, bluffFreq: 0.35, foldToRaise: 0.35 },
  novice:  { vpip: 50, pfr: 15, aggression: 1.0, bluffFreq: 0.20, foldToRaise: 0.50 },
}
```

#### bot-engine.ts
Bot decision logic. Each bot action must:
1. Look at its hole cards → calculate hand strength
2. Consider position (early/mid/late/blinds)
3. Apply archetype tendencies (vpip, pfr, aggression)
4. Add small random noise (±10%) so bots don't feel robotic
5. Return: `{ action: 'fold' | 'call' | 'raise', amount?: number }`

Bot thinking should have a 1.5–2.5 second artificial delay with a thinking indicator.

### 5.4 Read Panel (Right sidebar)

Shows live stats for each bot opponent. Updates after every hand:

```
┌─────────────────────────────┐
│  THE ROCK  🪨               │
│  Archetype: Tight-Passive   │
│  ─────────────────────────  │
│  Hands seen:      14        │
│  VPIP:            18%       │
│  Aggression:      Low       │
│  Bluff tendency:  Rare      │
│  Fold to raise:   Often     │
│                             │
│  💡 Exploit tip:            │
│  "Steal his blinds.         │
│   He only fights back       │
│   with the nuts."           │
└─────────────────────────────┘
```

Stats must be calculated dynamically from the actual hands played in the session —
not hardcoded. The exploit tip updates as you observe more hands.

### 5.5 Game Flow State Machine

```
STATES:
  WAITING         → Table loaded, waiting to start
  POSTING_BLINDS  → SB and BB posted automatically
  DEALING         → Cards animated to each player
  PRE_FLOP        → Betting round 1 (starting left of BB)
  FLOP            → 3 community cards dealt, betting round 2
  TURN            → 4th card dealt, betting round 3
  RIVER           → 5th card dealt, betting round 4
  SHOWDOWN        → Cards flipped, winner calculated, pot awarded
  HAND_COMPLETE   → XP calculated, stats updated, next hand in 3s

TRANSITIONS must all be animated. No instant state jumps.
```

### 5.6 Animations (Framer Motion)

Every visual action must be animated:
- **Card deal**: cards slide from deck position to each seat (staggered, 0.1s apart)
- **Chip movement**: chips animate from player to pot, pot to winner
- **Community cards**: flip animation (card back → face) on Flop/Turn/River reveal
- **Player action**: a small badge appears above seat ("FOLD", "CALL $400", "RAISE $800")
- **Win**: winner seat glows gold, chips animate back from pot
- **Bust**: player seat fades with a "BUSTED" overlay, then resets with $5,000

### 5.7 Betting Controls

```typescript
// ActionBar component
// Shows: FOLD | CHECK (if no bet) or CALL $X | RAISE
// Raise slider: min = 2x current bet, max = player stack (all-in)
// Preset buttons: 0.5x Pot | 1x Pot | 2x Pot | All-In
// Keyboard shortcuts: F (fold), C (check/call), R (raise), A (all-in)
```

---

## 6. XP AND PROGRESSION SYSTEM

### 6.1 XP Events

```typescript
type XPEvent = {
  event: string
  xp: number
  condition: string
}

const XP_EVENTS: XPEvent[] = [
  { event: 'correct_fold',     xp: 30,  condition: 'Player folds, bot had better hand' },
  { event: 'correct_call',     xp: 20,  condition: 'Player calls, was statistically ahead' },
  { event: 'bluff_success',    xp: 25,  condition: 'Player raises, bot folds, player had weak hand' },
  { event: 'read_confirmed',   xp: 35,  condition: 'Player exploit tip matched bot showdown hand' },
  { event: 'hand_reviewed',    xp: 10,  condition: 'Player opens hand history after session' },
  { event: 'survived_session', xp: 15,  condition: 'Player ends session above starting stack' },
  { event: 'won_underdog',     xp: 20,  condition: 'Player won with <30% equity at river' },
  { event: 'first_hand',       xp: 50,  condition: 'First hand ever played' },
  { event: 'reach_30k',        xp: 100, condition: 'Chip stack crosses $30,000' },
  { event: 'reach_bond',       xp: 500, condition: 'Chip stack crosses $1,00,000 — James Bond' },
]
```

### 6.2 Tier System

```typescript
const TIERS = [
  { name: 'Fish',         minXP: 0,     badge: '🐟', color: '#7FB3D3' },
  { name: 'Grinder',      minXP: 500,   badge: '⚙️', color: '#A9CCE3' },
  { name: 'Shark',        minXP: 1500,  badge: '🦈', color: '#2ECC71' },
  { name: 'Reg',          minXP: 3500,  badge: '🎯', color: '#F39C12' },
  { name: 'Crusher',      minXP: 7000,  badge: '💎', color: '#8E44AD' },
  { name: 'James Bond',   minXP: 12000, badge: '🔫', color: '#C9A84C' },
  { name: 'Casino Royale',minXP: 20000, badge: '👑', color: '#E74C3C' },
]
```

### 6.3 Chip Milestone Titles

Separate from XP tier. Based on total chip stack:

```typescript
const CHIP_TITLES = [
  { title: 'Fish',          threshold: 0 },
  { title: 'Grinder',       threshold: 15000 },
  { title: 'Shark',         threshold: 30000 },
  { title: 'High Roller',   threshold: 75000 },
  { title: 'James Bond',    threshold: 100000 },
  { title: 'Casino Royale', threshold: 250000 },
]
// Show this title under the player's name at the table and on the leaderboard
```

---

## 7. PLAYER PROFILE + FIREBASE SCHEMA

### 7.1 Firestore Collections

```
/users/{uid}
  displayName:      string
  email:            string
  photoURL:         string
  chipStack:        number          ← current chips (starts at 5000)
  totalXP:          number
  tier:             string          ← Fish, Grinder, Shark...
  chipTitle:        string          ← James Bond, Casino Royale...
  handsPlayed:      number
  handsWon:         number
  totalWon:         number          ← cumulative chips won
  totalLost:        number          ← cumulative chips lost
  biggestPot:       number
  createdAt:        Timestamp
  lastSeen:         Timestamp

/users/{uid}/handHistory/{handId}
  handId:           string
  playedAt:         Timestamp
  heroCards:        Card[]          ← player's hole cards
  communityCards:   Card[]
  result:           'won' | 'lost' | 'folded'
  potSize:          number
  chipDelta:        number          ← +/- chips this hand
  xpEarned:         number
  serverSeed:       string          ← for provably fair verification
  serverSeedHash:   string
  botsAtTable:      BotSummary[]

/leaderboard/{uid}
  displayName:      string
  photoURL:         string
  chipStack:        number
  chipTitle:        string
  tier:             string
  handsPlayed:      number
  winRate:          number          ← handsWon / handsPlayed
  netProfit:        number          ← totalWon - totalLost
  updatedAt:        Timestamp
```

### 7.2 Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == uid;
      match /handHistory/{handId} {
        allow read, write: if request.auth.uid == uid;
      }
    }
    match /leaderboard/{uid} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == uid;
    }
  }
}
```

---

## 8. LEADERBOARD PAGE

Globally ranked by **chip stack** (primary) + **win rate** (secondary tiebreaker).

Show per row:
- Rank number (#1, #2, #3...)
- Avatar + name
- Chip title badge (James Bond 🔫, Shark 🦈 etc.)
- Current chip stack
- Hands played
- Win rate %
- Net profit (total won minus total lost)

Top 3 rows get gold/silver/bronze styling.
Update leaderboard after every hand via Firestore write to `/leaderboard/{uid}`.

---

## 9. GAMIFICATION (from "You Think You Are Smart" principles)

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

## 10. LEARN PAGE (/learn)

A full beginner guide to Texas Hold'em poker. Sections:

1. What is Texas Hold'em?
2. The Deck and Card Values
3. Hand Rankings (interactive, click each one to see example)
4. Table Positions and Why They Matter (diagram: UTG, MP, CO, BTN, SB, BB)
5. Betting Rounds Explained (Pre-Flop, Flop, Turn, River)
6. Pot Odds and When to Call (simple explanation, no complex math)
7. Reading Your Opponent (intro to the Read Panel concept)
8. Common Beginner Mistakes (top 5)
9. Glossary of Poker Terms

At the bottom: "Ready to practice?" → "Deal Me In" button → `/game`

---

## 11. UNICORN POTENTIAL — LONG-TERM VISION

*Not for MVP. But build with these in mind so the architecture supports them.*

### 11.1 World Rankings
A proper global ranking system calculated not just on chips, but a composite score:
- Win rate (weighted by field size)
- Decision quality score (correct folds, accurate reads)
- Consistency index (low variance over 100+ hands)
- Reporting index (penalty for flagged collusion or abusive behaviour)

This is the differentiator Chess.com lacks for poker. A ranking you earn by skill, not luck.

### 11.2 Chip Economy
- Players start with $5,000 free chips
- If they bust: reset to $1,000 (reduced, to add friction and value)
- Chip packs purchasable: $0.99 for $10,000 chips, $4.99 for $75,000 chips
- No chips leave the platform. No cashout. Legal everywhere.
- Total chips in circulation tracked — deflationary model (house rake of 2.5% per pot)

### 11.3 Player Analytics Dashboard (Post-MVP)
A personal stats page showing:
- VPIP over time (graph)
- Biggest leak: "You fold the river 78% of the time when you miss the flop"
- Archetype radar chart: how aggressive, loose, bluff-prone you are
- Best performing position (BTN, BB, SB, etc.)
- Hands where you were the statistical favourite but lost (bad beats)

### 11.4 Earn Model (Much Later)
Chess.com ran a survey where players wanted to earn for their skill. The model:
- Weekly tournaments with entry fee (chips, not cash)
- Top 10% of leaderboard earns "PokerIQ Credits" redeemable for merchandise or premium
- Sponsored tournaments by poker brands
- Coaching marketplace: Crusher-tier players offer paid strategy sessions

---

## 12. WHAT NOT TO BUILD IN MVP

Do not build these. They will derail the hackathon:
- Multiplayer (Socket.io, rooms, matchmaking)
- Real money transactions
- Mobile app (web-responsive is enough)
- Chat / messaging
- Tournament bracket system
- Video / audio features
- GTO solver integration
- Hand range visualiser
- Replay with full timeline scrubber (basic replay only)

---

## 13. KNOWN POKER BUGS TO AVOID

These are the most common bugs in poker implementations. Handle them explicitly:

1. **Kicker bug** — Two players both have a pair of Kings. The kicker (next highest card)
   must determine the winner. Most amateur evaluators miss this.

2. **Split pot bug** — If two players have identical 5-card hands using community cards,
   pot must be split exactly. Handle odd chip remainder (give to player left of dealer).

3. **All-in side pot bug** — If Player A goes all-in for $500 but Players B and C each
   have $2,000, a side pot of $1,500 exists between B and C that A cannot win.
   Implement `calculateSidePots()` correctly before showdown.

4. **Wheel straight bug** — A-2-3-4-5 is a valid straight (the "wheel"). The Ace plays
   as low, not high. Many evaluators miss this.

5. **Dead blind bug** — If a player folds their BB pre-flop, the blind is already in.
   The pot must include it even though that player folded.

6. **Betting order bug** — After the flop, betting starts at the first active player
   LEFT of the dealer (not the pre-flop order). Do not reuse pre-flop order.

7. **Min-raise bug** — The minimum re-raise must be at least the size of the previous
   raise. If the bet was $200 and someone raised to $600 (a raise of $400), the
   min-re-raise is to $1,000, not $1,200. Track last raise size separately.

---

## 14. FIRST 3 THINGS TO BUILD (IN THIS ORDER)

### Step 1: Game engine + hand evaluator (lib/game-engine/)
Test it in isolation before touching any UI. Write unit tests:
- `evaluateHand([KH, KD, KC, KS, AH])` → Four of a Kind
- `evaluateHand([AS, 2H, 3D, 4C, 5S, KH, QD])` → Straight (wheel)
- Split pot scenario tested

### Step 2: Landing page (app/page.tsx)
Full design. Animated hero. All sections. Play Now button links to `/game` even if
the game page is empty. Looks production-quality.

### Step 3: Poker table + game loop (app/game/page.tsx)
Table layout → bot AI → game state machine → betting → showdown → XP.
Get one full hand working end-to-end before adding animations.

---

## 15. DEFINITION OF MVP DONE

The MVP is complete when a user can:

- [ ] Land on the landing page and understand what PokerIQ is
- [ ] Click "Play Now", log in with Google via Firebase, start a table
- [ ] Play a full Texas Hold'em hand against 4 bots to completion
- [ ] See animated card dealing, chip movements, and bot actions
- [ ] Use Fold / Call / Raise with a working slider
- [ ] See the Read Panel update with bot stats after each hand
- [ ] Earn XP for good decisions
- [ ] See their chip stack and tier update after the hand
- [ ] Open the leaderboard and see themselves ranked
- [ ] Bust and get reset back to $5,000 (with a James Bond quip)
- [ ] View hand history from their profile page
- [ ] Check the /learn page for rules if they are a beginner

That is MVP. Ship that first.
