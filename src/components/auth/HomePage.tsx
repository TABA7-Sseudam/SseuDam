// src/components/auth/HomePage.tsx
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { UserProfile } from "@/components/profile/UserProfile";
import { RecyclingStats } from "@/components/dashboard/RecyclingStats";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface UserData {
  isGuest?: boolean;
}

export default function HomePage() {  // 여기서 export default 사용
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (!user) {
      navigate("/auth"); 
    } else {
      const parsedUser: UserData = JSON.parse(user);
      if (parsedUser.isGuest) {
        setIsGuest(true);
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(true);
        setIsGuest(false);
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/auth");
  };

  if (isLoggedIn === null) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 animate-pulse">로딩 중...</p>
      </div>
    );
  }

  if (!isLoggedIn && !isGuest) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">로그인 정보가 유효하지 않습니다. 다시 로그인해주세요.</p>
        <Button className="ml-4 bg-black text-white" onClick={() => navigate("/auth")}>
          로그인 페이지로 이동
        </Button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-6"
    >
      {isGuest && (
        <div className="text-center text-gray-600 bg-gray-100 p-4 rounded-md mb-6">
          <p>🔹 현재 <b>게스트 계정</b>으로 접속 중입니다.</p>
          <p>🚀 더 많은 기능을 사용하려면 회원가입하세요!</p>
        </div>
      )}

      {isLoggedIn && (
        <>
          <section className="mb-12">
            <UserProfile />
          </section>
          <section className="mb-12">
            <RecyclingStats />
          </section>
        </>
      )}

      <div className="text-center">
        <Button 
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          {isGuest ? "게스트 모드 종료" : "로그아웃"}
        </Button>
      </div>
    </motion.div>
  );
}