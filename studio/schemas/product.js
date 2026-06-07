export default {
  name: 'product',
  title: 'Producto',
  type: 'document',
  fields: [
    {
      name: 'id',
      title: 'ID',
      type: 'number',
      readOnly: true,
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
      title: 'IDs de variantes (200 ml)',
      type: 'array',
      of: [{ type: 'number' }],
      description: 'Si este producto tiene variante 200ml, agrega el ID de esa variante aquí.',
    },
    // ── Descripción y notas ─────────────────────────────────────────────
    {
      name: 'descripcion',
      title: 'Descripción',
      type: 'text',
      rows: 4,
    },
    {
      name: 'notasSalida',
      title: 'Notas de salida',
      type: 'string',
    },
    {
      name: 'notasCorazon',
      title: 'Notas de corazón',
      type: 'string',
    },
    {
      name: 'notasFondo',
      title: 'Notas de fondo',
      type: 'string',
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
            description: 'Ej: Amaderado, Oud, Especiado',
          },
          {
            name: 'pct',
            title: 'Porcentaje (%)',
            type: 'number',
            description: '0–100',
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
      subtitle: 'house',
      media: 'sanityImage',
    },
  },
}
