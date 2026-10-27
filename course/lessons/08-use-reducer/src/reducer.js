import { replaceAt, totalRounds } from './rules'

// Only what players enter is stored: scores, totals, dealer and round number are derived.
//
// state = {
//   lastSetup: { players, hookRule, firstDealer } | null,   // prefills the setup screen
//   game: {
//     players: string[],                                   // in seat order
//     hookRule: boolean,
//     firstDealer: number,                                 // seat that deals round 1
//     rounds: [{ bids: number[], tricks: number[] }],      // finished rounds
//     current: { phase: 'bids' | 'tricks', bids, tricks } | null,   // null = game over
//   } | null,                                              // null = setup screen
// }

export const initialState = { lastSetup: null, game: null }

const newRound = (playerCount) => ({
  phase: 'bids',
  bids: Array(playerCount).fill(0),
  tricks: Array(playerCount).fill(0),
})

const startGame = ({ players, hookRule, firstDealer }) => ({
  lastSetup: { players, hookRule, firstDealer },
  game: { players, hookRule, firstDealer, rounds: [], current: newRound(players.length) },
})

// The reducer trusts its input, the UI validates before dispatching
export function reducer(state, action) {
  const { game } = state
  const withGame = (changes) => ({ ...state, game: { ...game, ...changes } })
  const withCurrent = (changes) => withGame({ current: { ...game.current, ...changes } })

  switch (action.type) {
    case 'START_GAME':
      return startGame(action)

    case 'NEW_GAME':
      return { ...state, game: null }

    case 'SET_VALUE': {
      // Writes a bid or a trick count, depending on the phase
      const field = game.current.phase === 'bids' ? 'bids' : 'tricks'
      return withCurrent({ [field]: replaceAt(game.current[field], action.player, action.value) })
    }

    case 'CONFIRM_BIDS':
      return withCurrent({ phase: 'tricks', tricks: Array(game.players.length).fill(0) })

    case 'BACK_TO_BIDS':
      return withCurrent({ phase: 'bids' })

    case 'FINISH_ROUND': {
      const { bids, tricks } = game.current
      const rounds = [...game.rounds, { bids, tricks }]
      const isOver = rounds.length === totalRounds(game.players.length)
      return withGame({ rounds, current: isOver ? null : newRound(game.players.length) })
    }

    default:
      throw new Error(`Unknown action: ${action.type}`)
  }
}
