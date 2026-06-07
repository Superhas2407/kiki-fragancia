import { useState } from 'react'
import { Link } from 'react-router-dom'

const STORAGE_KEY = 'kiki-cookie-consent'

export default function CookieBanner() {
  const [visible, setVisible] = useState(() => {
    try { return !localStorage.getItem(STORAGE_KEY) }
    catch { return false }
  })

  if (!visible) return null

  function accept() {
    try { localStorage.setItem(STORAGE_KEY, 'accepted') } catch {}
    setVisible(false)
  }

  function reject() {
    try { localStorage.setItem(STORAGE_KEY, 'rejected') } catch {}
    setVisible(false)
  }

  return (
    <div className="cookie-banner" role="dialog" aria-label="Aviso de cookies">
      <p className="cookie-banner-text">
        Usamos cookies para mejorar tu experiencia.{' '}
        <Link to="/terminos-y-condiciones" className="cookie-banner-link">
          Términos y condiciones
        </Link>
      </p>
      <div className="cookie-banner-actions">
        <button className="cookie-btn cookie-btn--reject" onClick={reject}>
          Rechazar
        </button>
        <button className="cookie-btn cookie-btn--accept" onClick={accept}>
          Aceptar
        </button>
      </div>
    </div>
  )
}
