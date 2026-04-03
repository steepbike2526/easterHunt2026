import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const configuredBasePath = process.env.VITE_BASE_PATH

const base = configuredBasePath
  ? configuredBasePath.endsWith('/')
    ? configuredBasePath
    : `${configuredBasePath}/`
  : './'

export default defineConfig({
  base,
  plugins: [react()],
  build: {
    sourcemap: true
  }
})
