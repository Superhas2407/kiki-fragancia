import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const BAR_H = 40

export default function AnnouncementBar() {
  const [barClosed, setBarClosed] = useState(() => {
    try { return sessionStorage.getItem('kiki-bar-closed') === '1' }
    catch { return false }
  })
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--bar-h', barClosed ? '0px' : `${BAR_H}px`)
    return () => root.style.setProperty('--bar-h', '0px')
  }, [barClosed])

  function closeBar() {
    try { sessionStorage.setItem('kiki-bar-closed', '1') } catch {}
    setBarClosed(true)
  }

  return (
    <>
      {/* Barra superior */}
      {!barClosed && (
        <div className="announcement-bar">
          <div className="ann-marquee-track">
            {[0, 1, 2, 3, 4, 5].map(i => (
              <div key={i} className="ann-marquee-content" aria-hidden={i > 0}>
                <span className="ann-label">Fragancias 100% Originales</span>
                <span className="ann-dot">✦</span>
                <span className="ann-label">Envíos en Venezuela</span>
                <span className="ann-dot">✦</span>
                <span className="ann-label">Originales Verificadas</span>
                <span className="ann-dot">✦</span>
              </div>
            ))}
          </div>
          <button className="announcement-bar-close" onClick={closeBar} aria-label="Cerrar">×</button>
        </div>
      )}

    </>
  )
}
