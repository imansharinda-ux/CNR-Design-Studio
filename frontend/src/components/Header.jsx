import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import ThemeToggle from './ThemeToggle.jsx'
import { onScroll } from '../lib/scroll.js'
import { PROJECTS } from '../data/projects.js'

const NAV = [
  { to: '/', label: 'Home' },
  { to: '/studio', label: 'Studio' },
  { to: '/process', label: 'Process' },
  { to: '/projects', label: 'Projects' },
  { to: '/estimate', label: 'Estimator', extra: 'nav-est' },
  { to: '/book', label: 'Book', extra: 'nav-est' },
  { to: '/my-appointment', label: 'My Booking', extra: 'nav-est' },
]

const LABELS = {
  '/studio': 'The Studio',
  '/process': 'The Process',
  '/projects': `All Projects (${PROJECTS.length})`,
  '/estimate': 'Cost Estimator',
  '/enquiry': 'Project Enquiry',
  '/book': 'Book An Appointment',
  '/my-appointment': 'My Appointment',
}

function colomboTime() {
  try {
    return new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Colombo', hour12: false })
  } catch {
    return new Date().toLocaleTimeString()
  }
}

const linkClass = (extra = '') => ({ isActive }) => ['ul', extra, isActive ? 'cur' : ''].filter(Boolean).join(' ')

export default function Header() {
  const { pathname } = useLocation()
  const ref = useRef(null)
  const [scrolled, setScrolled] = useState(false)
  const [time, setTime] = useState(colomboTime)

  useEffect(() => onScroll(() => setScrolled(window.scrollY > 40)), [])

  useEffect(() => {
    if (pathname !== '/') return
    const id = setInterval(() => setTime(colomboTime()), 1000)
    return () => clearInterval(id)
  }, [pathname])

  useEffect(() => {
    const setHeight = () =>
      document.documentElement.style.setProperty('--hh', `${ref.current.offsetHeight}px`)
    setHeight()
    window.addEventListener('resize', setHeight)
    return () => window.removeEventListener('resize', setHeight)
  }, [])

  const isProject = pathname.startsWith('/projects/')
  const label = pathname === '/' ? `${time} Colombo, LK` : LABELS[pathname] || ''

  return (
    <header ref={ref} className={`hdr g4 pad${scrolled ? ' down' : ''}`}>
      <Link to="/" className="logo" aria-label="CNR Design Studio home">
        <span className="lg-m">
          CNR<sup>®</sup>
        </span>
        <span className="lg-s">Design Studio</span>
      </Link>

      {isProject ? (
        <Link to="/projects" className="slot2 ul">Go Back To Projects</Link>
      ) : (
        <span className="slot2">{label}</span>
      )}

      <nav aria-label="Main">
        {NAV.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.to === '/'} className={linkClass(item.extra)}>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="hdr-r">
        <NavLink to="/enquiry" className={linkClass('enq')}>
          Project Enquiry
        </NavLink>
        <ThemeToggle />
      </div>
    </header>
  )
}
