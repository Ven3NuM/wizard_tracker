import { t } from '../i18n'

function NumberOfPlayers({ numOfPlayers, onPlayerCountChange }) {
  return (
    <div className="wrapper__players">
      <label>{t.numberOfPlayers}</label>
      <div className="btn-group">
        {[3, 4, 5, 6].map((count) => (
          <button
            key={count}
            onClick={() => onPlayerCountChange(count)}
            className={`btn ${numOfPlayers === count ? 'active' : ''}`}
          >
            {count}
          </button>
        ))}
      </div>
    </div>
  )
}

export default NumberOfPlayers
