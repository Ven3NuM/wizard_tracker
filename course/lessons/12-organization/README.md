# Μάθημα 12 · Οργάνωση σε φακέλους και η τελική εμφάνιση

**Στόχοι:** να οργανώσεις ένα project ώστε να βρίσκεις αμέσως κάθε πράγμα, να χωρίσεις τη λογική από
την εμφάνιση, να γνωρίσεις το prop `children`, και να δεις πώς μεγαλώνει μια οθόνη με μικρά components
χωρίς να μεγαλώνει η πολυπλοκότητα.

```bash
npm run lesson 12
```

Με το μάθημα 11 η εφαρμογή έκανε ήδη ό,τι και η τελική. Εδώ δεν μαθαίνουμε νέα hooks. Τακτοποιούμε,
και ολοκληρώνουμε την εμφάνιση με μερικά μικρά components.

## Από επίπεδο φάκελο σε φακέλους με ρόλο

Ως το μάθημα 11 όλα ήταν σε ένα `src/` με 12 αρχεία. Δουλεύει, αλλά δεν λέει τίποτα για το ποιο
αρχείο κάνει τι. Το νέο σχήμα:

```
src/
├── game/              η λογική του παιχνιδιού, καθόλου JSX
│   ├── rules.js       κανόνες ως καθαρές συναρτήσεις
│   ├── reducer.js     πώς αλλάζει το παιχνίδι
│   └── useGame.js     reducer + αποθήκευση
├── ui/                τα components
│   ├── Setup.jsx
│   ├── GameScreen.jsx
│   ├── RoundHeader.jsx    γύρος, φύλλα, dealer
│   ├── GameMenu.jsx       το μενού ⋯
│   ├── RoundEntry.jsx
│   ├── Standings.jsx      η κατάταξη στη διάρκεια του παιχνιδιού
│   ├── Scoreboard.jsx
│   ├── EditRoundDialog.jsx
│   ├── FinalResults.jsx
│   ├── Stepper.jsx
│   ├── Avatar.jsx         το αρχικό του παίκτη στο χρώμα της θέσης του
│   ├── icons.jsx          μικρά εικονίδια SVG
│   └── format.js          +20 / -10
├── App.jsx            ρυθμίσεις ή παιχνίδι
├── main.jsx           εκκίνηση
└── index.css          όλα τα styles
```

Η βασική διάκριση είναι **λογική ↔ εμφάνιση**:

- Ο φάκελος `game/` δεν εισάγει **τίποτα** από τον `ui/`. Οι κανόνες δεν ξέρουν ότι υπάρχει οθόνη,
  οπότε θα δούλευαν αυτούσιοι σε μια εφαρμογή κινητού, ένα bot ή ένα test.
- Ο φάκελος `ui/` εισάγει από τον `game/` ό,τι χρειάζεται για να δείξει.

Τα imports αλλάζουν μόνο στη διαδρομή: `import { sum } from './rules'` γίνεται
`import { sum } from '../game/rules'` (το `..` σημαίνει «ένας φάκελος πάνω»).

Πόσους φακέλους να φτιάξεις; **Όσους χρειάζεσαι για να βρίσκεις τα πράγματα, όχι περισσότερους.**
Δεκατρία αρχεία χωράνε άνετα στον `ui/`. Υποφακέλους `ui/game/`, `ui/setup/` θα τους φτιάχναμε αν
γίνονταν τριάντα. Η υπερβολική δομή είναι κι αυτή ακαταστασία.

## Τα νέα components

Η τελική οθόνη έχει περισσότερα πράγματα: την κεφαλίδα του γύρου, ένα μενού, την κατάταξη, χρωματιστά
αρχικά για κάθε παίκτη, βάθρο στο τέλος. Κάθε ένα είναι **ξεχωριστό, μικρό component** με ένα έργο.
Το `GameScreen` απλώς τα βάζει στη σειρά:

```jsx
<RoundHeader players={players} round={round}>
  <GameMenu onNewGame={handleNewGame} />
</RoundHeader>
<RoundEntry … />
{table.length > 0 && <Standings players={players} table={table} />}
```

Κανένα δεν χρειάζεται κάτι που δεν ξέρεις: props, `map`, εμφάνιση υπό συνθήκη. Αξίζει να δεις τρία
σημεία.

### `children`: ό,τι βάζεις ανάμεσα στα tags

Στο `RoundHeader` το `GameMenu` είναι γραμμένο **μέσα** στο `<RoundHeader>…</RoundHeader>`, όπως ένα
`<li>` μέσα σε `<ul>`. Ό,τι γράφεις εκεί φτάνει στο component ως ένα ειδικό prop, το `children`:

