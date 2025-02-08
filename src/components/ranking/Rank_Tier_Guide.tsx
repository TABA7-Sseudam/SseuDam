import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

export default function RankTierGuide() {
  const navigate = useNavigate()

  const handleGoBack = () => {
    navigate(-1)
  }

  return (
    <div className="container mx-auto p-6 bg-white">
      <h1 className="text-4xl font-bold mb-6 text-center">📖 등급 & 랭킹 가이드</h1>

      <Button onClick={handleGoBack} className="mb-6 bg-black text-white">
        ← 뒤로가기
      </Button>

      {/* Eco XP 설명 */}
      <Card className="p-6 shadow-md mb-6">
        <h2 className="text-2xl font-semibold mb-4">Eco XP란?</h2>
        <p className="text-gray-700 mb-4">
          Eco XP는 분리수거 및 친환경 활동을 통해 획득하는 포인트입니다.
        </p>
        <p className="text-gray-700 mb-4">
          매월 최대 <strong>10,000 Eco XP</strong>를 획득할 수 있습니다.
        </p>
      </Card>

      {/* 랭킹 시스템 설명 */}
      <Card className="p-6 shadow-md mb-6">
        <h2 className="text-2xl font-semibold mb-4">월간 랭킹 시스템</h2>
        <p className="text-gray-700 mb-4">
          월간 랭킹은 매달 초기화되며, 해당 월에 획득한 Eco XP를 기준으로 순위가 결정됩니다.
          환경 보호 등급이 낮아도 월간 랭킹에서 1위를 차지할 수 있습니다.
        </p>
        <p className="text-gray-700">
          상위 3명은 메인 페이지에 특별히 표시되며, 최고의 분리배출 기여자로 인정받습니다.
        </p>
      </Card>

      {/* 환경 보호 등급 설명 */}
            <Card className="p-6 shadow-md mb-6">
        <h2 className="text-2xl font-semibold mb-4">환경 보호 등급 시스템</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>💀 <strong>환경 테러범</strong>: 0 - 1,000 XP</li>
          <li>🗑 <strong>분리배출 견습생</strong>: 1,001 - 3,000 XP</li>
          <li>🌿 <strong>지구 친구</strong>: 3,001 - 6,000 XP</li>
          <li>🌍 <strong>지구 지킴이</strong>: 6,001 - 10,000 XP</li>
          <li>🏆 <strong>에코히어로 (Eco Hero)</strong>: 10,001 XP 이상</li>
        </ul>
      </Card>


      {/* 등급별 상세 설명 */}
      <Card className="p-6 shadow-md mb-6">
        <h2 className="text-2xl font-semibold mb-4">등급 상세 설명</h2>

        {/* 환경 테러범 */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">💀 환경 테러범</h3>
          <p className="text-gray-700 mb-2">"지구야 미안해..." 🌍💀</p>
          <p className="text-gray-700 mb-2">환경 보호에 무관심하며, 쓰레기를 아무렇게나 버리는 수준.</p>
          <p className="text-red-600 font-bold">⚠️ 지구가 당신을 걱정합니다! 분리배출을 시작하세요!</p>
        </div>

        {/* 분리배출 견습생 */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">🗑 분리배출 견습생</h3>
          <p className="text-gray-700 mb-2">"아, 그래… 분리배출이 중요하긴 하네?"</p>
          <p className="text-gray-700 mb-2">분리배출을 시도하지만 실수가 많은 단계.</p>
          <p className="text-green-600 font-bold">처음 분리수거를 시작하면 배정 받는 티어</p>
        </div>

        {/* 지구 친구 */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">🌿 지구 친구</h3>
          <p className="text-gray-700 mb-2">"오, 이제 나 좀 환경 생각하는 사람 같은데?"</p>
          <p className="text-gray-700 mb-2">올바른 분리배출을 대부분 실천하지만 가끔 실수함.</p>
          <p className="text-green-500 font-bold">🌱 축하합니다! 이제 당신은 '지구 친구'입니다!</p>
        </div>

        {/* 지구 지킴이 */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">🌍 지구 지킴이</h3>
          <p className="text-gray-700 mb-2">"이제 분리배출? 눈 감고도 가능하지!"</p>
          <p className="text-gray-700 mb-2">올바른 분리배출의 모범 시민.</p>
          <p className="text-blue-500 font-bold">🛡 축하합니다! '지구 지킴이' 등급으로 승급!</p>
        </div>

        {/* 에코히어로 */}
        <div>
          <h3 className="text-xl font-semibold mb-2">🏆 에코히어로 (Eco Hero)</h3>
          <p className="text-gray-700 mb-2">"내가 배출하는 모든 쓰레기는 100% 재활용된다."</p>
          <p className="text-gray-700 mb-2">환경 보호의 전설적인 존재로, 다른 사람을 돕는 리더.</p>
          <p className="text-yellow-500 font-bold">🏆 축하합니다! 당신은 '에코히어로'입니다!</p>
        </div>
      </Card>
    </div>
  )
}