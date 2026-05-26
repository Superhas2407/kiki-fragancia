import { useRef, useEffect, useState } from 'react'
import { useCartContext } from '../context/CartContext'

const BagIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
  </svg>
)

export default function CartFab() {
  const { totalItems, setDrawerOpen } = useCartContext()
  const [pulsing, setPulsing] = useState(false)
  const prevCountRef = useRef(0)

  useEffect(() => {
    if (totalItems > prevCountRef.current) {
      setPulsing(true)
      setTimeout(() => setPulsing(false), 300)
    }
    prevCountRef.current = totalItems
  }, [totalItems])

  return (
    <button
      onClick={() => setDrawerOpen(true)}
      aria-label="Abrir carrito"
      style={{
        position: 'fixed',
        bottom: '28px',
        right: '24px',
        zIndex: 60,
        width: '54px',
        height: '54px',
        background: '#1A1208',
        border: '1px solid rgba(196,120,26,0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FAFAF8',
        cursor: 'pointer',
        transition: 'border-color 0.2s ease',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = '#C4781A'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(196,120,26,0.35)'}
    >
      <BagIcon />
      {totalItems > 0 && (
        <span
          className={pulsing ? 'cart-badge-pulse' : ''}
          style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            background: '#C4781A',
            color: '#1A1208',
            width: '20px',
            height: '20px',
            fontSize: '11px',
            fontWeight: 600,
            fontFamily: "'Gotham', sans-serif",
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {totalItems > 9 ? '9+' : totalItems}
        </span>
      )}
    </button>
  )
}
