import { Link } from 'react-router-dom'
import { COLECCIONES } from '../data/colecciones'

export default function ColeccionesSection() {
  return (
    <section className="colecciones-section">
      <div className="colecciones-inner">
        <p className="colecciones-eyebrow">Por ocasión</p>
        <h2 className="colecciones-heading">¿Para qué momento?</h2>
        <div className="colecciones-grid">
          {COLECCIONES.map(col => (
            <Link
              key={col.key}
              to={`/tienda?coleccion=${col.key}`}
              className="coleccion-tile"
            >
              <span className="coleccion-emoji">{col.emoji}</span>
              <span className="coleccion-titulo">{col.titulo}</span>
              <span className="coleccion-subtitulo">{col.subtitulo}</span>
              <span className="coleccion-cta">Ver fragancias →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
