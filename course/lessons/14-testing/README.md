# Μάθημα 14 · Testing: unit tests με Vitest, e2e με Playwright

**Στόχοι:** να γράφεις tests που σε αφήνουν να αλλάζεις κώδικα χωρίς φόβο, να ξέρεις τι αξίζει να
ελέγχεις με unit tests και τι με e2e, και να τρέχεις και τα δύο.

```bash
npm run lesson 14          # η εφαρμογή, όπως πάντα
npm run lesson 14 test     # τα unit tests αυτού του μαθήματος
npm run test:e2e           # τα e2e tests της εφαρμογής (webapp/e2e)
```

## Γιατί tests

Θέλεις να αλλάξεις τον κανόνα του hook. Πώς ξέρεις ότι δεν χάλασες τη βαθμολογία; Παίζεις ένα
ολόκληρο παιχνίδι με το χέρι; Κάθε φορά;

Ένα test είναι κώδικας που ελέγχει κώδικα: «για αυτή την είσοδο, περιμένω αυτό». Τα τρέχεις σε
δευτερόλεπτα, όσες φορές θέλεις, και σου λένε **ακριβώς** τι χάλασε. Τα tests δεν είναι γραφειοκρατία.
Είναι αυτό που σε αφήνει να αλλάζεις κώδικα με θάρρος.

## Η πυραμίδα

```
        /\        e2e: λίγα, αργά, ελέγχουν όλη την εφαρμογή όπως ο χρήστης
       /  \
      /----\
     /      \     unit: πολλά, γρήγορα, ελέγχουν μία συνάρτηση
    /________\
```

- **Unit tests** για τη λογική: `rules.js`, `reducer.js`. Χιλιοστά του δευτερολέπτου το καθένα.
- **E2E tests** (end-to-end) για τις διαδρομές του χρήστη: «φτιάχνω παιχνίδι, παίζω γύρο, βλέπω σκορ».
  Ανοίγουν πραγματικό browser.

Εδώ φαίνεται το κέρδος όλου του μαθήματος: επειδή οι κανόνες και ο reducer είναι **καθαρές συναρτήσεις
χωρίς React**, τα unit tests είναι απλές κλήσεις συναρτήσεων. Δεν χρειάζεται τίποτα ειδικό.

## Vitest

```js
import { describe, expect, it } from 'vitest'
import { roundScore } from './rules'

describe('roundScore', () => {
  it('gives 20 plus 10 per trick for an exact bid', () => {
    expect(roundScore(0, 0)).toBe(20)
    expect(roundScore(3, 3)).toBe(50)
  })
})
```

- `describe`: ομάδα σχετικών tests. `it`: ένα test με περιγραφή που διαβάζεται σαν πρόταση.
- `expect(πραγματικό).toBe(αναμενόμενο)` για απλές τιμές, `.toEqual(...)` για πίνακες και αντικείμενα
  (συγκρίνει περιεχόμενο), `.toBeNull()`, `.toMatchObject(...)` (ελέγχει μόνο όσα πεδία δώσεις).
- Τα αρχεία ονομάζονται `κάτι.test.js` και ζουν **δίπλα** στον κώδικα που ελέγχουν.

### Τι ελέγχουμε

Δες το `game/rules.test.js`. Κάθε κανόνας έχει:

- την **κανονική** περίπτωση (ακριβής δήλωση → 20 + 10 ανά μπάζα),
- τα **όρια** (0 μπάζες, ο τελευταίος παίκτης, η μοιρασιά που γυρίζει στην αρχή),
- τις **ειδικές** περιπτώσεις (ισοβαθμίες, ονόματα που διαφέρουν μόνο σε κεφαλαία, απαγορευμένη
  δήλωση που θα ήταν αρνητική).

### Testing ενός reducer

Ο reducer ελέγχεται σαν σενάριο: ξεκίνα παιχνίδι, στείλε actions, κοίτα το state.

```js
const play = (state, ...actions) => actions.reduce(reducer, state)

it('goes back to bids keeping them', () => {
  const state = play(start(), { type: 'SET_VALUE', player: 1, value: 1 }, { type: 'CONFIRM_BIDS' }, { type: 'BACK_TO_BIDS' })
  expect(state.game.current).toMatchObject({ phase: 'bids', bids: [0, 1, 0] })
})
```

Το `actions.reduce(reducer, state)` εφαρμόζει τα actions ένα ένα, ακριβώς όπως θα έκανε η React με
διαδοχικά `dispatch`. Βοηθητικές συναρτήσεις όπως το `playRound` κρατάνε τα tests σύντομα και ευανάγνωστα.

## Playwright: e2e

