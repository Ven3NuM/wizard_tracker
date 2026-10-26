import { t } from '../i18n'

function Stepper({ label, value, max, onChange }) {
  return (
    <div className="stepper" role="group" aria-label={label}>
      <button
        type="button"
        className="stepper__btn"
        aria-label={t.decrease(label)}
        onClick={() => onChange(value - 1)}
        disabled={value === 0}
      >
        −
      </button>
      <span className="stepper__value" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className="stepper__btn"
        aria-label={t.increase(label)}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
      >
        +
      </button>
    </div>
  )
}

export default Stepper
