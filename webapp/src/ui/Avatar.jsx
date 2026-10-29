// A player's initial on their seat color (--player-1 … --player-6 in index.css)
export default function Avatar({ name, index }) {
  return (
    <span className="avatar" style={{ '--avatar': `var(--player-${index + 1})` }} aria-hidden="true">
      {name.trim().charAt(0).toUpperCase() || index + 1}
    </span>
  )
}
