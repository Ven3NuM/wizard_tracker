import { roundInfo, totalRounds } from './rules'
import RoundEntry from './RoundEntry'

export default function GameScreen({ game, dispatch }) {
  const { players, rounds, current, hookRule, firstDealer } = game
  const round = roundInfo(rounds.length, players.length, firstDealer)

  const handleNewGame = () => {
    // A finished game has nothing left to lose
    if (!current || window.confirm('Νέο παιχνίδι; Το τρέχον σκορ θα χαθεί.')) dispatch({ type: 'NEW_GAME' })
  }

  return (
    <>
      {current ? (
        <>
          <p className="round-info">
            Γύρος {round.index + 1} / {totalRounds(players.length)} · {round.cards}{' '}
            {round.cards === 1 ? 'φύλλο' : 'φύλλα'} · Dealer: {players[round.dealer]}
          </p>
          <RoundEntry players={players} round={round} current={current} hookRule={hookRule} dispatch={dispatch} />
        </>
      ) : (
        <h2 className="results__title">Τέλος παιχνιδιού</h2>
      )}

      <div className="actions actions--center">
        <button type="button" className="button button--secondary" onClick={handleNewGame}>
          Νέο παιχνίδι
        </button>
      </div>
    </>
  )
}
