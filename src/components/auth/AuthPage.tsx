import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../ui/card";
import { Button } from "../ui/button";

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="p-8 w-full max-w-md text-center bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-6">
          {isLogin ? "로그인" : "회원가입"}
        </h2>
        {isLogin ? <LoginPage /> : <RegisterPage />}
        <Button
          className="mt-6 w-full bg-black text-white"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "회원가입하기" : "로그인하기"}
        </Button>
      </Card>
    </div>
  );
}

// ✅ 로그인 페이지 (관리자 바로 이동, 일반 사용자 로그인 제한)
function LoginPage() {
  const navigate = useNavigate();

  const handleAdminLogin = () => {
    localStorage.setItem("user", "admin");
    navigate("/home"); // ✅ 관리자 로그인 후 메인 페이지로 이동
    window.location.reload(); // ✅ UI 업데이트
  };

  return (
    <div className="flex flex-col gap-4">
      <input type="email" placeholder="이메일 입력 (일반 로그인 불가)" className="border p-2 rounded w-full" disabled />
      <input type="password" placeholder="비밀번호 입력 (회원가입 후 로그인 가능)" className="border p-2 rounded w-full" disabled />
      
      {/* ✅ 관리자 로그인 버튼 (즉시 메인 페이지 이동) */}
      <Button className="w-full bg-red-500 text-white" onClick={handleAdminLogin}>
        관리자 로그인 (Admin)
      </Button>

      {/* ✅ 게스트 체험 버튼 */}
      <Button className="w-full bg-gray-500 text-white" onClick={() => {
        localStorage.setItem("user", "guest");
        navigate("/home"); // ✅ 게스트 로그인 후 메인 페이지 이동
        window.location.reload();
      }}>
        게스트 체험하기 (Guest)
      </Button>
    </div>
  );
}

// ✅ 회원가입 페이지 (일반 사용자는 회원가입 후 로그인 가능)
function RegisterPage() {
  const navigate = useNavigate();

  const handleRegister = () => {
    localStorage.setItem("user", "user"); // ✅ 회원가입 시 일반 사용자로 저장
    navigate("/auth"); // ✅ 회원가입 후 로그인 페이지로 이동
    window.location.reload();
  };

  return (
    <div className="flex flex-col gap-4">
      <input type="text" placeholder="이름" className="border p-2 rounded w-full" />
      <input type="email" placeholder="이메일 입력" className="border p-2 rounded w-full" />
      <input type="password" placeholder="비밀번호 (6자 이상)" className="border p-2 rounded w-full" />
      <input type="password" placeholder="비밀번호 확인" className="border p-2 rounded w-full" />
      <Button className="w-full bg-black text-white" onClick={handleRegister}>
        회원가입 완료 후 로그인하기
      </Button>
    </div>
  );
}
