import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function UserProfile() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-md">
      {/* 왼쪽 사용자 정보 */}
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 bg-gray-200 rounded-full"></div> {/* 프로필 이미지 */}
        <div>
          <h2 className="text-xl font-bold">사용자이름</h2>
          <p className="text-gray-500">누적 포인트: XX | 현재 등급: XXpoint | 🗑 분리배출 견습생</p>
          <p className="text-gray-500">환경을 위한 친환경 분리배출을 시작하세요.</p>
        </div>
      </div>

      {/* 오른쪽 버튼 */}
      <div className="flex gap-4">
        <Button variant="outline">포인트 및 리워드</Button>
        <Button className="bg-black text-white" onClick={() => navigate("/waste-analysis")}>
          분리배출 시작
        </Button>
      </div>
    </div>
  );
}
