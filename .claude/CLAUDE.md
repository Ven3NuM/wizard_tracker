# CLAUDE.md

Guidance for Claude Code in this repository.

## What this is

An npm workspace with three parts:

- **`webapp/`**: Wizard Tracker, a Greek/English, mobile-first score keeper for the Wizard card game (3-6 players, 60 / players rounds). All the React code lives here. Published to GitHub Pages at `/wizard_tracker/`.
- **`app/`**: the Android app (iOS later): a Capacitor 8 shell around `webapp/`'s native build. No React code of its own; never copy `webapp/src` here.
- **`course/`**: a Greek React course for the owner, who knows HTML/CSS/JS but is learning React. 15 lessons rebuild the app step by step. Each lesson folder has a `README.md` (theory, Greek) and a runnable `src/` snapshot of the app at that step.

The user writes in Greek; answer in Greek.

## Commands (from the root)

```bash
npm run dev           # webapp dev server (http://localhost:5173/wizard_tracker/)
npm run build         # webapp/dist
npm test              # Vitest, webapp/src/**/*.test.js
npm run test:e2e      # Playwright, webapp/e2e (builds, previews on :4173, Pixel 7 viewport)
npm run lint          # ESLint 10 flat config (eslint.config.js), webapp + course
npm run lesson 3      # course lesson 3 in the browser; `npm run lesson 13 test` runs its tests
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
- PWA icons in `webapp/public/` were generated from `icon.svg` (`npx @vite-pwa/assets-generator`, minimal-2023 preset, background `#0E131B` for maskable and Apple icons; set it with a temporary `pwa-assets.config.js`); not a dependency.

## app/ (Capacitor)

- `capacitor.config.json`: appId `io.github.ven3num.wizardtracker` (permanent once on the Play Store), `webDir: ../webapp/dist-native`, SystemBars `insetsHandling: css` (injects `--safe-area-inset-*`, read by the `--safe-*` tokens), style `DARK` (light icons).
- `app/android/` is committed (Gradle files, `MainActivity` with `EdgeToEdge.enable`, icons, splash); its copied web assets are not. `capacitor.settings.gradle` is regenerated by `cap sync`.
- Version: `android/app/build.gradle` reads `webapp/package.json` `version`; versionCode = major·10000 + minor·100 + patch. Release tags must match it (`release.yml` checks).
- Release signing only from env vars `ANDROID_KEYSTORE_FILE/_PASSWORD`, `ANDROID_KEY_ALIAS/_PASSWORD`. Keystores are gitignored and never enter the repo.
- Android icons and splash were generated from `icon.svg` (hat at 1.2× on transparent for the adaptive foreground, `#0E131B` background) with `npx @capacitor/assets generate --android` from a temporary `app/assets/`; not a dependency.
- Building locally needs JDK 21 and the Android SDK (Android Studio). Without them, CI's debug APK is the check.

## course/ conventions

- Lessons 01-11 import the app's CSS (`../../../../webapp/src/index.css`) and hardcode Greek strings; lesson 12 introduces folders, `i18n/` and Context (language switch), and its `src/` is a copy of `webapp/src` without tests; lesson 13 is `webapp/src` with tests; lessons 14 (build, PWA, deploy) and 15 (Capacitor, Android app) are theory only.
- **When `webapp/src` changes, update lessons 12 and 13 (copy), and any earlier lesson whose README or code shows the changed part.**
- Lesson READMEs: Greek prose, English code and comments, sections Στόχοι → θεωρία → «Ο κώδικας αυτού του μαθήματος» → «Δοκίμασέ το» → «Σύνοψη» → links to react.dev.

## Root

Keep it minimal: workspace `package.json`/lockfile, `eslint.config.js`, `.mcp.json`, `.gitignore`, `README.md`, `.github/`, `.claude/`.
