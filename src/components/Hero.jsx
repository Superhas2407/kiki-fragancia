export default function Hero() {
  return (
    <section
      className="relative flex items-center overflow-hidden"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(150deg, #1A1208 0%, #251A0E 60%, #3D2410 100%)',
      }}
    >
      {/* Gradiente de cierre inferior */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: '30%',
          background: 'linear-gradient(to bottom, transparent, #251A0E)',
        }}
      />

      {/* Contenido — alineado a la izquierda */}
      <div
        className="relative z-10 flex flex-col items-start py-24"
        style={{ paddingLeft: 'clamp(40px, 8vw, 120px)', paddingRight: '24px', maxWidth: '840px' }}
      >
        {/* Kicker */}
        <p
          className="font-sans text-gold mb-8 tracking-[0.3em] uppercase"
          style={{ fontSize: '11px', fontWeight: 300 }}
        >
          Perfumería · Venezuela
        </p>

        {/* Línea decorativa */}
        <div className="mb-8" style={{ width: '48px', height: '1px', background: '#C4781A', opacity: 0.7 }} />

        {/* Titular */}
        <h1
          className="font-display italic text-ivory leading-[1.05] mb-6"
          style={{ fontSize: 'clamp(42px, 8vw, 72px)', letterSpacing: '-0.02em' }}
        >
          El Aroma de la<br />Autenticidad
        </h1>

        {/* Subtítulo */}
        <p
          className="font-sans text-ivory/50 uppercase tracking-[0.22em] mb-8"
          style={{ fontSize: '11px', fontWeight: 300, maxWidth: '380px', lineHeight: '1.9' }}
        >
          Fragancias 100&nbsp;% originales de las casas más<br className="hidden md:block" />
          exclusivas del mundo. Verificadas. Exclusivas.
        </p>

        {/* Slogan */}
        <div className="flex flex-col items-start mb-12 gap-4">
          <div style={{ width: '40px', height: '1px', background: '#C4781A', opacity: 0.7 }} />
          <p
            className="font-display italic"
            style={{
              fontSize: 'clamp(16px, 2vw, 22px)',
              fontWeight: 300,
              color: 'rgba(247,242,234,0.7)',
              lineHeight: 1.5,
              maxWidth: '480px',
              letterSpacing: '0.01em',
            }}
          >
            Oler bien deja gratos recuerdos,<br />con KiKi Fragancia nunca te olvidarán.
          </p>
        </div>

        {/* CTA */}
        <a
          href="/tienda"
          className="btn-shimmer inline-flex items-center gap-3 font-sans text-ivory/90 hover:text-ivory transition-colors duration-300"
          style={{
            fontSize: '11px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            border: '1px solid rgba(196,120,26,0.65)',
            padding: '14px 36px',
            fontWeight: 400,
          }}
        >
          Ver Colección
          <span style={{ fontSize: '14px', color: '#C4781A' }}>→</span>
        </a>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 flex flex-col items-center gap-2"
        style={{ transform: 'translateX(-50%)' }}
        aria-hidden="true"
      >
        <span
          className="font-sans text-ivory/30 uppercase tracking-[0.2em]"
          style={{ fontSize: '9px' }}
        >
          Scroll
        </span>
        <div
          className="scroll-line"
          style={{
            width: '1px',
            height: '48px',
            background: 'linear-gradient(to bottom, #C4781A, transparent)',
          }}
        />
      </div>
    </section>
  )
}
