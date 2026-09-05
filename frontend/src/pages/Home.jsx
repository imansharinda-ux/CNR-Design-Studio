import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import SplitText from '../components/SplitText.jsx'
import Photo from '../components/Photo.jsx'
import ArrowLink, { Arrow } from '../components/ArrowLink.jsx'
import Wordmark from '../components/Wordmark.jsx'
import useReveal from '../hooks/useReveal.js'
import { onScroll, clamp, easeInOut, prefersReducedMotion } from '../lib/scroll.js'
import { FEATURED, img } from '../data/projects.js'
import { getFeaturedProjects } from '../lib/api.js'
import { QUOTES } from '../data/quotes.js'
import '../styles/home.css'

const pad2 = (n) => String(n).padStart(2, '0')

export default function Home({ ready }) {
  const pageRef = useRef(null)
  const heroRef = useRef(null)
  const heroImgRef = useRef(null)
  const heroTxtRef = useRef(null)
  const pinRef = useRef(null)
  const trackRef = useRef(null)
  const growRef = useRef(null)

  useReveal(pageRef, ready)

  useEffect(() => {
    const reduced = prefersReducedMotion()
    const pin = pinRef.current
    const track = trackRef.current
    let shift = 0

    const size = () => {
      shift = Math.max(0, track.scrollWidth - window.innerWidth)
      pin.style.height = `${window.innerHeight + shift}px`
    }
    size()
    window.addEventListener('resize', size)

    const off = onScroll(() => {
      const vh = window.innerHeight

      if (!reduced) {
        const hero = heroRef.current.getBoundingClientRect()
        if (hero.bottom > 0) {
          heroImgRef.current.style.transform = `translate3d(0, ${-hero.top * 0.45}px, 0)`
          heroTxtRef.current.style.transform = `translate3d(0, ${-hero.top * 0.25}px, 0)`
        }

        const grow = growRef.current
        const g = easeInOut(clamp((vh - grow.getBoundingClientRect().top) / (vh * 0.95)))
        grow.style.clipPath = `inset(0 ${(1 - g) * 32}% ${(1 - g) * 30}% 0)`
      }

      const p = shift ? clamp(-pin.getBoundingClientRect().top / shift) : 0
      track.style.transform = `translate3d(${-easeInOut(p) * shift}px, 0, 0)`
    })

    return () => {
      off()
      window.removeEventListener('resize', size)
    }
  }, [])

  return (
    <div ref={pageRef}>
      {/* 1. Hero */}
      <section ref={heroRef} className="hero">
        <div ref={heroImgRef} className="hero-in">
          <Photo
            src="/images/home-hero8.jpg"
            alt="Bright dining hall with a black oval table, timber chairs and a curved white staircase under a raked ceiling"
          />
        </div>
        <div ref={heroTxtRef} className="hero-txt">
          <SplitText as="h1" hero text="Bringing architectural ideas to life before they are built." />
        </div>
      </section>

      {/* 2. Our Studio */}
      <section ref={pinRef} className="hpin">
        <div className="hpin-st">
          <div ref={trackRef} className="hpin-tr">
            <div className="hp hp1 pad">
              <span className="lbl">Our Studio</span>
              <SplitText className="big" text="Every considered building begins with a clearly visualised idea." />
            </div>
            <div className="hp hp2">
              <Photo src="/images/home-studio.jpg" alt="White rendered home with timber pergolas, a covered terrace and a pool" />
            </div>
            <div className="hp hp3">
              <p className="txt fade">
                The difference between an exceptional design and a disappointing build is everything that stays
                unseen. CNR Design Studio exists to close that gap, turning plans, sketches and ideas into spaces you
                can explore long before construction begins.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. About */}
      <section className="band pad">
        <div className="band-top">
          <Photo
            className="band-img"
            src="/images/home-page3.jpg"
            alt="Garden path with olive trees and timber screens leading to a white home with a covered deck"
          />
          <div className="band-copy">
            <div className="txt">
              <p className="fade">
                CNR Design Studio is a platform for visualising architectural concepts, from early massing studies to
                photoreal walkthroughs of homes, renovations and public spaces.
              </p>
              <p className="fade" style={{ '--d': '120ms' }}>
                Architects, students and homeowners upload their designs and see them come to life in light, material
                and scale, so every space is understood before it is built.
              </p>
              <ArrowLink to="/studio" className="fade" style={{ '--d': '240ms' }}>Learn More</ArrowLink>
            </div>
          </div>
        </div>
        <Wordmark animate registered />
      </section>

      {/* 4. Featured Works */}
      <FeaturedWorks />

      {/* 5. Our Approach */}
      <section className="appr pad">
        <SplitText className="big appr-h" text="Thoughtful home design requires everyone working from the same page." />
        <div ref={growRef} className="grow">
          <Photo src="/images/home-approach.jpg" alt="Open-plan living room and white kitchen under a raked white timber ceiling" />
        </div>
        <div className="appr-copy">
          <span className="lbl">Our Approach</span>
          <p className="fade">
            Seeing a design is only half the job. The other half is making sure everyone sees the same thing. CNR
            Design Studio brings architects, clients, consultants and builders onto one shared, explorable model, so
            every decision on site supports the design.
          </p>
          <ArrowLink to="/process" className="fade">Learn More</ArrowLink>
        </div>
      </section>

      {/* 6. Client Words */}
      <ClientWords />
    </div>
  )
}

