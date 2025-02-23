import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase/firebase";

interface ActionBarProps {
  users: Array<{
    name: string;
    avatar: string;
  }>;
}

interface Note {
  [key: string]: string;
}

const ActionBar: React.FC<ActionBarProps> = ({ users }) => {
  const [date, setDate] = useState<Date | null>(new Date());
  const [notes, setNotes] = useState<Note>({});
  const [inputValue, setInputValue] = useState("");

  // 컴포넌트 마운트 시 저장된 메모 불러오기
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

  // 저장 버튼 클릭 시 메모 저장
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

  // 엔터 키로도 저장 가능하도록 유지
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

  // 메모 삭제 기능 추가
  const handleDeleteNote = (dateKey: string) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const updatedNotes = { ...notes };
    delete updatedNotes[dateKey];
    
    setNotes(updatedNotes);
    localStorage.setItem(`notes_${currentUser.uid}`, JSON.stringify(updatedNotes));
  };

  return (
    <div className=" flex flex-col items-center gap-4 p-4 bg-#E8EFF4 rounded-lg shadow-lg">
      {users.length > 0 && (
        <div className="flex gap-2 mb-4">
          {users.map((user, index) => (
            <div key={index} className="flex items-center gap-2">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm text-gray-700">{user.name}</span>
            </div>
          ))}
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