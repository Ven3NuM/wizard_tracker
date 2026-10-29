import { useState } from 'react'
import { roundInfo, scoreTable, totalsOf } from '../game/rules'
import { useTranslation } from '../i18n'
import RoundHeader from './RoundHeader'
import GameMenu from './GameMenu'
import RoundEntry from './RoundEntry'
import Standings from './Standings'
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
          <RoundHeader players={players} round={round}>
            <GameMenu onNewGame={handleNewGame} />
          </RoundHeader>
          <RoundEntry
            players={players}
            totals={totals}
            round={round}
            current={current}
            hookRule={hookRule}
            dispatch={dispatch}
          />
          {table.length > 0 && <Standings players={players} table={table} />}
        </>
      ) : (
        <FinalResults
          players={players}
          table={table}
          onRematch={() => dispatch({ type: 'REMATCH' })}
          onNewGame={handleNewGame}
        />
      )}

      {table.length > 0 && <Scoreboard players={players} table={table} onEditRound={setEditing} />}

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
