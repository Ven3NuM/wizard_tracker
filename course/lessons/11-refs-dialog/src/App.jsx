import { useGame } from './useGame'
import Setup from './Setup'
import GameScreen from './GameScreen'

export default function App() {
  const [{ game, lastSetup }, dispatch] = useGame()

  return (
    <main className="app">
      <h1 className="app__title">Wizard Tracker</h1>
      {game ? (
        <GameScreen game={game} dispatch={dispatch} />
      ) : (
        <Setup
          initialSetup={lastSetup}
          onStart={(setup) => dispatch({ type: 'START_GAME', ...setup })}
        />
      )}
    </main>
  )
}
