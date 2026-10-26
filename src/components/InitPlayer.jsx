import { t } from '../i18n'

// Keeps names short enough for the scoreboard columns
const MAX_NAME_LENGTH = 20

function InitPlayer({ playerNumber, playerName, onChange }) {
  return (
    <li className="playerName" id={`player${playerNumber}`}>
      <label className="playerName__label">
        {t.playerLabel(playerNumber)}
        <input
          type="text"
          name={`player${playerNumber}`}
          placeholder={t.playerPlaceholder}
          className="playerName__input"
          value={playerName}
          maxLength={MAX_NAME_LENGTH}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    </li>
  )
}

export default InitPlayer
