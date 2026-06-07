import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID ?? '7j25mwk7',
  dataset: import.meta.env.VITE_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

const builder = imageUrlBuilder(sanityClient)

export function sanityImageUrl(source) {
  return builder.image(source)
}
