// src/tests/testUpdateProfile.ts
import { authService } from "@/lib/firebase/auth";
import { dbService } from "@/lib/firebase/db";

async function testUpdateProfile() {
  const userId = "uAdt9ceJDoTT2T3z79LqIwiORoF2"; // 기존 사용자 ID
  
  try {
    await authService.updateProfile(userId, {
      location: "서울특별시 강남구",
      apartment: "테헤란 아파트",
      username: "업데이트된 사용자"
    });

    // 업데이트 확인
    const updatedUser = await dbService.users.get(userId);
    console.log("✅ 프로필 업데이트 성공:", updatedUser);
  } catch (error) {
    console.error("❌ 프로필 업데이트 실패:", error);
  }
}

testUpdateProfile();