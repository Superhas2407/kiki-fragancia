import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const GENDER_BADGE = {
  Masculino: { bg: 'rgba(201,168,76,0.15)', color: '#C9A84C',  border: 'rgba(201,168,76,0.3)' },
  Hombre:    { bg: 'rgba(201,168,76,0.15)', color: '#C9A84C',  border: 'rgba(201,168,76,0.3)' },
  Femenino:  { bg: 'rgba(255,182,193,0.15)', color: '#E8A0B4', border: 'rgba(232,160,180,0.3)' },
  Mujer:     { bg: 'rgba(255,182,193,0.15)', color: '#E8A0B4', border: 'rgba(232,160,180,0.3)' },
}

const UNISEX_BADGE_DARK  = { bg: 'rgba(250,250,248,0.1)',  color: '#FAFAF8',  border: 'rgba(250,250,248,0.2)' }
const UNISEX_BADGE_WARM  = { bg: 'rgba(35,26,13,0.08)',    color: '#1A1208',  border: 'rgba(35,26,13,0.25)'   }

export default function ProductCard({ product, theme = 'dark' }) {
  const navigate = useNavigate()
  const [ripples, setRipples] = useState([])
  const cardRef = useRef(null)
  const isDark = theme === 'dark'

  const handleMouseEnter = (e) => {
    const rect = cardRef.current.getBoundingClientRect()
    const id = Date.now()
    setRipples(r => [...r, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }])
    setTimeout(() => setRipples(r => r.filter(rp => rp.id !== id)), 750)

    // 3D tilt
    const card = cardRef.current
    card.style.transition = 'transform .1s ease'
  }

  const handleMouseMove = (e) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.02)`
  }

  const handleMouseLeave = () => {
    const card = cardRef.current
    if (!card) return
    card.style.transition = 'transform .55s cubic-bezier(.22,1,.36,1)'
    card.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)'
  }

  const badge = product.genero === 'Unisex'
    ? (isDark ? UNISEX_BADGE_DARK : UNISEX_BADGE_WARM)
    : (GENDER_BADGE[product.genero] || (isDark ? UNISEX_BADGE_DARK : UNISEX_BADGE_WARM))

  const imgSrc = product.image
    ? `/products/${product.image}`
    : null

  return (
    <article
      ref={cardRef}
      className={`kiki-product-card ${isDark ? 'kiki-product-card-dark' : 'kiki-product-card-light'}`}
      onClick={() => navigate(`/tienda/${product.id}`)}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ willChange: 'transform' }}
      aria-label={`${product.house} ${product.name}`}
    >
      {ripples.map(rp => (
        <span key={rp.id} className="card-ripple" style={{ left: rp.x, top: rp.y }} />
      ))}

      <div className="card-img-wrap">
        {imgSrc ? (
          <img src={imgSrc} alt={`${product.house} ${product.name}`} className="card-img-photo" />
        ) : (
          <div className="card-img-placeholder">
            <span className="card-img-label">{product.house}<br />{product.name}<br />product photo</span>
          </div>
        )}
        {product.genero && (
          <div className="card-genre-badge" style={{ background: badge.bg, color: badge.color, borderColor: badge.border }}>
            {product.genero}
          </div>
        )}
      </div>

      <div className="card-info">
        <p className="card-house">{product.house}</p>
        <p className="card-name">{product.name}</p>
        <div className="card-divider"></div>
        <div className="card-meta">
          <span className="card-familia">{product.familia}</span>
          {product.ml && <span className="card-ml">{product.ml}ml</span>}
        </div>
      </div>

      <div className="card-cta">
        <button className="card-btn" onClick={e => { e.stopPropagation(); navigate(`/tienda/${product.id}`) }}>
          Ver detalles
        </button>
      </div>
    </article>
  )
}
