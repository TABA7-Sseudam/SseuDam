import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "@/lib/firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export function RegisterPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "", // 비밀번호 확인 필드
    username: "",
    address: ""
  });
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.username) {
      setError("모든 필수 항목을 입력해주세요.");
      return false;
    }
    if (formData.password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return false;
    }
    return true;
  };


  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // Firestore에 사용자 정보 저장
      await setDoc(doc(db, 'users', user.uid), {
        username: formData.username,
        email: formData.email,
        address: formData.address,
        role: 'user',  // 기본 역할은 'user'
        emailVerified: false, // 이메일 인증 여부 (초기값: false)
        points: 0,          // 추가: 사용자 초기 포인트
        recycleCount: 0,     // 추가: 사용자 초기 재활용 횟수
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // 초기 랭킹 정보 생성
      await setDoc(doc(db, 'rank_accounts', user.uid), {
          username: formData.username,
          month: new Date().getMonth() + 1,  // 현재 월
          monthly_points: 0,
          accumulated_points: 0,
          ranking: 0  // 초기 랭킹은 0 또는 null로 설정
      });

      alert("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");
      navigate("/login"); //  '/auth' -> '/login' (로그인 페이지로 명시적 이동)
    } catch (error: any) {
      console.error("회원가입 실패:", error);
      setError(
        error.code === 'auth/email-already-in-use'
          ? "이미 사용 중인 이메일입니다."
          : error.code === 'auth/invalid-email'
          ? "유효하지 않은 이메일 형식입니다."
          : "회원가입 중 오류가 발생했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

    // ✅ 관리자 페이지로 이동 (localStorage 사용)
    const handleAdminAccess = () => {
        localStorage.setItem("isAdmin", "true"); // isAdmin을 true로 설정
        navigate("/admin");
    };

    // ✅ 소셜 로그인 핸들러 (더미 함수)
    const handleSocialLogin = (provider: string) => {
        alert(`${provider} 소셜 로그인은 현재 준비 중입니다.`);
    // TODO: Firebase 소셜 로그인 연동 (Google, Kakao, Naver)
    };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 px-4">
      <h1 className="text-3xl font-bold mb-4">간편하게 가입하고 친환경 활동을 시작하세요!</h1>
      <p className="text-gray-600 mb-6">빠른 가입을 위해 아래 정보를 입력하세요.</p>

      <Card className="p-6 w-full max-w-md shadow-lg">
        {error && (
          <Alert className="mb-4 bg-red-50">
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이름 *
            </label>
            <input
              type="text"
              name="username"
              placeholder="이름을 입력하세요"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이메일 *
            </label>
            <input
              type="email"
              name="email"
              placeholder="이메일을 입력하세요"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호 *
            </label>
            <input
              type="password"
              name="password"
              placeholder="비밀번호 (6자 이상)"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호 확인 *
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="비밀번호 확인"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              주소
            </label>
            <input
              type="text"
              name="address"
              placeholder="주소를 입력하세요 (선택사항)"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-black text-white hover:bg-gray-800"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="animate-spin mr-2" />}
            {isLoading ? "처리중..." : "회원가입"}
          </Button>

        <Button
            className="w-full bg-blue-500 text-white hover:bg-blue-600 mt-4"
            onClick={handleAdminAccess}
            type="button"
        >
        관리자 페이지로 이동
        </Button>
        </form>

        {/* 소셜 로그인, 로그인 버튼들 */}
        <h3 className="text-xl font-bold mt-10">소셜 계정으로 더 쉽게 가입하기</h3>
        <div className="flex flex-col gap-4 mt-4">
          <Button
            className="flex items-center gap-2 bg-red-500 text-white hover:bg-red-600"
            onClick={() => handleSocialLogin("Google")}
            type="button"
          >
            Google ID로 가입
          </Button>
          <Button
            className="flex items-center gap-2 bg-yellow-400 text-black hover:bg-yellow-500"
            onClick={() => handleSocialLogin("Kakao")}
            type="button"
          >
            Kakao ID로 가입
          </Button>
          <Button
            className="flex items-center gap-2 bg-green-500 text-white hover:bg-green-600"
            onClick={() => handleSocialLogin("Naver")}
            type="button"
          >
            Naver ID로 가입
          </Button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            이미 계정이 있으신가요?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              로그인하기
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
}

export default RegisterPage;