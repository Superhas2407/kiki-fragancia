// Fuente única de productos: enriched (con imágenes) + catalog completo del PDF
// Los enriched tienen prioridad cuando coinciden por house+name

import { products as enriched } from './products-enriched'
import { catalog } from './catalog'

// Precios mapeados a los productos enriched (house → name → {precioUSD, precioBS})
const PRICE_OVERRIDES = {
  'ARMAF': {
    'Club de Nuit Sillage':       { precioUSD: 50, precioBS: 32500 },
    'Club de Nuit Milestone':     { precioUSD: 50, precioBS: 32500 },
    'Club de Nuit Iconic':        { precioUSD: 55, precioBS: 35750 },
    'Club de Nuit Intense Man':   { precioUSD: 40, precioBS: 26000 },
    'Club de Nuit Maleka Women':  { precioUSD: 50, precioBS: 32500 },
    'Club de Nuit Urban Man Elixir': { precioUSD: 50, precioBS: 32500 },
    'Club de Nuit Woman':         { precioUSD: 40, precioBS: 26000 },
    'Connoisseur Man':            { precioUSD: 45, precioBS: 29250 },
    'Mandarin Sky':               { precioUSD: 45, precioBS: 29250 },
    'Odyssey Artisto Red Edition':{ precioUSD: 50, precioBS: 32500 },
    'Odyssey Aoud':               { precioUSD: 45, precioBS: 29250 },
    'Odyssey Bahamas Tropical Unisex': { precioUSD: 60, precioBS: 39000 },
    'Odyssey Dubai Chocolat':     { precioUSD: 35, precioBS: 22750 },
    'Odyssey Homme Black':        { precioUSD: 40, precioBS: 26000 },
    'Odyssey Limoni':             { precioUSD: 35, precioBS: 22750 },
    'Odyssey Mandarin Sky':       { precioUSD: 45, precioBS: 29250 },
    'Odyssey Spectra':            { precioUSD: 35, precioBS: 22750 },
    'Odyssey Tyraht':             { precioUSD: 35, precioBS: 22750 },
    'Odyssey White Edition Men':  { precioUSD: 40, precioBS: 26000 },
    'Club de Nuit Precieux':      { precioUSD: 50, precioBS: 32500 },
  },
  'DUMONT': {
    'Nitro Black': { precioUSD: 45, precioBS: 29250 },
    'Nitro Red':   { precioUSD: 45, precioBS: 29250 },
  },
  'LATTAFA': {
    'Khamrah Dukhan':         { precioUSD: 40, precioBS: 26000 },
    'Khamrah':                { precioUSD: 35, precioBS: 22750 },
    'Confidential Platinum':  { precioUSD: 30, precioBS: 19500 },
    'Eternal Oud':            { precioUSD: 65, precioBS: 42250 },
    'Mashrabya':              { precioUSD: 40, precioBS: 26000 },
    'Winners Trophy Gold':    { precioUSD: 40, precioBS: 26000 },
    'His Confession':         { precioUSD: 45, precioBS: 29250 },
    'Taweel':                 { precioUSD: 45, precioBS: 29250 },
    'Teriao Intense':         { precioUSD: 50, precioBS: 32500 },
    'Ajwad':                  { precioUSD: 40, precioBS: 26000 },
    'Fakhar Lattafa':         { precioUSD: 35, precioBS: 22750 },
    'Fatima Latifa':          { precioUSD: 35, precioBS: 22750 },
    'Vintage Radio':          { precioUSD: 40, precioBS: 26000 },
    'Art of Universe':        { precioUSD: 50, precioBS: 32500 },
    'Bade Al Oud Amethyst':   { precioUSD: 35, precioBS: 22750 },
    'Nebras':                 { precioUSD: 40, precioBS: 26000 },
    'Unjamed Al Fursan':      { precioUSD: 40, precioBS: 26000 },
    'Abood The Kingdom':      { precioUSD: 40, precioBS: 26000 },
  },
  'AL HARAMAIN': {
    'Amber Oud Gold':         { precioUSD: 55, precioBS: 35750 },
    'Amber Oud Dubai Night':  { precioUSD: 75, precioBS: 48750 },
    'Amber Oud Classic':      { precioUSD: 60, precioBS: 39000 },
  },
  'BHARARA': {
    'King':   { precioUSD: 75, precioBS: 48750 },
    'Onyx':   { precioUSD: 90, precioBS: 58500 },
    'King Rose': { precioUSD: 85, precioBS: 55250 },
  },
}

// Enriquecer los productos con precios
const enrichedWithPrices = enriched.map(p => {
  const byHouse = PRICE_OVERRIDES[p.house]
  const prices  = byHouse ? byHouse[p.name] : null
  return prices ? { ...p, ...prices } : p
})

// Clave de deduplicación
function key(house, name) {
  return `${house.toLowerCase()}|${name.toLowerCase()}`
}

const enrichedKeys = new Set(enrichedWithPrices.map(p => key(p.house, p.name)))

// Filtrar catalog: solo los que NO están ya en enriched
const catalogOnly = catalog.filter(p => !enrichedKeys.has(key(p.house, p.name)))

export const allProducts = [...enrichedWithPrices, ...catalogOnly]
export default allProducts