Τα e2e tests ζουν στο `webapp/e2e/`. Το Playwright χτίζει την εφαρμογή, ανοίγει Chromium σε μέγεθος κινητού
(Pixel 7), και κάνει ό,τι θα έκανε ένας παίκτης:

```js
test('scores a round and moves to the next', async ({ page }) => {
  await startGame(page, ['Άννα', 'Βασίλης', 'Γιώργος'])
  await playRound(page, { Άννα: 1 }, { Άννα: 1 })
  await expect(page.getByText('Γύρος 2 / 20 · 2 φύλλα · Dealer: Βασίλης')).toBeVisible()
})
```

Πρόσεξε **πώς βρίσκει τα στοιχεία**: με ό,τι βλέπει ή ακούει ο χρήστης, όχι με κλάσεις CSS.

```js
page.getByLabel('Παίκτης 1', { exact: true })              // το <label> του μαθήματος 2
page.getByRole('button', { name: 'Άννα, Δήλωση: αύξηση' })  // το aria-label του Stepper (μάθημα 7)
page.getByRole('dialog')                                     // το <dialog> του μαθήματος 11
```

Η προσβασιμότητα που χτίσαμε σε όλο το μάθημα γίνεται τώρα το «χερούλι» των tests. Αν ένα test δεν
μπορεί να βρει ένα κουμπί με το όνομά του, μάλλον ούτε ένας screen reader μπορεί.

Την πρώτη φορά χρειάζεται ο browser:

```bash
npx playwright install chromium
```

## Ο κώδικας αυτού του μαθήματος

Ίδιος με το μάθημα 13, συν:

- **`game/rules.test.js`:** κανόνες, βαθμολογία, κατάταξη.
- **`game/reducer.test.js`:** κάθε action, και ένα ολόκληρο παιχνίδι μέχρι το τέλος.
- **`i18n/i18n.test.js`:** όλες οι γλώσσες έχουν τα ίδια κλειδιά, για να μην ξεχαστεί μετάφραση.

## Δοκίμασέ το

1. `npm run lesson 14 test`. Όλα πράσινα.
2. Χάλασε επίτηδες το `roundScore` (π.χ. `20 + 5 * tricks`) και ξανατρέξε. Διάβασε τι λέει το λάθος.
3. Γράψε ένα test για το `totalRounds(4)`.

## Ασκήσεις

**1. Unit test για τον dealer.** Στο `rules.test.js`, γράψε ένα test: με 4 παίκτες και πρώτο dealer τη
θέση 3, στον δεύτερο γύρο (index 1) μοιράζει η θέση 0 και δηλώνει πρώτη η θέση 1.

<details>
<summary>Λύση</summary>

```js
it('wraps the deal around the table', () => {
  expect(roundInfo(1, 4, 3)).toEqual({ index: 1, cards: 2, dealer: 0, firstBidder: 1 })
})
```

`npm run lesson 14 test`. Οι οριακές περιπτώσεις (εδώ: ο τελευταίος της σειράς δίνει τη σειρά στον
πρώτο) είναι εκεί που κρύβονται τα bugs, και εκεί αξίζουν τα tests.

</details>

**2. E2E για το «Νέο παιχνίδι».** Στο `webapp/e2e/game.spec.js`, γράψε ένα test: ξεκινάει παιχνίδι,
ανοίγει το μενού ⋯, πατάει «Νέο παιχνίδι», δέχεται την ερώτηση επιβεβαίωσης, και ελέγχει ότι γύρισε στην
οθόνη των ρυθμίσεων.

<details>
<summary>Λύση</summary>

```js
test('starts over from the menu', async ({ page }) => {
  await startGame(page, players)
  page.once('dialog', (dialog) => dialog.accept())
  await page.getByRole('button', { name: 'Μενού' }).click()
  await page.getByRole('button', { name: 'Νέο παιχνίδι' }).click()
  await expect(page.getByRole('heading', { name: 'Νέο παιχνίδι' })).toBeVisible()
})
```

Το `page.once('dialog', …)` μπαίνει **πριν** από το κλικ που ανοίγει το `confirm`, αλλιώς το test
περιμένει για πάντα. `npm run test:e2e` από τη ρίζα.

</details>

## Σύνοψη

- Πολλά γρήγορα unit tests για τη λογική, λίγα e2e για τις διαδρομές του χρήστη.
- Οι καθαρές συναρτήσεις ελέγχονται με απλές κλήσεις, και αυτό είναι ο μεγαλύτερος λόγος να τις γράφεις έτσι.
- Στα e2e βρίσκεις στοιχεία με ρόλους και labels, όπως ο χρήστης.

**Για παραπέρα:** [vitest.dev](https://vitest.dev/guide/), [playwright.dev](https://playwright.dev/docs/writing-tests)
