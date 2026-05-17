const BRANDS = [
  'Lattafa','Armaf','Dior','Chanel','YSL','Carolina Herrera',
  'Versace','Paco Rabanne','Givenchy','Gucci','Montale','Narciso Rodriguez',
  'Bvlgari','Viktor & Rolf','Jo Malone','Creed','Maison Margiela','Xerjoff',
]

export default function BrandsMarquee() {
  const doubled = [...BRANDS, ...BRANDS]
  return (
    <section className="marquee-section" aria-hidden="true">
      <div className="marquee-track">
        <div className="marquee-inner">
          {doubled.map((brand, i) => (
            <span key={i} className="marquee-item">
              <span className="marquee-brand">{brand}</span>
              <span className="marquee-dot">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
