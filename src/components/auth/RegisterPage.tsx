import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"

export function RegisterPage() {
  const navigate = useNavigate()

  // ✅ 회원가입 처리 (간단히 로컬 저장소에 저장)
  const handleRegister = () => {
    localStorage.setItem("user", "user")  // 일반 사용자로 저장
    alert("회원가입이 완료되었습니다! 로그인 해주세요.")
    navigate("/auth")  // 회원가입 후 로그인 페이지로 이동
  }

  // ✅ 관리자 페이지로 이동
  const handleAdminAccess = () => {
    localStorage.setItem("user", "admin")  // 관리자 권한 저장 (선택 사항)
    navigate("/admin")  // 관리자 페이지로 이동
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      {/* 페이지 헤더 */}
      <h1 className="text-4xl font-bold mb-4">간편하게 가입하고 친환경 활동을 시작하세요!</h1>
      <p className="text-gray-500 mb-6">빠른 가입을 위해 아래 정보를 입력하세요.</p>

      {/* 회원가입 폼 */}
      <Card className="p-6 w-full max-w-md shadow-lg">
        <input type="text" placeholder="이름" className="border p-2 rounded w-full mb-4" />
        <input type="email" placeholder="이메일" className="border p-2 rounded w-full mb-4" />
        <input type="password" placeholder="비밀번호 (6자 이상, 영문, 숫자 포함)" className="border p-2 rounded w-full mb-4" />
        <input type="password" placeholder="비밀번호 확인" className="border p-2 rounded w-full mb-4" />

        {/* 회원가입 버튼 */}
        <Button className="w-full bg-black text-white" onClick={handleRegister}>
          회원가입
        </Button>

        {/* ✅ 관리자 페이지로 이동하는 버튼 */}
        <Button className="w-full bg-blue-500 text-white mt-4" onClick={handleAdminAccess}>
          관리자 페이지로 이동
        </Button>
      </Card>

      {/* 소셜 로그인 옵션 */}
      <h3 className="text-xl font-bold mt-10">소셜 계정으로 더 쉽게 가입하기</h3>
      <div className="flex flex-col gap-4 mt-4">
        <Button className="flex items-center gap-2 bg-red-500 text-white">Google ID로 가입</Button>
        <Button className="flex items-center gap-2 bg-yellow-400 text-black">Kakao ID로 가입</Button>
        <Button className="flex items-center gap-2 bg-green-500 text-white">Naver ID로 가입</Button>
      </div>

      {/* 로그인 페이지로 이동 */}
      <h3 className="text-xl font-bold mt-10">이미 계정이 있으신가요?</h3>
      <Button className="mt-4 bg-gray-800 text-white" onClick={() => navigate('/auth')}>
        로그인하기
      </Button>
    </div>
  )
}
