export const COLECCIONES = [
  {
    key: 'joven',
    titulo: 'Para jóvenes',
    subtitulo: 'Frescos, frutales y dulces — perfectos para el día a día en la universidad o el bachillerato.',
    emoji: '🎓',
    ids: [20, 22, 29, 42, 48, 50, 67, 68, 70, 99, 100, 123, 125, 126, 133, 134, 136, 137, 138],
  },
  {
    key: 'diario',
    titulo: 'Uso diario',
    subtitulo: 'Livianos, limpios y versátiles — para oler bien sin esfuerzo todos los días.',
    emoji: '☀️',
    ids: [5, 31, 45, 74, 82, 99, 100, 135, 136, 137, 140, 4, 57, 117, 116],
  },
  {
    key: 'noche',
    titulo: 'Para salir',
    subtitulo: 'Proyección intensa y larga duración — para noches y ocasiones especiales.',
    emoji: '🌙',
    ids: [3, 6, 7, 19, 56, 72, 88, 89, 104, 120, 121, 122, 26, 47],
  },
  {
    key: 'trabajo',
    titulo: 'Para el trabajo',
    subtitulo: 'Discretos y profesionales — presencia sin exageración en la oficina.',
    emoji: '💼',
    ids: [27, 44, 57, 76, 77, 85, 104, 105, 116, 117, 129, 90, 106],
  },
]

export const coleccionById = Object.fromEntries(COLECCIONES.map(c => [c.key, c]))
