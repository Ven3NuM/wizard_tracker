import { useState } from 'react'
import { PLAYER_COUNTS, replaceAt, totalRounds, validatePlayers } from '../game/rules'
import { useTranslation } from '../i18n'
import Avatar from './Avatar'
import { ArrowIcon, DiceIcon } from './icons'

// Keeps names short enough for the scoreboard columns
const MAX_NAME_LENGTH = 20

export default function Setup({ initialSetup, onStart }) {
  const { errorMessage, t } = useTranslation()
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
      <h2 className="setup__title">{t.newGame}</h2>
      <p className="setup__subtitle">{t.setupSubtitle}</p>

      <fieldset className="setup__group">
        <legend className="label label--caps">{t.playerCount}</legend>
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
              aria-label={t.chooseDealer(name.trim() || t.playerName(i + 1))}
              aria-pressed={i === firstDealer}
              onClick={() => setFirstDealer(i)}
            >
              <Avatar name={name} index={i} />
            </button>
            <label className="label">
              <span className="visually-hidden">{t.playerName(i + 1)}</span>
              <input
                className="input"
                value={name}
                placeholder={t.playerName(i + 1)}
                maxLength={MAX_NAME_LENGTH}
                onChange={(event) => changeName(i, event.target.value)}
              />
            </label>
            {i === firstDealer && <span className="badge">{t.dealer}</span>}
          </li>
        ))}
      </ol>

      <button
        type="button"
        className="button button--secondary button--block setup__group"
        onClick={() => setFirstDealer(Math.floor(Math.random() * names.length))}
      >
        <DiceIcon />
        {t.drawDealer}
      </button>

      <label className="setup__group checkbox">
        <input type="checkbox" role="switch" checked={hookRule} onChange={(event) => setHookRule(event.target.checked)} />
        <span>
          {t.hookRule}
          <small className="hint">{t.hookRuleHelp}</small>
        </span>
      </label>

      {error && <p className="error">{errorMessage(error)}</p>}

      <div className="actions">
        <button type="submit" className="button button--block">
          {t.startGame} · {t.roundsCount(totalRounds(names.length))}
          <ArrowIcon />
        </button>
      </div>
    </form>
  )
}
