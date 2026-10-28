import { beforeEach, describe, expect, it } from 'vitest'
import { clearSession, getSession, saveSession } from './auth.js'

const store = new Map()
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
}

describe('admin session', () => {
  beforeEach(() => store.clear())

  it('returns a saved session that has not expired', () => {
    saveSession({ token: 't', name: 'A', expiresAt: new Date(Date.now() + 60000).toISOString() })
    expect(getSession()?.token).toBe('t')
  })

  it('ignores an expired session', () => {
    saveSession({ token: 't', name: 'A', expiresAt: new Date(Date.now() - 1000).toISOString() })
    expect(getSession()).toBeNull()
  })

  it('clears the session on log out', () => {
    saveSession({ token: 't', name: 'A', expiresAt: new Date(Date.now() + 60000).toISOString() })
    clearSession()
    expect(getSession()).toBeNull()
  })
})
