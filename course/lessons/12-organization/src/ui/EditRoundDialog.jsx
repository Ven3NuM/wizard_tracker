import { useEffect, useRef, useState } from 'react'
import { bidsError, replaceAt, tricksError } from '../game/rules'
import { useTranslation } from '../i18n'
import Stepper from './Stepper'

const sameValues = (a, b) => a.every((value, i) => value === b[i])

// Bottom sheet to fix a finished round. The native <dialog> handles focus, Escape and the backdrop.
export default function EditRoundDialog({ players, round, values, hookRule, onSave, onClose }) {
  const { errorMessage, t } = useTranslation()
  const dialogRef = useRef(null)
  const [bids, setBids] = useState(values.bids)
  const [tricks, setTricks] = useState(values.tricks)
  const error = bidsError(bids, round, hookRule) ?? tricksError(tricks, round)
  const isDirty = !sameValues(bids, values.bids) || !sameValues(tricks, values.tricks)

  useEffect(() => {
    dialogRef.current.showModal()
  }, [])

  // Closing by accident (backdrop tap, Escape) must not lose edits silently
  const requestClose = () => {
    if (!isDirty || window.confirm(t.discardChanges)) onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      className="sheet"
      aria-labelledby="edit-round-title"
      onCancel={(event) => {
        event.preventDefault()
        requestClose()
      }}
      onClick={(event) => {
        // Only the backdrop is the dialog itself, the content sits in .sheet__body
        if (event.target === event.currentTarget) requestClose()
      }}
    >
      <div className="sheet__body">
        <h2 id="edit-round-title" className="card__title">
          {t.editRound(round.index + 1)}
          <span className="card__meta">{t.cards(round.cards)}</span>
        </h2>

        <ul className="entries">
          <li className="entry entry--edit entry--head" aria-hidden="true">
            <span />
            <span>{t.bid}</span>
            <span>{t.tricks}</span>
          </li>
          {players.map((name, p) => (
            <li key={p} className="entry entry--edit">
              <span className="entry__name">{name}</span>
              <Stepper
                label={`${name}, ${t.bid}`}
                value={bids[p]}
                max={round.cards}
                onChange={(value) => setBids(replaceAt(bids, p, value))}
              />
              <Stepper
                label={`${name}, ${t.tricks}`}
                value={tricks[p]}
                max={round.cards}
                onChange={(value) => setTricks(replaceAt(tricks, p, value))}
              />
            </li>
          ))}
        </ul>

        {error && <p className="error">{errorMessage(error)}</p>}

        <div className="actions">
          <button type="button" className="button button--secondary" onClick={requestClose}>
            {t.cancel}
          </button>
          <button
            type="button"
            className="button"
            disabled={Boolean(error)}
            onClick={() => onSave({ bids, tricks })}
          >
            {t.save}
          </button>
        </div>
      </div>
    </dialog>
  )
}
