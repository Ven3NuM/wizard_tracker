import { useEffect } from 'react'
import { useGame } from './game/useGame'
import { useTranslation } from './i18n'
import Setup from './ui/Setup'
import GameScreen from './ui/GameScreen'
import LanguageSwitch from './ui/LanguageSwitch'
import { StarIcon } from './ui/icons'
import { keepScreenOn } from './native'

export default function App() {
  const { t } = useTranslation()
  const [{ game, lastSetup }, dispatch] = useGame()
  const playing = Boolean(game)

  useEffect(() => keepScreenOn(playing), [playing])

  return (
    <main className="app">
      {game ? (
        <GameScreen game={game} dispatch={dispatch} />
      ) : (
        <>
          <header className="app__header">
            <span className="app__logo">
              <StarIcon />
            </span>
            <h1 className="app__title">{t.appTitle}</h1>
            <LanguageSwitch />
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
