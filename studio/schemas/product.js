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
    {
      name: 'imagen',
      title: 'Foto del producto',
      type: 'image',
      options: { hotspot: true },
    },
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
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'house',
      media: 'imagen',
    },
  },
}
