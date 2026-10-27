import { useState } from 'react'
import { PLAYER_COUNTS, replaceAt, validatePlayers } from './rules'

// Keeps names short enough for the scoreboard columns
const MAX_NAME_LENGTH = 20

const errorMessages = {
  missingName: 'Κάθε παίκτης χρειάζεται όνομα.',
  duplicateName: 'Τα ονόματα πρέπει να είναι διαφορετικά.',
}

export default function Setup() {
  const [names, setNames] = useState(['', '', ''])
  const [firstDealer, setFirstDealer] = useState(0)
  const [hookRule, setHookRule] = useState(false)
  const [error, setError] = useState(null)
  const [started, setStarted] = useState(null) // the setup we'd start with, lesson 6 starts a real game

  const changeCount = (count) => {
    setNames(Array.from({ length: count }, (_, i) => names[i] ?? ''))
    if (firstDealer >= count) setFirstDealer(0)
    setError(null)
  }

  const changeName = (index, name) => {
    setNames(replaceAt(names, index, name))
    setError(null)
  }

  const handleSubmit = (event) => {
    event.preventDefault() // a form submit would reload the page
    const players = names.map((name) => name.trim())
    const validation = validatePlayers(players)
    if (validation) {
      setError(validation)
      return
    }
    setStarted({ players, hookRule, firstDealer })
  }

  return (
    <form className="setup" onSubmit={handleSubmit} noValidate>
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
                maxLength={MAX_NAME_LENGTH}
                onChange={(event) => changeName(i, event.target.value)}
              />
            </label>
          </li>
        ))}
      </ol>

      <div className="setup__group">
        <label className="label" htmlFor="first-dealer">
          Πρώτος dealer
        </label>
        <div className="setup__dealer">
          <select
            id="first-dealer"
            className="input"
            value={firstDealer}
            onChange={(event) => setFirstDealer(Number(event.target.value))}
          >
            {names.map((name, i) => (
              <option key={i} value={i}>
                {name.trim() || `Παίκτης ${i + 1}`}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="button button--secondary"
            onClick={() => setFirstDealer(Math.floor(Math.random() * names.length))}
          >
            Κλήρωση
          </button>
        </div>
      </div>

      <label className="setup__group checkbox">
        <input type="checkbox" checked={hookRule} onChange={(event) => setHookRule(event.target.checked)} />
        <span>
          Κανόνας hook
          <small className="hint">Οι δηλώσεις δεν μπορούν να είναι ίσες με τα φύλλα, ο dealer δηλώνει τελευταίος.</small>
        </span>
      </label>

      {error && <p className="error">{errorMessages[error.type]}</p>}

      {started && (
        <p className="hint hint--center">
          Έτοιμοι: {started.players.join(', ')}. Πρώτος dealer: {started.players[started.firstDealer]}.
        </p>
      )}

      <div className="actions">
        <button type="submit" className="button">
          Έναρξη
        </button>
      </div>
    </form>
  )
}
