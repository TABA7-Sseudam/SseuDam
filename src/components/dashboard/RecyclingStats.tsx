import { useEffect, useState } from "react";
import api from "@/api/axiosInstance";
export function RecyclingStats() {
  const [user, setUser] = useState({
    grade: "",
    points: 0,
    nextLevelPoints: 0, // 🔹 승급까지 필요한 포인트 추가
  });
  useEffect(() => {
    api.get("/user")
      .then((res) => setUser(res.data))
      .catch((err) => console.error("API 요청 오류:", err));
  }, []);
    return (
      <section>
        <h2 className="text-3xl font-bold mb-2">최근 분리배출 기록</h2>
        <p className="text-gray-600 mb-8">성공률 차트 및 배출 횟수</p>

        {/* 분리배출 정보와 차트 영역 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 왼쪽: 분리배출 정보 */}
          <div className="rounded-lg border p-6 bg-white shadow-md">
            <div className="flex gap-6 mb-4">
              <div className="w-24 h-24 bg-gray-200 rounded"></div>
              <div>
                <h3 className="text-lg font-semibold">분리배출 성공률</h3>
                <p className="text-3xl font-bold mb-2">90%</p>
                <p className="text-gray-600 text-sm bg-gray-100 px-2 py-1 rounded inline-block">
                  가장 잘 분리배출한 재질: 플라스틱
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
              <span className="text-gray-600 text-sm">AI 분석 결과</span>
            </div>
          </div>

          {/* 오른쪽: 차트 영역 */}
          <div className="bg-gray-200 rounded-lg aspect-square"></div>
        </div>
        {/*bottom*/}
        <br></br>
        <h2 className="mb-6 text-2xl font-bold">환경 보호등급 정보</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-lg border bg-white p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-gray-500">현재 등급</h3>
          <p className="text-4xl font-bold">{user.grade}</p>
        </div>
        <div className="rounded-lg border bg-white p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-gray-500">승급까지 필요한 포인트</h3>
          <p className="text-4xl font-bold">{user.nextLevelPoints > 0 ? `${user.nextLevelPoints} point` : "최고 등급"}</p>
        </div>
      </div>
      </section>
      
      
    );
  }
