import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCartContext } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useIndexProducts, resolveProductImage } from '../context/SanityProductsContext'
import { useTasaCambio } from '../hooks/useTasaCambio'
import { useCurrency } from '../context/CurrencyContext'

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
  Masculino: 'var(--gold)', // theme-aware
  Hombre:    'var(--gold)',
  Femenino:  '#E8A0B4', // pink
  Mujer:     '#E8A0B4',
  Unisex:    '#E0DDD4', // off-white
}

function famStyle(familia) {
  const m = FAMILIA_COLORS[familia] || { c: 'var(--gold)', c2: '#3D2F12' }
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

export default function VitrinaCard({ product, badge = null, ribbon = null, ribbonVariant = null, discount = null }) {
  const allProducts = useIndexProducts()
  const { addItem } = useCartContext()
  const { toggle: wishlistToggle, isWishlisted } = useWishlist()
  const navigate = useNavigate()
  const cardRef = useRef(null)
  const [hover, setHover] = useState(false)
  const [added, setAdded] = useState(false)

  const wishlisted = isWishlisted(product.id)

  function handleWishlist(e) {
    e.preventDefault()
    e.stopPropagation()
    wishlistToggle(product.id)
  }

  const variants = product.variantIds
    ? allProducts.filter(p => product.variantIds.includes(p.id)).sort((a, b) => a.ml - b.ml)
    : []

  function handleVariant(e, variantId) {
    e.preventDefault()
    e.stopPropagation()
    navigate(`/tienda/${variantId}`)
  }

  const tasa = useTasaCambio()
  const { currency } = useCurrency()
  const imgSrc = resolveProductImage(product)
  const genderDot = GENDER_DOT[product.genero] || GENDER_DOT.Unisex

  // Quitar redundancia: "Afnan 9 AM Dive" con house "Afnan" → "9 AM Dive"
  const displayName = product.name.toLowerCase().startsWith(product.house.toLowerCase() + ' ')
    ? product.name.slice(product.house.length + 1)
    : product.name

  function handleAdd(e) {
    e.stopPropagation()
    e.preventDefault()
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <Link
      ref={cardRef}
      to={`/tienda/${product.id}`}
      className="vitrina-card"
      style={famStyle(product.familia)}
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
          {!ribbon && <span className="vitrina-familia">{product.familia}</span>}
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

        {badge && (
          <span className="badge-regalo">{badge}</span>
        )}

        {ribbon && (
          <div className={`vitrina-ribbon${ribbonVariant ? ` vitrina-ribbon--${ribbonVariant}` : ''}`} aria-hidden="true">
            <span>{ribbon}</span>
          </div>
        )}

        {/* Wishlist heart button */}
        <button
          type="button"
          className={`vitrina-heart-btn${wishlisted ? ' active' : ''}`}
          onClick={handleWishlist}
          aria-label={wishlisted ? 'Quitar de lista de deseos' : 'Agregar a lista de deseos'}
        >
          {wishlisted ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#C9A84C" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
          )}
        </button>

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
            {({'Eau de Parfum': 'EDP', 'Eau de Toilette': 'EDT', 'Eau de Cologne': 'EDC', 'Parfum': 'PDM'})[product.tipo] ?? product.tipo} · {product.ml}ml
          </span>
        </div>
        <h3 className="vitrina-name">{displayName}</h3>
        {(() => {
          const allPrices = variants.length > 1
            ? variants.map(v => v.precioUSD).filter(p => p > 0)
            : product.precioUSD > 0 ? [product.precioUSD] : []
          if (!allPrices.length) return null
          const minPrice = Math.min(...allPrices)
          const hasRange = variants.length > 1 && allPrices.length > 1
          // discPrice eliminado — se muestra precio original con badge de %

          // Modo Bs — precio base sin descuento, sin badges
          const showBs = currency === 'bs' && tasa
          const bsFmt = showBs
            ? 'Bs. ' + (() => { try { return Math.round(minPrice * tasa).toLocaleString('es-VE') } catch { return Math.round(minPrice * tasa).toLocaleString() } })()
            : null

          if (showBs) {
            return (
              <div className="vitrina-price">
                <div className="vitrina-price-disc-block">
                  <span className="vitrina-price-usd vitrina-price-usd--big">
                    {hasRange ? 'Desde ' : ''}{bsFmt}
                  </span>
                </div>
              </div>
            )
          }

          return (
            <div className="vitrina-price">
              <div className="vitrina-price-disc-block">
                {discount ? (
                  <span className="vitrina-price-badge vitrina-price-badge--ddp">{discount}% EXTRA · DÍA DEL PADRE</span>
                ) : (
                  <span className="vitrina-price-badge">PROMO DIVISA</span>
                )}
                <span className="vitrina-price-usd vitrina-price-usd--big">
                  {hasRange ? 'Desde ' : ''}REF: {minPrice}
                </span>
              </div>
            </div>
          )
        })()}
      </div>
    </Link>
  )
}
