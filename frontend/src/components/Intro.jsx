import { useCallback, useEffect, useRef } from 'react'
import { Arrow } from './ArrowLink.jsx'
import { lockScroll, scrollToTop } from '../lib/scroll.js'
import '../styles/intro.css'

export default function Intro({ leaving, onLeave, onDone }) {
  const videoRef = useRef(null)
  const buttonRef = useRef(null)
  const doneRef = useRef(false)

  const leave = useCallback(() => {
    if (doneRef.current) return
    doneRef.current = true
    lockScroll(false)
    scrollToTop()
    onLeave()
    setTimeout(onDone, 1150)
  }, [onLeave, onDone])

  useEffect(() => {
    lockScroll(true)

    videoRef.current?.play()?.catch(() => {})

    const focusTimer = setTimeout(() => buttonRef.current?.focus({ preventScroll: true }), 1200)
    return () => clearTimeout(focusTimer)
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Enter' || e.key === 'Escape' || e.key === ' ') {
        e.preventDefault()
        leave()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [leave])

  return (
    <div className={`intro${leaving ? ' out' : ''}`} aria-label="CNR Design Studio intro">
      <video
        ref={videoRef}
        src="/images/login-bg.mp4"
        poster="/images/login-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <div className="it-in">
        <div className="it-mark" aria-hidden="true">
          <span className="it-l"><span>C</span></span>
          <span className="it-l"><span>N</span></span>
          <span className="it-l"><span>R</span></span>
          <sup className="it-r">®</sup>
        </div>
        <span className="it-sub"><span>Design Studio</span></span>
        <div className="it-bot">
          <span>See it before it&apos;s built. Press Enter to begin.</span>
          <button ref={buttonRef} type="button" className="it-go" onClick={leave}>
            Enter <Arrow />
          </button>
        </div>
      </div>
    </div>
  )
}
