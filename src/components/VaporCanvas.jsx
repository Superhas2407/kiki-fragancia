import { useEffect, useRef } from 'react'

export default function VaporCanvas() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId
    const particles = []
    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    window.addEventListener('resize', resize)
    resize()
    for (let i = 0; i < 55; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height + Math.random() * 200,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -(0.3 + Math.random() * 0.55),
        life: Math.random(),
        maxLife: 0.7 + Math.random() * 0.3,
        r: 1.2 + Math.random() * 2.4,
        gold: Math.random() > 0.6,
      })
    }
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        p.life += 0.003
        if (p.life >= p.maxLife) {
          p.x = Math.random() * canvas.width
          p.y = canvas.height + 10
          p.life = 0
          p.maxLife = 0.7 + Math.random() * 0.3
        }
        const alpha = Math.sin((p.life / p.maxLife) * Math.PI) * 0.55
        const color = p.gold
          ? `rgba(201,168,76,${alpha})`
          : `rgba(250,245,235,${alpha * 0.4})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.fill()
      })
      animId = requestAnimationFrame(tick)
    }
    tick()
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animId)
    }
  }, [])
  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  )
}
