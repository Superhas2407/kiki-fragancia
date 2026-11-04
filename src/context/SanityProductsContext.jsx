import { createContext, useContext, useState, useEffect } from 'react'
import { products as localProducts } from '../data/products-index'
import { sanityClient, sanityImageUrl } from '../lib/sanityClient'
import { responsiveImage, responsiveSrcSet } from '../lib/responsiveImages'

const BASE_FIELDS = `
  id, precioUSD, descuento, agotado, name, house, image, sanityImage, genero, familia,
  tipo, categoria, ml, "variantIds": variantIds[]->id, acordes, descripcion,
  cuandoEpocaSeca, cuandoLluviosa, cuandoDia, cuandoNoche,
  notasSalida, notasCorazon, notasFondo
`

function buildQuery() {
  return `*[_type == "product"] | order(id asc) { ${BASE_FIELDS} }`
}

const Ctx = createContext(null)

// Resolves the best image URL for a product from Sanity data
export function resolveProductImage(p, width = 800) {
  if (p.sanityImage?.asset) {
    return sanityImageUrl(p.sanityImage).width(width).auto('format').url()
  }
  if (p.image) return responsiveImage(`/products/${p.image}`, width)
  return null
}

export function productImageSrcSet(p) {
  if (p.sanityImage?.asset) return [320, 640, 1280].map(w => `${resolveProductImage(p, w)} ${w}w`).join(', ')
  return p.image ? responsiveSrcSet(`/products/${p.image}`) : undefined
}

export function SanityProductsProvider({ children }) {
  const [indexProducts, setIndexProducts] = useState(localProducts)

  useEffect(() => {
    sanityClient.fetch(buildQuery())
      .then(sanityProducts => {
        console.log('[Sanity] productos recibidos:', sanityProducts?.length)
        if (!sanityProducts?.length) return

        // Build a map of local data for structural fields (variantIds, etc.)
        const localMap = new Map(localProducts.map(p => [p.id, p]))

        // Sanity is the primary source; merge in local structural fields
        const merged = sanityProducts.map(sp => {
          const local = localMap.get(sp.id) ?? {}
          const p = {
            ...local,
            // Sanity overrides (only non-null values)
            ...Object.fromEntries(Object.entries(sp).filter(([, v]) => v != null)),
            // variantIds: prefer local (already there) unless Sanity explicitly sets it
            variantIds: sp.variantIds?.length ? sp.variantIds : local.variantIds,
          }
          // Retired seasonal fields never override current catalog prices.
          delete p.promoHalloween
          delete p.precioPromoHalloween
          delete p.precioOriginalUSD
          return p
        })

        setIndexProducts(merged.filter(p => p.id && p.name && p.house))
      })
      .catch((e) => console.error('[Sanity] fetch failed:', e))
  }, [])

  return <Ctx.Provider value={indexProducts}>{children}</Ctx.Provider>
}

export function useIndexProducts() {
  return useContext(Ctx) ?? localProducts
}

export function useLivePrice(id) {
  const products = useIndexProducts()
  return products.find(p => p.id === id)?.precioUSD
}

export function useSanityProduct(id) {
  const products = useIndexProducts()
  return products.find(p => p.id === id) ?? null
}
