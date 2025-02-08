// src/components/ranking/Ranking.tsx
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FaCrown, FaUser } from "react-icons/fa"
import { Area, AreaChart, CartesianGrid, XAxis, Tooltip } from "recharts"
import { fetchUsers, fetchChartData, User, ChartData } from "@/components/ranking/Ranking_user"
import 'bootstrap-icons/font/bootstrap-icons.css'
import Dropdown from 'react-bootstrap/Dropdown'

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
  name: string
  grade: string
  xp: number
  message: string
  rank: string
  rankDifference: string
  highlight?: boolean
  isFirst?: boolean
  isLast?: boolean
}) => {
  const borderClasses = `
    ${isFirst ? 'rounded-t-lg border-t border-l border-r' : ''}
    ${isLast ? 'rounded-b-lg border-b border-l border-r' : ''}
    ${!isFirst && !isLast ? 'border-l border-r' : ''}
    ${highlight ? 'bg-green-100' : 'bg-white'}
  `

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
          <p className="text-gray-600 text-sm">이번달 획득 Eco XP🌱: {xp} / 10000 EXP</p>
          <p className="text-gray-600 text-sm">{message}</p>
        </div>
        <div className="flex flex-col justify-center items-center text-4xl font-bold text-black pl-4 w-44">
          {rank}
          <p className="text-green-600 text-sm mt-1 text-center">{rankDifference}</p>
        </div>
      </div>
    </div>
  )
}

