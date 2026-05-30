/**
 * Lee precios.csv y actualiza precioUSD en products-enriched.js y products-index.js
 * Run: node scripts/import-prices.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CSV = path.join(__dirname, '../precios.csv')
const ENRICHED = path.join(__dirname, '../src/data/products-enriched.js')
const INDEX = path.join(__dirname, '../src/data/products-index.js')

if (!fs.existsSync(CSV)) {
  console.error('❌ No se encuentra precios.csv. Corre primero: node scripts/export-prices.mjs')
  process.exit(1)
}

// Parse CSV
const raw = fs.readFileSync(CSV, 'utf-8').replace(/^﻿/, '')
const lines = raw.split('\n').filter(l => l.trim())
const headers = lines[0].split(',').map(h => h.replace(/^"|"$/g, ''))
const idIdx     = headers.indexOf('id')
const precioIdx = headers.indexOf('precioUSD')

const newPrices = {}
for (const line of lines.slice(1)) {
  const cols = line.match(/"([^"]*)"/g)?.map(v => v.replace(/^"|"$/g, '')) ?? line.split(',')
  const id = parseInt(cols[idIdx])
  const precio = cols[precioIdx] === '' ? null : parseFloat(cols[precioIdx])
  if (!isNaN(id)) newPrices[id] = precio
}

// Apply to both files
let changed = 0
for (const file of [ENRICHED, INDEX]) {
  const { products } = await import(file + '?t=' + Date.now())
  const updated = products.map(p => {
    if (!(p.id in newPrices)) return p
    const newPrice = newPrices[p.id]
    if (newPrice === p.precioUSD) return p
    changed++
    const { precioUSD, precioBS, ...rest } = p
    return newPrice ? { ...rest, precioUSD: newPrice } : { ...rest }
  })
  fs.writeFileSync(file, `export const products = ${JSON.stringify(updated, null, 2)}\n`)
}

console.log(`✅ ${changed / 2} precios actualizados en products-enriched.js y products-index.js`)
