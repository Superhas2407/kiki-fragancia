import manifest from '../data/responsive-images.json'

export function responsiveImage(src, width = 640) {
  const variants = manifest[src]
  return variants?.find(v => v.width >= width)?.src ?? variants?.at(-1)?.src ?? src
}
export function responsiveSrcSet(src) {
  return manifest[src]?.map(v => `${v.src} ${v.width}w`).join(', ')
}
