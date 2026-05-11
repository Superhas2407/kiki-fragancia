import Header       from '../components/Header'
import Hero         from '../components/Hero'
import Guarantee    from '../components/Guarantee'
import Catalog      from '../components/Catalog'
import BrandStory   from '../components/BrandStory'
import InstagramFeed from '../components/InstagramFeed'
import Footer       from '../components/Footer'

export default function Landing() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Guarantee />
        <Catalog />
        <BrandStory />
        <InstagramFeed />
      </main>
      <Footer />
    </>
  )
}
