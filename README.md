# Wizard Tracker

Εφαρμογή για το σκορ του παιχνιδιού καρτών Wizard, για κινητό, σε ελληνικά και αγγλικά. Και ένα μάθημα React
που τη χτίζει από το μηδέν.

**Στον browser:** https://ven3num.github.io/wizard_tracker/
**Για Android:** το `.apk` της τελευταίας έκδοσης, από τα [Releases](https://github.com/Ven3NuM/wizard_tracker/releases/latest)

| Φάκελος | Τι είναι |
| --- | --- |
| [`webapp/`](webapp) | Η εφαρμογή: όλος ο κώδικας React, και η έκδοση για browser (GitHub Pages) |
| [`app/`](app) | Η εφαρμογή για κινητό (Android, αργότερα iOS): το `webapp/` μέσα σε native κέλυφος με [Capacitor](https://capacitorjs.com) |
| [`course/`](course/README.md) | Μάθημα React σε 17 βήματα (0-16), με λεξικό όρων, που καταλήγει στην ίδια εφαρμογή |

## Εγκατάσταση στο Android

1. Από το κινητό, άνοιξε τα [Releases](https://github.com/Ven3NuM/wizard_tracker/releases/latest) και κατέβασε το `wizard-tracker-X.Y.Z.apk`.
2. Άνοιξέ το. Την πρώτη φορά το Android ζητά να επιτρέψεις εγκατάσταση από αυτή την πηγή (browser ή «Αρχεία»).
3. Για νέα έκδοση, κάνε το ίδιο: εγκαθίσταται από πάνω και το παιχνίδι που είναι σε εξέλιξη μένει.

## Τι κάνει η εφαρμογή

- 3–6 παίκτες, μοιράζονται και τα 60 φύλλα: 3 παίκτες 20 γύροι, 4 → 15, 5 → 12, 6 → 10
- Επιλογή ή κλήρωση πρώτου dealer, η μοιρασιά προχωράει μία θέση κάθε γύρο
- Δηλώσεις και μετά μπάζες ανά γύρο, με έλεγχο (οι μπάζες αθροίζουν στα φύλλα)
- Προαιρετικός κανόνας hook: οι δηλώσεις δεν μπορούν να είναι ίσες με τα φύλλα
- Πίνακας σκορ με τρέχοντα σύνολα, διόρθωση οποιουδήποτε γύρου
- Κατάταξη με ισοβαθμίες, ρεβάνς με τους ίδιους παίκτες
- Το παιχνίδι μένει μετά από refresh ή κλείσιμο
- Ελληνικά και αγγλικά, με επιλογή στην αρχική οθόνη
- Εφαρμογή Android, ή εγκατάσταση από τον browser (PWA). Δουλεύει χωρίς ίντερνετ
- Στο Android app η οθόνη μένει ανοιχτή όσο κρατάει το παιχνίδι

## Ανάπτυξη

Χρειάζεται Node.js 22.12 ή νεότερο.

```bash
npm install
npm run dev
```

| Εντολή | Τι κάνει |
| --- | --- |
| `npm run dev` | Η εφαρμογή σε dev server με hot reload |
| `npm run build` | Build για παραγωγή στο `webapp/dist/` |
| `npm run preview` | Σερβίρει το build τοπικά |
| `npm test` | Unit tests (Vitest) |
| `npm run test:e2e` | E2E tests σε browser μεγέθους κινητού (Playwright) |
| `npm run lint` | ESLint, για `webapp/` και `course/` |
| `npm run lesson <n>` | Ανοίγει το μάθημα `n` |
| `npm run app:build` | Build για το Android app και αντιγραφή του στο `app/android/` |
| `npm run app:open` | Ανοίγει το `app/android/` στο Android Studio |

Την πρώτη φορά, για τα e2e: `npx playwright install chromium`.

Το repo είναι npm workspace: ένα `npm install` στη ρίζα καλύπτει όλους τους φακέλους. Το `webapp/dist/`
παράγεται από το build, δεν μπαίνει στο git, και το δημοσιεύει το GitHub Actions
(`.github/workflows/deploy.yml`) σε κάθε push στο `master`, αφού περάσουν lint και tests.

## Android app

Το `app/` δεν έχει δικό του κώδικα React. Το `npm run app:build` χτίζει το `webapp/` για κινητό
(`vite build --mode native`: χωρίς service worker, στο `webapp/dist-native/`) και το αντιγράφει μέσα στο
Android project (`app/android/`). Ό,τι αλλάζει στο `webapp/src` αλλάζει και στο app.

Για να το τρέξεις σε emulator ή σε κινητό με καλώδιο χρειάζεσαι το [Android Studio](https://developer.android.com/studio):
`npm run app:build`, `npm run app:open`, και ▶ Run. Αλλιώς, κάθε push στο GitHub χτίζει ένα δοκιμαστικό APK
(στο run του «CI & Deploy», Artifacts → `wizard-tracker-debug-apk`).

### Νέα έκδοση

1. Άλλαξε το `version` στο `webapp/package.json` (π.χ. `2.1.0`). Από εκεί το παίρνει και το Android
   (versionName `2.1.0`, versionCode `20100`).
2. Commit, και tag με το ίδιο νούμερο: `git tag v2.1.0 && git push --tags`.
3. Το workflow «Release» φτιάχνει υπογεγραμμένο `.apk` (για το GitHub) και `.aab` (για το Play Store) και
   τα ανεβάζει σε νέο Release.

### Υπογραφή

Κάθε έκδοση πρέπει να υπογράφεται με **το ίδιο κλειδί**, αλλιώς το Android δεν την εγκαθιστά πάνω στην
παλιά. Το κλειδί (`.jks`) και οι κωδικοί του ζουν **μόνο** εκτός repo, με αντίγραφο ασφαλείας, και στο
GitHub ως secrets (Settings → Secrets and variables → Actions):

| Secret | Τι είναι |
| --- | --- |
| `ANDROID_KEYSTORE_BASE64` | το αρχείο `.jks` σε base64 |
| `ANDROID_KEYSTORE_PASSWORD` | ο κωδικός του αρχείου |
| `ANDROID_KEY_ALIAS` | το όνομα του κλειδιού μέσα στο αρχείο |
| `ANDROID_KEY_PASSWORD` | ο κωδικός του κλειδιού |

Αν το κλειδί χαθεί, δεν μπορεί να βγει ποτέ ξανά ενημέρωση της ίδιας εφαρμογής.

## Δομή

```
webapp/
├── src/
│   ├── game/      κανόνες, reducer, αποθήκευση (χωρίς UI)
│   ├── ui/        components
│   ├── i18n/      κείμενα (ελληνικά, αγγλικά) και επιλογή γλώσσας
│   ├── native.js  κουμπί «πίσω», οθόνη ανοιχτή (μόνο στο app)
│   └── App.jsx, main.jsx, index.css
├── e2e/           Playwright tests και ρυθμίσεις
├── public/        εικονίδια
├── index.html
└── vite.config.js (+ Vitest, PWA, native build)
app/
├── capacitor.config.json   id, όνομα, πού είναι το build, status bar
└── android/                Android Studio project (εικονίδια, υπογραφή, version)
course/
├── lessons/NN-…/  README.md (θεωρία) + src/ (ο κώδικας εκείνου του βήματος)
└── lesson.js      το «npm run lesson»
```

**Stack:** React 19, Vite 8, vite-plugin-pwa, Capacitor 8, Vitest, Playwright, ESLint 10.
