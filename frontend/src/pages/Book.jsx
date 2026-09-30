import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import SplitText from '../components/SplitText.jsx'
import { Arrow } from '../components/ArrowLink.jsx'
import useReveal from '../hooks/useReveal.js'
import Honeypot from '../components/Honeypot.jsx'
import { getBlockedDates, getFreeSlots, bookAppointment } from '../lib/api.js'
import { scrollToTop } from '../lib/scroll.js'
import '../styles/enquiry.css'
import '../styles/book.css'

const MEETING_TYPES = ['Studio visit', 'Phone call', 'Online meeting']
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MAX_DAYS_AHEAD = 60
const EMPTY = { name: '', phone: '', email: '', note: '', website: '' }

const pad = (n) => String(n).padStart(2, '0')
const toIso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

function colomboToday() {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Colombo' }).format(new Date())
  const [y, m, d] = parts.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function formatLong(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

function formatTime(hhmm) {
  const [h, m] = hhmm.split(':').map(Number)
  const suffix = h < 12 ? 'AM' : 'PM'
  return `${((h + 11) % 12) + 1}:${pad(m)} ${suffix}`
}

function monthDays(year, month) {
  const first = new Date(year, month, 1)
  const offset = (first.getDay() + 6) % 7
  const count = new Date(year, month + 1, 0).getDate()
  const cells = Array(offset).fill(null)
  for (let d = 1; d <= count; d++) cells.push(new Date(year, month, d))
  return cells
}

function validate(form, date, time, meetingType) {
  const errors = {}
  if (!date) errors.date = 'Please choose a date'
  if (!time) errors.time = 'Please choose a time'
  if (!meetingType) errors.meetingType = 'Please choose a meeting type'
  if (!form.name.trim()) errors.name = 'Please enter your name'
  if (!form.phone.trim()) errors.phone = 'Please enter your phone number'
  else if (!/^[+0-9 ()-]{9,20}$/.test(form.phone.trim())) errors.phone = 'Please enter a valid phone number'
  if (!form.email.trim()) errors.email = 'Please enter your email address'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = 'Please enter a valid email address'
  return errors
}

function Calendar({ today, value, onChange, blocked }) {
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() })
  const last = new Date(today.getFullYear(), today.getMonth(), today.getDate() + MAX_DAYS_AHEAD)
  const cells = monthDays(view.year, view.month)
  const title = new Date(view.year, view.month, 1).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
  const canPrev = view.year > today.getFullYear() || view.month > today.getMonth()
  const canNext = new Date(view.year, view.month + 1, 1) <= last

  const move = (step) =>
    setView((v) => {
      const d = new Date(v.year, v.month + step, 1)
      return { year: d.getFullYear(), month: d.getMonth() }
    })

  return (
    <div className="cal">
      <div className="cal-hd">
        <button type="button" onClick={() => move(-1)} disabled={!canPrev} aria-label="Previous month">
          <Arrow left />
        </button>
        <span>{title}</span>
        <button type="button" onClick={() => move(1)} disabled={!canNext} aria-label="Next month">
          <Arrow />
        </button>
      </div>
      <div className="cal-grid" role="grid" aria-label={title}>
        {WEEKDAYS.map((d) => (
          <span key={d} className="cal-wd">
            {d}
          </span>
        ))}
        {cells.map((day, i) => {
          if (!day) return <span key={`e${i}`} />
          const iso = toIso(day)
          const closed = day < today || day > last || day.getDay() === 0 || blocked.has(iso)
          return (
            <button
              key={iso}
              type="button"
              className={`cal-day${iso === value ? ' on' : ''}${iso === toIso(today) ? ' today' : ''}`}
              disabled={closed}
              aria-pressed={iso === value}
              aria-label={formatLong(iso)}
              onClick={() => onChange(iso)}
            >
              {day.getDate()}
            </button>
          )
        })}
      </div>
      <p className="cal-note">Open Monday to Saturday, except studio holidays. Bookings up to two months ahead.</p>
    </div>
  )
}

