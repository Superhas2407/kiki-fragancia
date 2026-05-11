import { useScrollReveal } from '../hooks/useScrollReveal'

const POSTS = [
  { url: '/products/IMG_8597.jpg', alt: 'KiKi Fragancia' },
  { url: '/products/IMG_8642.jpg', alt: 'KiKi Fragancia' },
  { url: '/products/IMG_8643.jpg', alt: 'Khamrah · KiKi Fragancia' },
  { url: '/products/IMG_8680.jpg', alt: 'KiKi Fragancia' },
  { url: '/products/IMG_8863.jpg', alt: 'Dior · KiKi Fragancia' },
  { url: '/products/IMG_8879.jpg', alt: 'Gucci · KiKi Fragancia' },
  { url: '/products/IMG_8895.jpg', alt: 'Calvin Klein · KiKi Fragancia' },
  { url: '/products/IMG_8943.jpg', alt: 'KiKi Fragancia' },
  { url: '/products/IMG_8954.jpg', alt: 'KiKi Fragancia' },
]

const InstagramIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="white" stroke="none" />
  </svg>
)

function PostCell({ post, delay }) {
  const ref = useScrollReveal({ threshold: 0.1, delay })

  return (
    <a
      ref={ref}
      href="https://instagram.com/kiki_fragancia"
      target="_blank"
      rel="noopener noreferrer"
      className="relative block overflow-hidden"
      style={{ aspectRatio: '1/1' }}
    >
      <img
        src={post.url}
        alt={post.alt}
        className="w-full h-full object-cover"
        style={{ transition: 'transform 0.5s ease' }}
      />

      {/* Overlay en hover */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          background: 'rgba(26,18,8,0)',
          transition: 'background 0.3s ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(26,18,8,0.55)'
          e.currentTarget.previousSibling.style.transform = 'scale(1.04)'
          e.currentTarget.querySelector('svg').style.opacity = '1'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(26,18,8,0)'
          e.currentTarget.previousSibling.style.transform = 'scale(1)'
          e.currentTarget.querySelector('svg').style.opacity = '0'
        }}
      >
        <span style={{ opacity: 0, transition: 'opacity 0.3s ease' }}>
          <InstagramIcon />
        </span>
      </div>
    </a>
  )
}

export default function InstagramFeed() {
  const headRef = useScrollReveal({ threshold: 0.2 })

  return (
    <section style={{ background: 'var(--ivory)', padding: '96px 0' }}>
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div ref={headRef} className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div
              style={{
                width: '44px',
                height: '44px',
                background: 'linear-gradient(135deg, #C4781A 0%, #251A0E 100%)',
                flexShrink: 0,
              }}
            />
            <div>
              <p
                className="font-sans text-carbon"
                style={{ fontSize: '14px', fontWeight: 400, letterSpacing: '0.01em' }}
              >
                @kiki_fragancia
              </p>
              <p
                className="font-sans text-carbon/40"
                style={{ fontSize: '12px', fontWeight: 300 }}
              >
                Fragancias verificadas · Venezuela
              </p>
            </div>

            {/* Badge seguidores */}
            <span
              className="font-sans"
              style={{
                fontSize: '10px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#C4781A',
                border: '1px solid rgba(196,120,26,0.4)',
                padding: '4px 10px',
              }}
            >
              33k+
            </span>
          </div>

          <a
            href="https://instagram.com/kiki_fragancia"
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-carbon/50 self-start sm:self-auto"
            style={{ fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', textDecoration: 'none', transition: 'color 0.2s ease' }}
            onMouseEnter={e => e.currentTarget.style.color = '#C4781A'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(26,18,8,0.5)'}
          >
            Ver perfil →
          </a>
        </div>

        {/* Grid 3×3 */}
        <div className="grid grid-cols-3 gap-1 md:gap-2">
          {POSTS.map((post, i) => (
            <PostCell key={post.url} post={post} delay={i * 60} />
          ))}
        </div>

      </div>
    </section>
  )
}
