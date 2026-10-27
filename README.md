# Wizard Tracker

A mobile-first web app for keeping score in the Wizard card game. The UI is in Greek.

## Features

- 3–6 players, all 60 cards are dealt: 3 players = 20 rounds, 4 = 15, 5 = 12, 6 = 10
- Choose (or draw) the first dealer, the deal then rotates every round
- Bids, then tricks, per round with validation (tricks must add up to the cards dealt)
- Optional hook rule: bids may not add up to the cards dealt
- Scoreboard with running totals, tap any finished round to fix it
- Final ranking with ties, rematch with the same players
- The game is saved in the browser, a refresh or closed tab resumes it
- Installable PWA that works offline

## Getting Started

Requires Node.js 22.12 or newer (Vitest 5).

```bash
npm install
npm run dev        # http://localhost:5173
```

| Command                  | What it does                                      |
| ------------------------ | ------------------------------------------------- |
| `npm run dev`            | Dev server with hot reload                        |
| `npm run build`          | Production build in `dist/`, with service worker  |
| `npm run preview`        | Serve the production build locally                |
| `npm test`               | Run the unit tests (Vitest)                       |
| `npm run lint`           | ESLint                                            |
| `npm run generate-icons` | Regenerate the PNG icons from `public/icon.svg`   |

## Tech Stack

- React 18.3, Vite 6
- vite-plugin-pwa (Workbox) for offline support
- Fontsource for bundled fonts with Greek glyphs
- Vitest, ESLint

## Project Structure

```
src/
├── components/   # Settings, game screen, scoreboard, round editing
├── hooks/        # useGame: reducer + localStorage persistence
├── i18n/         # UI strings (Greek)
├── utils/        # scoring.js: pure game rules
├── styles/       # CSS
├── App.jsx
└── main.jsx
```

See `CLAUDE.md` for detailed architecture notes.
