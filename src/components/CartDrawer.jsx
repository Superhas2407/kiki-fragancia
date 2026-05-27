import { useState, useEffect, useRef } from 'react'
import { useCartContext } from '../context/CartContext'

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
    const lineTotal = unit > 0 ? ` — $${unit * item.quantity}` : ''
    return `- ${item.house} ${item.name} x${item.quantity}${lineTotal}`
  })
  const hasPrice = items.some(item => item.precioUSD > 0)
  const totalLine = hasPrice ? `\nTotal: $${items.reduce((acc, item) => acc + (item.precioUSD || 0) * item.quantity, 0)}\n` : ''
  return (
    `Hola KiKi Fragancia, me interesa consultar las siguientes fragancias:\n\n` +
    `${lines.join('\n')}\n` +
    totalLine +
    `\n¿Están disponibles?`
  )
}

export default function CartDrawer() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice, drawerOpen, setDrawerOpen } = useCartContext()
  const [showToast, setShowToast] = useState(false)
  const toastTimerRef = useRef(null)

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
          background: '#1A1208',
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
            padding: '0 24px',
            height: '64px',
            borderBottom: '1px solid rgba(232,228,220,0.1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{ fontFamily: "'KikiGotham', sans-serif", fontSize: '22px', color: '#FAFAF8', fontStyle: 'italic', fontWeight: 100 }}
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
                  fontWeight: 100,
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
            style={{ background: 'none', border: 'none', color: 'rgba(250,250,248,0.5)', cursor: 'pointer', padding: '11px', minWidth: '44px', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            aria-label="Cerrar carrito"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Lista de items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          {items.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '12px' }}>
              <p style={{ fontFamily: "'KikiGotham', sans-serif", fontSize: '20px', color: 'rgba(250,250,248,0.3)', fontStyle: 'italic' }}>
                El carrito está vacío
              </p>
              <p style={{ fontFamily: "'KikiGotham', sans-serif", fontSize: '12px', color: 'rgba(250,250,248,0.2)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
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
                      borderBottom: '1px solid rgba(232,228,220,0.08)',
                    }}
                  >
                    {/* Imagen */}
                    {item.image ? (
                      <img
                        src={`/products/${item.image}`}
                        alt={item.name}
                        style={{ width: '64px', height: '80px', objectFit: 'cover', flexShrink: 0 }}
                      />
                    ) : (
                      <div style={{ width: '64px', height: '80px', flexShrink: 0, background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: 9, color: 'rgba(250,250,248,0.2)', textAlign: 'center', padding: 4 }}>{item.house}</span>
                      </div>
                    )}

                    {/* Info */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <p style={{ fontFamily: "'KikiGotham', sans-serif", fontSize: '9px', color: 'rgba(250,250,248,0.35)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                        {item.house}
                      </p>
                      <p style={{ fontFamily: "'KikiGotham', sans-serif", fontSize: '17px', color: '#FAFAF8', fontWeight: 100 }}>
                        {item.name}
                      </p>
                      {unit > 0 && (
                        <p style={{ fontFamily: "'KikiGotham', sans-serif", fontSize: '16px', color: '#C4781A' }}>
                          ${lineTotal}
                        </p>
                      )}

                      {/* Cantidad + eliminar */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid rgba(232,228,220,0.15)' }}>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            style={{ width: '28px', height: '28px', background: 'none', border: 'none', color: '#FAFAF8', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            −
                          </button>
                          <span style={{ width: '32px', textAlign: 'center', fontFamily: "'KikiGotham', sans-serif", fontSize: '13px', color: '#FAFAF8', borderLeft: '1px solid rgba(232,228,220,0.15)', borderRight: '1px solid rgba(232,228,220,0.15)', lineHeight: '28px' }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            style={{ width: '28px', height: '28px', background: 'none', border: 'none', color: '#FAFAF8', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          style={{ background: 'none', border: 'none', color: 'rgba(250,250,248,0.25)', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
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
          <div style={{ padding: '20px 24px', borderTop: '1px solid rgba(232,228,220,0.1)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {totalPrice > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontFamily: "'KikiGotham', sans-serif", fontSize: '11px', color: 'rgba(250,250,248,0.4)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  Subtotal
                </span>
                <span style={{ fontFamily: "'KikiGotham', sans-serif", fontSize: '26px', color: 'var(--gold)', fontWeight: 100 }}>
                  ${totalPrice}
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
                fontWeight: 100,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                padding: '16px',
                cursor: 'pointer',
                width: '100%',
                transition: 'opacity 0.2s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              Consultar por WhatsApp →
            </button>
            <p style={{ fontFamily: "'KikiGotham', sans-serif", fontSize: '10px', color: 'rgba(250,250,248,0.2)', textAlign: 'center', letterSpacing: '0.05em' }}>
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
          fontWeight: 100,
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
