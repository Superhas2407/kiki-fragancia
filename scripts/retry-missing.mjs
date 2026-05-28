import fs from 'fs'
import path from 'path'
import https from 'https'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR   = path.join(__dirname, '../public/notes')
const MAP_FILE  = path.join(__dirname, '../src/data/notes-images.js')
const PEXELS_KEY = 'YPpRWKtpngEpzkK2Q7KQiHMB1lHEM6Cy2sGL1SmhWThnae2SDq4XHCjI'

const RETRY = [
  { file: 'ozone',      query: 'morning mist fresh air nature' },
  { file: 'white-wood', query: 'birch wood pale white natural' },
  { file: 'cupcake',    query: 'cupcake dessert sweet bakery' },
]

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function httpsGet(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url)
    const req = https.get({ hostname: u.hostname, path: u.pathname + u.search, headers: { 'User-Agent': 'KikiFragancia/1.0', ...headers } }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location)
        return resolve(httpsGet(res.headers.location, headers))
      const chunks = []
      res.on('data', c => chunks.push(c))
      res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks) }))
    })
    req.on('error', reject)
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('timeout')) })
  })
}

async function downloadImage(imageUrl, destPath) {
  return new Promise(resolve => {
    const url = new URL(imageUrl)
    const req = https.get({ hostname: url.hostname, path: url.pathname + url.search, headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://www.pexels.com/' } }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) { req.destroy(); return resolve(downloadImage(res.headers.location, destPath)) }
      if (res.statusCode !== 200) { res.resume(); return resolve(false) }
      const out = fs.createWriteStream(destPath)
      res.pipe(out)
      out.on('finish', () => { out.close(); resolve(true) })
      out.on('error', () => resolve(false))
    })
    req.on('error', () => resolve(false))
    req.setTimeout(25000, () => { req.destroy(); resolve(false) })
  })
}

async function main() {
  for (const { file, query } of RETRY) {
    const destPath = path.join(OUT_DIR, file + '.jpg')
    await sleep(500)
    const { status, body } = await httpsGet(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=square`,
      { Authorization: PEXELS_KEY }
    )
    if (status !== 200) { console.log(`❌ API error ${status}: ${file}`); continue }
    const data = JSON.parse(body.toString())
    const imgUrl = data.photos?.[0]?.src?.medium
    if (!imgUrl) { console.log(`❌ Sin resultado: ${file} (query: ${query})`); continue }
    await sleep(500)
    const ok = await downloadImage(imgUrl, destPath)
    console.log(ok ? `✅ ${file}.jpg` : `❌ descarga fallida: ${file}`)
  }

  // Añadir al notes-images.js existente
  const raw = fs.readFileSync(MAP_FILE, 'utf-8')
  let updated = raw
  const additions = {
    'acorde ozónico': '/notes/ozone.jpg',
    'madera blanca':  '/notes/white-wood.jpg',
    'maderas blancas':'/notes/white-wood.jpg',
    'quequito':       '/notes/cupcake.jpg',
  }
  for (const [key, val] of Object.entries(additions)) {
    if (!raw.includes(`'${key}'`)) {
      updated = updated.replace('}\n', `  '${key}': '${val}',\n}\n`)
    }
  }
  fs.writeFileSync(MAP_FILE, updated)
  console.log('\n✅ notes-images.js actualizado')
}

main().catch(console.error)
