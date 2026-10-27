# Μάθημα 1 · React και Vite

**Στόχοι:** να καταλάβεις τι λύνει η React, τι κάνει το Vite και πώς φτάνει ένα component στην οθόνη.

```bash
npm run lesson 1
```

## Το πρόβλημα που λύνει η React

Με σκέτη JavaScript, για να αλλάξει κάτι στη σελίδα το κάνεις με το χέρι:

```js
const button = document.querySelector('#add')
const counter = document.querySelector('#count')
let count = 0
button.addEventListener('click', () => {
  count++
  counter.textContent = count   // πρέπει να θυμηθείς να ενημερώσεις το DOM
})
```

Σε μια μικρή σελίδα αυτό δουλεύει. Σε μια εφαρμογή σαν τον Wizard Tracker, όπου ένα κλικ αλλάζει
το σκορ, τον πίνακα, το ποιος μοιράζει και ποια κουμπιά είναι ενεργά, γρήγορα ξεχνάς κάποιο σημείο
και η οθόνη δείχνει κάτι διαφορετικό από τα δεδομένα.

Η React αντιστρέφει τη λογική: **περιγράφεις πώς πρέπει να φαίνεται η οθόνη για τα τωρινά δεδομένα**,
και όταν αλλάξουν τα δεδομένα, η React βρίσκει μόνη της τι πρέπει να αλλάξει στο DOM.

> οθόνη = f(δεδομένα)

Αυτή η μία ιδέα είναι όλη η React. Τα υπόλοιπα μαθήματα είναι εργαλεία γύρω της.

## Components

Ένα component είναι **μια συνάρτηση JavaScript που επιστρέφει αυτό που θα φανεί στην οθόνη**.
Το όνομά της ξεκινάει πάντα με κεφαλαίο, έτσι η React το ξεχωρίζει από τα HTML tags.

```jsx
export default function App() {
  return <h1>Wizard Tracker</h1>
}
```

Αυτό που μοιάζει με HTML μέσα στη JavaScript λέγεται **JSX**. Το βλέπουμε αναλυτικά στο μάθημα 2.

## Τι κάνει το Vite

Ο browser δεν καταλαβαίνει JSX. Το **Vite** είναι το εργαλείο που:

- **στην ανάπτυξη** (`npm run dev`) σερβίρει την εφαρμογή, μετατρέπει το JSX σε JavaScript τη στιγμή
  που ζητιέται, και ανανεώνει τη σελίδα μόλις αποθηκεύσεις ένα αρχείο (hot reload),
- **στο τέλος** (`npm run build`) πακετάρει τα πάντα σε λίγα, μικρά αρχεία στον φάκελο `dist/`,
  έτοιμα για τον κόσμο (μάθημα 14).

## Πώς ξεκινάει η εφαρμογή

Τρία αρχεία, με αυτή τη σειρά:

**1. `index.html`**, η μόνη HTML σελίδα. Έχει ένα άδειο `<div id="root">` και φορτώνει το `main.jsx`:

```html
<div id="root"></div>
<script type="module" src="/src/main.jsx"></script>
```

**2. `src/main.jsx`** λέει στη React «ζωγράφισε το `App` μέσα στο `#root`»:

```jsx
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

Το `StrictMode` δεν φαίνεται στην οθόνη. Στην ανάπτυξη τρέχει επίτηδες κάποια πράγματα δύο φορές
για να πιάσει λάθη νωρίς. Θα το ξαναδούμε στο μάθημα 10.

**3. `src/App.jsx`**, το πρώτο μας component.

## Ο κώδικας αυτού του μαθήματος

```jsx
export default function App() {
  const today = new Date().toLocaleDateString('el-GR')

  return (
    <main className="app">
      <h1 className="app__title">Wizard Tracker</h1>
      <p className="hint hint--center">Το πρώτο μας component, σήμερα {today}.</p>
    </main>
  )
}
```

Πρόσεξε:

- Πριν το `return` γράφεις κανονική JavaScript. Το component είναι απλώς μια συνάρτηση.
- Μέσα στο JSX, οι **αγκύλες `{ }`** βάζουν μια τιμή JavaScript στην οθόνη: `{today}`.
- Το `class` της HTML γράφεται **`className`**, γιατί το `class` είναι δεσμευμένη λέξη της JavaScript.
- Τα styles έρχονται από το `app/src/index.css` της κανονικής εφαρμογής. Το CSS δεν είναι το θέμα του
  μαθήματος, οπότε το μοιραζόμαστε για να φαίνονται όλα σαν την τελική εφαρμογή από την αρχή.

## Δοκίμασέ το

1. Τρέξε `npm run lesson 1` και άνοιξε τη σελίδα.
2. Άλλαξε το κείμενο στο `App.jsx` και αποθήκευσε. Η σελίδα αλλάζει χωρίς refresh.
3. Γράψε `{2 + 3}` μέσα στο `<p>`. Τι εμφανίζεται;

## Σύνοψη

- Η React ζωγραφίζει την οθόνη από τα δεδομένα, δεν αλλάζεις το DOM με το χέρι.
- Component = συνάρτηση με κεφαλαίο όνομα που επιστρέφει JSX.
- Το Vite μεταφράζει το JSX και σερβίρει την εφαρμογή στην ανάπτυξη.
- Ροή εκκίνησης: `index.html` → `main.jsx` → `App`.

**Για παραπέρα:** [react.dev/learn](https://react.dev/learn) (η επίσημη, πολύ καλή εισαγωγή).
