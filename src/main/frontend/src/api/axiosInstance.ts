import axios from "axios";

// 환경에 따른 baseURL 설정
const getBaseUrl = () => {
  // 개발 환경에서는 상대 경로 사용 (Vite 프록시 활용)
  if (import.meta.env.DEV) {
    return "/api";
  }
  
  // 프로덕션 환경 (Vercel 배포 시)
  // 1. 백엔드가 있는 도메인 사용
  // return "https://api.yourservice.com/api"; // 실제 배포된 백엔드 도메인으로 변경 필요
  
  // 또는 기존 IP 주소를 유지하려면:
  return "https://54.180.242.43:8080/api";
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
  // 필요시 타임아웃 설정
  timeout: 10000,
});

// 요청 인터셉터 (선택사항)
api.interceptors.request.use(
  (config) => {
    // 토큰이 있으면 헤더에 추가
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (선택사항)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 401 에러 처리 (인증 만료)
    if (error.response && error.response.status === 401) {
      // 로그아웃 또는 토큰 갱신 로직
      localStorage.removeItem("token");
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;