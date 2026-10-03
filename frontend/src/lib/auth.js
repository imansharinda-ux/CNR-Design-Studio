const KEY = 'cnrAdminSession'

export function getSession() {
  try {
    const session = JSON.parse(localStorage.getItem(KEY))
    if (!session || new Date(session.expiresAt) <= new Date()) return null
    return session
  } catch {
    return null
  }
}

export function saveSession(session) {
  try {
    localStorage.setItem(KEY, JSON.stringify(session))
  } catch {
    return
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    return
  }
}
