/**
 * Limpieza única: borra los campos viejos promoVerano / precioPromoVerano
 * de los documentos de Sanity que todavía los tengan. El schema y el
 * código ya no los usan — este script solo deja los documentos limpios.
 *
 * Uso: node scripts/cleanup-promo-verano.mjs
 * (requiere SANITY_TOKEN en .env.local o en el entorno, igual que sync-from-sanity.mjs)
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
  throw new Error('SANITY_TOKEN no encontrado en .env.local')
}

const client = createClient({
  projectId: '7j25mwk7',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: loadToken(),
  useCdn: false,
})

console.log('Buscando productos con promoVerano o precioPromoVerano...')
const docs = await client.fetch(
  `*[_type == "product" && (defined(promoVerano) || defined(precioPromoVerano))]{ _id, id, house, name }`
)

if (!docs.length) {
  console.log('✓ Nada que limpiar — ningún producto tiene esos campos.')
  process.exit(0)
}

console.log(`Encontrados ${docs.length} producto(s):`)
docs.forEach(d => console.log(`  - [${d.id}] ${d.house} ${d.name}`))

let tx = client.transaction()
for (const d of docs) {
  tx = tx.patch(d._id, p => p.unset(['promoVerano', 'precioPromoVerano']))
}
await tx.commit()

console.log(`✓ Campos borrados en ${docs.length} producto(s).`)
