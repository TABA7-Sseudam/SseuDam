// src/services/api/index.ts
import axios from 'axios';

// 전체 URL 사용
const API_BASE_URL = 'https://api-epps3nylka-du.a.run.app';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// 테스트용 사용자 생성 함수
const createTestUser = async () => {
  try {
    console.log('전체 요청 URL:', `${API_BASE_URL}/users`);
    const response = await api.post('/users', {
      username: `testuser_${Date.now()}`,
      email: `test_${Date.now()}@example.com`,
      apartment: "테스트 아파트",
      location: "서울시",
      nickname: "테스터"
    });
    console.log('사용자 생성 성공:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('사용자 생성 실패 - 전체 오류:', error);
    console.error('오류 응답:', error.response?.data);
    throw error;
  }
};

export const testAPI = async () => {
  try {
    console.log('API 테스트 시작...');
    console.log('API Base URL:', API_BASE_URL);
    
    // 1. 사용자 생성 테스트
    const userResponse = await createTestUser();
    console.log('생성된 사용자:', userResponse);
    
    // 2. 랭킹 조회 테스트
    const rankingsResponse = await api.get('/rank-accounts');
    console.log('랭킹 조회 결과:', rankingsResponse.data);

    console.log('API 테스트 완료!');
    return {
      userCreation: userResponse,
      rankings: rankingsResponse.data
    };
  } catch (error: any) {
    console.error('API 테스트 실패:', 
      error.response?.data || error.message || error
    );
    throw error;
  }
};

export default api;