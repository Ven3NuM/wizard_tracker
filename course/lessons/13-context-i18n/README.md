# Μάθημα 13 · Context: δύο γλώσσες

**Στόχοι:** να βγάλεις τα κείμενα της οθόνης σε ένα μέρος, να προσθέσεις αγγλικά με επιλογή γλώσσας,
και να μάθεις το **Context**: πώς φτάνει μια τιμή σε όλα τα components χωρίς να περνάει από props.

```bash
npm run lesson 13
```

Ο κώδικας αυτού του μαθήματος είναι **ίδιος με το `webapp/src`** (χωρίς τα tests, που είναι το θέμα
του μαθήματος 14). Σε σχέση με το μάθημα 12, η μόνη νέα λειτουργία είναι η επιλογή γλώσσας: ο φάκελος
`i18n/`, το `LanguageSwitch` στην κεφαλίδα, και τα components διαβάζουν πλέον τα κείμενα από εκεί.

Θα δεις και ένα `native.js`, με δύο γραμμές που το χρησιμοποιούν στο `main.jsx` και στο `App.jsx`. Αφορά
την εφαρμογή Android (μάθημα 16) και στον browser δεν κάνει τίποτα. Αγνόησέ το για τώρα.

## Τα κείμενα σε ένα μέρος

Ως το μάθημα 12 τα ελληνικά ήταν σκορπισμένα μέσα στο JSX, και τα μηνύματα λάθους σε τρία διαφορετικά
`errorMessages`. Για δεύτερη γλώσσα θα έπρεπε να βρεις κάθε κείμενο σε δεκατρία αρχεία. Τώρα όλα ζουν στο `i18n/el.js` (το i18n σημαίνει «internationalization»: i + 18
γράμματα + n):

```js
const el = {
  startGame: 'Έναρξη',
  playerName: (n) => `Παίκτης ${n}`,
  tricksRemaining: (n) => (n === 1 ? 'Απομένει 1 μπάζα' : `Απομένουν ${n} μπάζες`),
  errors: {
    missingName: () => 'Κάθε παίκτης χρειάζεται όνομα.',
    hook: ({ forbidden }) => `Κανόνας hook: ο dealer δεν μπορεί να δηλώσει ${forbidden}.`,
    …
  },
}
```

- Τα σταθερά κείμενα είναι strings. Όσα έχουν αριθμούς ή ονόματα είναι **συναρτήσεις**, γιατί η
  γραμματική (ενικός/πληθυντικός, σειρά λέξεων) διαφέρει από γλώσσα σε γλώσσα.
- Το `en.js` έχει **ακριβώς τα ίδια κλειδιά**. Ένα test (`i18n.test.js`, μάθημα 14) το ελέγχει, ώστε
  να μην ξεχαστεί ποτέ μια μετάφραση.
- Τα λάθη: οι κανόνες επιστρέφουν `{ type: 'hook', forbidden: 1 }` (μάθημα 5), και το
  `errorMessage(error)` βρίσκει το κείμενο από το `type`, στη γλώσσα που είναι επιλεγμένη. Οι κανόνες
  δεν άλλαξαν καθόλου για να αποκτήσει η εφαρμογή δεύτερη γλώσσα. Αυτό είναι το κέρδος του «όχι
  κείμενα στους κανόνες».

## Context: μια τιμή για όλη την εφαρμογή

Η γλώσσα αλλάζει την ώρα που τρέχει η εφαρμογή, άρα είναι **state**. Αλλά τη χρειάζονται **όλα** τα
components, μέχρι και το `Stepper` τρία επίπεδα πιο κάτω. Με όσα ξέρουμε ως τώρα (μάθημα 6) θα έπρεπε
να την ανεβάσουμε στο `App` και να την περνάμε με props σε κάθε component, και από εκεί σε κάθε παιδί
του. Αυτό λέγεται **prop drilling**: props που περνάνε από components που δεν τα χρειάζονται, μόνο για
να φτάσουν πιο κάτω.

Το **Context** λύνει ακριβώς αυτό. Ένα component «παρέχει» μια τιμή, και όποιο component από κάτω του
τη θέλει, τη «διαβάζει» απευθείας, όσο βαθιά κι αν είναι.

**1. Φτιάχνεις το context** (`i18n/index.js`):

```js
export const LanguageContext = createContext(null)
export const useTranslation = () => useContext(LanguageContext)
```

**2. Ένα component το παρέχει** (`i18n/LanguageProvider.jsx`): κρατάει τη γλώσσα σε state και τη
δίνει, μαζί με τα κείμενα, σε όλα τα παιδιά του:

```jsx
export default function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(initialLanguage)
  const t = LANGUAGES[language]
  …
  return <LanguageContext value={{ language, setLanguage, t, errorMessage }}>{children}</LanguageContext>
}
```

Το `children` το είδαμε στο `RoundHeader` (μάθημα 12): ό,τι γράψεις ανάμεσα στο `<LanguageProvider>`
και το `</LanguageProvider>`. Στο `main.jsx` τυλίγουμε όλη την εφαρμογή:

