const cards = (n) => `${n} ${n === 1 ? 'card' : 'cards'}`

const en = {
  appTitle: 'Wizard Tracker',
  languageName: 'English',
  languageShort: 'EN',

  // Setup
  language: 'Language',
  setupSubtitle: "Who's playing tonight?",
  playerCount: 'Players',
  playerName: (n) => `Player ${n}`,
  chooseDealer: (name) => `${name} deals first`,
  drawDealer: 'Draw dealer',
  hookRule: 'Hook rule',
  hookRuleHelp: "Bids can't add up to the number of cards",
  startGame: 'Start',
  roundsCount: (n) => `${n} rounds`,

  // Game
  roundOf: (round, total) => `Round ${round} of ${total}`,
  cardsWord: (n) => (n === 1 ? 'card' : 'cards'),
  firstBidderIs: (name) => `${name} starts`,
  menu: 'Menu',
  newGame: 'New game',
  confirmNewGame: 'Start a new game? The current score will be lost.',
  rematch: 'Rematch',

  // Round entry
  bids: 'Bids',
  tricks: 'Tricks',
  tricksCount: (taken, cards) => `${taken} / ${cards} tricks`,
  dealer: 'Deals',
  firstBidder: 'Bids first',
  bidHint: (n) => `bid ${n}`,
  totalHint: (n) => `Total ${n}`,
  forbiddenHint: (n) => `can't bid ${n}`,
  tricksRemaining: (n) => (n === 1 ? '1 trick left' : `${n} tricks left`),
  back: 'Back',
  confirmBids: 'Confirm bids',
  finishRound: 'End round',

  // Edit round
  editRound: (n) => `Edit round ${n}`,
  cards,
  bid: 'Bid',
  cancel: 'Cancel',
  save: 'Save',
  discardChanges: 'Discard your changes?',

  // Stepper, read by screen readers
  decrease: (label) => `${label}: decrease`,
  increase: (label) => `${label}: increase`,

  // Scoreboard
  standings: 'Standings',
  afterRounds: (n) => (n === 1 ? 'after 1 round' : `after ${n} rounds`),
  roundColumn: 'Round',
  editHint: 'Rounds · tap to edit',

  // Final results
  gameOver: (rounds) => `${rounds} rounds · done`,
  winner: (names) => `${names.length === 1 ? 'Winner' : 'Winners'}: ${names.join(' & ')}`,
  mostAccurate: 'Most accurate',
  biggestRound: 'Biggest round',

  // Validation errors, keyed by the `type` the rules return
  errors: {
    missingName: () => 'Every player needs a name.',
    duplicateName: () => 'Names must be different.',
    hook: ({ forbidden }) => `Hook rule: the dealer can't bid ${forbidden}.`,
    tricksSum: ({ total, cards }) => `Tricks add up to ${total}, they must be ${cards}.`,
  },
}

export default en
