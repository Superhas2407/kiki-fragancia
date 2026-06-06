import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

const BAR_H = 40

export default function AnnouncementBar() {
  const [barClosed, setBarClosed] = useState(() => {
    try { return sessionStorage.getItem('ddp-bar-closed') === '1' }
    catch { return false }
  })
  const [popupClosed, setPopupClosed] = useState(() => {
    try { return sessionStorage.getItem('ddp-popup-closed') === '1' }
    catch { return false }
  })
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const barVisible = !barClosed
  const popupVisible = !popupClosed && pathname === '/'

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--bar-h', barVisible ? `${BAR_H}px` : '0px')
    return () => root.style.setProperty('--bar-h', '0px')
  }, [barVisible])

  function closeBar() {
    try { sessionStorage.setItem('ddp-bar-closed', '1') } catch {}
    setBarClosed(true)
  }

  function closePopup() {
    try { sessionStorage.setItem('ddp-popup-closed', '1') } catch {}
    setPopupClosed(true)
  }

  function goToLanding() {
    closePopup()
    navigate('/dia-del-padre', { state: { scrollToGrid: true } })
  }

  return (
    <>
      {/* Barra desktop/tablet */}
      {barVisible && (
        <div className="announcement-bar">
          <Link to="/dia-del-padre" className="ann-marquee-link">
            <div className="ann-marquee-track">
              {[0, 1, 2, 3, 4, 5].map(i => (
                <div key={i} className="ann-marquee-content" aria-hidden={i > 0}>
                  <span className="ann-label">10% EXTRA EN FRAGANCIAS DEL DÍA DEL PADRE</span>
                  <span className="ann-dot">✦</span>
                </div>
              ))}
            </div>
          </Link>
          <button className="announcement-bar-close" onClick={closeBar} aria-label="Cerrar">×</button>
        </div>
      )}

      {/* Pop-up móvil */}
      {popupVisible && (
        <div className="ddp-popup-overlay" onClick={closePopup} aria-modal="true" role="dialog" aria-labelledby="ddp-popup-title">
          <div className="ddp-popup" onClick={e => e.stopPropagation()}>
            <button className="ddp-popup-close" onClick={closePopup} aria-label="Cerrar">×</button>

            {/* Franja dorada superior */}
            <div className="ddp-popup-top-bar" />

            <p className="ddp-popup-eyebrow">Día del Padre · 21 de junio</p>

            {/* Descuento grande */}
            <div className="ddp-popup-discount">
              <span className="ddp-popup-discount-label">DESCUENTO</span>
              <span className="ddp-popup-discount-label ddp-popup-discount-label--accent">EXTRA</span>
            </div>

            <h2 id="ddp-popup-title" className="ddp-popup-headline">El regalo que no olvidará</h2>

            <div className="ddp-popup-rule" aria-hidden="true" />

            <p className="ddp-popup-body">
              Fragancias originales seleccionadas para papá.<br />Solo en divisa · Tiempo limitado.
            </p>

            <button className="ddp-popup-btn" onClick={goToLanding}>
              Descubrir la colección
            </button>
            <button className="ddp-popup-skip" onClick={closePopup}>
              Ahora no
            </button>
          </div>
        </div>
      )}
    </>
  )
}
