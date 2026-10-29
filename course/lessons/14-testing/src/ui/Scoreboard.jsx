import { useTranslation } from '../i18n'
import { formatPoints } from './format'

// Columns are narrow, so the header shows the start of each name
const SHORT_NAME = 3

// Rounds x players with running totals; tapping a round opens it for editing
export default function Scoreboard({ players, table, onEditRound }) {
  const { t } = useTranslation()

  return (
    <section className="scoreboard">
      <h2 className="label label--caps">{t.editHint}</h2>
      <table className="scoreboard__table">
        <thead>
          <tr>
            <th scope="col" className="scoreboard__round" aria-label={t.roundColumn}>
              #
            </th>
            {players.map((name, p) => (
              <th key={p} scope="col" className="scoreboard__head">
                <span aria-hidden="true">{name.slice(0, SHORT_NAME)}</span>
                <span className="visually-hidden">{name}</span>
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
              {cells.map((cell, p) => {
                const result = cell.points > 0 ? 'hit' : 'miss'
                return (
                  <td key={p}>
                    <span className="scoreboard__cell-total">{cell.total}</span>
                    <span className={`scoreboard__detail scoreboard__detail--${result}`}>
                      {cell.bid}/{cell.tricks} {formatPoints(cell.points)}
                    </span>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
