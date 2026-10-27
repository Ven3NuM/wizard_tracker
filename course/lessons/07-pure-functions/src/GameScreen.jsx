import { useState } from 'react'
import { replaceAt, roundInfo, totalRounds } from './rules'
import RoundEntry from './RoundEntry'

export default function GameScreen({ game, onNewGame }) {
  const { players, firstDealer } = game
  const [bids, setBids] = useState(Array(players.length).fill(0))
  // Derived from the game on every render, never stored
  const round = roundInfo(0, players.length, firstDealer)

  const handleNewGame = () => {
    if (window.confirm('Νέο παιχνίδι; Το τρέχον σκορ θα χαθεί.')) onNewGame()
  }

  return (
    <>
      <p className="round-info">
        Γύρος {round.index + 1} / {totalRounds(players.length)} · {round.cards} {round.cards === 1 ? 'φύλλο' : 'φύλλα'} · Dealer:{' '}
        {players[round.dealer]}
      </p>

      <RoundEntry
        players={players}
        round={round}
        bids={bids}
        onChange={(player, value) => setBids(replaceAt(bids, player, value))}
      />

      <div className="actions actions--center">
        <button type="button" className="button button--secondary" onClick={handleNewGame}>
          Νέο παιχνίδι
        </button>
      </div>
    </>
  )
}
