import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

// Menu items with their paths and restricted status
const MENU_ITEMS = [
  { name: "홈", path: "/home", restricted: true },
  { name: "분리배출", path: "/waste-analysis", restricted: true },
  { name: "랭킹", path: "/ranking", restricted: true },
  { name: "리워드", path: "/rewards", restricted: true },
  { name: "가이드", path: "/guide", restricted: false },
  { name: "설정", path: "/settings", restricted: true },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [targetPath, setTargetPath] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      setIsGuest(userData.isGuest || false);
    }
  }, []);

  const handleNavigation = (path: string, restricted: boolean) => {
    if (isGuest && restricted) {
      setTargetPath(path);
      setShowLoginAlert(true);
    } else {
      navigate(path);
    }
  };

  const handleLogin = () => {
    setShowLoginAlert(false);
    navigate("/auth");
  };

  return (
    <>
      <header className="p-4 border-b flex justify-between items-center bg-white">
        <h1 
          className="text-2xl font-bold cursor-pointer flex items-center"
          onClick={() => navigate("/home")}
        >
          🔄 <span className="ml-2">EcoSort AI</span>
        </h1>

        {/* Mobile menu button */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex space-x-4">
          {MENU_ITEMS.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              onClick={() => handleNavigation(item.path, item.restricted)}
              className={isGuest && item.restricted ? "text-gray-400" : ""}
            >
              {item.name}
              {isGuest && item.restricted && (
                <span className="ml-1 text-xs">🔒</span>
              )}
            </Button>
          ))}
        </nav>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white border-b shadow-lg md:hidden">
            <nav className="flex flex-col p-4">
              {MENU_ITEMS.map((item) => (
                <Button
                  key={item.path}
                  variant="ghost"
                  onClick={() => {
                    handleNavigation(item.path, item.restricted);
                    setIsMenuOpen(false);
                  }}
                  className={`justify-start ${
                    isGuest && item.restricted ? "text-gray-400" : ""
                  }`}
                >
                  {item.name}
                  {isGuest && item.restricted && (
                    <span className="ml-1 text-xs">🔒</span>
                  )}
                </Button>
              ))}
            </nav>
          </div>
        )}
      </header>

      <AlertDialog open={showLoginAlert} onOpenChange={setShowLoginAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>로그인이 필요한 서비스입니다</AlertDialogTitle>
            <AlertDialogDescription>
              {`'${MENU_ITEMS.find(item => item.path === targetPath)?.name}' 기능은 로그인 후 이용 가능합니다.`}
              <br />
              로그인 페이지로 이동하시겠습니까?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowLoginAlert(false)}>
              취소
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleLogin}>
              로그인하기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
