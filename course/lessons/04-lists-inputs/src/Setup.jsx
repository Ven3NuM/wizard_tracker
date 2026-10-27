import { useState } from 'react'

const PLAYER_COUNTS = [3, 4, 5, 6]

// A copy of `values` with one item replaced, the original array stays untouched
const replaceAt = (values, index, value) => values.map((current, i) => (i === index ? value : current))

export default function Setup() {
  // The names decide the player count: names.length. No separate playerCount state to keep in sync.
  const [names, setNames] = useState(['', '', ''])
  const [hookRule, setHookRule] = useState(false)

  const changeCount = (count) => {
    // Keep the names already typed, pad or trim to the new count
    setNames(Array.from({ length: count }, (_, i) => names[i] ?? ''))
  }

  const changeName = (index, name) => {
    setNames(replaceAt(names, index, name))
  }

  return (
    <form className="setup">
      <fieldset className="setup__group">
        <legend className="label label--center">Αριθμός παικτών</legend>
        <div className="segmented">
          {PLAYER_COUNTS.map((count) => (
            <button
              key={count}
              type="button"
              className="segmented__option"
              aria-pressed={names.length === count}
              onClick={() => changeCount(count)}
            >
              {count}
            </button>
          ))}
        </div>
      </fieldset>

      <ol className="setup__names">
        {names.map((name, i) => (
          <li key={i}>
            <label className="label">
              Παίκτης {i + 1}
              <input
                className="input"
                value={name}
                placeholder="Όνομα παίκτη"
                onChange={(event) => changeName(i, event.target.value)}
              />
            </label>
          </li>
        ))}
      </ol>

      <label className="setup__group checkbox">
        <input type="checkbox" checked={hookRule} onChange={(event) => setHookRule(event.target.checked)} />
        <span>
          Κανόνας hook
          <small className="hint">Οι δηλώσεις δεν μπορούν να είναι ίσες με τα φύλλα, ο dealer δηλώνει τελευταίος.</small>
        </span>
      </label>

      <div className="actions">
        <button type="button" className="button">
          Έναρξη
        </button>
      </div>
    </form>
  )
}
