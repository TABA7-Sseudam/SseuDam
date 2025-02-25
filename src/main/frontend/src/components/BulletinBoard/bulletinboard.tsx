import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronsLeft, ChevronsRight, ArrowRightCircle, Pencil } from "lucide-react";
import BackgroundAnimation from "../layout/BackgroudAnimation";

interface BoardItem {
  id: string
  classification: string
  title: string
  date: string
}

export default function BulletinBoard() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;
  const [activeCategory, setActiveCategory] = useState<string | null>(null); // ✅ 선택한 카테고리 상태
  const categories = ["공지", "이벤트", "AI Feedback", "아파트게시판", "법령"];
  const [filteredData, setFilteredData] = useState<BoardItem[]>([]);

  useEffect(() => {
    console.log("BulletinBoard component mounted.");
    fetchData();
  }, []);

  const fetchData = () => {
    const data: BoardItem[] = [
      { id: '01', classification: '공지', title: '개인정보보호 규제 업데이트', date: '2024-02-01' },
      { id: '02', classification: '법령', title: '법적 규제 변경', date: '2024-02-06' },
      { id: '03', classification: '공지', title: '앱버전 배포', date: '2024-02-09' },
      { id: '04', classification: '아파트게시판', title: '📌 분리배출 꿀팁 공유', date: '2025-02-18' },
      { id: '05', classification: '아파트게시판', title: '🙏 분리배출 도와주셔서 감사합니다', date: '2025-02-16' },
      { id: '07', classification: '공지', title: '대형 폐기물 배출 안내', date: '2025-02-10' },
      { id: '08', classification: '이벤트', title: '제1회 아파트 분리배출 챌린지', date: '2025-02-18' },
      { id: '09', classification: '이벤트', title: '포인트 2배 적립 이벤트', date: '2025-02-14' },
      { id: '10', classification: '이벤트', title: '랭킹 1위에게 특별 선물!', date: '2025-02-01' },
      { id: '11', classification: 'AI Feedback', title: 'AI가 틀린 것 같아요', date: '2025-02-20' },
      { id: '12', classification: 'AI Feedback', title: 'AI 덕분에 분리배출 제대로 배웠어요!', date: '2025-02-19' },
      { id: '13', classification: '아파트게시판', title: '서로 조금씩 더 신경 써봐요!', date: '2025-02-20' },
      { id: '14', classification: '법령', title: '2025년부터 커피숍 일회용 컵 보증금제 시행', date: '2025-02-15' }
    ];
    setFilteredData(data);
  };

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePageClick = (page: number) => setCurrentPage(page);
  const handleCategoryClick = (category: string) => setActiveCategory(category);
  const handleResetCategory = () => setActiveCategory(null);

  // ✅ 글쓰기 버튼 클릭 시 선택한 게시판으로 이동하도록 설정
  const handleWritePost = () => {
    if (!activeCategory) {
      alert("⚠️ 먼저 게시판을 선택해주세요!");
      return;
    }
    alert(`📝 '${activeCategory}' 게시판에 글을 작성합니다.`);
    // ✅ 여기에 게시글 작성 페이지로 이동하는 코드 추가 가능 (예: navigate(`/write?category=${activeCategory}`))
  };

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: 'rgba(251, 248, 239, 0.9)' }}>
      <BackgroundAnimation />
      <div className="flex min-h-screen bg-green-50 relative z-50 pt-16">
        {/* 사이드바 - 카테고리 선택 */}
        <div className="w-64 bg-green-100 shadow-md flex flex-col border-r">
          <h2 className="p-4 text-xl font-bold border-b bg-green-200">Board</h2>
          <nav className="flex flex-col p-4 space-y-4">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => handleCategoryClick(item)}
                className={`text-gray-700 hover:text-green-600 transition font-medium no-underline flex items-center ${
                  activeCategory === item ? "text-green-700 font-bold" : ""
                }`}
              >
                <ArrowRightCircle className="mr-2" /> {item}
              </button>
            ))}
            <button
              onClick={handleResetCategory}
              className="mt-4 p-2 bg-green-500 text-white rounded-lg hover:bg-green-700 transition"
            >
              전체게시판
            </button>
          </nav>
        </div>

        {/* 메인 게시판 목록 */}
        <div className="flex-1 p-8 bg-white/80 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">{activeCategory || "Board"}</h2>
            <table className="w-full border-collapse border-t text-left text-gray-700 shadow-sm">
              <thead className="bg-green-100/80">
                <tr className="border-b">
                  <th className="p-3 w-16">Number</th>
                  <th className="p-3 w-20">Category</th>
                  <th className="p-3">Title</th>
                  <th className="p-3 w-32">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredData
                  .filter((item) => !activeCategory || item.classification === activeCategory)
                  .map((item, index) => (
                    <tr key={index} className="border-b hover:bg-green-50 transition">
                      <td className="p-3 text-gray-500">{item.id}</td>
                      <td className="p-3">{item.classification}</td>
                      <td className="p-3 text-green-600 hover:underline cursor-pointer">{item.title}</td>
                      <td className="p-3 text-gray-500">{item.date}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* 페이지네이션 & 글쓰기 버튼 */}
          <div className="flex flex-col items-center mt-6 p-4 bg-green-50/80 rounded-t-lg shadow-inner">
            <Button
              onClick={handleWritePost}
              className="mb-4 bg-green-600 text-white hover:bg-green-700 flex items-center px-6 py-2 rounded-lg"
            >
              <Pencil className="mr-2" /> 글쓰기
            </Button>
            <div className="flex justify-center">
              <Button onClick={handlePrevPage} disabled={currentPage === 1} className="mx-2 bg-green-500 text-white hover:bg-green-700 flex items-center">
                <ChevronsLeft className="mr-1" /> Previous
              </Button>
              {[1, 2, 3, 4, 5].map((page) => (
                <Button key={page} onClick={() => handlePageClick(page)} className={`mx-1 px-4 py-2 ${currentPage === page ? "bg-green-700 text-white" : "bg-green-300 border border-black text-black hover:bg-green-500"}`}>
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded mx-2 text-white"
                style={{ backgroundColor: 'rgba(217, 234, 244, 0.9)' }}
              >
                <ChevronsRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
