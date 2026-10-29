# Μάθημα 10 · Effects και custom hooks: το παιχνίδι επιβιώνει ένα refresh

**Στόχοι:** να συγχρονίζεις την εφαρμογή με κάτι έξω από τη React (εδώ το `localStorage`) με
`useEffect`, να ξέρεις πότε **δεν** χρειάζεσαι effect, και να μαζεύεις λογική σε δικό σου hook.

```bash
npm run lesson 10
```

## Το πρόβλημα

Παίζετε στο τραπέζι, το κινητό κλειδώνει, ο browser κλείνει την καρτέλα για να γλιτώσει μνήμη. Ξανανοίγεις:
οθόνη ρυθμίσεων, 12 γύροι χαμένοι. Το state της React ζει στη μνήμη και χάνεται μαζί με τη σελίδα.

Το `localStorage` του browser κρατάει κείμενο ανά site, και επιβιώνει refresh, κλείσιμο και επανεκκίνηση.

## Effects

Το component πρέπει να είναι **καθαρό**: από props και state, βγάζει JSX, τίποτα άλλο. Κάποια
πράγματα όμως είναι εκ φύσεως «παρενέργειες»: γράψιμο στο `localStorage`, ένα timer, σύνδεση σε server,
ένας listener στο `document`.

Γι' αυτά υπάρχει το `useEffect`: «αφού σχεδιάσεις, τρέξε αυτό».

```jsx
useEffect(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: VERSION, state }))
}, [state])
```

Το δεύτερο όρισμα, `[state]`, είναι οι **εξαρτήσεις**: το effect ξανατρέχει μόνο όταν αλλάξει κάποια
από αυτές. Εδώ: κάθε φορά που αλλάζει το παιχνίδι, αποθήκευσέ το.

| Εξαρτήσεις | Πότε τρέχει |
| --- | --- |
| `[state]` | μετά την πρώτη σχεδίαση, και κάθε φορά που αλλάζει το `state` |
| `[]` | μία φορά, μετά την πρώτη σχεδίαση (το ξαναβλέπουμε στο μάθημα 11) |
| χωρίς πίνακα | μετά από **κάθε** σχεδίαση (σπάνια το θέλεις) |

Αν το effect στήνει κάτι που πρέπει να «ξεστηθεί» (listener, timer), επιστρέφει μια συνάρτηση
καθαρισμού. Η React την καλεί πριν ξανατρέξει το effect και όταν το component φύγει από την οθόνη:

```jsx
useEffect(() => {
  const id = setInterval(tick, 1000)
  return () => clearInterval(id)
}, [])
```

## Πότε ΔΕΝ χρειάζεσαι effect

Το πιο συχνό λάθος αρχαρίων είναι το effect για υπολογισμούς:

```jsx
const [totals, setTotals] = useState([])
useEffect(() => { setTotals(computeTotals(rounds)) }, [rounds])   // λάθος
```

Αυτό σχεδιάζει δύο φορές (μία με παλιά σύνολα, μία με σωστά) και κρατάει διπλό state. Το σωστό το
είδαμε στο μάθημα 9: `const totals = totalsOf(scoreTable(rounds), n)` κατευθείαν στο component.

> Effects είναι για συγχρονισμό με **εξωτερικά** συστήματα. Για υπολογισμούς από props και state,
> απλή JavaScript στο component.

## Φόρτωμα στην αρχή: lazy initial state

Η αποθήκευση γίνεται με effect. Η **φόρτωση** όμως πρέπει να γίνει πριν την πρώτη σχεδίαση, αλλιώς θα
έβλεπες για μια στιγμή την οθόνη ρυθμίσεων. Το `useReducer` (και το `useState`) δέχεται μια
συνάρτηση που υπολογίζει την αρχική τιμή:

```jsx
const [state, dispatch] = useReducer(reducer, undefined, load)
```

Η React καλεί `load()` **μία φορά**, στην πρώτη σχεδίαση. Το `undefined` είναι το όρισμα που θα
έπαιρνε το `load`, και δεν το χρειαζόμαστε.

## Ανθεκτική αποθήκευση

```js
const STORAGE_KEY = 'wizard-tracker'
const VERSION = 1

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (saved?.version === VERSION) return saved.state
  } catch {
    // Blocked or corrupted storage: start fresh
  }
  return initialState
}
```

Τρία πράγματα που ξεχωρίζουν τον πρόχειρο από τον σωστό κώδικα:

1. **`try/catch`:** σε ιδιωτική περιήγηση ή με γεμάτο χώρο, το `localStorage` μπορεί να πετάξει
   λάθος. Η εφαρμογή πρέπει να δουλεύει και χωρίς αποθήκευση.
2. **`version`:** αν αύριο αλλάξει το σχήμα του state, ένα παλιό save θα έσπαγε τον κώδικα. Και αφού
   φορτώνεται σε κάθε άνοιγμα, θα την έσπαγε **για πάντα**. Με την έκδοση, απλώς αγνοείται.
