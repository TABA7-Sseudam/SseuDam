import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoginPage } from "./LoginPage";
import { RegisterPage } from "./RegisterPage";

const environmentalQuotes = [
  {
    quote: "지구를 보호하는 것은 선택이 아닌 필수입니다.",
    author: "UN Environment Programme",
    link: "https://www.unep.org"
  },
  {
    quote: "작은 실천이 모여 큰 변화를 만듭니다.",
    author: "Greenpeace International",
    link: "https://www.greenpeace.org"
  },
  {
    quote: "지속 가능한 미래는 우리 모두의 책임입니다.",
    author: "World Wildlife Fund",
    link: "https://www.worldwildlife.org"
  }
];

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [currentQuoteIndex] = useState(
    Math.floor(Math.random() * environmentalQuotes.length)
  );

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Card className="p-8 w-full max-w-4xl text-center bg-white shadow-lg rounded-lg">
        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-1/2 p-4 flex flex-col justify-center items-start">
            <h2 className="text-3xl font-bold mb-4 text-left">
              간편하게 가입하고 친환경 활동을 시작하세요!
            </h2>
            <p className="text-left text-gray-600 mb-8">
              회원가입을 위해 아래 정보를 입력하세요.
            </p>

            {isLogin ? <LoginPage /> : <RegisterPage />}

            <Button
              className="mt-6 w-full bg-black text-white hover:bg-gray-800"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "회원가입하기" : "로그인하기"}
            </Button>
          </div>

          <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg p-8">
            <div className="h-full w-full flex flex-col items-center justify-center space-y-6">
              <svg
                className="w-24 h-24 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                />
              </svg>
              
              <blockquote className="text-xl font-semibold text-gray-700">
                {environmentalQuotes[currentQuoteIndex].quote}
              </blockquote>
              
              <a
                href={environmentalQuotes[currentQuoteIndex].link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-green-600 hover:text-green-700 font-medium mt-4"
              >
                - {environmentalQuotes[currentQuoteIndex].author} →
              </a>

              <div className="mt-8 text-sm text-gray-600">
                <p>함께하면 더 큰 변화를 만들 수 있습니다.</p>
                <div className="flex justify-center space-x-4 mt-4">
                  <a
                    href="https://www.un.org/sustainabledevelopment"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700"
                  >
                    UN SDGs
                  </a>
                  <span>•</span>
                  <a
                    href="https://www.climate.gov"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Climate.gov
                  </a>
                  <span>•</span>
                  <a
                    href="https://www.epa.gov"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700"
                  >
                    EPA
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default AuthPage;