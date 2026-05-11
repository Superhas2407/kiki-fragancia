import { useScrollReveal } from '../hooks/useScrollReveal'

const POSTS = [
  { url: 'https://images.unsplash.com/photo-1557170334-a9632e77c6e4?w=400&q=80', alt: 'Lifestyle 1' },
  { url: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400&q=80', alt: 'Lifestyle 2' },
  { url: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&q=80', alt: 'Lifestyle 3' },
  { url: 'https://images.unsplash.com/photo-1590156562745-5d9f1f09a6e0?w=400&q=80', alt: 'Lifestyle 4' },
  { url: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400&q=80', alt: 'Lifestyle 5' },
  { url: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&q=80', alt: 'Lifestyle 6' },
  { url: 'https://images.unsplash.com/photo-1600369671236-e74521d4b6ad?w=400&q=80', alt: 'Lifestyle 7' },
  { url: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=400&q=80', alt: 'Lifestyle 8' },
  { url: 'https://images.unsplash.com/photo-1547887538-047f814d0a6f?w=400&q=80', alt: 'Lifestyle 9' },
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
          background: 'rgba(10,10,10,0)',
          transition: 'background 0.3s ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(10,10,10,0.52)'
          e.currentTarget.previousSibling.style.transform = 'scale(1.04)'
          e.currentTarget.querySelector('svg').style.opacity = '1'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(10,10,10,0)'
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
            {/* Avatar placeholder */}
            <div
              style={{
                width: '44px',
                height: '44px',
                background: 'linear-gradient(135deg, #C9A84C 0%, #1C1A16 100%)',
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
                Perfumería · Venezuela
              </p>
            </div>

            {/* Badge seguidores */}
            <span
              className="font-sans"
              style={{
                fontSize: '10px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#C9A84C',
                border: '1px solid rgba(201,168,76,0.4)',
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
            className="font-sans text-carbon/50 hover:text-gold transition-colors duration-200 self-start sm:self-auto"
            style={{ fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase' }}
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
