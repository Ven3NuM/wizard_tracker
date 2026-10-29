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

export function StarIcon() {
  return (
    <Icon strokeWidth={2.2}>
      <path d="M12 3l2.2 5.3L20 9l-4.4 3.8L17 18.5 12 15.6 7 18.5l1.4-5.7L4 9l5.8-.7z" />
    </Icon>
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
