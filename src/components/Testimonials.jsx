import { useState, useEffect, useRef } from 'react'
import { motion, useAnimation, useInView } from 'framer-motion'

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Karen Parra',
    content: 'Tenía semanas buscando mi perfume favorito. No solo lo encontré en Kiki Fragancia sino en tiempo récord me respondieron, me atendieron y me lo entregaron. Muy buen precio y excelente atención.',
    initials: 'KP',
  },
  {
    id: 2,
    name: 'Orianna Rivero',
    content: 'Excelente servicio y atención. He logrado conseguir perfumes que pensé que ya no existían hasta perfumes que son tendencia. Sin duda una perfumería muy completa — tienen probadores de muchas fragancias y así uno está más seguro a la hora de comprar.',
    initials: 'OR',
  },
  {
    id: 3,
    name: 'Mariangel Ramírez',
    content: 'Excelentes, siempre resuelvo mis regalos con ellos. Totalmente originales.',
    initials: 'MR',
  },
  {
    id: 4,
    name: 'Nikolas Romero',
    content: 'Excelentes perfumes, tienen variedad. Recomendado al 100%.',
    initials: 'NR',
  },
  {
    id: 5,
    name: 'Yesenia Acosta',
    content: 'Buena ubicación, excelente atención, excelentes productos, buenos precios. Los recomiendo.',
    initials: 'YA',
  },
]

export default function Testimonials() {
  const [active, setActive] = useState(0)
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) controls.start('visible')
  }, [isInView, controls])

  useEffect(() => {
    const interval = setInterval(() => {
      setActive(i => (i + 1) % TESTIMONIALS.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section ref={sectionRef} className="testimonials-section">
      <div className="kiki-container">
        <motion.div
          initial="hidden"
          animate={controls}
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } } }}
          className="testimonials-grid"
        >
          {/* Izquierda */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
            className="testimonials-left"
          >
            <p className="testimonials-eyebrow">— Opiniones reales</p>
            <h2 className="testimonials-title">Lo que dicen<br />nuestros clientes</h2>
            <p className="testimonials-sub">
              Más de 5 años entregando fragancias originales en Venezuela. Estas son algunas de sus palabras.
            </p>
            {/* Dots */}
            <div className="testimonials-dots">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`testimonials-dot${active === i ? ' active' : ''}`}
                  aria-label={`Ver opinión ${i + 1}`}
                />
              ))}
            </div>
          </motion.div>

          {/* Derecha — cards */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
            className="testimonials-right"
            style={{ touchAction: 'pan-y' }}
          >
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.id}
                className="testimonial-card"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: active === i ? 1 : 0,
                  scale: active === i ? 1 : 0.97,
                }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                style={{ zIndex: active === i ? 10 : 0 }}
              >
                {/* Estrellas */}
                <div className="testimonial-stars">
                  {[...Array(5)].map((_, s) => (
                    <span key={s} className="testimonial-star">★</span>
                  ))}
                </div>
                {/* Cita */}
                <p className="testimonial-quote">"{t.content}"</p>
                {/* Separador */}
                <div className="testimonial-sep" />
                {/* Autor */}
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.initials}</div>
                  <div>
                    <p className="testimonial-name">{t.name}</p>
                    <p className="testimonial-source">Google Reviews · Kiki Fragancia</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
