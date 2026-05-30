import sharp from 'sharp'
import { readFileSync, mkdirSync, existsSync } from 'fs'
import { join, basename } from 'path'

const MARQUEE_IMAGES = [
  'gucci-bloom-100ml-f.webp',
  'lattafa-khamrah-qahwa-100ml-u.webp',
  'armaf-odyssey-aoud-100ml-m.webp',
  'prada-paradoxe-intense-90ml-f.webp',
  'versace-eros-flame-100ml-m.webp',
  'carolina-herrera-ch-men-hot-hot-hot-100ml-m.webp',
  'ariana-grande-sweet-like-candy-100ml-f.webp',
  'jean-paul-gaultier-scandal-pour-homme-100ml-m.webp',
  'ralph-lauren-polo-67-ralph-lauren-100ml-m.webp',
  'lattafa-winners-trophy-gold-100ml-u.webp',
  'montblanc-explorer-100ml-m.webp',
  'lattafa-petra-100ml-u.webp',
  'hugo-boss-hugo-man-125ml-m.webp',
  'armaf-the-pride-of-armaf-for-women-100ml-f.webp',
  'elizabeth-arden-sunflowers-100ml-f.webp',
  'boucheron-pour-homme-collector-eau-de-parfum-100ml-m.webp',
]

const SRC_DIR  = 'public/products'
const OUT_DIR  = 'public/products-thumb'

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true })

let totalBefore = 0
let totalAfter  = 0

for (const file of MARQUEE_IMAGES) {
  const src = join(SRC_DIR, file)
  const out = join(OUT_DIR, file)

  const before = readFileSync(src).length
  totalBefore += before

  await sharp(src)
    .rotate()
    .resize({ width: 400, withoutEnlargement: true })
    .webp({ quality: 62 })
    .toFile(out)

  const after = readFileSync(out).length
  totalAfter += after

  const pct = Math.round((1 - after / before) * 100)
  console.log(`✓ ${file}: ${(before/1024).toFixed(0)}KB → ${(after/1024).toFixed(0)}KB (-${pct}%)`)
}

console.log('')
console.log(`Total: ${(totalBefore/1024/1024).toFixed(1)}MB → ${(totalAfter/1024/1024).toFixed(1)}MB (-${Math.round((1 - totalAfter/totalBefore)*100)}%)`)
