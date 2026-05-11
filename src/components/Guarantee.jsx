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
    title: 'Atención Personalizada',
    desc: 'Te asesoramos para encontrar la fragancia perfecta. Contáctanos por WhatsApp y responderemos en menos de 2 horas.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
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
