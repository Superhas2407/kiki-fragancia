import { useState, useEffect, useRef } from 'react'
import { useCartContext } from '../context/CartContext'
import { useTheme } from '../context/ThemeContext'
import { useCurrency } from '../context/CurrencyContext'
import { diaDeLPadreDiscounts, diaDeLPadreIds } from '../data/dia-del-padre'

const WHATSAPP_NUMBER = '584149112002'

const CloseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
)

function buildMessage(items) {
  const lines = items.map(item => {
    const unit = item.precioUSD || 0
    const disc = diaDeLPadreDiscounts[item.id]
    const ddpNote = disc ? ` 🎁 ${disc}% EXTRA Día del Padre` : ''
    const priceNote = unit > 0 ? ` — REF ${unit * item.quantity}` : ''
    return `• ${item.house} ${item.name} x${item.quantity}${priceNote}${ddpNote}`
  })
  const hasPrice = items.some(item => item.precioUSD > 0)
  const totalLine = hasPrice ? `\nTotal: REF ${items.reduce((acc, item) => acc + (item.precioUSD || 0) * item.quantity, 0)}\n` : ''
  const hasDdp = items.some(item => diaDeLPadreIds.includes(item.id))
  const ddpLine = hasDdp ? '\n🎁 Aplica descuento Día del Padre en los productos indicados.\n' : ''
  return (
    `Hola! Quiero hacer el siguiente pedido:\n\n` +
    `${lines.join('\n')}\n` +
    totalLine +
    ddpLine +
    `\n¿Están disponibles?`
  )
}

