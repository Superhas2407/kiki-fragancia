import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Let Vite keep shared React code separate from lazily imported libraries.
  // Manual motion chunks also pulled React into motion, forcing it on home.
})
