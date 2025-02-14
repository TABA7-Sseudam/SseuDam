import { useState } from "react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

const cardData = [
  { date: "2월 13일", success: "90%", material: "플라스틱" },
  { date: "최근", success: "80%", material: "종이" },
  { date: "2월 15일", success: "70%", material: "유리" },
]

export function RecyclingStats() {
  const [current, setCurrent] = useState(0)

  const nextCard = () => setCurrent((prev) => (prev + 1) % cardData.length)
  const prevCard = () => setCurrent((prev) => (prev - 1 + cardData.length) % cardData.length)
  const getIndex = (index: number) => (index + cardData.length) % cardData.length

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-8 relative">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">♻️ 분리배출 기록</h1>

      {/* 버튼: 카드 섹션 바깥 중앙 1/3 위치 */}
      <Button 
        onClick={prevCard} 
        className="absolute left-[calc(34%-480px)] top-1/2 transform -translate-x-full -translate-y-1/2 bg-gray-700 text-white px-4 py-2 rounded-full hover:bg-black transition">
        ←
      </Button>
      <Button 
        onClick={nextCard} 
        className="absolute right-[calc(34%-480px)] top-1/2 transform translate-x-full -translate-y-1/2 bg-gray-700 text-white px-4 py-2 rounded-full hover:bg-black transition">
        →
      </Button>

      {/* 카드 섹션 1/3 위치로 올림 */}
      <div className="relative w-[1200px] h-[1200px] top-1/2 flex items-center justify-center overflow-hidden h-auto">
        <AnimatePresence mode="wait">
          {/* 왼쪽 미리보기 */}
          <motion.div
            key={`prev-${getIndex(current - 1)}`}
            initial={{ scale: 0.8, x: "-150%" }}
            animate={{ scale: 0.9, x: "-120%" }}
            exit={{ scale: 0.8, x: "-150%" }}
            transition={{ duration: 0.5 }}
            className="absolute bg-gray-100 shadow-md rounded-lg p-4 w-[400px] h-[300px] border opacity-70"
          >
            <h2 className="text-2xl font-semibold text-gray-500">{cardData[getIndex(current - 1)].date} 기록</h2>
          </motion.div>

          {/* 메인 카드 */}
          <motion.div
            key={`current-${current}`}
            initial={{ scale: 0.8, x: 0 }}
            animate={{ scale: 1, x: 0 }}
            exit={{ scale: 0.8, x: "-100%" }}
            transition={{ duration: 0.6 }}
            className="z-10 bg-white shadow-xl rounded-xl p-8 border w-[700px] h-[500px]"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{cardData[current].date} 분리배출 기록</h2>
            <p className="text-gray-500 mb-6 text-lg">성공률 차트 및 배출 횟수</p>
            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-2">분리배출 성공률</h3>
              <p className="text-4xl font-bold text-green-600 mb-4">{cardData[current].success}</p>
              <p className="text-md text-gray-500">가장 잘 분리배출한 재질: {cardData[current].material}</p>
            </div>
          </motion.div>

          {/* 오른쪽 미리보기 */}
          <motion.div
            key={`next-${getIndex(current + 1)}`}
            initial={{ scale: 0.8, x: "150%" }}
            animate={{ scale: 0.9, x: "120%" }}
            exit={{ scale: 0.8, x: "150%" }}
            transition={{ duration: 0.5 }}
            className="absolute bg-gray-100 shadow-md rounded-lg p-4 w-[400px] h-[300px] border opacity-70"
          >
            <h2 className="text-2xl font-semibold text-gray-500">{cardData[getIndex(current + 1)].date} 기록</h2>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
