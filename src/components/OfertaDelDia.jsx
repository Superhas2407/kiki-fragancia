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

  if (!product || !visible) return null

  const precio = currency === 'bs' && tasa
    ? `${Math.round(product.precioUSD * tasa).toLocaleString('es-VE')} Bs`
    : `REF ${product.precioUSD}`

  const slug = toSlug(product.house || 'lattafa', product.name, product.ml)

  return (
    <div className="odd-wrapper">
      <div className="odd-card">
        {/* Botón cerrar */}
        <button className="odd-close" onClick={() => setVisible(false)} aria-label="Cerrar">✕</button>

        {/* Badge */}
        <div className="odd-badge">🔥 OFERTA DEL DÍA</div>

        {/* Imagen */}
        <div className="odd-img-wrap" onClick={() => navigate(`/tienda/${slug}`)}>
          <img
            src={`/products/${product.image}`}
            alt={product.name}
            className="odd-img"
          />
        </div>

        {/* Info */}
        <div className="odd-info">
          <p className="odd-house">Lattafa</p>
          <h2 className="odd-name">Khamrah Dukhan</h2>
          <p className="odd-sub">100ml · Oriental · Unisex</p>

          <div className="odd-price-row">
            <span className="odd-price">{precio}</span>
          </div>

          {/* Countdown */}
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

          <button className="odd-cta" onClick={() => navigate(`/tienda/${slug}`)}>
            Ver fragancia →
          </button>
        </div>
      </div>

      <style>{`
        .odd-wrapper {
          position: fixed;
          bottom: 80px;
          left: 12px;
          z-index: 9990;
          animation: oddSlideIn 0.5s cubic-bezier(.22,.68,0,1.2) both;
        }
        @media (min-width: 768px) {
          .odd-wrapper {
            bottom: 32px;
            left: 24px;
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
      `}</style>
    </div>
  )
}
