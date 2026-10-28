import { useTranslation } from '../i18n'
import { MoreIcon } from './icons'

// ⋯ button with a native popover: it closes on Escape or a tap outside by itself
export default function GameMenu({ onNewGame }) {
  const { t } = useTranslation()

  return (
    <>
      <button type="button" className="icon-button" aria-label={t.menu} popoverTarget="game-menu">
        <MoreIcon />
      </button>
      <div id="game-menu" className="menu" popover="auto">
        <button type="button" className="menu__item" onClick={onNewGame}>
          {t.newGame}
        </button>
      </div>
    </>
  )
}
