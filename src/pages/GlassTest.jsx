import { GlassFilter, GlassEffect, GlassButton } from '../components/LiquidGlass'

export default function GlassTest() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '32px',
      position: 'relative',
      overflow: 'hidden',
      background: 'url("https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&auto=format&fit=crop") center center / cover no-repeat',
    }}>
      <GlassFilter />

      {/* Título */}
      <GlassEffect style={{ padding: '20px 48px' }}>
        <p style={{ fontSize: '28px', fontWeight: 300, color: 'rgba(0,0,0,0.8)', whiteSpace: 'nowrap' }}>
          Kiki Fragancia — Liquid Glass test
        </p>
      </GlassEffect>

      {/* Botones */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <GlassButton>
          <span style={{ fontSize: '16px', color: 'rgba(0,0,0,0.75)' }}>Ver colección →</span>
        </GlassButton>
        <GlassButton>
          <span style={{ fontSize: '16px', color: 'rgba(0,0,0,0.75)' }}>Contacto</span>
        </GlassButton>
      </div>

      {/* Card de ejemplo */}
      <GlassEffect style={{ padding: '32px', maxWidth: '320px', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <p style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.5)' }}>
            Fragrance of the day
          </p>
          <p style={{ fontSize: '22px', fontWeight: 300, color: 'rgba(0,0,0,0.8)' }}>
            Armaf Odyssey Homme
          </p>
          <p style={{ fontSize: '14px', color: 'rgba(0,0,0,0.6)', fontWeight: 400 }}>
            Floral Amaderado · EDP 100ml
          </p>
          <p style={{ fontSize: '20px', fontWeight: 600, color: 'rgba(0,0,0,0.75)', marginTop: '8px' }}>
            $35
          </p>
        </div>
      </GlassEffect>
    </div>
  )
}
