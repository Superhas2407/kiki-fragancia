import { useEffect, useRef, useState } from 'react'
export default function DeferredSection({ children, height = 300 }) {
  const ref = useRef(null)
  const [ready, setReady] = useState(() => !('IntersectionObserver' in window))
  useEffect(() => {
    if (ready) return
    const observer = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) { setReady(true); observer.disconnect() }
    }, { rootMargin: '600px' })
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [ready])
  return <div ref={ref} style={ready ? undefined : { minHeight: height }}>{ready ? children : null}</div>
}
