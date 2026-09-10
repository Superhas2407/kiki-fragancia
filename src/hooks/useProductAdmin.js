/**
 * useProductAdmin — acciones rápidas de admin sobre un producto puntual
 * (agotado, precio) desde /kiki-desk, sin pasar por Sanity Studio.
 * Mismo patrón de escritura que useTasaCambio.js / useOfertaDelDia.js.
 */
import { sanityClient } from '../lib/sanityClient'

async function findDocId(productId) {
  const doc = await sanityClient.fetch(
    `*[_type == "product" && id == $id][0]{ _id }`,
    { id: Number(productId) }
  )
  if (!doc?._id) throw new Error('Producto no encontrado en Sanity')
  return doc._id
}

export async function setAgotadoSanity(productId, value) {
  const { sanityWriteClient } = await import('../lib/sanityClient')
  const docId = await findDocId(productId)
  await sanityWriteClient.patch(docId).set({ agotado: !!value }).commit()
}

export async function setPrecioSanity(productId, precioUSD) {
  const { sanityWriteClient } = await import('../lib/sanityClient')
  const val = Number(precioUSD)
  if (!val || val <= 0) throw new Error('Precio inválido')
  const docId = await findDocId(productId)
  await sanityWriteClient.patch(docId).set({ precioUSD: val }).commit()
}
