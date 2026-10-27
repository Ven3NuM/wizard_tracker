// Wizard rules as pure functions: no React, easy to reuse and test.

export const PLAYER_COUNTS = [3, 4, 5, 6]

export const replaceAt = (values, index, value) =>
  values.map((current, i) => (i === index ? value : current))

// Returns null when valid, otherwise { type } describing the problem
export const validatePlayers = (names) => {
  if (names.some((name) => name === '')) return { type: 'missingName' }
  const lower = names.map((name) => name.toLowerCase())
  if (new Set(lower).size !== lower.length) return { type: 'duplicateName' }
  return null
}
