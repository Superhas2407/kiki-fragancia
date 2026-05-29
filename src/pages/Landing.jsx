import Hero from '../components/Hero'
import Catalog from '../components/Catalog'
import BrandsMarquee from '../components/BrandsMarquee'
import BrandStory from '../components/BrandStory'
import Guarantee from '../components/Guarantee'
import Footer from '../components/Footer'
import DiaDeLPadrePromo from '../components/DiaDeLPadrePromo'
import Testimonials from '../components/Testimonials'

export default function Landing() {
  return (
    <>
      <main>
        <Hero />
        <DiaDeLPadrePromo />
        <BrandsMarquee />
        <Catalog theme="dark" />
        <BrandsMarquee reverse />
        <BrandStory />
        <Testimonials />
        <Guarantee />
      </main>
      <Footer />
    </>
  )
}
