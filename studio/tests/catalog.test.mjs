import assert from 'node:assert/strict'
import { test } from 'node:test'
import { parse, evaluate } from 'groq-js'
import { legacyImageUrl } from '../lib/productImage.js'
import { productFilters } from '../structure.js'

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
