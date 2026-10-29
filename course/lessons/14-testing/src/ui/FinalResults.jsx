import { bestRound, hitsOf, ranking, totalsOf } from '../game/rules'
import { useTranslation } from '../i18n'
import Avatar from './Avatar'
import { formatPoints } from './format'

const PODIUM = 3

export default function FinalResults({ players, table, onRematch, onNewGame }) {
  const { t } = useTranslation()
  const results = ranking(players, totalsOf(table, players.length))
  const winners = results.filter(({ place }) => place === 1).map(({ name }) => name)
  const hits = hitsOf(table, players.length)
  const sharpest = hits.indexOf(Math.max(...hits))
  const best = bestRound(table)

  return (
    <section className="results">
      <p className="label label--center">{t.gameOver(table.length)}</p>
      <h1 className="results__title">{t.winner(winners)}</h1>

      {/* The first three stand on a podium (second, first, third on screen), the rest follow in a list */}
      <ol className="podium">
        {results.slice(0, PODIUM).map(({ seat, name, total, place }) => (
          <li key={seat} className={`podium__step podium__step--place-${place}`}>
            <Avatar name={name} index={seat} />
            <span className="podium__name">{name}</span>
            <span className="podium__block">
              <span className="podium__place">{place}</span>
              <span className="podium__total">{total}</span>
            </span>
          </li>
        ))}
      </ol>

      {results.length > PODIUM && (
        <ol className="results__list" start={PODIUM + 1}>
          {results.slice(PODIUM).map(({ seat, name, total, place }) => (
            <li key={seat} style={{ '--avatar': `var(--player-${seat + 1})` }}>
              <span className="results__place">{place}</span>
              <span className="dot" aria-hidden="true" />
              <span className="results__name">{name}</span>
              <span className="results__total">{total}</span>
            </li>
          ))}
        </ol>
      )}

      <dl className="stats">
        <div className="stats__item">
          <dt className="hint">{t.mostAccurate}</dt>
          <dd>
            {players[sharpest]} · {hits[sharpest]}/{table.length}
          </dd>
        </div>
        <div className="stats__item">
          <dt className="hint">{t.biggestRound}</dt>
          <dd>
            {players[best.player]} · {formatPoints(best.points)}
          </dd>
        </div>
      </dl>

      <div className="actions actions--center">
        <button type="button" className="button" onClick={onRematch}>
          {t.rematch}
        </button>
        <button type="button" className="button button--secondary" onClick={onNewGame}>
          {t.newGame}
        </button>
      </div>
    </section>
  )
}
