# Μάθημα 11 · Refs και `<dialog>`: διόρθωση ενός γύρου

**Στόχοι:** να φτάνεις στο πραγματικό στοιχείο του DOM όταν χρειάζεται (`useRef`), να χρησιμοποιείς
όσα δίνει ήδη ο browser αντί να τα ξαναγράφεις, και να κρατάς «πρόχειρο» state που γίνεται οριστικό
μόνο με «Αποθήκευση».

```bash
npm run lesson 11
```

## Το σενάριο

Στον 7ο γύρο κάποιος θυμάται «περίμενε, στον 3ο είχα δηλώσει 2, όχι 1». Πατάς τη γραμμή του γύρου 3
στον πίνακα, ανοίγει ένα παράθυρο από κάτω (bottom sheet) με τις δηλώσεις και τις μπάζες, διορθώνεις,
αποθηκεύεις. Επειδή το σκορ **υπολογίζεται** (μάθημα 9), όλα τα σύνολα από τον γύρο 3 και μετά
διορθώνονται μόνα τους.

## Refs: όταν χρειάζεσαι το ίδιο το στοιχείο

Συνήθως δεν αγγίζουμε το DOM: λέμε στη React τι θέλουμε και το κάνει εκείνη. Κάποιες λειτουργίες όμως
είναι **μέθοδοι** του στοιχείου και δεν περιγράφονται με attributes: `input.focus()`, `video.play()`,
`dialog.showModal()`. Για αυτές υπάρχει το `useRef`:

```jsx
const dialogRef = useRef(null)

<dialog ref={dialogRef}>…</dialog>

dialogRef.current.showModal()   // το πραγματικό <dialog> του DOM
```

- Το `useRef(null)` δίνει ένα αντικείμενο `{ current: null }` που μένει **το ίδιο** σε όλες τις σχεδιάσεις.
- Με `ref={dialogRef}` η React βάζει στο `current` το στοιχείο του DOM μόλις το δημιουργήσει.
- Η αλλαγή του `current` **δεν** προκαλεί νέα σχεδίαση. Ένα ref είναι «κουτί» για πράγματα που δεν
  φαίνονται στην οθόνη.

Πότε μπορείς να το χρησιμοποιήσεις; Όχι κατά τη σχεδίαση (το στοιχείο δεν υπάρχει ακόμα), αλλά σε
effects και event handlers:

```jsx
useEffect(() => {
  dialogRef.current.showModal()
}, [])   // μία φορά, όταν εμφανιστεί το component
```

## Το `<dialog>` του browser

Ένα modal παράθυρο θέλει: να μην μπορείς να πατήσεις τα από πίσω, να μένει το focus μέσα του
(σημαντικό για πληκτρολόγιο και screen readers), να κλείνει με Escape, σκούρο φόντο. Όλα αυτά με το
χέρι είναι εκατό γραμμές, και εύκολα κάποιο λείπει. Το `<dialog>` με `showModal()` τα κάνει **όλα**:

| Χρειάζεται | Το δίνει |
| --- | --- |
| Τα από πίσω δεν πατιούνται | `showModal()` |
| Το focus μένει μέσα | `showModal()` |
| Escape | event `cancel` → `onCancel` |
| Σκούρο φόντο | CSS `.sheet::backdrop` |
| Ρόλος για screen readers | αυτόματα `role="dialog"` + `aria-labelledby` για τον τίτλο |

> Πριν γράψεις κάτι, δες αν το κάνει ήδη ο browser. Λιγότερος κώδικας, λιγότερα bugs, καλύτερη προσβασιμότητα.

Δύο λεπτομέρειες:

- **Escape:** ο browser κλείνει μόνος του το dialog. Εμείς θέλουμε πρώτα να ρωτήσουμε, οπότε
  `event.preventDefault()` και μετά `requestClose()`.
- **Κλικ στο φόντο:** το backdrop ανήκει στο ίδιο το `<dialog>`. Βάζουμε το περιεχόμενο σε ένα
  εσωτερικό `<div className="sheet__body">`, οπότε `event.target === event.currentTarget` σημαίνει
  «πατήθηκε το dialog και όχι κάτι μέσα του», δηλαδή το φόντο.

## Πρόχειρο state

