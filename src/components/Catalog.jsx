import { Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { products } from '../data/products-enriched'
import ProductCard from './ProductCard'

const FEATURED_IDS = [84, 107, 104, 105, 242, 247]

export default function Catalog({ theme = 'dark' }) {
  const headRef = useScrollReveal({ threshold: 0.15 })
  const isDark = theme === 'dark'

  const featured = FEATURED_IDS
    .map(id => products.find(p => p.id === id))
    .filter(Boolean)
    .slice(0, 6)

  return (
    <section id="catalogo" className={`section-pad ${isDark ? 'catalog-dark' : 'catalog-light'}`}>
      <div className="kiki-container">

        <div ref={headRef} className="kiki-section-head">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
            <div className="gold-line"></div>
            <span className="eyebrow-gold" style={{ marginBottom: 0 }}>Esta semana en KiKi</span>
          </div>
          <h2 className={`kiki-section-title ${isDark ? 'title-light' : 'title-dark'}`}>
            Fragancias destacadas
          </h2>
          <p className={`kiki-section-subtitle ${isDark ? 'subtitle-light' : 'subtitle-dark'}`}>
            Selección curada por nuestros expertos olfativos
          </p>
        </div>

        <div className="catalog-grid">
          {featured.map(product => (
            <ProductCard key={product.id} product={product} theme={theme} />
          ))}
        </div>

      </div>
    </section>
  )
}
