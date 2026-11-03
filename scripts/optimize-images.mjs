import sharp from 'sharp'
import { readdir, mkdir, readFile, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import path from 'node:path'

// Originals remain available for zoom and social previews. Versioned derivatives
// can be cached immutably without keeping a replaced product photo in browsers.
const manifest = {}
const output = 'public/responsive'
await mkdir(output, { recursive: true })
const jobs = []
for (const folder of ['products', 'hero', 'silhouettes']) {
  for (const file of await readdir(`public/${folder}`).catch(() => [])) {
    if (!/\.(webp|jpe?g|png)$/i.test(file)) continue
    jobs.push({ folder, file })
  }
}
let cursor = 0
await Promise.all(Array.from({ length: 4 }, async () => {
  while (cursor < jobs.length) {
    const { folder, file } = jobs[cursor++]
    const input = await readFile(`public/${folder}/${file}`)
    const hash = createHash('sha256').update(input).digest('hex').slice(0, 12)
    const meta = await sharp(input).metadata()
    const widths = (folder === 'products' ? [320, 640, 1280] : [480, 960, 1600]).filter(w => w < meta.width)
    if (!widths.length) continue
    const variants = []
    for (const width of widths) {
      const name = `${folder}-${path.parse(file).name}-${hash}-${width}.webp`
      const dest = `${output}/${name}`
      try { await readFile(dest) } catch {
        await sharp(input).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 80, effort: 4 }).toFile(dest)
      }
      variants.push({ width, src: `/responsive/${name}` })
    }
    manifest[`/${folder}/${file}`] = variants
  }
}))
await mkdir('src/data', { recursive: true })
await writeFile('src/data/responsive-images.json', JSON.stringify(manifest))
console.log(`Responsive images: ${Object.keys(manifest).length} originals optimized`)
