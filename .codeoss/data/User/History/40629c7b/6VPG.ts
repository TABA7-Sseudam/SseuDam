import { authService } from "@/lib/firebase/auth";
import { dbService } from "@/lib/firebase/db";

async function testLogin() {
  const email = "testuser@example.com";
  const password = "password123";

  try {
    // 로그인
    const user = await authService.login(email, password);
    console.log("✅ 로그인 성공:", user.uid);

    // 사용자 정보 가져오기
    const userDoc = await dbService.users.get(user.uid);  // 사용자 정보
    if (userDoc) {
      // undefined 체크 및 기본값 제공
      const location = userDoc.location || "정보 없음";
      const apartment = userDoc.apartment || "정보 없음";

      console.log("📍 위치 정보:", location);
      console.log("🏢 아파트 정보:", apartment);

      // 세션 생성 (user_sessions 컬렉션에 저장)
      await dbService.user_sessions.create(user.uid, { 
        location, 
        apartment,
        timestamp: new Date().toISOString() 
      });
      console.log("🔑 세션 생성 완료!");
    } else {
      console.error("❌ 사용자 정보가 존재하지 않습니다.");
    }
  } catch (error) {
    console.error("❌ 로그인 실패:", error);
    console.error("에러 상세 정보:", error instanceof Error ? error.message : error);
  }
}

testLogin();