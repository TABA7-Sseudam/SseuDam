import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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

import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// 보호된 라우트 컴포넌트
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowGuest?: boolean;
}

function ProtectedRoute({ children, allowGuest = false }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      setIsGuest(userData.isGuest || false);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (isGuest && !allowGuest) {
    return <Navigate to="/guide" replace />;
  }

  return <>{children}</>;
}

function App() {
  const [showHeader, setShowHeader] = useState(true);

  // 현재 경로가 /auth 또는 /인지 확인하여 헤더 표시 여부 결정
  useEffect(() => {
    const handleRouteChange = () => {
      const currentPath = window.location.pathname;
      setShowHeader(currentPath !== '/auth' && currentPath !== '/');
    };

    handleRouteChange(); // 초기 실행
    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {showHeader && <Header />}
        <main className="flex-grow">
          <Routes>
            {/* 회사 소개 페이지 */}
            <Route path="/" element={<CompanyIntroPage />} />
            
            {/* 공개 라우트 */}
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
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;