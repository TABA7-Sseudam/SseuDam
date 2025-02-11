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




import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

//npm install framer-motion
function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  )
}

function MainLayout() {
  const location = useLocation()

  // CompanyIntroPage (/) 에서 헤더 숨기기
  const hideHeader = location.pathname === "/"

  return (
    <div className="min-h-screen flex flex-col">
      {/* 조건부 렌더링: / 경로에서는 Header 숨기기 */}
      {!hideHeader && <Header />}

      <main className="flex-grow">
        <Routes>
          {/* ✅ 앱 실행 시 회사 소개 페이지(/)로 이동 */}
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
        </Routes>
      </main>
    </div>
  )
}

export default App