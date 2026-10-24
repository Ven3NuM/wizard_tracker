import { playerTotals, scoreRows } from '../utils/scoring'
import { t } from '../i18n'

const formatPoints = (points) => (points > 0 ? `+${points}` : `${points}`)

function Scoreboard({ players, rounds, current, onEditRound }) {
  const rows = scoreRows(rounds, players.length)
  const totals = playerTotals(rounds, players.length)
  const best = Math.max(...totals)
  const hasScores = rounds.length > 0

  return (
    <div className="scoreboard">
      <table className="scoreboard__table">
        <thead>
          <tr>
            <th className="scoreboard__round">#</th>
            {players.map((name, p) => (
              <th key={p} className={hasScores && totals[p] === best ? 'scoreboard__leader' : ''}>
                <span className="scoreboard__name">{name}</span>
                <span className="scoreboard__total">{totals[p]}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((cells, r) => (
            <tr key={r} className="scoreboard__row" onClick={() => onEditRound(r)}>
              <td className="scoreboard__round">{r + 1}</td>
              {cells.map((cell, p) => (
                <td key={p}>
                  <span className="scoreboard__cell-total">{cell.total}</span>
                  <span className={`scoreboard__detail ${cell.points > 0 ? 'is-hit' : 'is-miss'}`}>
                    {cell.bid}/{cell.tricks} {formatPoints(cell.points)}
                  </span>
                </td>
              ))}
            </tr>
          ))}
          {current && (
            <tr className="scoreboard__row scoreboard__row--current">
              <td className="scoreboard__round">{rounds.length + 1}</td>
              {players.map((_, p) => (
                <td key={p}>
                  <span className="scoreboard__detail">
                    {current.phase === 'tricks' ? t.bidShort(current.bids[p]) : '…'}
                  </span>
                </td>
              ))}
            </tr>
          )}
        </tbody>
      </table>
      {hasScores && <p className="scoreboard__note">{t.editHint}</p>}
    </div>
  )
}

export default Scoreboard
