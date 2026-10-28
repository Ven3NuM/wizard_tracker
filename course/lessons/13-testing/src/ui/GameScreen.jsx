import { useState } from 'react'
import { roundInfo, scoreTable, totalsOf } from '../game/rules'
import { useTranslation } from '../i18n'
import RoundHeader from './RoundHeader'
import RoundEntry from './RoundEntry'
import Scoreboard from './Scoreboard'
import EditRoundDialog from './EditRoundDialog'
import FinalResults from './FinalResults'

export default function GameScreen({ game, dispatch }) {
  const { t } = useTranslation()
  const { players, rounds, current, hookRule, firstDealer } = game
  const [editing, setEditing] = useState(null) // index of the round being fixed
  const table = scoreTable(rounds)
  const totals = totalsOf(table, players.length)
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
          <RoundHeader players={players} round={round} />
          <RoundEntry
            players={players}
            totals={totals}
            round={round}
            current={current}
            hookRule={hookRule}
            dispatch={dispatch}
          />
        </>
      ) : (
        <FinalResults players={players} table={table} />
      )}

      <Scoreboard players={players} table={table} current={current} onEditRound={setEditing} />

      <div className="actions actions--center">
        {!current && (
          <button type="button" className="button" onClick={() => dispatch({ type: 'REMATCH' })}>
            {t.rematch}
          </button>
        )}
        <button type="button" className="button button--secondary" onClick={handleNewGame}>
          {t.newGame}
        </button>
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
