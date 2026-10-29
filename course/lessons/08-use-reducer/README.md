# Μάθημα 8 · `useReducer`: όλο το παιχνίδι σε ένα μέρος

**Στόχοι:** να οργανώσεις σύνθετο state με reducer και actions, να γράφεις αλλαγές χωρίς να
«χαλάς» αντικείμενα, και να κάνεις όλο τον κύκλο ενός γύρου: δηλώσεις, μπάζες, επόμενος γύρος.

```bash
npm run lesson 8
```

## Το πρόβλημα

Ένα παιχνίδι έχει πλέον: παίκτες, κανόνα hook, πρώτο dealer, τελειωμένους γύρους, και τον τωρινό γύρο
με φάση (δηλώσεις ή μπάζες), δηλώσεις και μπάζες. Με `useState` θα είχαμε έξι-επτά διαφορετικά state
και `set…` σκορπισμένα σε τρία components. Το «τέλος γύρου», για παράδειγμα, πρέπει να προσθέσει τον
γύρο στη λίστα, να μηδενίσει δηλώσεις και μπάζες, να γυρίσει τη φάση, και να ελέγξει αν τελείωσε το
παιχνίδι, **όλα μαζί**.

## Reducer και actions

Ένας **reducer** είναι μια καθαρή συνάρτηση που παίρνει το τωρινό state και ένα **action** (τι συνέβη),
και επιστρέφει το νέο state:

```js
(state, action) => newState
```

```js
function reducer(state, action) {
  switch (action.type) {
    case 'CONFIRM_BIDS':
      return withCurrent({ phase: 'tricks', tricks: Array(game.players.length).fill(0) })
    case 'FINISH_ROUND': { … }
    …
  }
}
```

Το component δεν λέει πια **πώς** αλλάζει το state. Λέει μόνο **τι έγινε**:

```jsx
dispatch({ type: 'FINISH_ROUND' })
dispatch({ type: 'SET_VALUE', player: 2, value: 1 })
```

Στη React:

```jsx
const [state, dispatch] = useReducer(reducer, initialState)
```

Το `dispatch(action)` καλεί `reducer(state, action)`, αποθηκεύει το αποτέλεσμα και ξανασχεδιάζει,
όπως ακριβώς ένα `set…`.

Τα κέρδη:

- **Όλοι οι τρόποι που αλλάζει το παιχνίδι είναι σε ένα αρχείο**, τον έναν μετά τον άλλο. Αν κάτι πάει
  στραβά με το σκορ, ξέρεις πού να κοιτάξεις.
- Ο reducer είναι **καθαρή συνάρτηση**: δεν ξέρει τίποτα από React, και τον ελέγχεις με tests
  (μάθημα 14) δίνοντας state και action και κοιτάζοντας τι βγαίνει.
- Τα components γίνονται απλά: δείχνουν και στέλνουν actions.

## Το σχήμα του state

Η πιο σημαντική απόφαση σε μια εφαρμογή είναι **τι αποθηκεύεις**. Εδώ αποθηκεύουμε **μόνο ό,τι
πληκτρολογούν οι παίκτες**:

```js
game = {
  players: ['Άννα', 'Βασίλης', 'Γιώργος'],
  hookRule: false,
  firstDealer: 0,
  rounds: [{ bids: [1, 0, 0], tricks: [1, 0, 0] }],          // τελειωμένοι γύροι
  current: { phase: 'bids', bids: [0, 0, 0], tricks: [0, 0, 0] },   // null = τέλος
}
```

Δεν αποθηκεύουμε ούτε αριθμό γύρου (`rounds.length`), ούτε dealer (`roundInfo`), ούτε σκορ (μάθημα 9).
Όλα αυτά υπολογίζονται, άρα δεν μπορούν ποτέ να «ξεσυγχρονιστούν».

Το `game: null` σημαίνει «οθόνη ρυθμίσεων», και το `current: null` σημαίνει «τέλος παιχνιδιού».
Οι καταστάσεις της εφαρμογής βγαίνουν από το σχήμα των δεδομένων, χωρίς ξεχωριστή σημαία `screen`.

Υπάρχει και το `lastSetup`: οι ρυθμίσεις του τελευταίου παιχνιδιού. Έτσι το «Νέο παιχνίδι» ανοίγει
τις ρυθμίσεις συμπληρωμένες, και διορθώνει το πρόβλημα του μαθήματος 6.

## Αλλαγές χωρίς mutation

Ο reducer επιστρέφει **νέα** αντικείμενα με το spread (`...`):

```js
const withGame = (changes) => ({ ...state, game: { ...game, ...changes } })
const withCurrent = (changes) => withGame({ current: { ...game.current, ...changes } })
```

Το `{ ...game, ...changes }` αντιγράφει όλα τα πεδία του `game` και μετά αντικαθιστά όσα υπάρχουν στο
`changes`. Οι δύο μικροί helpers μας γλιτώνουν από τρία επίπεδα spread σε κάθε `case`.

Ένα έξυπνο κομμάτι, το `SET_VALUE`:

```js
const field = game.current.phase === 'bids' ? 'bids' : 'tricks'
return withCurrent({ [field]: replaceAt(game.current[field], action.player, action.value) })
```