Οι αλλαγές στο παράθυρο **δεν** πάνε κατευθείαν στον reducer. Αν πάτησες «Άκυρο», το παιχνίδι πρέπει να
μείνει ανέγγιχτο. Γι' αυτό το dialog κρατάει **δικό του** τοπικό state, που ξεκινάει από τις
αποθηκευμένες τιμές:

```jsx
const [bids, setBids] = useState(values.bids)
const [tricks, setTricks] = useState(values.tricks)
```

Μόνο το «Αποθήκευση» στέλνει τις τιμές προς τα πάνω, με `onSave({ bids, tricks })` →
`dispatch({ type: 'UPDATE_ROUND', … })`.

Το `isDirty` («άλλαξε κάτι;») **υπολογίζεται**, δεν αποθηκεύεται, όπως πάντα:

```jsx
const isDirty = !sameValues(bids, values.bids) || !sameValues(tricks, values.tricks)
```

Και το κλείσιμο ρωτάει μόνο όταν υπάρχει κάτι να χαθεί:

```jsx
const requestClose = () => {
  if (!isDirty || window.confirm('Να απορριφθούν οι αλλαγές;')) onClose()
}
```

## Ποιος ανοίγει το παράθυρο

```jsx
const [editing, setEditing] = useState(null)   // στο GameScreen: ποιος γύρος, ή null

<Scoreboard … onEditRound={setEditing} />

{editing !== null && <EditRoundDialog … onClose={() => setEditing(null)} />}
```

Το dialog υπάρχει στο DOM μόνο όσο είναι ανοιχτό. Έτσι κάθε άνοιγμα ξεκινάει με φρέσκο πρόχειρο state.
Προσοχή στο `editing !== null`: ο γύρος 0 είναι έγκυρη τιμή, και το `{editing && …}` θα τον έκρυβε (το «0»
του μαθήματος 5).

## Προσβάσιμος πίνακας

Η γραμμή του πίνακα έχει `onClick`, αλλά μια γραμμή `<tr>` δεν παίρνει focus από το πληκτρολόγιο. Βάζουμε
λοιπόν τον αριθμό του γύρου μέσα σε `<button>` με `aria-label="Διόρθωση γύρου 3"`. Το κλικ στο κουμπί
«ανεβαίνει» (event bubbling) στη γραμμή, οπότε δεν χρειάζεται δεύτερος handler. Με το ποντίκι πατάς
οπουδήποτε στη γραμμή, με το πληκτρολόγιο Tab και Enter.

## Ο κώδικας αυτού του μαθήματος

- **`EditRoundDialog.jsx`:** νέο.
- **`reducer.js`:** νέο action `UPDATE_ROUND`.
- **`Scoreboard.jsx`:** γραμμές που πατιούνται, κουμπί για πληκτρολόγιο, υπόδειξη από κάτω.
- **`GameScreen.jsx`:** το state `editing` και το άνοιγμα του dialog.

Με αυτό το μάθημα η εφαρμογή κάνει **ό,τι και η τελική**. Το επόμενο μάθημα δεν προσθέτει λειτουργίες:
τακτοποιεί.

## Δοκίμασέ το

1. Παίξε τρεις γύρους, διόρθωσε τον πρώτο, και δες τα σύνολα να αλλάζουν.
2. Άνοιξε έναν γύρο, άλλαξε κάτι και πάτα Escape. Μετά χωρίς αλλαγές.
3. Μόνο με πληκτρολόγιο: Tab μέχρι τον αριθμό ενός γύρου, Enter, Tab μέσα στο παράθυρο. Το focus δεν
   «δραπετεύει» πίσω από αυτό.

## Σύνοψη

- `useRef` για πρόσβαση σε στοιχεία του DOM (μεθόδους όπως `showModal`, `focus`). Δεν προκαλεί σχεδίαση.
- Πρώτα δες τι δίνει ο browser: το `<dialog>` κάνει focus, Escape και backdrop δωρεάν.
- Πρόχειρο τοπικό state, και μόνο το «Αποθήκευση» ενημερώνει το παιχνίδι.

**Για παραπέρα:** [Referencing values with refs](https://react.dev/learn/referencing-values-with-refs),
[Manipulating the DOM with refs](https://react.dev/learn/manipulating-the-dom-with-refs),
[MDN: `<dialog>`](https://developer.mozilla.org/docs/Web/HTML/Element/dialog)
