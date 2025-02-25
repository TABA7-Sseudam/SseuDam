import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/components/auth/authstore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { login } from "@/services/api/auth";
import { User } from "@/types/auth";
import { auth } from "@/lib/firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";

interface LoginError extends Error {
  message: string;
}

// Admin 사용자를 위한 확장된 인터페이스
interface AdminUserData extends User {
  uid: string;
  email: string;
  nickname: string;
  created_at: string;
  last_login: string;
  monthly_points: number;
  isGuest: false;
  role: "admin";
  token: string;
  points_needed_for_promotion: number;
  grade: string;
  accumulatedPoints: number;
  monthlyPoints: number;
}

export function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useAuthStore(); // Zustand 등에서 사용자 상태 관리
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Bypass 로그인 (개발용)
  const bypassLogin = () => {
    const bypassUserData: User = {
      uid: "bypass-user",
      email: "bypass@example.com",
      nickname: "Bypass User",
      created_at: new Date().toISOString(),
      last_login: new Date().toISOString(),
      monthlyPoints: 0,
      isGuest: false,
      role: "user",
      token: "bypass-token", // 업데이트된 User 인터페이스에 의해 허용됨
      points_needed_for_promotion: 0,
      grade: "일반",
      accumulatedPoints: 0,
      redirect_url: "/home",
      pointsNeededForPromotion: 0,
      // 통계 필드는 비워 둠
      apartmentMonthlyAvgSuccess: {},
      userMonthlyAvgSuccess: {},
      monthlyMaterialSuccessRates: {},
      recentAnalysis: [],
    };
    setUser(bypassUserData);
    // localStorage.setItem("user", JSON.stringify(bypassUserData)); 
    // (원한다면 이렇게 직접 넣어도 됨)
    navigate("/home");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // 1) Firebase 사용자 로그인
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      if (!firebaseUser) throw new Error("🚫 Firebase 사용자 인증 실패");

      // 2) Firebase 토큰 가져오기
      const idToken = await firebaseUser.getIdToken(true);
      localStorage.setItem("token", idToken);

      // 3) Firestore에서 유저 데이터(혹시 Admin인지 확인용)
      const db = getFirestore();
      const userDocRef = doc(db, "users", firebaseUser.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      // Admin 체크
      if (userDocSnapshot.exists()) {
        const userDataFromFirestore = userDocSnapshot.data();
        if (userDataFromFirestore.role === "admin") {
          // 관리자인 경우
          const adminUserData: AdminUserData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || "",
            nickname: userDataFromFirestore.nickname || "관리자",
            created_at: userDataFromFirestore.createdAt || new Date().toISOString(),
            last_login: userDataFromFirestore.lastLogin || new Date().toISOString(),
            monthly_points: userDataFromFirestore.monthly_points || 0,
            points_needed_for_promotion: 0,
            grade: "관리자",
            accumulatedPoints: 0,
            monthlyPoints: 0,
            isGuest: false,
            role: "admin",
            token: idToken,
            pointsNeededForPromotion: 0,
            // 통계 필드는 관리자 계정일 경우 별도 필요 없다면 빈 객체
            apartmentMonthlyAvgSuccess: {},
            userMonthlyAvgSuccess: {},
            monthlyMaterialSuccessRates: {},
            recentAnalysis: [],
          };

          // 여기서 adminUserData를 localStorage에 직접 저장 가능
          // (백엔드에서 별도 요청이 없으니, 임시로)
          setUser(adminUserData);
          localStorage.setItem("user", JSON.stringify(adminUserData));
          localStorage.setItem("isAdmin", "true");
          navigate("/admin");
          return;
        }
      }

      // 4) 백엔드 로그인 요청 (Firebase 토큰 포함)
      //   👉 여기가 핵심: auth.ts → login() 내부에서
      //   통계 필드까지 포함된 userData를 로컬 스토리지에 저장함
      const response = await login({ email, password });

      console.log("✅ 백엔드 login 반환 userData:", response);
      // 이제 response에는 apartmentMonthlyAvgSuccess, monthlyMaterialSuccessRates, recentAnalysis 등 통계 필드가 모두 들어 있음
      // 그리고 auth.ts 안에서 localStorage에 이미 저장됨

      // 🔑 "추가로" localStorage에 저장할 필요 없음
      //    (만약 Zustand 등에 user를 넣고 싶으면 그대로 넣는다)
      setUser(response);

      // 🔑 굳이 또 localStorage.setItem("user", JSON.stringify(response))를 해도 되지만
      //    auth.ts에서 이미 해 주었으니 상관 없음.
      //    단, 절대 "통계 필드"를 누락한 부분 객체를 다시 저장하면 안 됨!
      // localStorage.setItem("user", JSON.stringify(response));

      localStorage.setItem("isAdmin", "false");
      navigate(response.redirect_url || "/home");
    } catch (err) {
      console.error("🚨 로그인 에러:", err);
      const loginError = err as LoginError;
      setError(loginError.message || "로그인 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = () => {
    const currentTime = new Date().toISOString();
    const guestData: User = {
      uid: `guest-${Date.now()}`,
      email: "",
      nickname: "게스트",
      created_at: currentTime,
      last_login: currentTime,
      isGuest: true,
      role: "user",
      token: `guest-${Date.now()}`, // 업데이트된 User 인터페이스에 의해 허용됨
      monthlyPoints: 0,
      points_needed_for_promotion: 0,
      grade: "일반",
      accumulatedPoints: 0,
      redirect_url: "/home",
      pointsNeededForPromotion: 0,
      // 통계 필드는 비움
      apartmentMonthlyAvgSuccess: {},
      userMonthlyAvgSuccess: {},
      monthlyMaterialSuccessRates: {},
      recentAnalysis: [],
    };
    setUser(guestData);
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

        <Button
          type="button"
          onClick={bypassLogin}
          className="w-full h-10 mb-4 bg-green-500 text-white hover:bg-green-600"
        >
          Bypass Login (개발용)
        </Button>

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
      </div>
    </Card>
  );
}

export default LoginPage;
