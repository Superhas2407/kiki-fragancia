import Hero from '../components/Hero'
import Catalog from '../components/Catalog'
import BrandsMarquee from '../components/BrandsMarquee'
import BrandStory from '../components/BrandStory'
import Guarantee from '../components/Guarantee'
import Footer from '../components/Footer'

export default function Landing() {
  return (
    <>
      <main>
        <Hero />
        <BrandsMarquee />
        <Catalog theme="dark" />
        <BrandsMarquee reverse />
        <BrandStory />
        <Guarantee />
      </main>
      <Footer />
    </>
  )
}
