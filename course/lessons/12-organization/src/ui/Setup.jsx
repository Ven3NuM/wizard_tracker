import { useState } from 'react'
import { PLAYER_COUNTS, replaceAt, totalRounds, validatePlayers } from '../game/rules'
import Avatar from './Avatar'
import { ArrowIcon, DiceIcon } from './icons'

const errorMessages = {
  missingName: () => 'Κάθε παίκτης χρειάζεται όνομα.',
  duplicateName: () => 'Τα ονόματα πρέπει να είναι διαφορετικά.',
}

// Keeps names short enough for the scoreboard columns
const MAX_NAME_LENGTH = 20

export default function Setup({ initialSetup, onStart }) {
  const [names, setNames] = useState(initialSetup?.players ?? ['', '', ''])
  const [firstDealer, setFirstDealer] = useState(initialSetup?.firstDealer ?? 0)
  const [hookRule, setHookRule] = useState(initialSetup?.hookRule ?? false)
  const [error, setError] = useState(null)

  const changeCount = (count) => {
    // Keep the names already typed, pad or trim to the new count
    setNames(Array.from({ length: count }, (_, i) => names[i] ?? ''))
    if (firstDealer >= count) setFirstDealer(0)
    setError(null)
  }

  const changeName = (index, name) => {
    setNames(replaceAt(names, index, name))
    setError(null)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const players = names.map((name) => name.trim())
    const validation = validatePlayers(players)
    if (validation) {
      setError(validation)
      return
    }
    onStart({ players, hookRule, firstDealer })
  }

  return (
    <form className="setup" onSubmit={handleSubmit} noValidate>
      <h2 className="setup__title">Νέο παιχνίδι</h2>
      <p className="setup__subtitle">Ποιοι παίζουν απόψε;</p>

      <fieldset className="setup__group">
        <legend className="label label--caps">Παίκτες</legend>
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
          <li key={i} className="setup__player">
            {/* Tapping a player's avatar makes them the first dealer */}
            <button
              type="button"
              className="setup__pick"
              aria-label={`${name.trim() || `Παίκτης ${i + 1}`} μοιράζει πρώτος`}
              aria-pressed={i === firstDealer}
              onClick={() => setFirstDealer(i)}
            >
              <Avatar name={name} index={i} />
            </button>
            <label className="label">
              <span className="visually-hidden">Παίκτης {i + 1}</span>
              <input
                className="input"
                value={name}
                placeholder={`Παίκτης ${i + 1}`}
                maxLength={MAX_NAME_LENGTH}
                onChange={(event) => changeName(i, event.target.value)}
              />
            </label>
            {i === firstDealer && <span className="badge">Μοιράζει</span>}
          </li>
        ))}
      </ol>

      <button
        type="button"
        className="button button--secondary button--block setup__group"
        onClick={() => setFirstDealer(Math.floor(Math.random() * names.length))}
      >
        <DiceIcon />
        Κλήρωση dealer
      </button>

      <label className="setup__group checkbox">
        <input
          type="checkbox"
          role="switch"
          checked={hookRule}
          onChange={(event) => setHookRule(event.target.checked)}
        />
        <span>
          Κανόνας hook
          <small className="hint">Οι δηλώσεις δεν βγαίνουν ίσες με τα φύλλα</small>
        </span>
      </label>

      {error && <p className="error">{errorMessages[error.type](error)}</p>}

      <div className="actions">
        <button type="submit" className="button button--block">
          Έναρξη · {totalRounds(names.length)} γύροι
          <ArrowIcon />
        </button>
      </div>
    </form>
  )
}
