import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "@/lib/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Timestamp } from "firebase/firestore";  // Timestamp 가져오기

export function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;

        if (currentUser) {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser(userData);
          } else {
            setError("사용자 정보를 찾을 수 없습니다.");
          }
        } else {
          setError("로그인된 사용자가 없습니다.");
        }
      } catch (err) {
        console.error("❌ 사용자 정보 가져오기 실패:", err);
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  // Firestore 타임스탬프 처리
  const createdAt = user.createdAt instanceof Timestamp
    ? user.createdAt.toDate().toLocaleDateString()
    : "날짜 정보 없음";

  return (
    <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
        <div>
          <h2 className="text-xl font-bold">{user.username}</h2>
          <p className="text-gray-500">이메일: {user.email}</p>
          <p className="text-gray-500">가입일: {createdAt}</p>
        </div>
      </div>
      <div className="flex gap-4">
        <Button className="bg-black text-white" onClick={() => navigate("/waste-analysis")}>
          분리배출 시작
        </Button>
      </div>
    </div>
  );
}
