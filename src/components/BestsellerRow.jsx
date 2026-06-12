import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useIndexProducts, resolveProductImage } from '../context/SanityProductsContext'
import { useCurrency } from '../context/CurrencyContext'
import { useTasaCambio } from '../hooks/useTasaCambio'

const BESTSELLER_IDS = [88, 20, 311, 256, 172, 202, 260, 104, 247, 266]

function PriceTag({ product }) {
  const { currency } = useCurrency()
  const { tasa } = useTasaCambio()
  if (!product.precioUSD) return null
  if (currency === 'usd') {
    return (
      <span className="bs-card-price">
        <span className="bs-card-price-ref">REF</span> ${product.precioUSD}
      </span>
    )
  }
  if (tasa && product.precioUSD) {
    const bs = Math.round(product.precioUSD * tasa)
    return (
      <span className="bs-card-price">
        Bs. {bs.toLocaleString('es-VE')}
      </span>
    )
  }
  return null
}

function BsCard({ product }) {
  const img = resolveProductImage(product)
  return (
    <Link to={`/tienda/${product.id}`} className="bs-card">
      <div className="bs-card-img-wrap">
        <img
          src={img}
          alt={product.name}
          className="bs-card-img"
          loading="lazy"
        />
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
  const rowRef = useRef(null)

  const items = BESTSELLER_IDS
    .map(id => products.find(p => p.id === id))
    .filter(Boolean)

  if (!items.length) return null

  return (
    <section className="bestseller-section">
      <div className="bestseller-inner">
        <div className="bestseller-header">
          <p className="bestseller-eyebrow">Más populares</p>
          <Link to="/tienda" className="bestseller-ver-todo">Ver todo →</Link>
        </div>

        <div className="bs-row" ref={rowRef}>
          {items.map(p => <BsCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  )
}