```jsx
<LanguageProvider>
  <App />
</LanguageProvider>
```

**3. Όποιο component θέλει, το διαβάζει**:

```jsx
export default function Stepper({ label, value, max, onChange }) {
  const { t } = useTranslation()
  …
}
```

Όταν πατηθεί «EN», το `setLanguage('en')` αλλάζει το state του provider, και η React ξανασχεδιάζει
**κάθε component που διαβάζει το context**, με τα αγγλικά κείμενα. Κανένα prop δεν πέρασε από πουθενά.

Ο provider κάνει και δύο μικρά πράγματα με ένα effect (μάθημα 10): θυμάται την επιλογή στο
`localStorage` και ενημερώνει το `<html lang="…">`, για τους screen readers και τη μετάφραση του
browser. Την πρώτη φορά, η γλώσσα βγαίνει από τη γλώσσα της συσκευής (`navigator.language`).

### Πότε Context και πότε props

Το Context είναι βολικό, αλλά κρύβει από πού έρχονται τα δεδομένα: κοιτάζοντας το `<Stepper … />` δεν
βλέπεις ότι εξαρτάται από τη γλώσσα. Γι' αυτό:

- **Props** για ό,τι αφορά συγκεκριμένα components: τα δεδομένα του παιχνιδιού, το `onChange` ενός
  stepper. Η ροή φαίνεται στον κώδικα.
- **Context** για ό,τι είναι πραγματικά **καθολικό**: γλώσσα, θέμα (σκούρο/ανοιχτό), συνδεδεμένος χρήστης.

Γι' αυτό το παιχνίδι συνεχίζει να περνάει με props, ενώ η γλώσσα με Context.

### Ένα μικρό τεχνικό σημείο

Το context ζει στο `index.js` και ο provider σε ξεχωριστό `.jsx`. Ο λόγος: το hot reload του Vite
δουλεύει σωστά μόνο όταν ένα αρχείο εξάγει **μόνο components**, και το ESLint σε προειδοποιεί αν
ανακατέψεις components με άλλα exports.

## Δοκίμασέ το

1. Σύγκρινε το `src/` αυτού του μαθήματος με του μαθήματος 12. Σχεδόν κάθε component άλλαξε με τον
   ίδιο τρόπο: ένα `useTranslation()` στην αρχή, και `t.κάτι` στη θέση κάθε κειμένου.
2. Πάτα «English», ξεκίνα παιχνίδι, κάνε refresh. Η γλώσσα μένει.
3. Άλλαξε ένα κείμενο στο `en.js` και δες πού αλλάζει στην οθόνη.
4. Ψάξε στον φάκελο `game/` για `import` από `../i18n`. Δεν υπάρχει κανένα: οι κανόνες δεν ξέρουν
   ότι υπάρχουν γλώσσες.

## Ασκήσεις

**1. Ένα νέο κείμενο.** Πρόσθεσε το κλειδί `goodLuck` («Καλή τύχη!» / «Good luck!») και δείξ' το κάτω
από το κουμπί «Έναρξη». Τι γίνεται αν το ξεχάσεις στο `en.js`;

<details>
<summary>Λύση</summary>

Στο `el.js`: `goodLuck: 'Καλή τύχη!',` και στο `en.js`: `goodLuck: 'Good luck!',`. Στο `Setup`:

```jsx
<p className="hint hint--center">{t.goodLuck}</p>
```

Αν λείπει από το `en.js`, στα αγγλικά το `t.goodLuck` είναι `undefined` και η React δεν δείχνει τίποτα,
χωρίς κανένα λάθος. Γι' αυτό υπάρχει το test του μαθήματος 14 που ελέγχει ότι οι γλώσσες έχουν τα ίδια
κλειδιά.

</details>

**2. Context χωρίς props.** Φτιάξε ένα component `CurrentLanguage` που δείχνει «Ελληνικά» ή «English»
(το `t.languageName`) και βάλ' το οπουδήποτε στο `Setup`. Πόσα props χρειάστηκε;

<details>
<summary>Λύση</summary>

```jsx
function CurrentLanguage() {
  const { t } = useTranslation()
  return <p className="hint hint--center">{t.languageName}</p>
}
```

Κανένα. Το component διαβάζει τη γλώσσα απευθείας από το context, και αλλάζει μόλις πατηθεί ΕΛ/EN.

</details>

## Σύνοψη

- Όλα τα κείμενα σε ένα αρχείο ανά γλώσσα, με συναρτήσεις για όσα έχουν μεταβλητά κομμάτια.
- Context για ό,τι είναι καθολικό (γλώσσα): `createContext`, provider, `useContext` μέσα σε δικό σου hook.
- Props για όλα τα υπόλοιπα, γιατί κρατάνε τη ροή των δεδομένων ορατή.

**Για παραπέρα:** [Passing data deeply with context](https://react.dev/learn/passing-data-deeply-with-context)
