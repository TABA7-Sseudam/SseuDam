// /home/yun777567/my-firebase-project/src/tests/testRegister.ts
import { authService } from "../lib/firebase/auth";   // 인증 관련 서비스
import { dbService } from "../lib/firebase/db";       // DB 관련 서비스
async function testRegister() {
  const email = `secureuser_${Date.now()}@example.com`;  // 고유한 이메일 생성
  const password = "password123";
  const username = "test_user";
  const address = "서울특별시 강남구 테헤란로 123";
  const location = "서울특별시 강남구"; // 예시로 지역 정보 추가
  const apartment = "테헤란 아파트";  // 예시로 아파트 정보 추가
  
  try {
    // 회원가입
    const user = await authService.register(email, password, username, address);
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