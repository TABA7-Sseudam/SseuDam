import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import BackgroundAnimation from '@/components/layout/BackgroudAnimation'

const images = [
  '/Ranking/1.png',
  '/Ranking/2.png',
  '/Ranking/3.png',
  '/Ranking/3.5.2.png',
  '/Ranking/4.jpg',
  '/Ranking/5.jpg',
  '/Ranking/6.jpg',
  '/Ranking/7.jpg',
  '/Ranking/8.jpg'
]

export default function RankTierGuide() {
  const navigate = useNavigate()
  const location = useLocation()

  const scrollToSection = (index: number) => {
    const section = document.getElementById(`section-${index}`)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    }
  }

  useEffect(() => {
    if (location.state && typeof location.state.scrollTo === 'number') {
      // 300ms 딜레이 후에 스크롤 처리
      setTimeout(() => {
        scrollToSection(location.state.scrollTo)
      }, 300)
    }
  }, [location])

  return (
    /**
     * 1) 최상단 컨테이너에 relative + pt-16 (네비바 높이만큼)  
     *    그리고 가로/세로 전체 크기 확보 (w-full, min-h-screen)
     */
    <div className="relative w-full min-h-screen pt-16">
      {/* 2) BackgroundAnimation을 절대 위치 + z-0 (또는 z-[-1])로 뒤로 보냄 */}
      <div className="absolute inset-0 z-0">
        <BackgroundAnimation />
      </div>

      {/*
        3) 나머지 컨텐츠를 relative z-10으로 해서
           배경보다 앞쪽에 나타나도록
      */}
      <div className="relative z-10">
        {/* 뒤로가기 버튼 */}
        <div className="px-4 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-white text-black border border-gray-300 shadow-md 
                       hover:bg-gray-300 active:bg-gray-500 px-4 py-2 
                       rounded transition-colors"
          >
            ← 뒤로 가기
          </button>
        </div>

        {/* 이미지 섹션 */}
        <div className="w-full flex flex-col items-center space-y-12 py-8">
          {images.map((src, index) => (
            <motion.div
              key={index}
              id={`section-${index}`}
              className="w-full flex justify-center"
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <img
                src={src}
                alt={`Ranking Image ${index + 1}`}
                className="w-full max-w-5xl h-auto object-contain"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
