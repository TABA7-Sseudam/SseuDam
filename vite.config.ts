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
  // 정적 파일 처리를 위한 설정
  publicDir: 'public',
  server: {
    fs: {
      strict: false  // 파일 시스템 액세스를 완화하여 경로 문제 방지
    }
  }
})
