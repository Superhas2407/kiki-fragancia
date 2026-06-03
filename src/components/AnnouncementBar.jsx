import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

const BAR_H = 40

function getCountdown() {
  const target = new Date('2026-06-18T23:59:00')
  const diff = target - new Date()
  if (diff <= 0) return null
  const d = Math.floor(diff / 86400000)
  const h = Math.floor((diff % 86400000) / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  return { d, h, m }
}

export default function AnnouncementBar() {
  const [barClosed, setBarClosed] = useState(
    () => sessionStorage.getItem('ddp-bar-closed') === '1'
  )
  const [popupClosed, setPopupClosed] = useState(
    () => sessionStorage.getItem('ddp-popup-closed') === '1'
  )
  const [timeLeft, setTimeLeft] = useState(getCountdown)
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const barVisible = !barClosed
  const popupVisible = !popupClosed && pathname === '/'

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getCountdown()), 60000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--bar-h', barVisible ? `${BAR_H}px` : '0px')
    return () => root.style.setProperty('--bar-h', '0px')
  }, [barVisible])

  function closeBar() {
    sessionStorage.setItem('ddp-bar-closed', '1')
    setBarClosed(true)
  }

  function closePopup() {
    sessionStorage.setItem('ddp-popup-closed', '1')
    setPopupClosed(true)
  }

  function goToLanding() {
    closePopup()
    navigate('/dia-del-padre')
  }

  return (
    <>
      {/* Barra desktop/tablet */}
      {barVisible && (
        <div className="announcement-bar" role="banner">
          <Link to="/dia-del-padre" className="announcement-bar-link">
            <span className="ann-segment ann-label">Día del Padre</span>
            <span className="ann-sep" />
            {timeLeft && (
              <>
                <span className="ann-segment ann-timer--full">
                  ⏳ {timeLeft.d}d : {String(timeLeft.h).padStart(2, '0')}h : {String(timeLeft.m).padStart(2, '0')}m
                </span>
                <span className="ann-segment ann-timer--short">⏳ {timeLeft.d}d</span>
                <span className="ann-sep ann-sep--hide" />
              </>
            )}
            <span className="ann-segment ann-cta ann-cta--desktop">
              Pide antes del 18 jun para entrega a tiempo →
            </span>
          </Link>
          <button className="announcement-bar-close" onClick={closeBar} aria-label="Cerrar">×</button>
        </div>
      )}

      {/* Pop-up móvil — bottom sheet */}
      {popupVisible && (
        <div className="ddp-popup-overlay" onClick={closePopup} aria-modal="true" role="dialog">
          <div className="ddp-popup" onClick={e => e.stopPropagation()}>
            <button className="ddp-popup-close" onClick={closePopup} aria-label="Cerrar">×</button>
            <p className="ddp-popup-eyebrow">Día del Padre · 21 de junio</p>
            <h2 className="ddp-popup-headline">El regalo que no olvidará</h2>
            <div className="ddp-popup-rule" aria-hidden="true" />
            <p className="ddp-popup-body">Fragancias de lujo seleccionadas para papá. Colección curada para el Día del Padre 2026.</p>
            <button className="ddp-popup-btn" onClick={goToLanding}>
              Ver la colección
            </button>
            <button className="ddp-popup-skip" onClick={closePopup}>
              No gracias
            </button>
          </div>
        </div>
      )}
    </>
  )
}
