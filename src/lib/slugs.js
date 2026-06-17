import { norm } from './search'

export function toSlug(house, name, ml) {
  if (!house || !name) return ml ? `product-${ml}ml` : 'product'
  // Evitar duplicación si name ya empieza con house ("Afnan 9 AM" + house "Afnan" → "afnan-9-am")
  const displayName = name.toLowerCase().startsWith(house.toLowerCase() + ' ')
    ? name.slice(house.length + 1)
    : name
  const base = norm(`${house} ${displayName}`)
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '-')
  return ml ? `${base}-${ml}ml` : base
}
