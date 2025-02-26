import { useLayoutEffect, useEffect } from 'react';

/**
 * 서버 사이드 렌더링(SSR)과 클라이언트 사이드 렌더링 모두에서 작동하는
 * 레이아웃 이펙트 훅입니다.
 * 
 * - 브라우저 환경: useLayoutEffect 사용
 * - 서버 환경: useEffect 사용
 */
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default useIsomorphicLayoutEffect;