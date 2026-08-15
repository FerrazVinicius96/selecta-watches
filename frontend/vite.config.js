import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Proxy de /api para a API Express em dev: o navegador enxerga tudo na mesma
// origem (localhost:5173), o que elimina qualquer problema de CORS e deixa o
// código do frontend usando caminhos relativos ("/api/watches"), iguais aos de
// produção atrás de um reverse proxy.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_API_PROXY_TARGET || 'http://localhost:3001',
        changeOrigin: true,
      },
      '/images': {
        target: process.env.VITE_API_PROXY_TARGET || 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
