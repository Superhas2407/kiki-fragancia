// Single editable homepage promotion banner. Images contain their own
// typography and CTA, so the website must not overlay another logo or text.
export default {
  name: 'promotionBanner',
  title: 'Portada de promociones',
  type: 'document',
  fields: [
    {
      name: 'enabled', title: 'Mostrar portada', type: 'boolean', initialValue: false,
      description: 'La portada solo aparece si también hay promociones vigentes publicadas.'
    },
    {
      name: 'desktopImage', title: 'Imagen desktop (horizontal 16:9)',
      type: 'image', options: { hotspot: false },
      description: 'Sube la portada horizontal, con sus textos incorporados. No añadimos logotipo nuevo ni superponemos textos.'
    },
    {
      name: 'mobileImage', title: 'Imagen mobile (vertical 9:16)',
      type: 'image', options: { hotspot: false },
      description: 'Sube la versión vertical independiente; no recortaremos la imagen desktop para teléfonos.'
    },
    {
      name: 'altText', title: 'Descripción accesible', type: 'string',
      initialValue: 'Promociones disponibles en Kiki Fragancia. Explora los combos especiales en tus marcas favoritas.',
      validation: Rule => Rule.required().min(15)
    }
  ],
  validation: Rule => Rule.custom(doc => (
    !doc?.enabled || (doc?.desktopImage?.asset?._ref && doc?.mobileImage?.asset?._ref)
      ? true : 'Para activar la portada, sube ambas imágenes: desktop y mobile.'
  )),
  preview: {
    select: {media:'desktopImage',enabled:'enabled'},
    prepare({media,enabled}) {
      return {title:'Portada de promociones',subtitle:enabled?'Visible si hay promociones activas':'Oculta',media}
    }
  }
}