// 📝 등급표 컴포넌트
const EcoProgressBar = ({ totalXP, grade }: { totalXP: number, grade: string }) => {
  const levelUpPoints = 10000
  const progressPercentage = (totalXP / levelUpPoints) * 100
  const remainingPoints = levelUpPoints - totalXP

  return (
    <Card className="p-6 bg-white rounded-lg shadow-md relative w-full">
      <h2 className="text-xl font-bold mb-2">
        나의 등급: <span className="font-normal">{grade}</span>
      </h2>
      <br />
      <div className="mt-4 relative w-full h-6 bg-gray-300 rounded-full overflow-visible">
        <div className="h-full bg-green-500 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
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
          <p className="text-lg font-bold text-green-600">{totalXP} XP</p>
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
  const [users, setUsers] = useState<User[]>([])
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const navigate = useNavigate()

  useEffect(() => {
    const loadData = async () => {
      const userData = await fetchUsers()
      const chartInfo = await fetchChartData()
      setUsers(userData)
      setChartData(chartInfo)
    }
    loadData()
  }, [])

  const currentUserName = '김제니' // 현재 사용자 설정
  const currentUser = users.find(u => u.name === currentUserName)
  const currentIndex = users.findIndex(u => u.name === currentUserName)

  const usersPerPage = 10
  const currentUsers = users.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage)

  // 상위 3명 정렬
  const topContributors = [...users].sort((a, b) => b.monthlyPoints - a.monthlyPoints).slice(0, 3)

  const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1) }
  const handleNextPage = () => { if (currentPage < Math.ceil(users.length / usersPerPage)) setCurrentPage(currentPage + 1) }

  return (
    <div className="container mx-auto p-6 bg-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          🏅대림 1동 분리수거 랭킹
          <button
            type="button"
            className="btn btn-link p-0 ml-2 text-primary"
            onClick={() => navigate("/ranking/rank_tier_guide")}
            data-bs-toggle="tooltip"
            title="랭킹 & 등급 알아보기"
          >
            <i className="bi bi-question-circle-fill fs-2"></i>
          </button>
        </h1>

        <Dropdown>
          <Dropdown.Toggle variant="secondary" id="dropdown-basic" style={{ minWidth: '150px' }}>
            공주 아파트
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>공주 아파트</Dropdown.Item>
            <Dropdown.Item>왕자 아파트</Dropdown.Item>
            <Dropdown.Item>종합 랭킹</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {/* 상위 3명 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {topContributors.map((user, index) => (
          <Card key={index} className={`p-6 text-center shadow-md ${user.bgColor}`}>
            <div className="flex justify-center mb-4 relative">
              <div className="w-24 h-24 bg-black rounded-full relative">
                <FaCrown className={`absolute -top-4 left-4 text-3xl transform rotate-[-25deg] ${user.crownColor}`} />
              </div>
            </div>
            <h2 className="text-xl font-bold mb-1">{user.name}</h2>
            <Button variant="secondary" className="mb-4 bg-green-100 text-green-800">{user.grade}</Button>
            <p>이번달 획득 Eco XP🌱: {user.monthlyPoints}</p>
            <p>총 획득 Eco XP🌿: {user.totalPoints}</p>
          </Card>
        ))}
      </div>

      {/* 사용자 순위 카드 */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        <Card className="p-0 overflow-hidden border border-gray-300 rounded-lg flex flex-col h-full">
          {users.slice(1, 4).map(user => {
            const userIndex = users.findIndex(u => u.name === user.name)
            let rankDifference = ''

            if (user.name === currentUserName) {
              rankDifference = `상위 ${Math.round(((currentIndex + 1) / users.length) * 100)}% 진입!`
            } else if (userIndex < currentIndex) {
              rankDifference = `${user.monthlyPoints - (currentUser?.monthlyPoints || 0)}🌱 차이!`
            } else if (userIndex > currentIndex) {
              rankDifference = `${user.name}님이 맹 추격중!`
            }

            return (
              <UserCard
                key={user.rank}
                name={user.name}
                grade={user.grade}
                xp={user.monthlyPoints}
                message={`총 획득 Eco XP🌿: ${user.totalPoints}`}
                rank={`${user.rank}위`}
                rankDifference={rankDifference}
                highlight={user.name === currentUserName}
              />
            )
          })}
        </Card>

        {/* 나의 등급 및 차트 */}
        <div className="flex flex-col gap-6">
          {currentUser && (
            <EcoProgressBar totalXP={currentUser.totalPoints} grade={currentUser.grade} />
          )}
          <Card className="p-6 h-[350px] flex justify-center items-center">
            <div>
              <h2 className="text-xl font-bold mb-4 text-center">월별 획득 포인트</h2>
              <AreaChart width={550} height={250} data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" />
                <Tooltip />
                <Area dataKey="주민평균" type="monotone" fill="rgba(34, 202, 236, 0.4)" stroke="rgb(34, 202, 236)" />
                <Area dataKey="사용자" type="monotone" fill="rgba(255, 99, 132, 0.4)" stroke="rgb(255, 99, 132)" />
              </AreaChart>
            </div>
          </Card>
        </div>
      </div>

      {/* 🏆 랭킹보드 섹션 */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">🏆 랭킹보드</h2>
        {currentUsers.map(user => (
          <Card key={user.rank} className="flex items-center p-4 mb-2 shadow-sm">
            <span className="text-xl font-bold w-12">{user.rank}위</span>
            <div className="w-16 h-16 bg-black rounded-full mx-4"></div>
            <div className="flex-grow">
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <p className="text-sm text-gray-600">{user.grade}</p>
              <div className="w-full bg-gray-200 h-4 rounded mt-2 mb-1">
                <div className="bg-green-400 h-4 rounded" style={{ width: `${(user.monthlyPoints / 10000) * 100}%` }}></div>
              </div>
              <p className="text-gray-600 text-sm">이번달 획득 Eco XP🌱: {user.monthlyPoints} / 10000 EXP</p>
              <p className="text-gray-600 text-sm">총 획득 Eco XP🌿: {user.totalPoints}</p>
            </div>
          </Card>
        ))}

        {/* 페이지네이션 */}
        <div className="flex justify-center mt-4">
          <Button onClick={handlePrevPage} disabled={currentPage === 1} className="mx-2 bg-black text-white">이전</Button>
          {[...Array(Math.ceil(users.length / usersPerPage)).keys()].map(page => (
            <Button
              key={page + 1}
              onClick={() => setCurrentPage(page + 1)}
              className={currentPage === (page + 1) ? "bg-black text-white mx-1" : "bg-white border border-black text-black mx-1"}
            >
              {page + 1}
            </Button>
          ))}
          <Button onClick={handleNextPage} disabled={currentPage >= Math.ceil(users.length / usersPerPage)} className="mx-2 bg-black text-white">다음</Button>
        </div>
      </div>
    </div>
  )
}
