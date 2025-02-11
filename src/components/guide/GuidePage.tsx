import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/guide/Modal"  // Modal.tsx로 경로 통일

export function GuidePage() {
  const navigate = useNavigate()

  // 모달 상태 관리
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const materials = ["유리", "플라스틱", "종이", "비닐", "금속", "스티로폼"]

  // 재질별 이미지 경로 설정
  const materialImages: { [key: string]: string } = {
    유리: '/images/glass.png',
    플라스틱: '/images/plastic.png',
    종이: '/images/paper.png',
    비닐: '/images/vinyl.png',
    금속: '/images/metal.png',
    스티로폼: '/images/styroform.png',
  }

  // 아이콘 이미지 경로 설정
  const materialIcons: { [key: string]: string } = {
    유리: '/icons/glass.png',
    플라스틱: '/icons/plastic.png',
    종이: '/icons/paper.png',
    비닐: '/icons/vinyl.png',
    금속: '/icons/metal.png',
    스티로폼: '/icons/styrofoam.png',
  }

  // 잘못된 분리배출 사례 이미지
  const wasteImages = [
    '/incorrect/waste1.jpg',
    '/incorrect/waste2.jpg',
    '/incorrect/waste3.jpg',
    '/incorrect/waste4.jpg',
    '/incorrect/waste5.jpg',
  ]

  // 모달 열기 함수
  const openModal = (material: string) => {
    setSelectedMaterial(material)
    setIsModalOpen(true)
  }

  // 모달 닫기 함수
  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedMaterial(null)
  }

  return (
    <div className="min-h-screen bg-white px-4 py-8">
      {/* 뒤로 가기 버튼 */}
      <div className="mb-4">
        <Button variant="outline" onClick={() => navigate(-1)}>← 뒤로 가기</Button>
      </div>

      {/* 가이드 내용 박스 */}
      <div className="border p-4 rounded-lg bg-white mb-20">
        <h1 className="text-4xl font-bold text-center mb-6">✨👀 쉽고 편리한 분리배출 가이드 👀✨</h1>
        <p className="text-center text-gray-600 mb-6">환경 보호의 첫 걸음, 올바른 분리배출부터 시작해요! ♻️🌏</p>

        {/* 분리배출 시작 */}
        <section className="bg-gray-50 p-6 rounded-lg mb-6">
          <h2 className="text-2xl font-bold text-green-700 mb-4">1. 분리배출 시작</h2>
          <p className="text-gray-600 mb-2">✅ 생활 속 “배출 시작” 버튼을 눌러주세요!</p>
          <p className="text-gray-600 mb-2">✅ 스마트 AI가 자동으로 감지하여 분리배출을 도와드립니다.</p>
          <p className="text-gray-600">✅ 교체가 필요한 경우 자동으로 알려드려요.</p>
        </section>

        {/* 실시간 분석 */}
        <section className="bg-gray-50 p-6 rounded-lg mb-6">
          <h2 className="text-2xl font-bold text-green-700 mb-4">2. 실시간 분석</h2>
          <p className="text-gray-600 mb-2">🔍 분리배출 후, AI가 실시간 분석!</p>
          <p className="text-gray-600 mb-2">✅ 어떤 재질인지 확인 (플라스틱, 캔, 종이 등)</p>
          <p className="text-gray-600">✅ 오염 여부 파악 (음식물 포함 여부, 라벨 부착 등)</p>
        </section>

        {/* 즉시 피드백 제공 */}
        <section className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-green-700 mb-4">3. 즉시 피드백 제공</h2>
          <p className="text-gray-600 mb-2">✅ 결과에 따라 분리배출 방법을 안내합니다.</p>
          <p className="text-gray-600">🔵 파란불 : 성공! 포인트 적립 🎉</p>
          <p className="text-gray-600">🔴 빨간불 : 잘못된 배출! 즉시 수정 요청</p>
          <p className="text-gray-600">🟡 주의 : 개선 가능! 추가 정리 필요</p>
        </section>
      </div>

      {/* 재질별 분리배출 가이드 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">재질별 분리배출 가이드💡</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {materials.map((material) => (
            <Card key={material} className="p-6 flex flex-col items-center justify-center text-center space-y-4">
              <img 
                src={materialIcons[material]} 
                alt={`${material} 아이콘`} 
                className="w-12 h-12"
              />
              <div>
                <h3 className="text-lg font-semibold">{material}</h3>
                <Button variant="outline" className="mt-2" onClick={() => openModal(material)}>
                  가이드 보기
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ✅ Bootstrap 캐러셀 슬라이더 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-center">잘못된 분리배출 사례 비교❌</h2>

        <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel" data-bs-interval="3000">
          <div className="carousel-inner">
            {wasteImages.map((image, index) => (
              <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                <img 
                  src={image} 
                  className="d-block mx-auto rounded-lg" 
                  alt={`잘못된 분리배출 사례 ${index + 1}`}
                  style={{ 
                    width: '100vh', 
                    height: '70vh', 
                    objectFit: 'cover', 
                    borderRadius: '12px' 
                  }}
                />
              </div>
            ))}
          </div>

         {/* 이전 버튼 */}
<button
  className="carousel-control-prev custom-arrow"
  type="button"
  data-bs-target="#carouselExampleIndicators"
  data-bs-slide="prev"
>
  <svg className="w-8 h-8 text-black hover:text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
  <span className="visually-hidden">Previous</span>
</button>

{/* 다음 버튼 */}
<button
  className="carousel-control-next custom-arrow"
  type="button"
  data-bs-target="#carouselExampleIndicators"
  data-bs-slide="next"
>
  <svg className="w-8 h-8 text-black hover:text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
  <span className="visually-hidden">Next</span>
</button>


        </div>
      </section>

      {/* 모달 컴포넌트 */}
      {isModalOpen && selectedMaterial && (
        <Modal onClose={closeModal} title={`${selectedMaterial} 분리배출 가이드`}>
          <img 
            src={materialImages[selectedMaterial]} 
            alt={`${selectedMaterial} 분리배출`} 
            className="w-full h-auto object-cover mb-4 rounded-lg"
            onError={(e) => {
              console.error(`이미지를 불러오는 데 실패했습니다: ${materialImages[selectedMaterial]}`);
              (e.target as HTMLImageElement).src = '/images/default.png';
            }}
          />
          <p className="text-gray-600 mb-4">{selectedMaterial}에 대한 올바른 분리배출 방법을 확인하세요.</p>
        </Modal>
      )}
    </div>
  )
}
