export default function Hero() {
  return (
    <section
      className="relative flex items-center justify-center overflow-hidden"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #0A0A0A 0%, #1C1A16 100%)',
      }}
    >
      {/* Imagen de ambiente — luminosity + baja opacidad */}
      <img
        src="https://images.unsplash.com/photo-1557170334-a9632e77c6e4?w=1200&q=80"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
        style={{ mixBlendMode: 'luminosity', opacity: 0.22 }}
      />

      {/* Gradiente de cierre inferior para suavizar transición */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: '30%',
          background: 'linear-gradient(to bottom, transparent, #1C1A16)',
        }}
      />

      {/* Contenido principal */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 py-24">
        {/* Kicker */}
        <p
          className="font-sans text-gold mb-8 tracking-[0.3em] uppercase"
          style={{ fontSize: '11px', fontWeight: 300 }}
        >
          Perfumería · Venezuela
        </p>

        {/* Línea decorativa */}
        <div
          className="mb-8"
          style={{ width: '48px', height: '1px', background: '#C9A84C', opacity: 0.5 }}
        />

        {/* Titular */}
        <h1
          className="font-display italic text-ivory leading-[1.05] mb-6"
          style={{
            fontSize: 'clamp(42px, 8vw, 72px)',
            letterSpacing: '-0.02em',
            maxWidth: '720px',
          }}
        >
          El Aroma de la<br />Autenticidad
        </h1>

        {/* Subtítulo */}
        <p
          className="font-sans text-ivory/50 uppercase tracking-[0.22em] mb-12"
          style={{ fontSize: '11px', fontWeight: 300, maxWidth: '380px', lineHeight: '1.9' }}
        >
          Fragancias 100&nbsp;% originales de las casas más<br className="hidden md:block" />
          exclusivas del mundo. Verificadas. Exclusivas.
        </p>

        {/* CTA */}
        <a
          href="/tienda"
          className="btn-shimmer inline-flex items-center gap-3 font-sans text-ivory/90 hover:text-ivory transition-colors duration-300"
          style={{
            fontSize: '11px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            border: '1px solid rgba(201,168,76,0.55)',
            padding: '14px 36px',
            fontWeight: 400,
          }}
        >
          Ver Colección
          <span className="text-gold" style={{ fontSize: '14px' }}>→</span>
        </a>
      </div>

      {/* Scroll indicator — línea vertical con pulse */}
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
            background: 'linear-gradient(to bottom, #C9A84C, transparent)',
          }}
        />
      </div>
    </section>
  )
}
