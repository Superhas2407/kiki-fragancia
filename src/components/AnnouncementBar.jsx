import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const BAR_H = 40

export default function AnnouncementBar() {
  const [barClosed, setBarClosed] = useState(() => {
    try { return sessionStorage.getItem('kiki-bar-closed') === '1' }
    catch { return false }
  })
  const [popupClosed, setPopupClosed] = useState(() => {
    try { return sessionStorage.getItem('kiki-popup-closed') === '1' }
    catch { return false }
  })
  const { pathname } = useLocation()

  const popupVisible = !popupClosed && pathname === '/'

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--bar-h', barClosed ? '0px' : `${BAR_H}px`)
    return () => root.style.setProperty('--bar-h', '0px')
  }, [barClosed])

  function closeBar() {
    try { sessionStorage.setItem('kiki-bar-closed', '1') } catch {}
    setBarClosed(true)
  }

  function closePopup() {
    try { sessionStorage.setItem('kiki-popup-closed', '1') } catch {}
    setPopupClosed(true)
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

      {/* Pop-up móvil — bottom sheet */}
      {popupVisible && (
        <div className="ddp-popup-overlay" onClick={closePopup} aria-modal="true" role="dialog">
          <div className="ddp-popup" onClick={e => e.stopPropagation()}>
            <div className="ddp-sheet-handle" />

            {/* Imagen campaña */}
            <div className="ddp-sheet-img-wrap">
              <img src="/BANNERTIENDAHOMBRE.webp" alt="Día del Padre" className="ddp-sheet-img" />
              <div className="ddp-sheet-img-overlay">
                <p className="ddp-popup-eyebrow">Día del Padre · 21 de junio</p>
              </div>
            </div>

            <button className="ddp-popup-close" onClick={closePopup} aria-label="Cerrar">×</button>

            <div className="ddp-sheet-body">
              <h2 className="ddp-popup-headline">
                El regalo<br />que no olvidará
              </h2>

              <div className="ddp-popup-rule" />

              <p className="ddp-popup-body">
                Fragancias originales seleccionadas para papá.<br />
                Descuentos exclusivos · Tiempo limitado.
              </p>

              <Link to="/dia-del-padre" className="ddp-popup-btn" onClick={closePopup}>
                Ver fragancias del Día del Padre
              </Link>
              <button className="ddp-popup-skip" onClick={closePopup}>
                Ahora no
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
