import { useState } from 'react'
import Setup from './Setup'
import GameScreen from './GameScreen'

export default function App() {
  // Lifted up: both screens need the game, so it lives in their common parent
  const [game, setGame] = useState(null)

  return (
    <main className="app">
      <h1 className="app__title">Wizard Tracker</h1>
      {game ? (
        <GameScreen game={game} onNewGame={() => setGame(null)} />
      ) : (
        <Setup onStart={(setup) => setGame(setup)} />
      )}
    </main>
  )
}
