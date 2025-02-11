import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { 
  loginUser, 
  getUserData,
  logUserActivity
} from "@/services/authService";

interface FirebaseError extends Error {
  code?: string;
}

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setError("");
    
    try {
      const user = await loginUser(email, password);
      
      const userData = await getUserData(user.uid);
      if (userData) {
        const userInfo = {
          ...userData,
          uid: user.uid,
          lastLogin: new Date().toISOString()
        };

        localStorage.setItem("user", JSON.stringify(userInfo));
        await logUserActivity(user.uid, 'login');
        navigate("/home");
      }
    } catch (error) {
      console.error("로그인 에러:", error);
      const firebaseError = error as FirebaseError;
      setError(firebaseError.message || "로그인 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = () => {
    const guestData = {
      uid: `guest-${Date.now()}`,
      email: null,
      username: "게스트",
      lastLogin: new Date().toISOString(),
      isGuest: true,
      points: 0,
      recycleCount: 0,
      role: 'user'
    };
    localStorage.setItem("user", JSON.stringify(guestData));
    navigate("/home");
  };

  return (
    <Card className="w-full max-w-sm bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-8 py-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">로그인</h2>
          <p className="mt-2 text-sm text-gray-600">계정에 로그인하세요</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">이메일</label>
            <input
              type="email"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">비밀번호</label>
            <input
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full h-10 flex items-center justify-center bg-blue-600 text-white hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="animate-spin mr-2" />}
            {isLoading ? "처리 중..." : "로그인"}
          </Button>
        </form>

        <div className="mt-6">
          <Button
            type="button"
            onClick={handleGuestLogin}
            className="w-full h-10 bg-gray-600 text-white hover:bg-gray-700"
            disabled={isLoading}
          >
            게스트로 체험하기
          </Button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            계정이 없으신가요?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              회원가입
            </button>
          </p>
        </div>
      </div>
    </Card>
  );
}

export default LoginPage;