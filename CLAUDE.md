# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Wizard Tracker is a React-based web application for tracking scores in the Wizard card game. It supports 3-6 players with dynamic round counts based on player count (60 cards / number of players: 3 players = 20 rounds, 4 players = 15 rounds, 5 players = 12 rounds, 6 players = 10 rounds).

## Development Commands

**Install dependencies:**
```bash
npm install
```

**Run development server:**
```bash
npm run dev
```
Runs on http://localhost:5173/ with hot module replacement (HMR)

**Build for production:**
```bash
npm run build
```

## Tech Stack

- **React 18.3** - UI library with modern hooks
- **Vite 6** - Fast build tool and dev server
- **JavaScript/JSX** - ES6+ with JSX syntax

## Architecture

### Folder Structure

```
src/
├── components/
│   ├── Settings.jsx          # Setup: player count, names, hook rule option, Start game
│   ├── NumberOfPlayers.jsx   # 3-6 player button group
│   ├── InitPlayersList.jsx   # List of name inputs
│   ├── InitPlayer.jsx        # Single controlled name input
│   ├── Game.jsx              # Game screen: round entry or final results + scoreboard
│   ├── RoundEntry.jsx        # Current round, bids phase then tricks phase
│   ├── Scoreboard.jsx        # Rounds x players table, tap a row to edit
│   ├── EditRound.jsx         # Bottom-sheet overlay to fix a finished round
│   ├── FinalResults.jsx      # Ranking after the last round
│   └── Stepper.jsx           # − value + control, 0..max
├── hooks/
│   └── useGame.js            # useReducer game state, persisted to localStorage
├── i18n/
│   ├── el.js                 # Greek UI strings (only language for now)
│   └── index.js              # Exports `t` and `errorMessage(error)`
├── utils/
│   └── scoring.js            # Pure game rules: rounds, dealer, scores, validation
├── styles/
│   ├── app.css               # Imports globals.css + index.css
│   ├── globals.css           # CSS custom properties
│   └── index.css             # Component styles (mobile first)
├── App.jsx                   # Settings when no game, otherwise Game
└── main.jsx                  # Entry point
```

### Game rules (utils/scoring.js)

- Round index `r` (0-based) deals `r + 1` cards. Total rounds = 60 / players.
- Player 1 deals round 1, then the deal rotates. Bidding starts left of the dealer, dealer bids last.
- Players are always listed in seat order (as entered); the round entry marks the dealer and who bids first with badges.
- Score: exact bid → `20 + 10 × tricks`, otherwise `−10 × |bid − tricks|`.
- Bids may add up to more or less than the cards dealt (only the hook rule restricts the total). Each bid is 0..cards.
- Tricks in a round must add up to the cards dealt. Bids and tricks start at 0; while tricks are below the cards the UI shows a neutral "remaining" hint, only an excess is shown as an error.
- Hook rule (optional, chosen in Settings): bids may not add up to the cards dealt.

### State (hooks/useGame.js)

State is `{ lastSetup, game }`, saved to `localStorage` under `wizard-tracker` so a refresh resumes the game.

```js
game = {
  players: string[],
  hookRule: boolean,
  rounds: [{ bids: number[], tricks: number[] }],             // finished rounds only
  current: { phase: 'bids' | 'tricks', bids, tricks } | null, // null = game over
}
```

Only user input is stored; scores, totals, dealer and round number are derived with `utils/scoring.js`. Actions: `START_GAME`, `SET_BID`, `CONFIRM_BIDS` (tricks start at 0), `BACK_TO_BIDS`, `SET_TRICKS`, `FINISH_ROUND`, `UPDATE_ROUND`, `NEW_GAME` (keeps `lastSetup` to prefill Settings). Validation happens in the UI, the reducer trusts its input.

### Language

The UI is Greek. All user-facing text lives in `src/i18n/el.js`; components import `t` from `../i18n` and never hardcode strings. Validation functions return `{ type, ...data }` objects, and `errorMessage()` maps them to text via `t.errors[type]`. English is planned: add `en.js` with the same keys and a language switch.

Fonts must support Greek (Bangers was dropped for this reason); headings and buttons use Fira Sans Extra Condensed 600.

`.eslintrc.cjs` uses `plugin:react/jsx-runtime`, so components don't import `React`.
