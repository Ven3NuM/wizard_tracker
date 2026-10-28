const cards = (n) => `${n} ${n === 1 ? 'φύλλο' : 'φύλλα'}`

const el = {
  appTitle: 'Wizard Tracker',
  languageName: 'Ελληνικά',
  languageShort: 'ΕΛ',

  // Setup
  language: 'Γλώσσα',
  setupSubtitle: 'Ποιοι παίζουν απόψε;',
  playerCount: 'Αριθμός παικτών',
  playerName: (n) => `Παίκτης ${n}`,
  firstDealer: 'Πρώτος dealer',
  drawDealer: 'Κλήρωση',
  hookRule: 'Κανόνας hook',
  hookRuleHelp: 'Οι δηλώσεις δεν μπορούν να είναι ίσες με τα φύλλα, ο dealer δηλώνει τελευταίος.',
  startGame: 'Έναρξη',
  roundsCount: (n) => `${n} γύροι`,

  // Game
  roundOf: (round, total) => `Γύρος ${round} από ${total}`,
  cardsWord: (n) => (n === 1 ? 'φύλλο' : 'φύλλα'),
  firstBidderIs: (name) => `Δηλώνει πρώτος: ${name}`,
  newGame: 'Νέο παιχνίδι',
  confirmNewGame: 'Νέο παιχνίδι; Το τρέχον σκορ θα χαθεί.',
  rematch: 'Ρεβάνς',

  // Round entry
  bids: 'Δηλώσεις',
  tricks: 'Μπάζες',
  dealer: 'Μοιράζει',
  firstBidder: 'Δηλώνει πρώτος',
  bidHint: (n) => `δήλωσε ${n}`,
  totalHint: (n) => `Σύνολο ${n}`,
  forbiddenHint: (n) => `δεν μπορεί να δηλώσει ${n}`,
  tricksRemaining: (n) => (n === 1 ? 'Απομένει 1 μπάζα' : `Απομένουν ${n} μπάζες`),
  back: 'Πίσω',
  confirmBids: 'Επιβεβαίωση δηλώσεων',
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
