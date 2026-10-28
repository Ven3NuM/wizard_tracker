# CLAUDE.md

Guidance for Claude Code in this repository.

## What this is

An npm workspace with two parts:

- **`app/`**: Wizard Tracker, a Greek/English, mobile-first score keeper for the Wizard card game (3-6 players, 60 / players rounds). Published to GitHub Pages at `/wizard_tracker/`.
- **`course/`**: a Greek React course for the owner, who knows HTML/CSS/JS but is learning React. 14 lessons rebuild the app step by step. Each lesson folder has a `README.md` (theory, Greek) and a runnable `src/` snapshot of the app at that step.

The user writes in Greek; answer in Greek.

## Commands (from the root)

```bash
npm run dev           # app dev server (http://localhost:5173/wizard_tracker/)
npm run build         # app/dist
npm test              # Vitest, app/src/**/*.test.js
npm run test:e2e      # Playwright, app/e2e (builds, previews on :4173, Pixel 7 viewport)
npm run lint          # ESLint 10 flat config (eslint.config.js), app + course
npm run lesson 3      # course lesson 3 in the browser; `npm run lesson 13 test` runs its tests
```

`app/dist/` is build output: gitignored, never edited. CI (`.github/workflows/deploy.yml`) runs lint, unit, e2e on every push/PR and deploys master to Pages.

**Checking the UI:** after visual changes, look at the app instead of guessing. Use the Playwright MCP server (`.mcp.json`) when connected; otherwise script `@playwright/test`'s `chromium` against `npm run preview` and read the screenshots. Phone width first.

## app/ architecture

```
src/
├── game/            logic only, never imports from ui/
│   ├── rules.js     pure rules: roundInfo, roundScore, validation, scoreTable, ranking
│   ├── reducer.js   state shape (documented at the top) and actions
│   └── useGame.js   useReducer + versioned localStorage persistence
├── ui/              Setup, GameScreen, RoundHeader, RoundEntry, Scoreboard, EditRoundDialog, FinalResults, Stepper, Avatar, LanguageSwitch
├── i18n/            el.js, en.js strings; index.js (LANGUAGES, LanguageContext, useTranslation); LanguageProvider.jsx
├── App.jsx, main.jsx, index.css
```

Rules of the codebase:

- **Store only user input.** `game = { players, hookRule, firstDealer, rounds: [{ bids, tricks }], current: { phase, bids, tricks } | null }`. Dealer, cards, round number, scores, totals, ranking are derived (`roundInfo`, `scoreTable`, `totalsOf`, `ranking`).
- `roundInfo(index, playerCount, firstDealer)` → `{ index, cards, dealer, firstBidder }`, computed once per round and passed to rule functions (`bidsError(bids, round, hookRule)`, `tricksError(tricks, round)`, `forbiddenDealerBid(bids, round)`).
- Validation returns `null` or `{ type, ...data }`; `errorMessage()` maps it via `t.errors[type]`. No text in `game/`.
- Actions: `START_GAME`, `REMATCH` (first dealer +1), `NEW_GAME` (keeps `lastSetup`), `SET_VALUE` (bid or trick depending on phase), `CONFIRM_BIDS`, `BACK_TO_BIDS`, `FINISH_ROUND`, `UPDATE_ROUND`. The UI validates; the reducer trusts input.
- Changing the stored state shape → bump `VERSION` in `useGame.js` (old saves are then ignored).
- All user-facing text in `i18n/el.js` and `i18n/en.js` (same keys, enforced by `i18n.test.js`). Components get `{ t, errorMessage, language, setLanguage }` from `useTranslation()`; `LanguageProvider` (wraps `App` in `main.jsx`) holds the language, defaults to the device language, saves it under `wizard-tracker-language` and sets `<html lang>`. The ΕΛ/EN switch (`LanguageSwitch`) sits in the header, on the setup screen only. E2E runs with locale `el-GR`.
- CSS: BEM class names, tokens on `:root`, state styled through ARIA (`[aria-pressed='true']`). Dark "Night Table" look: surfaces on `--color-bg`, lime `--color-accent` only for actions and the leader, one `--player-N` color per seat (`Avatar`, scoreboard dots). Fonts via Fontsource (Latin + Greek subsets): Commissioner 400/600/800. Lessons 01-11 import this same `index.css`, so keep their class names styled. Keep `:focus-visible` outlines.
- Native elements over custom code: `<form onSubmit>`, `<dialog>` + `showModal()` for the edit sheet, labels wrapping inputs. Steppers have `aria-label`s ("Άννα, Δήλωση: αύξηση") that e2e tests rely on.
- PWA icons in `app/public/` were generated from `icon.svg` (`npx @vite-pwa/assets-generator`, minimal-2023 preset, background `#0E131B` for maskable and Apple icons; set it with a temporary `pwa-assets.config.js`); not a dependency.

## course/ conventions

- Lessons 01-11 import the app's CSS (`../../../../app/src/index.css`) and hardcode Greek strings; lesson 12 introduces folders, `i18n/` and Context (language switch), and its `src/` is a copy of `app/src` without tests; lesson 13 is `app/src` with tests; lesson 14 is theory only.
- **When `app/src` changes, update lessons 12 and 13 (copy), and any earlier lesson whose README or code shows the changed part.**
- Lesson READMEs: Greek prose, English code and comments, sections Στόχοι → θεωρία → «Ο κώδικας αυτού του μαθήματος» → «Δοκίμασέ το» → «Σύνοψη» → links to react.dev.

## Root

Keep it minimal: workspace `package.json`/lockfile, `eslint.config.js`, `.mcp.json`, `.gitignore`, `README.md`, `.github/`, `.claude/`.
