import { Link } from 'react-router-dom'
import { products } from '../data/products-enriched'

const BRANDS = [...new Set(products.map(p => p.house))].sort()

export default function BrandsMarquee() {
  const doubled = [...BRANDS, ...BRANDS]
  return (
    <section className="marquee-section">
      <div className="marquee-track">
        <div className="marquee-inner">
          {doubled.map((brand, i) => (
            <Link
              key={i}
              to={`/tienda?marca=${encodeURIComponent(brand)}`}
              className="marquee-item"
              style={{ textDecoration: 'none' }}
            >
              <span className="marquee-brand">{brand}</span>
              <span className="marquee-dot">✦</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
