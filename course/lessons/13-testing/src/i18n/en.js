const cards = (n) => `${n} ${n === 1 ? 'card' : 'cards'}`

const en = {
  appTitle: 'Wizard Tracker',
  languageName: 'English',
  languageShort: 'EN',

  // Setup
  language: 'Language',
  setupSubtitle: "Who's playing tonight?",
  playerCount: 'Number of players',
  playerName: (n) => `Player ${n}`,
  firstDealer: 'First dealer',
  drawDealer: 'Draw',
  hookRule: 'Hook rule',
  hookRuleHelp: "Bids can't add up to the number of cards, the dealer bids last.",
  startGame: 'Start',
  roundsCount: (n) => `${n} rounds`,

  // Game
  roundOf: (round, total) => `Round ${round} of ${total}`,
  cardsWord: (n) => (n === 1 ? 'card' : 'cards'),
  firstBidderIs: (name) => `${name} bids first`,
  newGame: 'New game',
  confirmNewGame: 'Start a new game? The current score will be lost.',
  rematch: 'Rematch',

  // Round entry
  bids: 'Bids',
  tricks: 'Tricks',
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
  roundColumn: 'Round',
  bidShort: (n) => `bid ${n}`,
  editHint: 'Tap a round to edit it.',

  // Final results
  gameOver: 'Game over',

  // Validation errors, keyed by the `type` the rules return
  errors: {
    missingName: () => 'Every player needs a name.',
    duplicateName: () => 'Names must be different.',
    hook: ({ forbidden }) => `Hook rule: the dealer can't bid ${forbidden}.`,
    tricksSum: ({ total, cards }) => `Tricks add up to ${total}, they must be ${cards}.`,
  },
}

export default en
