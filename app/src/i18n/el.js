const cards = (n) => `${n} ${n === 1 ? 'φύλλο' : 'φύλλα'}`

const el = {
  appTitle: 'Wizard Tracker',
  languageName: 'Ελληνικά',

  // Setup
  language: 'Γλώσσα',
  playerCount: 'Αριθμός παικτών',
  playerName: (n) => `Παίκτης ${n}`,
  playerPlaceholder: 'Όνομα παίκτη',
  firstDealer: 'Πρώτος dealer',
  drawDealer: 'Κλήρωση',
  hookRule: 'Κανόνας hook',
  hookRuleHelp: 'Οι δηλώσεις δεν μπορούν να είναι ίσες με τα φύλλα, ο dealer δηλώνει τελευταίος.',
  startGame: 'Έναρξη',

  // Game
  roundInfo: (round, total, cardCount, dealer) =>
    `Γύρος ${round} / ${total} · ${cards(cardCount)} · Dealer: ${dealer}`,
  newGame: 'Νέο παιχνίδι',
  confirmNewGame: 'Νέο παιχνίδι; Το τρέχον σκορ θα χαθεί.',
  rematch: 'Ρεβάνς',

  // Round entry
  bids: 'Δηλώσεις',
  tricks: 'Μπάζες',
  dealer: 'Dealer',
  firstBidder: 'Δηλώνει πρώτος',
  bidHint: (n) => `δήλωσε ${n}`,
  forbiddenHint: (n) => `δεν μπορεί να δηλώσει ${n}`,
  tricksRemaining: (n) => (n === 1 ? 'Απομένει 1 μπάζα' : `Απομένουν ${n} μπάζες`),
  back: 'Πίσω',
  confirmBids: 'Επιβεβαίωση',
  finishRound: 'Τέλος γύρου',

  // Edit round
  editRound: (n) => `Διόρθωση γύρου ${n}`,
  cards,
  bid: 'Δήλωση',
  cancel: 'Άκυρο',
  save: 'Αποθήκευση',
  discardChanges: 'Να απορριφθούν οι αλλαγές;',

  // Stepper, read by screen readers
  decrease: (label) => `${label}: μείωση`,
  increase: (label) => `${label}: αύξηση`,

  // Scoreboard
  roundColumn: 'Γύρος',
  bidShort: (n) => `δήλ. ${n}`,
  editHint: 'Πατήστε σε έναν γύρο για διόρθωση.',

  // Final results
  gameOver: 'Τέλος παιχνιδιού',

  // Validation errors, keyed by the `type` the rules return
  errors: {
    missingName: () => 'Κάθε παίκτης χρειάζεται όνομα.',
    duplicateName: () => 'Τα ονόματα πρέπει να είναι διαφορετικά.',
    hook: ({ forbidden }) => `Κανόνας hook: ο dealer δεν μπορεί να δηλώσει ${forbidden}.`,
    tricksSum: ({ total, cards }) => `Οι μπάζες είναι ${total}, πρέπει να είναι ${cards}.`,
  },
}

export default el
