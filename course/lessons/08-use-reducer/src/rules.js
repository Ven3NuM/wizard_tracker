// Wizard rules as pure functions: no React, easy to reuse and test.

export const PLAYER_COUNTS = [3, 4, 5, 6]

const TOTAL_CARDS = 60

export const totalRounds = (playerCount) => TOTAL_CARDS / playerCount

export const sum = (values) => values.reduce((total, value) => total + value, 0)

export const replaceAt = (values, index, value) =>
  values.map((current, i) => (i === index ? value : current))

// Everything a round needs to know about the table. Round `index` is 0-based and deals index + 1
// cards; the deal moves one seat each round and bidding starts left of the dealer.
export const roundInfo = (index, playerCount, firstDealer) => {
  const dealer = (firstDealer + index) % playerCount
  return { index, cards: index + 1, dealer, firstBidder: (dealer + 1) % playerCount }
}

// Hook rule: the dealer may not bid the number that makes the bids add up to the cards
export const forbiddenDealerBid = (bids, { cards, dealer }) => {
  const others = sum(bids) - bids[dealer]
  return cards - others >= 0 ? cards - others : null
}

// Validation returns null when valid, otherwise { type, ...data } describing the problem

export const validatePlayers = (names) => {
  if (names.some((name) => name === '')) return { type: 'missingName' }
  const lower = names.map((name) => name.toLowerCase())
  if (new Set(lower).size !== lower.length) return { type: 'duplicateName' }
  return null
}

export const bidsError = (bids, round, hookRule) =>
  hookRule && sum(bids) === round.cards
    ? { type: 'hook', forbidden: forbiddenDealerBid(bids, round) }
    : null

export const tricksError = (tricks, { cards }) => {
  const total = sum(tricks)
  return total === cards ? null : { type: 'tricksSum', total, cards }
}
