# Μάθημα 15 · Από web app σε Android app με Capacitor

**Στόχοι:** να καταλάβεις πώς η ίδια εφαρμογή React γίνεται εφαρμογή Android που κατεβαίνει από το
GitHub (και αργότερα από το Play Store), τι αλλάζει στον κώδικα και τι όχι, και πώς βγαίνει μια νέα έκδοση.

Αυτό το μάθημα είναι μόνο θεωρία. Ο κώδικας που περιγράφει είναι στο `webapp/` και στο `app/`.

## Τρεις τρόποι για εφαρμογή κινητού

| | PWA (μάθημα 14) | Capacitor | React Native |
| --- | --- | --- | --- |
| Τι είναι | ιστοσελίδα που εγκαθίσταται | η ιστοσελίδα μέσα σε πραγματικό app | app με native στοιχεία οθόνης |
| Κώδικας | ο δικός μας | ο δικός μας, σχεδόν όπως είναι | ξαναγράφεται όλο το UI (`<View>` αντί για `<div>`, χωρίς CSS) |
| Αρχείο `.apk`, Play Store | όχι | ναι | ναι |
| App Store (iPhone) | όχι | ναι | ναι |

Η React που έμαθες λέγεται **React DOM**: τα components γίνονται HTML μέσα στον browser. Το React
Native κρατάει τα components, το state και τα hooks, αλλά τα «τουβλάκια» είναι άλλα. Για μια έτοιμη
εφαρμογή με φόρμες και πίνακες, όπως η δική μας, το Capacitor δίνει πραγματικό app χωρίς να
ξαναγράψουμε τίποτα.

## Τι κάνει το Capacitor

Ένα Android app από Capacitor έχει μία οθόνη: ένα **WebView**, δηλαδή τη μηχανή του Chrome χωρίς
γραμμή διευθύνσεων. Μέσα της φορτώνει το build μας, που είναι **πακεταρισμένο μέσα στο `.apk`**:
δεν το κατεβάζει από το ίντερνετ, οπότε δουλεύει offline από την πρώτη φορά.

```
┌──────────── .apk ────────────┐
│  native κέλυφος (Java)       │  το φτιάχνει το Capacitor
│  ┌────────────────────────┐  │
│  │ WebView                │  │
│  │   webapp/dist-native   │  │  ο δικός μας κώδικας React
│  └────────────────────────┘  │
│  plugins: back, keep awake   │  JavaScript ↔ Android
└──────────────────────────────┘
```

Το repo έχει πια δύο φακέλους για την εφαρμογή:

```
webapp/   όλος ο κώδικας React (ό,τι έμαθες ως το μάθημα 14)
app/      το κέλυφος: capacitor.config.json και το Android project (app/android/)
```

Στο `app/` **δεν υπάρχει** αντίγραφο του κώδικα. Αν υπήρχε, κάθε διόρθωση θα έπρεπε να γίνει δύο φορές,
και κάποια στιγμή θα ξεχνούσαμε τη μία.

```json
{
  "appId": "io.github.ven3num.wizardtracker",
  "appName": "Wizard Tracker",
  "webDir": "../webapp/dist-native"
}
```

Το `appId` είναι η ταυτότητα της εφαρμογής στο Android και στο Play Store. Δεν αλλάζει ποτέ: αν
αλλάξει, για το κινητό είναι άλλη εφαρμογή.

## Δύο builds από τον ίδιο κώδικα

Το Vite έχει **modes**: το `vite build --mode native` τρέχει το ίδιο config με `mode === 'native'`.

```js
export default defineConfig(({ mode }) => {
  const native = mode === 'native'
  return {
    base: native ? '/' : '/wizard_tracker/',
    build: { outDir: native ? 'dist-native' : 'dist' },
    plugins: [react(), !native && VitePWA({ … })],
  }
})
```

- **`base`**: στο app τα αρχεία σερβίρονται από τη ρίζα, όχι από τον υποφάκελο του GitHub Pages.
- **Χωρίς service worker**: τα αρχεία είναι ήδη μέσα στο app, και ένας service worker θα μπορούσε να
  σερβίρει παλιά έκδοση μετά από ενημέρωση. Το `false` μέσα στο `plugins` το αγνοεί το Vite.

Το `npm run app:build` κάνει τα δύο βήματα: το native build, και το `cap sync`, που το αντιγράφει μέσα
στο Android project.

## Τι άλλαξε στον κώδικα React

Ελάχιστα, και όλα συγκεντρωμένα σε ένα αρχείο, το `src/native.js`:

```js
import { Capacitor } from '@capacitor/core'
import { App } from '@capacitor/app'

const isNative = Capacitor.isNativePlatform()

export function setupNativeApp() {
  if (!isNative) return

  App.addListener('backButton', () => {
    const dialog = document.querySelector('dialog[open]')
    const popover = document.querySelector(':popover-open')
    if (dialog) dialog.dispatchEvent(new Event('cancel', { cancelable: true }))
    else if (popover) popover.hidePopover()
    else App.minimizeApp()
  })
}
```

- **Plugins**: το `@capacitor/app` είναι JavaScript που καλεί κώδικα Android. Στον browser δεν κάνουν
  τίποτα, γι' αυτό ελέγχουμε πρώτα το `isNative`.
