import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// SSR 문제 해결을 위한 패치
// useLayoutEffect 경고를 무시하고 대신 useEffect 사용
if (typeof window === 'undefined') {
  React.useLayoutEffect = React.useEffect;
} else {
  // 클라이언트 사이드에서 전역 window 객체 설정
  window.global = window;
}

// 기존 오류 억제 (vendor-Dl-tk0gZ.js 관련)
const originalError = console.error;
console.error = (...args) => {
  if (args[0] && typeof args[0] === 'string' && args[0].includes('useLayoutEffect')) {
    // useLayoutEffect 관련 경고 무시
    return;
  }
  originalError.apply(console, args);
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);