import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* ✅ 홈 버튼 클릭 시 `/home`으로 이동 */}
        <h1
          className="text-xl font-bold cursor-pointer"
          onClick={() => navigate("/home")}
        >
          분리배출 AI 시스템
        </h1>

        {/* 모바일 메뉴 버튼 */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* 데스크톱 네비게이션 */}
        <nav className="hidden md:flex space-x-4">
          <Button variant="ghost" onClick={() => navigate("/home")}>홈</Button>
          <Button variant="ghost" onClick={() => navigate("/rewards")}>리워드</Button>
          <Button variant="ghost" onClick={() => navigate("/guide")}>가이드</Button>
          <Button variant="ghost" onClick={() => navigate("/settings")}>설정</Button>
        </nav>
      </div>

      {/* 모바일 메뉴 */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container mx-auto px-4 py-2 flex flex-col space-y-2">
            <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/home")}>홈</Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/rewards")}>리워드</Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/guide")}>가이드</Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/settings")}>설정</Button>
          </div>
        </div>
      )}
    </header>
  );
}