- **Το κουμπί «πίσω»** του Android δεν υπάρχει στον browser. Χωρίς αυτόν τον κώδικα θα έκλεινε την
  εφαρμογή ακόμα κι αν ήταν ανοιχτό το dialog διόρθωσης. Στέλνουμε στο dialog το ίδιο event `cancel`
  που στέλνει το Escape. Έτσι τρέχει ο ίδιος `onCancel` του μαθήματος 11, που ρωτάει πριν πετάξει
  αλλαγές, χωρίς να γράψουμε τη λογική δεύτερη φορά.

Η οθόνη μένει ανοιχτή όσο κρατάει το παιχνίδι, με ένα effect στο `App.jsx` (μάθημα 10):

```jsx
const playing = Boolean(game)

useEffect(() => keepScreenOn(playing), [playing])
```

Εξαρτάται από το `playing` και όχι από το `game`: το `game` αλλάζει σε κάθε δήλωση, ενώ εμάς μας
ενδιαφέρει μόνο πότε ξεκινάει και πότε τελειώνει το παιχνίδι.

### Notch και gesture bar

Το app ζωγραφίζει κάτω από το status bar και τη γραμμή πλοήγησης (**edge-to-edge**), όπως όλες οι
σύγχρονες εφαρμογές Android. Για να μην κρυφτεί περιεχόμενο από πίσω τους, το CSS ξέρει πόσο χώρο
πιάνουν:

```css
:root {
  --safe-top: var(--safe-area-inset-top, env(safe-area-inset-top, 0px));
}

.app {
  padding-top: calc(16px + var(--safe-top));
}
```

Το `env(safe-area-inset-top)` το δίνει ο browser όταν η σελίδα έχει `viewport-fit=cover` στο
`index.html`. Μερικά παλιά WebView το δίνουν λάθος, γι' αυτό το Capacitor βάζει και το δικό του
`--safe-area-inset-top`, που προτιμάμε όταν υπάρχει. Στον browser του υπολογιστή όλα είναι `0px`.

## Έκδοση και υπογραφή

Κάθε `.apk` είναι **υπογεγραμμένο** με ένα κλειδί (keystore). Το Android εγκαθιστά νέα έκδοση πάνω στην
παλιά μόνο αν έχει την ίδια υπογραφή. Έτσι κανείς άλλος δεν μπορεί να «ενημερώσει» την εφαρμογή σου
με δικό του κώδικα. Για τον ίδιο λόγο, αν χάσεις το κλειδί, δεν βγάζεις ποτέ ξανά ενημέρωση.

Το κλειδί δεν μπαίνει ποτέ στο git. Το έχει το GitHub ως **secret**, και το χρησιμοποιεί μόνο το
workflow της έκδοσης:

```
webapp/package.json  "version": "2.1.0"
        │
git tag v2.1.0 && git push --tags
        │
.github/workflows/release.yml
  ├── ελέγχει ότι tag = version
  ├── npm test, npm run app:build
  ├── ./gradlew assembleRelease bundleRelease   (υπογραφή με το secret)
  └── GitHub Release: wizard-tracker-2.1.0.apk, wizard-tracker-2.1.0.aab
```

Το `.apk` το κατεβάζει και το εγκαθιστά κανείς απευθείας. Το `.aab` (Android App Bundle) είναι η
μορφή που ζητά το Play Store: από αυτό φτιάχνει μικρότερα APK για κάθε κινητό.

Το Android θέλει και έναν ακέραιο αριθμό έκδοσης που μόνο μεγαλώνει (`versionCode`). Τον βγάζουμε
από το `version`: `2.1.0` → `20100`. Μία πηγή αλήθειας, όπως στο μάθημα 4.

## Δοκίμασέ το

1. `npm run build:native -w webapp` και δες τι βγήκε στο `webapp/dist-native/`. Σύγκρινέ το με το
   `webapp/dist/` του `npm run build`: λείπουν τα `sw.js` και `manifest.webmanifest`.
2. Στο GitHub, άνοιξε το τελευταίο run του «CI & Deploy» και κατέβασε το `wizard-tracker-debug-apk`
   από τα Artifacts. Εγκατέστησέ το σε ένα Android, ξεκίνα παιχνίδι, άνοιξε τη διόρθωση γύρου,
   άλλαξε κάτι και πάτα «πίσω».
3. Με το Android Studio: `npm run app:build`, `npm run app:open`, ▶ Run σε emulator. Άλλαξε ένα
   κείμενο στο `el.js`, ξανατρέξε `npm run app:build` και ▶ Run.

## Σύνοψη

- Το Capacitor βάζει το build μας σε WebView μέσα σε πραγματικό app. Ο κώδικας React μένει ένας.
- `--mode native`: άλλο `base`, χωρίς service worker, άλλος φάκελος.
- Ό,τι υπάρχει μόνο στο κινητό (κουμπί «πίσω», οθόνη ανοιχτή) περνάει από plugins, σε ένα αρχείο, και
  στον browser δεν κάνει τίποτα.
- Edge-to-edge: τα `--safe-*` κρατούν το περιεχόμενο μακριά από notch και gesture bar.
- Ίδιο κλειδί σε κάθε έκδοση, κρυμμένο στα secrets. Ένα tag βγάζει `.apk` και `.aab`.

**Για παραπέρα:** [capacitorjs.com/docs](https://capacitorjs.com/docs),
[capacitorjs.com/docs/apis/app](https://capacitorjs.com/docs/apis/app),
[developer.android.com/studio/publish/app-signing](https://developer.android.com/studio/publish/app-signing),
[reactnative.dev](https://reactnative.dev) (αν θελήσεις να δεις την άλλη προσέγγιση)
