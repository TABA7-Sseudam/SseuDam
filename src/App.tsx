import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import HomePage from "@/components/auth/HomePage";
import { AuthPage } from "@/components/auth/AuthPage";
import { WasteAnalysisPage } from "./components/analysis/WasteAnalysisPage";
import { Rewards } from "@/components/reward/Rewards";
import { SettingsPage } from "@/components/settings/SettingsPage";
import { Header } from "@/components/shared/Header";
import { Ranking } from "@/components/ranking/Ranking"
import { GuidePage } from "./components/guide/GuidePage";
import { AccountSettingsPage } from './components/settings/AccountSettingsPage';
import { CompanyIntroPage } from '@/components/company/CompanyIntroPage';
import RankTierGuide from "@/components/ranking/Rank_Tier_Guide"; // 랭킹 & 등급 가이드 페이지 추가
// ✅ 관리자 페이지 컴포넌트 임포트 추가
import { Administrator } from './components/administrator/Administrator'
import { CollectionStatusPage } from './components/administrator/CollectionStatusPage'
import { APITestPage } from "./components/administrator/APITestPage";

import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// 보호된 라우트 컴포넌트
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowGuest?: boolean;
  adminOnly?: boolean; // 관리자 전용 여부 추가
}

function ProtectedRoute({ children, allowGuest = false, adminOnly = false }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // 관리자 여부 상태 추가

  useEffect(() => {
    const user = localStorage.getItem("user");
    const admin = localStorage.getItem("isAdmin");

    if (user) {
      // user가 "admin" 문자열이면 관리자
      if (user === "admin") {
          setIsAdmin(true);
          setIsGuest(false);
          setIsAuthenticated(true);
        } else { //일반 유저
          try {
            const userData = JSON.parse(user);
            setIsGuest(userData.isGuest || false);
            setIsAuthenticated(true)

          }
          catch(error){ // JSON 파싱 오류
            console.error("localStorage user 파싱 오류:", error);
            setIsAuthenticated(false);
            setIsGuest(false);
            setIsAdmin(false);
          }
        }
    } else {
      setIsAuthenticated(false); // user 값이 없으면 로그인되지 않은 상태
      setIsAdmin(false);
      setIsGuest(false);
    }

     // isAdmin은 별도로 처리 (boolean)
     setIsAdmin(admin === "true");
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // 로딩 상태 표시
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />; // 비로그인 사용자는 로그인 페이지로
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/home" replace />; // 관리자 전용인데 관리자가 아니면 홈으로
  }


  if (isGuest && !allowGuest) {
    return <Navigate to="/guide" replace />; // 게스트인데 게스트 허용이 아니면 안내 페이지로
  }

  return <>{children}</>;
}

// App 컴포넌트
function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  )
}

// MainLayout 컴포넌트
function MainLayout() {
  const location = useLocation()

  // ✅ 헤더 숨기기 조건 수정: 회사 소개 페이지(/)와 관리자 페이지(/admin/*)에서 헤더 숨기기
  const hideHeader = location.pathname === "/" || location.pathname.startsWith("/admin")

  return (
    <div className="min-h-screen flex flex-col">

      {/* 조건부 렌더링: / 또는 /admin 경로에서는 Header 숨기기 */}
      {!hideHeader && <Header />}

      <main className="flex-grow">
        <Routes>
          {/* 회사 소개 페이지 (앱 실행 시 기본 페이지) */}
          <Route path="/" element={<CompanyIntroPage />} />

          {/* 로그인/회원가입 페이지 */}
          <Route path="/auth" element={<AuthPage />} />

           {/* 게스트도 접근 가능한 라우트 */}
          <Route 
            path="/guide" 
            element={
              <ProtectedRoute allowGuest>
                <GuidePage />
              </ProtectedRoute>
            } 
          />

          {/* 로그인 사용자만 접근 가능한 라우트 */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/waste-analysis"
            element={
              <ProtectedRoute>
                <WasteAnalysisPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rewards"
            element={
              <ProtectedRoute>
                <Rewards />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/account"
            element={
              <ProtectedRoute>
                <AccountSettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ranking"
            element={
              <ProtectedRoute>
                <Ranking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ranking/rank_tier_guide"
            element={
              <ProtectedRoute>
                <RankTierGuide />
              </ProtectedRoute>
            }
          />
          {/* ✅ 관리자 페이지 라우트 추가 */}
          <Route path="/admin" element={<ProtectedRoute adminOnly={true}><Administrator /></ProtectedRoute>} />
          <Route path="/admin/status" element={<ProtectedRoute adminOnly={true}><CollectionStatusPage /></ProtectedRoute>} />
          <Route path="/api-test" element={<APITestPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App;
