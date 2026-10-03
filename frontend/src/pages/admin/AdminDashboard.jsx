import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  addBlockedDay,
  adminLogout,
  cancelAppointment,
  createProject,
  deleteProject,
  deleteProjectImage,
  getBlockedDays,
  getFreeSlots,
  getAdminProjects,
  getProjectImages,
  getAppointments,
  getEnquiries,
  getSummary,
  removeBlockedDay,
  reorderProjectImages,
  rescheduleAppointment,
  setAppointmentStatus,
  setEnquiryStatus,
  setProjectCover,
  updateProject,
  uploadProjectImages,
} from '../../lib/api.js'
import { img } from '../../data/projects.js'
import { scrollToElement } from '../../lib/scroll.js'
import { clearSession, getSession } from '../../lib/auth.js'
import '../../styles/admin.css'

const TABS = [
  ['enquiries', 'Enquiries'],
  ['appointments', 'Appointments'],
  ['projects', 'Projects'],
]

const ENQUIRY_STATUSES = ['NEW', 'CONTACTED', 'CLOSED']
const PROJECT_TYPES = ['New Build', 'Renovation', 'Interior', 'Concept', 'Extension']

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

const formatDateTime = (iso) =>
  new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

function formatDay(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

function formatTime(hhmm) {
  const [h, m] = hhmm.split(':').map(Number)
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`
}

function useLoader(load) {
  const [state, setState] = useState({ data: null, error: '' })
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let alive = true
    load()
      .then((data) => alive && setState({ data, error: '' }))
      .catch((err) => alive && setState({ data: null, error: err.status === 401 ? 'expired' : 'Could not load. Is the backend running?' }))
    return () => {
      alive = false
    }
  }, [load, version])

  const reload = useCallback(() => setVersion((v) => v + 1), [])
  return [state, reload, setState]
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const session = getSession()
  const [tab, setTab] = useState('enquiries')
  const [summary, reloadSummary] = useLoader(getSummary)

  useEffect(() => {
    if (summary.error === 'expired') navigate('/admin/login', { replace: true })
  }, [summary.error, navigate])

  const logout = async () => {
    await adminLogout()
    clearSession()
    navigate('/admin/login', { replace: true })
  }

  const s = summary.data
  const stats = [
    ['New enquiries', s?.newEnquiries],
    ['All enquiries', s?.totalEnquiries],
    ["Today's appointments", s?.todaysAppointments],
    ['Upcoming appointments', s?.upcomingAppointments],
    ['Projects', s?.projects],
  ]

  return (
    <div className="adm">
      <header className="adm-top">
        <div className="adm-mark">
          <span>
            CNR<sup>®</sup>
          </span>
          <small>Studio Dashboard</small>
        </div>
        <div className="adm-user">
          <span>{session?.name}</span>
          <Link to="/" className="adm-link">
            View website
          </Link>
          <button type="button" className="adm-btn adm-btn-sm" onClick={logout}>
            Log out
          </button>
        </div>
      </header>

      <section className="adm-stats" aria-label="Summary">
        {stats.map(([label, value]) => (
          <div key={label} className="adm-stat">
            <span>{label}</span>
            <b>{value ?? '–'}</b>
          </div>
        ))}
      </section>

      <nav className="adm-tabs" role="tablist">
        {TABS.map(([key, label]) => (
          <button key={key} type="button" role="tab" aria-selected={tab === key} className={tab === key ? 'on' : undefined} onClick={() => setTab(key)}>
            {label}
          </button>
        ))}
      </nav>

      {summary.error && summary.error !== 'expired' && <p className="adm-err">{summary.error}</p>}

      {tab === 'enquiries' && <EnquiriesTab onChange={reloadSummary} />}
      {tab === 'appointments' && <AppointmentsTab onChange={reloadSummary} emailEnabled={Boolean(s?.emailEnabled)} />}
      {tab === 'projects' && <ProjectsTab onChange={reloadSummary} />}
    </div>
  )
}

function EnquiriesTab({ onChange }) {
  const [state, reload] = useLoader(getEnquiries)
  const [open, setOpen] = useState(null)
  const [filter, setFilter] = useState('ALL')

  const change = async (id, status) => {
    await setEnquiryStatus(id, status)
    reload()
    onChange()
  }

  if (state.error) return <p className="adm-err">{state.error === 'expired' ? 'Your session has ended. Please sign in again.' : state.error}</p>
  if (!state.data) return <p className="adm-muted">Loading…</p>

  const rows = filter === 'ALL' ? state.data : state.data.filter((e) => e.status === filter)

  return (
    <section className="adm-panel">
      <div className="adm-bar">
        <h2>Enquiries</h2>
        <div className="adm-filter">
          {['ALL', ...ENQUIRY_STATUSES].map((f) => (
            <button key={f} type="button" className={filter === f ? 'on' : undefined} onClick={() => setFilter(f)}>
              {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>
      {rows.length === 0 ? (
        <p className="adm-muted">No enquiries here yet.</p>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Received</th>
                <th>Name</th>
                <th>Contact</th>
                <th>About</th>
                <th>Budget</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((e) => (
                <Row key={e.id} e={e} open={open === e.id} onToggle={() => setOpen(open === e.id ? null : e.id)} onStatus={change} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

function Row({ e, open, onToggle, onStatus }) {
  return (
    <>
      <tr className={open ? 'open' : undefined}>
        <td>{formatDateTime(e.createdAt)}</td>
        <td>
          <button type="button" className="adm-name" onClick={onToggle} aria-expanded={open}>
            {e.name}
          </button>
        </td>
        <td>
          <a href={`tel:${e.phone}`}>{e.phone}</a>
          <br />
          <a href={`mailto:${e.email}`}>{e.email}</a>
        </td>
        <td>{e.enquiryType || '–'}</td>
        <td>{e.budget || '–'}</td>
        <td>
          <select className={`adm-pill s-${e.status.toLowerCase()}`} value={e.status} onChange={(ev) => onStatus(e.id, ev.target.value)} aria-label={`Status for ${e.name}`}>
            {ENQUIRY_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0) + s.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </td>
      </tr>
      {open && (
        <tr className="adm-detail">
          <td colSpan={6}>
            <dl>
              <dt>Who</dt>
              <dd>{e.role || '–'}</dd>
              <dt>Project address</dt>
              <dd>{[e.projectAddress, e.city, e.postalCode].filter(Boolean).join(', ') || '–'}</dd>
              <dt>Visuals needed by</dt>
              <dd>{e.neededBy ? formatDate(e.neededBy) : '–'}</dd>
              <dt>Comments</dt>
              <dd>{e.comments || '–'}</dd>
            </dl>
          </td>
        </tr>
      )}
    </>
  )
}

function AppointmentsTab({ onChange, emailEnabled }) {
  const [past, setPast] = useState(false)
  const load = useCallback(() => getAppointments(past), [past])
  const [state, reload] = useLoader(load)

  const [notice, setNotice] = useState('')
  const [moving, setMoving] = useState(null)

  const confirm = async (a) => {
    await setAppointmentStatus(a.id, 'CONFIRMED')
    setNotice(
      emailEnabled
        ? `Confirmed. A confirmation email is being sent to ${a.email}.`
        : `Confirmed. Email is not set up yet, so ${a.name} can see the confirmation on the website under My Appointment.`,
    )
    reload()
  }

  const cancel = async (a) => {
    if (!window.confirm(`Cancel ${a.name}'s appointment on ${formatDay(a.date)} at ${formatTime(a.time)}? The time will become free again.`)) return
    await cancelAppointment(a.id)
    setNotice(emailEnabled ? `Cancelled. ${a.name} has been emailed.` : 'Cancelled. The time is free again.')
    reload()
    onChange()
  }

  const moved = (a, text) => {
    setMoving(null)
    setNotice(text)
    reload()
    onChange()
  }

  return (
    <section className="adm-panel">
      <div className="adm-bar">
        <h2>Appointments</h2>
        <div className="adm-filter">
          <button type="button" className={!past ? 'on' : undefined} onClick={() => setPast(false)}>
            Upcoming
          </button>
          <button type="button" className={past ? 'on' : undefined} onClick={() => setPast(true)}>
            Past
          </button>
        </div>
      </div>
      {!past && <DaysOff onChange={() => { reload(); onChange() }} />}
      {notice && <p className="adm-note">{notice}</p>}
      {state.error && <p className="adm-err">{state.error === 'expired' ? 'Your session has ended. Please sign in again.' : state.error}</p>}
      {!state.error && !state.data && <p className="adm-muted">Loading…</p>}
      {state.data && state.data.length === 0 && <p className="adm-muted">No {past ? 'past' : 'upcoming'} appointments.</p>}
      {state.data && state.data.length > 0 && (
        <ul className="adm-appts">
          {state.data.map((a) => (
            <li key={a.id}>
              <div className="adm-when">
                <b>{formatDay(a.date)}</b>
                <span>{formatTime(a.time)}</span>
              </div>
              <div className="adm-who">
                <b>{a.name}</b>
                <span>
                  {a.meetingType} · <a href={`tel:${a.phone}`}>{a.phone}</a> · <a href={`mailto:${a.email}`}>{a.email}</a>
                </span>
                {a.note && <p>{a.note}</p>}
              </div>
              <div className="adm-actions">
                <span className={`adm-tag s-${a.status.toLowerCase()}`}>{a.status === 'CONFIRMED' ? 'Confirmed' : 'Booked'}</span>
                {!past && a.status !== 'CONFIRMED' && (
                  <button type="button" className="adm-btn adm-btn-sm" onClick={() => confirm(a)}>
                    Confirm
                  </button>
                )}
                {!past && (
                  <button
                    type="button"
                    className="adm-btn adm-btn-sm adm-btn-line"
                    onClick={() => setMoving(moving === a.id ? null : a.id)}
                    aria-expanded={moving === a.id}
                  >
                    Reschedule
                  </button>
                )}
                {!past && (
                  <button type="button" className="adm-btn adm-btn-sm adm-btn-line" onClick={() => cancel(a)}>
                    Cancel
                  </button>
                )}
              </div>
              {moving === a.id && (
                <RescheduleForm
                  appointment={a}
                  onClose={() => setMoving(null)}
                  onSaved={(date, time) =>
                    moved(
                      a,
                      `Moved to ${formatDay(date)} at ${formatTime(time)}.${emailEnabled ? ` ${a.name} has been emailed the new time.` : ''}`,
                    )
                  }
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function RescheduleForm({ appointment, onClose, onSaved }) {
  const ref = useRef(null)
  const [date, setDate] = useState(appointment.date)
  const [slots, setSlots] = useState({ date: '', list: [] })
  const [time, setTime] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [today] = useState(() => new Date().toISOString().slice(0, 10))

  useEffect(() => {
    if (ref.current) scrollToElement(ref.current)
  }, [])

  useEffect(() => {
    if (!date) return
    let alive = true
    getFreeSlots(date)
      .then((data) => alive && setSlots({ date, list: data.slots }))
      .catch(() => alive && setSlots({ date, list: [] }))
    return () => {
      alive = false
    }
  }, [date])

  const list = slots.date === date ? slots.list : []

  const save = async (e) => {
    e.preventDefault()
    if (!date || !time) {
      setError('Please choose a new date and time.')
      return
    }
    setBusy(true)
    setError('')
    try {
      await rescheduleAppointment(appointment.id, date, time)
      onSaved(date, time)
    } catch (err) {
      setBusy(false)
      setError(err.message)
    }
  }

  return (
    <form ref={ref} className="adm-form adm-move" onSubmit={save} noValidate>
      <h3>New time for {appointment.name}</h3>
      <div className="adm-grid">
        <label className="adm-fld">
          Date
          <input
            type="date"
            min={today}
            value={date}
            onChange={(e) => {
              setDate(e.target.value)
              setTime('')
            }}
          />
        </label>
        <div className="adm-fld">
          Free times
          {slots.date !== date && <span className="adm-muted">Checking…</span>}
          {slots.date === date && list.length === 0 && <span className="adm-muted">No free times on this day.</span>}
          <div className="adm-filter">
            {list.map((s) => (
              <button key={s} type="button" className={s === time ? 'on' : undefined} onClick={() => setTime(s)}>
                {formatTime(s)}
              </button>
            ))}
          </div>
        </div>
      </div>
      {error && <p className="adm-err">{error}</p>}
      <div className="adm-row">
        <button type="submit" className="adm-btn" disabled={busy}>
          Save new time
        </button>
        <button type="button" className="adm-btn adm-btn-line" onClick={onClose}>
          Close
        </button>
      </div>
    </form>
  )
}

function DaysOff({ onChange }) {
  const [state, reload] = useLoader(getBlockedDays)
  const [date, setDate] = useState('')
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')
  const [today] = useState(() => new Date().toISOString().slice(0, 10))

  const add = async (e) => {
    e.preventDefault()
    if (!date) {
      setError('Please choose a date.')
      return
    }
    setError('')
    try {
      await addBlockedDay(date, reason)
      setDate('')
      setReason('')
      reload()
      onChange()
    } catch (err) {
      setError(err.message)
    }
  }

  const remove = async (d) => {
    await removeBlockedDay(d.id)
    reload()
    onChange()
  }

  return (
    <div className="adm-off">
      <h3>Days off</h3>
      <p className="adm-muted">Clients cannot book on these days.</p>
      <form className="adm-off-form" onSubmit={add} noValidate>
        <input type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} aria-label="Day off" />
        <input type="text" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason (optional)" aria-label="Reason" maxLength={120} />
        <button type="submit" className="adm-btn adm-btn-sm">
          Block day
        </button>
      </form>
      {error && <p className="adm-err">{error}</p>}
      {state.data && state.data.length > 0 && (
        <ul className="adm-chips">
          {state.data.map((d) => (
            <li key={d.id}>
              <span>
                <b>{formatDay(d.date)}</b>
                {d.reason && ` · ${d.reason}`}
                {d.appointments > 0 && <em> · {d.appointments} booking{d.appointments > 1 ? 's' : ''} on this day</em>}
              </span>
              <button type="button" onClick={() => remove(d)} aria-label={`Unblock ${formatDay(d.date)}`}>
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

const EMPTY_PROJECT = { name: '', type: 'New Build', location: '', coverImage: '', description: '', featured: false }

function ProjectsTab({ onChange }) {
  const [state, reload] = useLoader(getAdminProjects)
  const [photosFor, setPhotosFor] = useState(null)
  const [editing, setEditing] = useState(null)
  const formRef = useRef(null)

  useEffect(() => {
    if (editing && formRef.current) {
      scrollToElement(formRef.current)
      formRef.current.querySelector('input')?.focus({ preventScroll: true })
    }
  }, [editing])
  const [form, setForm] = useState(EMPTY_PROJECT)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')

  const start = (project) => {
    setPhotosFor(null)
    setEditing(project ? project.id : 'new')
    setForm(project ? { ...EMPTY_PROJECT, ...project, description: project.description || '' } : EMPTY_PROJECT)
    setErrors({})
    setMessage('')
  }

  const field = (name) => ({
    value: form[name],
    onChange: (e) => setForm((f) => ({ ...f, [name]: e.target.value })),
  })

  const save = async (e) => {
    e.preventDefault()
    const body = {
      name: form.name,
      type: form.type,
      location: form.location,
      coverImage: form.coverImage,
      description: form.description,
      featured: form.featured,
    }
    try {
      if (editing === 'new') await createProject(body)
      else await updateProject(editing, body)
      setEditing(null)
      setMessage('Saved.')
      reload()
      onChange()
    } catch (err) {
      setErrors(err.fields || {})
      setMessage(err.message)
    }
  }

  const removeProject = async (p) => {
    if (!window.confirm(`Delete "${p.name}" and all its photos? This cannot be undone.`)) return
    try {
      await deleteProject(p.id)
      setEditing(null)
      setPhotosFor(null)
      setMessage(`${p.name} deleted.`)
      reload()
      onChange()
    } catch (err) {
      setMessage(err.message)
    }
  }

  const toggleFeatured = async (p) => {
    await updateProject(p.id, {
      name: p.name,
      type: p.type,
      location: p.location,
      coverImage: p.coverImage,
      description: p.description || '',
      featured: !p.featured,
    })
    reload()
  }

  if (state.error) return <p className="adm-err">{state.error === 'expired' ? 'Your session has ended. Please sign in again.' : state.error}</p>
  if (!state.data) return <p className="adm-muted">Loading…</p>

  const projectForm = (
    <form ref={formRef} className="adm-form" onSubmit={save} noValidate>
      <h3>{editing === 'new' ? 'New project' : 'Edit project'}</h3>
      <div className="adm-grid">
        <label className="adm-fld">
          Name
          <input {...field('name')} />
          {errors.name && <span className="adm-ferr">{errors.name}</span>}
        </label>
        <label className="adm-fld">
          Type
          <select {...field('type')}>
            {PROJECT_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className="adm-fld">
          Location
          <input {...field('location')} />
          {errors.location && <span className="adm-ferr">{errors.location}</span>}
        </label>
        <label className="adm-fld">
          Cover image (choose it in Photos, or a file name like sv10)
          <input {...field('coverImage')} placeholder="sv10" />
          {errors.coverImage && <span className="adm-ferr">{errors.coverImage}</span>}
        </label>
      </div>
      <label className="adm-fld">
        Description
        <textarea rows={4} {...field('description')} />
        {errors.description && <span className="adm-ferr">{errors.description}</span>}
      </label>
      <label className="adm-check">
        <input type="checkbox" checked={form.featured} onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))} /> Show under Featured Works on the Home page
      </label>
      {message && <p className="adm-err">{message}</p>}
      <div className="adm-row">
        <button type="submit" className="adm-btn">
          Save
        </button>
        <button type="button" className="adm-btn adm-btn-line" onClick={() => setEditing(null)}>
          Cancel
        </button>
      </div>
    </form>
  )

  return (
    <section className="adm-panel">
      <div className="adm-bar">
        <h2>Projects</h2>
        <button type="button" className="adm-btn adm-btn-sm" onClick={() => start(null)}>
          Add project
        </button>
      </div>
      {message && !editing && <p className="adm-muted">{message}</p>}

      {editing === 'new' && projectForm}

      <ul className="adm-projects">
        {state.data.map((p) => (
          <li key={p.id}>
            <img src={img(p.coverImage)} alt="" />
            <div>
              <b>{p.name}</b>
              <span>
                {p.type} · {p.location} · {p.images} photos
              </span>
            </div>
            <label className="adm-check">
              <input type="checkbox" checked={p.featured} onChange={() => toggleFeatured(p)} /> Featured
            </label>
            <button
              type="button"
              className="adm-btn adm-btn-sm adm-btn-line"
              onClick={() => {
                setEditing(null)
                setPhotosFor(photosFor === p.id ? null : p.id)
              }}
              aria-expanded={photosFor === p.id}
            >
              Photos
            </button>
            <button
              type="button"
              className="adm-btn adm-btn-sm adm-btn-line"
              onClick={() => (editing === p.id ? setEditing(null) : start(p))}
              aria-expanded={editing === p.id}
            >
              Edit
            </button>
            <button type="button" className="adm-btn adm-btn-sm adm-btn-line adm-btn-danger" onClick={() => removeProject(p)}>
              Delete
            </button>
            {editing === p.id && projectForm}
            {photosFor === p.id && (
              <PhotoManager
                project={p}
                onChange={() => {
                  reload()
                  onChange()
                }}
              />
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}

function PhotoManager({ project, onChange }) {
  const load = useCallback(() => getProjectImages(project.id), [project.id])
  const [state, reload] = useLoader(load)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const inputRef = useRef(null)
  const panelRef = useRef(null)
  const dragId = useRef(null)
  const [order, setOrder] = useState(null)
  const items = order || state.data

  useEffect(() => {
    if (panelRef.current) scrollToElement(panelRef.current)
  }, [])

  const done = (text) => {
    setBusy(false)
    setMessage(text)
    setOrder(null)
    reload()
    onChange()
  }

  const dropOn = async (targetId) => {
    const fromId = dragId.current
    dragId.current = null
    if (fromId == null || fromId === targetId || !items) return
    const list = [...items]
    const from = list.findIndex((i) => i.id === fromId)
    const to = list.findIndex((i) => i.id === targetId)
    const [moved] = list.splice(from, 1)
    list.splice(to, 0, moved)
    setOrder(list)
    setBusy(true)
    try {
      await reorderProjectImages(project.id, list.map((i) => i.id))
      done('New photo order saved.')
    } catch (err) {
      setBusy(false)
      setOrder(null)
      setMessage(err.message)
    }
  }

  const upload = async (e) => {
    const files = [...e.target.files]
    e.target.value = ''
    if (!files.length) return
    const tooBig = files.find((f) => f.size > 10 * 1024 * 1024)
    if (tooBig) {
      setMessage(`${tooBig.name} is larger than 10 MB.`)
      return
    }
    setBusy(true)
    setMessage(`Uploading ${files.length} photo${files.length > 1 ? 's' : ''}…`)
    try {
      await uploadProjectImages(project.id, files)
      done(`${files.length} photo${files.length > 1 ? 's' : ''} added.`)
    } catch (err) {
      setBusy(false)
      setMessage(err.message)
    }
  }

  const makeCover = async (image) => {
    setBusy(true)
    try {
      await setProjectCover(project.id, image.fileName)
      done('Cover photo changed.')
    } catch (err) {
      setBusy(false)
      setMessage(err.message)
    }
  }

  const remove = async (image) => {
    if (!window.confirm('Delete this photo from the project?')) return
    setBusy(true)
    try {
      await deleteProjectImage(project.id, image.id)
      done('Photo deleted.')
    } catch (err) {
      setBusy(false)
      setMessage(err.message)
    }
  }

  return (
    <div ref={panelRef} className="adm-photos">
      <div className="adm-bar">
        <h3>{project.name} photos</h3>
        <button type="button" className="adm-btn adm-btn-sm" onClick={() => inputRef.current?.click()} disabled={busy}>
          Upload photos
        </button>
        <input ref={inputRef} type="file" accept="image/jpeg,image/png" multiple hidden onChange={upload} />
      </div>
      <p className="adm-muted">JPG or PNG, up to 10 MB each. New photos are added to the end. Drag photos to change their order on the website.</p>
      {message && <p className="adm-note">{message}</p>}
      {state.error && <p className="adm-err">{state.error}</p>}
      {!state.data && !state.error && <p className="adm-muted">Loading…</p>}
      {items && items.length === 0 && <p className="adm-muted">No photos yet.</p>}
      {items && items.length > 0 && (
        <ul className="adm-gallery">
          {items.map((image, n) => {
            const isCover = image.fileName === project.coverImage
            return (
              <li
                key={image.id}
                draggable={!busy}
                onDragStart={(e) => {
                  dragId.current = image.id
                  e.dataTransfer.effectAllowed = 'move'
                  e.currentTarget.classList.add('dragging')
                }}
                onDragEnd={(e) => e.currentTarget.classList.remove('dragging')}
                onDragOver={(e) => {
                  e.preventDefault()
                  e.currentTarget.classList.add('over')
                }}
                onDragLeave={(e) => e.currentTarget.classList.remove('over')}
                onDrop={(e) => {
                  e.preventDefault()
                  e.currentTarget.classList.remove('over')
                  dropOn(image.id)
                }}
              >
                <span className="adm-pos">{n + 1}</span>
                <img src={img(image.fileName)} alt="" loading="lazy" />
                {isCover && <span className="adm-cover">Cover</span>}
                <div className="adm-gallery-actions">
                  {!isCover && (
                    <button type="button" onClick={() => makeCover(image)} disabled={busy}>
                      Set as cover
                    </button>
                  )}
                  {!isCover && (
                    <button type="button" onClick={() => remove(image)} disabled={busy}>
                      Delete
                    </button>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
