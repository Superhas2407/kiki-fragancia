import { norm } from './search'

export function toSlug(house, name, ml) {
  const base = norm(`${house} ${name}`)
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '-')
  return ml ? `${base}-${ml}ml` : base
}