```jsx
export default function RoundHeader({ players, round, children }) {
  return (
    <section className="round">
      <div className="round__bar">
        <h1 className="round__label">Γύρος {round.index + 1} από {total}</h1>
        {children}
      </div>
      …
```

Το `RoundHeader` δεν ξέρει τι είναι αυτό που του δόθηκε. Ξέρει μόνο **πού** να το βάλει (δεξιά από τον
τίτλο). Έτσι το ίδιο component θα μπορούσε αύριο να δείξει εκεί ένα κουμπί ρυθμίσεων, χωρίς αλλαγή.
Θα ξαναδούμε το `children` στο μάθημα 13, στο component που τυλίγει όλη την εφαρμογή.

### Ο browser κάνει τη δουλειά: `popover`

Το μενού ⋯ δεν έχει καθόλου state:

```jsx
<button type="button" className="icon-button" aria-label="Μενού" popoverTarget="game-menu">
  <MoreIcon />
</button>
<div id="game-menu" className="menu" popover="auto">
  <button type="button" className="menu__item" onClick={onNewGame}>
    Νέο παιχνίδι
  </button>
</div>
```

Το `popover="auto"` λέει στον browser: αυτό είναι αναδυόμενο, άνοιξέ το όταν πατηθεί το κουμπί με
`popoverTarget`, και κλείσ' το με Escape ή με κλικ αλλού. Ό,τι κάναμε με το `<dialog>` στο μάθημα 11:
πρώτα κοιτάς τι κάνει ήδη ο browser.

### Μεταβλητή CSS από τη React

Κάθε παίκτης έχει χρώμα ανάλογα με τη θέση του (`--player-1` … `--player-6` στο `index.css`). Το
`Avatar` δεν έχει έξι κλάσεις. Ορίζει μια μεταβλητή CSS με το `style`, και το CSS τη χρησιμοποιεί:

```jsx
<span className="avatar" style={{ '--avatar': `var(--player-${index + 1})` }} aria-hidden="true">
  {name.trim().charAt(0).toUpperCase() || index + 1}
</span>
```

Το `style` στη React παίρνει **αντικείμενο** (γι' αυτό τα διπλά `{{ }}`: το εξωτερικό για «JavaScript
εδώ», το εσωτερικό είναι το αντικείμενο).

### Η κατάταξη και το `seat`

Το `ranking()` (μάθημα 9) επιστρέφει για κάθε παίκτη και το `seat`, τη θέση του στο τραπέζι. Μετά την
ταξινόμηση είναι ο μόνος σίγουρος τρόπος να ξέρεις ποιος είναι ποιος. Το `Standings` το χρησιμοποιεί
για το `key`, για το χρώμα και για να βρει τους πόντους του τελευταίου γύρου:

```jsx
{results.map(({ seat, name, total, place }) => {
  const { points } = lastRound[seat]
  …
```

## Τα styles

Ως τώρα τα μαθήματα φόρτωναν το CSS της εφαρμογής από το `webapp/`. Εδώ, όπως και στην εφαρμογή, το
`index.css` είναι μέσα στο `src/` και το εισάγει το `main.jsx`. Λίγα πράγματα για το πώς είναι γραμμένο,
αν και το CSS δεν είναι το θέμα του μαθήματος:

- **BEM:** `block`, `block__element`, `block--modifier` (π.χ. `scoreboard`, `scoreboard__row`,
  `button--secondary`). Από το όνομα καταλαβαίνεις πού ανήκει κάθε κλάση.
- **Μεταβλητές CSS** στο `:root` (`--color-accent`, `--font-heading`) αντί για χρώματα σκορπισμένα παντού.
- **Mobile first:** τα βασικά styles είναι για κινητό, και ένα `@media (min-width: 600px)` προσθέτει
  για μεγάλες οθόνες.
- **Η κατάσταση από ARIA:** το πατημένο κουμπί βάφεται με `[aria-pressed='true']`, όχι με ξεχωριστή
  κλάση `active`. Μία πηγή αλήθειας και στο CSS.

## Ένα checklist καθαρού κώδικα

Όσα εφαρμόσαμε ως εδώ, μαζεμένα:

