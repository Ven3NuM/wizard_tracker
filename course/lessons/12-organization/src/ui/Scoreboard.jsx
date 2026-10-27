import { totalsOf } from '../game/rules'
import { useTranslation } from '../i18n'

const formatPoints = (points) => (points > 0 ? `+${points}` : `${points}`)

// Rounds x players with running totals; tapping a finished round opens it for editing
export default function Scoreboard({ players, table, current, onEditRound }) {
  const { t } = useTranslation()
  const totals = totalsOf(table, players.length)
  const best = Math.max(...totals)
  const hasScores = table.length > 0

  return (
    <section className="scoreboard">
      <table className="scoreboard__table">
        <thead>
          <tr>
            <th scope="col" className="scoreboard__round" aria-label={t.roundColumn}>
              #
            </th>
            {players.map((name, p) => (
              <th
                key={p}
                scope="col"
                className={hasScores && totals[p] === best ? 'scoreboard__leader' : undefined}
              >
                <span className="scoreboard__name">{name}</span>
                <span className="scoreboard__total">{totals[p]}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.map((cells, r) => (
            <tr key={r} className="scoreboard__row" onClick={() => onEditRound(r)}>
              <td className="scoreboard__round">
                {/* The whole row is tappable, the button makes it reachable by keyboard */}
                <button type="button" className="scoreboard__edit" aria-label={t.editRound(r + 1)}>
                  {r + 1}
                </button>
              </td>
              {cells.map((cell, p) => (
                <td key={p}>
                  {cell.total}
                  <span className={`scoreboard__detail scoreboard__detail--${cell.points > 0 ? 'hit' : 'miss'}`}>
                    {cell.bid}/{cell.tricks} {formatPoints(cell.points)}
                  </span>
                </td>
              ))}
            </tr>
          ))}
          {current && (
            <tr className="scoreboard__row scoreboard__row--current">
              <td className="scoreboard__round">{table.length + 1}</td>
              {current.bids.map((bid, p) => (
                <td key={p}>
                  <span className="scoreboard__detail">
                    {current.phase === 'tricks' ? t.bidShort(bid) : '…'}
                  </span>
                </td>
              ))}
            </tr>
          )}
        </tbody>
      </table>
      {hasScores && <p className="hint hint--center">{t.editHint}</p>}
    </section>
  )
}
