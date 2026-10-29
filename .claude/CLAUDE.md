# CLAUDE.md

Guidance for Claude Code in this repository.

## What this is

An npm workspace with three parts:

- **`webapp/`**: Wizard Tracker, a Greek/English, mobile-first score keeper for the Wizard card game (3-6 players, 60 / players rounds). All the React code lives here. Published to GitHub Pages at `/wizard_tracker/`.
- **`app/`**: the Android app (iOS later): a Capacitor 8 shell around `webapp/`'s native build. No React code of its own; never copy `webapp/src` here.
- **`course/`**: a Greek React course for the owner, who knows HTML/CSS/JS but is learning React. Lesson 00 explains the tooling (terminal, Node, npm, Vite, ESLint, git), then lessons 01-16 rebuild the app step by step; `course/GLOSSARY.md` defines every term. Each lesson folder has a `README.md` (theory, Greek) and a runnable `src/` snapshot of the app at that step.

The user writes in Greek; answer in Greek.

## Commands (from the root)

```bash
npm run dev           # webapp dev server (http://localhost:5173/wizard_tracker/)
npm run build         # webapp/dist
npm test              # Vitest, webapp/src/**/*.test.js
npm run test:e2e      # Playwright, webapp/e2e (builds, previews on :4173, Pixel 7 viewport)
npm run lint          # ESLint 10 flat config (eslint.config.js), webapp + course
npm run lesson 3      # course lesson 3 in the browser; `npm run lesson 14 test` runs its tests
npm run app:build     # webapp native build (webapp/dist-native) + `cap sync android`
npm run app:open      # app/android in Android Studio
```

`webapp/dist/`, `webapp/dist-native/` and `app/android/app/src/main/assets/public/` are build output: gitignored, never edited. CI (`.github/workflows/deploy.yml`) runs lint, unit, e2e on every push/PR, builds a debug APK (run artifact) and deploys master to Pages. A `v*` tag runs `release.yml`: signed APK + AAB on a GitHub Release (keystore from the `ANDROID_*` secrets, see README «Υπογραφή»).

**Checking the UI:** after visual changes, look at the app instead of guessing. Use the Playwright MCP server (`.mcp.json`) when connected; otherwise script `@playwright/test`'s `chromium` against `npm run preview` and read the screenshots. Phone width first.

## webapp/ architecture

```
src/
├── game/            logic only, never imports from ui/
│   ├── rules.js     pure rules: roundInfo, roundScore, validation, scoreTable, ranking, hitsOf, bestRound
│   ├── reducer.js   state shape (documented at the top) and actions
│   └── useGame.js   useReducer + versioned localStorage persistence
├── ui/              Setup, GameScreen, RoundHeader, GameMenu, RoundEntry, Standings, Scoreboard, EditRoundDialog, FinalResults, Stepper, Avatar, LanguageSwitch; icons.jsx, format.js
├── i18n/            el.js, en.js strings; index.js (LANGUAGES, LanguageContext, useTranslation); LanguageProvider.jsx
├── native.js        Capacitor only: Android back button, keep screen on; no-ops in a browser
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
- Safe areas: content clears the status/gesture bars through `--safe-top/right/bottom/left` tokens (`viewport-fit=cover` in `index.html`). New full-width or fixed edges must add them.
- `vite build --mode native` (`build:native`): base `/`, no PWA plugin, output `dist-native/`. Anything that only makes sense in a browser tab (service worker, install prompt) stays out of that mode.
- App icon: two fanned cards, the lime front one with a dark W, on a dark radial glow. `webapp/public/icon.svg` is the source; `LogoIcon` (ui/icons.jsx) draws the same cards with tokens for the header. The PWA PNGs, `favicon.ico` (one 48px PNG in an ICO) and the Android icons/splash were rendered from it with `@playwright/test`'s chromium (maskable and Apple full-bleed, no rounded corners); not a dependency.

## app/ (Capacitor)

- `capacitor.config.json`: appId `io.github.ven3num.wizardtracker` (permanent once on the Play Store), `webDir: ../webapp/dist-native`, SystemBars `insetsHandling: css` (injects `--safe-area-inset-*`, read by the `--safe-*` tokens), style `DARK` (light icons).
- `app/android/` is committed (Gradle files, `MainActivity` with `EdgeToEdge.enable`, icons, splash); its copied web assets are not. `capacitor.settings.gradle` is regenerated by `cap sync`.
- Version: `android/app/build.gradle` reads `webapp/package.json` `version`; versionCode = major·10000 + minor·100 + patch. Release tags must match it (`release.yml` checks).
- Release signing only from env vars `ANDROID_KEYSTORE_FILE/_PASSWORD`, `ANDROID_KEY_ALIAS/_PASSWORD`. Keystores are gitignored and never enter the repo.
- Android icons and splash: PNGs rendered from `icon.svg` (cards at 1.3× on transparent for the adaptive foreground, the glow as background, cards at 0.32× on `#0E131B` for the splash), then `npx @capacitor/assets generate --android` from a temporary `app/assets/`; not a dependency.
- `MainActivity` calls `EdgeToEdge.enable` after `super.onCreate`: before it, the window is built with the splash theme and shows a title bar painted with the splash image.
- Building locally needs JDK 21 and the Android SDK (Android Studio). Without them, CI's debug APK is the check.

## course/ conventions

- Lessons 01-11 import the app's CSS (`../../../../webapp/src/index.css`) and hardcode Greek strings.
- Lesson 12 (folders, final look): `webapp/src` with `game/`, `ui/`, `index.css`, but Greek written inline instead of `t.…` (no `i18n/`, `LanguageSwitch`, `native.js`; per-component `errorMessages` like lessons 05-11). Lesson 13 (Context, two languages) is a copy of `webapp/src` without tests; lesson 14 (testing) is `webapp/src` with tests; lessons 15 (build, PWA, deploy) and 16 (Capacitor) are theory only.
- **When `webapp/src` changes, update lesson 12 (same change, Greek inline), lessons 13 and 14 (copy), and any earlier lesson whose README or code shows the changed part.**
- Lesson READMEs: Greek prose, English code and comments, sections Στόχοι → «Πριν ξεκινήσεις» box (each new tool/term: what it is and why we need it, then a link to the glossary) → θεωρία → «Ο κώδικας αυτού του μαθήματος» → «Δοκίμασέ το» → «Ασκήσεις» (two, each solution in `<details>`, checked against that lesson's code) → «Σύνοψη» → links to react.dev.
- A new term in any lesson gets a line in `course/GLOSSARY.md` (with the lesson number) and, if it is central to the lesson, in its «Πριν ξεκινήσεις» box. Lesson 00 (tools) is theory only.
- Course code reads like it was written for a learner: one idea per line, a named variable over a nested ternary, a loop over a clever `reduce`, identity by index (`seat`) not by display text.

## Root

Keep it minimal: workspace `package.json`/lockfile, `eslint.config.js`, `.mcp.json`, `.gitignore`, `README.md`, `.github/`, `.claude/`.
