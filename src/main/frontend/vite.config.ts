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
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,  // 로컬 개발 환경에서는 false
        rewrite: (path) => path.replace(/^\/api/, '/api/v1'),
      },
    },
    hmr: {
      protocol: 'ws', // ✅ WebSocket 환경에서도 정상 동작하도록 설정
    },
  },
  build: {
    outDir: "dist", // ✅ Vercel이 올바르게 인식할 수 있도록 설정
    chunkSizeWarningLimit: 1000, // ✅ 큰 번들 파일로 인한 경고 방지 (1MB 제한)
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react'; // ✅ React 관련 번들을 따로 분리
            }
            if (id.includes('firebase')) {
              return 'vendor-firebase'; // ✅ Firebase 관련 모듈 분리
            }
            if (id.includes('recharts') || id.includes('framer-motion')) {
              return 'vendor-graph'; // ✅ 차트 및 애니메이션 관련 모듈 분리
            }
            return 'vendor'; // ✅ 기타 라이브러리 분리
          }
        },
      },
    },
  },
});
