import React from 'react'
import InitPlayer from './InitPlayer'

/**
 * LESSON: Rendering Lists with .map()
 *
 * In React, we use .map() to transform arrays into components.
 * Each item in the list MUST have a unique "key" prop.
 *
 * Why keys? React uses them to efficiently update the DOM
 * when the list changes.
 */
function InitPlayersList({ players, onPlayerNameChange }) {
  return (
    <div className="init_players">
      <ul id="listOfPlayers">
        {players.map((playerName, index) => (
          <InitPlayer
            key={index} // Using index as key (OK here since list doesn't reorder)
            playerNumber={index + 1}
            playerName={playerName}
            onChange={(name) => onPlayerNameChange(index, name)}
          />
        ))}
      </ul>
    </div>
  )
}

export default InitPlayersList
