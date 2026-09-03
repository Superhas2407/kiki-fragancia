import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useIndexProducts } from '../context/SanityProductsContext'
import { useCurrency } from '../context/CurrencyContext'
import { useTasaCambio } from '../hooks/useTasaCambio'
import { toSlug } from '../lib/slugs'

// ID del producto oferta del día
const OFERTA_ID = 173

function pad(n) {
  return String(n).padStart(2, '0')
}

function getEndOfDay() {
  const now = new Date()
  const end = new Date(now)
  end.setHours(23, 59, 59, 999)
  return end
}

export default function OfertaDelDia() {
  const products = useIndexProducts()
  const navigate = useNavigate()
  const { currency } = useCurrency()
  const tasa = useTasaCambio()
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 })
  const [visible, setVisible] = useState(true)

  const product = products.find(p => p.id === OFERTA_ID)
  const active = !!product && visible

  useEffect(() => {
    const root = document.documentElement
    // Solo la barra móvil ocupa espacio junto al WhatsApp fab — la card
    // desktop vive del lado izquierdo y no lo necesita, pero el offset
    // extra ahí es inofensivo (solo sube un poco más el fab).
    root.style.setProperty('--odd-bar-h', active ? '56px' : '0px')
    return () => root.style.setProperty('--odd-bar-h', '0px')
  }, [active])

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      const end = getEndOfDay()
      const diff = Math.max(0, end - now)
      setTimeLeft({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  if (!active) return null

  const precio = currency === 'bs' && tasa
    ? `${Math.round(product.precioUSD * tasa).toLocaleString('es-VE')} Bs`
    : `REF ${product.precioUSD}`

  const slug = toSlug(product.house, product.name, product.ml)

  function goToProduct() {
    navigate(`/tienda/${slug}`)
  }

  function close(e) {
    e.stopPropagation()
    setVisible(false)
  }

  return (
    <>
      {/* Desktop (≥1024px): card completa */}
      <div className="odd-wrapper">
        <div className="odd-card">
          <button className="odd-close" onClick={() => setVisible(false)} aria-label="Cerrar">✕</button>
          <div className="odd-badge">🔥 OFERTA DEL DÍA</div>
          <div className="odd-img-wrap" onClick={goToProduct}>
            <img src={`/products/${product.image}`} alt={product.name} className="odd-img" />
          </div>
          <div className="odd-info">
            <p className="odd-house">{product.house}</p>
            <h2 className="odd-name">{product.name}</h2>
            <p className="odd-sub">{product.ml ? `${product.ml}ml` : ''}{product.familia ? ` · ${product.familia}` : ''}{product.genero ? ` · ${product.genero}` : ''}</p>
            <div className="odd-price-row">
              <span className="odd-price">{precio}</span>
            </div>
            <div className="odd-countdown">
              <span className="odd-countdown-label">Termina en</span>
              <div className="odd-timer">
                <div className="odd-timer-block">
                  <span className="odd-timer-num">{pad(timeLeft.h)}</span>
                  <span className="odd-timer-unit">h</span>
                </div>
                <span className="odd-timer-sep">:</span>
                <div className="odd-timer-block">
                  <span className="odd-timer-num">{pad(timeLeft.m)}</span>
                  <span className="odd-timer-unit">m</span>
                </div>
                <span className="odd-timer-sep">:</span>
                <div className="odd-timer-block">
                  <span className="odd-timer-num">{pad(timeLeft.s)}</span>
                  <span className="odd-timer-unit">s</span>
                </div>
              </div>
            </div>
            <button className="odd-cta" onClick={goToProduct}>Ver fragancia →</button>
          </div>
        </div>
      </div>

      {/* Mobile (<1024px): barra delgada, no invasiva */}
      <div
        className="odd-bar"
        onClick={goToProduct}
        role="button"
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter') goToProduct() }}
      >
        <div className="odd-bar-thumb">
          <img src={`/products/${product.image}`} alt={product.name} loading="lazy" />
        </div>
        <div className="odd-bar-info">
          <span className="odd-bar-tag">🔥 Oferta del día</span>
          <span className="odd-bar-name">{product.house} {product.name}</span>
        </div>
        <div className="odd-bar-right">
          <span className="odd-bar-price">{precio}</span>
          <span className="odd-bar-timer">{pad(timeLeft.h)}:{pad(timeLeft.m)}:{pad(timeLeft.s)}</span>
        </div>
        <span className="odd-bar-arrow" aria-hidden="true">→</span>
        <button className="odd-bar-close" onClick={close} aria-label="Cerrar oferta del día">✕</button>
      </div>

      <style>{`
        /* ── Desktop: card completa (oculta por defecto, visible ≥1024px) ── */
        .odd-wrapper {
          display: none;
        }
        @media (min-width: 1024px) {
          .odd-wrapper {
            display: block;
            position: fixed;
            bottom: 32px;
            left: 24px;
            z-index: 9990;
            animation: oddSlideIn 0.5s cubic-bezier(.22,.68,0,1.2) both;
          }
        }
        @keyframes oddSlideIn {
          from { transform: translateX(-110%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        .odd-card {
          background: #100C04;
          border: 1px solid rgba(201,168,76,0.4);
          border-radius: 18px;
          width: 220px;
          overflow: hidden;
          box-shadow: 0 12px 40px rgba(0,0,0,0.55);
          position: relative;
        }
        .odd-close {
          position: absolute;
          top: 8px;
          right: 10px;
          background: rgba(0,0,0,0.5);
          border: none;
          color: rgba(247,242,234,0.6);
          font-size: 12px;
          cursor: pointer;
          z-index: 2;
          border-radius: 50%;
          width: 22px;
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .odd-badge {
          background: linear-gradient(90deg, #B8860B, #C9A84C, #B8860B);
          color: #1A1208;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-align: center;
          padding: 5px 0;
        }
        .odd-img-wrap {
          background: #0A0804;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 160px;
          cursor: pointer;
          overflow: hidden;
        }
        .odd-img {
          height: 145px;
          width: auto;
          object-fit: contain;
          transition: transform 0.3s;
        }
        .odd-img-wrap:hover .odd-img {
          transform: scale(1.06);
        }
        .odd-info {
          padding: 12px 14px 14px;
        }
        .odd-house {
          color: #C9A84C;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin: 0 0 2px;
        }
        .odd-name {
          color: #F7F2EA;
          font-size: 15px;
          font-weight: 600;
          margin: 0 0 3px;
          line-height: 1.2;
        }
        .odd-sub {
          color: rgba(247,242,234,0.45);
          font-size: 11px;
          margin: 0 0 10px;
        }
        .odd-price-row {
          margin-bottom: 10px;
        }
        .odd-price {
          color: #C9A84C;
          font-size: 20px;
          font-weight: 700;
          letter-spacing: 0.02em;
        }
        .odd-countdown {
          margin-bottom: 12px;
        }
        .odd-countdown-label {
          display: block;
          color: rgba(247,242,234,0.5);
          font-size: 10px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 5px;
        }
        .odd-timer {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .odd-timer-block {
          background: rgba(201,168,76,0.12);
          border: 1px solid rgba(201,168,76,0.25);
          border-radius: 6px;
          padding: 4px 7px;
          display: flex;
          align-items: baseline;
          gap: 2px;
        }
        .odd-timer-num {
          color: #C9A84C;
          font-size: 16px;
          font-weight: 700;
          font-variant-numeric: tabular-nums;
          line-height: 1;
        }
        .odd-timer-unit {
          color: rgba(201,168,76,0.6);
          font-size: 9px;
        }
        .odd-timer-sep {
          color: #C9A84C;
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 2px;
        }
        .odd-cta {
          width: 100%;
          background: #C9A84C;
          color: #1A1208;
          border: none;
          border-radius: 8px;
          padding: 9px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          letter-spacing: 0.04em;
          transition: background 0.2s;
        }
        .odd-cta:hover {
          background: #d4b660;
        }

        /* ── Mobile (<1024px): barra delgada, no invasiva ── */
        .odd-bar {
          position: fixed;
          left: 0; right: 0;
          bottom: calc(60px + env(safe-area-inset-bottom, 0px));
          z-index: 45;
          display: flex;
          align-items: center;
          gap: 10px;
          height: 56px;
          padding: 0 40px 0 10px;
          background: rgba(16,12,4,0.97);
          border-top: 1px solid rgba(201,168,76,0.35);
          cursor: pointer;
          animation: oddBarSlideUp 0.4s cubic-bezier(.22,.68,0,1.2) both;
        }
        @media (min-width: 1024px) {
          .odd-bar { display: none; }
        }
        @keyframes oddBarSlideUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        .odd-bar-thumb {
          flex-shrink: 0;
          width: 40px;
          height: 40px;
          border-radius: 8px;
          background: #0A0804;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .odd-bar-thumb img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .odd-bar-info {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 2px;
          min-width: 0;
          flex: 1;
        }
        .odd-bar-tag {
          color: #C9A84C;
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .odd-bar-name {
          color: #F7F2EA;
          font-size: 12.5px;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .odd-bar-right {
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: center;
          gap: 2px;
        }
        .odd-bar-price {
          color: #C9A84C;
          font-size: 13.5px;
          font-weight: 700;
        }
        .odd-bar-timer {
          color: rgba(247,242,234,0.55);
          font-size: 10px;
          font-variant-numeric: tabular-nums;
        }
        .odd-bar-arrow {
          flex-shrink: 0;
          color: #C9A84C;
          font-size: 15px;
        }
        .odd-bar-close {
          position: absolute;
          top: 0; bottom: 0;
          right: 6px;
          width: 30px;
          background: none;
          border: none;
          color: rgba(247,242,234,0.45);
          font-size: 13px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .odd-bar-close:hover { color: rgba(247,242,234,0.85); }
      `}</style>
    </>
  )
}
