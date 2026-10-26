import Settings from './components/Settings'
import Game from './components/Game'
import { useGame } from './hooks/useGame'
import { t } from './i18n'

function App() {
  const [{ game, lastSetup }, dispatch] = useGame()

  return (
    <div className="main__wrapper">
      <h1>{t.appTitle}</h1>
      {game ? (
        <Game game={game} dispatch={dispatch} />
      ) : (
        <Settings
          initialSetup={lastSetup}
          onStart={(setup) => dispatch({ type: 'START_GAME', ...setup })}
        />
      )}
    </div>
  )
}

export default App
