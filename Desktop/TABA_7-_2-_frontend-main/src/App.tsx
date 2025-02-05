import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "@/components/auth/HomePage";
import { AuthPage } from "@/components/auth/AuthPage";
import { WasteAnalysisPage } from "@/components/analysis/WasteAnalysisPage";
import { Rewards } from "@/components/reward/Rewards";
import { Guide } from "@/components/guide/Guide";
import { Settings } from "@/components/settings/Settings";
import { Header } from "@/components/shared/Header";

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

            {/* ✅ 리워드 페이지 */}
            <Route path="/rewards" element={<Rewards />} />

            {/* ✅ 가이드 페이지 */}
            <Route path="/guide" element={<Guide />} />

            {/* ✅ 설정 페이지 */}
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
