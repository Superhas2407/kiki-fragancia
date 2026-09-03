import { createContext, useContext, useState, useEffect } from 'react'
import { products as localProducts } from '../data/products-index'
import { sanityClient, sanityImageUrl } from '../lib/sanityClient'
import { useAuth } from './AuthContext'

const BASE_FIELDS = `
  id, precioUSD, descuento, agotado, name, house, image, sanityImage, genero, familia,
  tipo, categoria, ml, "variantIds": variantIds[]->id, acordes, descripcion,
  cuandoEpocaSeca, cuandoLluviosa, cuandoDia, cuandoNoche,
  notasSalida, notasCorazon, notasFondo
`

// promoHalloween / precioPromoHalloween solo se piden cuando hay sesión admin —
// así ni siquiera viajan por la red hacia un visitante anónimo.
function buildQuery(isAdmin) {
  const adminFields = isAdmin ? ', promoHalloween, precioPromoHalloween' : ''
  return `*[_type == "product"] | order(id asc) { ${BASE_FIELDS}${adminFields} }`
}

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
  const { session } = useAuth()
  const isAdmin = !!session

  useEffect(() => {
    sanityClient.fetch(buildQuery(isAdmin))
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
          // Oferta Halloween — admin-only. isAdmin ya decide si estos campos
          // siquiera vinieron en la respuesta de Sanity; esta es la segunda
          // barrera: aunque llegaran, nunca se aplican ni se exponen sin sesión.
          if (isAdmin && sp.promoHalloween && sp.precioPromoHalloween != null) {
            p.precioOriginalUSD = p.precioUSD
            p.precioUSD = sp.precioPromoHalloween
          } else {
            delete p.precioOriginalUSD
            delete p.promoHalloween
            delete p.precioPromoHalloween
          }
          return p
        })

        setIndexProducts(merged.filter(p => p.id && p.name && p.house))
      })
      .catch((e) => console.error('[Sanity] fetch failed:', e))
  }, [isAdmin])

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
