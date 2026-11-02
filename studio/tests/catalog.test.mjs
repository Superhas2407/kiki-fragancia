import assert from 'node:assert/strict'
import { test } from 'node:test'
import { parse, evaluate } from 'groq-js'
import { legacyImageUrl } from '../lib/productImage.js'
import { productFilters } from '../lib/productFilters.js'

test('legacy photos use the shop origin and encode filenames', () => {
  assert.equal(legacyImageUrl('afnan-9am.webp'), 'https://kikifragancia.com/products/afnan-9am.webp')
  assert.equal(legacyImageUrl('/products/Jean Paul.webp'), 'https://kikifragancia.com/products/Jean%20Paul.webp')
  assert.equal(legacyImageUrl('https://cdn.sanity.io/images/photo.webp'), 'https://cdn.sanity.io/images/photo.webp')
  assert.equal(legacyImageUrl(''), null)
  assert.equal(legacyImageUrl(null), null)
})

test('stock views are disjoint and include older products without an agotado field', async () => {
  const dataset = [
    { _type: 'product', _id: 'sold-out', agotado: true },
    { _type: 'product', _id: 'available', agotado: false },
    { _type: 'product', _id: 'legacy' },
    { _type: 'product', _id: 'null-stock', agotado: null },
    { _type: 'other', _id: 'not-a-product', agotado: true },
  ]
  const query = async (filter) => (await evaluate(parse(`*[${filter}]._id`), { dataset })).get()
  assert.deepEqual(await query(productFilters.agotados), ['sold-out'])
  assert.deepEqual(await query(productFilters.disponibles), ['available', 'legacy', 'null-stock'])
})

test('quick stock changes only stock on published and draft versions', async () => {
  const { stockPatches } = await import('../lib/stock.js')
  const pub = { _id: 'p1', _rev: 'r1', precioUSD: 45, agotado: false }
  const draft = { _id: 'drafts.p1', _rev: 'r2', precioUSD: 50, descripcion: 'Pending edit' }
  assert.deepEqual(stockPatches(pub, draft, true), [
    { patch: { id: 'p1', ifRevisionID: 'r1', set: { agotado: true } } },
    { patch: { id: 'drafts.p1', ifRevisionID: 'r2', set: { agotado: true } } },
  ])
  assert.deepEqual(stockPatches(pub, null, false), [
    { patch: { id: 'p1', ifRevisionID: 'r1', set: { agotado: false } } },
  ])
  assert.equal(draft.precioUSD, 50)
  assert.throws(() => stockPatches(pub, { _id: 'drafts.other', _rev: 'r3' }, true))
})

test('quick stock rejects stale status and failed writes', async () => {
  const { changeStock } = await import('../lib/stock.js')
  let writes = 0
  const client = {
    getDocuments: async () => [{ _id: 'p1', _rev: 'r1', agotado: true }, null],
    transaction: () => { writes++; return { commit: async () => {} } },
  }
  await assert.rejects(changeStock(client, { _id: 'p1', agotado: false }, true), /stock cambió/)
  assert.equal(writes, 0)
  client.getDocuments = async () => [{ _id: 'p1', _rev: 'r1', agotado: false }, null]
  client.transaction = () => ({ commit: async () => { throw new Error('Write failed') } })
  await assert.rejects(changeStock(client, { _id: 'p1', agotado: false }, true), /Write failed/)
})
