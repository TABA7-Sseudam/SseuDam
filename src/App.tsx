import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { Header } from "./components/shared/Header";
import { UserProfile } from "./components/profile/UserProfile";
import { RecyclingStats } from "@/components/dashboard/RecyclingStats";
import { motion } from "framer-motion";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import { LoginPage } from "@/components/auth/LoginPage";
import { RegisterPage } from "@/components/auth/RegisterPage";

function HomePage() {
  const navigate = useNavigate();

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

          {/* 최근 분리배출 기록 */}
          <section className="mb-12">
            <RecyclingStats />
          </section>

          {/* 환경 보호 등급 */}
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

          {/* 회원가입/로그인 섹션 */}
          <motion.section
            className="mb-12 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 w-full max-w-2xl">
              <h2 className="text-2xl font-bold mb-4 text-center">회원가입/로그인</h2>

              <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                {/* 로그인 & 회원가입 버튼 */}
                <div className="flex flex-col sm:flex-row items-center gap-4 flex-1">
                  <Button variant="outline" className="w-full sm:w-40" onClick={() => navigate('/login')}>로그인</Button>
                  <Button variant="outline" className="w-full sm:w-40" onClick={() => navigate('/register')}>회원가입</Button>
                </div>
                {/* 게스트로 시작하기 버튼 */}
                <Button className="w-full bg-black text-white hover:bg-black/90">
                  게스트로 시작하기
                </Button>
              </div>
            </Card>
          </motion.section>
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
      </Routes>
    </Router>
  );
}

export default App;
