// src/components/ranking/Ranking_user.tsx
// import axios from 'axios' 

// 📝 User 데이터 타입 정의
export interface User {
  rank: number
  name: string
  grade: string 
  monthlyPoints: number
  totalPoints: number
  apartment: string // 아파트 필드 추가
  bgColor?: string
  crownColor?: string
}

// 📝 차트 데이터 타입 정의
export interface ChartData {
  month: string
  사용자: number
  주민평균: number
}

// ✅ 공주아파트 유저 데이터
const gongjuUsers: User[] = [
  { rank: 1, name: "초록콩", grade: "🌟에코 히어로", apartment: "공주아파트", bgColor: "bg-yellow-100", crownColor: "text-yellow-400", monthlyPoints: 1500, totalPoints: 12000 },
  { rank: 2, name: "햇살둥이", grade: "🌍지구 지키미", apartment: "공주아파트", bgColor: "bg-gray-200", crownColor: "text-gray-400", monthlyPoints: 1400, totalPoints: 8000 },
  { rank: 3, name: "김제니", grade: "🗑 분리배출 견습생", apartment: "공주아파트", bgColor: "bg-orange-100", crownColor: "text-orange-400", monthlyPoints: 1200, totalPoints: 2300 },
  { rank: 4, name: "지구사랑", grade: "🌍지구 지키미", apartment: "공주아파트", monthlyPoints: 900, totalPoints: 7000 },
  { rank: 5, name: "작은숲", grade: "🌿지구 친구", apartment: "공주아파트", monthlyPoints: 850, totalPoints: 5100 },
  { rank: 6, name: "반짝별", grade: "🌿지구 친구", apartment: "공주아파트", monthlyPoints: 800, totalPoints: 4500 },
  { rank: 7, name: "푸른바다", grade: "🌍지구 지키미", apartment: "공주아파트", monthlyPoints: 750, totalPoints: 6600 },
  { rank: 8, name: "하늘콩", grade: "🌍지구 지키미", apartment: "공주아파트", monthlyPoints: 700, totalPoints: 6500 },
  { rank: 9, name: "초코칩", grade: "🌿지구 친구", apartment: "공주아파트", monthlyPoints: 650, totalPoints: 3200 },
  { rank: 10, name: "쓰레기맨", grade: "💀환경 테러범", apartment: "공주아파트", monthlyPoints: 600, totalPoints: 950 },
  { rank: 11, name: "바나나킥", grade: "💀환경 테러범", apartment: "공주아파트", monthlyPoints: 400, totalPoints: 970 }
]

// ✅ 왕자아파트 유저 데이터
const princeUsers: User[] = [
  { rank: 1, name: "펭귄대장", grade: "🌟에코 히어로", apartment: "왕자아파트", bgColor: "bg-yellow-100", crownColor: "text-yellow-400", monthlyPoints: 1600, totalPoints: 12500 },
  { rank: 2, name: "햇살미소", grade: "🌍지구 지키미", apartment: "왕자아파트", bgColor: "bg-gray-200", crownColor: "text-gray-400", monthlyPoints: 1350, totalPoints: 8500 },
  { rank: 3, name: "분리짱짱", grade: "🗑 분리배출 견습생", apartment: "왕자아파트", bgColor: "bg-orange-100", crownColor: "text-orange-400", monthlyPoints: 1100, totalPoints: 3100 },
  { rank: 4, name: "지구뿌셔", grade: "🌍지구 지키미", apartment: "왕자아파트", monthlyPoints: 950, totalPoints: 7100 },
  { rank: 5, name: "코끼리콩콩", grade: "🌿지구 친구", apartment: "왕자아파트", monthlyPoints: 870, totalPoints: 5200 },
  { rank: 6, name: "다람쥐짱", grade: "🌿지구 친구", apartment: "왕자아파트", monthlyPoints: 820, totalPoints: 4600 },
  { rank: 7, name: "푸른별빛", grade: "🌍지구 지키미", apartment: "왕자아파트", monthlyPoints: 770, totalPoints: 6700 },
  { rank: 8, name: "하늘토끼", grade: "🌍지구 지키미", apartment: "왕자아파트", monthlyPoints: 720, totalPoints: 6600 },
  { rank: 9, name: "초코볼", grade: "🌿지구 친구", apartment: "왕자아파트", monthlyPoints: 670, totalPoints: 3300 },
  { rank: 10, name: "지구파괴", grade: "💀환경 테러범", apartment: "왕자아파트", monthlyPoints: 620, totalPoints: 980 },
  { rank: 11, name: "쓰레기요정", grade: "💀환경 테러범", apartment: "왕자아파트", monthlyPoints: 300, totalPoints: 900 }
]


// ✅ 모든 유저 데이터 통합 (종합랭킹용)
export const allUsers = [...gongjuUsers, ...princeUsers]

// ✅ 더미 차트 데이터 (API 연동 전 사용)
export const chartData: ChartData[] = [
  { month: "5달전", 사용자: 100, 주민평균: 250 },
  { month: "4달전", 사용자: 400, 주민평균: 180 },
  { month: "3달전", 사용자: 150, 주민평균: 300 },
  { month: "2달전", 사용자: 500, 주민평균: 200 },
  { month: "1달전", 사용자: 350, 주민평균: 450 },
  { month: "이번달", 사용자: 200, 주민평균: 150 }
]

// ✅ 사용자 데이터 가져오기 함수 (추후 API 연동을 위한 구조)
export const fetchUsers = async (): Promise<User[]> => {
  try {
    return allUsers // 현재는 더미 데이터 반환
  } catch (error) {
    console.error("Error fetching users:", error)
    return allUsers
  }
}

// ✅ 차트 데이터 가져오기 함수 (추후 API 연동을 위한 구조)
export const fetchChartData = async (): Promise<ChartData[]> => {
  try {
    return chartData // 현재는 더미 데이터 반환
  } catch (error) {
    console.error("Error fetching chart data:", error)
    return chartData
  }
}

console.log("allUsers length:", allUsers.length);