export default function CartDrawer() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice, drawerOpen, setDrawerOpen } = useCartContext()
  const { theme } = useTheme()
  const { currency } = useCurrency()
  const [showToast, setShowToast] = useState(false)
  const toastTimerRef = useRef(null)

  const isWarm = theme === 'warm'
  const ink = (op) => isWarm ? `rgba(35,26,13,${Math.min(op + 0.30, 0.95)})` : `rgba(250,250,248,${op})`
  const bord = (op) => isWarm ? `rgba(35,26,13,${Math.min(op + 0.20, 0.85)})` : `rgba(232,228,220,${op})`

  useEffect(() => {
    return () => { if (toastTimerRef.current) clearTimeout(toastTimerRef.current) }
  }, [])

  function handleWhatsApp() {
    const message = buildMessage(items)
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}&ref=carrito`
    window.open(url, '_blank', 'noopener,noreferrer')
    setDrawerOpen(false)
    setShowToast(true)
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    toastTimerRef.current = setTimeout(() => setShowToast(false), 3000)
  }

  return (
    <>
      {/* Overlay */}
      <div
        onClick={() => setDrawerOpen(false)}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.55)',
          zIndex: 70,
          opacity: drawerOpen ? 1 : 0,
          pointerEvents: drawerOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          maxWidth: '420px',
          background: 'var(--bg2)',
          borderLeft: '1px solid rgba(196,120,26,0.2)',
          zIndex: 80,
          display: 'flex',
          flexDirection: 'column',
          transform: drawerOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {/* Header del drawer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 clamp(12px, 5vw, 24px)',
            height: '60px',
            borderBottom: bord(0.1),
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{ fontFamily: "'KikiGotham', sans-serif", fontSize: 'clamp(17px, 5vw, 22px)', color: ink(0.95), fontStyle: 'italic', fontWeight: 100 }}
            >
              Mi Carrito
            </span>
            {totalItems > 0 && (
              <span
                style={{
                  background: '#C4781A',
                  color: '#1A1208',
                  fontSize: '10px',
                  fontFamily: "'KikiGotham', sans-serif",
                  fontWeight: 400,
                  padding: '2px 7px',
                  letterSpacing: '0.05em',
                }}
              >
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            style={{ background: 'none', border: 'none', color: ink(0.5), cursor: 'pointer', padding: '11px', minWidth: '44px', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            aria-label="Cerrar carrito"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Lista de items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px clamp(12px, 5vw, 24px)' }}>
          {items.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '12px' }}>
              <p style={{ fontFamily: "'KikiGotham', sans-serif", fontSize: '20px', color: ink(0.3), fontStyle: 'italic' }}>
                El carrito está vacío
              </p>
              <p style={{ fontFamily: "'KikiGotham', sans-serif", fontSize: '12px', color: ink(0.2), letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Agrega fragancias desde la tienda
              </p>
            </div>
          ) : (
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '16px', listStyle: 'none', padding: 0, margin: 0 }}>
              {items.map(item => {
                const unit = item.precioUSD || 0
                const lineTotal = unit * item.quantity
                return (
                  <li
                    key={item.id}
                    style={{
                      display: 'flex',
                      gap: '14px',
                      paddingBottom: '16px',
                      borderBottom: `1px solid ${bord(0.08)}`,
                    }}
                  >
                    {/* Imagen */}
                    {item.image ? (
                      <img
                        src={`/products/${item.image}`}
                        alt={item.name}
                        style={{ width: 'clamp(52px, 14vw, 64px)', height: 'clamp(66px, 18vw, 80px)', objectFit: 'cover', flexShrink: 0 }}
                      />
                    ) : (
                      <div style={{ width: '64px', height: '80px', flexShrink: 0, background: 'var(--raised)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: 9, color: ink(0.2), textAlign: 'center', padding: 4 }}>{item.house}</span>
                      </div>
                    )}

                    {/* Info */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <p style={{ fontFamily: "'KikiGotham', sans-serif", fontSize: '9px', color: ink(0.35), letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                        {item.house}
                      </p>
                      <p style={{ fontFamily: "'KikiGotham', sans-serif", fontSize: 'clamp(14px, 4vw, 17px)', color: ink(0.95), fontWeight: 100 }}>
                        {item.name}
                      </p>
                      {currency === 'usd' && diaDeLPadreIds.includes(item.id) && (() => {
                        const disc = diaDeLPadreDiscounts[item.id]
                        return (
                          <span style={{
                            fontFamily: "'KikiGotham', sans-serif",
                            fontSize: 9, fontWeight: 700, letterSpacing: '0.10em',
                            textTransform: 'uppercase', color: '#E8F0FF',
                            background: 'linear-gradient(90deg, #0A2D72, #1A52CC 55%, #0A2D72)',
                            padding: '3px 8px', display: 'inline-block', marginBottom: 2,
                          }}>
                            {disc ? `${disc}% EXTRA · DÍA DEL PADRE` : 'DÍA DEL PADRE'}
                          </span>
                        )
                      })()}
                      {unit > 0 && (
                        <p style={{ fontFamily: "'KikiGotham', sans-serif", fontSize: '16px', color: '#C4781A' }}>
                          REF {lineTotal}
                        </p>
                      )}

                      {/* Cantidad + eliminar */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${bord(0.15)}` }}>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            style={{ width: '28px', height: '28px', background: 'none', border: 'none', color: ink(0.95), cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            −
                          </button>
                          <span style={{ width: '32px', textAlign: 'center', fontFamily: "'KikiGotham', sans-serif", fontSize: '13px', color: ink(0.95), borderLeft: `1px solid ${bord(0.15)}`, borderRight: `1px solid ${bord(0.15)}`, lineHeight: '28px' }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            style={{ width: '28px', height: '28px', background: 'none', border: 'none', color: ink(0.95), cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          style={{ background: 'none', border: 'none', color: ink(0.25), cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
                          aria-label="Eliminar"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Footer del drawer */}
        {items.length > 0 && (
          <div style={{ padding: '16px clamp(12px, 5vw, 24px)', borderTop: `1px solid ${bord(0.1)}`, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {totalPrice > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontFamily: "'KikiGotham', sans-serif", fontSize: '11px', color: ink(0.4), letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  Subtotal
                </span>
                <span style={{ fontFamily: "'KikiGotham', sans-serif", fontSize: '26px', color: 'var(--gold)', fontWeight: 100 }}>
                  REF {totalPrice}
                </span>
              </div>
            )}
            <button
              onClick={handleWhatsApp}
              style={{
                background: 'var(--gold)',
                border: 'none',
                color: '#0A0A0A',
                fontFamily: "'KikiGotham', sans-serif",
                fontSize: '11px',
                fontWeight: 400,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                padding: '15px 16px',
                cursor: 'pointer',
                width: '100%',
                transition: 'opacity 0.2s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              Consultar por WhatsApp →
            </button>
            <p style={{ fontFamily: "'KikiGotham', sans-serif", fontSize: '10px', color: ink(0.2), textAlign: 'center', letterSpacing: '0.05em' }}>
              Te responderemos para confirmar disponibilidad y precios
            </p>
          </div>
        )}
      </div>

      {/* Toast de confirmación WA */}
      <div
        style={{
          position: 'fixed',
          bottom: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#25D366',
          color: '#fff',
          fontFamily: "'KikiGotham', sans-serif",
          fontSize: '13px',
          fontWeight: 300,
          letterSpacing: '0.04em',
          padding: '12px 24px',
          zIndex: 200,
          opacity: showToast ? 1 : 0,
          pointerEvents: 'none',
          transition: 'opacity 0.4s ease',
          whiteSpace: 'nowrap',
        }}
      >
        ¡Listo! Te responderemos pronto
      </div>
    </>
  )
}
