import { useEffect, useRef, useState } from 'react'
import Photo from '../components/Photo.jsx'
import SplitText from '../components/SplitText.jsx'
import useReveal from '../hooks/useReveal.js'
import { onScroll, clamp, easeInOut, prefersReducedMotion } from '../lib/scroll.js'
import { img } from '../data/projects.js'
import { VALUES, PLATFORM, OFFER } from '../data/studio.js'
import '../styles/studio.css'

const lerp = (a, b, t) => a + (b - a) * t

function Words({ className = '' }) {
  return (
    <div className={`swl ${className}`.trim()}>
      <span className="sw sL">Visualised</span>
      <span className="sw sR">Differently</span>
    </div>
  )
}

export default function Studio() {
  const pageRef = useRef(null)
  const spinRef = useRef(null)
  const spinImgRef = useRef(null)
  const whiteRef = useRef(null)
  const ideaRef = useRef(null)
  useReveal(pageRef)

  useEffect(() => {
    const reduced = prefersReducedMotion()
    const spin = spinRef.current
    const box = spinImgRef.current
    const white = whiteRef.current
    const idea = ideaRef.current
    const lefts = spin.querySelectorAll('.sL')
    const rights = spin.querySelectorAll('.sR')

    return onScroll(() => {
      const vw = window.innerWidth
      const vh = window.innerHeight
      const r = spin.getBoundingClientRect()
      const p = clamp(-r.top / (r.height - vh))
      const e = easeInOut(clamp(p / 0.72))
      const small = vw < 820
      const w0 = small ? 0.36 * vw : 0.42 * vw
      const h0 = small ? 0.2 * vh : 0.46 * vh
      const w = lerp(w0, vw, e)
      const h = lerp(h0, vh, e)

      box.style.width = `${w}px`
      box.style.height = `${h}px`
      white.style.left = `${-(vw - w) / 2}px`
      white.style.top = `${-(vh - h) / 2}px`
      white.style.width = `${vw}px`
      white.style.height = `${vh}px`

      const gap = lerp(w0 / 2 + 18, 2, e)
      lefts.forEach((el) => (el.style.transform = `translate(calc(-100% - ${gap}px), -50%)`))
      rights.forEach((el) => (el.style.transform = `translate(${gap}px, -50%)`))

      if (!reduced) {
        const ir = idea.getBoundingClientRect()
        const im = idea.querySelector('img')
        if (ir.bottom > 0 && ir.top < vh && im) {
          const c = (ir.top + ir.height / 2 - vh / 2) / vh
          im.style.transform = `scale(1.16) translate3d(0, ${c * -7}%, 0)`
        }
      }
    })
  }, [])

  return (
    <div ref={pageRef}>
      <section ref={spinRef} className="spin">
        <div className="spin-st">
          <Words />
          <div ref={spinImgRef} className="spin-img">
            <img src={img('studio-hero')} alt="Single-storey home with a breeze-block brick wall behind a large street tree" />
            <div ref={whiteRef} className="swl-box">
              <Words className="wht" />
            </div>
          </div>
        </div>
      </section>

      <section className="stat pad">
        <div className="slabels">
          <span>Visualisation</span>
          <span>Design</span>
        </div>
        <SplitText
          as="h1"
          className="big"
          text="CNR Design Studio is defined by clarity, craft and the trust designers place in seeing their work honestly."
        />
        <div className="stat-row">
          <div className="txt">
            <p className="fade">
              CNR Design Studio began with a simple belief: a building should be understood long before it is built.
              Drawings tell part of the story; light, material and scale tell the rest.
            </p>
            <p className="fade" style={{ '--d': '100ms' }}>
              From the way morning sun enters a kitchen to how a roof line meets the street, we help architects,
              students and homeowners see their designs as they will be lived in.
            </p>
            <p className="fade" style={{ '--d': '200ms' }}>
              Our standard is consistent, yet no two visualisations look the same. Every project is shaped by its site,
              its brief and the people who will call it home.
            </p>
          </div>
          <div className="rec">
            <span className="k fade">What We Offer</span>
            {OFFER.map((item, i) => (
              <span key={item} className="fade" style={{ '--d': `${(i + 1) * 80}ms` }}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <Values />

      <section className="founder pad">
        <div className="f-wrap">
          <Photo
            className="f-port"
            src={img('founder2')}
            alt="Portrait of Chanaka Rambukwella, founder of CNR Design Studio"
          />
          <div className="f-info">
            <span className="lbl fade">Meet The Founder</span>
            <SplitText className="f-name" text="Chanaka Rambukwella" />
            <div className="f-cred fade">
              <span className="f-role">Chartered Architect</span>
              <span>BSc (BE), MSc (Arch), AIA (SL)</span>
              <span>University of Moratuwa</span>
              <span className="f-num">
                <b>34</b> projects completed islandwide
              </span>
            </div>
            <div className="f-txt">
              <p className="fade">
                CNR Design Studio was founded after seeing how hard it is for clients to read technical drawings and
                imagine the spaces behind them.
              </p>
              <p className="fade" style={{ '--d': '100ms' }}>
                The aim was simple: a platform that turns architectural concepts into places people can see, explore
                and genuinely understand, built with the rigour of real design practice.
              </p>
              <p className="fade" style={{ '--d': '200ms' }}>
                Today the studio works with architects, students and homeowners, guiding every project from the first
                upload to the final walkthrough.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="idea pad">
        <SplitText
          className="big"
          text="Every building begins with an idea. Thoughtful visualisation turns that idea into a place you can already picture living in."
        />
        <div ref={ideaRef} className="inpx">
          <Photo
            src={img('studio-idea')}
            alt="View from a covered outdoor kitchen across a tiled pool to a white two-storey home"
          />
        </div>
        <div className="rcg txt">
          <span className="lbl fade">Recognition</span>
          <p className="fade" style={{ '--d': '100ms' }}>
            Recognition is welcome, but never the benchmark. Our focus is on visuals that help real people make better
            decisions about the buildings they will live in, and the standard we hold ourselves to on every project.
          </p>
        </div>
      </section>

      <section className="awards pad">
        <div className="a-hd">
          <span className="lbl">Platform</span>
          <SplitText className="a-title" text="From first upload to final walkthrough." />
        </div>
        <div className="atab" role="table" aria-label="Platform tools">
          <div className="arow hd" role="row">
            <span role="columnheader">Stage</span>
            <span role="columnheader">Tool</span>
            <span role="columnheader">What it does</span>
          </div>
          <div role="rowgroup">
            {PLATFORM.map((row, i) => (
              <div key={row.stage} className="arow" role="row" style={{ '--d': `${(i % 3) * 60}ms` }}>
                <span role="cell">{row.stage}</span>
                <span role="cell">{row.tool}</span>
                <span role="cell">{row.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function Values() {
  const [active, setActive] = useState(0)
  const [shown, setShown] = useState(0)
  const [fading, setFading] = useState(false)
  const timer = useRef(0)

  useEffect(() => () => clearTimeout(timer.current), [])

  const choose = (i) => {
    if (i === active) return
    setActive(i)
    setFading(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      setShown(i)
      setFading(false)
    }, 220)
  }

  return (
    <section className="vals pad">
      <span className="lbl">Our Values</span>
      <ol className="vlist">
        {VALUES.map((v, i) => (
          <li key={v.title} className={i === active ? 'on' : undefined}>
            <button type="button" onMouseEnter={() => choose(i)} onFocus={() => choose(i)} onClick={() => choose(i)}>
              <span className="n">{i + 1}</span>
              <span className="t">{v.title}</span>
            </button>
          </li>
        ))}
      </ol>
      <div className="vimg">
        <div className="vstack">
          {VALUES.map((v, i) => (
            <div key={v.image} className={`fi${i === active ? ' show' : ''}`}>
              <img src={img(v.image)} alt={v.title} />
            </div>
          ))}
        </div>
        <p className="vtxt" style={{ opacity: fading ? 0 : 1 }}>
          {VALUES[shown].text}
        </p>
      </div>
    </section>
  )
}
