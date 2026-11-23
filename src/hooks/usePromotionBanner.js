import { useEffect, useState } from 'react'
import { sanityClient } from '../lib/sanityClient'

// Only the published singleton is considered. An unfinished draft never
// appears on the public website.
export const PROMOTION_BANNER_QUERY = `*[_id == "home-promotion-banner" && _type == "promotionBanner"][0] {
  enabled, altText, "desktopUrl": desktopImage.asset->url,
  "mobileUrl": mobileImage.asset->url
}`

export function usePromotionBanner() {
  const [banner, setBanner] = useState(null)
  useEffect(() => {
    let mounted = true
    const fetchBanner = () => {
      sanityClient.withConfig({ useCdn: false }).fetch(PROMOTION_BANNER_QUERY)
        .then(data => {
          if (!mounted) return
          const valid = data?.enabled === true &&
            /^https:\/\//.test(data?.desktopUrl || '') &&
            /^https:\/\//.test(data?.mobileUrl || '')
          setBanner(valid ? {
            desktopUrl: data.desktopUrl, mobileUrl: data.mobileUrl,
            altText: data.altText?.trim() || 'Explorar promociones de Kiki Fragancia',
          } : null)
        })
        .catch(error => {
          console.warn('[Sanity] portada de promociones no disponible', error)
          if (mounted) setBanner(null)
        })
    }
    fetchBanner()
    const timer = setInterval(fetchBanner, 60000)
    return () => { mounted = false; clearInterval(timer) }
  }, [])
  return banner
}
