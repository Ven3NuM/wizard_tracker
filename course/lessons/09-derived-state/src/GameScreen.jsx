import { roundInfo, scoreTable, totalRounds } from './rules'
import RoundEntry from './RoundEntry'
import Scoreboard from './Scoreboard'
import FinalResults from './FinalResults'

export default function GameScreen({ game, dispatch }) {
  const { players, rounds, current, hookRule, firstDealer } = game
  // Scores are derived from the stored bids and tricks on every render
  const table = scoreTable(rounds)
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
        <FinalResults players={players} table={table} />
      )}

      <Scoreboard players={players} table={table} current={current} />

      <div className="actions actions--center">
        <button type="button" className="button button--secondary" onClick={handleNewGame}>
          Νέο παιχνίδι
        </button>
        {!current && (
          <button type="button" className="button" onClick={() => dispatch({ type: 'REMATCH' })}>
            Ρεβάνς
          </button>
        )}
      </div>
    </>
  )
}
