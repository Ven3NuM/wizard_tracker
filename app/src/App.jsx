import { useGame } from './game/useGame'
import { useTranslation } from './i18n'
import Setup from './ui/Setup'
import GameScreen from './ui/GameScreen'

export default function App() {
  const { t } = useTranslation()
  const [{ game, lastSetup }, dispatch] = useGame()

  return (
    <main className="app">
      <h1 className="app__title">{t.appTitle}</h1>
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
