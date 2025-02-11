// src/App.tsx
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import HomePage from "@/components/auth/HomePage"
import { AuthPage } from "@/components/auth/AuthPage"
import { WasteAnalysisPage } from "@/components/analysis/WasteAnalysisPage"
import { Rewards } from "@/components/reward/Rewards"
import { SettingsPage } from "@/components/settings/SettingsPage"
import { Header } from "@/components/shared/Header"
import { Ranking } from "@/components/ranking/Ranking"
import { GuidePage } from "@/components/guide/GuidePage"
import { AccountSettingsPage } from "@/components/settings/AccountSettingsPage"
import { CompanyIntroPage } from "@/components/company/CompanyIntroPage"

// ✅ 관리자 페이지 컴포넌트 임포트 추가
import { Administrator } from './components/administrator/Administrator'
import { CollectionStatusPage } from './components/administrator/CollectionStatusPage'


import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

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

          {/* 로그인 후 접근 가능한 메인 페이지 */}
          <Route path="/home" element={<HomePage />} />
          <Route path="/waste-analysis" element={<WasteAnalysisPage />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/guide" element={<GuidePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/settings/account" element={<AccountSettingsPage />} />
          <Route path="/ranking" element={<Ranking />} />

          {/* ✅ 관리자 페이지 라우트 추가 */}
          <Route path="/admin" element={<Administrator />} />
          <Route path="/admin/status" element={<CollectionStatusPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
