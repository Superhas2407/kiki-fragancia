const WEBSITE_ORIGIN = 'https://kikifragancia.com'

// The Studio has a different origin: relative /products URLs must point at the shop.
export function legacyImageUrl(image) {
  if (typeof image !== 'string' || !image.trim()) return null
  const value = image.trim()
  if (/^https?:\/\//i.test(value)) return value
  const filename = value.replace(/^\/?products\//, '')
  return new URL(
    '/products/' + filename.split('/').map(encodeURIComponent).join('/'),
    WEBSITE_ORIGIN,
  ).href
}
