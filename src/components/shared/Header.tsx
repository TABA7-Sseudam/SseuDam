import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();


  

  return (
    <header className="p-4 border-b flex justify-between items-center bg-white">
      {/* 탭서버 핸드링 */}
      <h1 
        className="text-2xl font-bold cursor-pointer"
        onClick={() => navigate("/home")}
      >
        🔄 분리배출 AI 시스템
      </h1>

      {/* 모바일 메뉴 버튼 */}
      <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* 데스크톱 네비게이션 */}
      <nav className="hidden md:flex space-x-4">
        <Button variant="ghost" onClick={() => navigate("/home")}>홈</Button>
        <Button variant="ghost" onClick={() => navigate("/waste-analysis")}>분리배출</Button>
        <Button variant="ghost" onClick={() => navigate("/ranking")}>랭킹</Button>
        <Button variant="ghost" onClick={() => navigate("/rewards")}>게시판</Button>
        <Button variant="ghost" onClick={() => navigate("/guide")}>가이드</Button>
        <Button variant="ghost" onClick={() => navigate("/settings")}>설정</Button>
      </nav>
    </header>
  );
}
