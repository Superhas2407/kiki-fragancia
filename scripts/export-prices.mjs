/**
 * Exporta todos los productos con sus precios actuales a un CSV editable.
 * Run: node scripts/export-prices.mjs
 * Abre el CSV en Excel, edita la columna precioUSD, guarda como CSV y corre import-prices.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const { products } = await import('../src/data/products-enriched.js')

const rows = [
  ['id', 'house', 'name', 'ml', 'tipo', 'precioUSD'],
  ...products.map(p => [
    p.id,
    p.house,
    p.name,
    p.ml ?? '',
    p.tipo ?? '',
    p.precioUSD ?? '',
  ])
]

const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
const out = path.join(__dirname, '../precios.csv')
fs.writeFileSync(out, '﻿' + csv, 'utf-8') // BOM para que Excel abra con tildes correctas
console.log(`✅ Exportado: precios.csv (${products.length} productos)`)
console.log('   Abre en Excel, edita precioUSD, guarda como CSV y corre: node scripts/import-prices.mjs')
