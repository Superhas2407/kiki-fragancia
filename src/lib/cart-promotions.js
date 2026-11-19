import { promotionForProduct, STORE_PROMOTIONS } from '../data/store-promotions'

// Calcula combos completos de forma determinista; unidades restantes conservan su precio base.
// No mezcla campañas y nunca utiliza productos agotados para completar un combo.
export function calculateCartPromotions(items, currency = 'usd') {
  const subtotal = items.reduce((sum, p) => sum + Math.max(0, Number(p.precioUSD) || 0) * Math.max(0, Number(p.quantity) || 0), 0)
  if (currency !== 'usd') return { subtotal, total: subtotal, savings: 0, applied: [] }
  const applied = []
  let savings = 0
  for (const promo of STORE_PROMOTIONS.filter(p => p.active)) {
    // Los precios especiales unitarios no son descuentos de combo y no se recalculan.
    if (promo.count < 2) continue
    const eligible = items.filter(p => promotionForProduct(p)?.id === promo.id)
    const units = eligible.flatMap(p => Array.from({ length: Math.max(0, Math.floor(Number(p.quantity) || 0)) }, () => ({
      id: p.id, amount: Math.max(0, Number(p.precioUSD) || 0),
    })))
    // Agrupar los más caros primero hace que el descuento resulte favorable al cliente.
    units.sort((a,b) => b.amount - a.amount)
    const combinations = Math.floor(units.length / promo.count)
    for (let n = 0; n < combinations; n++) {
      const group = units.slice(n * promo.count, (n + 1) * promo.count)
      const original = group.reduce((sum, unit) => sum + unit.amount, 0)
      // Nunca aumentar un total debido a una promoción.
      if (original < promo.price) continue
      const discount = original - promo.price
      savings += discount
      applied.push({ id: promo.id, label: promo.name, count: promo.count, price: promo.price, savings: discount, products: group.map(u => u.id) })
    }
  }
  return { subtotal, total: Math.max(0, subtotal - savings), savings, applied }
}
