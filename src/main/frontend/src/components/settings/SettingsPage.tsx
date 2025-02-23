import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { BellIcon, UserIcon, TrashIcon, LogOutIcon } from "lucide-react"
import styled from "styled-components"

export function SettingsPage() {
  const navigate = useNavigate()
  const [isPushEnabled, setIsPushEnabled] = useState(true)

  return (
    <div className="w-[400px] mx-auto min-h-screen flex flex-col bg-gray-50 text-gray-900 overflow-hidden shadow-xl rounded-xl">
      {/* 🔝 헤더 */}
      <div className="flex items-center justify-between px-6 py-5 bg-white shadow-md rounded-t-xl">
        <button onClick={() => navigate(-1)} className="text-gray-600 text-lg">←</button>
        <h1 className="text-xl font-semibold">설정</h1>
        <div className="w-6"></div> {/* 우측 정렬 맞추기 */}
      </div>

      {/* ⚙️ 설정 목록 */}
      <div className="mt-4 bg-white shadow-md rounded-xl flex-1 overflow-auto divide-y">
        <SettingItem icon={<UserIcon size={22} />} text="비밀번호 재설정" onClick={() => navigate("/settings/account")} />
        <SettingItem icon={<BellIcon size={22} />} text="알림 설정">
          <StyledToggleSwitch isEnabled={isPushEnabled} onToggle={() => setIsPushEnabled(!isPushEnabled)} />
        </SettingItem>
        <SettingItem icon={<LogOutIcon size={22} />} text="로그아웃" onClick={() => navigate("/auth")} />
        <SettingItem icon={<TrashIcon size={18} />} text="회원탈퇴" textColor="text-red-400 text-sm" className="py-3 px-4 opacity-80" onClick={() => navigate("/auth")} />
      </div>
    </div>
  )
}

/* ✅ 리스트 아이템 */
function SettingItem({ icon, text, onClick, children, textColor = "text-gray-900", className = "" }: { icon: React.ReactNode, text: string, onClick?: () => void, children?: React.ReactNode, textColor?: string, className?: string }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between px-6 py-4 ${className} transition cursor-pointer`}
    >
      <div className="flex items-center space-x-4">
        {icon}
        <span className={`font-medium ${textColor}`}>{text}</span>
      </div>
      {children || <span className="text-gray-400 text-lg">›</span>}
    </div>
  )
}

/* ✅ styled-components 기반 토글 스위치 */
const StyledToggleSwitch = ({ isEnabled, onToggle }: { isEnabled: boolean, onToggle: () => void }) => {
  return (
    <StyledWrapper isEnabled={isEnabled} onClick={onToggle}>
      <div className="slider">
        <div className="knob" />
      </div>
    </StyledWrapper>
  )
}

const StyledWrapper = styled.div<{ isEnabled: boolean }>`
  width: 60px;
  height: 30px;
  display: flex;
  align-items: center;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s;
  background-color: ${({ isEnabled }) => (isEnabled ? "#2196F3" : "lightgray")};
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.25) inset;
  padding: 2px;

  .slider {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    position: relative;
  }

  .knob {
    width: 26px;
    height: 26px;
    background-color: white;
    border-radius: 50%;
    transition: transform 0.3s, box-shadow 0.3s;
    box-shadow: 0 0 10px 3px rgba(0, 0, 0, 0.25);
    transform: ${({ isEnabled }) => (isEnabled ? "translateX(30px)" : "translateX(0)")};
  }
`;

export default SettingsPage;
