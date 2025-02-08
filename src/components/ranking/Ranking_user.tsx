// src/components/ranking/Ranking_user.tsx
import axios from 'axios'

// 📝 User 데이터 타입 정의
export interface User {
  rank: number
  name: string
  grade: string 
  monthlyPoints: number
  totalPoints: number
  bgColor?: string
  crownColor?: string
}

// 📝 차트 데이터 타입 정의
export interface ChartData {
  month: string
  사용자: number
  주민평균: number
}

// ✅ 더미 사용자 데이터 (API 연동 전 사용)
export const users: User[] = [
  { rank: 1, name: "이지훈", grade: "🌟에코 히어로", bgColor: "bg-yellow-100", crownColor: "text-yellow-400", monthlyPoints: 7500, totalPoints: 12000 },
  { rank: 2, name: "김민준", grade: "🌍지구 지키미", bgColor: "bg-gray-200", crownColor: "text-gray-400", monthlyPoints: 1400, totalPoints: 8000 },
  { rank: 3, name: "김제니", grade: "🗑 분리배출 견습생", bgColor: "bg-orange-100", crownColor: "text-orange-400", monthlyPoints: 1200, totalPoints: 2300 },
  { rank: 4, name: "박하빈", grade: "🌍지구 지키미", monthlyPoints: 900, totalPoints: 7000 },
  { rank: 5, name: "최시우", grade: "🌿지구 친구", monthlyPoints: 850, totalPoints: 5100 },
  { rank: 6, name: "안도윤", grade: "🌿지구 친구", monthlyPoints: 800, totalPoints: 4500 },
  { rank: 7, name: "정하은", grade: "🌍지구 지키미", monthlyPoints: 750, totalPoints: 6600 },
  { rank: 8, name: "김채원", grade: "🌍지구 지키미", monthlyPoints: 700, totalPoints: 6500 },
  { rank: 9, name: "박민서", grade: "🌿지구 친구", monthlyPoints: 650, totalPoints: 3200 },
  { rank: 10, name: "이예은", grade: "💀환경 테러범", monthlyPoints: 600, totalPoints: 950 }
]

// ✅ 더미 차트 데이터 (변경 없음)
export const chartData: ChartData[] = [
  { month: "5달전", 사용자: 100, 주민평균: 250 },
  { month: "4달전", 사용자: 400, 주민평균: 180 },
  { month: "3달전", 사용자: 150, 주민평균: 300 },
  { month: "2달전", 사용자: 500, 주민평균: 200 },
  { month: "1달전", 사용자: 350, 주민평균: 450 },
  { month: "이번달", 사용자: 200, 주민평균: 150 }
]

// ✅ 사용자 데이터 가져오기 함수
export const fetchUsers = async (): Promise<User[]> => {
  try {
    return users // 더미 데이터 반환
  } catch (error) {
    console.error("Error fetching users:", error)
    return users
  }
}

// ✅ 차트 데이터 가져오기 함수
export const fetchChartData = async (): Promise<ChartData[]> => {
  try {
    return chartData // 더미 데이터 반환
  } catch (error) {
    console.error("Error fetching chart data:", error)
    return chartData
  }
}
