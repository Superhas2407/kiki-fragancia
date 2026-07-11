import { useState, useEffect, useRef } from 'react'
import { useCartContext } from '../context/CartContext'
import { useTheme } from '../context/ThemeContext'
import { useCurrency } from '../context/CurrencyContext'
import { toSlug } from '../lib/slugs'
import { resolveProductImage } from '../context/SanityProductsContext'

const WHATSAPP_NUMBER = '584149112002'

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
)

const WAIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.17 1.535 5.943L.057 23.571a.5.5 0 00.614.634l5.84-1.53A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.877 9.877 0 01-5.031-1.371l-.36-.214-3.733.979.995-3.63-.235-.374A9.861 9.861 0 012.118 12C2.118 6.533 6.533 2.118 12 2.118c5.467 0 9.882 4.415 9.882 9.882 0 5.467-4.415 9.882-9.882 9.882z"/>
  </svg>
)

function buildMessage(items) {
  const lines = items.map(item => {
    const unit = item.precioUSD || 0
    const priceNote = unit > 0 ? ` — REF $${unit}` : ''
    const mlNote = item.ml ? ` ${item.ml}ml` : ''
    const slug = toSlug(item.house, item.name, item.ml)
    const link = `https://kikifragancia.com/tienda/${slug}`
    return `• *${item.house} ${item.name}*${mlNote} x${item.quantity}${priceNote}\n  ${link}`
  })
  const hasPrice = items.some(item => item.precioUSD > 0)
  const total = items.reduce((acc, item) => acc + (item.precioUSD || 0) * item.quantity, 0)
  const totalLine = hasPrice ? `\n*Total: REF $${total}*\n` : ''
  return (
    `Hola! Quiero hacer el siguiente pedido:\n\n` +
    `${lines.join('\n\n')}\n` +
    totalLine +
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
  const imgBg = isWarm ? '#EDE4D2' : '#1A1512'

  useEffect(() => {
    return () => { if (toastTimerRef.current) clearTimeout(toastTimerRef.current) }
  }, [])

  function handleWhatsApp() {
    if (window.fbq) window.fbq('track', 'Contact')
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
          zIndex: 110,
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
            padding: '0 clamp(14px, 5vw, 28px)',
            height: '64px',
            borderBottom: `1px solid ${bord(0.1)}`,
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontFamily: "'KikiGotham', sans-serif", fontSize: '18px', color: ink(0.92), fontStyle: 'italic', fontWeight: 300, letterSpacing: '0.02em' }}>
              Mi Carrito
            </span>
            {totalItems > 0 && (
              <span style={{
                background: 'var(--gold)',
                color: '#0A0806',
                fontSize: '10px',
                fontFamily: "'KikiGotham', sans-serif",
                fontWeight: 400,
                padding: '2px 8px',
                letterSpacing: '0.06em',
                minWidth: '22px',
                textAlign: 'center',
              }}>
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            style={{ background: 'none', border: 'none', color: ink(0.38), cursor: 'pointer', padding: '12px', minWidth: '44px', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            aria-label="Cerrar carrito"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Lista de items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px clamp(14px, 5vw, 28px)' }}>
          {items.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '10px' }}>
              <p style={{ fontFamily: "'KikiGotham', sans-serif", fontSize: '22px', color: ink(0.25), fontStyle: 'italic', fontWeight: 300 }}>
                El carrito está vacío
              </p>
              <p style={{ fontFamily: "'KikiGotham', sans-serif", fontSize: '11px', color: ink(0.18), letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Agrega fragancias desde la tienda
              </p>
            </div>
          ) : (
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0', listStyle: 'none', padding: 0, margin: 0 }}>
              {items.map(item => {
                const unit = item.precioUSD || 0
                const lineTotal = unit * item.quantity
                const imgSrc = resolveProductImage(item)
                const disc = item.descuento
                return (
                  <li
                    key={item.id}
                    style={{
                      display: 'flex',
                      gap: '16px',
                      padding: '18px 0',
                      borderBottom: `1px solid ${bord(0.08)}`,
                    }}
                  >
                    {/* Imagen limpia */}
                    <div style={{
                      width: '84px', height: '108px', flexShrink: 0,
                      background: imgBg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      overflow: 'hidden',
                    }}>
                      {imgSrc ? (
                        <img
                          src={imgSrc}
                          alt={item.name}
                          style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '8px' }}
                        />
                      ) : (
                        <span style={{ fontSize: 9, color: ink(0.2), textAlign: 'center', padding: 4 }}>{item.house}</span>
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                      <p style={{ fontFamily: "'KikiGotham', sans-serif", fontSize: '9px', color: ink(0.32), letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '3px' }}>
                        {item.house}
                      </p>
                      <p style={{ fontFamily: "'KikiGotham', sans-serif", fontSize: 'clamp(13px, 3.5vw, 16px)', color: ink(0.92), fontWeight: 300, lineHeight: 1.25, marginBottom: '3px' }}>
                        {item.name}
                      </p>
                      {item.ml && (
                        <p style={{ fontFamily: "'KikiGotham', sans-serif", fontSize: '10px', color: ink(0.28), letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>
                          {item.ml} ml
                        </p>
                      )}

                      {currency === 'usd' && disc && (
                        <span style={{
                          fontFamily: "'KikiGotham', sans-serif",
                          fontSize: 8, fontWeight: 700, letterSpacing: '0.10em',
                          textTransform: 'uppercase', color: '#1A1208',
                          background: 'linear-gradient(90deg, #B8902F, #E8C96A 55%, #B8902F)',
                          padding: '3px 7px', display: 'inline-block', marginBottom: '6px', alignSelf: 'flex-start',
                        }}>
                          {disc}% DESCUENTO
                        </span>
                      )}

                      {/* Precio */}
                      {unit > 0 && (
                        <div style={{ marginBottom: '10px' }}>
                          <span style={{ fontFamily: "'KikiGotham', sans-serif", fontSize: '20px', fontStyle: 'italic', fontWeight: 300, color: 'var(--gold)', letterSpacing: '-0.01em' }}>
                            REF {lineTotal}
                          </span>
                          {item.quantity > 1 && (
                            <span style={{ fontFamily: "'KikiGotham', sans-serif", fontSize: '10px', color: ink(0.28), marginLeft: '6px' }}>
                              (${unit} c/u)
                            </span>
                          )}
                        </div>
                      )}

                      {/* Cantidad + eliminar */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: 'auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${bord(0.18)}` }}>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            style={{ width: '30px', height: '30px', background: 'none', border: 'none', color: ink(0.9), cursor: 'pointer', fontSize: '17px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            −
                          </button>
                          <span style={{ width: '34px', textAlign: 'center', fontFamily: "'KikiGotham', sans-serif", fontSize: '13px', color: ink(0.9), borderLeft: `1px solid ${bord(0.18)}`, borderRight: `1px solid ${bord(0.18)}`, lineHeight: '30px' }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            style={{ width: '30px', height: '30px', background: 'none', border: 'none', color: ink(0.9), cursor: 'pointer', fontSize: '17px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          style={{ background: 'none', border: 'none', color: ink(0.22), cursor: 'pointer', padding: '6px', display: 'flex', alignItems: 'center' }}
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
          <div style={{
            padding: '20px clamp(14px, 5vw, 28px)',
            paddingBottom: 'calc(20px + env(safe-area-inset-bottom, 0px))',
            borderTop: `1px solid ${bord(0.12)}`,
            display: 'flex', flexDirection: 'column', gap: '14px',
          }}>
            {totalPrice > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingBottom: '4px' }}>
                <span style={{ fontFamily: "'KikiGotham', sans-serif", fontSize: '10px', color: ink(0.35), letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                  Total estimado
                </span>
                <span style={{ fontFamily: "'KikiGotham', sans-serif", fontSize: '30px', fontStyle: 'italic', fontWeight: 300, color: 'var(--gold)', letterSpacing: '-0.02em' }}>
                  REF {totalPrice}
                </span>
              </div>
            )}
            <button
              onClick={handleWhatsApp}
              style={{
                background: 'var(--gold)',
                border: 'none',
                color: '#0A0806',
                fontFamily: "'KikiGotham', sans-serif",
                fontSize: '11px',
                fontWeight: 400,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                padding: '16px 20px',
                cursor: 'pointer',
                width: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '9px',
                transition: 'opacity 0.2s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              <WAIcon />
              Consultar por WhatsApp
            </button>
            <p style={{ fontFamily: "'KikiGotham', sans-serif", fontSize: '10px', color: ink(0.18), textAlign: 'center', letterSpacing: '0.04em', lineHeight: 1.5 }}>
              Confirmamos disponibilidad y procesamos tu pedido
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
