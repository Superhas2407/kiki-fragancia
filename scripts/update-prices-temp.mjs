import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'

const env = readFileSync('.env.local', 'utf8')
const token = env.match(/SANITY_TOKEN=(.+)/)?.[1]?.trim()

const client = createClient({
  projectId: '7j25mwk7',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

const updates = [
  { id: 8,  price: 75 },
  { id: 28, price: 45 },
  { id: 32, price: 55 },
  { id: 36, price: 50 },
  { id: 37, price: 35 },
  { id: 40, price: 40 },
  { id: 56, price: 40 },
  { id: 60, price: 45 },
]

for (const { id, price } of updates) {
  const doc = await client.fetch(`*[_type == "product" && localId == ${id}][0]{ _id, name, precioUSD }`)
  if (!doc) { console.log(`❌ No encontrado en Sanity: id ${id}`); continue }
  await client.patch(doc._id).set({ precioUSD: price }).commit()
  console.log(`✅ ${doc.name}: $${doc.precioUSD} → $${price}`)
}
