import { writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { products } from '../src/data/products-enriched.js'
import { norm } from '../src/lib/search.js'

function toSlug(house, name, ml) {
  const displayName = name.toLowerCase().startsWith(house.toLowerCase() + ' ')
    ? name.slice(house.length + 1)
    : name
  const base = norm(`${house} ${displayName}`)
    .replace(/[^a-z0-9\s]/g, '').trim().replace(/\s+/g, '-')
  return ml ? `${base}-${ml}ml` : base
}

const __dirname = dirname(fileURLToPath(import.meta.url))
const BASE = 'https://kikifragancia.com'
const today = new Date().toISOString().split('T')[0]

const staticRoutes = [
  { loc: '/', changefreq: 'weekly', priority: '1.0' },
  { loc: '/tienda', changefreq: 'daily', priority: '0.9' },
  { loc: '/dia-del-padre', changefreq: 'monthly', priority: '0.7' },
]

const productRoutes = products.map(p => ({
  loc: `/tienda/${toSlug(p.house, p.name, p.ml)}`,
  changefreq: 'monthly',
  priority: '0.8',
}))

const allRoutes = [...staticRoutes, ...productRoutes]

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map(r => `  <url>
    <loc>${BASE}${r.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`).join('\n')}
</urlset>
`

const out = join(__dirname, '../public/sitemap.xml')
writeFileSync(out, xml, 'utf-8')
console.log(`✓ sitemap.xml generado: ${allRoutes.length} URLs → ${out}`)