3. **`JSON.parse(null)`:** δίνει `null` όταν δεν υπάρχει αποθήκευση, και το `saved?.version` δεν σκάει.

## Custom hooks

Όλη αυτή η λογική δεν αφορά το `App`. Τη μαζεύουμε σε μια συνάρτηση που αρχίζει από `use` και
χρησιμοποιεί άλλα hooks, δηλαδή ένα **custom hook**:

```jsx
export function useGame() {
  const [state, dispatch] = useReducer(reducer, undefined, load)
  useEffect(() => { … save … }, [state])
  return [state, dispatch]
}
```

Και το `App` αλλάζει μόνο σε μία γραμμή:

```jsx
const [{ game, lastSetup }, dispatch] = useGame()
```

Ένα custom hook δεν είναι μαγεία: είναι απλώς μια συνάρτηση που οργανώνει hooks. Ισχύουν οι ίδιοι
κανόνες (μόνο στην κορυφή). Κάθε component που το καλεί έχει **το δικό του** state.

## StrictMode και effects

Στην ανάπτυξη, το `StrictMode` του μαθήματος 1 τρέχει κάθε effect **δύο φορές** στην αρχή
(στήσιμο, καθαρισμός, στήσιμο). Το κάνει επίτηδες, για να βγάλει στην επιφάνεια effects που ξεχνούν
να καθαρίσουν. Ένα σωστό effect, όπως το δικό μας, δεν επηρεάζεται: γράφει απλώς δύο φορές την ίδια
τιμή. Στο build για τον κόσμο αυτό δεν συμβαίνει.

## Ο κώδικας αυτού του μαθήματος

- **`useGame.js`:** νέο. Reducer, φόρτωση, αποθήκευση.
- **`App.jsx`:** `useGame()` αντί για `useReducer(...)`.
- Όλα τα υπόλοιπα είναι ίδια με το μάθημα 9.

## Δοκίμασέ το

1. Παίξε δύο γύρους και κάνε refresh. Κλείσε την καρτέλα και ξανάνοιξέ την.
2. Στο DevTools (F12) → Application → Local Storage, δες τι αποθηκεύεται. Σβήσ' το και κάνε refresh.
3. Άλλαξε το `VERSION` σε 2 και κάνε refresh. Το παλιό save αγνοείται.

## Ασκήσεις

**1. Ο τίτλος της καρτέλας.** Γράψε ένα custom hook `useDocumentTitle(title)` που αλλάζει το
`document.title`, και χρησιμοποίησέ το στο `App` ώστε η καρτέλα να γράφει «Παιχνίδι · Wizard Tracker»
στη διάρκεια ενός παιχνιδιού.

<details>
<summary>Λύση</summary>

`useDocumentTitle.js`:

```js
import { useEffect } from 'react'

// Keeps the browser tab title in sync with the app
export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title
  }, [title])
}
```

Στο `App`:

```jsx
useDocumentTitle(game ? 'Παιχνίδι · Wizard Tracker' : 'Wizard Tracker')
```

Ο τίτλος της καρτέλας είναι **έξω** από τη React, όπως το `localStorage`. Γι' αυτό χρειάζεται effect.

</details>

**2. Βρες το περιττό effect.** Κάποιος έγραψε στο `GameScreen`:

```jsx
const [table, setTable] = useState([])
useEffect(() => {
  setTable(scoreTable(rounds))
}, [rounds])
```

Τι κάνει λάθος, και πώς γράφεται σωστά;

<details>
<summary>Λύση</summary>

```jsx
const table = scoreTable(rounds)
```

Ο πίνακας βγαίνει από τα `rounds`, άρα είναι υπολογισμός, όχι state. Με το effect η οθόνη σχεδιάζεται
πρώτα με τον **παλιό** πίνακα, μετά τρέχει το effect, αλλάζει το state και ξανασχεδιάζεται: δύο
σχεδιάσεις αντί για μία, και για μια στιγμή λάθος νούμερα. Effect μόνο για ό,τι είναι έξω από τη React.

</details>

## Σύνοψη

- `useEffect(fn, deps)`: συγχρονισμός με κάτι έξω από τη React, μετά τη σχεδίαση.
- Υπολογισμοί από state → όχι effect, απλή JavaScript.
- Αρχική τιμή από storage → lazy initializer (`useReducer(reducer, undefined, load)`).
- Custom hook = συνάρτηση `useΚάτι` που οργανώνει hooks και κρύβει λεπτομέρειες.

**Για παραπέρα:** [Synchronizing with effects](https://react.dev/learn/synchronizing-with-effects),
[You might not need an effect](https://react.dev/learn/you-might-not-need-an-effect),
[Reusing logic with custom hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
