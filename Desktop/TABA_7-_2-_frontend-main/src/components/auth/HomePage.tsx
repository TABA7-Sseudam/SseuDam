import { useNavigate } from "react-router-dom"; // ❌ useLocation() 제거
import { useEffect, useState } from "react";
import { Header } from "../shared/Header";
import { UserProfile } from "../profile/UserProfile";
import { RecyclingStats } from "../dashboard/RecyclingStats";
import { motion } from "framer-motion";

function HomePage() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (!user) {
      navigate("/auth"); // ✅ 로그인하지 않은 경우 로그인 페이지로 이동
    } else if (user === "guest") {
      setIsGuest(true);
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
      setIsGuest(false);
    }
  }, [navigate]); // ✅ location 제거

  if (isLoggedIn === null) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          
          {isGuest && (
            <div className="text-center text-gray-600 bg-gray-100 p-4 rounded-md mb-6">
              <p>🔹 현재 <b>게스트 계정</b>으로 접속 중입니다.</p>
              <p>🚀 더 많은 기능을 사용하려면 회원가입하세요!</p>
            </div>
          )}

          {isLoggedIn && (
            <section className="mb-12">
              <UserProfile />
            </section>
          )}

          {isLoggedIn && (
            <section className="mb-12">
              <RecyclingStats />
            </section>
          )}
        </motion.div>
      </main>
      
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          Copyright © 2025 분리배출 AI 시스템. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
