// src/components/auth/HomePage.tsx
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { UserProfile } from "@/components/profile/UserProfile";
import { RecyclingStats } from "@/components/dashboard/RecyclingStats";
import ActionBar from "@/components/dashboard/ActionBar";
import ConvertRate from "@/components/dashboard/ConvertRate";
import PerformanceIndex from "@/components/dashboard/PerformanceIndex";
import EnvironmentalGrade from "@/components/dashboard/EnvironmentalGrade";

interface UserData {
  isGuest?: boolean;
  username?: string;
  email?: string;
  lastLogin?: string;
  createdAt?: string;
}

export default function HomePage() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/auth");
    } else {
      const parsedUser: UserData = JSON.parse(user);
      setUserData(parsedUser);
      setIsLoggedIn(!parsedUser.isGuest);
      setIsGuest(!!parsedUser.isGuest);
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
        <Button className="ml-4 bg-black text-white" onClick={() => navigate("/auth")}>로그인 페이지로 이동</Button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#1F2937] text-white p-6"
    >
      {isGuest && (
        <div className="text-center text-gray-400 bg-gray-800 p-4 rounded-md mb-6">
          <p>🔹 현재 <b>게스트 계정</b>으로 접속 중입니다.</p>
          <p>🚀 더 많은 기능을 사용하려면 회원가입하세요!</p>
        </div>
      )}

      {isLoggedIn && userData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="col-span-1 lg:col-span-2 bg-[#111827] p-6 rounded-lg shadow-md">
            <UserProfile userData={userData} />
          </div>
          <div className="col-span-1 lg:col-span-2 bg-[#111827] p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
            <ConvertRate percent={0.9} />
            <div className="flex justify-around w-full mt-4">
              <EnvironmentalGrade grade="브론즈" pointsToNextGrade="1000 포인트" />
            </div>
          </div>
          <div className="col-span-1 lg:col-span-2 bg-[#111827] p-6 rounded-lg shadow-md">
            <RecyclingStats />
          </div>
          <div className="col-span-1 bg-[#111827] p-6 rounded-lg shadow-md">
            <ActionBar users={[{ name: userData.username || "사용자", avatar: "/default-avatar.png" }]} />
          </div>
          <div className="col-span-1 lg:col-span-2 bg-[#111827] p-6 rounded-lg shadow-md">
            <PerformanceIndex history={[
              { date: new Date().toISOString(), percent: 0.75 },
              { date: new Date().toISOString(), percent: 0.85 },
              { date: new Date().toISOString(), percent: 0.65 }
            ]} />
          </div>
        </div>
      )}

      <div className="text-center mt-8">
        <Button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg">
          {isGuest ? "게스트 모드 종료" : "로그아웃"}
        </Button>
      </div>
    </motion.div>
  );
}
