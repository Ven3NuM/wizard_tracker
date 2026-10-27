import { useState } from 'react'
import { PLAYER_COUNTS, replaceAt, validatePlayers } from '../game/rules'
import { LANGUAGES, useTranslation } from '../i18n'

// Keeps names short enough for the scoreboard columns
const MAX_NAME_LENGTH = 20

export default function Setup({ initialSetup, onStart }) {
  const { language, setLanguage, errorMessage, t } = useTranslation()
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
      <fieldset className="setup__group">
        <legend className="label label--center">{t.language}</legend>
        <div className="segmented">
          {Object.entries(LANGUAGES).map(([code, strings]) => (
            <button
              key={code}
              type="button"
              lang={code}
              className="segmented__option"
              aria-pressed={language === code}
              onClick={() => setLanguage(code)}
            >
              {strings.languageName}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="setup__group">
        <legend className="label label--center">{t.playerCount}</legend>
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
              {t.playerName(i + 1)}
              <input
                className="input"
                value={name}
                placeholder={t.playerPlaceholder}
                maxLength={MAX_NAME_LENGTH}
                onChange={(event) => changeName(i, event.target.value)}
              />
            </label>
          </li>
        ))}
      </ol>

      <div className="setup__group">
        <label className="label" htmlFor="first-dealer">
          {t.firstDealer}
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
                {name.trim() || t.playerName(i + 1)}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="button button--secondary"
            onClick={() => setFirstDealer(Math.floor(Math.random() * names.length))}
          >
            {t.drawDealer}
          </button>
        </div>
      </div>

      <label className="setup__group checkbox">
        <input type="checkbox" checked={hookRule} onChange={(event) => setHookRule(event.target.checked)} />
        <span>
          {t.hookRule}
          <small className="hint">{t.hookRuleHelp}</small>
        </span>
      </label>

      {error && <p className="error">{errorMessage(error)}</p>}

      <div className="actions">
        <button type="submit" className="button">
          {t.startGame}
        </button>
      </div>
    </form>
  )
}
