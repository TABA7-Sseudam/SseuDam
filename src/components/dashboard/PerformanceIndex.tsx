interface PerformanceHistoryItem {
  date: string;  // 문자열로 저장된 날짜
  percent: number;
}

interface PerformanceIndexProps {
  history: PerformanceHistoryItem[];
}

const PerformanceIndex: React.FC<PerformanceIndexProps> = ({ history }) => {
  const latest = history[history.length - 1] || { percent: 0, date: new Date().toISOString() };

  const formatDate = (date: string | undefined) => {
    if (!date) return "날짜 정보 없음";
    const parsedDate = new Date(date);
    return isNaN(parsedDate.getTime()) ? "유효하지 않은 날짜" : parsedDate.toLocaleDateString();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">퍼포먼스 인덱스</h2>
      <p className="text-3xl text-blue-600 mb-2">{(latest.percent * 100).toFixed(1)}%</p>
      <p className="text-gray-500">{formatDate(latest.date)}</p>
    </div>
  );
};

export default PerformanceIndex;
