import { promotionForProduct, STORE_PROMOTIONS } from '../data/store-promotions.js'

// El total es una referencia en USD; el método de pago se decide por separado.
// Todos los productos deben venir del catálogo actualizado antes de calcular.
export function calculateCartPromotions(items, currency = 'usd') {
  const lines = Array.isArray(items) ? items : []
  const subtotal = lines.reduce((sum, p) => sum + Math.max(0, Number(p.precioUSD) || 0) * Math.max(0, Math.floor(Number(p.quantity) || 0)), 0)
  if (currency !== 'usd') return { subtotal, total: subtotal, savings: 0, applied: [] }
  const applied = []
  let savings = 0
  for (const promo of STORE_PROMOTIONS.filter(p => p.active)) {
    const eligible = lines.filter(p => promotionForProduct(p)?.id === promo.id)
    const units = eligible.flatMap(p => Array.from({ length: Math.min(1000, Math.max(0, Math.floor(Number(p.quantity) || 0))) }, () => ({
      id: p.id, amount: Math.max(0, Number(p.precioUSD) || 0),
    })))
    units.sort((a, b) => b.amount - a.amount)
    if (promo.count === 1) {
      for (const unit of units) {
        if (unit.amount <= promo.price) continue
        const discount = unit.amount - promo.price
        savings += discount
        applied.push({ id: promo.id, label: promo.name, count: 1, price: promo.price, savings: discount, products: [unit.id] })
      }
      continue
    }
    const count = Math.floor(units.length / promo.count)
    for (let n = 0; n < count; n++) {
      const group = units.slice(n * promo.count, (n + 1) * promo.count)
      const original = group.reduce((sum, unit) => sum + unit.amount, 0)
      // No aumentar el precio si un combo cuesta más que sus productos sueltos.
      if (original < promo.price) continue
      const discount = original - promo.price
      savings += discount
      applied.push({ id: promo.id, label: promo.name, count: promo.count, price: promo.price, savings: discount, products: group.map(u => u.id) })
    }
  }
  return { subtotal, total: Math.max(0, subtotal - savings), savings, applied }
}
