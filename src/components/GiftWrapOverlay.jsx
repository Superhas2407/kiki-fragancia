import { useState } from 'react'

const SESSION_KEY = 'ddp-cards-unwrapped'

/**
 * Envoltura de regalo — se muestra solo la primera vez por sesión.
 * Todos los GiftWrapOverlay de la app comparten el mismo flag en sessionStorage.
 * Después de abrir uno cualquiera, los demás ya no aparecen al recargar.
 *
 * @param {function} onOpen  callback opcional cuando se abre
 */
export default function GiftWrapOverlay({ onOpen }) {
  const [phase, setPhase] = useState('wrapped') // wrapped | opening | open

  function handleClick(e) {
    e.preventDefault()
    e.stopPropagation()
    if (phase !== 'wrapped') return
    sessionStorage.setItem(SESSION_KEY, '1')
    setPhase('opening')
    onOpen?.()
    setTimeout(() => setPhase('open'), 520)
  }

  if (phase === 'open') return null
  return (
    <div
      className={`gift-wrap-ov${phase === 'opening' ? ' gift-wrap-ov--opening' : ''}`}
      onClick={handleClick}
      role="button"
      aria-label="Toca para abrir tu regalo"
    >
      <div className="gw-half gw-half--top" />
      <div className="gw-half gw-half--bot" />
      <div className="gw-rib-v" />
      <div className="gw-bow">★</div>
      <span className="gw-hint">Toca para abrir</span>
    </div>
  )
}

/** Hook para saber si mostrar envoltorios en esta sesión */
export function useShowWraps() {
  return useState(() => sessionStorage.getItem(SESSION_KEY) !== '1')[0]
}
