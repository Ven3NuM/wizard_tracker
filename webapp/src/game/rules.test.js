import { describe, expect, it } from 'vitest'
import {
  bestRound,
  bidsError,
  forbiddenDealerBid,
  hitsOf,
  ranking,
  roundInfo,
  roundScore,
  scoreTable,
  totalRounds,
  totalsOf,
  tricksError,
  validatePlayers,
} from './rules'

describe('rounds', () => {
  it('deals all 60 cards', () => {
    expect([3, 4, 5, 6].map(totalRounds)).toEqual([20, 15, 12, 10])
  })

  it('deals one more card each round and rotates the deal', () => {
    expect(roundInfo(0, 4, 2)).toEqual({ index: 0, cards: 1, dealer: 2, firstBidder: 3 })
    expect(roundInfo(1, 4, 2)).toEqual({ index: 1, cards: 2, dealer: 3, firstBidder: 0 })
    expect(roundInfo(5, 3, 0)).toMatchObject({ cards: 6, dealer: 2, firstBidder: 0 })
  })
})

describe('roundScore', () => {
  it('gives 20 plus 10 per trick for an exact bid', () => {
    expect(roundScore(0, 0)).toBe(20)
    expect(roundScore(3, 3)).toBe(50)
  })

  it('takes 10 off per trick of difference', () => {
    expect(roundScore(2, 0)).toBe(-20)
    expect(roundScore(0, 3)).toBe(-30)
  })
})

describe('validatePlayers', () => {
  it('requires every name', () => {
    expect(validatePlayers(['Άννα', '', 'Γιώργος'])).toEqual({ type: 'missingName' })
  })

  it('rejects names that differ only in case', () => {
    expect(validatePlayers(['Άννα', 'άννα', 'Γιώργος'])).toEqual({ type: 'duplicateName' })
  })

  it('accepts unique names', () => {
    expect(validatePlayers(['Άννα', 'Βασίλης', 'Γιώργος'])).toBeNull()
  })
})

describe('hook rule', () => {
  const round = roundInfo(2, 3, 1) // 3 cards, player 1 (index 0) deals

  it('allows any total without the hook rule', () => {
    expect(bidsError([1, 1, 1], round, false)).toBeNull()
  })

  it('rejects bids that add up to the cards', () => {
    expect(bidsError([1, 1, 1], round, true)).toEqual({ type: 'hook', forbidden: 1 })
    expect(bidsError([1, 1, 0], round, true)).toBeNull()
  })

  it('names the bid the dealer cannot make, if any', () => {
    expect(forbiddenDealerBid([0, 2, 0], round)).toBe(1)
    expect(forbiddenDealerBid([0, 2, 3], round)).toBeNull()
  })
})

describe('tricksError', () => {
  it('requires the tricks to add up to the cards', () => {
    const round = roundInfo(2, 3, 0)
    expect(tricksError([1, 1, 1], round)).toBeNull()
    expect(tricksError([1, 0, 1], round)).toEqual({ type: 'tricksSum', total: 2, cards: 3 })
  })
})

describe('scores', () => {
  const rounds = [
    { bids: [1, 0, 0], tricks: [1, 0, 0] },
    { bids: [1, 1, 1], tricks: [0, 1, 1] },
  ]

  it('keeps a running total per player', () => {
    const table = scoreTable(rounds)
    expect(table[0].map((cell) => cell.points)).toEqual([30, 20, 20])
    expect(table[1].map((cell) => cell.total)).toEqual([20, 50, 50])
  })

  it('gives the totals after the last round, zeros before any', () => {
    expect(totalsOf(scoreTable(rounds), 3)).toEqual([20, 50, 50])
    expect(totalsOf([], 3)).toEqual([0, 0, 0])
  })

  it('ranks by total, ties share a place', () => {
    expect(ranking(['A', 'B', 'C'], [20, 50, 50])).toEqual([
      { name: 'B', total: 50, place: 1 },
      { name: 'C', total: 50, place: 1 },
      { name: 'A', total: 20, place: 3 },
    ])
  })
})

describe('end of game stats', () => {
  const table = scoreTable([
    { bids: [1, 0, 0], tricks: [1, 0, 0] }, // +30 +20 +20
    { bids: [0, 2, 0], tricks: [0, 2, 0] }, // +20 +40 +20
    { bids: [3, 0, 0], tricks: [0, 3, 0] }, // -30 -30 +20
  ])

  it('counts the rounds each player called exactly', () => {
    expect(hitsOf(table, 3)).toEqual([2, 2, 3])
    expect(hitsOf([], 3)).toEqual([0, 0, 0])
  })

  it('finds the best single round', () => {
    expect(bestRound(table)).toEqual({ player: 1, points: 40 })
    expect(bestRound([])).toBeNull()
  })
})
