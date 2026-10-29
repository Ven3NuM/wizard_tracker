import { useEffect, useReducer } from 'react'
import { initialState, reducer } from './reducer'

// Bump VERSION when the state shape changes: older saves are then ignored instead of crashing
const STORAGE_KEY = 'wizard-tracker'
const VERSION = 1

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (saved?.version === VERSION) return saved.state
  } catch {
    // Blocked or corrupted storage: start fresh
  }
  return initialState
}

// Game state that survives a refresh or a closed tab
export function useGame() {
  const [state, dispatch] = useReducer(reducer, undefined, load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: VERSION, state }))
    } catch {
      // Storage unavailable: the game still works, it just won't be resumed
    }
  }, [state])

  return [state, dispatch]
}
