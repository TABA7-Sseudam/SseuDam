// src/services/api/auth.ts

import axios from "axios";
import { LoginRequest, LoginResponse, User } from "@/types/auth";
import { auth } from "@/lib/firebase/firebase";  // firebase 인증 인스턴스

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://192.168.90.17:8080";

const getFirebaseToken = async (): Promise<string> => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("🚫 Firebase 사용자 인증이 필요합니다.");

  const idToken = await currentUser.getIdToken(true);
  return `Bearer ${idToken}`;
};

/** 로그인 */
export const login = async (loginData: LoginRequest): Promise<User> => {
  try {
    console.log("🚀 로그인 요청:", loginData);

    const firebaseToken = await getFirebaseToken();
    console.log("🔑 Firebase 토큰:", firebaseToken);

    const response = await axios.post<LoginResponse>(
      `${API_BASE_URL}/api/users/login`,
      loginData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: firebaseToken,
        },
        withCredentials: true,
      }
    );

    console.log("✅ 서버 응답:", response.data);

    // 서버 응답 → userData로 매핑 (통계 필드 누락 없이!)
    const userData: User = {
      uid: response.data.uid,
      email: response.data.email,
      nickname: response.data.nickname,
      created_at: response.data.created_at,
      last_login: response.data.last_login,
      isGuest: response.data.isGuest || false,
      role: response.data.role,
      grade: response.data.grade || "등급 없음",

      points_needed_for_promotion: response.data.pointsNeededForPromotion ||
        response.data.points_needed_for_promotion ||
        0,
      accumulatedPoints: response.data.accumulatedPoints || 0,
      monthlyPoints: response.data.monthlyPoints || 0,
      redirect_url: response.data.redirect_url || "/home",
      pointsNeededForPromotion: response.data.pointsNeededForPromotion ||
        response.data.points_needed_for_promotion ||
        0,

      // 통계 필드
      apartmentMonthlyAvgSuccess: response.data.apartmentMonthlyAvgSuccess || {},
      userMonthlyAvgSuccess: response.data.userMonthlyAvgSuccess || {},
      monthlyMaterialSuccessRates: response.data.monthlyMaterialSuccessRates || {},
      recentAnalysis: response.data.recentAnalysis || [],
      token: ""
    };

    console.log("🟢 최종 userData:", userData);

    // JWT 토큰
    const newToken = response.headers["authorization"];
    if (newToken) {
      localStorage.setItem("token", newToken.replace("Bearer ", ""));
    }
    // 로컬 스토리지에 최종 userData 저장
    localStorage.setItem("user", JSON.stringify(userData));

    return userData;
  } catch (error: any) {
    console.error("❌ 로그인 요청 에러:", error);
    if (error.response?.status === 401) throw new Error("🚫 인증이 필요합니다.");
    if (error.response?.status === 400) {
      throw new Error("❌ 이메일 또는 비밀번호가 올바르지 않습니다.");
    }
    throw new Error("⚠️ 로그인에 실패했습니다.");
  }
};

/** "내 정보" 가져오기 (새로고침 시) */
export const fetchUserData = async (): Promise<User> => {
  try {
    const firebaseToken = await getFirebaseToken();
    console.log("🔍 사용자 데이터 요청 중...");

    const response = await axios.get<LoginResponse>(
      `${API_BASE_URL}/api/users/me`,
      {
        headers: {
          Authorization: firebaseToken,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ 사용자 데이터 요청 성공:", response.data);

    // 응답 → userData (통계 포함)
    const userData: User = {
      uid: response.data.uid,
      email: response.data.email,
      nickname: response.data.nickname,
      created_at: response.data.created_at,
      last_login: response.data.last_login,
      isGuest: response.data.isGuest || false,
      role: response.data.role,
      grade: response.data.grade || "등급 없음",

      points_needed_for_promotion: response.data.pointsNeededForPromotion ||
        response.data.points_needed_for_promotion ||
        0,
      accumulatedPoints: response.data.accumulatedPoints || 0,
      monthlyPoints: response.data.monthlyPoints || 0,
      redirect_url: response.data.redirect_url || "/home",
      pointsNeededForPromotion: response.data.pointsNeededForPromotion ||
        response.data.points_needed_for_promotion ||
        0,

      // 통계 필드
      apartmentMonthlyAvgSuccess: response.data.apartmentMonthlyAvgSuccess || {},
      userMonthlyAvgSuccess: response.data.userMonthlyAvgSuccess || {},
      monthlyMaterialSuccessRates: response.data.monthlyMaterialSuccessRates || {},
      recentAnalysis: response.data.recentAnalysis || [],
      token: ""
    };

    console.log("🟢 최종 userData:", userData);

    // 로컬 스토리지 갱신
    localStorage.setItem("user", JSON.stringify(userData));

    return userData;
  } catch (error) {
    console.error("❌ 사용자 데이터 가져오기 실패:", error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await auth.signOut();
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    console.log("✅ 로그아웃 성공");
  } catch (error) {
    console.error("❌ 로그아웃 실패:", error);
    throw error;
  }
};
