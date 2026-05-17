import Header from '../components/Header'
import Hero from '../components/Hero'
import BrandsMarquee from '../components/BrandsMarquee'
import Guarantee from '../components/Guarantee'
import Catalog from '../components/Catalog'
import FamiliasSection from '../components/FamiliasSection'
import BrandStory from '../components/BrandStory'
import Footer from '../components/Footer'

export default function Landing() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <BrandsMarquee />
        <Guarantee />
        <Catalog theme="dark" />
        <FamiliasSection />
        <BrandStory />
      </main>
      <Footer />
    </>
  )
}
