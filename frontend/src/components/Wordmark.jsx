import { useEffect, useRef } from 'react'

let ctx = null
function inkLeft(el, ch) {
  if (!ctx) ctx = document.createElement('canvas').getContext('2d')
  const cs = getComputedStyle(el)
  ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`
  return -ctx.measureText(ch).actualBoundingBoxLeft
}

export default function Wordmark({ animate = false, registered = false, delays = [0, 90, 180] }) {
  const wmRef = useRef(null)
  const subRef = useRef(null)

  useEffect(() => {
    const align = () => {
      const sub = subRef.current
      const c = wmRef.current?.querySelector('.lt > span')
      if (!sub || !c) return
      sub.style.paddingLeft = '0px'
      const cx = c.getBoundingClientRect().left + inkLeft(c, 'C')
      const dx = sub.getBoundingClientRect().left + inkLeft(sub, 'D')
      sub.style.paddingLeft = `${Math.max(0, cx - dx).toFixed(1)}px`
    }
    align()
    document.fonts?.ready.then(align)
    window.addEventListener('resize', align)
    return () => window.removeEventListener('resize', align)
  }, [])

  return (
    <>
      <p ref={wmRef} className={`wm${animate ? ' anim' : ''}`} aria-label="CNR">
        {['C', 'N', 'R'].map((letter, i) => (
          <span key={letter} className="lt" style={{ '--d': `${delays[i]}ms` }}>
            <span>{letter}</span>
          </span>
        ))}
        {registered && <sup>®</sup>}
      </p>
      <p ref={subRef} className={`wm-sub${animate ? ' fade' : ''}`} style={{ '--d': `${delays[2] + 30}ms` }}>
        Design Studio
      </p>
    </>
  )
}
