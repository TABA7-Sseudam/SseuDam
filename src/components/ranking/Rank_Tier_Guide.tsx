import { Card } from "@/components/ui/card"

export default function RankTierGuide() {
  return (
    <div className="container mx-auto p-6 bg-white">
      <h1 className="text-3xl font-bold mb-4">등급 및 랭킹 안내</h1>
      <Card className="p-6 shadow-md">
        <h2 className="text-xl font-semibold mb-2">Eco XP란?</h2>
        <p className="text-gray-700 mb-4">
          Eco XP는 분리수거 및 친환경 활동을 통해 획득하는 포인트입니다. 이 포인트는 월별 및 누적 기준으로 랭킹에 반영됩니다.
        </p>
        <h2 className="text-xl font-semibold mb-2">등급 시스템</h2>
        <ul className="list-disc list-inside text-gray-700">
          <li>🌱 새싹 지킴이: 0 - 2000 XP</li>
          <li>🌿 초록 지킴이: 2001 - 5000 XP</li>
          <li>🌳 숲 지킴이: 5001 - 10000 XP</li>
          <li>🌍 지구 지킴이: 10001 XP 이상</li>
        </ul>
        <h2 className="text-xl font-semibold mt-4 mb-2">랭킹 시스템</h2>
        <p className="text-gray-700">
          매달 최고의 기여자를 선정하여 랭킹을 업데이트합니다. 상위 3명은 메인 페이지에서 특별히 표시됩니다.
        </p>
      </Card>
    </div>
  )
}
