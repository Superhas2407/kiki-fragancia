// Helpers para disparar eventos estándar del Meta/Facebook Pixel.
// El script base (init + PageView) vive en App.jsx (<MetaPixel />).

export const trackViewContent = (product) => {
  if (!product || !window.fbq) return
  window.fbq('track', 'ViewContent', {
    content_name: `${product.house} ${product.name}`,
    content_ids: [product.id],
    content_type: 'product',
    value: product.precioUSD || 0,
    currency: 'USD',
  })
}

export const trackAddToCart = (product, qty = 1) => {
  if (!product || !window.fbq) return
  window.fbq('track', 'AddToCart', {
    content_name: `${product.house} ${product.name}`,
    content_ids: [product.id],
    content_type: 'product',
    contents: [{ id: product.id, quantity: qty }],
    value: (product.precioUSD || 0) * qty,
    currency: 'USD',
  })
}

export const trackInitiateCheckout = (items, total) => {
  if (!window.fbq || !items?.length) return
  window.fbq('track', 'InitiateCheckout', {
    content_ids: items.map(item => item.id),
    content_type: 'product',
    contents: items.map(item => ({ id: item.id, quantity: item.quantity })),
    num_items: items.reduce((sum, item) => sum + item.quantity, 0),
    value: total || 0,
    currency: 'USD',
  })
}

export const trackContact = () => {
  if (window.fbq) window.fbq('track', 'Contact')
}
