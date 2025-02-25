import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaCrown, FaUser } from "react-icons/fa";
import { fetchUsers, User } from "@/components/ranking/Ranking_user";
import BackgroundAnimation from "@/components/layout/BackgroudAnimation";
import 'bootstrap-icons/font/bootstrap-icons.css';
import Dropdown from "react-bootstrap/Dropdown";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import TooltipComponent from 'react-bootstrap/Tooltip';
import { availableIcons } from "@/utils/iconList";

/* -------------------------------------
   (추가) 다른 유저에게 랜덤 아이콘을 부여하는 함수
   - 한 번 정하면 localStorage에 저장 -> 재접속시 유지
----------------------------------------*/
function getRandomIconForUser(userName: string) {
  if (typeof window === "undefined") return null;  
  const localStorageKey = `icon_for_${userName}`;
  const existingIcon = localStorage.getItem(localStorageKey);
  
  if (existingIcon) {
    return existingIcon;
  } else {
    const randomIcon =
      availableIcons[Math.floor(Math.random() * availableIcons.length)];
    localStorage.setItem(localStorageKey, randomIcon);
    return randomIcon;
  }
}

/* -------------------------------------
   0. 애니메이션 스타일 정의 (기존 유지)
----------------------------------------*/
const AnimationStyles = () => (
  <style>{`
    @keyframes bounceIn {
      0% {
        opacity: 0;
        transform: scale(0.3);
      }
      50% {
        opacity: 1;
        transform: scale(1.05);
      }
      70% {
        transform: scale(0.9);
      }
      100% {
        transform: scale(1);
      }
    }
    .animate-bounceIn {
      animation: bounceIn 1s ease-out forwards;
    }
    .rotate-3d-container {
      perspective: 1000px;
    }
    .rotate-3d {
      transition: transform 1s;
      transform-style: preserve-3d;
    }
    .group:hover .rotate-3d {
      transform: rotateY(360deg);
    }
    @keyframes sparkleSequence {
      0%, 20% {
        background-position: 0% 0%;
        opacity: 1;
      }
      20.00001%, 25% {
        opacity: 0;
      }
      25.00001%, 66% {
        background-position: 75% 0%;
        opacity: 1;
      }
      45.00001%, 50% {
        opacity: 0;
      }
      50.00001%, 70% {
        background-position: 0% 100%;
        opacity: 1;
      }
      70.00001%, 75% {
        opacity: 0;
      }
      75.00001%, 95% {
        background-position: 100% 100%;
        opacity: 1;
      }
      95.00001%, 100% {
        opacity: 0;
      }
    }
    .sparkle-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: url('/Ranking/sparkle.png') 0 0 no-repeat;
      background-size: 200% 200%;
      animation: sparkleSequence 6s infinite;
      pointer-events: none;
      z-index: 30;
    }
  `}</style>
);

