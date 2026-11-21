// Campañas de la tienda. Identificación por ID del catálogo y presentación exacta.
// La disponibilidad sigue dependiendo del inventario vivo de Sanity.
export const STORE_PROMOTIONS = [
  { id: 'nautica', label: '3 × $60', name: 'Nautica', count: 3, price: 60, active: false, productIds: [383, 413, 588] },
  { id: 'benetton', label: '3 × $60', name: 'Benetton Colors / United Dreams', count: 3, price: 60, active: true, productIds: [382, 392, 587, 589, 590] },
  { id: 'sisterland', label: '3 × $60', name: 'Benetton Sisterland', count: 3, price: 60, active: true, productIds: [59, 417, 436, 472, 473, 474] },
  { id: 'banderas200', label: '3 × $90', name: 'Antonio Banderas 200 ml', count: 3, price: 90, active: true, productIds: [12, 355, 378, 447] },
  { id: 'guess', label: '2 × $70', name: 'Guess Woman + Guess Gold', count: 2, price: 70, active: true, productIds: [110, 617] },
  { id: 'stallion', label: '$30', name: 'Emper Stallion 53', count: 1, price: 30, active: true, productIds: [102] },
]

const EXPECTED_ML = { nautica: 100, benetton: 100, sisterland: 80, banderas200: 200, guess: 75, stallion: 100 }
const EXPECTED_HOUSE = { nautica: 'nautica', benetton: 'benetton', sisterland: 'benetton', banderas200: 'antonio banderas', guess: 'guess', stallion: 'emper' }
const norm = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()

export function promotionForProduct(product) {
  if (!product || product.agotado) return null
  const promo = STORE_PROMOTIONS.find(p => p.active && p.productIds.includes(Number(product.id)))
  if (!promo) return null
  if (Number(product.ml) !== EXPECTED_ML[promo.id]) return null
  if (norm(product.house) !== EXPECTED_HOUSE[promo.id]) return null
  return promo
}
