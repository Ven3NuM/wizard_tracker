import React from 'react'
import Settings from './components/Settings'

/**
 * LESSON: This is a Functional Component (modern React)
 * - Simpler syntax than class components
 * - Use hooks for state and lifecycle
 * - This is now the recommended way to write React
 */
function App() {
  return (
    <div className="main__wrapper">
      <h1>Wizard Tracker</h1>
      <Settings />
    </div>
  )
}

export default App
