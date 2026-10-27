# Wizard Tracker

Εφαρμογή για το σκορ του παιχνιδιού καρτών Wizard, για κινητό, σε ελληνικά και αγγλικά. Και ένα μάθημα React
που τη χτίζει από το μηδέν.

**Η εφαρμογή:** https://ven3num.github.io/wizard_tracker/

| Φάκελος | Τι είναι |
| --- | --- |
| [`app/`](app) | Η εφαρμογή που δημοσιεύεται |
| [`course/`](course/README.md) | Μάθημα React σε 14 βήματα, που καταλήγει στην ίδια εφαρμογή |

## Τι κάνει η εφαρμογή

- 3–6 παίκτες, μοιράζονται και τα 60 φύλλα: 3 παίκτες 20 γύροι, 4 → 15, 5 → 12, 6 → 10
- Επιλογή ή κλήρωση πρώτου dealer, η μοιρασιά προχωράει μία θέση κάθε γύρο
- Δηλώσεις και μετά μπάζες ανά γύρο, με έλεγχο (οι μπάζες αθροίζουν στα φύλλα)
- Προαιρετικός κανόνας hook: οι δηλώσεις δεν μπορούν να είναι ίσες με τα φύλλα
- Πίνακας σκορ με τρέχοντα σύνολα, διόρθωση οποιουδήποτε γύρου
- Κατάταξη με ισοβαθμίες, ρεβάνς με τους ίδιους παίκτες
- Το παιχνίδι μένει μετά από refresh ή κλείσιμο
- Ελληνικά και αγγλικά, με επιλογή στην αρχική οθόνη
- Εγκαθίσταται στο κινητό (PWA) και δουλεύει χωρίς ίντερνετ

## Ανάπτυξη

Χρειάζεται Node.js 22.12 ή νεότερο.

```bash
npm install
npm run dev
```

| Εντολή | Τι κάνει |
| --- | --- |
| `npm run dev` | Η εφαρμογή σε dev server με hot reload |
| `npm run build` | Build για παραγωγή στο `app/dist/` |
| `npm run preview` | Σερβίρει το build τοπικά |
| `npm test` | Unit tests (Vitest) |
| `npm run test:e2e` | E2E tests σε browser μεγέθους κινητού (Playwright) |
| `npm run lint` | ESLint, για `app/` και `course/` |
| `npm run lesson <n>` | Ανοίγει το μάθημα `n` |

Την πρώτη φορά, για τα e2e: `npx playwright install chromium`.

Το repo είναι npm workspace: ένα `npm install` στη ρίζα καλύπτει και τα δύο. Το `app/dist/`
παράγεται από το build, δεν μπαίνει στο git, και το δημοσιεύει το GitHub Actions
(`.github/workflows/deploy.yml`) σε κάθε push στο `master`, αφού περάσουν lint και tests.

## Δομή

```
app/
├── src/
│   ├── game/      κανόνες, reducer, αποθήκευση (χωρίς UI)
│   ├── ui/        components
│   ├── i18n/      κείμενα (ελληνικά, αγγλικά) και επιλογή γλώσσας
│   └── App.jsx, main.jsx, index.css
├── e2e/           Playwright tests και ρυθμίσεις
├── public/        εικονίδια
├── index.html
└── vite.config.js (+ Vitest, PWA)
course/
├── lessons/NN-…/  README.md (θεωρία) + src/ (ο κώδικας εκείνου του βήματος)
└── lesson.js      το «npm run lesson»
```

**Stack:** React 19, Vite 8, vite-plugin-pwa, Vitest, Playwright, ESLint 10.
