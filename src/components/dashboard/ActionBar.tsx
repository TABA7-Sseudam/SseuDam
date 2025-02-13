import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

interface User {
  name: string;
  avatar: string;
}

interface ActionBarProps {
  users: User[];
}

const ActionBar: React.FC<ActionBarProps> = ({ users }) => {
  const newestUsers = users.slice(0, 3);
  const [date, setDate] = useState<Date | null>(new Date());
  const [notes, setNotes] = useState<{ [key: string]: string }>({});

  const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!date) return;
    setNotes({ ...notes, [date.toDateString()]: e.target.value });
  };

  const handleDateChange = (value: Date | Date[] | null) => {
    if (value instanceof Date) {
      setDate(value);
    } else if (Array.isArray(value) && value.length > 0) {
      setDate(value[0]);
    } else {
      setDate(null);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6 p-4 bg-gray-200 rounded-lg shadow-md">
      <div className="flex gap-3 items-center">
        {newestUsers.map((user, index) => (
          <Avatar key={index} className="ml-2">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
        ))}
        <Button className="bg-black text-white hover:bg-gray-900">
          <span className="mr-2">+</span> 초대하기
        </Button>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <Calendar 
            onChange={handleDateChange} 
            value={date} 
            className="rounded-lg shadow-md" 
            calendarType="gregory"
          />
          <input 
            type="text" 
            placeholder="메모를 입력하세요..." 
            value={date ? notes[date.toDateString()] || "" : ""} 
            onChange={handleNoteChange}
            className="mt-2 p-2 w-full border rounded-lg text-black"
          />
          {date && notes[date.toDateString()] && (
            <div className="mt-2 p-2 bg-gray-100 rounded-lg text-black">
              <strong>메모:</strong> {notes[date.toDateString()]}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActionBar;