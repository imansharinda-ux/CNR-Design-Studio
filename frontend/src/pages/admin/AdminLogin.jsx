import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Arrow } from '../../components/ArrowLink.jsx'
import { adminLogin } from '../../lib/api.js'
import { getSession, saveSession } from '../../lib/auth.js'
import '../../styles/admin.css'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (getSession()) return <Navigate to="/admin" replace />

  const submit = async (e) => {
    e.preventDefault()
    if (!email.trim() || !password) {
      setError('Please enter your email and password.')
      return
    }
    setBusy(true)
    setError('')
    try {
      const session = await adminLogin(email.trim(), password)
      saveSession(session)
      navigate('/admin', { replace: true })
    } catch (err) {
      setBusy(false)
      setError(err.status === 401 ? 'Wrong email or password.' : err.status === 400 ? err.message : 'Could not reach the server. Is the backend running?')
    }
  }

  return (
    <main className="adm-login">
      <form className="adm-card" onSubmit={submit} noValidate>
        <div className="adm-mark">
          <span>
            CNR<sup>®</sup>
          </span>
          <small>Design Studio</small>
        </div>
        <h1>Studio sign in</h1>
        <label className="adm-fld">
          Email
          <input type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="adm-fld">
          Password
          <input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        {error && (
          <p className="adm-err" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="adm-btn" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'} <Arrow />
        </button>
        <Link to="/" className="adm-back">
          Back to the website
        </Link>
      </form>
    </main>
  )
}
