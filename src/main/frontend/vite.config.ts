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
    },
  },
  define: {
    // global을 window로 설정하여 SSR 환경 호환성 향상
    global: 'window',
    // SSR 관련 변수 추가
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
  },
  base: "./",  // Vercel에서 정적 파일 경로가 올바르게 설정되도록 함
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
      protocol: 'ws', // WebSocket 환경에서도 정상 동작하도록 설정
    },
  },
  build: {
    outDir: "dist", // Vercel이 인식할 수 있는 출력 폴더
    chunkSizeWarningLimit: 1000, // 큰 번들 파일 경고 제한 (1MB)
    rollupOptions: {
      output: {
        // 파일 이름 형식을 명시적으로 지정하여 MIME 타입 오류 방지
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        // 문제가 발생하는 vendor 번들 수정 - 명시적 청크 분리
        manualChunks: {
          // React 코어 라이브러리
          'vendor-react-core': ['react', 'react-dom'],
          // React 라우터 및 관련 라이브러리
          'vendor-react-router': ['react-router-dom'],
          // UI 컴포넌트 라이브러리
          'vendor-ui': ['styled-components', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          // 차트 및 애니메이션 라이브러리
          'vendor-viz': ['recharts', 'framer-motion'],
          // Firebase
          'vendor-firebase': ['firebase'],
          // 기타 UI 라이브러리
          'vendor-ui-extra': [
            '@radix-ui/react-navigation-menu',
            '@radix-ui/react-slot',
            '@radix-ui/react-icons',
            '@radix-ui/react-avatar',
            '@radix-ui/react-alert-dialog'
          ],
          // 기타 유틸리티 라이브러리
          'vendor-utils': ['axios', 'recoil', 'zustand', 'zod'],
          // 캘린더 관련 라이브러리
          'vendor-calendar': ['react-calendar']
        }
      },
    },
    // SSR 및 ESM/CJS 변환 호환성 향상
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  // SSR 호환성 향상을 위한 설정
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  }
});
