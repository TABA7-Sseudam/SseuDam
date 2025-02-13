import React from "react";

interface EnvironmentalGradeProps {
  currentGrade?: string;
  pointsToNextGrade?: string;
  grade?: string;  // 추가된 프로퍼티
  nextGrade?: string;  // 추가된 프로퍼티
}

const EnvironmentalGrade: React.FC<EnvironmentalGradeProps> = ({ currentGrade, pointsToNextGrade, grade, nextGrade }) => {
  return (
    <div className="grid grid-cols-2 gap-4 mt-6">
      <div className="p-4 bg-gray-100 rounded-lg text-center">
        <h3 className="text-lg font-semibold">현재 등급</h3>
        <p className="text-2xl font-bold text-blue-600">{currentGrade || grade}</p>
      </div>
      <div className="p-4 bg-gray-100 rounded-lg text-center">
        <h3 className="text-lg font-semibold">승급까지 필요한 포인트</h3>
        <p className="text-2xl font-bold text-green-600">{pointsToNextGrade || nextGrade}</p>
      </div>
    </div>
  );
};

export default EnvironmentalGrade;
