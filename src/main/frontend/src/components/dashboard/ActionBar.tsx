import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase/firebase";

interface Note {
  [key: string]: string;
}

const ActionBar: React.FC<{ userData: any }> = ({ userData }) => {
  const [date, setDate] = useState<Date | null>(new Date());
  const [notes, setNotes] = useState<Note>({});
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const savedNotes = localStorage.getItem(`notes_${currentUser.uid}`);
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      }
    }
  }, []);

  const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSaveNote = () => {
    if (!date || !inputValue.trim()) return;

    const currentUser = auth.currentUser;
    if (!currentUser) {
      alert("로그인이 필요합니다.");
      return;
    }

    const updatedNotes = {
      ...notes,
      [date.toDateString()]: inputValue
    };

    setNotes(updatedNotes);
    localStorage.setItem(`notes_${currentUser.uid}`, JSON.stringify(updatedNotes));
    setInputValue(""); // 입력 필드 초기화
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSaveNote();
    }
  };

  const handleDateChange = (value: Date | Date[] | null) => {
    if (value instanceof Date) {
      setDate(value);
      setInputValue(notes[value.toDateString()] || "");
    }
  };

  const handleDeleteNote = (dateKey: string) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const updatedNotes = { ...notes };
    delete updatedNotes[dateKey];

    setNotes(updatedNotes);
    localStorage.setItem(`notes_${currentUser.uid}`, JSON.stringify(updatedNotes));
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-gray-100 rounded-lg shadow-lg">
      {/* 사용자 프로필 정보 가져오기 */}
      {userData && (
        <div className="flex gap-2 mb-4 items-center">
          <img
            src={userData.selectedIcon || "/default-avatar.png"} // 사용자 프로필 아이콘 적용
            alt="사용자 아이콘"
            className="w-10 h-10 rounded-full border border-gray-300"
          />
          <span className="text-lg font-semibold text-gray-800">
            {userData.nickname || "사용자"}
          </span>
        </div>
      )}

      <div className="text-center mb-2 font-semibold text-black text-lg">
        📅 날짜 선택
      </div>

      <Calendar
        onChange={handleDateChange}
        value={date}
        className="rounded-lg shadow-md text-black"
        calendarType="gregory"
      />

      <div className="w-full flex gap-2">
        <input
          type="text"
          placeholder="메모를 입력하세요..."
          value={inputValue}
          onChange={handleNoteChange}
          onKeyDown={handleKeyDown}
          className="flex-1 mt-2 p-2 border rounded-lg text-black"
        />
        <Button
          onClick={handleSaveNote}
          className="mt-2 bg-green-600 hover:bg-green-700 text-white"
          disabled={!inputValue.trim()}
        >
          저장
        </Button>
      </div>

      {Object.keys(notes).length > 0 && (
        <div className="w-full bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">📌 저장된 메모</h3>
          <ul className="max-h-40 overflow-y-auto">
            {Object.entries(notes)
              .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
              .map(([dateKey, note]) => (
                <li key={dateKey} className="p-2 border-b text-black flex justify-between items-center">
                  <div>
                    <strong>{dateKey}:</strong> {note}
                  </div>
                  <button
                    onClick={() => handleDeleteNote(dateKey)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    ❌
                  </button>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ActionBar;