1. **Αποθήκευσε μόνο ό,τι εισάγει ο χρήστης.** Υπολόγισε τα υπόλοιπα (dealer, σκορ, `isDirty`).
2. **Κανόνες σε καθαρές συναρτήσεις**, έξω από τα components.
3. **Μία πηγή αλήθειας** για κάθε πληροφορία (`names.length`, όχι και `playerCount`).
4. **Τα δεδομένα κατεβαίνουν, τα γεγονότα ανεβαίνουν** (props / `onΚάτι`).
5. **State όσο ψηλά χρειάζεται**, όχι ψηλότερα (το πρόχειρο του dialog μένει στο dialog).
6. **Χρησιμοποίησε τον browser:** `<form>`, `<dialog>`, `popover`, `<label>`, `aria-*`.
7. **Ταυτότητα με id, όχι με κείμενο:** το `seat` αναγνωρίζει τον παίκτη, το όνομα απλώς φαίνεται.
8. **Ονόματα που λένε τι κάνουν:** `roundInfo`, `requestClose`, `isDirty`, όχι `data`, `handle2`, `flag`.
9. **Σχόλια για το «γιατί»**, όχι για το «τι». Το «τι» το λέει ο κώδικας.

## Ο κώδικας αυτού του μαθήματος

- **Φάκελοι `game/` και `ui/`**, και το `index.css` μέσα στο `src/`.
- **Νέα components:** `RoundHeader`, `GameMenu`, `Standings`, `Avatar`, `icons.jsx`, και το `format.js`.
- **`FinalResults.jsx`:** βάθρο για τους τρεις πρώτους και δύο στατιστικά, ο πιο εύστοχος και ο
  μεγαλύτερος γύρος (`hitsOf`, `bestRound` στο `rules.js`).
- **`Setup.jsx`:** ο πρώτος dealer διαλέγεται πατώντας το αρχικό του παίκτη.

Τα κείμενα είναι ακόμα γραμμένα μέσα στα components, στα ελληνικά. Αυτό αλλάζει στο επόμενο μάθημα.

## Δοκίμασέ το

1. Ψάξε στον φάκελο `game/` για `import` από `../ui`. Δεν υπάρχει κανένα, και αυτό είναι σκόπιμο.
2. Άνοιξε το μενού ⋯ και πάτα Escape, ή κλικ έξω από αυτό. Κλείνει χωρίς ούτε μία γραμμή δικού μας κώδικα.
3. Στο `index.css`, άλλαξε το `--player-1` σε `red`. Αλλάζουν μαζί το αρχικό στις ρυθμίσεις, η
   τελεία στην κατάταξη και το βάθρο.

## Ασκήσεις

**1. Ένα δεύτερο παιδί στην κεφαλίδα.** Στο `GameScreen`, βάλε μέσα στο `<RoundHeader>` και ένα
`<span className="badge">Hook</span>`, μόνο όταν ο κανόνας hook είναι ενεργός. Δεν χρειάζεται καμία
αλλαγή στο `RoundHeader`. Γιατί;

<details>
<summary>Λύση</summary>

```jsx
<RoundHeader players={players} round={round}>
  {hookRule && <span className="badge">Hook</span>}
  <GameMenu onNewGame={handleNewGame} />
</RoundHeader>
```

Το `RoundHeader` βάζει το `children` όπου κι αν είναι, χωρίς να ξέρει τι περιέχει. Ό,τι γράψεις ανάμεσα
στα tags, ένα στοιχείο ή πολλά, είναι το `children`.

</details>

**2. Δεύτερη επιλογή στο μενού.** Πρόσθεσε στο `GameMenu` ένα κουμπί «Ρεβάνς» που ξεκινάει αμέσως
νέο παιχνίδι με τους ίδιους παίκτες. Το action υπάρχει ήδη στον reducer.

<details>
<summary>Λύση</summary>

Στο `GameMenu`, ένα νέο prop και ένα κουμπί:

```jsx
export default function GameMenu({ onNewGame, onRematch }) {
  …
  <button type="button" className="menu__item" onClick={onRematch}>
    Ρεβάνς
  </button>
```

Στο `GameScreen`:

```jsx
<GameMenu onNewGame={handleNewGame} onRematch={() => dispatch({ type: 'REMATCH' })} />
```

Το μενού δεν ξέρει τι κάνει το «Ρεβάνς». Στέλνει το γεγονός προς τα πάνω (μάθημα 6), και το
`GameScreen`, που έχει το `dispatch`, αποφασίζει.

</details>

## Σύνοψη

- Χώρισε λογική (`game/`) από εμφάνιση (`ui/`). Η λογική δεν εισάγει ποτέ UI.
- Λίγοι φάκελοι με σαφή ρόλο είναι καλύτεροι από πολλούς «για το μέλλον».
- Μια οθόνη μεγαλώνει με **περισσότερα μικρά components**, όχι με μεγαλύτερα.
- `children`: ό,τι γράφεις ανάμεσα στα tags ενός component.
- Πριν γράψεις κώδικα για κάτι που ανοίγει και κλείνει, δες αν το κάνει ήδη ο browser (`popover`, `<dialog>`).

**Για παραπέρα:** [Passing JSX as children](https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children),
[Thinking in React](https://react.dev/learn/thinking-in-react)
