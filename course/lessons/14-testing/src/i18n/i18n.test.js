import { describe, expect, it } from 'vitest'
import { LANGUAGES } from '.'

// All keys as paths, e.g. 'errors.hook'
const keys = (strings, prefix = '') =>
  Object.entries(strings).flatMap(([key, value]) =>
    typeof value === 'object' ? keys(value, `${prefix}${key}.`) : [`${prefix}${key}`]
  )

describe('languages', () => {
  it('all have the same keys as Greek', () => {
    const greek = keys(LANGUAGES.el).sort()
    for (const strings of Object.values(LANGUAGES)) {
      expect(keys(strings).sort()).toEqual(greek)
    }
  })
})
