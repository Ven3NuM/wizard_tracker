import { describe, expect, it } from 'vitest'
import { initialState, reducer } from './reducer'

const start = (players = ['A', 'B', 'C'], firstDealer = 0) =>
  reducer(initialState, { type: 'START_GAME', players, hookRule: false, firstDealer })

const play = (state, ...actions) => actions.reduce(reducer, state)

// Bids and tricks as { player: value } maps, everyone else stays at 0
const playRound = (state, bids, tricks) =>
  play(
    state,
    ...Object.entries(bids).map(([player, value]) => ({ type: 'SET_VALUE', player: +player, value })),
    { type: 'CONFIRM_BIDS' },
    ...Object.entries(tricks).map(([player, value]) => ({ type: 'SET_VALUE', player: +player, value })),
    { type: 'FINISH_ROUND' }
  )

describe('game reducer', () => {
  it('starts a game and remembers the setup', () => {
    const state = start(['A', 'B', 'C'], 2)
    expect(state.lastSetup).toEqual({ players: ['A', 'B', 'C'], hookRule: false, firstDealer: 2 })
    expect(state.game.rounds).toEqual([])
    expect(state.game.current).toEqual({ phase: 'bids', bids: [0, 0, 0], tricks: [0, 0, 0] })
  })

  it('writes bids or tricks depending on the phase', () => {
    let state = play(start(), { type: 'SET_VALUE', player: 1, value: 1 })
    expect(state.game.current.bids).toEqual([0, 1, 0])

    state = play(state, { type: 'CONFIRM_BIDS' }, { type: 'SET_VALUE', player: 0, value: 1 })
    expect(state.game.current).toMatchObject({ phase: 'tricks', bids: [0, 1, 0], tricks: [1, 0, 0] })
  })

  it('goes back to bids keeping them', () => {
    const state = play(start(), { type: 'SET_VALUE', player: 1, value: 1 }, { type: 'CONFIRM_BIDS' }, { type: 'BACK_TO_BIDS' })
    expect(state.game.current).toMatchObject({ phase: 'bids', bids: [0, 1, 0] })
  })

  it('records a finished round and starts the next', () => {
    const state = playRound(start(), { 0: 1 }, { 0: 1 })
    expect(state.game.rounds).toEqual([{ bids: [1, 0, 0], tricks: [1, 0, 0] }])
    expect(state.game.current.phase).toBe('bids')
  })

  it('ends the game after the last round', () => {
    let state = start(['A', 'B', 'C', 'D', 'E', 'F']) // 10 rounds
    for (let r = 0; r < 10; r++) state = playRound(state, {}, { 0: r + 1 })
    expect(state.game.rounds).toHaveLength(10)
    expect(state.game.current).toBeNull()
  })

  it('replaces a finished round', () => {
    const round = { bids: [0, 0, 1], tricks: [0, 0, 1] }
    const state = play(playRound(start(), {}, { 0: 1 }), { type: 'UPDATE_ROUND', index: 0, round })
    expect(state.game.rounds[0]).toEqual(round)
  })

  it('starts a rematch at the same table, next first dealer', () => {
    const state = play(playRound(start(['A', 'B', 'C'], 2), {}, { 0: 1 }), { type: 'REMATCH' })
    expect(state.game).toMatchObject({ players: ['A', 'B', 'C'], firstDealer: 0, rounds: [] })
  })

  it('keeps the last setup on a new game', () => {
    const state = play(start(), { type: 'NEW_GAME' })
    expect(state.game).toBeNull()
    expect(state.lastSetup.players).toEqual(['A', 'B', 'C'])
  })
})
