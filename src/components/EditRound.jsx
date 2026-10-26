import { useEffect, useRef, useState } from 'react'
import Stepper from './Stepper'
import { bidsError, cardsForRound, tricksError } from '../utils/scoring'
import { errorMessage, t } from '../i18n'

const sameValues = (a, b) => a.every((v, i) => v === b[i])

function EditRound({ players, roundIndex, round, hookRule, firstDealer, onSave, onCancel }) {
  const [bids, setBids] = useState(round.bids)
  const [tricks, setTricks] = useState(round.tricks)
  const panelRef = useRef(null)
  const cards = cardsForRound(roundIndex)
  const error = bidsError(bids, roundIndex, hookRule, firstDealer) ?? tricksError(tricks, roundIndex)
  const isDirty = !sameValues(bids, round.bids) || !sameValues(tricks, round.tricks)

  const setAt = (setter) => (index, value) =>
    setter((prev) => prev.map((v, i) => (i === index ? value : v)))

  // Closing by accident (backdrop tap, Escape) must not lose edits silently
  const handleClose = () => {
    if (!isDirty || window.confirm(t.discardChanges)) onCancel()
  }

  // Ref so the listener always sees the latest edits without re-subscribing
  const closeRef = useRef(handleClose)
  closeRef.current = handleClose

  useEffect(() => {
    panelRef.current.focus()
    const handleKey = (e) => {
      if (e.key === 'Escape') closeRef.current()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  return (
    <div className="overlay" onClick={handleClose}>
      <div
        ref={panelRef}
        className="overlay__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-round-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <p id="edit-round-title" className="round__title">
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
              <Stepper
                label={`${name}, ${t.bidColumn}`}
                value={bids[p]}
                max={cards}
                onChange={(v) => setAt(setBids)(p, v)}
              />
              <Stepper
                label={`${name}, ${t.tricksColumn}`}
                value={tricks[p]}
                max={cards}
                onChange={(v) => setAt(setTricks)(p, v)}
              />
            </li>
          ))}
        </ul>

        {error && <p className="round__error">{errorMessage(error)}</p>}

        <div className="wrapper__buttons">
          <button type="button" className="btn-secondary" onClick={handleClose}>
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
