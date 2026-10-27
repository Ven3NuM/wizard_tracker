// Receives the game from App and reports "new game" back up through a callback
export default function GameScreen({ game, onNewGame }) {
  const { players, hookRule, firstDealer } = game

  const handleNewGame = () => {
    if (window.confirm('Νέο παιχνίδι; Το τρέχον σκορ θα χαθεί.')) onNewGame()
  }

  return (
    <>
      <section className="card">
        <h2 className="card__title">
          Παίκτες
          <span className="card__meta">{hookRule ? 'με κανόνα hook' : 'χωρίς κανόνα hook'}</span>
        </h2>
        <ul className="entries">
          {players.map((name, p) => (
            <li key={p} className="entry">
              <span className="entry__name">
                {name}
                {p === firstDealer && <span className="badge">Dealer</span>}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <div className="actions actions--center">
        <button type="button" className="button button--secondary" onClick={handleNewGame}>
          Νέο παιχνίδι
        </button>
      </div>
    </>
  )
}
