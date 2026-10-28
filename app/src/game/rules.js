// Wizard rules as pure functions: no React, no storage, easy to test.

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

export const roundScore = (bid, tricks) =>
  bid === tricks ? 20 + 10 * tricks : -10 * Math.abs(bid - tricks)

// Hook rule: the dealer may not bid the number that makes the bids add up to the cards
export const forbiddenDealerBid = (bids, { cards, dealer }) => {
  const others = sum(bids) - bids[dealer]
  return cards - others >= 0 ? cards - others : null
}

// Validation returns null or { type, ...data }; the UI turns it into text (see i18n)

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

// Per round, per player: { bid, tricks, points, total } with a running total
export const scoreTable = (rounds) => {
  const totals = []
  return rounds.map(({ bids, tricks }) =>
    bids.map((bid, p) => {
      const points = roundScore(bid, tricks[p])
      totals[p] = (totals[p] ?? 0) + points
      return { bid, tricks: tricks[p], points, total: totals[p] }
    })
  )
}

export const totalsOf = (table, playerCount) =>
  table.at(-1)?.map((cell) => cell.total) ?? Array(playerCount).fill(0)

// How many rounds each player called exactly
export const hitsOf = (table, playerCount) =>
  Array.from({ length: playerCount }, (_, p) => table.filter((cells) => cells[p].points > 0).length)

// The most points anyone scored in one round: { player, points }, the earliest on a tie
export const bestRound = (table) =>
  table.reduce((best, cells) => {
    const top = Math.max(...cells.map((cell) => cell.points))
    return best && best.points >= top ? best : { player: cells.findIndex((cell) => cell.points === top), points: top }
  }, null)

// Highest total first; players with the same total share a place
export const ranking = (players, totals) => {
  const sorted = players
    .map((name, p) => ({ name, total: totals[p] }))
    .sort((a, b) => b.total - a.total)
  return sorted.map((entry) => ({
    ...entry,
    place: sorted.findIndex((other) => other.total === entry.total) + 1,
  }))
}
