// Promociones para señalización en Tienda. No altera precios unitarios ni el checkout.
// Cambiar active a false cuando una campaña termine o el inventario no esté confirmado.
export const STORE_PROMOTIONS = [
  { id: 'nautica', label: '3 × $60', name: 'Nautica', count: 3, price: 60, active: true },
  { id: 'benetton', label: '3 × $60', name: 'Benetton', count: 3, price: 60, active: true },
  { id: 'sisterland', label: '3 × $60', name: 'Sisterland', count: 3, price: 60, active: true },
  { id: 'banderas200', label: '3 × $90', name: 'Antonio Banderas 200 ml', count: 3, price: 90, active: true },
  { id: 'guess', label: '2 × $70', name: 'Guess Woman + Guess Gold', count: 2, price: 70, active: true },
  { id: 'stallion', label: '$30', name: 'Stallion', count: 1, price: 30, active: true },
]

const norm = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()

export function promotionForProduct(product) {
  if (!product || product.agotado) return null
  const house = norm(product.house)
  const name = norm(product.name)
  const ml = Number(product.ml)
  // Match conservador: no etiquetar toda la marca si hay líneas excluidas.
  const id =
    house.includes('nautica') && ml === 100 && /\b(blue|classic|voyage|pure blue)\b/.test(name) ? 'nautica' :
    house.includes('benetton') && /sisterland/.test(name) && ml === 80 ? 'sisterland' :
    house.includes('benetton') && ml === 100 && !/tribe|sisterland/.test(name) && /(colors|united dreams|together)/.test(name) ? 'benetton' :
    (house.includes('antonio banderas') || name.includes('antonio banderas')) && ml === 200 &&
      /(black seduction|the secret|golden secret|blue seduction)/.test(name) ? 'banderas200' :
    house.includes('guess') && /(guess woman|guess gold|guess for women|guess by marciano gold)/.test(name) ? 'guess' :
    /\bstallion\b/.test(name) ? 'stallion' : null
  return STORE_PROMOTIONS.find(p => p.id === id && p.active) || null
}
