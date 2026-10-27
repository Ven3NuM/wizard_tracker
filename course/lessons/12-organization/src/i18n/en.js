const cards = (n) => `${n} ${n === 1 ? 'card' : 'cards'}`

const en = {
  appTitle: 'Wizard Tracker',
  languageName: 'English',

  // Setup
  language: 'Language',
  playerCount: 'Number of players',
  playerName: (n) => `Player ${n}`,
  playerPlaceholder: 'Player name',
  firstDealer: 'First dealer',
  drawDealer: 'Draw',
  hookRule: 'Hook rule',
  hookRuleHelp: "Bids can't add up to the number of cards, the dealer bids last.",
  startGame: 'Start',

  // Game
  roundInfo: (round, total, cardCount, dealer) =>
    `Round ${round} / ${total} · ${cards(cardCount)} · Dealer: ${dealer}`,
  newGame: 'New game',
  confirmNewGame: 'Start a new game? The current score will be lost.',
  rematch: 'Rematch',

  // Round entry
  bids: 'Bids',
  tricks: 'Tricks',
  dealer: 'Dealer',
  firstBidder: 'Bids first',
  bidHint: (n) => `bid ${n}`,
  forbiddenHint: (n) => `can't bid ${n}`,
  tricksRemaining: (n) => (n === 1 ? '1 trick left' : `${n} tricks left`),
  back: 'Back',
  confirmBids: 'Confirm',
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
