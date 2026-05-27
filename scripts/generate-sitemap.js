import { writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { products } from '../src/data/products-enriched.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const BASE = 'https://kikifragancia.com'
const today = new Date().toISOString().split('T')[0]

const staticRoutes = [
  { loc: '/', changefreq: 'weekly', priority: '1.0' },
  { loc: '/tienda', changefreq: 'daily', priority: '0.9' },
  { loc: '/dia-del-padre', changefreq: 'monthly', priority: '0.7' },
]

const productRoutes = products.map(p => ({
  loc: `/tienda/${p.id}`,
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
