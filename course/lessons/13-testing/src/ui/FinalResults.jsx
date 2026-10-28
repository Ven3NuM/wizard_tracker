import { ranking, totalsOf } from '../game/rules'
import { useTranslation } from '../i18n'
import Avatar from './Avatar'

export default function FinalResults({ players, table }) {
  const { t } = useTranslation()
  const results = ranking(players, totalsOf(table, players.length))

  return (
    <section className="results">
      <h2 className="results__title">{t.gameOver}</h2>
      <ol className="results__list">
        {results.map(({ name, total, place }) => (
          <li key={name} className={place === 1 ? 'results__winner' : undefined}>
            <span className="results__place">{place}</span>
            <Avatar name={name} index={players.indexOf(name)} />
            <span className="results__name">{name}</span>
            <span className="results__total">{total}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}
