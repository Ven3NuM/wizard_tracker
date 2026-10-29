import { bidsError, forbiddenDealerBid, sum, tricksError } from '../game/rules'
import { useTranslation } from '../i18n'
import Avatar from './Avatar'
import Stepper from './Stepper'

// The current round: everyone bids, then everyone enters the tricks they took
export default function RoundEntry({ players, totals, round, current, hookRule, dispatch }) {
  const { errorMessage, t } = useTranslation()
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
    if (p === round.dealer) notes.push(t.dealer)
    if (isBids && p === round.firstBidder) notes.push(t.firstBidder)
    if (!isBids) notes.push(t.bidHint(current.bids[p]))
    if (p === round.dealer && forbidden !== null) notes.push(t.forbiddenHint(forbidden))
    return notes.length > 0 ? notes.join(' · ') : t.totalHint(totals[p])
  }

  return (
    <section className="card">
      <h2 className="card__title">
        {isBids ? t.bids : t.tricks}
        <span className="card__meta">{t.tricksCount(sum(values), round.cards)}</span>
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
              label={`${name}, ${isBids ? t.bid : t.tricks}`}
              value={values[p]}
              max={round.cards}
              onChange={(value) => dispatch({ type: 'SET_VALUE', player: p, value })}
            />
          </li>
        ))}
      </ul>

      {remaining > 0 ? (
        <p className="hint hint--center">{t.tricksRemaining(remaining)}</p>
      ) : (
        error && <p className="error">{errorMessage(error)}</p>
      )}

      <div className="actions actions--fill">
        {!isBids && (
          <button
            type="button"
            className="button button--secondary"
            onClick={() => dispatch({ type: 'BACK_TO_BIDS' })}
          >
            {t.back}
          </button>
        )}
        <button
          type="button"
          className="button"
          disabled={Boolean(error)}
          onClick={() => dispatch({ type: isBids ? 'CONFIRM_BIDS' : 'FINISH_ROUND' })}
        >
          {isBids ? t.confirmBids : t.finishRound}
        </button>
      </div>
    </section>
  )
}
