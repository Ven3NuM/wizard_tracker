// The setup screen, static for now: nothing reacts to clicks yet (lesson 3)
export default function Setup() {
  return (
    <form className="setup">
      <fieldset className="setup__group">
        <legend className="label label--center">Αριθμός παικτών</legend>
        <div className="segmented">
          <button type="button" className="segmented__option" aria-pressed="true">
            3
          </button>
          <button type="button" className="segmented__option">
            4
          </button>
          <button type="button" className="segmented__option">
            5
          </button>
          <button type="button" className="segmented__option">
            6
          </button>
        </div>
      </fieldset>

      <ol className="setup__names">
        <li>
          <label className="label">
            Παίκτης 1
            <input className="input" placeholder="Όνομα παίκτη" />
          </label>
        </li>
        <li>
          <label className="label">
            Παίκτης 2
            <input className="input" placeholder="Όνομα παίκτη" />
          </label>
        </li>
        <li>
          <label className="label">
            Παίκτης 3
            <input className="input" placeholder="Όνομα παίκτη" />
          </label>
        </li>
      </ol>

      <label className="setup__group checkbox">
        <input type="checkbox" />
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
