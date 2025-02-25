import * as path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    global: {}, // ✅ global 정의하여 브라우저 환경 대응
  },
  base: "./", // ✅ Vercel 배포 시 경로 문제 해결
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false, // 로컬 개발 환경에서는 false
        rewrite: (path) => path.replace(/^\/api/, '/api/v1'),
      },
    },
    hmr: {
      protocol: 'ws', // ✅ WebSocket 환경에서도 정상 동작하도록 설정
    },
  },
  build: {
    outDir: "dist", // ✅ Vercel이 올바르게 인식할 수 있도록 설정
    rollupOptions: {
      external: ['bootstrap-icons'],
    },
    chunkSizeWarningLimit: 1000, // ✅ 큰 번들 파일로 인한 경고 방지
  },
  optimizeDeps: {
    exclude: ["sockjs-client"], // ✅ WebSocket 관련 문제 방지
  },
});
