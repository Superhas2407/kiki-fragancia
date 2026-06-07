import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import product from './schemas/product'

export default defineConfig({
  name: 'kiki-fragancia',
  title: 'Kiki Fragancia',
  projectId: '7j25mwk7',
  dataset: 'production',
  plugins: [
    structureTool(),
    visionTool(),
  ],
  schema: {
    types: [product],
  },
})
