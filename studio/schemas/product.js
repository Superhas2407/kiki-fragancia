import notesList from './notes-list.json'
import { NotesInput } from '../components/NotesInput'

const NOTES_OPTIONS = notesList.map(n => ({ title: n, value: n }))

const ACORDES_OPTIONS = [
  'acuático', 'ahumado', 'ámbar', 'amaderado', 'aromático',
  'avainillado', 'cálido especiado', 'caramelo', 'chipre', 'cítrico',
  'cuero', 'dulce', 'especiado', 'floral', 'fresco',
  'frutal', 'gourmand', 'herbal', 'marino', 'amoscado',
  'oriental', 'oud', 'powder', 'resinoso', 'seco',
  'terroso', 'verde',
].map(a => ({ title: a, value: a }))

export default {
  name: 'product',
  title: 'Producto',
  type: 'document',
  fields: [
    {
      name: 'id',
      title: 'ID',
      type: 'number',
      description: 'Número único. Obligatorio: sin ID (o con un ID repetido de otro producto), el producto NO aparece en el sitio — se descarta en silencio, sin ningún error visible ahí. Al duplicar un producto en Studio, este campo queda vacío: hay que ponerle un número nuevo que no use ningún otro producto.',
      readOnly: ({ document }) => !document?._id?.startsWith('drafts.'),
      validation: Rule => Rule.required().error('Sin ID, este producto no va a aparecer en el sitio.').custom(async (id, context) => {
        if (id == null) return true // required() ya lo marca
        const { document, getClient } = context
        const client = getClient({ apiVersion: '2024-01-01' })
        const publishedId = document._id.replace(/^drafts\./, '')
        const count = await client.fetch(
          `count(*[_type == "product" && id == $id && !(_id in [$pub, $draft])])`,
          { id, pub: publishedId, draft: `drafts.${publishedId}` }
        )
        return count === 0 || 'Este ID ya lo está usando otro producto — tiene que ser único.'
      }),
    },
    {
      name: 'house',
      title: 'Marca',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'name',
      title: 'Nombre',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    // ── Imagen ─────────────────────────────────────────────────────────
    {
      name: 'sanityImage',
      title: 'Foto (subida aquí)',
      type: 'image',
      description: 'Sube la foto directamente. Tiene prioridad sobre el nombre de archivo.',
      options: { hotspot: true },
    },
    {
      name: 'image',
      title: 'Foto (nombre de archivo)',
      type: 'string',
      description: 'Ej: lattafa-hayaati-100ml-m.webp — el archivo debe estar en /public/products/',
    },
    // ── Precio y datos de catálogo ──────────────────────────────────────
    {
      name: 'precioUSD',
      title: 'Precio (USD)',
      type: 'number',
    },
    {
      name: 'descuento',
      title: 'Descuento (%)',
      type: 'number',
      description: 'Porcentaje de descuento activo (ej: 10 → 10%). Dejar vacío si no hay descuento.',
      validation: Rule => Rule.min(1).max(99),
    },
    {
      name: 'agotado',
      title: 'Agotado (sin stock)',
      type: 'boolean',
      description: 'Actívalo cuando no quede stock. El sitio muestra automáticamente un badge "Agotado" y desactiva el botón de compra — no requiere ningún otro cambio.',
      initialValue: false,
    },
    {
      name: 'promoHalloween',
      title: 'Oferta Halloween 🎃 (solo admin)',
      type: 'boolean',
      description: 'Actívalo para marcar el producto como parte de la Oferta Halloween. IMPORTANTE: esta promo es privada — el sitio SOLO la muestra (cinta, precio, filtro) cuando vos estás logueado como admin en kikifragancia.com. Ningún visitante ni cliente la ve. Útil para preparar la campaña antes de lanzarla al público.',
      initialValue: false,
    },
    {
      name: 'precioPromoHalloween',
      title: 'Precio Oferta Halloween (USD)',
      type: 'number',
      description: 'Precio especial mientras dure la Oferta Halloween — solo visible para vos, logueado como admin. El precio de arriba (Precio USD) NO se toca — queda guardado como el precio normal para todos los demás. Al desactivar "Oferta Halloween" (o borrar este campo), no cambia nada para el público.',
      hidden: ({ parent }) => !parent?.promoHalloween,
      validation: Rule => Rule.min(0),
    },
    {
      name: 'ml',
      title: 'Mililitros',
      type: 'number',
    },
    {
      name: 'genero',
      title: 'Género',
      type: 'string',
      options: {
        list: [
          { title: 'Masculino', value: 'Masculino' },
          { title: 'Femenino',  value: 'Femenino'  },
          { title: 'Unisex',    value: 'Unisex'    },
          { title: 'Niño',      value: 'Niño'      },
        ],
      },
    },
    {
      name: 'familia',
      title: 'Familia olfativa',
      type: 'string',
    },
    {
      name: 'tipo',
      title: 'Concentración',
      type: 'string',
      options: {
        list: [
          { title: 'Eau de Parfum',     value: 'Eau de Parfum'     },
          { title: 'Eau de Toilette',   value: 'Eau de Toilette'   },
          { title: 'Parfum',            value: 'Parfum'            },
          { title: 'Extrait de Parfum', value: 'Extrait de Parfum' },
          { title: 'Elixir',            value: 'Elixir'            },
          { title: 'Eau de Cologne',    value: 'Eau de Cologne'    },
        ],
      },
    },
    {
      name: 'categoria',
      title: 'Categoría',
      type: 'string',
      options: {
        list: [
          { title: 'Árabes',    value: 'arabes'    },
          { title: 'Diseñador', value: 'disenador' },
          { title: 'Nicho',     value: 'nicho'     },
        ],
      },
    },
    {
      name: 'variantIds',
      title: 'Otras presentaciones (variantes)',
      type: 'array',
      of: [{
        type: 'reference',
        to: [{ type: 'product' }],
        options: {
          filter: ({ document }) => ({
            filter: '_id != $id',
            params: { id: (document?._id ?? '').replace(/^drafts\./, '') },
          }),
        },
      }],
      description: 'Otras presentaciones de este mismo perfume (distinto ml y/o concentración, ej: 90ml y 200ml). Buscá el producto por nombre — cada opción te muestra su marca, ml, concentración, precio y si está agotado, para que no tengas que adivinar IDs.',
      validation: Rule => Rule.unique(),
    },
    // ── Descripción ─────────────────────────────────────────────────────
    {
      name: 'descripcion',
      title: 'Descripción',
      type: 'text',
      rows: 4,
    },
    // ── Notas olfativas ─────────────────────────────────────────────────
    {
      name: 'notasSalida',
      title: 'Notas de salida',
      type: 'array',
      of: [{ type: 'string' }],
      components: { input: NotesInput },
      description: 'Las primeras notas que se perciben (5–30 min).',
    },
    {
      name: 'notasCorazon',
      title: 'Notas de corazón',
      type: 'array',
      of: [{ type: 'string' }],
      components: { input: NotesInput },
      description: 'El alma del perfume (30 min – 2 h).',
    },
    {
      name: 'notasFondo',
      title: 'Notas de fondo',
      type: 'array',
      of: [{ type: 'string' }],
      components: { input: NotesInput },
      description: 'Las notas que quedan (2 h+). Base y estela.',
    },
    // ── Acordes olfativos ───────────────────────────────────────────────
    {
      name: 'acordes',
      title: 'Acordes olfativos',
      type: 'array',
      of: [{
        type: 'object',
        name: 'acorde',
        fields: [
          {
            name: 'label',
            title: 'Acorde',
            type: 'string',
            options: {
              list: ACORDES_OPTIONS,
            },
            validation: Rule => Rule.required(),
          },
          {
            name: 'pct',
            title: 'Porcentaje (%)',
            type: 'number',
            description: '0–100',
            validation: Rule => Rule.required().min(1).max(100),
          },
        ],
        preview: {
          select: { title: 'label', subtitle: 'pct' },
          prepare: ({ title, subtitle }) => ({ title, subtitle: `${subtitle}%` }),
        },
      }],
      description: 'Hasta 4 acordes principales, de mayor a menor porcentaje.',
      validation: Rule => Rule.max(4),
    },
    // ── Cuándo usar ─────────────────────────────────────────────────────
    {
      name: 'cuandoEpocaSeca',
      title: '¿Cuándo usar? — Funciona en época seca / calor',
      type: 'boolean',
      initialValue: true,
    },
    {
      name: 'cuandoLluviosa',
      title: '¿Cuándo usar? — Funciona en lluvia / humedad',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'cuandoDia',
      title: '¿Cuándo usar? — Funciona de día',
      type: 'boolean',
      initialValue: true,
    },
    {
      name: 'cuandoNoche',
      title: '¿Cuándo usar? — Funciona de noche',
      type: 'boolean',
      initialValue: false,
    },
  ],
  preview: {
    select: {
      title: 'name',
      house: 'house',
      media: 'sanityImage',
      ml: 'ml',
      tipo: 'tipo',
      precioUSD: 'precioUSD',
      agotado: 'agotado',
    },
    prepare({ title, house, media, ml, tipo, precioUSD, agotado }) {
      const tipoAbbr = {
        'Eau de Parfum': 'EDP', 'Eau de Toilette': 'EDT', 'Eau de Cologne': 'EDC',
        'Parfum': 'Parfum', 'Extrait de Parfum': 'Extrait', 'Elixir': 'Elixir',
      }[tipo] ?? tipo
      const parts = [house, ml ? `${ml}ml` : null, tipoAbbr, precioUSD ? `$${precioUSD}` : null].filter(Boolean)
      return {
        title,
        subtitle: (agotado ? '⛔ Agotado · ' : '') + parts.join(' · '),
        media,
      }
    },
  },
}
