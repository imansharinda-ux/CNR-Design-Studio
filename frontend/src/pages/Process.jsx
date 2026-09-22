import { useEffect, useRef } from 'react'
import Photo from '../components/Photo.jsx'
import SplitText from '../components/SplitText.jsx'
import useReveal from '../hooks/useReveal.js'
import { onScroll, clamp, prefersReducedMotion } from '../lib/scroll.js'
import { img } from '../data/projects.js'
import { STEPS, ORDINALS } from '../data/process.js'
import '../styles/process.css'

const STACK_GAP = 48
const NUDGE = 16

function useOpeningImage(ref) {
  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    const expo = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t))
    const set = (h, v) => {
      el.style.clipPath = `inset(${60 * (1 - v)}% ${60 * (1 - h)}% ${20 * (1 - v)}% ${50 * (1 - h)}%)`
    }
    set(0, 0)
    const start = performance.now()
    let frame = 0
    const step = (now) => {
      const t = now - start
      set(expo(clamp(t / 1600)), expo(clamp(t / 1800)))
      if (t < 1800) frame = requestAnimationFrame(step)
      else el.style.clipPath = 'inset(0% 0% 0% 0%)'
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [ref])
}

function useStackedSteps(ref) {
  useEffect(() => {
    const wrap = ref.current
    if (!wrap) return
    const rows = [...wrap.children]
    const headerHeight = () => document.querySelector('.hdr')?.offsetHeight || 60
    const topPx = (i) => headerHeight() + STACK_GAP * i
    let starts = []

    const align = () => {
      const last = rows.length - 1
      const release = topPx(last) + rows[last].offsetHeight
      rows.forEach((row, i) => {
        const gap = i === last ? 0 : Math.max(0, release - topPx(i) - row.offsetHeight)
        row.style.marginBottom = `${gap}px`
        if (rows[i + 1]) rows[i + 1].style.marginTop = `${-gap}px`
      })
      let y = wrap.getBoundingClientRect().top + window.scrollY
      starts = rows.map((row) => {
        const top = y
        y += row.offsetHeight
        return top
      })
    }

    align()
    window.addEventListener('resize', align)

    const off = prefersReducedMotion()
      ? () => {}
      : onScroll(() => {
          if (!starts.length) return
          const vh = window.innerHeight
          const progress = rows.map((_, i) => {
            if (i === 0) return 0
            const t = starts[i] - window.scrollY
            const s0 = vh * 0.9
            const s1 = topPx(i)
            return clamp((s0 - t) / (s0 - s1))
          })
          let total = 0
          for (let i = rows.length - 1; i >= 0; i--) {
            rows[i].style.transform = `translate3d(0, ${-total * NUDGE}px, 0)`
            total += progress[i]
          }
        })

    return () => {
      off()
      window.removeEventListener('resize', align)
    }
  }, [ref])
}

export default function Process() {
  const pageRef = useRef(null)
  const openRef = useRef(null)
  const stepsRef = useRef(null)
  useReveal(pageRef)
  useOpeningImage(openRef)
  useStackedSteps(stepsRef)

  return (
    <div ref={pageRef}>
      <section className="proc-hd pad pz">
        <SplitText
          as="h1"
          hero
          className="ph1"
          text="Our process keeps the design, the client and the build team looking at the same building."
        />
        <div ref={openRef} className="atf">
          <Photo
            src={img('home-hero')}
            alt="Bright open-plan dining room with a curved white staircase and raked timber-beamed ceiling"
          />
        </div>
      </section>

      <section className="proc-intro g4 pad pz">
        <div className="txt">
          <p className="fade">Good visualisation takes care and time to uncover what a design really needs to communicate.</p>
          <p className="fade" style={{ '--d': '80ms' }}>
            Through an initial review and concept phase, we work closely with you to understand the brief, the site
            and the decisions your visuals need to support.
          </p>
          <p className="fade" style={{ '--d': '160ms' }}>
            One dedicated designer leads your project from the first upload to the final walkthrough, so the original
            intent is never lost between stages.
          </p>
          <p className="fade" style={{ '--d': '240ms' }}>Visualised once. Built right.</p>
        </div>
        <ol className="fade">
          {STEPS.map((s) => (
            <li key={s.title}>{s.title}</li>
          ))}
        </ol>
      </section>

      <section className="steps pad pz">
        <div ref={stepsRef} className="steps-c">
          {STEPS.map((s, i) => (
            <article key={s.title} className="step" style={{ '--i': i, zIndex: i + 1 }}>
              <span className="s-l">Step {ORDINALS[i]}</span>
              <div className="s-m">
                <h2>{s.title}</h2>
                <p>{s.text}</p>
              </div>
              <div className="s-i">
                <Photo className={i === 1 ? 'kb' : ''} src={img(s.image)} alt={s.title} />
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
