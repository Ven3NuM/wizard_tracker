import { useState } from 'react'

export default function Setup() {
  // State: values that change while the app runs. Changing them redraws the component.
  const [playerCount, setPlayerCount] = useState(3)
  const [hookRule, setHookRule] = useState(false)

  return (
    <form className="setup">
      <fieldset className="setup__group">
        <legend className="label label--center">Αριθμός παικτών</legend>
        <div className="segmented">
          <button
            type="button"
            className="segmented__option"
            aria-pressed={playerCount === 3}
            onClick={() => setPlayerCount(3)}
          >
            3
          </button>
          <button
            type="button"
            className="segmented__option"
            aria-pressed={playerCount === 4}
            onClick={() => setPlayerCount(4)}
          >
            4
          </button>
          <button
            type="button"
            className="segmented__option"
            aria-pressed={playerCount === 5}
            onClick={() => setPlayerCount(5)}
          >
            5
          </button>
          <button
            type="button"
            className="segmented__option"
            aria-pressed={playerCount === 6}
            onClick={() => setPlayerCount(6)}
          >
            6
          </button>
        </div>
      </fieldset>

      {/* Still three fixed fields, lesson 4 makes them follow playerCount */}
      <ol className="setup__names">
        <li>
          <label className="label">
            Παίκτης 1
            <input className="input" placeholder="Όνομα παίκτη" />
          </label>
        </li>
        <li>
          <label className="label">
            Παίκτης 2
            <input className="input" placeholder="Όνομα παίκτη" />
          </label>
        </li>
        <li>
          <label className="label">
            Παίκτης 3
            <input className="input" placeholder="Όνομα παίκτη" />
          </label>
        </li>
      </ol>

      <label className="setup__group checkbox">
        <input type="checkbox" checked={hookRule} onChange={(event) => setHookRule(event.target.checked)} />
        <span>
          Κανόνας hook
          <small className="hint">Οι δηλώσεις δεν μπορούν να είναι ίσες με τα φύλλα, ο dealer δηλώνει τελευταίος.</small>
        </span>
      </label>

      <p className="hint hint--center">
        {playerCount} παίκτες, {hookRule ? 'με' : 'χωρίς'} κανόνα hook
      </p>

      <div className="actions">
        <button type="button" className="button">
          Έναρξη
        </button>
      </div>
    </form>
  )
}
