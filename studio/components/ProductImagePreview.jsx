import { useState } from 'react'
import { legacyImageUrl } from '../lib/productImage'

export function ProductImagePreview({ src, alt = '' }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return <span role="img" aria-label="Foto no disponible">◇</span>
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
    />
  )
}

export function LegacyImageInput(props) {
  const src = legacyImageUrl(props.value)
  return (
    <div>
      {props.renderDefault(props)}
      {src && (
        <div style={{ width: 160, height: 180, marginTop: 12 }}>
          <ProductImagePreview key={src} src={src} alt="Foto guardada en la web" />
        </div>
      )}
    </div>
  )
}
