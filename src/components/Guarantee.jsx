import { useScrollReveal } from '../hooks/useScrollReveal'

const pillars = [
  {
    num: '01',
    title: 'Sello de Originalidad',
    desc: 'Cada fragancia pasa por un proceso de verificación riguroso. Trabajamos directamente con distribuidores autorizados y garantizamos la autenticidad de cada frasco.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Envío Protegido a Toda Venezuela',
    desc: 'Embalaje especializado diseñado para proteger cada botella en tránsito. Cobertura nacional con seguimiento en tiempo real y entrega segura garantizada.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Asesoría Olfativa Personalizada',
    desc: 'Nuestros especialistas te guían para encontrar la fragancia que refleje tu esencia. Consulta gratuita por WhatsApp, sin compromiso de compra.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
]

function PillarCard({ pillar, delay }) {
  const ref = useScrollReveal({ threshold: 0.1, delay })

  return (
    <div
      ref={ref}
      className="flex flex-col"
      style={{ borderTop: '1px solid var(--border)', paddingTop: '32px' }}
    >
      {/* Número grande */}
      <span
        className="font-display leading-none mb-6 select-none"
        style={{ fontSize: '56px', color: '#C9A84C', opacity: 0.18, letterSpacing: '-0.04em' }}
      >
        {pillar.num}
      </span>

      {/* Ícono */}
      <span className="mb-5" style={{ color: '#C9A84C' }}>
        {pillar.icon}
      </span>

      {/* Título */}
      <h3
        className="font-display text-carbon mb-3"
        style={{ fontSize: '22px', fontWeight: 400, letterSpacing: '-0.01em', lineHeight: 1.2 }}
      >
        {pillar.title}
      </h3>

      {/* Descripción */}
      <p
        className="font-sans text-carbon/55 leading-relaxed"
        style={{ fontSize: '14px', fontWeight: 300, lineHeight: 1.75 }}
      >
        {pillar.desc}
      </p>
    </div>
  )
}

export default function Guarantee() {
  const headRef = useScrollReveal({ threshold: 0.2 })

  return (
    <section style={{ background: 'var(--ivory)', padding: '96px 0' }}>
      <div className="max-w-6xl mx-auto px-6">

        {/* Header de sección */}
        <div ref={headRef} className="mb-16 max-w-lg">
          <p
            className="font-sans uppercase tracking-[0.25em] mb-4"
            style={{ fontSize: '10px', color: '#C9A84C', fontWeight: 400 }}
          >
            Por qué elegirnos
          </p>
          <h2
            className="font-display text-carbon"
            style={{ fontSize: 'clamp(32px, 5vw, 46px)', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.1 }}
          >
            Nuestra Promesa<br />de Calidad
          </h2>
        </div>

        {/* Grid 3 columnas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {pillars.map((pillar, i) => (
            <PillarCard key={pillar.num} pillar={pillar} delay={i * 120} />
          ))}
        </div>

      </div>
    </section>
  )
}
