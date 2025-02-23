import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
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

// 메뉴 항목 정의
const MENU_ITEMS = [
  { name: "홈", path: "/home", restricted: true },
  { name: "분리배출", path: "/waste-analysis", restricted: true },
  { name: "랭킹", path: "/ranking", restricted: true },
  { name: "게시판", path: "/bulletinboard", restricted: true },
  { name: "가이드", path: "/guide", restricted: false },
  { name: "설정", path: "/settings", restricted: true },
];

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  
  // State variables
  const [activeTab, setActiveTab] = useState(location.pathname);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [targetPath, setTargetPath] = useState("");
  const [indicatorStyle, setIndicatorStyle] = useState({});

  // Check user status on component mount
  useEffect(() => {
    const user = localStorage.getItem("user");
    const admin = localStorage.getItem("isAdmin");

    if (user) {
      try {
        const userData = JSON.parse(user);
        setIsGuest(userData.isGuest || false);
        setIsAdmin(false);
      } catch (error) {
        console.error("localStorage user 파싱 오류:", error);
        setIsGuest(false);
        setIsAdmin(false);
      }
    } else {
      setIsGuest(false);
      setIsAdmin(false);
    }

    // isAdmin 값이 "true"인 경우 관리자 권한 부여
    setIsAdmin(admin === "true");
  }, []);

  // Update active tab and indicator when location changes
  useEffect(() => {
    setActiveTab(location.pathname);
    updateIndicator();
  }, [location.pathname]);

  // Update the position of the active tab indicator
  const updateIndicator = () => {
    if (menuRef.current) {
      const activeElement = menuRef.current.querySelector(".is-active") as HTMLElement;
      if (activeElement) {
        setIndicatorStyle({
          width: `${activeElement.offsetWidth}px`,
          left: `${activeElement.offsetLeft}px`,
        });
      }
    }
  };

  // Navigation handling with restriction checks
  const handleNavigation = (path: string, restricted: boolean) => {
    if (isGuest && restricted) {
      setTargetPath(path);
      setShowLoginAlert(true);
    } else {
      setActiveTab(path);
      navigate(path);
    }
  };

  // Login dialog handlers
  const handleLogin = () => {
    setShowLoginAlert(false);
    navigate("/auth");
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isAdmin");
    setIsGuest(false);
    setIsAdmin(false);
    navigate("/");
  };

  return (
    <>
      <header className="bg-white border-b py-4 fixed top-0 left-0 w-full z-50 shadow-md backdrop-blur-md bg-opacity-95 h-16 flex items-center">
        <div className="container mx-auto flex items-center justify-between px-4">
          <h1
            className="text-2xl font-bold cursor-pointer flex items-center"
            onClick={() => navigate("/home")}
          >
            🔄 <span className="ml-2">EcoSort AI</span>
          </h1>

          {/* 데스크톱 내비게이션 - 탭 스타일 */}
          <nav className="hidden md:flex relative bg-white px-4 py-2 rounded-full shadow-md" ref={menuRef}>
            {MENU_ITEMS.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path, item.restricted)}
                className={`px-6 py-3 font-medium transition relative ${
                  activeTab === item.path 
                    ? "text-blue-600 font-bold is-active" 
                    : isGuest && item.restricted ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {item.name}
                {isGuest && item.restricted && <span className="ml-1 text-xs">🔒</span>}
              </button>
            ))}
            {/* 애니메이션 바 */}
            <div
              className="absolute bottom-0 h-1 bg-blue-600 rounded-t-md transition-all"
              style={indicatorStyle}
            ></div>
          </nav>

          {/* 로그인 상태 & 관리자 버튼 */}
          <div className="hidden md:flex items-center space-x-2">
            {isAdmin && (
              <Link to="/admin">
                <Button variant="outline" className="bg-blue-500 text-white hover:bg-blue-600">
                  관리자
                </Button>
              </Link>
            )}
            <Button
              variant="outline"
              className="bg-red-500 text-white hover:bg-red-600"
              onClick={handleLogout}
            >
              로그아웃
            </Button>
          </div>

          {/* 모바일 메뉴 버튼 */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* 모바일 내비게이션 */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white border-b shadow-lg md:hidden z-50">
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
                    activeTab === item.path 
                      ? "text-blue-600 font-bold" 
                      : isGuest && item.restricted ? "text-gray-400" : ""
                  }`}
                >
                  {item.name}
                  {isGuest && item.restricted && <span className="ml-1 text-xs">🔒</span>}
                </Button>
              ))}
              {isAdmin && (
                <Link to="/admin">
                  <Button
                    variant="outline"
                    className="bg-blue-500 text-white hover:bg-blue-600 justify-start mt-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    관리자
                  </Button>
                </Link>
              )}
              <Button
                variant="outline"
                className="bg-red-500 text-white hover:bg-red-600 justify-start mt-2"
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
              >
                로그아웃
              </Button>
            </nav>
          </div>
        )}
      </header>

      {/* 로그인 안내 모달 */}
      <AlertDialog open={showLoginAlert} onOpenChange={setShowLoginAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>로그인이 필요한 서비스입니다</AlertDialogTitle>
            <AlertDialogDescription>
              {`'${
                MENU_ITEMS.find((item) => item.path === targetPath)?.name
              }' 기능은 로그인 후 이용 가능합니다.`}
              <br />
              로그인 페이지로 이동하시겠습니까?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowLoginAlert(false)}>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogin}>로그인하기</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}