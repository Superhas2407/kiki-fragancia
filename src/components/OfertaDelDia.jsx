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

      <style>{`
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
          background: rgba(16,12,4,0.94);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-top: 1px solid rgba(201,168,76,0.35);
          cursor: pointer;
          animation: oddBarSlideUp 0.4s cubic-bezier(.22,.68,0,1.2) both;
        }
        @media (min-width: 1024px) {
          .odd-bar {
            bottom: env(safe-area-inset-bottom, 0px);
            left: auto;
            right: 0;
            width: 380px;
            border-radius: 14px 0 0 0;
            border-left: 1px solid rgba(201,168,76,0.35);
          }
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
    </div>
  )
}
