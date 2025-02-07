import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "@/lib/firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function RegisterPage() {
  const navigate = useNavigate();

  // 입력값 상태 관리
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState(""); // 에러 상태 추가

  // 회원가입 처리 함수
  const handleRegister = async () => {
    try {
      // Firebase Authentication을 통한 사용자 생성
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Firestore에 사용자 정보 저장
      await setDoc(doc(db, 'users', user.uid), {
        username,
        email,
        address,
        role: 'user',
        emailVerified: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      console.log("✅ 회원가입 및 Firestore 저장 성공:", user.uid);
      navigate("/login");  // 로그인 페이지로 이동
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("❌ 회원가입 실패:", error.message);
        setError(`회원가입 실패: ${error.message}`);
      } else {
        console.error("❌ 알 수 없는 오류:", error);
        setError("회원가입 중 알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <h1 className="text-4xl font-bold mb-4">간편하게 가입하고 친환경 활동을 시작하세요!</h1>
      <p className="text-gray-500 mb-6">최적가입을 위해 아래 정보를 입력하세요.</p>

      <Card className="p-6 w-full max-w-md">
        <input 
          type="text" 
          placeholder="이름" 
          className="border p-2 rounded w-full mb-4" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
        />
        <input 
          type="email" 
          placeholder="이메일" 
          className="border p-2 rounded w-full mb-4" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          type="password" 
          placeholder="비밀번호 (6자 이상)" 
          className="border p-2 rounded w-full mb-4" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="주소" 
          className="border p-2 rounded w-full mb-4" 
          value={address} 
          onChange={(e) => setAddress(e.target.value)} 
        />
        <Button className="w-full bg-black text-white" onClick={handleRegister}>
          회원가입 완료 후 로그인하기
        </Button>
        {/* 에러 메시지 표시 */}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </Card>

      <h3 className="text-xl font-bold mt-10">이미 계정이 있으신가요?</h3>
      <Button className="mt-4 bg-black text-white" onClick={() => navigate('/login')}>
        로그인하기
      </Button>
    </div>
  );
}
