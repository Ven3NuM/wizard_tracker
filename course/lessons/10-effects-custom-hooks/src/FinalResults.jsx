import { ranking, totalsOf } from './rules'

export default function FinalResults({ players, table }) {
  const results = ranking(players, totalsOf(table, players.length))

  return (
    <section className="results">
      <h2 className="results__title">Τέλος παιχνιδιού</h2>
      <ol className="results__list">
        {results.map(({ seat, name, total, place }) => (
          <li key={seat} className={place === 1 ? 'results__winner' : undefined}>
            <span className="results__place">{place}</span>
            <span className="results__name">{name}</span>
            <span className="results__total">{total}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}
