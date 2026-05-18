import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartContext } from '../context/CartContext'

// ============================================================
// VitrinaCard — Museum gallery treatment of a product
// 2-col grid, large display with product photo filling the
// vitrine, quick-add to cart on hover (no navigation needed).
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

  const notas = (product.notasCorazon || product.notasSalida || '')
    .split(',').map(s => s.trim()).filter(Boolean).slice(0, 3)

  const imgSrc = product.image ? `/products/${product.image}` : null

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
        <div className="vitrina-corner">
          <span className="vitrina-num">N° {String(product.id).padStart(3, '0')}</span>
          <span className="vitrina-familia">{product.familia}</span>
        </div>

        <div
          className="vitrina-spotlight"
          style={{ transform: hover ? 'translate(-50%, -50%) translateY(-6px)' : 'translate(-50%, -50%)' }}
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

        {/* Quick-add CTA — appears on hover */}
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
          <span className="vitrina-house">{product.house}</span>
          <span className="vitrina-meta">
            {product.tipo === 'Eau de Parfum' ? 'EDP' : product.tipo} · {product.ml}ml · {product.genero}
          </span>
        </div>
        <h3 className="vitrina-name">{product.name}</h3>
        <div className="vitrina-rule" />
        {notas.length > 0 && (
          <div className="vitrina-notes">
            {notas.map((n, i) => <span key={i} className="vitrina-note">{n}</span>)}
          </div>
        )}
      </div>
    </article>
  )
}
