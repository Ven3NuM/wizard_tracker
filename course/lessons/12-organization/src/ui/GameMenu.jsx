import { MoreIcon } from './icons'

// ⋯ button with a native popover: it closes on Escape or a tap outside by itself
export default function GameMenu({ onNewGame }) {

  return (
    <>
      <button type="button" className="icon-button" aria-label="Μενού" popoverTarget="game-menu">
        <MoreIcon />
      </button>
      <div id="game-menu" className="menu" popover="auto">
        <button type="button" className="menu__item" onClick={onNewGame}>
          Νέο παιχνίδι
        </button>
      </div>
    </>
  )
}
