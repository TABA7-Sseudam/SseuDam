// src/types/auth.ts

export interface LoginRequest {
  email: string;
  password: string;
}

// 서버에서 내려주는 응답 형태(백엔드와 맞춰야 함)
interface MonthlyData {
  material: string;
  avg_success: number;
}
interface AnalysisData {
  analysis_date: string;
  material: string;
  success_percent: number;
}

// LoginResponse(백엔드 응답)
export interface LoginResponse {
  uid: string;
  email: string;
  nickname: string;
  created_at: string;
  last_login: string;
  isGuest: boolean;
  role: string;
  grade?: string;
  token?: string;
  redirect_url?: string;
  accumulatedPoints?: number;
  monthlyPoints?: number;
  pointsNeededForPromotion?: number;
  points_needed_for_promotion?: number;

  // 통계 관련 필드
  apartmentMonthlyAvgSuccess?: Record<string, number>;
  userMonthlyAvgSuccess?: Record<string, number>;
  monthlyMaterialSuccessRates?: Record<string, MonthlyData[]>;
  recentAnalysis?: AnalysisData[];
}

// 프론트엔드에서 사용할 User 타입
export interface User {
  uid: string;
  email: string;
  nickname: string;
  created_at: string;
  last_login: string;
  isGuest: boolean;
  role: string;
  grade?: string;
  redirect_url?: string;

  token: string; // token 속성 추가

  points_needed_for_promotion: number;
  pointsNeededForPromotion: number;
  accumulatedPoints: number;
  monthlyPoints: number;

  // 통계
  apartmentMonthlyAvgSuccess: Record<string, number>;
  userMonthlyAvgSuccess: Record<string, number>;
  monthlyMaterialSuccessRates: Record<string, MonthlyData[]>;
  recentAnalysis: AnalysisData[];
}
