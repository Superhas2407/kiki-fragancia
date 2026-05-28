import { useScrollReveal } from '../hooks/useScrollReveal'

const PILLARS = [
  {
    title: 'Sello de Originalidad',
    desc: 'Cada fragancia pasa por un proceso de verificación riguroso. Trabajamos directamente con distribuidores autorizados y garantizamos la autenticidad de cada frasco.',
  },
  {
    title: 'Atención Personalizada',
    desc: 'Te asesoramos para encontrar la fragancia perfecta. Contáctanos por WhatsApp para una asesoría personalizada sin costo.',
  },
  {
    title: 'Asesoría Olfativa',
    desc: 'Nuestros especialistas te guían para encontrar la fragancia que refleje tu esencia. Consulta gratuita por WhatsApp, sin compromiso de compra.',
  },
]

function PillarCard({ pillar, delay }) {
  const ref = useScrollReveal({ threshold: 0.1, delay })
  return (
    <div ref={ref} className="pillar-card">
      <div className="pillar-header">
        <div className="pillar-line"></div>
        <h3 className="pillar-title">{pillar.title}</h3>
      </div>
      <p className="pillar-desc">{pillar.desc}</p>
    </div>
  )
}

export default function Guarantee() {
  const headRef = useScrollReveal({ threshold: 0.2 })
  return (
    <section className="guarantee-section section-pad">
      <div className="kiki-container">
        <div ref={headRef} className="kiki-section-head" style={{ maxWidth: 520 }}>
          <span className="eyebrow-gold">Por qué elegirnos</span>
          <h2 className="kiki-section-title title-light">Lo que nos define</h2>
          <p className="kiki-section-subtitle subtitle-light">
            Cada frasco que vendemos lo conocemos.<br />No somos una tienda. Somos entendidos.
          </p>
        </div>
        <div className="pillars-grid">
          {PILLARS.map((p, i) => (
            <PillarCard key={p.title} pillar={p} delay={i * 120} />
          ))}
        </div>
      </div>
    </section>
  )
}
