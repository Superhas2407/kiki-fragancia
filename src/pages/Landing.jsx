import Hero from '../components/Hero'
import BrandsMarquee from '../components/BrandsMarquee'
import Guarantee from '../components/Guarantee'
import Catalog from '../components/Catalog'
import BrandStory from '../components/BrandStory'
import Footer from '../components/Footer'

export default function Landing() {
  return (
    <>
      <main>
        <Hero />
        <Catalog theme="dark" />
        <BrandsMarquee />
        <Guarantee />
        <BrandStory />
      </main>
      <Footer />
    </>
  )
}
