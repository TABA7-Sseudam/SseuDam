import "bootstrap/dist/css/bootstrap.min.css"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export default function Rewards() {
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    console.log("Rewards 컴포넌트가 마운트되었습니다.")
  }, [])

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1))
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, 5))

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 사이드바 */}
      <div className="w-64 bg-white shadow-md flex flex-col border-r">
        <h2 className="p-4 text-xl font-bold border-b bg-gray-100">게시판</h2>
        <nav className="flex flex-col p-4 space-y-4">
          {["이용방법", "최근 소식", "법령 및 규정"].map((item) => (
            <a href="#" key={item} className="text-gray-700 hover:text-blue-600 transition font-medium no-underline">
              {item}
            </a>
          ))}
        </nav>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 p-8 bg-white flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-800">공지사항</h2>
          {/* 검색 영역 */}
          <div className="flex items-center space-x-3 mb-6 bg-gray-100 p-4 rounded-lg shadow-sm">
            <select className="border p-2 rounded text-gray-700 focus:ring-2 focus:ring-blue-400">
              <option>구분선택</option>
              <option>일반</option>
              <option>법령</option>
            </select>
            <input type="text" placeholder="검색어를 입력하세요" className="border p-2 flex-1 rounded focus:ring-2 focus:ring-blue-400" />
            <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition">검색</button>
          </div>

          {/* 공지사항 리스트 */}
          <table className="w-full border-collapse border-t text-left text-gray-700 shadow-sm">
            <thead className="bg-gray-100">
              <tr className="border-b">
                <th className="p-3 w-16">번호</th>
                <th className="p-3 w-20">분류</th>
                <th className="p-3">제목</th>
                <th className="p-3 w-32">등록일</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: '01', classification: '일반', title: '개인정보 처리방침 변경 안내', date: '2024-02-05' },
                { id: '02', classification: '법령', title: '법령 변경 사항 안내', date: '2024-02-05' },
                { id: '03', classification: '일반', title: '앱 버전', date: '2024-02-05' },
              ].map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-50 transition">
                  <td className="p-3 text-gray-500">{item.id}</td>
                  <td className="p-3">{item.classification}</td>
                  <td className="p-3 text-blue-600 hover:underline cursor-pointer">{item.title}</td>
                  <td className="p-3 text-gray-500">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        <div className="flex justify-center mt-6 p-4 bg-gray-50 rounded-t-lg shadow-inner">
          <Button onClick={handlePrevPage} disabled={currentPage === 1} className="mx-2 bg-black text-white hover:bg-gray-800">
            이전
          </Button>
          {[1, 2, 3, 4, 5].map((page) => (
            <Button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`mx-1 px-4 py-2 ${currentPage === page ? "bg-black text-white" : "bg-white border border-black text-black hover:bg-gray-100"}`}
            >
              {page}
            </Button>
          ))}
          <Button onClick={handleNextPage} disabled={currentPage === 5} className="mx-2 bg-black text-white hover:bg-gray-800">
            다음
          </Button>
        </div>
      </div>
    </div>
  )
}
