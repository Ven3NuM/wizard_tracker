import { useState } from 'react'
import NumberOfPlayers from './NumberOfPlayers'
import InitPlayersList from './InitPlayersList'
import { errorMessage, t } from '../i18n'

function validatePlayers(names) {
  if (names.some((name) => name === '')) {
    return { type: 'missingName' }
  }
  const lower = names.map((name) => name.toLowerCase())
  if (new Set(lower).size !== lower.length) {
    return { type: 'duplicateName' }
  }
  return null
}

function Settings({ initialSetup, onStart }) {
  const initialPlayers = initialSetup?.players ?? Array(3).fill('')
  const [numOfPlayers, setNumOfPlayers] = useState(initialPlayers.length)
  const [players, setPlayers] = useState(initialPlayers)
  const [hookRule, setHookRule] = useState(initialSetup?.hookRule ?? false)
  const [error, setError] = useState(null)

  const handlePlayerCountChange = (count) => {
    setNumOfPlayers(count)
    // Keep already typed names, pad or trim to the new count
    setPlayers((prev) =>
      Array.from({ length: count }, (_, i) => prev[i] ?? '')
    )
    setError(null)
  }

  const handlePlayerNameChange = (index, name) => {
    setPlayers((prev) => prev.map((p, i) => (i === index ? name : p)))
    setError(null)
  }

  const handleStart = () => {
    const names = players.map((name) => name.trim())
    const validationError = validatePlayers(names)
    if (validationError) {
      setError(validationError)
      return
    }
    onStart(names, hookRule)
  }

  return (
    <div className="settings">
      <NumberOfPlayers
        numOfPlayers={numOfPlayers}
        onPlayerCountChange={handlePlayerCountChange}
      />
      <InitPlayersList
        players={players}
        onPlayerNameChange={handlePlayerNameChange}
      />
      <label className="settings__option">
        <input type="checkbox" checked={hookRule} onChange={(e) => setHookRule(e.target.checked)} />
        <span>
          {t.hookRule}
          <small>{t.hookRuleHelp}</small>
        </span>
      </label>
      {error && <p className="settings__error">{errorMessage(error)}</p>}
      <div className="wrapper__buttons">
        <button type="button" id="start" onClick={handleStart}>
          {t.startGame}
        </button>
      </div>
    </div>
  )
}

export default Settings
