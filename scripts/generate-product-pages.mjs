/**
 * Genera dist/tienda/[slug]/index.html para cada producto.
 * Los bots (Telegram, WhatsApp, Twitter…) ven los OG tags correctos.
 * Los humanos reciben el mismo HTML → el SPA de React carga normalmente.
 *
 * Corre después de `vite build` en npm run build.
 */

import { readFileSync, mkdirSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

// ── Importar datos de productos ──────────────────────────────────────────────
const { products } = await import('../src/data/products-enriched.js')

// ── Leer el index.html generado por Vite ────────────────────────────────────
const templateHtml = readFileSync(join(ROOT, 'dist', 'index.html'), 'utf-8')

// ── Slug ────────────────────────────────────────────────────────────────────
function norm(s) {
  if (!s) return ''
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

function toSlug(house, name, ml) {
  const displayName = name.toLowerCase().startsWith(house.toLowerCase() + ' ')
    ? name.slice(house.length + 1)
    : name
  const base = norm(`${house} ${displayName}`)
    .replace(/[^a-z0-9\s]/g, '').trim().replace(/\s+/g, '-')
  return ml ? `${base}-${ml}ml` : base
}

// ── Generar páginas ──────────────────────────────────────────────────────────
const BASE = 'https://kikifragancia.com'
let count = 0

for (const p of products) {
  const slug = toSlug(p.house, p.name, p.ml)
  const url  = `${BASE}/tienda/${slug}`

  const cleanName = p.name.toLowerCase().startsWith(p.house.toLowerCase() + ' ')
    ? p.name.slice(p.house.length + 1)
    : p.name
  const title = `${p.house} ${cleanName}${p.ml ? ' ' + p.ml + 'ml' : ''} — KiKi Fragancia`
  const desc  = p.descripcion
    ? p.descripcion.slice(0, 155).replace(/\s\S+$/, '…')
    : `${p.house} ${p.name} ${p.ml ? p.ml + 'ml' : ''} ${p.tipo || ''}. Fragancia 100% original en Venezuela.`.trim()

  const image = p.image
    ? `${BASE}/products/${p.image}`
    : `${BASE}/khamrah-hero.jpg`

  const ogTags = `
    <title>${title}</title>
    <meta name="description" content="${esc(desc)}" />
    <link rel="canonical" href="${url}" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(desc)}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:type" content="product" />
    <meta property="og:site_name" content="KiKi Fragancia" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(title)}" />
    <meta name="twitter:description" content="${esc(desc)}" />
    <meta name="twitter:image" content="${image}" />`

  // Reemplazar las metas genéricas del index.html base
  let html = templateHtml
    // Quitar title genérico
    .replace(/<title>.*?<\/title>/, '')
    // Quitar metas genéricos de description, og:*, twitter:*
    .replace(/<meta name="description"[^>]*>/g, '')
    .replace(/<meta property="og:[^"]*"[^>]*>/g, '')
    .replace(/<meta name="twitter:[^"]*"[^>]*>/g, '')
    .replace(/<link rel="canonical"[^>]*>/g, '')
    // Inyectar los tags correctos justo antes de </head>
    .replace('</head>', `${ogTags}\n  </head>`)

  const outDir = join(ROOT, 'dist', 'tienda', slug)
  mkdirSync(outDir, { recursive: true })
  writeFileSync(join(outDir, 'index.html'), html, 'utf-8')
  count++
}

console.log(`✓ Generadas ${count} páginas de producto en dist/tienda/`)

function esc(str) {
  return str.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
