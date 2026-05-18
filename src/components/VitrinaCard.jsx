import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

// ============================================================
// VitrinaCard — Museum gallery treatment of a product
// 2-col grid, large display with bottle/photo floating on
// familia-tinted pedestal, info row below with notes preview.
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

export default function VitrinaCard({ product }) {
  const navigate = useNavigate()
  const cardRef = useRef(null)
  const [hover, setHover] = useState(false)

  const notas = (product.notasCorazon || product.notasSalida || '')
    .split(',').map(s => s.trim()).filter(Boolean).slice(0, 3)

  const imgSrc = product.image ? `/products/${product.image}` : null

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

        <div className="vitrina-pedestal" />

        <div
          className="vitrina-spotlight"
          style={{ transform: hover ? 'translateX(-50%) translateY(-8px)' : 'translateX(-50%) translateY(0)' }}
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
      </div>

      <div className="vitrina-info">
        <div className="vitrina-info-row">
          <span className="vitrina-house">{product.house}</span>
          <span className="vitrina-meta">{product.tipo === 'Eau de Parfum' ? 'EDP' : product.tipo} · {product.ml}ml · {product.genero}</span>
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
