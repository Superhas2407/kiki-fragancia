import { useEffect, useRef } from 'react'

export function useScrollReveal({ threshold = 0.15, delay = 0, once = true } = {}) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.opacity = '0'
    el.style.transform = 'translateY(22px)'
    el.style.transition = `opacity var(--reveal-dur, 0.9s) cubic-bezier(.22,1,.36,1) ${delay}ms, transform var(--reveal-dur, 0.9s) cubic-bezier(.22,1,.36,1) ${delay}ms`
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.style.opacity = '1'
        el.style.transform = 'translateY(0)'
        if (once) obs.disconnect()
      }
    }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [delay, threshold, once])
  return ref
}