export default function Book() {
  const ref = useRef(null)
  useReveal(ref)

  const [today] = useState(colomboToday)
  const [date, setDate] = useState('')
  const [slots, setSlots] = useState({ date: '', list: [], failed: false })
  const [time, setTime] = useState('')
  const [meetingType, setMeetingType] = useState('Studio visit')
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [state, setState] = useState('idle')
  const [message, setMessage] = useState('')
  const [booked, setBooked] = useState(null)
  const [refresh, setRefresh] = useState(0)
  const [blocked, setBlocked] = useState(() => new Set())

  useEffect(() => {
    let alive = true
    getBlockedDates()
      .then((list) => alive && setBlocked(new Set(list)))
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    if (!date) return
    let alive = true
    getFreeSlots(date)
      .then((data) => alive && setSlots({ date, list: data.slots, failed: false }))
      .catch(() => alive && setSlots({ date, list: [], failed: true }))
    return () => {
      alive = false
    }
  }, [date, refresh])

  const loading = date && slots.date !== date
  const freeSlots = useMemo(() => (slots.date === date ? slots.list : []), [slots, date])

  const pickDate = (iso) => {
    setDate(iso)
    setTime('')
    setErrors((x) => ({ ...x, date: undefined, time: undefined }))
  }

  const update = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    if (errors[name]) setErrors((x) => ({ ...x, [name]: undefined }))
  }

  const input = (name, type = 'text', extra = {}) => ({
    id: `f-${name}`,
    name,
    type,
    value: form[name],
    onChange: update,
    'aria-invalid': errors[name] ? true : undefined,
    ...extra,
  })

  const submit = async (e) => {
    e.preventDefault()
    const found = validate(form, date, time, meetingType)
    setErrors(found)
    if (Object.keys(found).length) {
      setMessage('Please check the highlighted fields.')
      return
    }
    setState('sending')
    setMessage('')
    try {
      const result = await bookAppointment({ date, time, meetingType, ...form })
      setBooked(result)
      setState('sent')
      scrollToTop()
    } catch (err) {
      setState('idle')
      setErrors(err.fields || {})
      if (err.status === 409) {
        setTime('')
        setRefresh((n) => n + 1)
      }
      setMessage(
        err.status === 400 || err.status === 409 || err.status === 429
          ? err.message
          : 'Sorry, the booking could not be made right now. Please try again or call 071 868 7628.',
      )
    }
  }

  const reset = () => {
    setBooked(null)
    setState('idle')
    setDate('')
    setTime('')
    setForm(EMPTY)
    setMessage('')
  }

  return (
    <section ref={ref} className="enq-w book pad">
      <div className="enq-l">
        <span className="lbl fade">Book An Appointment</span>
        <SplitText as="h1" className="book-title" text="Meet the architect." />
        <div className="txt">
          <p className="fade">
            Choose a day and time to talk through your project with Chanaka Rambukwella, at the studio in Katugastota,
            over the phone or online.
          </p>
          <p className="fade" style={{ '--d': '80ms' }}>
            Each meeting takes about an hour. Bring any drawings, photos of the site or ideas you already have.
          </p>
        </div>
        <Link to="/enquiry" className="enq-est fade" style={{ '--d': '160ms' }}>
          Prefer to send a written brief? Use the enquiry form <Arrow />
        </Link>
      </div>

      {booked ? (
        <div className="enq-form book-done" role="status">
          <span className="lbl">Appointment booked</span>
          <p className="book-when">
            {formatLong(booked.date)}
            <br />
            {formatTime(booked.time)}
          </p>
          <dl>
            <dt>Meeting</dt>
            <dd>{booked.meetingType}</dd>
            <dt>Name</dt>
            <dd>{booked.name}</dd>
            <dt>Reference</dt>
            <dd>CNR-{String(booked.id).padStart(5, '0')}</dd>
          </dl>
          <p className="txt">
            Your booking is waiting for confirmation. Once the studio confirms it, we will email you at{' '}
            <b>{form.email}</b>. To change the time, call 071 868 7628.
          </p>
          <Link
            to={`/my-appointment?ref=CNR-${String(booked.id).padStart(5, '0')}&email=${encodeURIComponent(form.email)}`}
            className="enq-est book-check"
          >
            Check your appointment status <Arrow />
          </Link>
          <button type="button" className="send" onClick={reset}>
            Book another time <Arrow />
          </button>
        </div>
      ) : (
        <form className="enq-form" onSubmit={submit} noValidate>
          <Honeypot value={form.website} onChange={(v) => setForm((f) => ({ ...f, website: v }))} />
          <fieldset className="book-step">
            <legend>1. Choose a day</legend>
            <Calendar today={today} value={date} onChange={pickDate} blocked={blocked} />
            {errors.date && <span className="err">{errors.date}</span>}
          </fieldset>

          <fieldset className="book-step">
            <legend>2. Choose a time</legend>
            {!date && <p className="book-hint">Pick a day to see the free times.</p>}
            {loading && <p className="book-hint">Checking free times…</p>}
            {date && !loading && slots.failed && (
              <p className="book-hint">Free times could not be loaded. Please try again shortly.</p>
            )}
            {date && !loading && !slots.failed && freeSlots.length === 0 && (
              <p className="book-hint">No free times on this day. Please choose another day.</p>
            )}
            {freeSlots.length > 0 && (
              <div className="seg">
                {freeSlots.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={s === time ? 'on' : undefined}
                    aria-pressed={s === time}
                    onClick={() => {
                      setTime(s)
                      setErrors((x) => ({ ...x, time: undefined }))
                    }}
                  >
                    {formatTime(s)}
                  </button>
                ))}
              </div>
            )}
            {errors.time && <span className="err">{errors.time}</span>}
          </fieldset>

          <fieldset className="book-step">
            <legend>3. How would you like to meet?</legend>
            <div className="seg">
              {MEETING_TYPES.map((m) => (
                <button key={m} type="button" className={m === meetingType ? 'on' : undefined} aria-pressed={m === meetingType} onClick={() => setMeetingType(m)}>
                  {m}
                </button>
              ))}
            </div>
            {errors.meetingType && <span className="err">{errors.meetingType}</span>}
          </fieldset>

          <fieldset className="book-step">
            <legend>4. Your details</legend>
            <label className={`fld${errors.name ? ' bad' : ''}`} htmlFor="f-name">
              Name *
              <input {...input('name', 'text', { autoComplete: 'name' })} />
              <span className="bar" />
              {errors.name && <span className="err">{errors.name}</span>}
            </label>
            <label className={`fld${errors.phone ? ' bad' : ''}`} htmlFor="f-phone">
              Phone *
              <input {...input('phone', 'tel', { autoComplete: 'tel' })} />
              <span className="bar" />
              {errors.phone && <span className="err">{errors.phone}</span>}
            </label>
            <label className={`fld${errors.email ? ' bad' : ''}`} htmlFor="f-email">
              Email Address *
              <input {...input('email', 'email', { autoComplete: 'email' })} />
              <span className="bar" />
              {errors.email && <span className="err">{errors.email}</span>}
            </label>
            <label className={`fld${errors.note ? ' bad' : ''}`} htmlFor="f-note">
              What would you like to discuss?
              <textarea {...input('note', undefined, { rows: 3 })} />
              <span className="bar" />
              {errors.note && <span className="err">{errors.note}</span>}
            </label>
          </fieldset>

          {date && time && (
            <p className="book-sum">
              {formatLong(date)} at {formatTime(time)} · {meetingType}
            </p>
          )}
          <button type="submit" className="send" disabled={state === 'sending'}>
            {state === 'sending' ? 'Booking…' : 'Book Appointment'} <Arrow />
          </button>
          {message && (
            <p className="done" role="status">
              {message}
            </p>
          )}
        </form>
      )}
    </section>
  )
}
