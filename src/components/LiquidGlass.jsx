// SVG filter que crea el efecto de distorsión del vidrio
export function GlassFilter() {
  return (
    <svg style={{ display: 'none' }}>
      <filter
        id="glass-distortion"
        x="0%" y="0%" width="100%" height="100%"
        filterUnits="objectBoundingBox"
      >
        <feTurbulence type="fractalNoise" baseFrequency="0.001 0.005" numOctaves="1" seed="17" result="turbulence" />
        <feComponentTransfer in="turbulence" result="mapped">
          <feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5" />
          <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
          <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
        </feComponentTransfer>
        <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />
        <feSpecularLighting in="softMap" surfaceScale="5" specularConstant="1" specularExponent="100" lightingColor="white" result="specLight">
          <fePointLight x="-200" y="-200" z="300" />
        </feSpecularLighting>
        <feComposite in="specLight" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="litImage" />
        <feDisplacementMap in="SourceGraphic" in2="softMap" scale="200" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  )
}

// Wrapper base del efecto vidrio
export function GlassEffect({ children, className = '', style = {}, href, onClick }) {
  const baseStyle = {
    position: 'relative',
    display: 'flex',
    fontWeight: 600,
    overflow: 'hidden',
    color: 'black',
    cursor: 'pointer',
    transition: 'all 700ms cubic-bezier(0.175, 0.885, 0.32, 2.2)',
    boxShadow: '0 6px 6px rgba(0,0,0,0.2), 0 0 20px rgba(0,0,0,0.1)',
    borderRadius: '24px',
    ...style,
  }

  const content = (
    <div style={baseStyle} className={className} onClick={onClick}>
      {/* Capa de distorsión */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden',
        borderRadius: 'inherit',
        backdropFilter: 'blur(3px)',
        filter: 'url(#glass-distortion)',
        isolation: 'isolate',
      }} />
      {/* Capa de tinte blanco */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 10,
        borderRadius: 'inherit',
        background: 'rgba(255,255,255,0.25)',
      }} />
      {/* Borde interno brillante */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 20,
        borderRadius: 'inherit', overflow: 'hidden',
        boxShadow: 'inset 2px 2px 1px 0 rgba(255,255,255,0.5), inset -1px -1px 1px 1px rgba(255,255,255,0.5)',
      }} />
      {/* Contenido */}
      <div style={{ position: 'relative', zIndex: 30 }}>{children}</div>
    </div>
  )

  return href
    ? <a href={href} target="_blank" rel="noopener noreferrer" style={{ display: 'block' }}>{content}</a>
    : content
}

// Botón de vidrio
export function GlassButton({ children, href, onClick }) {
  return (
    <GlassEffect href={href} onClick={onClick} style={{ padding: '24px 40px' }}>
      <div style={{ transition: 'all 700ms cubic-bezier(0.175, 0.885, 0.32, 2.2)' }}>
        {children}
      </div>
    </GlassEffect>
  )
}
