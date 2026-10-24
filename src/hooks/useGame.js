import { useEffect, useReducer } from 'react'
import { totalRounds } from '../utils/scoring'

const STORAGE_KEY = 'wizard-tracker'

const newRound = (numPlayers) => ({
  phase: 'bids',
  bids: Array(numPlayers).fill(0),
  tricks: Array(numPlayers).fill(0),
})

const setAt = (values, index, value) => values.map((v, i) => (i === index ? value : v))

function reducer(state, action) {
  const { game } = state

  switch (action.type) {
    case 'START_GAME': {
      const { players, hookRule } = action
      return {
        lastSetup: { players, hookRule },
        game: { players, hookRule, rounds: [], current: newRound(players.length) },
      }
    }
    case 'SET_BID':
      return {
        ...state,
        game: { ...game, current: { ...game.current, bids: setAt(game.current.bids, action.player, action.value) } },
      }
    case 'CONFIRM_BIDS':
      return {
        ...state,
        game: {
          ...game,
          current: { ...game.current, phase: 'tricks', tricks: Array(game.players.length).fill(0) },
        },
      }
    case 'BACK_TO_BIDS':
      return { ...state, game: { ...game, current: { ...game.current, phase: 'bids' } } }
    case 'SET_TRICKS':
      return {
        ...state,
        game: { ...game, current: { ...game.current, tricks: setAt(game.current.tricks, action.player, action.value) } },
      }
    case 'FINISH_ROUND': {
      const { bids, tricks } = game.current
      const rounds = [...game.rounds, { bids, tricks }]
      const isLast = rounds.length === totalRounds(game.players.length)
      return {
        ...state,
        game: { ...game, rounds, current: isLast ? null : newRound(game.players.length) },
      }
    }
    case 'UPDATE_ROUND':
      return {
        ...state,
        game: { ...game, rounds: setAt(game.rounds, action.index, { bids: action.bids, tricks: action.tricks }) },
      }
    case 'NEW_GAME':
      return { ...state, game: null }
    default:
      throw new Error(`Unknown action: ${action.type}`)
  }
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (saved?.game?.current) {
      // Older saves used null for values not entered yet
      const { current } = saved.game
      current.bids = current.bids.map((v) => v ?? 0)
      current.tricks = current.tricks.map((v) => v ?? 0)
    }
    if (saved) return saved
  } catch {
    // Storage blocked or corrupted, start fresh
  }
  return { lastSetup: null, game: null }
}

export function useGame() {
  const [state, dispatch] = useReducer(reducer, undefined, loadState)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // Ignore, the game still works without persistence
    }
  }, [state])

  return [state, dispatch]
}
