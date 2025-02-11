import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export function GuestLogin() {
  const navigate = useNavigate();

  const handleGuestLogin = () => {
    // 임시 사용자 세션 생성 (백엔드 연동 가능)
    localStorage.setItem("guest", "true");
    navigate("/dashboard"); // 게스트 대시보드 페이지로 이동
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <h2 className="text-3xl font-bold mb-4">게스트로 체험하기</h2>
      <p className="text-gray-500 mb-6 text-center">
        가입 없이 분리배출 AI 시스템을 체험해보세요!
      </p>

      <Card className="p-6 w-full max-w-md">
        <Button className="w-full bg-black text-white" onClick={handleGuestLogin}>
          게스트로 시작하기
        </Button>
      </Card>

      <h3 className="text-xl font-bold mt-10">다른 계정으로 로그인하기</h3>
      <div className="flex flex-col gap-4 mt-4">
        <Button className="flex items-center gap-2" onClick={() => navigate('/login')}>🔑 로그인</Button>
        <Button className="flex items-center gap-2" onClick={() => navigate('/register')}>📝 회원가입</Button>
      </div>
    </div>
  );
}
