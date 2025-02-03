import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Header } from "./components/shared/Header";
import { UserProfile } from "./components/profile/UserProfile";
import { RecyclingStats } from "@/components/dashboard/RecyclingStats";
import { motion } from "framer-motion";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import { LoginPage } from "@/components/auth/LoginPage";
import { RegisterPage } from "@/components/auth/RegisterPage";
import { GuestLogin } from "@/components/auth/GuestLogin";
import { WasteAnalysisPage } from "@/components/analysis/WasteAnalysisPage";

const ADMIN_EMAIL = "admin@recycling-ai.com";
const ADMIN_PASSWORD = "SecurePass123";

function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    // 로그인 상태 확인 (localStorage 또는 백엔드 인증 연동 가능)
    const user = localStorage.getItem("user");
    if (user === "guest") {
      setIsGuest(true);
    } else if (user === "admin") {
      setIsLoggedIn(true);
      setIsAdmin(true);
    } else if (user) {
      setIsLoggedIn(true);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* 사용자 프로필 */}
          <section className="mb-12">
            <UserProfile />
          </section>

          {/* 최근 분리배출 기록 (관리자만 확인 가능) */}
          {(isLoggedIn && isAdmin) && (
            <section className="mb-12">
              <RecyclingStats />
            </section>
          )}

          {/* 환경 보호 등급 (관리자만 확인 가능) */}
          {(isLoggedIn && isAdmin) && (
            <motion.section 
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="mb-6 text-2xl font-bold">환경 보호등급 정보</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-lg border bg-white p-6 hover:shadow-lg transition-shadow">
                  <h3 className="text-gray-500">현재 등급</h3>
                  <p className="text-4xl font-bold">💀 환경테러범</p>
                </div>
                <div className="rounded-lg border bg-white p-6 hover:shadow-lg transition-shadow">
                  <h3 className="text-gray-500">승급까지 필요한 포인트</h3>
                  <p className="text-4xl font-bold">500 point</p>
                </div>
              </div>
            </motion.section>
          )}

          {/* 분리배출 시작 버튼 */}
          <motion.section className="mb-12 text-center">
            <h2 className="text-2xl font-bold mb-4">재활용품 분석</h2>
            <Button className="bg-black text-white" onClick={() => navigate("/start-analysis")}>
              분석 시작
            </Button>
          </motion.section>

          {/* 로그인/회원가입 섹션 */}
          {!isLoggedIn && (
            <motion.section
              className="mb-12 flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6 w-full max-w-2xl">
                <h2 className="text-2xl font-bold mb-4 text-center">로그인/회원가입</h2>
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                  <Button variant="outline" className="w-full sm:w-40" onClick={() => { localStorage.setItem("user", "user"); navigate('/'); window.location.reload(); }}>로그인</Button>
                  <Button variant="outline" className="w-full sm:w-40" onClick={() => navigate('/register')}>회원가입</Button>
                  <Button className="w-full bg-gray-500 text-white" onClick={() => {
                    localStorage.setItem("user", "guest");
                    navigate('/');
                    window.location.reload();
                  }}>
                    게스트 로그인
                  </Button>
                </div>
              </Card>
            </motion.section>
          )}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 mt-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          Copyright © 2025 분리배출 AI 시스템. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/guest" element={<GuestLogin />} />
        <Route path="/start-analysis" element={<WasteAnalysisPage />} />
      </Routes>
    </Router>
  );
}

export default App;
