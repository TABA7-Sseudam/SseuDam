import { authService, dbService } from "@/lib/firebase/auth";

async function testLogin() {
  const email = "testuser@example.com";
  const password = "password123";

  try {
    // 로그인
    const user = await authService.login(email, password);
    console.log("✅ 로그인 성공:", user.uid);

    // 세션 생성 (user_sessions 컬렉션에 저장)
    await dbService.user_sessions.create(user.uid);
    console.log("🔑 세션 생성 완료!");
  } catch (error) {
    console.error("❌ 로그인 실패:", error);
  }
}

testLogin();
