import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./components/auth/HomePage";
import { AuthPage } from "./components/auth/AuthPage";
import { WasteAnalysisPage } from "./components/analysis/WasteAnalysisPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* ✅ 앱 실행 시 로그인 페이지(`/auth`)로 이동 */}
        <Route path="/" element={<Navigate to="/auth" replace />} />

        {/* ✅ 로그인/회원가입 페이지 */}
        <Route path="/auth" element={<AuthPage />} />

        {/* ✅ 로그인 후 접근 가능한 메인 페이지 */}
        <Route path="/home" element={<HomePage />} />

        {/* ✅ 분리배출 분석 페이지 */}
        <Route path="/waste-analysis" element={<WasteAnalysisPage />} />
      </Routes>
    </Router>
  );
}

export default App;
