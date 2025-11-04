import React from 'react'

/**
 * LESSON: Controlled Components
 *
 * In React, form inputs should be "controlled":
 *   - Their value comes from React state (via props)
 *   - They update state via onChange events
 *
 * This gives React full control over the input,
 * making it the "single source of truth"
 */
function InitPlayer({ playerNumber, playerName, onChange }) {
  /**
   * When user types, we call onChange with the new value.
   * This updates the parent's state, which flows back down
   * as the new value prop. This is called "one-way data flow"
   */
  const handleChange = (e) => {
    onChange(e.target.value)
  }

  return (
    <li className="playerName" id={`player${playerNumber}`}>
      <label className="playerName__label">
        Player {playerNumber}:
        <input
          type="text"
          name={`player${playerNumber}`}
          placeholder="Enter player name"
          className="playerName__input"
          value={playerName}
          onChange={handleChange}
        />
      </label>
    </li>
  )
}

export default InitPlayer
