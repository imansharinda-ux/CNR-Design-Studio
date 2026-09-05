import { useEffect, useRef } from 'react'

export default function CursorTrail() {
  const ref = useRef(null)

  useEffect(() => {
    const fineMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const canvas = ref.current
    if (!canvas || !fineMouse || reduced) return

    const ctx = canvas.getContext('2d')
    const LIFE = 420
    const points = []
    let width = 0
    let height = 0
    let frame = 0

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = (now) => {
      ctx.clearRect(0, 0, width, height)
      while (points.length && now - points[0].t > LIFE) points.shift()

      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      for (let i = 1; i < points.length; i++) {
        const a = points[i - 1]
        const b = points[i]
        const k = i / points.length
        const age = 1 - (now - b.t) / LIFE
        ctx.strokeStyle = `rgba(181,134,79,${(k * age).toFixed(3)})`
        ctx.lineWidth = 0.8 + 2.6 * k * age
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.quadraticCurveTo(a.x, a.y, (a.x + b.x) / 2, (a.y + b.y) / 2)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()
      }
      frame = points.length ? requestAnimationFrame(draw) : 0
    }

    const onMove = (e) => {
      if (e.pointerType !== 'mouse') return
      points.push({ x: e.clientX, y: e.clientY, t: performance.now() })
      if (!frame) frame = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(frame)
    }
  }, [])

  return <canvas ref={ref} className="trail" aria-hidden="true" />
}
