import { useState } from 'react'

const SESSION_KEY = 'ddp-cards-unwrapped'

export default function GiftWrapOverlay({ onOpen }) {
  const [phase, setPhase] = useState('wrapped') // wrapped | opening | open

  function handleClick(e) {
    e.preventDefault()
    e.stopPropagation()
    if (phase !== 'wrapped') return
    try { sessionStorage.setItem(SESSION_KEY, '1') } catch {}
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
      <div className="gw-paper">
        <div className="gw-half gw-half--top" />
        <div className="gw-half gw-half--bot" />
        <div className="gw-rib-v" />
        <div className="gw-shine" aria-hidden="true" />
      </div>
      <div className="gw-bow">
        <span className="gw-bow-inner" />
      </div>
      <div className="gw-tap-ring" aria-hidden="true" />
      <span className="gw-hint">Toca para revelar</span>
    </div>
  )
}

export function useShowWraps() {
  return useState(() => {
    try { return sessionStorage.getItem(SESSION_KEY) !== '1' }
    catch { return true }
  })[0]
}
