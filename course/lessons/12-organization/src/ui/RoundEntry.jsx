import { bidsError, forbiddenDealerBid, sum, tricksError } from '../game/rules'
import Avatar from './Avatar'
import Stepper from './Stepper'

const errorMessages = {
  hook: ({ forbidden }) => `Κανόνας hook: ο dealer δεν μπορεί να δηλώσει ${forbidden}.`,
  tricksSum: ({ total, cards }) => `Οι μπάζες είναι ${total}, πρέπει να είναι ${cards}.`,
}

// The current round: everyone bids, then everyone enters the tricks they took
export default function RoundEntry({ players, totals, round, current, hookRule, dispatch }) {
  const isBids = current.phase === 'bids'
  const values = isBids ? current.bids : current.tricks
  const error = isBids ? bidsError(current.bids, round, hookRule) : tricksError(current.tricks, round)
  // Fewer tricks than cards only means they aren't all entered yet: a hint, not an error
  const remaining = isBids ? 0 : round.cards - sum(current.tricks)
  const forbidden = isBids && hookRule ? forbiddenDealerBid(current.bids, round) : null
  // The dealer's line turns orange while their bid is restricted
  const hintClass = (p) => (p === round.dealer && forbidden !== null ? 'hint hint--warn' : 'hint')

  // One line under each name: the player's role this round, else their total so far
  const noteFor = (p) => {
    const notes = []
    if (p === round.dealer) notes.push('Μοιράζει')
    if (isBids && p === round.firstBidder) notes.push('Δηλώνει πρώτος')
    if (!isBids) notes.push(`δήλωσε ${current.bids[p]}`)
    if (p === round.dealer && forbidden !== null) notes.push(`δεν μπορεί ${forbidden}`)
    return notes.length > 0 ? notes.join(' · ') : `Σύνολο ${totals[p]}`
  }

  return (
    <section className="card">
      <h2 className="card__title">
        {isBids ? 'Δηλώσεις' : 'Μπάζες'}
        <span className="card__meta">{sum(values)} / {round.cards} μπάζες</span>
      </h2>

      <ul className="entries">
        {players.map((name, p) => (
          <li key={p} className="entry">
            <Avatar name={name} index={p} />
            <span className="entry__name">
              {name}
              <span className={hintClass(p)}>{noteFor(p)}</span>
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

      <div className="actions actions--fill">
        {!isBids && (
          <button
            type="button"
            className="button button--secondary"
            onClick={() => dispatch({ type: 'BACK_TO_BIDS' })}
          >
            Πίσω
          </button>
        )}
        <button
          type="button"
          className="button"
          disabled={Boolean(error)}
          onClick={() => dispatch({ type: isBids ? 'CONFIRM_BIDS' : 'FINISH_ROUND' })}
        >
          {isBids ? 'Επιβεβαίωση δηλώσεων' : 'Τέλος γύρου'}
        </button>
      </div>
    </section>
  )
}
