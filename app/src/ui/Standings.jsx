import { ranking, totalsOf } from '../game/rules'
import { useTranslation } from '../i18n'
import { formatPoints } from './format'

// Players by total, with what each scored in the last round
export default function Standings({ players, table }) {
  const { t } = useTranslation()
  const lastRound = table.at(-1)
  const results = ranking(players, totalsOf(table, players.length))

  return (
    <section className="standings">
      <h2 className="standings__title">
        {t.standings}
        <span className="hint">{t.afterRounds(table.length)}</span>
      </h2>
      <ol className="standings__list">
        {results.map(({ name, total, place }) => {
          const p = players.indexOf(name)
          const { points } = lastRound[p]
          return (
            <li key={name} className="standings__row" style={{ '--avatar': `var(--player-${p + 1})` }}>
              <span className="standings__place">{place}</span>
              <span className="dot" aria-hidden="true" />
              <span className="standings__name">{name}</span>
              <span className={`delta delta--${points > 0 ? 'hit' : 'miss'}`}>{formatPoints(points)}</span>
              <span className="standings__total">{total}</span>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
