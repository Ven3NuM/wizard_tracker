import { useState } from 'react'
import Stepper from './Stepper'
import { bidsError, cardsForRound, tricksError } from '../utils/scoring'
import { errorMessage, t } from '../i18n'

function EditRound({ players, roundIndex, round, hookRule, onSave, onCancel }) {
  const [bids, setBids] = useState(round.bids)
  const [tricks, setTricks] = useState(round.tricks)
  const cards = cardsForRound(roundIndex)
  const error = bidsError(bids, roundIndex, hookRule) ?? tricksError(tricks, roundIndex)

  const setAt = (setter) => (index, value) =>
    setter((prev) => prev.map((v, i) => (i === index ? value : v)))

  return (
    <div className="overlay" onClick={onCancel}>
      <div className="overlay__panel" onClick={(e) => e.stopPropagation()}>
        <p className="round__title">
          {t.editRound(roundIndex + 1)}
          <span className="round__total">{t.cards(cards)}</span>
        </p>

        <ul className="round__players">
          <li className="round__player round__player--head">
            <span />
            <span>{t.bidColumn}</span>
            <span>{t.tricksColumn}</span>
          </li>
          {players.map((name, p) => (
            <li key={p} className="round__player round__player--edit">
              <span className="round__name">{name}</span>
              <Stepper value={bids[p]} max={cards} onChange={(v) => setAt(setBids)(p, v)} />
              <Stepper value={tricks[p]} max={cards} onChange={(v) => setAt(setTricks)(p, v)} />
            </li>
          ))}
        </ul>

        {error && <p className="round__error">{errorMessage(error)}</p>}

        <div className="wrapper__buttons">
          <button type="button" className="btn-secondary" onClick={onCancel}>
            {t.cancel}
          </button>
          <button type="button" disabled={Boolean(error)} onClick={() => onSave(bids, tricks)}>
            {t.save}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditRound
