import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const GENDER_BADGE = {
  Hombre: { bg: 'rgba(201,168,76,0.15)',   color: '#C9A84C'  },
  Mujer:  { bg: 'rgba(255,182,193,0.15)',  color: '#ffb6c1'  },
  Unisex: { bg: 'rgba(250,250,248,0.10)',  color: '#FAFAF8'  },
}

function HeartIcon({ filled }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? '#C9A84C' : 'none'} stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

export default function ProductCard({ product }) {
  const navigate  = useNavigate()
  const [liked,   setLiked]   = useState(false)
  const [hovered, setHovered] = useState(false)
  const [btnHov,  setBtnHov]  = useState(false)

  const badge = GENDER_BADGE[product.genero] || GENDER_BADGE.Unisex

  return (
    <article
      onClick={() => navigate(`/tienda/${product.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#111111',
        border: `1px solid ${hovered ? 'rgba(201,168,76,0.5)' : 'rgba(201,168,76,0.2)'}`,
        display: 'flex', flexDirection: 'column',
        cursor: 'pointer',
        transition: 'border-color 0.25s ease',
      }}
    >
      {/* ── Imagen ── */}
      <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden' }}>
        <motion.img
          src={`/products/${product.image}`}
          alt={`${product.house} ${product.name}`}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />

        {/* Badge género */}
        <span style={{
          position: 'absolute', top: '10px', left: '10px',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase',
          padding: '3px 8px',
          background: badge.bg, color: badge.color,
          backdropFilter: 'blur(4px)',
        }}>
          {product.genero}
        </span>

        {/* Botón corazón */}
        <button
          onClick={e => { e.stopPropagation(); setLiked(v => !v) }}
          style={{
            position: 'absolute', top: '8px', right: '8px',
            width: '30px', height: '30px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(10,10,10,0.55)',
            border: '1px solid rgba(201,168,76,0.4)',
            backdropFilter: 'blur(4px)',
            cursor: 'pointer',
            transition: 'border-color 0.2s ease, background 0.2s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#C9A84C'; e.currentTarget.style.background = 'rgba(201,168,76,0.15)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)'; e.currentTarget.style.background = 'rgba(10,10,10,0.55)' }}
          aria-label={liked ? 'Quitar de favoritos' : 'Añadir a favoritos'}
        >
          <HeartIcon filled={liked} />
        </button>
      </div>

      {/* ── Contenido ── */}
      <div style={{ padding: '16px 16px 8px', flex: 1, display: 'flex', flexDirection: 'column', gap: 0 }}>

        {/* Casa */}
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase',
          color: '#C9A84C', margin: '0 0 6px',
        }}>
          {product.house}
        </p>

        {/* Nombre */}
        <h3 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(17px, 1.5vw, 20px)', fontStyle: 'italic', fontWeight: 400,
          color: '#FAFAF8', letterSpacing: '-0.01em', lineHeight: 1.2,
          margin: 0,
          display: '-webkit-box', WebkitLineClamp: 1,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {product.name}
        </h3>

        {/* Separador */}
        <div style={{ height: '1px', background: 'rgba(201,168,76,0.2)', margin: '8px 0' }} />

        {/* Familia + ml */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: '11px',
            color: 'rgba(250,250,248,0.6)',
          }}>
            {product.familia}
          </span>
          {product.ml && (
            <span style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: '11px',
              color: '#C9A84C',
            }}>
              {product.ml} ml
            </span>
          )}
        </div>

        {/* Ocasión — oculta en móvil */}
        {product.ocasion && (
          <p className="product-card-occasion" style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: '11px',
            color: 'rgba(250,250,248,0.4)', fontStyle: 'italic',
            margin: '4px 0 0',
            display: '-webkit-box', WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {product.ocasion}
          </p>
        )}
      </div>

      {/* ── Footer: CTA ── */}
      <div style={{ padding: '0 16px 16px' }}>
        <button
          onMouseEnter={() => setBtnHov(true)}
          onMouseLeave={() => setBtnHov(false)}
          style={{
            width: '100%',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase',
            padding: '10px 0',
            background: btnHov ? '#C9A84C' : 'transparent',
            border: '1px solid #C9A84C',
            color: btnHov ? '#0A0A0A' : '#C9A84C',
            cursor: 'pointer',
            transition: 'background 0.2s ease, color 0.2s ease',
          }}
        >
          Ver Fragancia →
        </button>
      </div>
    </article>
  )
}
