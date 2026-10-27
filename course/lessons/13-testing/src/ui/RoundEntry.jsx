import { bidsError, forbiddenDealerBid, sum, tricksError } from '../game/rules'
import { useTranslation } from '../i18n'
import Stepper from './Stepper'

// The current round: everyone bids, then everyone enters the tricks they took
export default function RoundEntry({ players, round, current, hookRule, dispatch }) {
  const { errorMessage, t } = useTranslation()
  const isBids = current.phase === 'bids'
  const values = isBids ? current.bids : current.tricks
  const error = isBids ? bidsError(current.bids, round, hookRule) : tricksError(current.tricks, round)
  // Fewer tricks than cards only means they aren't all entered yet, that's not an error
  const remaining = !isBids && error ? round.cards - error.total : 0
  const forbidden = isBids && hookRule ? forbiddenDealerBid(current.bids, round) : null

  return (
    <section className="card">
      <h2 className="card__title">
        {isBids ? t.bids : t.tricks}
        <span className="card__meta">
          {sum(values)} / {round.cards}
        </span>
      </h2>

      <ul className="entries">
        {players.map((name, p) => (
          <li key={p} className="entry">
            <span className="entry__name">
              {name}
              {p === round.dealer && <span className="badge">{t.dealer}</span>}
              {isBids && p === round.firstBidder && <span className="badge badge--outline">{t.firstBidder}</span>}
              {!isBids && <span className="hint">{t.bidHint(current.bids[p])}</span>}
              {p === round.dealer && forbidden !== null && <span className="hint">{t.forbiddenHint(forbidden)}</span>}
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

      <div className="actions">
        {!isBids && (
          <button type="button" className="button button--secondary" onClick={() => dispatch({ type: 'BACK_TO_BIDS' })}>
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
