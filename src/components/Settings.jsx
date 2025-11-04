import React, { useState } from 'react'
import NumberOfPlayers from './NumberOfPlayers'
import InitPlayersList from './InitPlayersList'

/**
 * LESSON: useState Hook
 *
 * Instead of class component with constructor and this.state:
 *   constructor() { this.state = { count: 0 } }
 *
 * We use useState:
 *   const [count, setCount] = useState(0)
 *
 * - First value (count) is the current state
 * - Second value (setCount) is the function to update it
 * - useState(0) sets the initial value
 */
function Settings() {
  // State: Number of players (3-6)
  const [numOfPlayers, setNumOfPlayers] = useState(3)

  // State: Array to store player names
  const [players, setPlayers] = useState(Array(3).fill(''))

  /**
   * LESSON: Callback Functions as Props
   * We pass this function down to child components
   * so they can update the parent's state
   */
  const handlePlayerCountChange = (count) => {
    setNumOfPlayers(count)
    // Resize the players array when count changes
    setPlayers(Array(count).fill(''))
  }

  const handlePlayerNameChange = (index, name) => {
    // LESSON: Always create new arrays/objects, don't mutate state
    const newPlayers = [...players] // Spread operator creates a copy
    newPlayers[index] = name
    setPlayers(newPlayers)
  }

  return (
    <div className="settings">
      <NumberOfPlayers
        numOfPlayers={numOfPlayers}
        onPlayerCountChange={handlePlayerCountChange}
      />
      <InitPlayersList
        players={players}
        onPlayerNameChange={handlePlayerNameChange}
      />
    </div>
  )
}

export default Settings
