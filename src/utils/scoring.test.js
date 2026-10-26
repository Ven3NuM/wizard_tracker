import { describe, expect, it } from 'vitest'
import {
  biddingOrder,
  bidsError,
  cardsForRound,
  dealerForRound,
  forbiddenDealerBid,
  playerTotals,
  roundScore,
  scoreRows,
  totalRounds,
  tricksError,
} from './scoring'

describe('rounds', () => {
  it('uses all 60 cards', () => {
    expect([3, 4, 5, 6].map(totalRounds)).toEqual([20, 15, 12, 10])
  })

  it('deals one more card each round', () => {
    expect(cardsForRound(0)).toBe(1)
    expect(cardsForRound(9)).toBe(10)
  })
})

describe('dealer and bidding order', () => {
  it('starts with player 1 by default and rotates', () => {
    expect([0, 1, 2, 3].map((r) => dealerForRound(r, 3))).toEqual([0, 1, 2, 0])
  })

  it('starts with the chosen first dealer', () => {
    expect([0, 1, 2, 3].map((r) => dealerForRound(r, 4, 2))).toEqual([2, 3, 0, 1])
  })

  it('starts left of the dealer, dealer bids last', () => {
    expect(biddingOrder(0, 4)).toEqual([1, 2, 3, 0])
    expect(biddingOrder(1, 4, 2)).toEqual([0, 1, 2, 3])
  })
})

describe('roundScore', () => {
  it('gives 20 plus 10 per trick for an exact bid', () => {
    expect(roundScore(0, 0)).toBe(20)
    expect(roundScore(3, 3)).toBe(50)
  })

  it('takes 10 per trick off for a missed bid', () => {
    expect(roundScore(2, 0)).toBe(-20)
    expect(roundScore(0, 3)).toBe(-30)
  })
})

describe('hook rule', () => {
  it('allows any total without the hook rule', () => {
    expect(bidsError([1, 1, 1], 2, false)).toBeNull()
  })

  it('rejects bids that add up to the cards', () => {
    expect(bidsError([1, 1, 1], 2, true)).toEqual({ type: 'hook', forbidden: 1 })
    expect(bidsError([1, 1, 0], 2, true)).toBeNull()
  })

  it('names the bid the dealer cannot make', () => {
    // Round 3, first dealer is player 2 so player 1 (index 0) deals
    expect(forbiddenDealerBid([0, 2, 0], 2, 1)).toBe(1)
    expect(forbiddenDealerBid([0, 2, 3], 2, 1)).toBeNull()
  })
})

describe('tricksError', () => {
  it('requires tricks to add up to the cards', () => {
    expect(tricksError([1, 1, 1], 2)).toBeNull()
    expect(tricksError([1, 0, 1], 2)).toEqual({ type: 'tricksSum', total: 2, cards: 3 })
  })
})

describe('totals', () => {
  const rounds = [
    { bids: [1, 0, 0], tricks: [1, 0, 0] },
    { bids: [1, 1, 1], tricks: [0, 1, 1] },
  ]

  it('keeps a running total per player', () => {
    const rows = scoreRows(rounds, 3)
    expect(rows[0].map((c) => c.points)).toEqual([30, 20, 20])
    expect(rows[1].map((c) => c.total)).toEqual([20, 50, 50])
  })

  it('returns the final totals, zeros before any round', () => {
    expect(playerTotals(rounds, 3)).toEqual([20, 50, 50])
    expect(playerTotals([], 3)).toEqual([0, 0, 0])
  })
})
