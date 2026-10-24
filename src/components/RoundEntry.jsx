import Stepper from './Stepper'
import {
  biddingOrder,
  bidsError,
  cardsForRound,
  dealerForRound,
  forbiddenDealerBid,
  sum,
  tricksError,
} from '../utils/scoring'
import { errorMessage, t } from '../i18n'

function RoundEntry({ players, roundIndex, current, hookRule, dispatch }) {
  const cards = cardsForRound(roundIndex)
  const dealer = dealerForRound(roundIndex, players.length)
  const firstBidder = biddingOrder(roundIndex, players.length)[0]
  const isBids = current.phase === 'bids'

  const values = isBids ? current.bids : current.tricks
  const error = isBids ? bidsError(current.bids, roundIndex, hookRule) : tricksError(current.tricks, roundIndex)
  // Fewer tricks than cards just means they're not all entered yet
  const remaining = error?.type === 'tricksSum' && error.total < cards ? cards - error.total : 0
  const forbidden = isBids && hookRule ? forbiddenDealerBid(current.bids, roundIndex) : null

  const handleChange = (player, value) =>
    dispatch({ type: isBids ? 'SET_BID' : 'SET_TRICKS', player, value })

  return (
    <div className="round">
      <p className="round__title">
        {isBids ? t.bidsTitle : t.tricksTitle}
        <span className="round__total">
          {sum(values)} / {cards}
        </span>
      </p>

      <ul className="round__players">
        {players.map((name, p) => (
          <li key={p} className="round__player">
            <span className="round__name">
              {name}
              {p === dealer && <span className="badge">{t.dealerBadge}</span>}
              {isBids && p === firstBidder && <span className="badge badge--outline">{t.firstBidderBadge}</span>}
              {!isBids && <span className="round__hint">{t.bidHint(current.bids[p])}</span>}
              {p === dealer && forbidden !== null && <span className="round__hint">{t.forbiddenHint(forbidden)}</span>}
            </span>
            <Stepper value={values[p]} max={cards} onChange={(value) => handleChange(p, value)} />
          </li>
        ))}
      </ul>

      {remaining > 0 ? (
        <p className="round__remaining">{t.tricksRemaining(remaining)}</p>
      ) : (
        error && <p className="round__error">{errorMessage(error)}</p>
      )}

      <div className="wrapper__buttons">
        {!isBids && (
          <button type="button" className="btn-secondary" onClick={() => dispatch({ type: 'BACK_TO_BIDS' })}>
            {t.back}
          </button>
        )}
        <button
          type="button"
          disabled={Boolean(error)}
          onClick={() => dispatch({ type: isBids ? 'CONFIRM_BIDS' : 'FINISH_ROUND' })}
        >
          {isBids ? t.confirmBids : t.finishRound}
        </button>
      </div>
    </div>
  )
}

export default RoundEntry
