import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // ✅ Bootstrap 스타일 추가
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BellIcon, UserIcon, TrashIcon, LogOutIcon } from "lucide-react";


export function SettingsPage() {
  const navigate = useNavigate();
  const [isPushEnabled, setIsPushEnabled] = useState(true);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false); // ✅ 알림 설정 창 ON/OFF
  const [showDeleteModal, setShowDeleteModal] = useState(false); // ✅ 회원 탈퇴 모달

  // ✅ 로그아웃 핸들러
  const handleLogout = () => {
    console.log("🔴 로그아웃 완료!");
    navigate("/auth"); // 로그인 페이지로 이동
  };

  // ✅ 회원 탈퇴 핸들러 (확인 후 실행)
  const handleDeleteAccount = () => {
    console.log("⚠️ 계정이 삭제되었습니다!");
    navigate("/auth"); // 탈퇴 후 로그인 페이지로 이동
  };

  return (
    <div className="min-h-screen bg-white px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">⚙️ 설정</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 👤 계정 관리 */}
        <Card className="p-6 flex items-center justify-between cursor-pointer" onClick={() => navigate("/settings/account")}>
          <div className="flex items-center space-x-4">
            <UserIcon size={24} />
            <div>
              <h3 className="text-lg font-semibold">계정 관리</h3>
              <p className="text-sm text-gray-500">비밀번호 변경 및 로그인 설정</p>
            </div>
          </div>
        </Card>

       

        {/* 🔔 알림 설정 버튼 */}
        <Card className="p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <BellIcon size={24} />
            <div>
              <h3 className="text-lg font-semibold">알림 설정</h3>
              <p className="text-sm text-gray-500">푸시 알림 및 이메일 알림</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => setShowNotificationSettings(true)}>설정</Button>
        </Card>

        

        {/* 📦 데이터 관리 */}
        <Card className="p-6 flex items-center justify-between cursor-pointer" onClick={() => navigate("/settings/data")}>
          <div className="flex items-center space-x-4">
            <TrashIcon size={24} />
            <div>
              <h3 className="text-lg font-semibold">데이터 관리</h3>
              <p className="text-sm text-gray-500">캐시 삭제 및 저장 공간 확인</p>
            </div>
          </div>
        </Card>

       

        {/* 🚪 로그아웃 */}
        <Card className="p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <LogOutIcon size={24} />
            <div>
              <h3 className="text-lg font-semibold">로그아웃</h3>
              <p className="text-sm text-gray-500">현재 계정에서 로그아웃</p>
            </div>
          </div>
          <Button variant="destructive" onClick={handleLogout}>로그아웃</Button>
        </Card>

        {/* ❌ 회원 탈퇴 */}
        <Card className="p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <TrashIcon size={24} />
            <div>
              <h3 className="text-sm font-semibold text-red-600">회원 탈퇴</h3> {/* ✅ 작은 폰트 */}
              <p className="text-xs text-gray-500">계정을 영구적으로 삭제합니다</p>
            </div>
          </div>
          <Button variant="outline" className="text-red-600 border-red-600" onClick={() => setShowDeleteModal(true)}>
            회원 탈퇴
          </Button>
        </Card>
      </div>

      {/* ✅ 알림 설정 모달 창 */}
      {showNotificationSettings && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">🔔 푸시 알림 설정</h2>
            <div className="form-check form-switch">
              <input 
                className="form-check-input" 
                type="checkbox" 
                role="switch" 
                id="pushNotificationSwitch"
                checked={isPushEnabled}
                onChange={() => setIsPushEnabled(!isPushEnabled)}
              />
              <label className="form-check-label" htmlFor="pushNotificationSwitch">
                {isPushEnabled ? "푸시 알림: ON" : "푸시 알림: OFF"}
              </label>
            </div>
            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={() => setShowNotificationSettings(false)}>닫기</Button>
            </div>
          </div>
        </div>
      )}

      {/* ⚠️ 회원 탈퇴 확인 모달 */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold text-red-600 mb-4">⚠️ 정말 회원 탈퇴하시겠습니까?</h2>
            <p className="text-gray-600 mb-4">탈퇴 후 계정 복구는 불가능합니다.</p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowDeleteModal(false)}>취소</Button>
              <Button variant="destructive" onClick={handleDeleteAccount}>탈퇴하기</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );   
}   