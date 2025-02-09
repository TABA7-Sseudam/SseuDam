import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaCrown, FaUser } from "react-icons/fa";
import { Area, AreaChart, CartesianGrid, XAxis, Tooltip as RechartTooltip } from "recharts";
import { fetchUsers, fetchChartData, User, ChartData } from "@/components/ranking/Ranking_user";
import 'bootstrap-icons/font/bootstrap-icons.css';
import Dropdown from 'react-bootstrap/Dropdown';
// React-Bootstrap Tooltip 관련 컴포넌트 임포트
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import TooltipComponent from 'react-bootstrap/Tooltip';

// 현재 로그인된 사용자 정보 (공주아파트 소속)
const currentUserName = '김제니';
const currentUserApartment = '공주아파트';

// 📝 UserCard 컴포넌트 정의
const UserCard = ({
  name,
  grade,
  xp,
  message,
  rank,
  rankDifference,
  highlight = false,
  isFirst = false,
  isLast = false
}: {
  name: string;
  grade: string;
  xp: number;
  message: string;
  rank: string;
  rankDifference: string;
  highlight?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}) => {
  const borderClasses = `${isFirst ? 'rounded-t-lg border-t border-l border-r' : ''} ${isLast ? 'rounded-b-lg border-b border-l border-r' : ''} ${!isFirst && !isLast ? 'border-l border-r' : ''} ${highlight ? 'bg-green-100' : 'bg-white'}`;
  
  return (
    <div className={`p-4 flex flex-col justify-center flex-1 ${borderClasses}`}>
      <div className="flex items-center relative h-40">
        <div className="w-24 h-24 border-4 border-black rounded-full flex items-center justify-center mr-4 relative">
          <FaUser size={40} className="text-black" />
          {highlight && (
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-0.5 rounded-t-md">
              my
            </div>
          )}
        </div>
        <div className="flex-grow relative pr-20">
          <h2 className="text-xl font-bold">{name}</h2>
          <p className="text-gray-600">{grade}</p>
          <div className="w-[120%] bg-gray-200 h-4 rounded mt-2 mb-1 relative">
            <div className="bg-green-400 h-4 rounded" style={{ width: `${(xp / 10000) * 100}%` }}></div>
            <div className="absolute top-0 right-0 h-full border-l-4 border-black"></div>
          </div>
          <p className="text-gray-600 text-sm">이번달 획득 Eco XP🌱: {xp} / 10000</p>
          <p className="text-gray-600 text-sm">{message}</p>
        </div>
        <div className="flex flex-col justify-center items-center text-4xl font-bold text-black pl-4 w-44">
          {rank}
          <p className="text-green-600 text-sm mt-1 text-center">{rankDifference}</p>
        </div>
      </div>
    </div>
  );
};

// 📝 EcoProgressBar 컴포넌트 정의
const EcoProgressBar = ({ totalXP, grade }: { totalXP: number, grade: string }) => {
  const levelUpPoints = 10000;
  const progressPercentage = (totalXP / levelUpPoints) * 100;
  const remainingPoints = levelUpPoints - totalXP;

  return (
    <Card className="p-6 bg-white rounded-lg shadow-md relative w-full">
      <h2 className="text-xl font-bold mb-2">
        나의 등급: <span className="font-normal">{grade}</span>
      </h2>
      <br />
      <div className="mt-4 relative w-full h-6 bg-gray-300 rounded-full overflow-visible">
        <div className="h-full bg-green-500 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
        <div className="absolute -top-8 z-20" style={{ left: `${progressPercentage}%`, transform: 'translateX(-50%)' }}>
          <div className="bg-black text-white text-xs px-3 py-1 rounded-full shadow-md whitespace-nowrap flex items-center gap-1">
             🌱 {remainingPoints} Eco XP 남음!
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black rotate-45"></div>
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-4">
        <div className="text-left">
          <p className="text-sm text-gray-600">누적 Eco XP</p>
          <p className="text-lg font-bold text-green-600">{totalXP} XP</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">다음 등급 XP</p>
          <p className="text-lg font-bold text-gray-600">{levelUpPoints} XP</p>
        </div>
      </div>
    </Card>
  );
};

