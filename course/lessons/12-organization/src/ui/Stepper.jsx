
// − value + control for a number between 0 and max
export default function Stepper({ label, value, max, onChange }) {

  return (
    <div className="stepper" role="group" aria-label={label}>
      <button
        type="button"
        className="stepper__button"
        aria-label={`${label}: μείωση`}
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
        aria-label={`${label}: αύξηση`}
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      >
        +
      </button>
    </div>
  )
}
