import create from "zustand";

// 사용자 인터페이스 정의
interface User {
  uid: string;
  email?: string;
  username?: string;
  lastLogin?: string;
  token?: string;
  role?: string;
}

// Zustand 상태 인터페이스 정의
interface AuthState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  syncUser: () => void; // ✅ 새로고침 시 localStorage에서 상태 복원
}

// Zustand 상태 관리
export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  // ✅ 로그인 시 사용자 정보 저장 및 localStorage 업데이트
  setUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    set({ user });
  },

  // ✅ 로그아웃 시 상태 초기화 및 localStorage 삭제
  clearUser: () => {
    localStorage.removeItem("user");
    set({ user: null });
  },

  // ✅ 새로고침 시 localStorage에서 사용자 정보 복원
  syncUser: () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      set({ user: JSON.parse(storedUser) });
    }
  },
}));

// ✅ 애플리케이션이 실행될 때 자동으로 상태 복원
useAuthStore.getState().syncUser();
