import Lenis from 'lenis'

let lenis = null
let locked = false
const listeners = new Set()

const emit = () => listeners.forEach((fn) => fn())

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function startSmoothScroll() {
  window.addEventListener('scroll', emit, { passive: true })
  window.addEventListener('resize', emit)

  let frame = 0
  if (!prefersReducedMotion()) {
    lenis = new Lenis({ lerp: 0.09 })
    if (locked) lenis.stop()
    const raf = (time) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)
  }

  return () => {
    window.removeEventListener('scroll', emit)
    window.removeEventListener('resize', emit)
    cancelAnimationFrame(frame)
    if (lenis) lenis.destroy()
    lenis = null
  }
}

export function onScroll(fn) {
  listeners.add(fn)
  fn()
  return () => listeners.delete(fn)
}

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true })
  window.scrollTo(0, 0)
}

export function lockScroll(lock) {
  locked = lock
  document.documentElement.style.overflow = lock ? 'hidden' : ''
  if (!lenis) return
  if (lock) lenis.stop()
  else lenis.start()
}

export const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v))
export const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

export function scrollToElement(el, offset = 24) {
  requestAnimationFrame(() => {
    const top = el.getBoundingClientRect().top + window.scrollY - offset
    if (lenis) {
      lenis.resize()
      lenis.scrollTo(top, { duration: 0.8 })
    } else {
      window.scrollTo({ top, behavior: 'smooth' })
    }
  })
}
