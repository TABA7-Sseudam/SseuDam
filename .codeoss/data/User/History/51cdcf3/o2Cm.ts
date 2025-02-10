import { authService, dbService } from "@/lib/firebase/auth";

async function testRegister() {
  const email = "testuser@example.com";
  const password = "password123";
  const username = "test_user";

  try {
    // 회원가입
    const user = await authService.register(email, password, username);
    console.log("✅ 회원가입 성공:", user.uid);

    // Firestore에서 사용자 정보 확인
    const userData = await dbService.users.get(user.uid);
    console.log("📦 Firestore 사용자 정보:", userData);

    // 이메일 인증 토큰 생성
    const token = await dbService.emailVerifications.create(user.uid);
    console.log("📧 이메일 인증 토큰 생성:", token);
  } catch (error) {
    console.error("❌ 회원가입 실패:", error);
  }
}

testRegister();