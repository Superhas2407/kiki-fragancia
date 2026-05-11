import { useScrollReveal } from '../hooks/useScrollReveal'

const pillars = [
  {
    title: 'Sello de Originalidad',
    desc: 'Cada fragancia pasa por un proceso de verificación riguroso. Trabajamos directamente con distribuidores autorizados y garantizamos la autenticidad de cada frasco.',
  },
  {
    title: 'Atención Personalizada',
    desc: 'Te asesoramos para encontrar la fragancia perfecta. Contáctanos por WhatsApp y responderemos en menos de 2 horas.',
  },
  {
    title: 'Asesoría Olfativa Personalizada',
    desc: 'Nuestros especialistas te guían para encontrar la fragancia que refleje tu esencia. Consulta gratuita por WhatsApp, sin compromiso de compra.',
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
      {/* Título con línea amber */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '14px' }}>
        <div
          style={{ width: '32px', height: '1px', background: '#C4781A', marginTop: '13px', flexShrink: 0 }}
        />
        <h3
          className="font-display text-carbon"
          style={{ fontSize: '22px', fontWeight: 400, letterSpacing: '-0.01em', lineHeight: 1.2 }}
        >
          {pillar.title}
        </h3>
      </div>

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
            style={{ fontSize: '10px', color: '#C4781A', fontWeight: 400 }}
          >
            Por qué elegirnos
          </p>
          <h2
            className="font-display text-carbon"
            style={{ fontSize: 'clamp(32px, 5vw, 46px)', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.1 }}
          >
            Lo que nos define
          </h2>
          <p
            className="font-display italic"
            style={{ fontSize: '20px', fontWeight: 300, color: 'rgba(26,18,8,0.35)', lineHeight: 1.55, marginTop: '16px' }}
          >
            Cada frasco que vendemos lo conocemos.<br />No somos una tienda. Somos entendidos.
          </p>
        </div>

        {/* Grid 3 columnas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {pillars.map((pillar, i) => (
            <PillarCard key={pillar.title} pillar={pillar} delay={i * 120} />
          ))}
        </div>

      </div>
    </section>
  )
}
