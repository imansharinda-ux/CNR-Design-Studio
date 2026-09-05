import { useEffect } from 'react'

const SELECTOR = '.split, .fade, .arrow-link, .wm.anim, .foot, .arow'

export default function useReveal(ref, enabled = true) {
  useEffect(() => {
    const root = ref.current
    if (!root || !enabled) return

    const els = [...root.querySelectorAll(SELECTOR)]
    if (root.matches(SELECTOR)) els.push(root)

    if (!document.documentElement.classList.contains('js')) {
      els.forEach((el) => el.classList.add('in'))
      return
    }

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        }),
      { rootMargin: '0px 0px -8% 0px', threshold: 0.01 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [ref, enabled])
}
