export function parsePrice(input) {
  const raw = String(input ?? '').trim().replace(',', '.')
  if (!/^\\d+(?:\\.\\d{1,2})?$/.test(raw)) {
    throw new Error('Introduce un precio válido en USD (máximo 2 decimales).')
  }
  const price = Number(raw)
  if (!Number.isFinite(price) || price <= 0 || price > 1000000) {
    throw new Error('El precio debe ser mayor que 0 y no superar $1.000.000.')
  }
  return Math.round(price * 100) / 100
}

export function pricePatches(published, draft, price) {
  if (!published?._id || published._id.startsWith('drafts.') || !published._rev) {
    throw new Error('El perfume no está publicado. Actualiza la lista.')
  }
  if (!Number.isFinite(price) || price <= 0) throw new Error('Precio inválido.')
  const docs = [published]
  if (draft) {
    if (draft._id !== `drafts.${published._id}` || !draft._rev) {
      throw new Error('No se pudo comprobar el borrador. Actualiza la lista.')
    }
    docs.push(draft)
  }
  return docs.map(doc => ({
    patch: { id: doc._id, ifRevisionID: doc._rev, set: { precioUSD: price } },
  }))
}

export async function changePrice(client, product, input) {
  const price = parsePrice(input)
  if (!product?._id) throw new Error('Producto inválido. Actualiza la lista.')
  const [published, draft] = await client.getDocuments([product._id, `drafts.${product._id}`])
  if (!published) throw new Error('Este producto ya no está publicado. Actualiza la lista.')
  if (Number(published.precioUSD ?? 0) !== Number(product.precioUSD ?? 0)) {
    throw new Error('El precio cambió desde que abriste la lista. Actualiza antes de guardarlo.')
  }
  // Update only precioUSD on both versions; never publish pending draft edits.
  await client.transaction(pricePatches(published, draft, price)).commit()
  return price
}
