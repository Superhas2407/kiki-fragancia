import { Link } from 'react-router-dom'
import { useWishlist } from '../context/WishlistContext'
import { useCartContext } from '../context/CartContext'
import { useTheme } from '../context/ThemeContext'
import { useCurrency } from '../context/CurrencyContext'
import { useTasaCambio } from '../hooks/useTasaCambio'
import { useIndexProducts, resolveProductImage } from '../context/SanityProductsContext'
import { useAuth } from '../context/AuthContext'

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const HeartIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
  </svg>
)

export default function WishlistDrawer() {
  const allProducts = useIndexProducts()
  const { ids, toggle, drawerOpen, setDrawerOpen, setAuthModalOpen } = useWishlist()
  const { addItem } = useCartContext()
  const { theme } = useTheme()
  const { currency } = useCurrency()
  const tasa = useTasaCambio()
  const { session } = useAuth()

  const products = allProducts.filter(p => ids.includes(p.id))

  function handleAddAll() {
    products.forEach(p => addItem(p))
    setDrawerOpen(false)
  }

  function handleClear() {
    ids.forEach(id => toggle(id))
  }

  function formatPrice(product) {
    if (!product.precioUSD) return null
    if (currency === 'bs' && tasa) {
      try {
        return 'Bs. ' + Math.round(product.precioUSD * tasa).toLocaleString('es-VE')
      } catch {
        return 'Bs. ' + Math.round(product.precioUSD * tasa).toLocaleString()
      }
    }
    return `REF ${product.precioUSD}`
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={`wl-overlay${drawerOpen ? ' open' : ''}`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        className={`wl-drawer${drawerOpen ? ' open' : ''}`}
        role="dialog"
        aria-label="Lista de deseos"
        aria-modal="true"
      >
        {/* Header */}
        <div className="wl-header">
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 0 }}>
            <span className="wl-title">Lista de deseos</span>
            {products.length > 0 && (
              <span className="wl-count">{products.length} {products.length === 1 ? 'fragancia' : 'fragancias'}</span>
            )}
          </div>
          <button
            className="wl-close-btn"
            onClick={() => setDrawerOpen(false)}
            aria-label="Cerrar lista de deseos"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Banner login si no hay sesión y hay items */}
        {!session && products.length > 0 && (
          <div style={{
            margin: '0 0 0 0', padding: '12px 20px',
            background: 'rgba(201,168,76,0.07)',
            borderBottom: '1px solid rgba(201,168,76,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          }}>
            <p style={{ margin: 0, fontSize: 11, color: 'rgba(247,242,234,0.65)', lineHeight: 1.4 }}>
              Inicia sesión para guardar tu lista en todos tus dispositivos
            </p>
            <button
              onClick={() => { setDrawerOpen(false); setAuthModalOpen(true) }}
              style={{
                flexShrink: 0, padding: '7px 14px', background: 'none',
                border: '1px solid rgba(201,168,76,0.5)', color: '#C9A84C',
                fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer',
              }}
            >
              Entrar
            </button>
          </div>
        )}

        {/* Body */}
        <div className="wl-body">
          {products.length === 0 ? (
            <div className="wl-empty">
              <div className="wl-empty-icon">
                <HeartIcon />
              </div>
              <p className="wl-empty-text">Tu lista de deseos está vacía</p>
              <Link
                to="/tienda"
                className="wl-empty-link"
                onClick={() => setDrawerOpen(false)}
              >
                Explorar colección
              </Link>
            </div>
          ) : (
            products.map(product => {
              const price = formatPrice(product)
              return (
                <div key={product.id} className="wl-item">
                  {(() => {
                    const imgSrc = resolveProductImage(product)
                    return imgSrc ? (
                      <img src={imgSrc} alt={`${product.house} ${product.name}`} className="wl-item-img" />
                    ) : (
                      <div className="wl-item-img wl-item-img--empty">
                        <span>{product.house}</span>
                      </div>
                    )
                  })()}
                  <div className="wl-item-info">
                    <div className="wl-item-house">{product.house}</div>
                    <div className="wl-item-name">{product.name}</div>
                    {product.ml && <div className="wl-item-ml">{product.ml} ml</div>}
                    {price && <div className="wl-item-price">{price}</div>}
                  </div>
                  <div className="wl-item-actions">
                    <button
                      className="wl-item-remove"
                      onClick={() => toggle(product.id)}
                      aria-label={`Quitar ${product.name} de la lista`}
                      title="Quitar de la lista"
                    >
                      ×
                    </button>
                    <button
                      className="wl-item-cart-btn"
                      onClick={() => addItem(product)}
                      aria-label={`Agregar ${product.name} al carrito`}
                    >
                      + Carrito
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer */}
        {products.length > 0 && (
          <div className="wl-footer">
            <button className="wl-footer-primary" onClick={handleAddAll}>
              Agregar todo al carrito
            </button>
            <button className="wl-footer-secondary" onClick={handleClear}>
              Vaciar lista
            </button>
          </div>
        )}
      </div>
    </>
  )
}
