import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import SplitText from '../components/SplitText.jsx'
import { Arrow } from '../components/ArrowLink.jsx'
import useReveal from '../hooks/useReveal.js'
import { cancelMyAppointment, getAppointmentStatus } from '../lib/api.js'
import '../styles/enquiry.css'
import '../styles/book.css'

const STATUS_TEXT = {
  BOOKED: ['Waiting for confirmation', 'The studio will confirm your appointment soon. You will also get an email when it is confirmed.'],
  CONFIRMED: ['Confirmed', 'Your appointment is confirmed. We look forward to meeting you.'],
  CANCELLED: ['Cancelled', 'This appointment was cancelled. Please book a new time or call 071 868 7628.'],
}

function formatLong(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

function formatTime(hhmm) {
  const [h, m] = hhmm.split(':').map(Number)
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`
}

export default function MyAppointment() {
  const ref = useRef(null)
  useReveal(ref)
  const [params] = useSearchParams()
  const [reference, setReference] = useState(params.get('ref') || '')
  const [email, setEmail] = useState(params.get('email') || '')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [owner, setOwner] = useState(params.get('email') || '')
  const [notice, setNotice] = useState('')
  const [now] = useState(() => Date.now())

  const lookUp = async (r, e) => {
    if (!r.trim() || !e.trim()) {
      setError('Please enter your booking reference and email address.')
      return
    }
    setBusy(true)
    setError('')
    setNotice('')
    try {
      setResult(await getAppointmentStatus(r.trim(), e.trim()))
      setOwner(e.trim())
    } catch (err) {
      setResult(null)
      setError(err.status === 404 ? err.message : 'Could not check right now. Please try again shortly.')
    }
    setBusy(false)
  }

  const fromLink = useRef({ ref: params.get('ref'), email: params.get('email') })
  useEffect(() => {
    const { ref: r, email: e } = fromLink.current
    if (!r || !e) return
    let alive = true
    getAppointmentStatus(r, e)
      .then((data) => alive && setResult(data))
      .catch((err) => alive && setError(err.status === 404 ? err.message : 'Could not check right now. Please try again shortly.'))
    return () => {
      alive = false
    }
  }, [])

  const cancel = async () => {
    if (!window.confirm('Cancel this appointment? The time will be released for other clients.')) return
    setBusy(true)
    setError('')
    try {
      setResult(await cancelMyAppointment(result.reference, owner))
      setNotice('Your appointment has been cancelled. A confirmation has been sent to your email.')
    } catch (err) {
      setError(err.status === 400 || err.status === 404 ? err.message : 'Could not cancel right now. Please call 071 868 7628.')
    }
    setBusy(false)
  }

  const isUpcoming = (r) => {
    const [y, mo, d] = r.date.split('-').map(Number)
    const [h, mi] = r.time.split(':').map(Number)
    return new Date(y, mo - 1, d, h, mi).getTime() > now
  }

  const submit = (e) => {
    e.preventDefault()
    lookUp(reference, email)
  }

  const status = result ? STATUS_TEXT[result.status] || STATUS_TEXT.BOOKED : null

  return (
    <section ref={ref} className="enq-w book pad">
      <div className="enq-l">
        <span className="lbl fade">My Appointment</span>
        <SplitText as="h1" className="book-title" text="Check your appointment." />
        <div className="txt">
          <p className="fade">
            Enter the booking reference you received, for example CNR-00007, and the email address you booked with.
          </p>
        </div>
        <Link to="/book" className="enq-est fade" style={{ '--d': '120ms' }}>
          Need a new time? Book an appointment <Arrow />
        </Link>
      </div>

      <div className="enq-form">
        <form onSubmit={submit} noValidate>
          <label className="fld" htmlFor="m-ref">
            Booking reference
            <input id="m-ref" value={reference} onChange={(e) => setReference(e.target.value)} placeholder="CNR-00007" />
            <span className="bar" />
          </label>
          <label className="fld" htmlFor="m-email">
            Email Address
            <input id="m-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <span className="bar" />
          </label>
          <button type="submit" className="send" disabled={busy}>
            {busy ? 'Checking…' : 'Check Appointment'} <Arrow />
          </button>
          {error && (
            <p className="done" role="alert">
              {error}
            </p>
          )}
        </form>

        {result && (
          <div className={`appt-card appt-${result.status.toLowerCase()}`} role="status">
            <span className="appt-badge">{status[0]}</span>
            <p className="book-when">
              {formatLong(result.date)}
              <br />
              {formatTime(result.time)}
            </p>
            <dl>
              <dt>Meeting</dt>
              <dd>{result.meetingType}</dd>
              <dt>Name</dt>
              <dd>{result.name}</dd>
              <dt>Reference</dt>
              <dd>{result.reference}</dd>
            </dl>
            <p className="txt">{status[1]}</p>
            {notice && <p className="appt-notice">{notice}</p>}
            {result.status !== 'CANCELLED' && isUpcoming(result) && (
              <button type="button" className="appt-cancel" onClick={cancel} disabled={busy}>
                Cancel this appointment
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
