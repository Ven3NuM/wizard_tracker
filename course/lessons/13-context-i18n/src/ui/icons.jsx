// Small stroke icons; they take the text color and are hidden from screen readers

function Icon({ children, size = 20, strokeWidth = 2 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

// The app icon (two cards, the front one with a W) for the header. Unlike the stroke icons it has its own colors.
export function LogoIcon() {
  return (
    <svg viewBox="96 106 312 312" aria-hidden="true">
      <rect
        x="-92"
        y="-128"
        width="184"
        height="256"
        rx="26"
        transform="translate(222 268) rotate(-13)"
        style={{ fill: 'var(--color-raised)' }}
      />
      <g transform="translate(290 250) rotate(9)">
        <rect x="-92" y="-128" width="184" height="256" rx="26" style={{ fill: 'var(--color-accent)' }} />
        <path
          d="M-54-50L-28 54 0-16 28 54 54-50"
          fill="none"
          strokeWidth="28"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ stroke: 'var(--color-bg)' }}
        />
      </g>
    </svg>
  )
}

export function DiceIcon() {
  return (
    <Icon size={18}>
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <circle cx="8.5" cy="8.5" r="1.2" fill="currentColor" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" />
      <circle cx="15.5" cy="15.5" r="1.2" fill="currentColor" />
    </Icon>
  )
}

export function ArrowIcon() {
  return (
    <Icon strokeWidth={2.4}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </Icon>
  )
}

export function MoreIcon() {
  return (
    <Icon>
      <circle cx="5" cy="12" r="1.2" />
      <circle cx="12" cy="12" r="1.2" />
      <circle cx="19" cy="12" r="1.2" />
    </Icon>
  )
}
