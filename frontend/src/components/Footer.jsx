import { useRef } from 'react'
import { Link } from 'react-router-dom'
import ArrowLink from './ArrowLink.jsx'
import Wordmark from './Wordmark.jsx'
import useReveal from '../hooks/useReveal.js'
import { CONTACT } from '../data/contact.js'

export default function Footer() {
  const ref = useRef(null)
  useReveal(ref)

  return (
    <footer ref={ref} className="foot pad">
      <div className="g4">
        <div className="foot-col">
          <a href="#" className="ul">Instagram</a>
          <a href="#" className="ul">Facebook</a>
          <a href="#" className="ul">LinkedIn</a>
        </div>
        <div className="foot-col">
          <a href={`tel:${CONTACT.phoneLink}`} className="ul">{CONTACT.phone}</a>
          <a href={`mailto:${CONTACT.email}`} className="ul">{CONTACT.email}</a>
        </div>
        <div className="foot-cta">
          <Link to="/enquiry" className="mid">Tell us about your project</Link>
          <ArrowLink to="/enquiry">Start a visualisation enquiry here</ArrowLink>
        </div>
      </div>

      <div className="g4 foot-low">
        <div className="foot-wm">
          <Wordmark delays={[0, 30, 60]} />
        </div>
        <div className="foot-r">
          <div className="foot-nav">
            <nav aria-label="Footer">
              <Link to="/">Home</Link>
              <Link to="/studio">Studio</Link>
              <Link to="/projects">Projects</Link>
              <Link to="/process">Process</Link>
              <Link to="/estimate">Cost Estimator</Link>
              <Link to="/enquiry">Project Enquiry</Link>
              <Link to="/book">Book An Appointment</Link>
              <Link to="/my-appointment">My Appointment</Link>
            </nav>
            <address>
              {CONTACT.address[0]}
              <br />
              {CONTACT.address[1]}
            </address>
          </div>
          <div className="foot-meta">
            <span>All Rights Reserved © CNR Design Studio</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