// 📝 메인 Ranking 컴포넌트
export function Ranking() {
  const [users, setUsers] = useState<User[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedApartment, setSelectedApartment] = useState("공주아파트");
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await fetchUsers();
        const chartInfo = await fetchChartData();
        console.log("Fetched users:", userData);
        setUsers(userData);
        setChartData(chartInfo);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    loadData();
  }, []);

  // 드롭다운 선택 변경 시 페이지 번호 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedApartment]);

  // 드롭다운에 따른 데이터 필터링
  const filteredUsers = selectedApartment === "종합랭킹"
    ? users
    : users.filter(user => user.apartment === selectedApartment);

  // 이번달 Eco XP 기준 내림차순 정렬
  const sortedUsers = [...filteredUsers].sort((a, b) => b.monthlyPoints - a.monthlyPoints);

  // 디버깅: 콘솔에 상태 출력
  console.log("selectedApartment:", selectedApartment);
  console.log("All users:", users);
  console.log("Filtered users:", filteredUsers);
  console.log("Sorted users:", sortedUsers);

  // 랭킹보드 페이지네이션용 데이터
  const usersPerPage = 10;
  const paginatedUsers = sortedUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  // 현재 사용자(공주아파트, 김제니) 정보
  const currentUser = users.find(u => u.name === currentUserName && u.apartment === currentUserApartment);
  // 정렬된 목록에서 현재 사용자의 인덱스 (사용자 카드 섹션에서 –1위, +1위 위해)
  const currentIndex = sortedUsers.findIndex(u => u.name === currentUserName);

  // 현재 사용자 중심으로 바로 위, 현재, 바로 아래 데이터를 준비 (존재할 경우)
  let userCards: (User & { position: 'above' | 'current' | 'below' })[] = [];
  if (currentIndex !== -1) {
    if (currentIndex > 0) {
      userCards.push({ ...sortedUsers[currentIndex - 1], position: 'above' });
    }
    userCards.push({ ...sortedUsers[currentIndex], position: 'current' });
    if (currentIndex < sortedUsers.length - 1) {
      userCards.push({ ...sortedUsers[currentIndex + 1], position: 'below' });
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const handleNextPage = () => {
    if (currentPage < Math.ceil(sortedUsers.length / usersPerPage)) setCurrentPage(currentPage + 1);
  };

  // 로딩 상태: 데이터가 아직 로드되지 않았다면
  if (users.length === 0) {
    return <div className="container mx-auto p-6 bg-white">Loading ranking data...</div>;
  }

  return (
    <div className="container mx-auto p-6 bg-white">
      {/* 상단 헤더 및 드롭다운 */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          🏅대림 1동 분리수거 랭킹
          {/* React-Bootstrap OverlayTrigger를 사용하여 툴팁 적용 */}
          <OverlayTrigger
            placement="top"
            overlay={
              <TooltipComponent id="tooltip-top">
                등급 & 랭킹 알아보기!
              </TooltipComponent>
            }
          >
            <button
              type="button"
              className="btn btn-link p-0 ml-2 text-primary"
              onClick={() => navigate("/ranking/rank_tier_guide")}
            >
              <i className="bi bi-question-circle-fill fs-2"></i>
            </button>
          </OverlayTrigger>
        </h1>
        <Dropdown>
          <Dropdown.Toggle variant="secondary" id="dropdown-basic" style={{ minWidth: '150px' }}>
            {selectedApartment}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setSelectedApartment("공주아파트")}>공주아파트</Dropdown.Item>
            <Dropdown.Item onClick={() => setSelectedApartment("왕자아파트")}>왕자아파트</Dropdown.Item>
            <Dropdown.Item onClick={() => setSelectedApartment("종합랭킹")}>종합랭킹</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {/* 1. 상위 사용자 카드 섹션 (Top 3) - 항상 표시 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sortedUsers.slice(0, 3).map((user, index) => {
          // 종합랭킹 모드에서는 상위 3명의 메달 색상을 강제로 오버라이드합니다.
          const medal =
            selectedApartment === "종합랭킹"
              ? index === 0
                ? { bgColor: "bg-yellow-100", crownColor: "text-yellow-400" } // 1등: 금색
                : index === 1
                ? { bgColor: "bg-gray-200", crownColor: "text-gray-400" }     // 2등: 은색
                : { bgColor: "bg-orange-100", crownColor: "text-orange-400" }   // 3등: 동색
              : { bgColor: user.bgColor || "", crownColor: user.crownColor || "" };

          return (
            <Card key={user.name} className={`p-6 text-center shadow-md ${medal.bgColor}`}>
              <div className="flex justify-center mb-4 relative">
                <div className="w-24 h-24 bg-black rounded-full relative">
                  <FaCrown className={`absolute -top-4 left-4 text-3xl transform rotate-[-25deg] ${medal.crownColor}`} />
                </div>
              </div>
              <h2 className="text-xl font-bold mb-1">{user.name}</h2>
              <Button variant="secondary" className="mb-4 bg-green-100 text-green-800">{user.grade}</Button>
              <p>이번달 획득 Eco XP🌱: {user.monthlyPoints}</p>
              <p>총 획득 Eco XP🌳: {user.totalPoints}</p>
            </Card>
          );
        })}
      </div>

      {/* 2. 사용자 카드 섹션 + 나의 등급/차트 섹션 */}
      {(selectedApartment === currentUserApartment || selectedApartment === "종합랭킹") && currentIndex !== -1 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* 사용자 카드 섹션 (현재 사용자 기준 -1위, 현재, +1위) */}
          <Card className="p-0 overflow-hidden border border-gray-300 rounded-lg flex flex-col h-full">
          {userCards.map((user, idx) => {
            let rankDifference = ''
            
            if (user.name === currentUserName) {
              const percent = Math.round(((currentIndex + 1) / sortedUsers.length) * 100)
              rankDifference = `상위 ${percent}%`
            } else if (user.position === 'above') {
              const difference = Math.abs(sortedUsers[currentIndex].monthlyPoints - user.monthlyPoints)
              rankDifference = `${difference}🌱 차이!`
            } else if (user.position === 'below') {
              rankDifference = `${user.name}님이 맹 추격중!`
            }

            return (
              <UserCard
                key={user.name}
                name={user.name}
                grade={user.grade}
                xp={user.monthlyPoints}
                message={`총 획득 Eco XP🌳: ${user.totalPoints}`}
                rank={`${sortedUsers.findIndex(u => u.name === user.name) + 1}위`}
                rankDifference={rankDifference}
                highlight={user.name === currentUserName}
                isFirst={idx === 0}
                isLast={idx === (userCards.length - 1)}
              />
            )
          })}

          </Card>

          {/* 나의 등급 및 차트 섹션 */}
          <div className="flex flex-col gap-6">
            {currentUser && (
              <EcoProgressBar totalXP={currentUser.totalPoints} grade={currentUser.grade} />
            )}
            <Card className="p-6 h-[350px] flex justify-center items-center">
              <div>
                <h2 className="text-xl font-bold mb-4 text-center">월별 획득 포인트</h2>
                <AreaChart width={600} height={250} data={chartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis 
                      dataKey="month" 
                      type="category" 
                      interval={0}
                      padding={{ left: 20, right: 20 }} // 공백을 줘서 양 끝이 짤리지 않게끔
                    />
                  <RechartTooltip />
                  <Area dataKey="주민평균" type="monotone" fill="rgba(34, 202, 236, 0.4)" stroke="rgb(34, 202, 236)" />
                  <Area dataKey="사용자" type="monotone" fill="rgba(255, 99, 132, 0.4)" stroke="rgb(255, 99, 132)" />
                </AreaChart>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* 3. 랭킹보드 섹션 - 항상 표시 */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">🏆 {selectedApartment} 랭킹보드</h2>
        {paginatedUsers.length > 0 ? (
          paginatedUsers.map((user, index) => {
            const actualIndex = (currentPage - 1) * usersPerPage + index;
            return (
              <Card key={user.name} className="flex items-center p-4 mb-2 shadow-sm">
                <span className="text-xl font-bold w-12">{actualIndex + 1}위</span>
                <div className="w-16 h-16 bg-black rounded-full mx-4"></div>
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold">{user.name}</h3>
                  <p className="text-sm text-gray-600">{user.grade}</p>
                  <div className="w-full bg-gray-200 h-4 rounded mt-2 mb-1">
                    <div className="bg-green-400 h-4 rounded" style={{ width: `${(user.monthlyPoints / 10000) * 100}%` }}></div>
                  </div>
                  <p className="text-gray-600 text-sm">이번달 획득 Eco XP🌱: {user.monthlyPoints} / 10000</p>
                  <p className="text-gray-600 text-sm">총 획득 Eco XP🌳: {user.totalPoints}</p>
                </div>
              </Card>
            );
          })
        ) : (
          <p className="text-center text-gray-500">랭킹 데이터가 없습니다.</p>
        )}

        {/* 페이지네이션 */}
        <div className="flex justify-center mt-4">
          <Button onClick={handlePrevPage} disabled={currentPage === 1} className="mx-2 bg-black text-white">이전</Button>
          {[...Array(Math.ceil(sortedUsers.length / usersPerPage)).keys()].map(page => (
            <Button
              key={page + 1}
              onClick={() => setCurrentPage(page + 1)}
              className={currentPage === page + 1 ? "bg-black text-white mx-1" : "bg-white border border-black text-black mx-1"}
            >
              {page + 1}
            </Button>
          ))}
          <Button onClick={handleNextPage} disabled={currentPage >= Math.ceil(sortedUsers.length / usersPerPage)} className="mx-2 bg-black text-white">다음</Button>
        </div>
      </div>
    </div>
  );
}
