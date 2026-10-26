const cardsLabel = (n) => `${n} ${n === 1 ? 'φύλλο' : 'φύλλα'}`

const el = {
  appTitle: 'Wizard Tracker',

  // Settings
  numberOfPlayers: 'Αριθμός παικτών',
  playerLabel: (n) => `Παίκτης ${n}:`,
  playerFallback: (n) => `Παίκτης ${n}`,
  playerPlaceholder: 'Όνομα παίκτη',
  hookRule: 'Κανόνας hook',
  hookRuleHelp: 'Ο dealer δεν μπορεί να δηλώσει έτσι ώστε οι δηλώσεις να είναι ίσες με τα φύλλα.',
  firstDealer: 'Πρώτος dealer',
  drawDealer: 'Κλήρωση',
  startGame: 'Έναρξη',

  // Game
  roundInfo: (round, total, cards, dealer) =>
    `Γύρος ${round} / ${total} · ${cardsLabel(cards)} · Dealer: ${dealer}`,
  newGame: 'Νέο παιχνίδι',
  confirmNewGame: 'Νέο παιχνίδι; Το τρέχον σκορ θα χαθεί.',
  rematch: 'Ρεβάνς',

  // Round entry
  bidsTitle: 'Δηλώσεις',
  tricksTitle: 'Μπάζες',
  dealerBadge: 'Dealer',
  firstBidderBadge: 'Δηλώνει πρώτος',
  bidHint: (n) => `δήλωσε ${n}`,
  forbiddenHint: (n) => `δεν μπορεί να δηλώσει ${n}`,
  back: 'Πίσω',
  confirmBids: 'Επιβεβαίωση',
  finishRound: 'Τέλος γύρου',
  tricksRemaining: (n) => (n === 1 ? 'Απομένει 1 μπάζα' : `Απομένουν ${n} μπάζες`),

  // Edit round
  editRound: (n) => `Διόρθωση γύρου ${n}`,
  cards: cardsLabel,
  bidColumn: 'Δήλωση',
  tricksColumn: 'Μπάζες',
  cancel: 'Άκυρο',
  save: 'Αποθήκευση',
  discardChanges: 'Να απορριφθούν οι αλλαγές;',

  // Stepper, read by screen readers
  decrease: (label) => `${label}: μείωση`,
  increase: (label) => `${label}: αύξηση`,

  // Scoreboard
  bidShort: (n) => `δήλ. ${n}`,
  editHint: 'Πατήστε σε έναν γύρο για διόρθωση.',

  // Final results
  gameOver: 'Τέλος παιχνιδιού',

  // Errors, keyed by the type returned from validation
  errors: {
    missingName: () => 'Κάθε παίκτης χρειάζεται όνομα.',
    duplicateName: () => 'Τα ονόματα πρέπει να είναι διαφορετικά.',
    hook: ({ forbidden }) => `Κανόνας hook: ο dealer δεν μπορεί να δηλώσει ${forbidden}.`,
    tricksSum: ({ total, cards }) => `Οι μπάζες είναι ${total}, πρέπει να είναι ${cards}.`,
  },
}

export default el
