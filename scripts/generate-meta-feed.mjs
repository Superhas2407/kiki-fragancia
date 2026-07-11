import { writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { products } from '../src/data/products-enriched.js'
import { norm } from '../src/lib/search.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const BASE = 'https://kikifragancia.com'

function toSlug(house, name, ml) {
  const displayName = name.toLowerCase().startsWith(house.toLowerCase() + ' ')
    ? name.slice(house.length + 1)
    : name
  const base = norm(`${house} ${displayName}`)
    .replace(/[^a-z0-9\s]/g, '').trim().replace(/\s+/g, '-')
  return ml ? `${base}-${ml}ml` : base
}

function escapeXml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function resolveImage(p) {
  if (p.sanityImage?.asset?._ref) {
    const ref = p.sanityImage.asset._ref
    const path = ref.replace('image-', '').replace(/-([a-z]+)$/, '.$1').replace(/-/g, '/')
    return `https://cdn.sanity.io/images/7j25mwk7/production/${path}?w=800&auto=format`
  }
  if (p.image) return `${BASE}/products/${p.image}`
  return null
}

function buildDescription(p) {
  const tipo = { 'Eau de Parfum': 'EDP', 'Eau de Toilette': 'EDT', 'Eau de Cologne': 'EDC', 'Parfum': 'PDM' }[p.tipo] ?? p.tipo
  const genero = { Masculino: 'para hombre', Femenino: 'para mujer', Unisex: 'unisex' }[p.genero] ?? ''
  const base = p.description || `${p.house} ${p.name} — fragancia ${p.familia?.toLowerCase() ?? ''} ${genero}. ${tipo} ${p.ml}ml. 100% original.`
  return base.slice(0, 500)
}

// Excluir 200ml con variantes (duplicados)
const feed = products.filter(p =>
  p.precioUSD > 0 &&
  !(p.ml === 200 && p.variantIds?.length)
)

const items = feed.map(p => {
  const slug = toSlug(p.house, p.name, p.ml)
  const imgSrc = resolveImage(p)
  const price = p.precioUSD.toFixed(2)
  const tipo = { 'Eau de Parfum': 'EDP', 'Eau de Toilette': 'EDT', 'Eau de Cologne': 'EDC', 'Parfum': 'PDM' }[p.tipo] ?? p.tipo

  return `  <item>
    <g:id>${p.id}</g:id>
    <g:title>${escapeXml(`${p.house} ${p.name} ${p.ml}ml`)}</g:title>
    <g:description>${escapeXml(buildDescription(p))}</g:description>
    <g:link>${BASE}/tienda/${slug}</g:link>
    ${imgSrc ? `<g:image_link>${escapeXml(imgSrc)}</g:image_link>` : ''}
    <g:availability>in stock</g:availability>
    <g:condition>new</g:condition>
    <g:price>${price} USD</g:price>
    <g:brand>${escapeXml(p.house)}</g:brand>
    <g:google_product_category>2915</g:google_product_category>
    <g:product_type>${escapeXml(p.categoria === 'arabes' ? 'Perfumería > Árabes' : p.categoria === 'nicho' ? 'Perfumería > Nicho' : 'Perfumería > Diseñador')}</g:product_type>
    <g:gender>${p.genero === 'Masculino' ? 'male' : p.genero === 'Femenino' ? 'female' : 'unisex'}</g:gender>
    <g:item_group_id>${escapeXml(`${p.house}-${p.name}`.toLowerCase().replace(/\s+/g, '-'))}</g:item_group_id>
    <g:custom_label_0>${escapeXml(p.familia ?? '')}</g:custom_label_0>
    <g:custom_label_1>${escapeXml(tipo)}</g:custom_label_1>
    <g:custom_label_2>${escapeXml(p.categoria ?? '')}</g:custom_label_2>
  </item>`
}).join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>KiKi Fragancia — Catálogo</title>
    <link>${BASE}</link>
    <description>Fragancias 100% originales — Caracas, Venezuela</description>
${items}
  </channel>
</rss>`

const outPath = join(__dirname, '../public/meta-product-feed.xml')
writeFileSync(outPath, xml, 'utf8')
console.log(`✅ Meta product feed: ${feed.length} productos → public/meta-product-feed.xml`)
