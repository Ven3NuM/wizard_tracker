import { bidsError, forbiddenDealerBid, sum, tricksError } from './rules'
import Stepper from './Stepper'

const errorMessages = {
  hook: ({ forbidden }) => `Κανόνας hook: ο dealer δεν μπορεί να δηλώσει ${forbidden}.`,
  tricksSum: ({ total, cards }) => `Οι μπάζες είναι ${total}, πρέπει να είναι ${cards}.`,
}

// The current round: everyone bids, then everyone enters the tricks they took
export default function RoundEntry({ players, round, current, hookRule, dispatch }) {
  const isBids = current.phase === 'bids'
  const values = isBids ? current.bids : current.tricks
  const error = isBids ? bidsError(current.bids, round, hookRule) : tricksError(current.tricks, round)
  // Fewer tricks than cards only means they aren't all entered yet: a hint, not an error
  const remaining = isBids ? 0 : round.cards - sum(current.tricks)
  const forbidden = isBids && hookRule ? forbiddenDealerBid(current.bids, round) : null

  return (
    <section className="card">
      <h2 className="card__title">
        {isBids ? 'Δηλώσεις' : 'Μπάζες'}
        <span className="card__meta">
          {sum(values)} / {round.cards}
        </span>
      </h2>

      <ul className="entries">
        {players.map((name, p) => (
          <li key={p} className="entry">
            <span className="entry__name">
              {name}
              {p === round.dealer && <span className="badge">Dealer</span>}
              {isBids && p === round.firstBidder && <span className="badge badge--outline">Δηλώνει πρώτος</span>}
              {!isBids && <span className="hint">δήλωσε {current.bids[p]}</span>}
              {p === round.dealer && forbidden !== null && (
                <span className="hint">δεν μπορεί να δηλώσει {forbidden}</span>
              )}
            </span>
            <Stepper
              label={`${name}, ${isBids ? 'Δήλωση' : 'Μπάζες'}`}
              value={values[p]}
              max={round.cards}
              onChange={(value) => dispatch({ type: 'SET_VALUE', player: p, value })}
            />
          </li>
        ))}
      </ul>

      {remaining > 0 ? (
        <p className="hint hint--center">
          {remaining === 1 ? 'Απομένει 1 μπάζα' : `Απομένουν ${remaining} μπάζες`}
        </p>
      ) : (
        error && <p className="error">{errorMessages[error.type](error)}</p>
      )}

      <div className="actions">
        {!isBids && (
          <button type="button" className="button button--secondary" onClick={() => dispatch({ type: 'BACK_TO_BIDS' })}>
            Πίσω
          </button>
        )}
        <button
          type="button"
          className="button"
          disabled={Boolean(error)}
          onClick={() => dispatch({ type: isBids ? 'CONFIRM_BIDS' : 'FINISH_ROUND' })}
        >
          {isBids ? 'Επιβεβαίωση' : 'Τέλος γύρου'}
        </button>
      </div>
    </section>
  )
}
