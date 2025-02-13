import { useAuthStore } from "@/components/auth/authstore";

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = useAuthStore.getState().user?.token; // ✅ Zustand에서 토큰 가져오기

  if (!token) {
    throw new Error("인증 토큰이 없습니다. 로그인해주세요.");
  }

  const headers = {
    ...options.headers,
    "Authorization": `Bearer ${token}`,  // ✅ Firebase 인증 토큰 추가
    "Content-Type": "application/json",
  };

  return fetch(url, { ...options, headers });
}
