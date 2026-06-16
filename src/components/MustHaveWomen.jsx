import { Link } from 'react-router-dom'
import { useIndexProducts, resolveProductImage } from '../context/SanityProductsContext'
import { toSlug } from '../lib/slugs'
import { useCurrency } from '../context/CurrencyContext'
import { useTasaCambio } from '../hooks/useTasaCambio'

const WOMEN_IDS = [107, 108, 240, 241, 87, 131, 81, 78, 208, 209]

function PriceTag({ product }) {
  const { currency } = useCurrency()
  const tasa = useTasaCambio()
  if (!product.precioUSD) return null
  if (currency === 'bs' && tasa) {
    const bs = Math.round(product.precioUSD * tasa)
    return <span className="bs-price">Bs. {bs.toLocaleString('es-VE')}</span>
  }
  return <span className="bs-price">${product.precioUSD}</span>
}

function Card({ product }) {
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

export default function MustHaveWomen() {
  const products = useIndexProducts()
  const items = WOMEN_IDS.map(id => products.find(p => p.id === id)).filter(Boolean)
  if (!items.length) return null

  return (
    <section className="bestseller-section">
      <div className="bestseller-heading-wrap">
        <p className="bestseller-label">Kiki Fragancia</p>
        <h2 className="bestseller-title">DEBERÍAS COMPRAR</h2>
        <p className="mhm-subtitle">Para mujeres</p>
        <div className="bestseller-rule" />
      </div>

      <div className="bs-row-wrap bs-mobile-only">
        <div className="bs-row">
          {items.map(p => <Card key={p.id} product={p} />)}
        </div>
        <p className="bs-swipe-hint">Desliza para ver más</p>
      </div>

      <div className="bs-row-wrap bs-desktop-only">
        <div className="bs-row bs-row-desktop">
          {items.slice(0, 5).map(p => <Card key={p.id} product={p} />)}
        </div>
      </div>

      <div className="bestseller-cta-wrap">
        <Link to="/tienda?genero=Femenino" className="bestseller-cta">Ver fragancias para mujeres</Link>
      </div>
    </section>
  )
}
