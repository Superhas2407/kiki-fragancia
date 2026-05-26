import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartContext } from '../context/CartContext'

// ============================================================
// VitrinaCard v2 — Museum gallery treatment of a product
// - Gold corner brackets (gallery frame)
// - Pedestal restored (spotlight 78%)
// - Vignette inferior reforzada
// - Eyebrow "— Corazón" / "— Salida" sobre notas
// - Gender dot (color por género)
// - N° con line under (editorial)
// - Quick-add al carrito en hover
// ============================================================

const FAMILIA_COLORS = {
  'Amaderado':         { c: '#8B6332', c2: '#3A2719' },
  'Oriental':          { c: '#B65A2D', c2: '#4C2014' },
  'Floral':            { c: '#C77B9E', c2: '#4D2434' },
  'Floral Oriental':   { c: '#A6566B', c2: '#451E2A' },
  'Floral Amaderado':  { c: '#9A6E5C', c2: '#3A2218' },
  'Floral Frutal':     { c: '#C77F58', c2: '#48241A' },
  'Frutal':            { c: '#C77F3D', c2: '#48261A' },
  'Frutal Amaderado':  { c: '#A56E4A', c2: '#3F2218' },
  'Gourmand':          { c: '#7B4F2A', c2: '#321E10' },
  'Cítrico':           { c: '#D4B048', c2: '#42351C' },
  'Aromático':         { c: '#6F8A5C', c2: '#26321E' },
}

const GENDER_DOT = {
  Masculino: '#C9A84C', // gold
  Hombre:    '#C9A84C',
  Femenino:  '#E8A0B4', // pink
  Mujer:     '#E8A0B4',
  Unisex:    '#E0DDD4', // off-white
}

function famStyle(familia) {
  const m = FAMILIA_COLORS[familia] || { c: '#C9A84C', c2: '#3D2F12' }
  return { '--fam-c': m.c, '--fam-c2': m.c2 }
}

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

export default function VitrinaCard({ product }) {
  const navigate = useNavigate()
  const { addItem } = useCartContext()
  const cardRef = useRef(null)
  const [hover, setHover] = useState(false)
  const [added, setAdded] = useState(false)

  const imgSrc = product.image ? `/products/${product.image}` : null
  const genderDot = GENDER_DOT[product.genero] || GENDER_DOT.Unisex

  function handleAdd(e) {
    e.stopPropagation()
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <article
      ref={cardRef}
      className="vitrina-card"
      style={famStyle(product.familia)}
      onClick={() => navigate(`/tienda/${product.id}`)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label={`${product.house} ${product.name}`}
    >
      <div className="vitrina-display">
        {/* Gallery frame — gold corner brackets */}
        <span className="vitrina-frame-corner tl" aria-hidden="true" />
        <span className="vitrina-frame-corner tr" aria-hidden="true" />
        <span className="vitrina-frame-corner bl" aria-hidden="true" />
        <span className="vitrina-frame-corner br" aria-hidden="true" />

        <div className="vitrina-corner">
          <div className="vitrina-num">
            <span>N°&nbsp;{String(product.id).padStart(3, '0')}</span>
            <span className="vitrina-num-line" aria-hidden="true" />
          </div>
          <span className="vitrina-familia">{product.familia}</span>
        </div>

        <div
          className="vitrina-spotlight"
          style={{ transform: hover ? 'translate(-50%, -50%) translateY(-8px)' : 'translate(-50%, -50%)' }}
        >
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={`${product.house} ${product.name}`}
              className="vitrina-img"
            />
          ) : (
            <div className="vitrina-placeholder">
              <span>{product.house}<br />{product.name}</span>
            </div>
          )}
        </div>

        <div className="vitrina-pedestal" />
        <div className="vitrina-vignette" aria-hidden="true" />

        {/* Quick-add CTA */}
        <button
          type="button"
          className={`vitrina-quick-add${hover ? ' visible' : ''}${added ? ' added' : ''}`}
          onClick={handleAdd}
          aria-label={added ? 'Agregado al carrito' : 'Agregar al carrito'}
        >
          {added ? (
            <>
              <CheckIcon />
              <span>Agregado</span>
            </>
          ) : (
            <>
              <PlusIcon />
              <span>Carrito</span>
            </>
          )}
        </button>
      </div>

      <div className="vitrina-info">
        <div className="vitrina-info-row">
          <span className="vitrina-house">
            <span className="vitrina-gender-dot" style={{ background: genderDot }} aria-hidden="true" />
            {product.house}
          </span>
          <span className="vitrina-meta">
            {product.tipo === 'Eau de Parfum' ? 'EDP' : product.tipo} · {product.ml}ml · {product.genero}
          </span>
        </div>
        <h3 className="vitrina-name">{product.name}</h3>
        {product.precioUSD > 0 && (
          <div className="vitrina-price">
            <span className="vitrina-price-usd">${product.precioUSD}</span>
            {product.precioBS > 0 && (
              <span className="vitrina-price-bs">Bs. {product.precioBS.toLocaleString('es-VE')}</span>
            )}
          </div>
        )}
      </div>
    </article>
  )
}
