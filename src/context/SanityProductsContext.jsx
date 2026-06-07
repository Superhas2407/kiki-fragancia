import { createContext, useContext, useState, useEffect } from 'react'
import { products as localProducts } from '../data/products-index'
import { sanityClient, sanityImageUrl } from '../lib/sanityClient'

const QUERY = `*[_type == "product"] | order(id asc) {
  id, precioUSD, name, house, image, sanityImage, genero, familia,
  tipo, categoria, ml, variantIds, acordes,
  cuandoEpocaSeca, cuandoLluviosa, cuandoDia, cuandoNoche,
  notasSalida, notasCorazon, notasFondo
}`

const Ctx = createContext(null)

// Resolves the best image URL for a product from Sanity data
export function resolveProductImage(p) {
  if (p.sanityImage?.asset) {
    return sanityImageUrl(p.sanityImage).width(800).auto('format').url()
  }
  if (p.image) return `/products/${p.image}`
  return null
}

export function SanityProductsProvider({ children }) {
  const [indexProducts, setIndexProducts] = useState(localProducts)

  useEffect(() => {
    sanityClient.fetch(QUERY)
      .then(sanityProducts => {
        if (!sanityProducts?.length) return

        // Build a map of local data for structural fields (variantIds, etc.)
        const localMap = new Map(localProducts.map(p => [p.id, p]))

        // Sanity is the primary source; merge in local structural fields
        const merged = sanityProducts.map(sp => {
          const local = localMap.get(sp.id) ?? {}
          return {
            ...local,
            // Sanity overrides (only non-null values)
            ...Object.fromEntries(Object.entries(sp).filter(([, v]) => v != null)),
            // variantIds: prefer local (already there) unless Sanity explicitly sets it
            variantIds: sp.variantIds?.length ? sp.variantIds : local.variantIds,
          }
        })

        setIndexProducts(merged)
      })
      .catch(() => {}) // silently fall back to local data
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
