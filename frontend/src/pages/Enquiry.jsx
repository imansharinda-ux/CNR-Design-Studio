import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import SplitText from '../components/SplitText.jsx'
import { Arrow } from '../components/ArrowLink.jsx'
import useReveal from '../hooks/useReveal.js'
import Honeypot from '../components/Honeypot.jsx'
import { sendEnquiry } from '../lib/api.js'
import '../styles/enquiry.css'

const EMPTY = {
  name: '',
  phone: '',
  email: '',
  projectAddress: '',
  city: '',
  postalCode: '',
  enquiryType: '',
  role: '',
  budget: '',
  neededBy: '',
  comments: '',
  website: '',
}

const ENQUIRY_TYPES = ['Exterior renders', 'Interior renders', 'Walkthrough animation', 'Concept / massing study', 'Platform account']
const ROLES = ['Architect / Designer', 'Student', 'Homeowner', 'Builder / Developer']
const BUDGETS = [
  'Under Rs. 100,000',
  'Rs. 100,000 – 250,000',
  'Rs. 250,000 – 500,000',
  'Rs. 500,000 – 1,000,000',
  'Above Rs. 1,000,000',
  'Not sure yet',
]

const NEXT_STEPS = [
  ['We read your brief', 'We review your details, drawings and site information.'],
  ['A short call', 'We talk through your goals, timeline and the views you need.'],
  ['Your proposal', 'You receive a clear scope and fee before any work begins.'],
]

function validate(form) {
  const errors = {}
  if (!form.name.trim()) errors.name = 'Please enter your name'
  if (!form.phone.trim()) errors.phone = 'Please enter your phone number'
  else if (!/^[+0-9 ()-]{9,20}$/.test(form.phone.trim())) errors.phone = 'Please enter a valid phone number'
  if (!form.email.trim()) errors.email = 'Please enter your email address'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = 'Please enter a valid email address'
  return errors
}

function Field({ label, name, error, children }) {
  return (
    <label className={`fld${error ? ' bad' : ''}`} htmlFor={`f-${name}`}>
      {label}
      {children}
      <span className="bar" />
      {error && (
        <span className="err" id={`e-${name}`}>
          {error}
        </span>
      )}
    </label>
  )
}

export default function Enquiry() {
  const ref = useRef(null)
  useReveal(ref)

  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [state, setState] = useState('idle')
  const [message, setMessage] = useState('')
  const [today] = useState(() => new Date().toISOString().slice(0, 10))

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
    'aria-describedby': errors[name] ? `e-${name}` : undefined,
    ...extra,
  })

  const submit = async (e) => {
    e.preventDefault()
    const found = validate(form)
    setErrors(found)
    if (Object.keys(found).length) {
      setState('idle')
      setMessage('Please check the highlighted fields.')
      return
    }
    setState('sending')
    setMessage('')
    try {
      await sendEnquiry({ ...form, neededBy: form.neededBy || null })
      setState('sent')
      setMessage('Thank you. Your enquiry has been received and we will be in touch soon.')
      setForm(EMPTY)
    } catch (err) {
      setState('idle')
      setErrors(err.fields || {})
      setMessage(
        err.status === 400 || err.status === 429
          ? err.message
          : 'Sorry, your enquiry could not be sent right now. Please try again or call 071 868 7628.',
      )
    }
  }

  return (
    <section ref={ref} className="enq-w pad">
      <div className="enq-l">
        <div className="txt">
          <p className="fade">Every considered building begins with a clear brief.</p>
          <p className="fade" style={{ '--d': '80ms' }}>
            Complete the form with as much detail as possible, and we will be in touch to discuss your project and the
            next steps.
          </p>
          <p className="fade" style={{ '--d': '160ms' }}>
            Tell us about your site, the design you want to visualise, and the timeline you are working towards.
          </p>
        </div>
        <Link to="/estimate" className="enq-est fade" style={{ '--d': '220ms' }}>
          Not sure about your budget? Try the cost estimator <Arrow />
        </Link>
        <div className="enq-next fade" style={{ '--d': '260ms' }}>
          <span className="lbl">What happens next</span>
          <ol>
            {NEXT_STEPS.map(([title, text], i) => (
              <li key={title}>
                <b>{String(i + 1).padStart(2, '0')}</b>
                <span>
                  <strong>{title}</strong>
                  {text}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <form className="enq-form" onSubmit={submit} noValidate>
        <SplitText as="h1" text="Project Enquiry Form" />
        <Honeypot value={form.website} onChange={(v) => setForm((f) => ({ ...f, website: v }))} />

        <Field label="Name *" name="name" error={errors.name}>
          <input {...input('name', 'text', { autoComplete: 'name' })} />
        </Field>
        <Field label="Phone *" name="phone" error={errors.phone}>
          <input {...input('phone', 'tel', { autoComplete: 'tel' })} />
        </Field>
        <Field label="Email Address *" name="email" error={errors.email}>
          <input {...input('email', 'email', { autoComplete: 'email' })} />
        </Field>
        <Field label="Project Address" name="projectAddress" error={errors.projectAddress}>
          <input {...input('projectAddress', 'text', { autoComplete: 'street-address' })} />
        </Field>
        <Field label="City" name="city" error={errors.city}>
          <input {...input('city')} />
        </Field>
        <Field label="Postal Code" name="postalCode" error={errors.postalCode}>
          <input {...input('postalCode', 'text', { autoComplete: 'postal-code' })} />
        </Field>
        <Field label="What is your enquiry about?" name="enquiryType" error={errors.enquiryType}>
          <select {...input('enquiryType')}>
            <option value="">Select an option</option>
            {ENQUIRY_TYPES.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </Field>
        <Field label="Who are you?" name="role" error={errors.role}>
          <select {...input('role')}>
            <option value="">Select an option</option>
            {ROLES.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </Field>
        <Field label="What is your budget?" name="budget" error={errors.budget}>
          <select {...input('budget')}>
            <option value="">Select a budget</option>
            {BUDGETS.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </Field>
        <Field label="When do you need the visuals by?" name="neededBy" error={errors.neededBy}>
          <input {...input('neededBy', 'date', { min: today })} />
        </Field>
        <Field label="Please add any additional comments" name="comments" error={errors.comments}>
          <textarea {...input('comments', undefined, { rows: 4 })} />
        </Field>

        <button type="submit" className="send" disabled={state === 'sending'}>
          {state === 'sending' ? 'Sending…' : 'Submit Project Enquiry'} <Arrow />
        </button>
        {message && (
          <p className={`done${state === 'sent' ? ' ok' : ''}`} role="status">
            {message}
          </p>
        )}
      </form>
    </section>
  )
}