/* -------------------------------------
   1. 사용자 카드 (±1 등수) 섹션에서 쓰일 UserCard
   → highlight(내 계정)인 경우 localStorage의 아이콘 사용
----------------------------------------*/
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
  // highlight === true → 현재 로그인 유저의 아이콘
  // 그 외(다른 유저)는 랜덤 아이콘
  let userIcon = null;
  if (typeof window !== "undefined") {
    if (highlight) {
      userIcon = localStorage.getItem("selectedIcon");
    } else {
      userIcon = getRandomIconForUser(name);
    }
  }

  const borderClasses = `
    ${isFirst ? 'rounded-t-lg border-t border-l border-r' : ''}
    ${isLast ? 'rounded-b-lg border-b border-l border-r' : ''}
    ${!isFirst && !isLast ? 'border-l border-r' : ''}
    ${highlight ? 'bg-blue-200' : 'bg-[#E8EFF4]'}
  `;

  return (
    <div className={`p-4 flex flex-col justify-center flex-1 ${borderClasses}`}>
      <div className="flex items-center relative h-40">
        {/* 프로필 영역 */}
        <div className="w-24 h-24 border-4 border-black rounded-full flex items-center justify-center mr-4 relative overflow-hidden">
          {userIcon ? (
            <img
              src={userIcon}
              alt={`${name}의 프로필 아이콘`}
              className="object-cover w-full h-full"
            />
          ) : (
            <FaUser size={40} className="text-black" />
          )}
          {highlight && (
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-0.5 rounded-t-md">
              my
            </div>
          )}
        </div>

        {/* 정보 텍스트 */}
        <div className="flex-grow relative pr-20">
          <h2 className="text-xl font-bold">{name}</h2>
          <p className="text-gray-600">{grade}</p>
          <div className="w-[130%] bg-gray-200 h-4 rounded mt-2 mb-1 relative">
            <div
              className="bg-green-400 h-4 rounded"
              style={{ width: `${(xp / 10000) * 100}%` }}
            ></div>
            <div className="absolute top-0 right-0 h-full border-l-4 border-black"></div>
          </div>
          <p className="text-gray-600 text-sm whitespace-nowrap">
            이번달 VP🌱: {xp} / 10000
          </p>
          <p className="text-gray-600 text-sm">{message}</p>
        </div>

        {/* 순위 */}
        <div className="flex flex-col justify-center items-center text-4xl font-bold text-black pl-4 w-44">
          {rank}
          <p className="text-green-600 text-sm mt-1 text-center">{rankDifference}</p>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------
   2. 현재 유저의 누적 XP바 (EcoProgressBar)
----------------------------------------*/
const EcoProgressBar = ({ totalXP, grade }: { totalXP: number; grade: string }) => {
  const levelUpPoints = 10000;
  const progressPercentage = (totalXP / levelUpPoints) * 100;
  const remainingPoints = Math.max(levelUpPoints - totalXP, 0); // 음수 방지

  // 툴팁 위치를 0% ~ 100% 범위로 제한
  const tooltipPosition = Math.min(Math.max(progressPercentage, 0), 100);

  return (
    <Card className="flex flex-col items-center gap-4 p-4 bg-[#E8EFF4] rounded-lg shadow-lg w-full">
      <h2 className="text-xl font-bold w-full self-start">
        나의 등급: <span className="font-normal">{grade}</span>
      </h2>

      {/* XP 진행 바 */}
      <div className="w-full h-6 bg-gray-300 rounded-full overflow-hidden relative mt-2">
        <div
          className="h-full bg-green-500 rounded-full"
          style={{ width: `${progressPercentage}%` }}
        ></div>
        <div
          className="absolute -top-8 z-20"
          style={{ left: `${tooltipPosition}%`, transform: 'translateX(-50%)' }}
        >
          <div className="bg-black text-white text-xs px-3 py-1 rounded-full shadow-md whitespace-nowrap flex items-center gap-1">
            🌱 {remainingPoints} XP 남음!
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black rotate-45"></div>
          </div>
        </div>
      </div>

      {/* XP 정보 */}
      <div className="flex justify-between w-full">
        <div className="text-left">
          <p className="text-sm text-gray-600">누적 VP🌳</p>
          <p className="text-lg font-bold text-green-600">{totalXP} XP</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">다음 등급 VP🌳</p>
          <p className="text-lg font-bold text-gray-600">{levelUpPoints} XP</p>
        </div>
      </div>
    </Card>
  );
};

/* -------------------------------------
   3. 최종 Ranking 컴포넌트
----------------------------------------*/
export function Ranking() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // 기본적으로 "공주아파트"로 보이게
  const [selectedApartment, setSelectedApartment] = useState("공주아파트");
  const [initialSelectionSet, setInitialSelectionSet] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  /* -------------------------------------
     3-1. 아파트 선택/유저 fetch
  ----------------------------------------*/
  useEffect(() => {
    const loadData = async () => {
      try {
        const { users: fetchedUsers, currentUser: fetchedCurrentUser } = await fetchUsers(selectedApartment);
        console.log("Fetched users:", fetchedUsers);
        setUsers(fetchedUsers);
        setCurrentUser(fetchedCurrentUser);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    loadData();
  }, [selectedApartment]);

  // 로딩 끝난 후, 한 번만 현재 유저의 아파트로 초기 선택값 업데이트
  useEffect(() => {
    if (!initialSelectionSet && currentUser && currentUser.apartment !== "종합랭킹") {
      if (currentUser.apartment !== selectedApartment) {
        setSelectedApartment(currentUser.apartment);
      }
      setInitialSelectionSet(true);
    }
  }, [currentUser, selectedApartment, initialSelectionSet]);

  // 아파트 드롭다운 바뀌면 페이지를 1로
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedApartment]);

  // apartment별로 필터링
  const filteredUsers = selectedApartment === "종합랭킹"
    ? users
    : users.filter(user => user.apartment === selectedApartment);

  // rank 기준으로 정렬
  const sortedUsers = [...filteredUsers].sort((a, b) => a.rank - b.rank);

  // currentUser의 인덱스
  const currentIndex = currentUser
    ? sortedUsers.findIndex(u => u.name === currentUser.name)
    : -1;

  // ±1 등수 계산
  let userCards: (User & { position: 'above' | 'current' | 'below' })[] = [];
  if (currentUser && currentIndex !== -1) {
    if (currentIndex > 0) {
      userCards.push({ ...sortedUsers[currentIndex - 1], position: 'above' });
    }
    userCards.push({ ...sortedUsers[currentIndex], position: 'current' });
    if (currentIndex < sortedUsers.length - 1) {
      userCards.push({ ...sortedUsers[currentIndex + 1], position: 'below' });
    }
  }

  // 페이지네이션
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const handleNextPage = () => {
    if (currentPage < Math.ceil(sortedUsers.length / 10)) setCurrentPage(currentPage + 1);
  };

  // 로딩 중 또는 데이터가 없을 때
  if (users.length === 0) {
    return (
      <div className="relative min-h-screen pt-16">
        <BackgroundAnimation />
        <div className="relative z-40 flex justify-center items-center min-h-screen">
          <p className="text-gray-500 animate-pulse">랭킹 데이터 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pt-16">
      <AnimationStyles />
      <BackgroundAnimation />

      <div className="container mx-auto px-6 relative z-40">
        {/* -------------------------------
            헤더 + 아파트 선택 드롭다운
        --------------------------------*/}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            🏢 대림 1동 분리수거 랭킹
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
              <Dropdown.Item onClick={() => setSelectedApartment("주공아파트")}>주공아파트</Dropdown.Item>
              <Dropdown.Item onClick={() => setSelectedApartment("종합랭킹")}>종합랭킹</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        {/* ------------------------------------
            1. 상위 3명 (Top3) → 아이콘 노출 X (기존 유지)
        --------------------------------------*/}
        <div className="w-full">
          <div className="hidden md:flex justify-center items-end relative">
            {/* 2등 */}
            {sortedUsers[1] && (
              <div className="flex flex-col items-center mx-4" style={{ marginBottom: '2rem' }}>
                {(() => {
                  const user = sortedUsers[1];
                  const medal = selectedApartment === "종합랭킹"
                    ? { bg: "bg-gray-200", crown: "text-gray-400" }
                    : { bg: user.bgColor || "bg-gray-200", crown: user.crownColor || "text-gray-400" };
                  return (
                    <div className="relative flex flex-col items-center group rotate-3d-container">
                      <img src="/Ranking/medal.png" alt="Medal Ribbon" className="w-16" />
                      <div className="mt-[-8px] rotate-3d transition-transform duration-2000 relative w-64 h-64">
                        <div className={`${medal.bg} w-full h-full rounded-full shadow-md relative animate-bounceIn`}>
                          <div className="sparkle-overlay"></div>
                          <div className="relative z-20 flex flex-col items-center justify-center p-4">
                            <FaCrown className={`mb-2 text-3xl ${medal.crown}`} />
                            <h2 className="text-xl font-bold">{user.name}</h2>
                            <p className="text-sm">{user.grade}</p>
                            <p className="text-xs">이번달 VP🌱: {user.monthlyPoints}</p>
                            <p className="text-xs">누적 VP🌳: {user.totalPoints}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
                <div className="mt-2 font-bold text-lg">2위</div>
              </div>
            )}

            {/* 1등 */}
            {sortedUsers[0] && (
              <div className="flex flex-col items-center mx-4">
                {(() => {
                  const user = sortedUsers[0];
                  const medal = selectedApartment === "종합랭킹"
                    ? { bg: "bg-yellow-100", crown: "text-yellow-400" }
                    : { bg: user.bgColor || "bg-yellow-100", crown: user.crownColor || "text-yellow-400" };
                  return (
                    <div className="relative flex flex-col items-center group rotate-3d-container">
                      <img src="/Ranking/medal.png" alt="Medal Ribbon" className="w-20" />
                      <div className="mt-[-10px] rotate-3d transition-transform duration-2000 relative w-80 h-80">
                        <div className={`${medal.bg} w-full h-full rounded-full shadow-lg relative animate-bounceIn`}>
                          <div className="sparkle-overlay"></div>
                          <div className="relative z-20 flex flex-col items-center justify-center p-6">
                            <FaCrown className={`mb-2 text-4xl ${medal.crown}`} />
                            <h2 className="text-2xl font-bold">{user.name}</h2>
                            <p className="text-lg">{user.grade}</p>
                            <p className="text-md">이번달 VP🌱: {user.monthlyPoints}</p>
                            <p className="text-md">누적 VP🌳: {user.totalPoints}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
                <div className="mt-2 font-bold text-xl">1위</div>
              </div>
            )}

            {/* 3등 */}
            {sortedUsers[2] && (
              <div className="flex flex-col items-center mx-4" style={{ marginBottom: '2rem' }}>
                {(() => {
                  const user = sortedUsers[2];
                  const medal = selectedApartment === "종합랭킹"
                    ? { bg: "bg-orange-100", crown: "text-orange-400" }
                    : { bg: user.bgColor || "bg-orange-100", crown: user.crownColor || "text-orange-400" };
                  return (
                    <div className="relative flex flex-col items-center group rotate-3d-container">
                      <img src="/Ranking/medal.png" alt="Medal Ribbon" className="w-16" />
                      <div className="mt-[-8px] rotate-3d transition-transform duration-2000 relative w-64 h-64">
                        <div className={`${medal.bg} w-full h-full rounded-full shadow-md relative animate-bounceIn`}>
                          <div className="sparkle-overlay"></div>
                          <div className="relative z-20 flex flex-col items-center justify-center p-4">
                            <FaCrown className={`mb-2 text-3xl ${medal.crown}`} />
                            <h2 className="text-xl font-bold">{user.name}</h2>
                            <p className="text-sm">{user.grade}</p>
                            <p className="text-xs">이번달 VP🌱: {user.monthlyPoints}</p>
                            <p className="text-xs">누적 VP🌳: {user.totalPoints}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
                <div className="mt-2 font-bold text-lg">3위</div>
              </div>
            )}
          </div>

          {/* 모바일 Fallback (Top3) */}
          <div className="grid md:hidden grid-cols-1 gap-4 justify-items-center">
            {sortedUsers.slice(0, 3).map((user, index) => {
              let medalBg = "";
              let crownColor = "";
              let ribbonSize = "";
              let rankLabel = `${index + 1}위`;

              if (index === 0) {
                medalBg = user.bgColor || "bg-yellow-100";
                crownColor = user.crownColor || "text-yellow-400";
                ribbonSize = "w-20";
              } else if (index === 1) {
                medalBg = user.bgColor || "bg-gray-200";
                crownColor = user.crownColor || "text-gray-400";
                ribbonSize = "w-16";
              } else {
                medalBg = user.bgColor || "bg-orange-100";
                crownColor = user.crownColor || "text-orange-400";
                ribbonSize = "w-16";
              }

              return (
                <div key={user.name} className="relative flex flex-col items-center">
                  <img src="/Ranking/medal.png" alt="Medal Ribbon" className={`${ribbonSize}`} />
                  <div className="mt-[-8px]">
                    <div
                      className={`${medalBg} w-64 h-64 rounded-full shadow-md flex flex-col items-center justify-center p-4`}
                    >
                      <FaCrown className={`mb-2 text-3xl ${crownColor}`} />
                      <h2 className="text-xl font-bold">{user.name}</h2>
                      <p className="text-sm">{user.grade}</p>
                      <p className="text-xs">이번달 VP🌱: {user.monthlyPoints}</p>
                      <p className="text-xs">누적 VP🌳: {user.totalPoints}</p>
                    </div>
                  </div>
                  <div className="mt-2 font-bold text-sm">{rankLabel}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ------------------------------------
            2. 사용자 카드 섹션(±1등수) + 나의XP
            → 아이콘 노출 (현재유저만)
        --------------------------------------*/}
        {currentUser && (selectedApartment === currentUser.apartment || selectedApartment === "종합랭킹") && currentIndex !== -1 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            <Card className="p-0 overflow-hidden border border-gray-300 rounded-lg flex flex-col h-full bg-[#E8EFF4] shadow-lg">
              {userCards.map((user, idx) => {
                let rankDifference = '';
                if (user.name === currentUser.name) {
                  const percent = Math.round(((currentIndex + 1) / sortedUsers.length) * 100);
                  rankDifference = `상위 ${percent}%`;
                } else if (user.position === 'above') {
                  const difference = Math.abs(sortedUsers[currentIndex].monthlyPoints - user.monthlyPoints);
                  rankDifference = `${difference}🌱 차이!`;
                } else if (user.position === 'below') {
                  rankDifference = `${user.name}님이 맹 추격중!`;
                }

                return (
                  <UserCard
                    key={user.name}
                    name={user.name}
                    grade={user.grade}
                    xp={user.monthlyPoints}
                    message={`누적 VP🌳: ${user.totalPoints}`}
                    rank={`${sortedUsers.findIndex(u => u.name === user.name) + 1}위`}
                    rankDifference={rankDifference}
                    highlight={user.name === currentUser.name}
                    isFirst={idx === 0}
                    isLast={idx === (userCards.length - 1)}
                  />
                );
              })}
            </Card>

            <div className="flex flex-col gap-6">
              <EcoProgressBar totalXP={currentUser.totalPoints} grade={currentUser.grade} />
              {/* Rank_Tier_Guide로 이동하는 배너 */}
              <img
                src="/Ranking/Character_Card.png"
                alt="Character Card"
                className="mx-auto rounded-lg shadow-lg mt-4 cursor-pointer"
                onClick={() => navigate("/ranking/rank_tier_guide", { state: { scrollTo: 3 } })}
              />
            </div>
          </div>
        )}

        {/* ------------------------------------
            3. 랭킹보드 섹션 (페이징)
            → 아이콘 노출 (현재유저만 제외한 나머지 랜덤)
        --------------------------------------*/}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">🏆 {selectedApartment} 랭킹보드</h2>
          {sortedUsers.length > 0 ? (
            sortedUsers.slice((currentPage - 1) * 10, currentPage * 10).map((user, index) => {
              const actualIndex = (currentPage - 1) * 10 + index;

              const isCurrentUser = currentUser && user.name === currentUser.name;
              let userIcon = null;
              if (typeof window !== "undefined") {
                if (isCurrentUser) {
                  userIcon = localStorage.getItem("selectedIcon");
                } else {
                  userIcon = getRandomIconForUser(user.name);
                }
              }

              return (
                <Card key={user.name} className="flex items-center p-4 mb-2 shadow-lg bg-[#E8EFF4]">
                  <span className="text-xl font-bold w-12">{actualIndex + 1}위</span>

                  {/* 프로필 원 */}
                  <div className="w-16 h-16 bg-black rounded-full mx-4 overflow-hidden flex items-center justify-center">
                    {userIcon ? (
                      <img
                        src={userIcon}
                        alt={`${user.name}의 아이콘`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaUser size={28} className="text-white" />
                    )}
                  </div>

                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.grade}</p>
                    <div className="w-full bg-gray-200 h-4 rounded mt-2 mb-1">
                      <div
                        className="bg-green-400 h-4 rounded"
                        style={{ width: `${(user.monthlyPoints / 10000) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-gray-600 text-sm">
                      이번달 VP🌱: {user.monthlyPoints} / 10000
                    </p>
                    <p className="text-gray-600 text-sm">누적 VP🌳: {user.totalPoints}</p>
                  </div>
                </Card>
              );
            })
          ) : (
            <p className="text-center text-gray-500">랭킹 데이터가 없습니다.</p>
          )}

          {/* 페이징 버튼 */}
          <div className="flex justify-center mt-4">
            <Button onClick={handlePrevPage} disabled={currentPage === 1} className="mx-2 bg-black text-white">
              이전
            </Button>
            {[...Array(Math.ceil(sortedUsers.length / 10)).keys()].map(page => (
              <Button
                key={page + 1}
                onClick={() => setCurrentPage(page + 1)}
                className={
                  currentPage === page + 1
                    ? "bg-blue-400 text-white mx-1"
                    : "bg-white border border-black text-black mx-1"
                }
              >
                {page + 1}
              </Button>
            ))}
            <Button
              onClick={handleNextPage}
              disabled={currentPage >= Math.ceil(sortedUsers.length / 10)}
              className="mx-2 bg-black text-white"
            >
              다음
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}