import Settings from './components/Settings'
import Game from './components/Game'
import { useGame } from './hooks/useGame'

function App() {
  const [{ game, lastSetup }, dispatch] = useGame()

  return (
    <div className="main__wrapper">
      <h1>Wizard Tracker</h1>
      {game ? (
        <Game game={game} dispatch={dispatch} />
      ) : (
        <Settings
          initialSetup={lastSetup}
          onStart={(players, hookRule) => dispatch({ type: 'START_GAME', players, hookRule })}
        />
      )}
    </div>
  )
}

export default App
