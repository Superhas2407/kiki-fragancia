export function stockPatches(published, draft, agotado) {
  if (!published?._id || published._id.startsWith('drafts.') || !published._rev) {
    throw new Error('El perfume no está publicado. Actualiza la lista.')
  }
  if (typeof agotado !== 'boolean') throw new Error('Estado de stock inválido.')
  const docs = [published]
  if (draft) {
    if (draft._id !== `drafts.${published._id}` || !draft._rev) {
      throw new Error('No se pudo comprobar el borrador. Actualiza la lista.')
    }
    docs.push(draft)
  }
  return docs.map(doc => ({
    patch: { id: doc._id, ifRevisionID: doc._rev, set: { agotado } },
  }))
}

export async function changeStock(client, product, agotado) {
  const [published, draft] = await client.getDocuments([product._id, `drafts.${product._id}`])
  if (published && (published.agotado === true) !== (product.agotado === true)) {
    throw new Error('El stock cambió desde que abriste la lista. Actualiza e inténtalo de nuevo.')
  }
  // Patch only stock on both versions; never publish unrelated draft edits.
  await client.transaction(stockPatches(published, draft, agotado)).commit()
}
