import { Link } from 'react-router-dom'
import { useIndexProducts, resolveProductImage } from '../context/SanityProductsContext'
import { toSlug } from '../lib/slugs'
import { useCurrency } from '../context/CurrencyContext'
import { useTasaCambio } from '../hooks/useTasaCambio'

const BESTSELLER_IDS_MOBILE = [88, 20, 311, 256, 172, 202, 260, 104, 247, 266]
const BESTSELLER_IDS_DESKTOP = [88, 20, 311, 256, 172]

function PriceTag({ product }) {
  const { currency } = useCurrency()
  const tasaData = useTasaCambio()
  const tasa = tasaData?.tasa
  if (!product.precioUSD) return null
  if (currency === 'bs' && tasa) {
    const bs = Math.round(product.precioUSD * tasa)
    return <span className="bs-price">Bs. {bs.toLocaleString('es-VE')}</span>
  }
  return <span className="bs-price">${product.precioUSD}</span>
}

function BsCard({ product }) {
  const img = resolveProductImage(product)
  return (
    <Link to={`/tienda/${toSlug(product.house, product.name, product.ml)}`} className="bs-card">
      <div className="bs-card-img-wrap">
        <img src={img} alt={product.name} className="bs-card-img" loading="lazy" />
      </div>
      <div className="bs-card-body">
        <p className="bs-card-house">{product.house}</p>
        <p className="bs-card-name">{product.name}</p>
        <PriceTag product={product} />
      </div>
    </Link>
  )
}

export default function BestsellerRow() {
  const products = useIndexProducts()

  const allItems = BESTSELLER_IDS_MOBILE
    .map(id => products.find(p => p.id === id))
    .filter(Boolean)

  const desktopItems = BESTSELLER_IDS_DESKTOP
    .map(id => products.find(p => p.id === id))
    .filter(Boolean)

  if (!allItems.length) return null

  return (
    <section className="bestseller-section">
      <div className="bestseller-heading-wrap">
        <p className="bestseller-label">Kiki Fragancia</p>
        <h2 className="bestseller-title">LO MÁS VENDIDO</h2>
        <div className="bestseller-rule" />
      </div>

      {/* Mobile: scroll con todos los items */}
      <div className="bs-row-wrap bs-mobile-only">
        <div className="bs-row">
          {allItems.map(p => <BsCard key={p.id} product={p} />)}
        </div>
        <p className="bs-swipe-hint">Desliza para ver más</p>
      </div>

      {/* Desktop: una sola fila de 5 */}
      <div className="bs-row-wrap bs-desktop-only">
        <div className="bs-row bs-row-desktop">
          {desktopItems.map(p => <BsCard key={p.id} product={p} />)}
        </div>
      </div>

      <div className="bestseller-cta-wrap">
        <Link to="/tienda" className="bestseller-cta">Ver toda la colección</Link>
      </div>
    </section>
  )
}
