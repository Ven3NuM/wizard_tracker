function Stepper({ value, max, onChange }) {
  return (
    <div className="stepper">
      <button type="button" className="stepper__btn" onClick={() => onChange(value - 1)} disabled={value === 0}>
        −
      </button>
      <span className="stepper__value">{value}</span>
      <button type="button" className="stepper__btn" onClick={() => onChange(value + 1)} disabled={value >= max}>
        +
      </button>
    </div>
  )
}

export default Stepper
