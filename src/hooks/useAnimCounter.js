import { useState, useEffect, useRef } from 'react'

export function useAnimCounter(target, duration = 1400) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let startTs = null
    const step = (ts) => {
      if (!startTs) startTs = ts
      const progress = Math.min((ts - startTs) / duration, 1)
      setVal(Math.floor(progress * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        requestAnimationFrame(step)
        obs.disconnect()
      }
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [target, duration])
  return { val, ref }
}
