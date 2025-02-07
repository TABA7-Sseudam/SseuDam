import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/firebase";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      // Firebase Authentication을 통한 로그인
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Firestore에서 추가 사용자 정보 가져오기
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log("✅ 사용자 정보:", userData);

        // 로컬스토리지에 사용자 정보 저장
        localStorage.setItem("user", JSON.stringify({ uid: user.uid, ...userData }));

        // 로그인 성공 시 홈 페이지로 이동
        navigate("/home");
      } else {
        console.error("❌ 사용자 정보를 찾을 수 없습니다.");
        setError("사용자 정보를 찾을 수 없습니다.");
      }
    } catch (error) {
      console.error("❌ 로그인 실패:", error);
      setError("로그인 실패. 이메일과 비밀번호를 확인하세요.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <h2 className="text-3xl font-bold mb-4">로그인</h2>
      <Card className="p-6 w-full max-w-md">
        <input
          type="email"
          placeholder="이메일 입력"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />
        <input
          type="password"
          placeholder="비밀번호 입력"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />
        <Button className="w-full bg-black text-white" onClick={handleLogin}>
          로그인
        </Button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </Card>
    </div>
  );
}
