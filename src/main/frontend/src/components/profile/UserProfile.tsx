import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@radix-ui/react-dialog";
import { availableIcons } from "@/utils/iconList";

interface UserProfileProps {
  userData: {
    nickname?: string;
    email?: string;
    selectedIcon?: string;
    grade?: string;
    points_needed_for_promotion: number;
    accumulatedPoints?: number;
    monthlyPoints: number;
    last_login?: string;
    created_at?: string;
    xp?: number;
    maxXp?: number;
  };
}

export function UserProfile({ userData: initialUserData }: UserProfileProps) {
  const [user, setUser] = useState(initialUserData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // 경험치 퍼센트 계산
  const totalPoints = user?.accumulatedPoints || 0;
  const pointsToNextRank = user?.points_needed_for_promotion || 0;
  const xp = user?.xp || totalPoints;
  const maxXp = user?.maxXp || (totalPoints + pointsToNextRank);
  const xpPercentage = maxXp > 0 ? (xp / maxXp) * 100 : 0;

  useEffect(() => {
    const storedIcon = localStorage.getItem("selectedIcon");
    if (storedIcon && user) {
      setUser((prev) => ({ ...prev, selectedIcon: storedIcon }));
    }
  }, []);

  if (!user) return null;

  return (
    <div className="bg-green-100 min-h-screen flex flex-col items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg text-center border border-green-300 shadow-green-400">
        <div className="text-center text-green-700 bg-green-200 p-4 rounded-md mb-6">
          <p className="font-semibold text-lg">♻️ 환경을 위한 친환경 분리배출을 시작하세요!</p>
          <p className="text-sm">지속 가능한 지구를 위한 작은 실천이 큰 변화를 만듭니다.</p>
        </div>

        {/* 프로필 아이콘 선택 */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <div className="relative w-24 h-24 mx-auto cursor-pointer bg-green-200 flex items-center justify-center rounded-full border-2 border-green-400 shadow-md hover:bg-green-300 transition-all">
              {user.selectedIcon ? (
                <img
                  src={user.selectedIcon}
                  alt="사용자 아이콘"
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <span className="text-green-800 text-5xl">
                  {(user.nickname || "U")[0].toUpperCase()}
                </span>
              )}
            </div>
          </DialogTrigger>

          {/* 아이콘 선택 모달 */}
          <DialogContent className="max-w-lg bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-center mb-4">아이콘 선택</h2>
            <div className="grid grid-cols-5 gap-4">
              {availableIcons.map((iconUrl) => (
                <button
                  key={iconUrl}
                  className="p-2 bg-gray-100 rounded-lg shadow hover:bg-gray-200 transition"
                  onClick={() => {
                    localStorage.setItem("selectedIcon", iconUrl);
                    setUser((prev) => ({ ...prev, selectedIcon: iconUrl }));
                  }}
                >
                  <img
                    src={iconUrl}
                    alt="아이콘"
                    className="w-12 h-12 rounded-md object-cover"
                  />
                </button>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        <h2 className="text-2xl font-bold mt-4 text-green-900">{user.nickname || "사용자"}</h2>
        <p className="text-green-700">{user.email}</p>

        <div className="mt-4 space-y-2 text-sm text-green-600">
          <p>가입일: {new Date(user.created_at || "").toLocaleString("ko-KR")}</p>
          <p>마지막 로그인: {new Date(user.last_login || "").toLocaleString("ko-KR")}</p>
        </div>

        {/* 🌿 부드러운 녹색 그라데이션 경험치 바 */}
        <div className="relative w-full bg-gray-200 rounded-full h-8 mt-6 overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 h-full rounded-full transition-all duration-500"
            style={{
              width: `${xpPercentage}%`,
              background: "linear-gradient(to right, #A8E6CF, #56AB2F, #3E8914)",
            }}
          />
          {/* 경험치 수치 표시 */}
          <p className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg drop-shadow-md">
            {xpPercentage.toFixed(1)}%
          </p>
        </div>

        {/* 레벨 구간 표시 */}
        <div className="relative w-full flex justify-between px-2 mt-1 mb-3 text-xs text-gray-600">
          <span>0%</span>
          <span>20%</span>
          <span>40%</span>
          <span>60%</span>
          <span>80%</span>
          <span>100%</span>
        </div>

        <div className="text-center my-4">
          <p className="text-sm font-medium text-gray-600">
            <span className="inline-block mr-1">🎯</span> 승급까지 {pointsToNextRank} P 남음
          </p>
        </div>

        {/* 현재 등급 & 승급 포인트 */}
        <div className="grid grid-cols-2 gap-4 mt-6 text-center">
          <div className="bg-green-50 p-3 rounded-lg shadow-sm border border-green-200">
            <p className="text-sm text-green-700">현재 등급</p>
            <p className="text-lg font-semibold text-green-900">{user.grade || "등급 없음"}</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg shadow-sm border border-green-200">
            <p className="text-sm text-green-700">승급까지 필요한 포인트</p>
            <p className="text-lg font-semibold text-green-900">{pointsToNextRank} P</p>
          </div>
        </div>

        {/* 누적 포인트 & 월별 포인트 */}
        <div className="grid grid-cols-2 gap-4 mt-4 text-center">
          <div className="bg-green-50 p-3 rounded-lg shadow-sm border border-green-200">
            <p className="text-sm text-green-700">누적 포인트</p>
            <p className="text-lg font-semibold text-green-900">{totalPoints} P</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg shadow-sm border border-green-200">
            <p className="text-sm text-green-700">월별 포인트</p>
            <p className="text-lg font-semibold text-green-900">{user.monthlyPoints || 0} P</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
