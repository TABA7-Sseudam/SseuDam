import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoginPage } from "./LoginPage";    // 기존 LoginPage 불러오기
import { RegisterPage } from "./RegisterPage";  // 기존 RegisterPage 불러오기

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="p-8 w-full max-w-4xl text-center bg-white shadow-lg rounded-lg">
        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-1/2 p-4 flex flex-col justify-center items-start">
            <h2 className="text-3xl font-bold mb-4 text-left">
              간편하게 가입하고 친환경 활동을 시작하세요!
            </h2>
            <p className="text-left text-gray-600 mb-8">
              회원가입을 위해 아래 정보를 입력하세요.
            </p>

            {/* 기존 LoginPage와 RegisterPage 사용 */}
            {isLogin ? <LoginPage /> : <RegisterPage />}

            <Button
              className="mt-6 w-full bg-black text-white"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "회원가입하기" : "로그인하기"}
            </Button>
          </div>

          {/* 이미지 또는 추가 정보 영역 */}
          <div className="hidden lg:block w-full lg:w-1/2 bg-gray-200 rounded-lg">
            <div className="h-full w-full flex items-center justify-center">
              <p className="text-gray-500">이미지 또는 추가 정보 표시 영역</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
