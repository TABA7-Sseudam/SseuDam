import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/guide/Modal";  // Modal.tsx로 경로 통일

export function GuidePage() {
  const navigate = useNavigate();

  // 모달 상태 관리 (타입 명시 추가)
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const materials = ["유리", "플라스틱", "종이", "비닐", "금속", "스티로폼"];

  // 재질별 이미지 경로 설정
  const materialImages: { [key: string]: string } = {
    유리: '/images/유리.png',
    플라스틱: '/images/플라스틱.png',
    종이: '/images/종이.png',
    비닐: '/images/비닐.png',
    금속: '/images/금속.png',
    스티로폼: '/images/스티로폼.png',
  };

  // **아이콘 이미지 경로 설정**
  const materialIcons: { [key: string]: string } = {
    유리: '/icons/glass.png',
    플라스틱: '/icons/plastic.png',
    종이: '/icons/paper.png',
    비닐: '/icons/vinyl.png',
    금속: '/icons/metal.png',
    스티로폼: '/icons/styrofoam.png',
  };

  // 모달 열기 함수 (material 타입 명시)
  const openModal = (material: string) => {
    setSelectedMaterial(material);
    setIsModalOpen(true);
  };

  // 모달 닫기 함수
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMaterial(null);
  };

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

        {/* 1. 분리배출 시작 */}
        <section className="bg-gray-50 p-6 rounded-lg mb-6">
          <h2 className="text-2xl font-bold text-green-700 mb-4">1. 분리배출 시작</h2>
          <p className="text-gray-600 mb-2">✅ 생활 속 “배출 시작” 버튼을 눌러주세요!</p>
          <p className="text-gray-600 mb-2">✅ 스마트 AI가 자동으로 감지하여 분리배출을 도와드립니다.</p>
          <p className="text-gray-600">✅ 교체가 필요한 경우 자동으로 알려드려요.</p>
        </section>

        {/* 2. 실시간 분석 */}
        <section className="bg-gray-50 p-6 rounded-lg mb-6">
          <h2 className="text-2xl font-bold text-green-700 mb-4">2. 실시간 분석</h2>
          <p className="text-gray-600 mb-2">🔍 분리배출 후, AI가 실시간 분석!</p>
          <p className="text-gray-600 mb-2">✅ 어떤 재질인지 확인 (플라스틱, 캔, 종이 등)</p>
          <p className="text-gray-600">✅ 오염 여부 파악 (음식물 포함 여부, 라벨 부착 등)</p>
        </section>

        {/* 3. 즉시 피드백 제공 */}
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
              {/* **아이콘 추가** */}
              <img 
                src={materialIcons[material]} 
                alt={`${material} 아이콘`} 
                className="w-12 h-12"
              />
              <div>
                <h3 className="text-lg font-semibold">{material}</h3>

                {/* 가이드 보기 버튼: 팝업 모달 */}
                <Button variant="outline" className="mt-2" onClick={() => openModal(material)}>
                  가이드 보기
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

     {/* 잘못된 분리배출 사례 및 상세 가이드 */}
<section className="mb-12">
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-2xl font-bold">잘못된 분리배출 사례 비교❌</h2>
    
    {/* 전체 사례 보기 버튼 */}
    <Button variant="destructive" onClick={() => setIsModalOpen(true)}>
      전체 사례 보기
    </Button>
  </div>

  {/* 모달 컴포넌트 */}
  {isModalOpen && (
    <Modal onClose={() => setIsModalOpen(false)} title="잘못된 분리배출 사례 모음">
      {/* 모달 안에 전체 사례를 표시 */}
      <div className="space-y-4">
        {materials.map((material) => (
          <div key={material} className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-bold text-red-600">{material}</h3>
            <img 
              src={`/images/wrong_${material}.png`} 
              alt={`${material} 잘못된 분리배출 사례`} 
              className="w-full h-auto mt-2 rounded"
            />
            <p className="text-sm text-gray-500 mt-2">이렇게 버리면 안 돼요!</p>
          </div>
        ))}
      </div>
    </Modal>
  )}
</section>


      {/* 모달 컴포넌트 */}
      {isModalOpen && selectedMaterial && (
        <Modal onClose={closeModal}>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">{selectedMaterial} 분리배출 가이드</h2>
            <img 
              src={materialImages[selectedMaterial]} 
              alt={`${selectedMaterial} 분리배출`} 
              className="w-full h-auto object-cover mb-4 rounded-lg"
            />
            <p className="text-gray-600 mb-4">{selectedMaterial}에 대한 올바른 분리배출 방법을 확인하세요.</p>
          </div>
        </Modal>
      )}
    </div>
  );
}
