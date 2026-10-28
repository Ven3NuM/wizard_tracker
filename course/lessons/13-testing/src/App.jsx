import { useGame } from './game/useGame'
import { useTranslation } from './i18n'
import Setup from './ui/Setup'
import GameScreen from './ui/GameScreen'
import LanguageSwitch from './ui/LanguageSwitch'

export default function App() {
  const { t } = useTranslation()
  const [{ game, lastSetup }, dispatch] = useGame()

  return (
    <main className="app">
      <header className="app__header">
        <span className="app__logo" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round">
            <path d="M12 3l2.2 5.3L20 9l-4.4 3.8L17 18.5 12 15.6 7 18.5l1.4-5.7L4 9l5.8-.7z" />
          </svg>
        </span>
        <h1 className="app__title">{t.appTitle}</h1>
        {/* The language is picked before a game, the game screen keeps the header clean */}
        {!game && <LanguageSwitch />}
      </header>
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
