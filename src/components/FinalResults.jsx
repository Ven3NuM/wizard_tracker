import { playerTotals } from '../utils/scoring'
import { t } from '../i18n'

function FinalResults({ players, rounds }) {
  const totals = playerTotals(rounds, players.length)
  const ranking = players
    .map((name, p) => ({ name, total: totals[p] }))
    .sort((a, b) => b.total - a.total)
  // Players with the same total share a place
  const placeOf = (total) => ranking.findIndex((r) => r.total === total) + 1

  return (
    <div className="results">
      <p className="results__title">{t.gameOver}</p>
      <ol className="results__list">
        {ranking.map(({ name, total }) => (
          <li key={name} className={placeOf(total) === 1 ? 'results__winner' : ''}>
            <span className="results__place">{placeOf(total)}</span>
            <span className="results__name">{name}</span>
            <span className="results__total">{total}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default FinalResults
