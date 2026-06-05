import { useState, useEffect } from 'react'
import { ShaderAnimation } from '../components/ShaderAnimation'

function calcTimeLeft() {
  const diff = new Date('2026-09-01T00:00:00') - new Date()
  if (diff <= 0) return { dias: 0, horas: 0, minutos: 0, segundos: 0 }
  return {
    dias:     Math.floor(diff / 86400000),
    horas:    Math.floor((diff % 86400000) / 3600000),
    minutos:  Math.floor((diff % 3600000) / 60000),
    segundos: Math.floor((diff % 60000) / 1000),
  }
}

export default function ComingSoon() {
  const [time, setTime] = useState(calcTimeLeft())

  useEffect(() => {
    const interval = setInterval(() => setTime(calcTimeLeft()), 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <div className="cs-backdrop">
        <ShaderAnimation />
      </div>
      <div className="cs-overlay">
        <p className="cs-eyebrow">— Algo se acerca</p>
        <h1 className="cs-title">Kiki Fragancia</h1>
        <div className="cs-divider" aria-hidden="true" />
        <div className="cs-countdown">
          {[['dias', 'Días'], ['horas', 'Horas'], ['minutos', 'Min'], ['segundos', 'Seg']].map(([key, label]) => (
            <div key={key} className="cs-unit">
              <span className="cs-num">{String(time[key]).padStart(2, '0')}</span>
              <span className="cs-label">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