function FeaturedWorks() {
  const [projects, setProjects] = useState(FEATURED)
  const [active, setActive] = useState(0)
  const project = projects[active] || projects[0]

  useEffect(() => {
    let alive = true
    getFeaturedProjects()
      .then((data) => {
        if (alive && data.length) setProjects(data)
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  return (
    <section className="feat pad">
      <div className="fw">
        <div className="fw-l">
          <span className="lbl fade">Featured Works</span>
          <SplitText className="fw-title" text="Homes shaped by light, material and place." />
          <ol className="flist">
            {projects.map((p, i) => (
              <li key={p.slug} className={i === active ? 'on' : undefined} onMouseEnter={() => setActive(i)}>
                <Link to={`/projects/${p.slug}`} onFocus={() => setActive(i)}>
                  <span>{pad2(i + 1)}</span>
                  <span>{p.name}</span>
                  <span className="ty">{p.type}</span>
                </Link>
              </li>
            ))}
          </ol>
          <ArrowLink to="/projects" className="fade fw-all">View All Projects</ArrowLink>
        </div>

        <div className="fw-r">
          <Link to={`/projects/${project.slug}`} className="fw-frame" aria-label={`Open ${project.name}`}>
            <div className="feat-imgs">
              {projects.map((p, i) => (
                <div key={p.slug} className={`fi${i === active ? ' show' : ''}`}>
                  <img src={img(p.coverImage)} alt={`${p.name} concept render`} />
                </div>
              ))}
            </div>
          </Link>
          <div className="fw-cap">
            <span>{project.name}</span>
            <span>{project.location}</span>
          </div>
        </div>
      </div>
    </section>
  )
}

function ClientWords() {
  const [index, setIndex] = useState(0) 
  const [shown, setShown] = useState(0) 
  const [fading, setFading] = useState(false)
  const timer = useRef(0)
  const quote = QUOTES[shown]

  useEffect(() => {
    QUOTES.forEach((q) => {
      const im = new Image()
      im.src = img(q.image)
    })
    return () => clearTimeout(timer.current)
  }, [])

  const go = (dir) => {
    const next = (index + dir + QUOTES.length) % QUOTES.length
    setIndex(next)
    setFading(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      setShown(next)
      setFading(false)
    }, 140)
  }

  return (
    <section className="cw pad">
      <div className="cw-a">
        <Photo src={img(QUOTES[index].image)} alt={`${QUOTES[index].project} project photo`} />
        <ArrowLink to={`/projects/${QUOTES[index].slug}`} className="fade">View Project</ArrowLink>
      </div>
      <div className="cw-b">
        <span className="lbl">Client Words</span>
        <div className={`cw-q${fading ? ' out' : ''}`} aria-live="polite">
          <p>{quote.text}</p>
          <p className="cw-who">
            {quote.who}
            <span>{quote.project}</span>
          </p>
        </div>
        <div className="cw-bar">
          <span className="cw-n">
            {pad2(index + 1)} <span className="cw-of">/ {pad2(QUOTES.length)}</span>
          </span>
          <div className="cw-ctl">
            <button type="button" onClick={() => go(-1)} aria-label="Previous testimonial">
              <Arrow left width={18} height={12} />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Next testimonial">
              <Arrow width={18} height={12} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
