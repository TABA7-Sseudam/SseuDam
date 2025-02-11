import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaCrown, FaUser } from "react-icons/fa";
import { Area, AreaChart, CartesianGrid, XAxis, Tooltip } from "recharts";
import { users } from "@/components/ranking/Ranking_user";

const chartData = [
  { week: "5주전", 사용자: 100, 주민평균: 250 },
  { week: "4주전", 사용자: 400, 주민평균: 180 },
  { week: "3주전", 사용자: 150, 주민평균: 300 },
  { week: "2주전", 사용자: 500, 주민평균: 200 },
  { week: "1주전", 사용자: 350, 주민평균: 450 },
  { week: "이번주", 사용자: 200, 주민평균: 150 },
];

export function Ranking() {
  const [timeFrame, setTimeFrame] = useState("thisWeek");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < 5) setCurrentPage(currentPage + 1);
  };

  const currentUsers = users.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const placeholderUsers = Array.from({ length: usersPerPage }, (_, index) => ({
    rank: (currentPage - 1) * usersPerPage + index + 1,
    name: "--",
    username: "--",
    title: "--",
    avatar: "",
    weeklyPoints: 0,
    totalPoints: 0,
  }));

  const displayedUsers = currentUsers.length ? currentUsers : placeholderUsers;

  const topContributors = [
    {
      name: "김영희",
      username: "@101동",
      title: "🌟에코 히어로",
      avatar: "",
      stats: { total: 12000, monthly: 1500 },
      bgColor: "bg-yellow-100",
      crownColor: "text-yellow-400",
    },
    {
      name: "김철수",
      username: "@105동",
      title: "🌍지구 지키미",
      avatar: "",
      stats: { total: 8000, monthly: 1300 },
      bgColor: "bg-gray-200",
      crownColor: "text-gray-400",
    },
    {
      name: "홍길동",
      username: "@103동",
      title: "🗑 분리배출 견습생",
      avatar: "",
      stats: { total: 7500, monthly: 1100 },
      bgColor: "bg-orange-100",
      crownColor: "text-orange-400",
    },
  ];

  return (
    <div className="container mx-auto p-6 bg-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          티베로 아파트 분리수거 랭킹 <FaCrown className="text-yellow-500" />
        </h1>
        <div className="flex gap-2">
          <Button 
            className={timeFrame === "thisWeek" ? "bg-black text-white" : "bg-white border border-black text-black"}
            onClick={() => setTimeFrame("thisWeek")}
          >
            This Week
          </Button>
          <Button 
            className={timeFrame === "lastWeek" ? "bg-black text-white" : "bg-white border border-black text-black"}
            onClick={() => setTimeFrame("lastWeek")}
          >
            This Month
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {topContributors.map((user, index) => (
          <Card key={index} className={`p-6 text-center shadow-md ${user.bgColor}`}>
            <div className="flex justify-center mb-4 relative">
              <div className="w-24 h-24 bg-black rounded-full relative">
                <FaCrown 
                  className={`absolute -top-4 left-4 text-3xl transform rotate-[-25deg] ${user.crownColor}`} 
                />
              </div>
            </div>
            <h2 className="text-xl font-bold mb-1">{user.name}</h2>
            <p className="text-gray-500 mb-2">{user.username}</p>
            <Button variant="secondary" className="mb-4 bg-green-100 text-green-800">{user.title}</Button>

            <div className="text-gray-600">
              <p>This week's ECO exp🌱: {user.stats?.monthly ?? 0}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center mb-4 relative">
            <div className="w-24 h-24 border-4 border-black rounded-full flex items-center justify-center mr-6 relative">
              <FaUser size={40} className="text-black" />
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-0.5 rounded-t-md">
               my
              </div>
            </div>
            <div className="flex-grow">
              <h2 className="text-xl font-bold">오라클</h2>
              <p className="text-gray-600">🌍지구 지키미</p>
              <div className="w-full bg-gray-200 h-4 rounded mt-2 mb-1">
                <div className="bg-green-400 h-4 rounded" style={{ width: "20%" }}></div>
              </div>
              <p className="text-gray-600 text-sm">Eco XP🌱: 2000 / 10000 EXP</p>
              <p className="text-gray-600 text-sm">등급 상승까지 8000 EXP 남았습니다!</p>
            </div>
            <div className="text-center text-4xl font-bold text-black border-l-4 border-black pl-6">
              🎯 26위
              <p className="text-green-600 text-sm mt-2">27위와 1000🌱 차이!</p>
            </div>
          </div>
          <div className="border-t-2 border-gray-300 my-4"></div>
          <div className="flex items-center">
            <div className="w-24 h-24 border-4 border-black rounded-full flex items-center justify-center mr-6">
              <FaUser size={40} className="text-black" />
            </div>
            <div className="flex-grow">
              <h2 className="text-xl font-bold">티베로</h2>
              <p className="text-gray-600">💀 환경 테러범</p>
              <div className="w-full bg-gray-200 h-4 rounded mt-2 mb-1">
                <div className="bg-green-400 h-4 rounded" style={{ width: "10%" }}></div>
              </div>
              <p className="text-gray-600 text-sm">Eco XP🌱: 1000 / 10000 EXP</p>
              <p className="text-gray-600 text-sm">티베로님이 맹 추격중!</p>
            </div>
            <div className="text-center text-4xl font-bold text-black border-l-4 border-black pl-6">
              🎯 27위
              <p className="text-green-600 text-sm mt-2">최근 7일, 1500🌱 상승!</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">주별 포인트 통계</h2>
            <AreaChart
              width={500}
              height={300}
              data={chartData}
              margin={{ left: 12, right: 12 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="week"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                padding={{ left: 25, right: 25 }}
                interval={0}
                tickFormatter={(value) => /[가-힣]/.test(value) ? value.slice(0, 3) : value.substring(0, 3)}
              />
              <Tooltip cursor={false} />
              <Area
                dataKey="주민평균"
                type="monotone"
                fill="rgba(34, 202, 236, 0.4)"
                stroke="rgb(34, 202, 236)"
              />
              <Area
                dataKey="사용자"
                type="monotone"
                fill="rgba(255, 99, 132, 0.4)"
                stroke="rgb(255, 99, 132)"
              />
            </AreaChart>
          </div>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">전체 사용자 순위</h2>
        {displayedUsers.map((user) => (
          <Card key={user.rank} className="flex items-center p-4 mb-2 shadow-sm">
            <span className="text-xl font-bold w-12">{user.rank}위</span>
            <div className="w-12 h-12 bg-black rounded-full mx-4"></div>
            <div className="flex-grow">
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <p className="text-sm text-gray-600">{user.title}</p>
              <div className="w-full bg-gray-200 h-4 rounded mt-2 mb-1">
                <div className="bg-green-400 h-4 rounded" style={{ width: `${(user.weeklyPoints / 10000) * 100}%` }}></div>
              </div>
              <p className="text-gray-600 text-sm">This week Eco XP🌱: {user.weeklyPoints} / 10000 EXP</p>
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
