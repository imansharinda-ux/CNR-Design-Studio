import { Fragment, useLayoutEffect, useRef } from 'react'

export default function SplitText({ as: Tag = 'h2', text, className = '', hero = false }) {
  const ref = useRef(null)
  const words = text.trim().split(/\s+/)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const setDelays = () => {
      let top = null
      let line = -1
      el.querySelectorAll('.w').forEach((w) => {
        if (w.offsetTop !== top) {
          top = w.offsetTop
          line++
        }
        const delay = hero ? 250 + line * 80 : line * 50
        w.firstChild.style.setProperty('--d', `${delay}ms`)
      })
    }
    setDelays()
    window.addEventListener('resize', setDelays)
    return () => window.removeEventListener('resize', setDelays)
  }, [text, hero])

  return (
    <Tag ref={ref} className={`split ${className}`.trim()} data-hero={hero ? '' : undefined}>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span className="w">
            <span>{word}</span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </Tag>
  )
}
