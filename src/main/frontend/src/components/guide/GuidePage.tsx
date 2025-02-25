import { useState, useRef, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/guide/Modal"
import BackgroundAnimation from "@/components/layout/BackgroudAnimation"
import { motion } from "framer-motion"

const ScrollIndicator = () => {
  return (
    <div className="absolute left-[41%] top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 animate-bounce">
      <span className="text-black text-lg font-medium drop-shadow-lg">
        스크롤을 내려주세요
      </span>
      <svg 
        className="w-6 h-6 text-black drop-shadow-lg" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M19 14l-7 7m0 0l-7-7m7 7V3"
        />
      </svg>
    </div>
  );
};

export function GuidePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const guideRef = useRef<HTMLDivElement>(null)
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 1~10.jpg 이미지 리스트로 변경
  const guideImages = Array.from({ length: 9 }, (_, i) => `/Guide/${i + 1}.jpg`)

  // 재질별 분리배출 관련 이미지 & 아이콘
  const materialImages: Record<string, string> = {
    유리: '/images/glass.png',
    플라스틱: '/images/plastic.png',
    종이: '/images/paper.png',
    비닐: '/images/vinyl.png',
    금속: '/images/metal.png',
    스티로폼: '/images/styrofoam.png',
  }

  const materialIcons: Record<string, string> = {
    유리: '/icons/glass.png',
    플라스틱: '/icons/plastic.png',
    종이: '/icons/paper.png',
    비닐: '/icons/vinyl.png',
    금속: '/icons/metal.png',
    스티로폼: '/icons/styrofoam.png',
  }

  useEffect(() => {
    if (location.state && typeof location.state.scrollTo === "number") {
      setTimeout(() => {
        guideRef.current?.scrollIntoView({ behavior: "smooth" })
      }, 300)
    }
  }, [location])

  const openModal = (material: string) => {
    setSelectedMaterial(material)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedMaterial(null)
  }

  return (
    <div className="relative min-h-screen w-full">
      {/* 배경 애니메이션 */}
      <BackgroundAnimation />

      {/* 가이드 이미지 섹션 */}
      <div className="relative w-full flex flex-col items-center">
        {guideImages.map((src, index) => (
          <motion.div
            key={index}
            className="w-full flex justify-center items-center"
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: (index === 1 || index === 8 || index === 9) ? 0.05 : 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* 이미지와 버튼을 함께 감싸는 컨테이너 */}
            <div className="relative inline-block">
              <img
                src={src}
                alt={`가이드 이미지 ${index + 1}`}
                className="w-full max-w-5xl h-auto object-contain"
              />

              {/* 🏠 뒤로가기 버튼 - 첫 번째 이미지 내부 좌측 상단 */}
              {index === 0 && (
                <button
                  onClick={() => navigate(-1)}
                  className="absolute top-6 left-6 bg-white/80 text-black px-4 py-2 
                             rounded-md backdrop-blur-md hover:bg-white transition-colors
                             border border-gray-300"
                >
                  ← 뒤로 가기
                </button>
              )}

              {/* 📌 재질별 분리배출 가이드 버튼 - 첫 번째 이미지 내부 우측 하단 */}
              {index === 0 && (
                <button
                  className="absolute bottom-6 right-6 bg-blue-500 text-white px-6 py-3 rounded-xl 
                             hover:bg-blue-600 transition-colors backdrop-blur-md"
                  onClick={() => guideRef.current?.scrollIntoView({ behavior: "smooth" })}
                >
                  재질별 분리배출 가이드
                </button>
              )}

              {/* 스크롤 인디케이터 - 첫 번째 이미지에만 표시 */}
              {index === 0 && <ScrollIndicator />}
              
              {index === guideImages.length - 1 && (
                <button
                  className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-green-500 
                            text-white px-8 py-4 rounded-xl hover:bg-green-600 
                            transition-colors text-lg font-medium backdrop-blur-md"
                            onClick={() => {
                              navigate("/waste-analysis");
                              setTimeout(() => {
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }, 100); // 페이지 전환 후 실행되도록 약간의 딜레이 추가
                            }}
                            
                >
                  시작하기
                </button>
)}
            </div>
          </motion.div>
        ))}
      </div>

      {/* 분리배출 가이드 섹션 */}
      <section ref={guideRef} className="relative w-full flex justify-center items-center pt-0 mt-0">
        <motion.div
          className="w-full max-w-5xl p-8 bg-white rounded-lg"
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-3xl font-bold mb-8 text-center">재질별 분리배출 가이드💡</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.keys(materialImages).map((material) => (
              <Card
                key={material}
                className="p-6 flex flex-col items-center justify-center text-center 
                           space-y-4 bg-white hover:scale-105 transition-transform"
              >
                <img
                  src={materialIcons[material]}
                  alt={`${material} 아이콘`}
                  className="w-12 h-12"
                />
                <h3 className="text-lg font-semibold">{material}</h3>
                <Button variant="outline" className="mt-2" onClick={() => openModal(material)}>
                  가이드 보기
                </Button>
              </Card>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 모달 (재질별 분리배출 가이드) */}
      {isModalOpen && selectedMaterial && (
        <Modal onClose={closeModal} title={`${selectedMaterial} 분리배출 가이드`}>
          <img
            src={materialImages[selectedMaterial] || "/images/default.png"}
            alt={`${selectedMaterial} 분리배출`}
            className="w-full h-auto object-cover mb-4 rounded-lg"
          />
          <p className="text-gray-600 mb-4">
            {selectedMaterial}에 대한 올바른 분리배출 방법을 확인하세요.
          </p>
        </Modal>
      )}
    </div>
  )
}