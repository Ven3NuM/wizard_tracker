import { useEffect, useRef, useState } from 'react'
import { bidsError, replaceAt, tricksError } from '../game/rules'
import Stepper from './Stepper'

const errorMessages = {
  hook: ({ forbidden }) => `Κανόνας hook: ο dealer δεν μπορεί να δηλώσει ${forbidden}.`,
  tricksSum: ({ total, cards }) => `Οι μπάζες είναι ${total}, πρέπει να είναι ${cards}.`,
}

const sameValues = (a, b) => a.every((value, i) => value === b[i])

// Bottom sheet to fix a finished round. The native <dialog> handles focus, Escape and the backdrop.
export default function EditRoundDialog({ players, round, values, hookRule, onSave, onClose }) {
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
    if (!isDirty || window.confirm('Να απορριφθούν οι αλλαγές;')) onClose()
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
          Διόρθωση γύρου {round.index + 1}
          <span className="card__meta">{round.cards} {round.cards === 1 ? 'φύλλο' : 'φύλλα'}</span>
        </h2>

        <ul className="entries">
          <li className="entry entry--edit entry--head" aria-hidden="true">
            <span />
            <span>Δήλωση</span>
            <span>Μπάζες</span>
          </li>
          {players.map((name, p) => (
            <li key={p} className="entry entry--edit">
              <span className="entry__name">{name}</span>
              <Stepper
                label={`${name}, Δήλωση`}
                value={bids[p]}
                max={round.cards}
                onChange={(value) => setBids(replaceAt(bids, p, value))}
              />
              <Stepper
                label={`${name}, Μπάζες`}
                value={tricks[p]}
                max={round.cards}
                onChange={(value) => setTricks(replaceAt(tricks, p, value))}
              />
            </li>
          ))}
        </ul>

        {error && <p className="error">{errorMessages[error.type](error)}</p>}

        <div className="actions">
          <button type="button" className="button button--secondary" onClick={requestClose}>
            Άκυρο
          </button>
          <button
            type="button"
            className="button"
            disabled={Boolean(error)}
            onClick={() => onSave({ bids, tricks })}
          >
            Αποθήκευση
          </button>
        </div>
      </div>
    </dialog>
  )
}
