import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

const PROJECT_ID = import.meta.env.VITE_SANITY_PROJECT_ID ?? '7j25mwk7'
const DATASET    = import.meta.env.VITE_SANITY_DATASET    ?? 'production'

export const sanityClient = createClient({
  projectId: PROJECT_ID,
  dataset:   DATASET,
  apiVersion: '2024-01-01',
  useCdn: true,
})

export const sanityWriteClient = createClient({
  projectId: PROJECT_ID,
  dataset:   DATASET,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: import.meta.env.VITE_SANITY_WRITE_TOKEN,
})

const builder = imageUrlBuilder(sanityClient)

export function sanityImageUrl(source) {
  return builder.image(source)
}
