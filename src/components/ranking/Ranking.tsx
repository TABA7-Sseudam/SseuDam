import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaCrown, FaUser } from "react-icons/fa";
import { Area, AreaChart, CartesianGrid, XAxis, Tooltip } from "recharts";
import { users } from "@/components/ranking/Ranking_user";

// 차트 데이터
const chartData = [
  { month: "5달전", 사용자: 100, 주민평균: 250 },
  { month: "4달전", 사용자: 400, 주민평균: 180 },
  { month: "3달전", 사용자: 150, 주민평균: 300 },
  { month: "2달전", 사용자: 500, 주민평균: 200 },
  { month: "1달전", 사용자: 350, 주민평균: 450 },
  { month: "이번달", 사용자: 200, 주민평균: 150 },
];

// **UserCard Props 타입 정의**
interface UserCardProps {
  name: string
  title: string
  xp: number
  message: string
  rank: string
  rankDifference: string
  highlight?: boolean  // 선택적 prop
  isFirst?: boolean    // 선택적 prop
  isLast?: boolean     // 선택적 prop
}

// 개별 사용자 카드 컴포넌트
const UserCard = ({
  name,
  title,
  xp,
  message,
  rank,
  rankDifference,
  highlight = false,
  isFirst = false,
  isLast = false
}: UserCardProps) => {
  // 동적 클래스 설정
  const borderClasses = `
    ${isFirst ? 'rounded-t-lg border-t border-l border-r' : ''}
    ${isLast ? 'rounded-b-lg border-b border-l border-r' : ''}
    ${!isFirst && !isLast ? 'border-l border-r' : ''}
    ${highlight ? 'bg-green-100' : 'bg-white'}
  `;

  return (
    <div className={`p-4 ${borderClasses}`}>
      <div className="flex items-center relative">
        <div className="w-24 h-24 border-4 border-black rounded-full flex items-center justify-center mr-4 relative">
          <FaUser size={40} className="text-black" />
          {highlight && (
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-0.5 rounded-t-md">
              my
            </div>
          )}
        </div>
        <div className="flex-grow">
          <h2 className="text-xl font-bold">{name}</h2>
          <p className="text-gray-600">{title}</p>
          <div className="w-full bg-gray-200 h-4 rounded mt-2 mb-1">
            <div className="bg-green-400 h-4 rounded" style={{ width: `${(xp / 10000) * 100}%` }}></div>
          </div>
          <p className="text-gray-600 text-sm">Eco XP🌱: {xp} / 10000 EXP</p>
          <p className="text-gray-600 text-sm">{message}</p>
        </div>
        <div className="text-center text-4xl font-bold text-black border-l-4 border-black pl-4">
          {rank}
          <p className="text-green-600 text-sm mt-1">{rankDifference}</p>
        </div>
      </div>
    </div>
  );
};

