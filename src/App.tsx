import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import HomePage from "@/components/auth/HomePage"
import { AuthPage } from "@/components/auth/AuthPage"
import  WasteAnalysisPage  from "@/components/analysis/WasteAnalysisPage" // ✅ {} 삭제제하여 오류 해결
import  Rewards  from "@/components/reward/Rewards"  // ✅ {} 삭제제하여 오류 해결
import { SettingsPage } from "@/components/settings/SettingsPage"
import { Header } from "@/components/shared/Header"
import { Ranking } from "@/components/ranking/Ranking"
import { GuidePage } from "@/components/guide/GuidePage"
import { AccountSettingsPage } from "@/components/settings/AccountSettingsPage"
import { CompanyIntroPage } from "@/components/company/CompanyIntroPage"

// ✅ 관리자 페이지 컴포넌트
import { Administrator } from "@/components/administrator/Administrator"
import { CollectionStatusPage } from "@/components/administrator/CollectionStatusPage"

// ✅ 외부 라이브러리 스타일 추가
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"

function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  )
}

// ✅ MainLayout 컴포넌트 (헤더 및 라우트 관리)
function MainLayout() {
  const location = useLocation()
  const hideHeader = location.pathname === "/" || location.pathname.startsWith("/admin")

  return (
    <div className="min-h-screen flex flex-col">
      {/* / 및 /admin/* 경로에서는 Header 숨김 */}
      {!hideHeader && <Header />}

      <main className="flex-grow">
        <Routes>
          {/* 기본 페이지 */}
          <Route path="/" element={<CompanyIntroPage />} />

          {/* 로그인/회원가입 */}
          <Route path="/auth" element={<AuthPage />} />

          {/* 메인 기능 페이지 */}
          <Route path="/home" element={<HomePage />} />
          <Route path="/waste-analysis" element={<WasteAnalysisPage />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/guide" element={<GuidePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/settings/account" element={<AccountSettingsPage />} />
          <Route path="/ranking" element={<Ranking />} />

          {/* 관리자 페이지 */}
          <Route path="/admin" element={<Administrator />} />
          <Route path="/admin/status" element={<CollectionStatusPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
