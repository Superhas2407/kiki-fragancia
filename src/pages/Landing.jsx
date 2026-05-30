import Hero from '../components/Hero'
import BrandsMarquee from '../components/BrandsMarquee'
import BrandStory from '../components/BrandStory'
import Guarantee from '../components/Guarantee'
import Footer from '../components/Footer'
import DiaDeLPadrePromo from '../components/DiaDeLPadrePromo'
import Testimonials from '../components/Testimonials'
import ProductWall from '../components/ProductWall'

export default function Landing() {
  return (
    <>
      <main>
        <Hero />
        <DiaDeLPadrePromo />
        <BrandsMarquee />
        <ProductWall />
        <BrandsMarquee reverse />
        <BrandStory />
        <Testimonials />
        <Guarantee />
      </main>
      <Footer />
    </>
  )
}
