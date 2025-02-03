import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <h2 className="text-3xl font-bold mb-2">로그인</h2>
      <p className="text-gray-500 mb-6">가장 최근의 기술을 통해 로그인하세요.</p>

      <Card className="p-6 w-full max-w-md">
        <input type="email" placeholder="이메일 입력" className="border p-2 rounded w-full mb-4" />
        <input type="password" placeholder="비밀번호 입력" className="border p-2 rounded w-full mb-4" />
        <Button className="w-full bg-black text-white">로그인</Button>
      </Card>

      <h3 className="text-xl font-bold mt-10">소셜 로그인</h3>
      <div className="flex flex-col gap-4 mt-4">
        <Button className="flex items-center gap-2">😀 Google</Button>
        <Button className="flex items-center gap-2">😊 Kakao</Button>
        <Button className="flex items-center gap-2">😁 Naver</Button>
      </div>

      <h3 className="text-xl font-bold mt-10">추가 기능</h3>
      <div className="flex flex-col gap-4 mt-4">
        <Button className="flex items-center gap-2">🕵️‍♂️ 비밀번호 찾기/회원가입</Button>
        <Button className="flex items-center gap-2">👤 게스트로 체험하기</Button>
      </div>
    </div>
  );
}

export function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <h1 className="text-4xl font-bold mb-4">간편하게 가입하고 친환경 활동을 시작하세요!</h1>
      <p className="text-gray-500 mb-6">최적가입을 위해 아래 정보를 입력하세요.</p>

      <Card className="p-6 w-full max-w-md">
        <input type="text" placeholder="이름" className="border p-2 rounded w-full mb-4" />
        <input type="email" placeholder="이메일" className="border p-2 rounded w-full mb-4" />
        <input type="password" placeholder="비밀번호 (6자 이상, 영문, 숫자 포함)" className="border p-2 rounded w-full mb-4" />
        <input type="password" placeholder="비밀번호 확인" className="border p-2 rounded w-full mb-4" />
        <Button className="w-full bg-black text-white">회원가입</Button>
      </Card>

      <h3 className="text-xl font-bold mt-10">소셜 계정으로 더 쉽게 가입하기</h3>
      <div className="flex flex-col gap-4 mt-4">
        <Button className="flex items-center gap-2">Google ID로 가입</Button>
        <Button className="flex items-center gap-2">Kakao ID로 가입</Button>
        <Button className="flex items-center gap-2">Naver ID로 가입</Button>
      </div>

      <h3 className="text-xl font-bold mt-10">이미 회원가입한 계정이 있으신가요?</h3>
      <Button className="mt-4 bg-black text-white">로그인하기</Button>
    </div>
  );
}
