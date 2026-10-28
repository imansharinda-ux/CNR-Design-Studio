import { describe, expect, it } from 'vitest'
import { estimate, formatRs, formatShort } from './estimate.js'

const base = { type: 'new', area: 2000, storeys: 2, finish: 'pre', location: 'hil', extras: [] }

describe('estimate', () => {
  it('works out the default home', () => {
    const r = estimate(base)
    expect(Math.round(r.total)).toBe(Math.round(2000 * 19000 * 1.04 * 1.06))
    expect(r.low).toBeCloseTo(r.total * 0.9)
    expect(r.high).toBeCloseTo(r.total * 1.12)
    expect(r.feePercent).toBe(5)
  })

  it('makes a renovation cheaper than a new build', () => {
    expect(estimate({ ...base, type: 'ren' }).total).toBeLessThan(estimate(base).total)
  })

  it('adds the pool and solar extras', () => {
    const plain = estimate(base).total
    const withExtras = estimate({ ...base, extras: ['pool', 'solar'] }).total
    expect(withExtras - plain).toBe(4500000 + 1200000)
  })

  it('keeps the breakdown at 100 percent', () => {
    const r = estimate({ ...base, extras: ['pool', 'int'] })
    const sum = r.breakdown.reduce((s, [, share]) => s + share, 0)
    expect(sum).toBeCloseTo(1)
    expect(r.breakdown.at(-1)[0]).toBe('Selected extras')
  })

  it('gives a longer build time for bigger homes', () => {
    expect(estimate({ ...base, area: 5000 }).months).toBeGreaterThan(estimate(base).months)
  })
})

describe('formatting', () => {
  it('shows rupees with separators', () => {
    expect(formatRs(1234567.4)).toBe('Rs. 1,234,567')
  })

  it('shortens millions', () => {
    expect(formatShort(41900000)).toBe('Rs. 41.9 million')
    expect(formatShort(3000000)).toBe('Rs. 3 million')
    expect(formatShort(950000)).toBe('Rs. 950,000')
  })
})
