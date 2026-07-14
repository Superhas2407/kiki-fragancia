/**
 * Marca o desmarca productos como agotados en Sanity a partir de una lista de IDs numéricos.
 *
 * Uso: PRODUCT_IDS="1,2,3" node scripts/set-agotado.mjs
 * Para desmarcar: AGOTADO_VALUE=false PRODUCT_IDS="1,2,3" node scripts/set-agotado.mjs
 */
import { createClient } from '@sanity/client'
import { readFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

function loadToken() {
  if (process.env.SANITY_TOKEN) return process.env.SANITY_TOKEN
  const envPath = join(__dirname, '../.env.local')
  if (existsSync(envPath)) {
    const match = readFileSync(envPath, 'utf8').match(/SANITY_TOKEN=(.+)/)
    if (match) return match[1].trim()
  }
  throw new Error('SANITY_TOKEN no encontrado')
}

const idsArg = process.env.PRODUCT_IDS || process.argv[2]
if (!idsArg) {
  console.error('Uso: PRODUCT_IDS="1,2,3" node scripts/set-agotado.mjs')
  process.exit(1)
}
const ids = idsArg.split(',').map(s => Number(s.trim())).filter(n => !isNaN(n))
const value = process.env.AGOTADO_VALUE !== 'false'
console.log(`${value ? 'Marcando' : 'Desmarcando'} ${ids.length} productos como agotados...`)

const client = createClient({
  projectId: '7j25mwk7',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: loadToken(),
  useCdn: false,
})

const docs = await client.fetch(`*[_type == "product" && id in $ids]{_id, id, name}`, { ids })
console.log(`  ${docs.length} documentos encontrados en Sanity de ${ids.length} IDs pedidos`)

const foundIds = new Set(docs.map(d => d.id))
const missing = ids.filter(id => !foundIds.has(id))
if (missing.length) {
  console.warn(`  ⚠ IDs no encontrados en Sanity: ${missing.join(', ')}`)
}

let tx = client.transaction()
for (const doc of docs) {
  tx = tx.patch(doc._id, p => p.set({ agotado: value }))
}
await tx.commit()

console.log(`✓ ${docs.length} productos ${value ? 'marcados' : 'desmarcados'}:`)
for (const doc of docs) console.log(`  - [${doc.id}] ${doc.name}`)
