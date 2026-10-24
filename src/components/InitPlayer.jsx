import { t } from '../i18n'

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
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    </li>
  )
}

export default InitPlayer
