import { useGame } from './game/useGame'
import Setup from './ui/Setup'
import GameScreen from './ui/GameScreen'
import { LogoIcon } from './ui/icons'

export default function App() {
  const [{ game, lastSetup }, dispatch] = useGame()

  return (
    <main className="app">
      {game ? (
        <GameScreen game={game} dispatch={dispatch} />
      ) : (
        <>
          <header className="app__header">
            <span className="app__logo">
              <LogoIcon />
            </span>
            <h1 className="app__title">Wizard Tracker</h1>
          </header>
          <Setup
            initialSetup={lastSetup}
            onStart={(setup) => dispatch({ type: 'START_GAME', ...setup })}
          />
        </>
      )}
    </main>
  )
}
