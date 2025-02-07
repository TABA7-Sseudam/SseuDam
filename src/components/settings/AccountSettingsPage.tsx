import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ useNavigate 추가
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import "bootstrap/dist/css/bootstrap.min.css"; // ✅ Bootstrap 스타일 추가

export function AccountSettingsPage() {
  const navigate = useNavigate(); // ✅ 페이지 이동 훅 추가

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [autoLogin, setAutoLogin] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [error, setError] = useState("");

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    setError("");
    alert("✅ 비밀번호가 변경되었습니다!");

    // ✅ 변경 완료 후 홈 화면으로 이동
    setTimeout(() => navigate("/home"), 1000); // 1초 후 홈으로 이동
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">🔐 계정 관리</h2>

        {/* 기존 비밀번호 입력 */}
        <div className="mb-3">
          <label className="form-label">현재 비밀번호</label>
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="현재 비밀번호 입력"
            />
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* 새로운 비밀번호 입력 */}
        <div className="mb-3">
          <label className="form-label">새 비밀번호</label>
          <input
            type="password"
            className="form-control"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="새 비밀번호 입력"
          />
        </div>

        {/* 비밀번호 재확인 */}
        <div className="mb-3">
          <label className="form-label">비밀번호 재확인</label>
          <input
            type="password"
            className="form-control"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="새 비밀번호 다시 입력"
          />
        </div>

        {/* 오류 메시지 */}
        {error && <p className="text-danger text-sm">{error}</p>}

        {/* 저장 버튼 */}
        <Button className="w-full mt-2" onClick={handleChangePassword}>
          비밀번호 변경
        </Button>

        <hr className="my-4" />

        {/* 로그인 설정 */}
        <h3 className="text-lg font-semibold mb-3">🔧 로그인 설정</h3>

        {/* 자동 로그인 */}
        <div className="form-check form-switch mb-2">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id="autoLogin"
            checked={autoLogin}
            onChange={() => setAutoLogin(!autoLogin)}
          />
          <label className="form-check-label" htmlFor="autoLogin">
            자동 로그인 활성화
          </label>
        </div>

        {/* 2단계 인증 */}
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id="twoFactorAuth"
            checked={twoFactorAuth}
            onChange={() => setTwoFactorAuth(!twoFactorAuth)}
          />
          <label className="form-check-label" htmlFor="twoFactorAuth">
            2단계 인증 사용
          </label>
        </div>

        {/* ❗ 추가: 직접 홈으로 이동하는 버튼 */}
        <Button variant="outline" className="w-full mt-4" onClick={() => navigate("/home")}>
          홈으로 돌아가기
        </Button>
      </div>
    </div>
  );
}
