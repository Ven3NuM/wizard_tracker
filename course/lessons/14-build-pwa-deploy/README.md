# Μάθημα 14 · Build, PWA και δημοσίευση

**Στόχοι:** να καταλάβεις τι γίνεται από τον κώδικα μέχρι τη διεύθυνση που ανοίγει ο κόσμος, πώς η
εφαρμογή δουλεύει χωρίς ίντερνετ, και πώς κάθε push δημοσιεύεται αυτόματα.

Αυτό το μάθημα είναι μόνο θεωρία. Ο κώδικας που περιγράφει είναι η ίδια η εφαρμογή, στο `app/`.

## Ανάπτυξη και παραγωγή

| | `npm run dev` | `npm run build` |
| --- | --- | --- |
| Για ποιον | εσένα, όσο γράφεις | τον κόσμο |
| Τι κάνει | σερβίρει τα αρχεία του `src/` και τα μεταφράζει όταν ζητηθούν | τα πακετάρει σε λίγα αρχεία στο `app/dist/` |
| Κώδικας | ευανάγνωστος, με προειδοποιήσεις, `StrictMode` διπλά renders | μικρός (minified), χωρίς τίποτα από αυτά |
| Αλλαγές | εμφανίζονται αμέσως | χρειάζεται νέο build |

Το `dist/` είναι **αποτέλεσμα**, όχι κώδικας: δεν το αλλάζεις με το χέρι και δεν μπαίνει στο git
(είναι στο `.gitignore`). Το ξαναφτιάχνει όποιος έχει τον κώδικα, και αυτό το κάνει το CI πιο κάτω.

```
app/dist/
├── index.html
├── assets/index-Bx3k9.js      όλη η JavaScript, ένα αρχείο
├── assets/index-C8f2a.css     όλο το CSS
├── assets/*.woff2             οι γραμματοσειρές
├── sw.js                      ο service worker (πιο κάτω)
└── manifest.webmanifest, εικονίδια
```

Τα παράξενα κομμάτια στα ονόματα (`Bx3k9`) είναι **hash** του περιεχομένου. Όταν αλλάζει ο κώδικας,
αλλάζει το όνομα, και ο browser δεν μπορεί να κρατήσει μια παλιά έκδοση στην cache κατά λάθος.

Για να δεις το build όπως θα το δει ο κόσμος: `npm run build` και μετά `npm run preview`.

### Το `base`

Το GitHub Pages σερβίρει την εφαρμογή στο `https://ven3num.github.io/wizard_tracker/`, δηλαδή σε
υποφάκελο, όχι στη ρίζα του domain. Στο `app/vite.config.js`:

```js
base: '/wizard_tracker/',
```

Έτσι το Vite γράφει όλες τις διαδρομές (`/wizard_tracker/assets/…`) σωστά.

## PWA: εγκατάσταση και λειτουργία χωρίς ίντερνετ

Μια **Progressive Web App** είναι ιστοσελίδα που συμπεριφέρεται σαν εφαρμογή: μπαίνει στην αρχική
οθόνη του κινητού με δικό της εικονίδιο, ανοίγει χωρίς τη γραμμή του browser, και **δουλεύει offline**.
Για μια εφαρμογή που χρησιμοποιείς σε ένα τραπέζι, ίσως σε υπόγειο χωρίς σήμα, αυτό μετράει.

Δύο κομμάτια, και τα δύο τα φτιάχνει το `vite-plugin-pwa` στο `app/vite.config.js`:

- **Manifest** (`manifest.webmanifest`): όνομα, χρώματα, εικονίδια. Ο browser το διαβάζει για να
  προσφέρει «Εγκατάσταση».
- **Service worker** (`sw.js`): ένα script που ο browser κρατάει στο παρασκήνιο, ανάμεσα στην εφαρμογή
  και το δίκτυο. Στην πρώτη επίσκεψη αποθηκεύει όλα τα αρχεία του `dist/` (precache). Μετά τα σερβίρει
  από εκεί, με ή χωρίς ίντερνετ.

```js
VitePWA({
  registerType: 'autoUpdate',   // νέα έκδοση; ενημερώσου μόνος σου
  manifest: { name: 'Wizard Tracker', lang: 'el', display: 'standalone', … },
  workbox: { globPatterns: ['**/*.{js,css,html,woff2,svg,png,ico}'] },
})
```

Γι' αυτό και οι γραμματοσειρές είναι μέσα στην εφαρμογή (`@fontsource/…` στο `index.css`) και όχι από
το Google Fonts: ό,τι έρχεται από άλλο site δεν θα υπήρχε offline. Φορτώνουμε μόνο λατινικούς και
ελληνικούς χαρακτήρες, για να μένει μικρό το κατέβασμα.

## CI/CD: από το push στον αέρα

**CI** (continuous integration): σε κάθε push, ένας υπολογιστής του GitHub κατεβάζει τον κώδικα και
τρέχει όλους τους ελέγχους. **CD** (continuous deployment): αν περάσουν, δημοσιεύει.

Το αρχείο είναι το `.github/workflows/deploy.yml`:

```yaml
jobs:
  check:
    steps:
      - npm ci                 # ακριβώς οι εκδόσεις του package-lock.json
      - npm run lint
      - npm test               # unit tests
      - npm run test:e2e       # χτίζει την εφαρμογή και τρέχει τα e2e
      - upload-pages-artifact  # ανεβάζει το app/dist
  deploy:
    needs: check               # μόνο αν πέρασαν όλα
    if: master                 # μόνο από το master
    steps:
      - deploy-pages
```

Το αποτέλεσμα: **δεν δημοσιεύεις ποτέ με το χέρι**, και δεν φτάνει ποτέ στον κόσμο έκδοση που χαλάει
κάποιο test. Ένα pull request τρέχει τους ίδιους ελέγχους αλλά δεν δημοσιεύει, οπότε βλέπεις αν
είναι εντάξει πριν το κάνεις merge.

Μία φορά, στο GitHub: Settings → Pages → Source: **GitHub Actions**.

## Όλη η διαδρομή

```
γράφεις κώδικα ── npm run dev ── βλέπεις αλλαγές αμέσως
      │
   git push
      │
GitHub Actions ── lint ── unit ── build + e2e ── ✔
      │
GitHub Pages ── https://ven3num.github.io/wizard_tracker/
      │
κινητό ── service worker ── δουλεύει και offline
```

## Σύνοψη

- `dev` για σένα, `build` για τον κόσμο. Το `dist/` παράγεται και δεν μπαίνει στο git.
- PWA = manifest + service worker: εγκατάσταση και λειτουργία offline.
- CI/CD: κάθε push ελέγχεται, και μόνο ό,τι περνάει από το `master` δημοσιεύεται.

**Για παραπέρα:** [vite.dev/guide/build](https://vite.dev/guide/build),
[vite-pwa-org.netlify.app](https://vite-pwa-org.netlify.app/guide/),
[docs.github.com/pages](https://docs.github.com/pages)

---

Τέλος του μαθήματος. Ξεκίνησες από ένα `<h1>` και έφτασες σε μια εφαρμογή με state, reducer,
αποθήκευση, δύο γλώσσες, dialog, tests και αυτόματη δημοσίευση. Για επόμενο βήμα, δοκίμασε μόνος σου
ένα στατιστικό «καλύτερος γύρος» στην οθόνη του τέλους: μια καθαρή συνάρτηση στο `rules.js`, το test
της, και λίγο JSX στο `FinalResults`.
