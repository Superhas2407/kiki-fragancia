import { useEffect, useState } from 'react'
import { sanityClient } from '../lib/sanityClient'

// Only the published singleton is considered. An unfinished draft never
// appears on the public website.
export const PROMOTION_BANNER_QUERY = `*[_id == "home-promotion-banner" && _type == "promotionBanner"][0] {
  enabled, altText, "desktopUrl": desktopImage.asset->url,
  "mobileUrl": mobileImage.asset->url
}`

// Original artwork files supplied by Kiki Fragancia, served locally from /public/promociones.
// Sanity can replace or disable this first edition without a code update.
export const DEFAULT_PROMOTION_BANNER = {
  desktopUrl: '/promociones/portada-desktop.jpg',
  mobileUrl: '/promociones/portada-mobile.jpg',
  altText: 'Promociones disponibles: combos especiales en tus marcas favoritas. Explorar promociones.',
}

export function usePromotionBanner() {
  const [banner, setBanner] = useState(DEFAULT_PROMOTION_BANNER)
  useEffect(() => {
    let mounted = true
    const fetchBanner = () => {
      sanityClient.withConfig({ useCdn: false }).fetch(PROMOTION_BANNER_QUERY)
        .then(data => {
          if (!mounted) return
          const valid = data?.enabled === true &&
            /^https:\/\//.test(data?.desktopUrl || '') &&
            /^https:\/\//.test(data?.mobileUrl || '')
          setBanner(data == null ? DEFAULT_PROMOTION_BANNER : valid ? {
            desktopUrl: data.desktopUrl, mobileUrl: data.mobileUrl,
            altText: data.altText?.trim() || 'Explorar promociones de Kiki Fragancia',
          } : null)
        })
        .catch(error => {
          console.warn('[Sanity] portada de promociones no disponible', error)
          if (mounted) setBanner(DEFAULT_PROMOTION_BANNER)
        })
    }
    fetchBanner()
    const timer = setInterval(fetchBanner, 60000)
    return () => { mounted = false; clearInterval(timer) }
  }, [])
  return banner
}
