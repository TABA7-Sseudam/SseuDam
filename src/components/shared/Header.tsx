import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; // Link 추가
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
  const [isAdmin, setIsAdmin] = useState(false); // 관리자 여부 상태 추가
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [targetPath, setTargetPath] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    const admin = localStorage.getItem("isAdmin");

    if (user) {
      // user가 "admin" 문자열이면 관리자
      if (user === "admin") {
        setIsAdmin(true);
        setIsGuest(false);
      } else { // 그 외의 경우는 객체로 된 user 데이터
        try {
          const userData = JSON.parse(user);
          setIsGuest(userData.isGuest || false);
          setIsAdmin(false); // user 데이터가 있으면 일반 사용자
        } catch (error) {
          console.error("localStorage user 파싱 오류:", error);
          setIsGuest(false);
          setIsAdmin(false);
        }
      }
    } else {
      setIsGuest(false); // user 값이 없으면 로그인되지 않은 상태
      setIsAdmin(false);
    }

     // isAdmin은 별도로 처리 (boolean)
     setIsAdmin(admin === "true");

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

  const handleLogout = () => {
    // 로그아웃 처리: localStorage에서 사용자 정보 제거
    localStorage.removeItem("user");
    localStorage.removeItem("isAdmin"); // 관리자 정보도 제거
    setIsGuest(false);
    setIsAdmin(false); // 상태 업데이트
    navigate("/"); // 로그아웃 후 홈페이지 또는 로그인 페이지로 이동
  };

  return (
    <>
      <header className="bg-white border-b py-4">
        <div className="container mx-auto flex items-center justify-between px-4">
          {" "}
          {/* px-4 추가 */}
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
            {isAdmin && (
              <Link to="/admin">
                <Button
                  variant="outline"
                  className="bg-blue-500 text-white hover:bg-blue-600"
                >
                  관리자
                </Button>
              </Link>
            )}
            {/*로그아웃 버튼*/}
            <Button variant="outline" className="bg-red-500 text-white hover:bg-red-600" onClick={handleLogout}>
                로그아웃
            </Button>
          </nav>

          {/* Mobile navigation */}
          {isMenuOpen && (
            <div className="absolute top-16 left-0 right-0 bg-white border-b shadow-lg md:hidden z-10">
              {" "}
              {/* z-index 추가 */}
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
                {isAdmin && ( // Mobile에서도 관리자 버튼 표시
                    <Link to="/admin">
                    <Button
                      variant="outline"
                      className="bg-blue-500 text-white hover:bg-blue-600 justify-start" // 시작 정렬
                      onClick={() => setIsMenuOpen(false)} // 메뉴 닫기
                    >
                      관리자
                    </Button>
                  </Link>
                )}
                  <Button //로그아웃 버튼
                    variant="outline"
                    className="bg-red-500 text-white hover:bg-red-600 justify-start"  // 시작 정렬
                    onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false); // 메뉴 닫기
                    }}
                    >
                    로그아웃
                    </Button>
              </nav>
            </div>
          )}
        </div>
      </header>

      <AlertDialog open={showLoginAlert} onOpenChange={setShowLoginAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>로그인이 필요한 서비스입니다</AlertDialogTitle>
            <AlertDialogDescription>
              {`'${
                MENU_ITEMS.find(item => item.path === targetPath)?.name
              }' 기능은 로그인 후 이용 가능합니다.`}
              <br />
              로그인 페이지로 이동하시겠습니까?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowLoginAlert(false)}>
              취소
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleLogin}>로그인하기</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}