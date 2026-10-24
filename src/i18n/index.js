import el from './el'

export const t = el

// Validation returns { type, ...data }, this turns it into a message
export const errorMessage = (error) => (error ? t.errors[error.type](error) : null)
