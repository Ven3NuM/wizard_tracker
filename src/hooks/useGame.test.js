import { describe, expect, it } from 'vitest'
import { reducer } from './useGame'

const start = (players = ['A', 'B', 'C'], firstDealer = 0) =>
  reducer({ lastSetup: null, game: null }, { type: 'START_GAME', players, hookRule: false, firstDealer })

const playRound = (state, bids, tricks) => {
  let next = state
  bids.forEach((value, player) => (next = reducer(next, { type: 'SET_BID', player, value })))
  next = reducer(next, { type: 'CONFIRM_BIDS' })
  tricks.forEach((value, player) => (next = reducer(next, { type: 'SET_TRICKS', player, value })))
  return reducer(next, { type: 'FINISH_ROUND' })
}

describe('game reducer', () => {
  it('starts a game and remembers the setup', () => {
    const state = start(['A', 'B', 'C'], 2)
    expect(state.lastSetup).toEqual({ players: ['A', 'B', 'C'], hookRule: false, firstDealer: 2 })
    expect(state.game.rounds).toEqual([])
    expect(state.game.current).toEqual({ phase: 'bids', bids: [0, 0, 0], tricks: [0, 0, 0] })
  })

  it('records a finished round and starts the next one', () => {
    const state = playRound(start(), [1, 0, 0], [1, 0, 0])
    expect(state.game.rounds).toEqual([{ bids: [1, 0, 0], tricks: [1, 0, 0] }])
    expect(state.game.current.phase).toBe('bids')
  })

  it('goes back to bids keeping them', () => {
    let state = reducer(start(), { type: 'SET_BID', player: 1, value: 1 })
    state = reducer(state, { type: 'CONFIRM_BIDS' })
    state = reducer(state, { type: 'BACK_TO_BIDS' })
    expect(state.game.current).toMatchObject({ phase: 'bids', bids: [0, 1, 0] })
  })

  it('ends the game after the last round', () => {
    // 6 players play 10 rounds
    let state = start(['A', 'B', 'C', 'D', 'E', 'F'])
    for (let r = 0; r < 10; r++) {
      state = playRound(state, [0, 0, 0, 0, 0, 0], [r + 1, 0, 0, 0, 0, 0])
    }
    expect(state.game.rounds).toHaveLength(10)
    expect(state.game.current).toBeNull()
  })

  it('updates a finished round', () => {
    let state = playRound(start(), [1, 0, 0], [1, 0, 0])
    state = reducer(state, { type: 'UPDATE_ROUND', index: 0, bids: [0, 0, 1], tricks: [0, 0, 1] })
    expect(state.game.rounds[0]).toEqual({ bids: [0, 0, 1], tricks: [0, 0, 1] })
  })

  it('starts a rematch with the next first dealer', () => {
    const state = reducer(playRound(start(['A', 'B', 'C'], 2), [1, 0, 0], [1, 0, 0]), { type: 'REMATCH' })
    expect(state.game.players).toEqual(['A', 'B', 'C'])
    expect(state.game.firstDealer).toBe(0)
    expect(state.game.rounds).toEqual([])
  })

  it('keeps the last setup on a new game', () => {
    const state = reducer(start(), { type: 'NEW_GAME' })
    expect(state.game).toBeNull()
    expect(state.lastSetup.players).toEqual(['A', 'B', 'C'])
  })
})
