import { useState } from 'react'
import RoundEntry from './RoundEntry'
import Scoreboard from './Scoreboard'
import EditRound from './EditRound'
import FinalResults from './FinalResults'
import { cardsForRound, dealerForRound, totalRounds } from '../utils/scoring'
import { t } from '../i18n'

function Game({ game, dispatch }) {
  const { players, rounds, current, hookRule, firstDealer } = game
  const [editing, setEditing] = useState(null)
  const roundIndex = rounds.length

  const handleNewGame = () => {
    // A finished game has nothing left to lose
    if (!current || window.confirm(t.confirmNewGame)) {
      dispatch({ type: 'NEW_GAME' })
    }
  }

  const handleSaveRound = (bids, tricks) => {
    dispatch({ type: 'UPDATE_ROUND', index: editing, bids, tricks })
    setEditing(null)
  }

  return (
    <div className="game">
      {current ? (
        <>
          <p className="game__info">
            {t.roundInfo(
              roundIndex + 1,
              totalRounds(players.length),
              cardsForRound(roundIndex),
              players[dealerForRound(roundIndex, players.length, firstDealer)]
            )}
          </p>
          <RoundEntry
            players={players}
            roundIndex={roundIndex}
            current={current}
            hookRule={hookRule}
            firstDealer={firstDealer}
            dispatch={dispatch}
          />
        </>
      ) : (
        <FinalResults players={players} rounds={rounds} />
      )}

      <Scoreboard players={players} rounds={rounds} current={current} onEditRound={setEditing} />

      <div className="wrapper__buttons wrapper__buttons--center">
        <button type="button" className="btn-secondary" onClick={handleNewGame}>
          {t.newGame}
        </button>
        {!current && (
          <button type="button" onClick={() => dispatch({ type: 'REMATCH' })}>
            {t.rematch}
          </button>
        )}
      </div>

      {editing !== null && (
        <EditRound
          players={players}
          roundIndex={editing}
          round={rounds[editing]}
          hookRule={hookRule}
          firstDealer={firstDealer}
          onSave={handleSaveRound}
          onCancel={() => setEditing(null)}
        />
      )}
    </div>
  )
}

export default Game
