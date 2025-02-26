import * as path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // 라이브러리 충돌 방지를 위한 별칭 설정
      'styled-components': path.resolve(__dirname, 'node_modules', 'styled-components'),
      'react': path.resolve(__dirname, 'node_modules', 'react'),
      'react-dom': path.resolve(__dirname, 'node_modules', 'react-dom')
      // firebase 관련 alias 제거 → Vite가 기본 방식으로 모듈을 찾도록 함
    },
  },
  define: {
    // 브라우저 환경에서 global을 window로 설정
    global: 'window',
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
  },
  base: "./", // Vercel 등에서 정적 파일 경로가 올바르게 설정되도록 함
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
      protocol: 'ws', // WebSocket 환경에서도 정상 동작하도록 설정
    },
  },
  build: {
    outDir: "dist", // Vercel 등에서 올바른 출력 폴더 인식
    chunkSizeWarningLimit: 1000, // 큰 번들 파일 경고 제한 (1MB)
    rollupOptions: {
      output: {
        // 파일 이름 형식 지정으로 MIME 타입 오류 방지
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        // 청크 분리 (코드 스플리팅)
        manualChunks: {
          'vendor-react-core': ['react', 'react-dom'],
          'vendor-react-router': ['react-router-dom'],
          'vendor-ui': ['styled-components', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          'vendor-viz': ['recharts', 'framer-motion'],
          'vendor-firebase': ['firebase'], // Firebase는 별도로 묶음
          'vendor-ui-extra': [
            '@radix-ui/react-navigation-menu',
            '@radix-ui/react-slot',
            '@radix-ui/react-icons',
            '@radix-ui/react-avatar',
            '@radix-ui/react-alert-dialog'
          ],
          'vendor-utils': ['axios', 'recoil', 'zustand', 'zod'],
          'vendor-calendar': ['react-calendar']
        }
      },
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  // Firebase 모듈을 pre-bundle하도록 설정하여 빌드 오류 해결
  optimizeDeps: {
    include: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  }
});
