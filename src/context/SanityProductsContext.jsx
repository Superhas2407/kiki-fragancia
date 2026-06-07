import { createContext, useContext, useState, useEffect } from 'react'
import { products as localProducts } from '../data/products-index'
import { sanityClient } from '../lib/sanityClient'

const QUERY = `*[_type == "product"] | order(id asc) {
  id, precioUSD, name, house, image, genero, familia, tipo, categoria, ml
}`

const Ctx = createContext(null)

export function SanityProductsProvider({ children }) {
  const [indexProducts, setIndexProducts] = useState(localProducts)

  useEffect(() => {
    sanityClient.fetch(QUERY)
      .then(sanityProducts => {
        if (!sanityProducts?.length) return
        const map = new Map(sanityProducts.map(p => [p.id, p]))
        setIndexProducts(local =>
          local.map(p => {
            const s = map.get(p.id)
            return s ? { ...p, ...s } : p
          })
        )
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
