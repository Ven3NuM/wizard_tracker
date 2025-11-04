import React from 'react'

/**
 * LESSON: Props
 *
 * Props are like function parameters. They're passed from parent to child.
 * They're read-only (immutable).
 *
 * This component receives:
 *   - numOfPlayers: current count
 *   - onPlayerCountChange: function to call when user clicks
 */
function NumberOfPlayers({ numOfPlayers, onPlayerCountChange }) {
  /**
   * LESSON: Event Handlers
   *
   * Instead of storing state locally, we "lift state up"
   * to the parent (Settings) component.
   *
   * Why? Because Settings needs to know the count
   * to create the right number of player inputs.
   */
  const handleClick = (count) => {
    onPlayerCountChange(count)
  }

  return (
    <div className="wrapper__players">
      <label>Select Number Of Players</label>
      <div className="btn-group">
        {[3, 4, 5, 6].map((count) => (
          <button
            key={count}
            onClick={() => handleClick(count)}
            className={`btn ${numOfPlayers === count ? 'active' : ''}`}
          >
            {count}
          </button>
        ))}
      </div>
    </div>
  )
}

export default NumberOfPlayers
