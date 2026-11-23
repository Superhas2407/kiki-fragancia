export default {
  name: 'promotion',
  title: 'Promoción',
  type: 'document',
  fields: [
    { name: 'name', title: 'Nombre de la promoción', type: 'string',
      validation: Rule => Rule.required().min(3) },
    { name: 'slug', title: 'Identificador / enlace', type: 'slug',
      options: { source: 'name', maxLength: 70 },
      description: 'Identificador único usado para armar el combo en la web.',
      validation: Rule => Rule.required() },
    { name: 'active', title: 'Promoción activa', type: 'boolean', initialValue: false,
      description: 'Desactivada por defecto. Solo las promociones publicadas y activas aparecen en la web y son consultadas por Camila.' },
    { name: 'count', title: 'Cantidad de perfumes por combo', type: 'number', initialValue: 3,
      description: 'Ejemplo: 3 para tres perfumes por $60; 1 para un precio individual especial.',
      validation: Rule => Rule.required().integer().min(1).max(10) },
    { name: 'priceUSD', title: 'Precio total del combo en divisas (USD)', type: 'number',
      description: 'Precio del conjunto completo, no precio unitario (salvo count = 1).',
      validation: Rule => Rule.required().greaterThan(0).max(1000000) },
    { name: 'eligibleProducts', title: 'Perfumes participantes', type: 'array',
      of: [{ type: 'reference', to: [{ type: 'product' }] }],
      options: { layout: 'tags' },
      description: 'Selecciona cada presentación exacta. El cliente podrá combinarlas o repetirlas.',
      validation: Rule => Rule.required().min(1).unique() },
    { name: 'startsAt', title: 'Fecha de inicio (opcional)', type: 'datetime',
      description: 'Si se indica, no se ofrecerá la promoción antes de esta fecha.' },
    { name: 'endsAt', title: 'Fecha de finalización (opcional)', type: 'datetime',
      description: 'Si se indica, la promoción se desactivará automáticamente al llegar esta fecha.',
      validation: Rule => Rule.custom((end, context) => {
        const start = context.document?.startsAt
        return !end || !start || Date.parse(end) > Date.parse(start)
          || 'La fecha de finalización debe ser posterior al inicio.'
      }) },
    { name: 'conditions', title: 'Condiciones para clientes', type: 'text', rows: 3,
      description: 'Ej.: únicamente en divisas. No incluyas fechas ni existencias que no estén confirmadas.' },
  ],
  preview: {
    select: { title: 'name', active: 'active', count: 'count', price: 'priceUSD', endsAt: 'endsAt' },
    prepare({ title, active, count, price, endsAt }) {
      const ended = endsAt && Date.parse(endsAt) <= Date.now()
      return { title, subtitle: `${active && !ended ? '🟢 Activa' : '⚪ Inactiva'} · ${count || '?'} por $${price ?? '?'}` }
    },
  },
}
