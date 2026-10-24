export const TOTAL_CARDS = 60

export const totalRounds = (numPlayers) => TOTAL_CARDS / numPlayers

// Round n (0-based index) deals n + 1 cards
export const cardsForRound = (roundIndex) => roundIndex + 1

// Player 1 deals the first round, then the deal moves one seat each round
export const dealerForRound = (roundIndex, numPlayers) => roundIndex % numPlayers

// Bidding starts left of the dealer, the dealer bids last
export const biddingOrder = (roundIndex, numPlayers) => {
  const dealer = dealerForRound(roundIndex, numPlayers)
  return Array.from({ length: numPlayers }, (_, i) => (dealer + 1 + i) % numPlayers)
}

export const sum = (values) => values.reduce((total, v) => total + v, 0)

export const roundScore = (bid, tricks) =>
  bid === tricks ? 20 + 10 * tricks : -10 * Math.abs(bid - tricks)

// The bid that would make the total equal the cards, given the other players' bids
export const forbiddenDealerBid = (bids, roundIndex) => {
  const dealer = dealerForRound(roundIndex, bids.length)
  const others = bids.filter((_, i) => i !== dealer)
  const forbidden = cardsForRound(roundIndex) - sum(others)
  return forbidden >= 0 ? forbidden : null
}

export const bidsError = (bids, roundIndex, hookRule) => {
  if (hookRule && sum(bids) === cardsForRound(roundIndex)) {
    return { type: 'hook', forbidden: forbiddenDealerBid(bids, roundIndex) }
  }
  return null
}

export const tricksError = (tricks, roundIndex) => {
  const cards = cardsForRound(roundIndex)
  const total = sum(tricks)
  if (total !== cards) return { type: 'tricksSum', total, cards }
  return null
}

// Per round, per player: { bid, tricks, points, total }
export const scoreRows = (rounds, numPlayers) => {
  const totals = Array(numPlayers).fill(0)
  return rounds.map(({ bids, tricks }) =>
    bids.map((bid, p) => {
      const points = roundScore(bid, tricks[p])
      totals[p] += points
      return { bid, tricks: tricks[p], points, total: totals[p] }
    })
  )
}

export const playerTotals = (rounds, numPlayers) => {
  const rows = scoreRows(rounds, numPlayers)
  return rows.length ? rows[rows.length - 1].map((cell) => cell.total) : Array(numPlayers).fill(0)
}
