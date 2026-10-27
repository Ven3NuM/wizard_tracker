import { sum } from './rules'
import Stepper from './Stepper'

// Bids for the current round. It only shows them and reports changes, GameScreen owns the values.
export default function RoundEntry({ players, round, bids, onChange }) {
  return (
    <section className="card">
      <h2 className="card__title">
        Δηλώσεις
        <span className="card__meta">
          {sum(bids)} / {round.cards}
        </span>
      </h2>

      <ul className="entries">
        {players.map((name, p) => (
          <li key={p} className="entry">
            <span className="entry__name">
              {name}
              {p === round.dealer && <span className="badge">Dealer</span>}
              {p === round.firstBidder && <span className="badge badge--outline">Δηλώνει πρώτος</span>}
            </span>
            <Stepper
              label={`${name}, Δήλωση`}
              value={bids[p]}
              max={round.cards}
              onChange={(value) => onChange(p, value)}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
