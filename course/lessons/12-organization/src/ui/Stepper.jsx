import { useTranslation } from '../i18n'

// − value + control for a number between 0 and max
export default function Stepper({ label, value, max, onChange }) {
  const { t } = useTranslation()

  return (
    <div className="stepper" role="group" aria-label={label}>
      <button
        type="button"
        className="stepper__button"
        aria-label={t.decrease(label)}
        disabled={value === 0}
        onClick={() => onChange(value - 1)}
      >
        −
      </button>
      <span className="stepper__value" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className="stepper__button"
        aria-label={t.increase(label)}
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      >
        +
      </button>
    </div>
  )
}
