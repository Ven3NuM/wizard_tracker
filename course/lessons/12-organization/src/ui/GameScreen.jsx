import { useState } from 'react'
import { roundInfo, scoreTable, totalRounds } from '../game/rules'
import { useTranslation } from '../i18n'
import RoundEntry from './RoundEntry'
import Scoreboard from './Scoreboard'
import EditRoundDialog from './EditRoundDialog'
import FinalResults from './FinalResults'

export default function GameScreen({ game, dispatch }) {
  const { t } = useTranslation()
  const { players, rounds, current, hookRule, firstDealer } = game
  const [editing, setEditing] = useState(null) // index of the round being fixed
  const table = scoreTable(rounds)
  const round = roundInfo(rounds.length, players.length, firstDealer)

  const handleNewGame = () => {
    // A finished game has nothing left to lose
    if (!current || window.confirm(t.confirmNewGame)) dispatch({ type: 'NEW_GAME' })
  }

  const handleSave = (updated) => {
    dispatch({ type: 'UPDATE_ROUND', index: editing, round: updated })
    setEditing(null)
  }

  return (
    <>
      {current ? (
        <>
          <p className="round-info">
            {t.roundInfo(round.index + 1, totalRounds(players.length), round.cards, players[round.dealer])}
          </p>
          <RoundEntry players={players} round={round} current={current} hookRule={hookRule} dispatch={dispatch} />
        </>
      ) : (
        <FinalResults players={players} table={table} />
      )}

      <Scoreboard players={players} table={table} current={current} onEditRound={setEditing} />

      <div className="actions actions--center">
        <button type="button" className="button button--secondary" onClick={handleNewGame}>
          {t.newGame}
        </button>
        {!current && (
          <button type="button" className="button" onClick={() => dispatch({ type: 'REMATCH' })}>
            {t.rematch}
          </button>
        )}
      </div>

      {editing !== null && (
        <EditRoundDialog
          players={players}
          round={roundInfo(editing, players.length, firstDealer)}
          values={rounds[editing]}
          hookRule={hookRule}
          onSave={handleSave}
          onClose={() => setEditing(null)}
        />
      )}
    </>
  )
}
