"use client"

import { useEffect, useState, useMemo } from "react"
import { ArrowRightCircle, Search, ChevronsLeft, ChevronsRight } from "lucide-react"
import BackgroundAnimation from "../layout/BackgroudAnimation"

interface BoardItem {
  id: string
  classification: string
  title: string
  date: string
}

export default function BulletinBoard() {
  const [activeCategory, setActiveCategory] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 10

  const rawCategories = ["공지", "이벤트", "AI Feedback", "아파트게시판", "법령"]
  const categories = ["공지", "전체게시판", ...rawCategories.filter(c => c !== "공지")]

  // 모바일에서만 줄바꿈 처리 (아파트게시판, AI Feedback)
  const formatCategoryLabel = (category: string) => {
    if (category === "아파트게시판") {
      return <>아파트<br />게시판</>;
    } else if (category === "AI Feedback") {
      return <>AI<br />Feedback</>;
    }
    return category;
  };

  const [data, setData] = useState<BoardItem[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = () => {
    const newData: BoardItem[] = [
      { id: '1', classification: '공지',         title: '개인정보보호 규제 업데이트',       date: '2024-02-01' },
      { id: '2', classification: '법령',         title: '법적 규제 변경',                 date: '2024-02-06' },
      { id: '3', classification: '공지',         title: '앱버전 배포',                   date: '2024-02-09' },
      { id: '4', classification: '아파트게시판',  title: '📌 분리배출 꿀팁 공유',          date: '2025-02-18' },
      { id: '5', classification: '아파트게시판',  title: '🙏 분리배출 도와주셔서 감사합니다', date: '2025-02-16' },
      { id: '6', classification: '공지',         title: '분리수거 앱 업데이트 안내',        date: '2025-02-12' },
      { id: '7', classification: '공지',         title: '대형 폐기물 배출 안내',          date: '2025-02-10' },
      { id: '8', classification: '이벤트',        title: '제1회 아파트 분리배출 챌린지',   date: '2025-02-18' },
      { id: '9', classification: '이벤트',        title: '포인트 2배 적립 이벤트',          date: '2025-02-14' },
      { id: '10', classification: '이벤트',        title: '랭킹 1위에게 특별 선물!',        date: '2025-02-01' },
      { id: '11', classification: 'AI Feedback',   title: 'AI가 틀린 것 같아요',            date: '2025-02-20' },
      { id: '12', classification: 'AI Feedback',   title: 'AI 덕분에 분리배출 제대로 배웠어요!', date: '2025-02-19' },
      { id: '13', classification: '아파트게시판',  title: '서로 조금씩 더 신경 써봐요!',    date: '2025-02-20' },
      { id: '14', classification: '법령',         title: '2025년부터 커피숍 일회용 컵 보증금제 시행', date: '2025-02-15' },
    ]
    setData(newData)
  }

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category === "전체게시판" ? "" : category)
    setCurrentPage(1)
  }

  const handleSearch = () => {
    console.log("검색어:", searchTerm)
  }

  const filteredItems = useMemo(() => {
    // 먼저 검색어와 카테고리로 필터링
    const filtered = data
      .filter(item => !activeCategory || item.classification === activeCategory)
      .filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()))

    // 전체게시판이거나 공지 카테고리일 때만 공지사항 정렬 적용
    if (activeCategory === "" || activeCategory === "공지") {
      // 공지사항과 일반 게시물을 분리
      const notices = filtered.filter(item => item.classification === "공지")
      const nonNotices = filtered.filter(item => item.classification !== "공지")
      
      // 각각 날짜순으로 정렬 후 합치기
      return [
        ...notices.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
        ...nonNotices.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      ]
    }

    // 다른 카테고리의 경우 날짜순 정렬
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [data, activeCategory, searchTerm])

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage))

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredItems.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredItems, currentPage])

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: 'rgba(251, 248, 239, 0.9)' }}>
      <BackgroundAnimation />

      <div className="relative z-10 min-h-screen">
        {/* Mobile categories - 줄바꿈 적용 */}
        <div
          className="md:hidden p-4 flex flex-wrap gap-2 justify-center shadow-md"
          style={{ backgroundColor: 'rgba(217, 234, 244, 0.9)' }}
        >
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => handleCategoryClick(item)}
              className={`px-4 py-2 rounded-lg border text-gray-700 hover:bg-blue-600 hover:text-white 
                ${activeCategory === item || (item === "전체게시판" && activeCategory === "") ? "bg-blue-600 text-white" : "bg-white"}`}
              style={{ borderColor: 'rgba(217, 234, 244, 0.9)' }}
            >
              {formatCategoryLabel(item)}
            </button>
          ))}
        </div>

        {/* Main content area */}
        <div className="flex min-h-screen">
          {/* Sidebar - Fixed position and full height (Board 부분, 줄바꿈 없이 표시) */}
          <div
            className="hidden md:flex w-64 flex-col border-r fixed h-screen overflow-y-auto"
            style={{ backgroundColor: 'rgba(217, 234, 244, 0.9)' }}
          >
            <h2 className="p-4 text-xl font-bold border-b">Board</h2>
            <nav className="flex flex-col p-4 space-y-4">
              {categories.map((item) => (
                <button
                  key={item}
                  onClick={() => handleCategoryClick(item)}
                  className={`text-gray-700 hover:text-blue-600 transition font-medium no-underline flex items-center 
                    ${activeCategory === item || (item === "전체게시판" && activeCategory === "") ? "text-blue-700 font-bold" : ""}`}
                >
                  <ArrowRightCircle className="mr-2" /> {item}
                </button>
              ))}
            </nav>
          </div>

          {/* Main content - Full height and with minimum height */}
          <div className="flex-1 p-8 bg-white shadow-lg md:ml-64 min-h-screen flex flex-col">
            {/* Search bar */}
            <div className="flex justify-end items-center gap-2 mb-4">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="검색어 입력"
                className="border p-2 rounded-lg w-64"
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2 rounded-lg text-white flex items-center hover:opacity-90"
                style={{ backgroundColor: 'rgba(217, 234, 244, 0.9)' }}
              >
                <Search className="mr-1" /> 검색
              </button>
            </div>

            {/* Board table */}
            <div className="flex-grow">
              <table className="w-full border-collapse border-t text-left text-gray-700 shadow-md">
                <thead
                  className="sticky top-0 z-10"
                  style={{ backgroundColor: 'rgba(217, 234, 244, 0.9)' }}
                >
                  <tr className="border-b">
                    <th className="p-3 w-16">Number</th>
                    <th className="p-3 w-20">Category</th>
                    <th className="p-3">Title</th>
                    <th className="p-3 w-32">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedItems.map((item, index) => (
                    <tr 
                      key={item.id} 
                      className={`border-b hover:bg-blue-50 transition
                        ${item.classification === "공지" ? "bg-yellow-50" : ""}`}
                    >
                      <td className="p-3 text-gray-500">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="p-3">
                        {item.classification === "공지" ? (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                            {item.classification}
                          </span>
                        ) : (
                          formatCategoryLabel(item.classification)
                        )}
                      </td>
                      <td className={`p-3 hover:underline cursor-pointer ${
                        item.classification === "공지" ? "text-yellow-800 font-medium" : "text-blue-600"
                      }`}>
                        {item.title}
                      </td>
                      <td className="p-3 text-gray-500">{item.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded mx-2 text-white"
                style={{ backgroundColor: 'rgba(217, 234, 244, 0.9)' }}
              >
                <ChevronsLeft />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`mx-1 px-3 py-1 rounded transition ${
                    currentPage === page
                      ? 'text-white'
                      : 'text-black border border-black'
                  }`}
                  style={{
                    backgroundColor: currentPage === page
                      ? 'rgba(217, 234, 244, 0.9)'
                      : 'rgba(251, 248, 239, 0.9)'
                  }}
                >
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
  )
}
