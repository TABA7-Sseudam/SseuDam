import { authService } from "@/lib/firebase/auth";
import { dbService } from "@/lib/firebase/db";
import { getAuth } from 'firebase/auth';

async function testUpdateProfile() {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    console.error("❌ 로그인된 사용자가 없습니다.");
    return;
  }
  
  try {
    await authService.updateProfile(user.uid, {
      location: "서울특별시 강남구",
      apartment: "테헤란 아파트",
      username: "업데이트된 사용자"
    });

    // 업데이트 확인
    const updatedUser = await dbService.users.get(user.uid);
    console.log("✅ 프로필 업데이트 성공:", updatedUser);
  } catch (error) {
    console.error("❌ 프로필 업데이트 실패:", error);
  }
}

testUpdateProfile();