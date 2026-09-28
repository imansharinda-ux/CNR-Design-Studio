import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import SplitText from '../components/SplitText.jsx'
import { Arrow } from '../components/ArrowLink.jsx'
import useReveal from '../hooks/useReveal.js'
import { estimate, formatRs, formatShort } from '../lib/estimate.js'
import '../styles/estimate.css'

const TYPES = [
  ['new', 'New build'],
  ['ext', 'Extension'],
  ['ren', 'Renovation'],
]

const STOREY_OPTIONS = [
  [1, 'One'],
  [2, 'Two'],
  [3, 'Three'],
]

const FINISHES = [
  ['std', 'Standard', 'Quality local materials, simple detailing'],
  ['pre', 'Premium', 'Timber joinery, stone and tile features'],
  ['lux', 'Luxury', 'Custom design, imported finishes throughout'],
]

const LOCATIONS = [
  ['col', 'Colombo and suburbs'],
  ['sou', 'Southern coast (Galle, Matara)'],
  ['hil', 'Kandy and hill country'],
  ['oth', 'Other areas'],
]

const EXTRAS = [
  ['pool', 'Swimming pool'],
  ['solar', 'Solar power system'],
  ['land', 'Landscaping and boundary wall'],
  ['int', 'Interior fit-out and furniture'],
]

function Segment({ options, value, onChange }) {
  return (
    <div className="seg">
      {options.map(([v, label]) => (
        <button key={v} type="button" className={v === value ? 'on' : undefined} aria-pressed={v === value} onClick={() => onChange(v)}>
          {label}
        </button>
      ))}
    </div>
  )
}

function useCountUp(target) {
  const [shown, setShown] = useState(target)
  const current = useRef(target)

  useEffect(() => {
    const from = current.current
    const start = performance.now()
    let frame = 0
    const step = (now) => {
      const k = Math.min(1, (now - start) / 450)
      const value = from + (target - from) * (1 - Math.pow(1 - k, 3))
      current.current = value
      setShown(value)
      if (k < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [target])

  return shown
}

export default function Estimate() {
  const ref = useRef(null)
  useReveal(ref)

  const [type, setType] = useState('new')
  const [area, setArea] = useState(2000)
  const [storeys, setStoreys] = useState(2)
  const [finish, setFinish] = useState('pre')
  const [location, setLocation] = useState('hil')
  const [extras, setExtras] = useState([])

  const result = estimate({ type, area, storeys, finish, location, extras })
  const shownTotal = useCountUp(result.total)

  const toggleExtra = (value) =>
    setExtras((list) => (list.includes(value) ? list.filter((x) => x !== value) : [...list, value]))

  return (
    <section ref={ref} className="est pad">
      <div className="est-hd">
        <span className="lbl fade">Cost Estimator</span>
        <SplitText as="h1" className="est-title" text="Estimate the cost of your home." />
        <p className="est-lead fade">
          Answer a few questions to get a rough construction budget in Sri Lankan rupees. It is a starting point for
          planning, not a quotation.
        </p>
      </div>

      <div className="est-grid">
        <form className="est-form" onSubmit={(e) => e.preventDefault()}>
          <fieldset className="eq">
            <legend>Project type</legend>
            <Segment options={TYPES} value={type} onChange={setType} />
          </fieldset>

          <fieldset className="eq">
            <legend>
              Floor area <span className="eq-val">{area.toLocaleString('en-LK')} sq ft</span>
            </legend>
            <input
              type="range"
              className="est-area"
              min="400"
              max="6000"
              step="50"
              value={area}
              onChange={(e) => setArea(Number(e.target.value))}
              aria-label="Floor area in square feet"
            />
            <div className="rng-ends">
              <span>400 sq ft</span>
              <span>6,000 sq ft</span>
            </div>
          </fieldset>

          <fieldset className="eq">
            <legend>Number of storeys</legend>
            <Segment options={STOREY_OPTIONS} value={storeys} onChange={setStoreys} />
          </fieldset>

          <fieldset className="eq">
            <legend>Finish level</legend>
            <div className="seg seg-col">
              {FINISHES.map(([v, name, note]) => (
                <button key={v} type="button" className={v === finish ? 'on' : undefined} aria-pressed={v === finish} onClick={() => setFinish(v)}>
                  <b>{name}</b>
                  <small>{note}</small>
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="eq">
            <legend>Location</legend>
            <label className="sel">
              <select value={location} onChange={(e) => setLocation(e.target.value)} aria-label="Location">
                {LOCATIONS.map(([v, label]) => (
                  <option key={v} value={v}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </fieldset>

          <fieldset className="eq">
            <legend>Extras</legend>
            <div className="chk">
              {EXTRAS.map(([v, label]) => (
                <label key={v}>
                  <input type="checkbox" checked={extras.includes(v)} onChange={() => toggleExtra(v)} /> {label}
                </label>
              ))}
            </div>
          </fieldset>
        </form>

        <aside className="est-res" aria-live="polite">
          <span className="lbl">Estimated construction cost</span>
          <div className="est-big">{formatShort(shownTotal)}</div>
          <div className="est-range">
            Likely range {formatShort(result.low)} – {formatShort(result.high)}
          </div>
          <div className="est-rows">
            <div>
              <span>Cost per sq ft</span>
              <b>{formatRs(result.perSqft)}</b>
            </div>
            <div>
              <span>Design and visualisation fee (approx.)</span>
              <b>
                {formatShort(result.fee)} ({result.feePercent}%)
              </b>
            </div>
            <div>
              <span>Typical build time</span>
              <b>
                {result.months}–{result.months + 3} months
              </b>
            </div>
          </div>
          <span className="est-sub">Where the money goes</span>
          <div className="est-bars">
            {result.breakdown.map(([name, share]) => (
              <div key={name} className="bar">
                <span>{name}</span>
                <span>{Math.round(share * 100)}%</span>
                <i>
                  <b style={{ width: `${(share * 100).toFixed(1)}%` }} />
                </i>
              </div>
            ))}
          </div>
          <Link to="/enquiry" className="est-cta">
            Get an accurate quote <Arrow />
          </Link>
          <p className="est-note">
            Based on published 2025–26 Sri Lankan building averages. Excludes land, approvals and taxes. Actual costs
            depend on the site, design and market prices.
          </p>
        </aside>
      </div>
    </section>
  )
}