export function Ranking() {
  const [timeFrame, setTimeFrame] = useState("thismonth");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < 5) setCurrentPage(currentPage + 1);
  };

  const currentUsers = users.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  const placeholderUsers = Array.from({ length: usersPerPage }, (_, index) => ({
    rank: (currentPage - 1) * usersPerPage + index + 1,
    name: "--",
    title: "--",
    avatar: "",
    monthlyPoints: 0,
    totalPoints: 0,
  }));

  const displayedUsers = currentUsers.length ? currentUsers : placeholderUsers;

  const topContributors = [
    {
      name: "김영희",
      title: "🌟에코 히어로",
      avatar: "",
      stats: { total: 12000, monthly: 1500 },
      bgColor: "bg-yellow-100",
      crownColor: "text-yellow-400",
    },
    {
      name: "김철수",
      title: "🌍지구 지키미",
      avatar: "",
      stats: { total: 8000, monthly: 1300 },
      bgColor: "bg-gray-200",
      crownColor: "text-gray-400",
    },
    {
      name: "홍길동",
      title: "🗑 분리배출 견습생",
      avatar: "",
      stats: { total: 7500, monthly: 1100 },
      bgColor: "bg-orange-100",
      crownColor: "text-orange-400",
    },
  ];

  return (
    <div className="container mx-auto p-6 bg-white">
      {/* 제목 및 필터 버튼 */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          대림 1동 분리수거 랭킹 <FaCrown className="text-yellow-500" />
        </h1>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <Button
              className={timeFrame === "thismonth" ? "bg-black text-white" : "bg-white border border-black text-black"}
              onClick={() => setTimeFrame("thismonth")}
            >
              공주 아파트
            </Button>
            <Button
              className={timeFrame === "lastmonth" ? "bg-black text-white" : "bg-white border border-black text-black"}
              onClick={() => setTimeFrame("lastmonth")}
            >
              왕자 아파트
            </Button>
            <Button
              className={timeFrame === "total" ? "bg-black text-white" : "bg-white border border-black text-black"}
              onClick={() => setTimeFrame("total")}
            >
              종합 랭킹
            </Button>
          </div>
        </div>
      </div>

      {/* 상위 3명 사용자 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {topContributors.map((user, index) => (
          <Card key={index} className={`p-6 text-center shadow-md ${user.bgColor}`}>
            <div className="flex justify-center mb-4 relative">
              <div className="w-24 h-24 bg-black rounded-full relative">
                <FaCrown className={`absolute -top-4 left-4 text-3xl transform rotate-[-25deg] ${user.crownColor}`} />
              </div>
            </div>
            <h2 className="text-xl font-bold mb-1">{user.name}</h2>
            <Button variant="secondary" className="mb-4 bg-green-100 text-green-800">{user.title}</Button>
            <div className="text-gray-600">
              <p>이번주 획득 Eco XP🌱: {user.stats?.monthly ?? 0}</p>
              <p>총 획득 Eco XP🌿: {user.stats?.total ?? 0}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* 사용자 카드 묶음 및 차트 섹션 */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* 묶인 사용자 카드 */}
        <Card className="p-0 overflow-hidden border border-gray-300 rounded-lg">
          <UserCard
            name="유니콘 🔻"
            title="🦄 꿈의 지배자"
            xp={3000}
            message="저번주 수요일 플라스틱 버린사람 누구냐"
            rank="🎯 25위"
            rankDifference="단 500🌱 차이!"
            isFirst
          />
          <UserCard
            name="오라클 🔝"
            title="🌍 지구 지키미"
            xp={2000}
            message="상태 메시지를 입력해주세요."
            rank="👤 26위"
            rankDifference="상위 10% 진입!"
            highlight
          />
          <UserCard
            name="티베로"
            title="💀 환경 테러범"
            xp={1000}
            message="이번달 분리수거 1등 하러감 ㅅㄱ"
            rank="🔥 27위"
            rankDifference="티베로님이 맹 추격중!"
            isLast
          />
        </Card>

        {/* 차트 섹션 */}
        <Card className="p-6 h-[350px] flex justify-center items-center">
          <div>
            <h2 className="text-xl font-bold mb-4 text-center">주민 vs 사용자 월별 비교</h2>
            <AreaChart width={550} height={250} data={chartData} margin={{ left: 12, right: 12 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                padding={{ left: 25, right: 25 }}
                interval={0}
                tickFormatter={(value) => (/[가-힣]/.test(value) ? value.slice(0, 3) : value.substring(0, 3))}
              />
              <Tooltip cursor={false} />
              <Area dataKey="주민평균" type="monotone" fill="rgba(34, 202, 236, 0.4)" stroke="rgb(34, 202, 236)" />
              <Area dataKey="사용자" type="monotone" fill="rgba(255, 99, 132, 0.4)" stroke="rgb(255, 99, 132)" />
            </AreaChart>
          </div>
        </Card>
      </div>

      {/* 전체 사용자 순위 */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">전체 사용자 순위</h2>
        {displayedUsers.map((user) => (
          <Card key={user.rank} className="flex items-center p-4 mb-2 shadow-sm">
            <span className="text-xl font-bold w-12">{user.rank}위</span>
            <div className="w-16 h-16 bg-black rounded-full mx-4"></div>
            <div className="flex-grow">
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <p className="text-sm text-gray-600">{user.title}</p>
              <div className="w-full bg-gray-200 h-4 rounded mt-2 mb-1">
                <div className="bg-green-400 h-4 rounded" style={{ width: `${(user.monthlyPoints / 10000) * 100}%` }}></div>
              </div>
              <p className="text-gray-600 text-sm">This month Eco XP🌱: {user.monthlyPoints} / 10000 EXP</p>
              <p className="text-gray-600 text-sm">Total Eco XP🌱: {user.totalPoints}</p>
            </div>
          </Card>
        ))}
        <div className="flex justify-center mt-4">
          <Button onClick={handlePrevPage} disabled={currentPage === 1} className="mx-2 bg-black text-white">
            이전
          </Button>
          {[1, 2, 3, 4, 5].map((page) => (
            <Button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={currentPage === page ? "bg-black text-white mx-1" : "bg-white border border-black text-black mx-1"}
            >
              {page}
            </Button>
          ))}
          <Button onClick={handleNextPage} disabled={currentPage === 5} className="mx-2 bg-black text-white">
            다음
          </Button>
        </div>
      </div>
    </div>
  );
}