Το `[field]` (computed property) σημαίνει «το κλειδί είναι η τιμή της μεταβλητής». Το ίδιο action
γράφει δήλωση ή μπάζα ανάλογα με τη φάση, οπότε το `RoundEntry` δεν χρειάζεται να ξέρει τη διαφορά.

## Έλεγχοι στο UI, εμπιστοσύνη στον reducer

Τα `bidsError` και `tricksError` (στο `rules.js`) ελέγχουν αν ο γύρος μπορεί να προχωρήσει:

- **Μπάζες:** πρέπει να αθροίζουν στα φύλλα. Όσο είναι λιγότερες, δεν είναι λάθος, απλώς δεν
  τελείωσε η καταχώρηση, οπότε δείχνουμε ουδέτερο «Απομένουν 2 μπάζες». Κόκκινο μόνο όταν περισσεύουν.
- **Κανόνας hook:** οι δηλώσεις δεν μπορούν να αθροίζουν στα φύλλα. Το `forbiddenDealerBid` λέει
  από πριν στον dealer ποιο νούμερο απαγορεύεται.

Το κουμπί μένει απενεργοποιημένο όσο υπάρχει λάθος, άρα **ο reducer δεν λαμβάνει ποτέ άκυρο action**.
Γι' αυτό δεν ξαναελέγχει.

## Ο κώδικας αυτού του μαθήματος

- **`reducer.js`:** νέο. Το σχήμα του state στην κορυφή, και ένα `case` για κάθε action.
- **`App.jsx`:** `useReducer` αντί για `useState`. Δίνει `dispatch` στο `GameScreen` και `lastSetup` στο `Setup`.
- **`Setup.jsx`:** δέχεται `initialSetup` για προσυμπλήρωση. Το `initialSetup?.players` (optional
  chaining) δεν σκάει όταν το `initialSetup` είναι `null`.
- **`GameScreen.jsx`:** ο γύρος βγαίνει από το `rounds.length`. Στο τέλος δείχνει «Τέλος παιχνιδιού».
- **`RoundEntry.jsx`:** και οι δύο φάσεις, λάθη, «απομένουν», «Πίσω» στις δηλώσεις.

## Δοκίμασέ το

1. Παίξε μερικούς γύρους. Πρόσεξε πώς προχωράει ο dealer.
2. Ενεργοποίησε τον κανόνα hook και δες τι γράφει κάτω από τον dealer καθώς αλλάζεις δηλώσεις.
3. Βάλε `console.log(action.type, action)` στην αρχή του reducer και παρακολούθησε στην κονσόλα κάθε
   ενέργεια του χρήστη. Αυτό είναι όλο το «ημερολόγιο» της εφαρμογής.

## Ασκήσεις

**1. Μηδενισμός δηλώσεων.** Πρόσθεσε ένα action `RESET_BIDS` που μηδενίζει τις δηλώσεις του τρέχοντος
γύρου, και ένα κουμπί που το στέλνει (μόνο στη φάση των δηλώσεων).

<details>
<summary>Λύση</summary>

Στον reducer:

```js
case 'RESET_BIDS':
  return withCurrent({ bids: Array(game.players.length).fill(0) })
```

Στο `RoundEntry`:

```jsx
{isBids && (
  <button type="button" className="button button--secondary" onClick={() => dispatch({ type: 'RESET_BIDS' })}>
    Μηδενισμός
  </button>
)}
```

Το component λέει μόνο **τι** έγινε. Το **πώς** είναι μία γραμμή στον reducer.

</details>

**2. Αναίρεση γύρου.** Πρόσθεσε ένα action `UNDO_ROUND` που παίρνει πίσω τον τελευταίο τελειωμένο γύρο:
βγαίνει από τα `rounds` και γίνεται ξανά ο τρέχων γύρος, στη φάση των μπαζών, με τις τιμές του.

<details>
<summary>Λύση</summary>

```js
case 'UNDO_ROUND': {
  const last = game.rounds.at(-1)
  return withGame({ rounds: game.rounds.slice(0, -1), current: { phase: 'tricks', ...last } })
}
```

Το `slice(0, -1)` φτιάχνει νέο πίνακα χωρίς το τελευταίο στοιχείο (το `pop()` θα άλλαζε τον παλιό). Ο
αριθμός του γύρου, ο dealer και τα φύλλα διορθώνονται μόνα τους, γιατί βγαίνουν από το `rounds.length`.
Το κουμπί να εμφανίζεται μόνο όταν `rounds.length > 0`.

</details>

## Σύνοψη

- Reducer: `(state, action) => newState`, καθαρή συνάρτηση, όλες οι αλλαγές σε ένα μέρος.
- Τα components κάνουν `dispatch({ type: … })`, λένε τι έγινε, όχι πώς αλλάζει το state.
- Αποθήκευσε μόνο ό,τι εισάγει ο χρήστης. Τα υπόλοιπα υπολογίζονται.
- Νέα αντικείμενα με spread, ποτέ τροποποίηση.

**Για παραπέρα:** [Extracting state logic into a reducer](https://react.dev/learn/extracting-state-logic-into-a-reducer),
[Choosing the state structure](https://react.dev/learn/choosing-the-state-structure)
