import { totalsOf } from './rules'

const formatPoints = (points) => (points > 0 ? `+${points}` : `${points}`)

// Rounds x players with running totals
export default function Scoreboard({ players, table, current }) {
  const totals = totalsOf(table, players.length)
  const best = Math.max(...totals)
  const hasScores = table.length > 0

  return (
    <section className="scoreboard">
      <table className="scoreboard__table">
        <thead>
          <tr>
            <th scope="col" className="scoreboard__round" aria-label="Γύρος">
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
            <tr key={r} className="scoreboard__row">
              <td className="scoreboard__round">{r + 1}</td>
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
                    {current.phase === 'tricks' ? `δήλ. ${bid}` : '…'}
                  </span>
                </td>
              ))}
            </tr>
          )}
        </tbody>
      </table>
    </section>
  )
}
