import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FaCrown, FaUser } from "react-icons/fa"
import { Area, AreaChart, CartesianGrid, XAxis, Tooltip } from "recharts"
import { users } from "@/components/ranking/Ranking_user"

// 차트 데이터
const chartData = [
  { month: "5달전", 사용자: 100, 주민평균: 250 },
  { month: "4달전", 사용자: 400, 주민평균: 180 },
  { month: "3달전", 사용자: 150, 주민평균: 300 },
  { month: "2달전", 사용자: 500, 주민평균: 200 },
  { month: "1달전", 사용자: 350, 주민평균: 450 },
  { month: "이번달", 사용자: 200, 주민평균: 150 },
]

// UserCard Props 타입 정의
interface UserCardProps {
  name: string
  title: string
  xp: number
  message: string
  rank: string
  rankDifference: string
  highlight?: boolean
  isFirst?: boolean
  isLast?: boolean
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
  const borderClasses = `
    ${isFirst ? 'rounded-t-lg border-t border-l border-r' : ''}
    ${isLast ? 'rounded-b-lg border-b border-l border-r' : ''}
    ${!isFirst && !isLast ? 'border-l border-r' : ''}
    ${highlight ? 'bg-green-100' : 'bg-white'}
  `

  return (
    <div className={`p-4 flex flex-col justify-center flex-1 ${borderClasses}`}>
      <div className="flex items-center relative h-40"> {/* 카드 높이 고정 */}
        <div className="w-24 h-24 border-4 border-black rounded-full flex items-center justify-center mr-4 relative">
          <FaUser size={40} className="text-black" />
          {highlight && (
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-0.5 rounded-t-md">
              my
            </div>
          )}
        </div>

        <div className="flex-grow relative pr-20"> {/* 오른쪽 여백 유지 */}
          <h2 className="text-xl font-bold">{name}</h2>
          <p className="text-gray-600">{title}</p>
          
          {/* 게이지 바 크기 */}
          <div className="w-[120%] bg-gray-200 h-4 rounded mt-2 mb-1 relative">
            <div className="bg-green-400 h-4 rounded" style={{ width: `${(xp / 10000) * 100}%` }}></div>
            {/* 구분 바를 게이지바 끝에 붙이기 */}
            <div className="absolute top-0 right-0 h-full border-l-4 border-black"></div>
          </div>

          {/* 사용자 정보 표시 */}
          <p className="text-gray-600 text-sm">이번달 획득 Eco XP🌱: {xp} / 10000 EXP</p>
          <p className="text-gray-600 text-sm">{message}</p>
        </div>

        {/* 순위 및 메시지 가로폭 확장 */}
        <div className="flex flex-col justify-center items-center text-4xl font-bold text-black pl-4 w-44"> {/* w-44로 너비 확장 */}
          {rank}
          <p className="text-green-600 text-sm mt-1 text-center">{rankDifference}</p> {/* 텍스트 중앙 정렬 */}
        </div>
      </div>
    </div>
  )
}

// 등급표 컴포넌트
const EcoProgressBar = () => {
  const userPoints = 7000
  const levelUpPoints = 10000
  const progressPercentage = (userPoints / levelUpPoints) * 100
  const remainingPoints = levelUpPoints - userPoints

  return (
    <Card className="p-6 bg-white rounded-lg shadow-md relative w-full">
      <h2 className="text-xl font-bold mb-2">나의 등급</h2>
      <p className="text-sm text-gray-600 mb-4">🌍 지구 지키미</p>

      <div className="relative w-full h-6 bg-gray-300 rounded-full overflow-visible">
        <div className="h-full bg-green-500 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
        <div className="h-full bg-gray-200 absolute top-0 right-0 rounded-r-full" style={{ width: `${100 - progressPercentage}%` }}></div>

        {/* 말풍선 */}
        <div
          className="absolute -top-8 z-20"
          style={{ left: `${progressPercentage}%`, transform: 'translateX(-50%)' }}
        >
          <div className="bg-black text-white text-xs px-3 py-1 rounded-full shadow-md whitespace-nowrap flex items-center gap-1">
            💰 {remainingPoints} Eco XP 남음!
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black rotate-45"></div>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-4">
        <div className="text-left">
          <p className="text-sm text-gray-600">누적 Eco XP</p>
          <p className="text-lg font-bold text-green-600">{userPoints} XP</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">승급까지 필요 XP</p>
          <p className="text-lg font-bold text-gray-600">{levelUpPoints} XP</p>
        </div>
      </div>
    </Card>
  )
}

