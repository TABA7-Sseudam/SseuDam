import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import HomePage from "@/components/auth/HomePage"
import { AuthPage } from "@/components/auth/AuthPage"
import { WasteAnalysisPage } from "@/components/analysis/WasteAnalysisPage"
import { SettingsPage } from "@/components/settings/SettingsPage"
import { Header } from "@/components/shared/Header"
import { Ranking } from "@/components/ranking/Ranking"
import { GuidePage } from "./components/guide/GuidePage"
import { AccountSettingsPage } from './components/settings/AccountSettingsPage'
import RankTierGuide from "@/components/ranking/Rank_Tier_Guide"


import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {/* ✅ 모든 페이지에서 상단 메뉴바(Header)를 유지 */}
        <Header />

        {/* ✅ 페이지 라우팅 */}
        <main className="flex-grow">
          <Routes>
            {/* ✅ 앱 실행 시 로그인 페이지(`/auth`)로 이동 */}
            <Route path="/" element={<Navigate to="/auth" replace />} />

            {/* ✅ 로그인/회원가입 페이지 */}
            <Route path="/auth" element={<AuthPage />} />

            {/* ✅ 로그인 후 접근 가능한 메인 페이지 */}
            <Route path="/home" element={<HomePage />} />

            {/* ✅ 분리배출 분석 페이지 */}
            <Route path="/waste-analysis" element={<WasteAnalysisPage />} />

            {/* ✅ 가이드 페이지 */}
            <Route path="/guide" element={<GuidePage />} />

            {/* ✅ 설정 페이지 */}
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/settings/account" element={<AccountSettingsPage />} />

            {/* ✅ 랭킹 및 등급 페이지 라우트 추가 */}
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/ranking/rank_tier_guide" element={<RankTierGuide />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
