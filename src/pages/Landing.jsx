import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Hero from '../components/Hero'
import MustHaveMen from '../components/MustHaveMen'
import MustHaveWomen from '../components/MustHaveWomen'
import QuickOcasion from '../components/QuickOcasion'
import BrandStory from '../components/BrandStory'
import Guarantee from '../components/Guarantee'
import Footer from '../components/Footer'
import Testimonials from '../components/Testimonials'
import QuickGenero from '../components/QuickGenero'
import BestsellerRow from '../components/BestsellerRow'
import NewLaunchBanner from '../components/NewLaunchBanner'
import { useIndexProducts } from '../context/SanityProductsContext'
import { toSlug } from '../lib/slugs'

export default function Landing() {
  const allProducts = useIndexProducts()
  const featuredIds = [88, 20, 311, 256, 172, 202, 260, 104, 247, 266]
  const featured = featuredIds.map(id => allProducts.find(p => p.id === id)).filter(Boolean)
  const [stickyVisible, setStickyVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setStickyVisible(window.scrollY > window.innerHeight * 0.5)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Fragancias destacadas — KiKi Fragancia',
    itemListElement: featured.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://kikifragancia.com/tienda/${toSlug(p.house, p.name, p.ml)}`,
      name: `${p.house} ${p.name}${p.ml ? ' ' + p.ml + 'ml' : ''}`,
    })),
  }

  return (
    <>
      <Helmet>
        <title>KiKi Fragancia — Perfumería de Lujo en Venezuela</title>
        <meta name="description" content="Más de 300 fragancias árabes, de diseñador y nicho 100% originales. Envío a todo Venezuela. Descubre tu fragancia perfecta." />
        <meta property="og:title" content="KiKi Fragancia — Perfumería de Lujo en Venezuela" />
        <meta property="og:description" content="Más de 300 fragancias árabes, de diseñador y nicho 100% originales. Envío a todo Venezuela." />
        <meta property="og:url" content="https://kikifragancia.com" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://kikifragancia.com/hero/kiki-hero-desktop.webp" />
        <link rel="canonical" href="https://kikifragancia.com" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      {/* Sticky "Ver colección" — aparece tras scrollear medio hero, queda bajo el BottomNav */}
      <div className={`landing-sticky-cta${stickyVisible ? ' visible' : ''}`}>
        <Link to="/tienda" className="landing-sticky-btn">
          Ver colección completa →
        </Link>
      </div>

      <main>
        <Hero />
        <NewLaunchBanner />
        <BestsellerRow />
        <QuickGenero />
        <MustHaveMen />
        <QuickOcasion />
        <MustHaveWomen />
        <BrandStory />
        <Testimonials />
        <Guarantee />
      </main>
      <Footer />
    </>
  )
}
