import { useEffect, useRef } from 'react'

export default function CursorTrail() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)
    const points = []
    const mouse = { x: -999, y: -999 }
    const onMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      for (let i = 0; i < 2; i++) {
        points.push({
          x: mouse.x + (Math.random() - 0.5) * 8,
          y: mouse.y + (Math.random() - 0.5) * 8,
          life: 1,
          r: 1 + Math.random() * 2.5,
        })
      }
    }
    window.addEventListener('mousemove', onMove)
    let animId
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let i = points.length - 1; i >= 0; i--) {
        const p = points[i]
        p.life -= 0.045
        if (p.life <= 0) { points.splice(i, 1); continue }
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(201,168,76,${p.life * 0.5})`
        ctx.fill()
      }
      animId = requestAnimationFrame(tick)
    }
    tick()
    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(animId)
    }
  }, [])
  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 9999 }}
    />
  )
}
