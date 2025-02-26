import * as path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // 전역 변수 설정: 브라우저 환경에서 global을 빈 객체로 정의
  define: {
    global: {},
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api/v1')  // API 버전 추가
      }
    }
  },
  build: {
    rollupOptions: {
      external: ['bootstrap-icons'],
    },
  },
})
