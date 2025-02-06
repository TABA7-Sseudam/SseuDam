import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CameraIcon, CheckCircleIcon, AlertCircleIcon, RefreshCcwIcon, SaveIcon } from "lucide-react";

export function WasteAnalysisPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white px-4">
      <header className="p-4 border-b flex justify-between items-center">
        <h1 className="text-2xl font-bold">🔄 분리배출 AI 시스템</h1>
        <nav className="flex space-x-4">
          <Button variant="ghost">홈</Button>
          <Button variant="ghost">분리배출</Button>
          <Button variant="ghost">리워드</Button>
          <Button variant="ghost">가이드</Button>
          <Button variant="ghost">설정</Button>
        </nav>
      </header>
      
      <main className="container mx-auto py-8">
        {/* 재활용품 분석 */}
        <section className="text-center mb-12">
          <div className="flex justify-center">
            <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
              <CameraIcon size={40} className="text-gray-500" />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-4">재활용품 분석</h2>
          <p className="text-gray-500 mb-6">카메라를 통해 분석할 재활용품을 업로드하거나 직접 촬영해주세요</p>
          <Button className="bg-black text-white" onClick={() => navigate("/start-analysis")}>분석 시작</Button>
        </section>

        {/* AI 분석 결과 */}
        <section className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">AI 분석 결과</h2>
          <p className="text-gray-500 mb-6">재질 및 상태 분류 결과를 확인하세요</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 flex flex-col items-center">
              <div className="w-24 h-24 bg-gray-100 rounded-lg mb-4"></div>
              <p className="text-gray-600">플라스틱</p>
              <p className="text-green-600 font-bold">깨끗함</p>
            </Card>
            <Card className="p-6 flex flex-col items-center">
              <div className="w-24 h-24 bg-gray-100 rounded-lg mb-4"></div>
              <p className="text-gray-600">종이</p>
              <p className="text-yellow-600 font-bold">일부 오염</p>
            </Card>
            <Card className="p-6 flex flex-col items-center">
              <div className="w-24 h-24 bg-gray-100 rounded-lg mb-4"></div>
              <p className="text-gray-600">캔</p>
              <p className="text-green-600 font-bold">깨끗함</p>
            </Card>
          </div>
        </section>

        {/* LED 피드백 시스템 */}
        <section className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">LED 피드백 시스템</h2>
          <p className="text-gray-500 mb-6">분리배출 결과에 대한 안내</p>
          <div className="flex justify-center gap-8">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircleIcon size={20} />
              <span>파란불 성공! 포인트 적립됨</span>
            </div>
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircleIcon size={20} />
              <span>빨간불 오류! 이물질을 제거한 후 다시 배출</span>
            </div>
          </div>
        </section>

        {/* 추가 기능 */}
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-4">추가 기능</h2>
          <p className="text-gray-500 mb-6">분석 결과에 따른 조작</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 flex flex-col items-center">
              <RefreshCcwIcon size={32} className="text-gray-500 mb-2" />
              <p className="text-gray-600">재시도</p>
              <p className="text-sm text-gray-500">깨끗한 경우, 다시 분석 가능</p>
            </Card>
            <Card className="p-6 flex flex-col items-center">
              <SaveIcon size={32} className="text-gray-500 mb-2" />
              <p className="text-gray-600">결과 저장</p>
              <p className="text-sm text-gray-500">성공 시, 포인트 적립</p>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
