export const RATE = { std: 15000, pre: 19000, lux: 25000 }
export const TYPE = { new: 1, ext: 0.85, ren: 0.6 }
export const STOREYS = { 1: 1, 2: 1.04, 3: 1.09 }
export const LOCATION = { col: 1.08, sou: 1, hil: 1.06, oth: 0.96 }
export const EXTRA = { pool: 4500000, solar: 1200000 }

const PARTS = [
  ['Structure and roof', 0.42],
  ['Finishes and joinery', 0.26],
  ['Electrical and plumbing', 0.16],
  ['External works', 0.08],
]

export function estimate({ type, area, storeys, finish, location, extras }) {
  const base = area * RATE[finish] * TYPE[type] * STOREYS[storeys] * LOCATION[location]
  let added = 0
  if (extras.includes('pool')) added += EXTRA.pool
  if (extras.includes('solar')) added += EXTRA.solar
  if (extras.includes('land')) added += base * 0.05
  if (extras.includes('int')) added += base * 0.12
  const total = base + added

  const feeRate = finish === 'lux' ? 0.06 : finish === 'pre' ? 0.05 : 0.04
  const months = Math.round((type === 'ren' ? 4 : 6) + area / 600 + (storeys - 1) * 2)

  const extraShare = added / total
  const rest = 1 - extraShare
  const sum = PARTS.reduce((s, [, p]) => s + p, 0)
  const breakdown = PARTS.map(([name, p]) => [name, (p / sum) * rest])
  if (extraShare > 0) breakdown.push(['Selected extras', extraShare])

  return {
    total,
    low: total * 0.9,
    high: total * 1.12,
    perSqft: total / area,
    fee: total * feeRate,
    feePercent: Math.round(feeRate * 100),
    months,
    breakdown,
  }
}

export const formatRs = (n) => `Rs. ${Math.round(n).toLocaleString('en-LK')}`

export const formatShort = (n) =>
  n >= 1e6 ? `Rs. ${(n / 1e6).toFixed(1).replace(/\.0$/, '')} million` : formatRs(n)