export function Ranking() {
  const [timeFrame, setTimeFrame] = useState("thismonth")
  const [currentPage, setCurrentPage] = useState(1)
  const usersPerPage = 10

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
  }

  const handleNextPage = () => {
    if (currentPage < 5) setCurrentPage(currentPage + 1)
  }

  const currentUsers = users.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage)

  const placeholderUsers = Array.from({ length: usersPerPage }, (_, index) => ({
    rank: (currentPage - 1) * usersPerPage + index + 1,
    name: "--",
    title: "--",
    avatar: "",
    monthlyPoints: 0,
    totalPoints: 0,
  }))

  const displayedUsers = currentUsers.length ? currentUsers : placeholderUsers

  const topContributors = users.slice(0, 3)

  return (
    <div className="container mx-auto p-6 bg-white">
      {/* 제목 및 드롭다운 필터 */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          대림 1동 분리수거 랭킹 <FaCrown className="text-yellow-500" />
        </h1>

        <div className="dropdown">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            id="dropdownMenuButton1"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style={{ minWidth: '150px' }}
          >
            {timeFrame === "thismonth" ? "공주 아파트" : timeFrame === "lastmonth" ? "왕자 아파트" : "종합 랭킹"}
          </button>
          <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
            <li><button className="dropdown-item" onClick={() => setTimeFrame("thismonth")}>공주 아파트</button></li>
            <li><button className="dropdown-item" onClick={() => setTimeFrame("lastmonth")}>왕자 아파트</button></li>
            <li><button className="dropdown-item" onClick={() => setTimeFrame("total")}>종합 랭킹</button></li>
          </ul>
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
              <p>이번달 획득 Eco XP🌱: {user.monthlyPoints}</p>
              <p>총 획득 Eco XP🌿: {user.totalPoints}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* 사용자 카드 및 차트 + 등급표 섹션 */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* 사용자 카드 섹션 */}
        <Card className="p-0 overflow-hidden border border-gray-300 rounded-lg flex flex-col h-full">
          {users.slice(1, 4).map((user) => {
            const currentUserName = '홍길동'  // 현재 사용자 설정
            const currentUser = users.find(u => u.name === currentUserName)
            const currentIndex = users.findIndex(u => u.name === currentUserName)
            const userIndex = users.findIndex(u => u.name === user.name)

            let rankDifference = ''

            if (user.name === currentUserName) {
              const percentage = ((currentIndex + 1) / users.length) * 100
              rankDifference = `상위 ${Math.round(percentage)}% 진입!`
            } else if (userIndex < currentIndex) {
              const xpDifference = user.monthlyPoints - (currentUser?.monthlyPoints || 0)
              rankDifference = `${xpDifference}🌱 차이!`
            } else if (userIndex > currentIndex) {
              rankDifference = `${user.name}님이 맹 추격중!`
            }

            return (
              <UserCard
                key={user.rank}
                name={user.name}
                title={user.title}
                xp={user.monthlyPoints}
                message={`총 획득 Eco XP🌿: ${user.totalPoints}`}
                rank={`${user.rank}위`}
                rankDifference={rankDifference}
                isFirst={userIndex === 0}
                highlight={user.name === currentUserName}
                isLast={userIndex === users.length - 1}
              />
            )
          })}
        </Card>

        <div className="flex flex-col gap-6">
          <EcoProgressBar />

          <Card className="p-6 h-[350px] flex justify-center items-center">
            <div>
              <h2 className="text-xl font-bold mb-4 text-center">월별 흭득 포인트</h2>
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
      </div>

      {/* 전체 사용자 순위 */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">랭킹보드</h2>
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
              <p className="text-gray-600 text-sm">이번달 획득 Eco XP🌱: {user.monthlyPoints} / 10000 EXP</p>
              <p className="text-gray-600 text-sm">총 획득 Eco XP🌿: {user.totalPoints}</p>
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
  )
}
