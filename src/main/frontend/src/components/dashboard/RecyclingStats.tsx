import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

/** 재질별 평균 성공률(월별), 최근 분석(주별) 등에 필요한 타입들 */
interface MonthlyData {
  material: string;
  avg_success: number;
}
interface AnalysisData {
  analysis_date: string;
  material: string;
  success_percent: number;
}

/**
 * 분리배출 통계를 보여주는 메인 컴포넌트
 * - localStorage에서 user 데이터를 가져와 state(safeUserData)에 저장
 * - 카드(주간/월별/월별비교)를 슬라이드로 전환하며 시각화
 */
export default function RecyclingStats() {
  const [safeUserData, setSafeUserData] = useState<{
    apartmentMonthlyAvgSuccess: Record<string, number>;
    userMonthlyAvgSuccess: Record<string, number>;
    monthlyMaterialSuccessRates: Record<string, MonthlyData[]>;
    recentAnalysis: AnalysisData[];
  }>({
    apartmentMonthlyAvgSuccess: {},
    userMonthlyAvgSuccess: {},
    monthlyMaterialSuccessRates: {},
    recentAnalysis: [],
  });

  // 마운트 시 localStorage("user")에서 통계 데이터 파싱
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        console.log("[DEBUG] 로컬 스토리지에서 불러온 user:", parsed);

        setSafeUserData({
          apartmentMonthlyAvgSuccess: parsed.apartmentMonthlyAvgSuccess || {},
          userMonthlyAvgSuccess: parsed.userMonthlyAvgSuccess || {},
          monthlyMaterialSuccessRates: parsed.monthlyMaterialSuccessRates || {},
          recentAnalysis: parsed.recentAnalysis || [],
        });
      } catch (err) {
        console.error("로컬 스토리지 파싱 에러:", err);
      }
    } else {
      console.log("[DEBUG] localStorage에 user 없음");
    }
  }, []);

  console.log("[RENDER] safeUserData:", safeUserData);

  // 데이터가 있는지 확인
  const hasData =
    Object.keys(safeUserData.apartmentMonthlyAvgSuccess).length > 0 ||
    Object.keys(safeUserData.monthlyMaterialSuccessRates).length > 0 ||
    safeUserData.recentAnalysis.length > 0;

  // 카드 인덱스(주간 / 월별 / 비교)
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const nextCard = () => setCurrentCardIndex((prev) => (prev + 1) % 3);
  const prevCard = () => setCurrentCardIndex((prev) => (prev - 1 + 3) % 3);

  // 데이터가 없다면 안내
  if (!hasData) {
    return (
      <div className="w-full h-full">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          ♻️ 분리배출 기록
        </h1>
        <div className="w-full h-[calc(100%-4rem)] flex items-center justify-center bg-white rounded-lg shadow-lg p-4">
          <p className="text-gray-500 text-center">
            현재 표시할 데이터가 없습니다
          </p>
        </div>
      </div>
    );
  }

  // 메인 렌더
  return (
    <div className="w-full h-full">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        ♻️ 분리배출 기록
      </h1>

      <div className="w-full h-[calc(100%-4rem)] relative bg-white rounded-lg shadow-lg p-4">
        {/* 좌우 슬라이드 버튼 */}
        <Button
          onClick={prevCard}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-300 text-white px-4 py-2 rounded-full hover:bg-gray-500 transition-all z-10"
        >
          ←
        </Button>
        <Button
          onClick={nextCard}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-300 text-white px-4 py-2 rounded-full hover:bg-gray-500 transition-all z-10"
        >
          →
        </Button>

        <AnimatePresence mode="wait">
          {currentCardIndex === 0 && (
            <motion.div
              key="weekly-graph-card"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.5 }}
              className="w-full h-full"
            >
              <WeeklyGraphCard data={safeUserData.recentAnalysis} />
            </motion.div>
          )}
          {currentCardIndex === 1 && (
            <motion.div
              key="monthly-graph-card"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.5 }}
              className="w-full h-full"
            >
              <MonthlyGraphCard data={safeUserData.monthlyMaterialSuccessRates} />
            </motion.div>
          )}
          {currentCardIndex === 2 && (
            <motion.div
              key="ranking-graph-card"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.5 }}
              className="w-full h-full"
            >
              <RankingGraphCard
                apartmentData={safeUserData.apartmentMonthlyAvgSuccess}
                userData={safeUserData.userMonthlyAvgSuccess}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 하단 인디케이터 ● ● ● */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className={
                "w-2 h-2 rounded-full transition-all duration-300 " +
                (currentCardIndex === index ? "bg-blue-500 w-4" : "bg-gray-300")
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   1) 주간 그래프 (WeeklyGraphCard)
   최근 분석 데이터(recentAnalysis)를 BarChart로 시각화
   ★ 차트 영역에 h-[300px] 고정
--------------------------------------------------------------- */
interface WeeklyGraphCardProps {
  data: AnalysisData[];
}
function WeeklyGraphCard({ data }: WeeklyGraphCardProps) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-gray-500">최근 분석 데이터가 없습니다</p>
      </div>
    );
  }

  // 날짜 오름차순
  const sortedData = [...data].sort(
    (a, b) => new Date(a.analysis_date).getTime() - new Date(b.analysis_date).getTime()
  );

  // 재질 한글화
  const materialMap: Record<string, string> = {
    can: "캔",
    glass: "유리",
    paper: "종이",
    PET: "페트",
    plastic: "플라스틱",
  };

  const translatedData = sortedData.map((item) => ({
    ...item,
    material: materialMap[item.material] || item.material,
  }));

  return (
    <div className="w-full p-4">
      <h3 className="text-xl font-semibold text-center mb-4">
        📊 최근 분리배출 성공률
      </h3>
      
      {/* ★ 고정 높이 300px으로 설정 */}
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={translatedData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="4 4" />
            <XAxis
              dataKey="analysis_date"
              tickFormatter={(date) =>
                new Date(date).toLocaleDateString("ko-KR", { month: "numeric", day: "numeric" })
              }
            />
            <YAxis domain={[0, 100]} />
            <Tooltip
              labelFormatter={(date) =>
                new Date(date).toLocaleDateString("ko-KR", { month: "long", day: "numeric" })
              }
              formatter={(value, name, props) => {
                if (name === "success_percent") {
                  return [`${value}%`, `성공률 (${props.payload.material})`];
                }
                return [value, name];
              }}
            />
            <Legend />
            <Bar dataKey="success_percent" name="성공률" fill="#3498db" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   2) 월별 재질별 평균 성공률 (MonthlyGraphCard)
   monthlyMaterialSuccessRates에서 특정 월 선택 → RadarChart
   ★ 차트 영역에 h-[300px] 고정
--------------------------------------------------------------- */
interface MonthlyGraphCardProps {
  data: Record<string, MonthlyData[]>;
}
function MonthlyGraphCard({ data }: MonthlyGraphCardProps) {
  const [selectedMonth, setSelectedMonth] = useState("");
  const months = Object.keys(data).sort().reverse();

  useEffect(() => {
    if (months.length > 0) {
      setSelectedMonth(months[0]);
    }
  }, [months]);

  if (!months.length) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-gray-500">재질별 평균 데이터가 없습니다</p>
      </div>
    );
  }

  const currentData = data[selectedMonth] || [];

  const materialMap: Record<string, string> = {
    can: "캔",
    glass: "유리",
    paper: "종이",
    PET: "페트",
    plastic: "플라스틱",
  };

  const translatedData = currentData.map((item) => ({
    ...item,
    material: materialMap[item.material] || item.material,
    avg_success: Number(item.avg_success.toFixed(1)),
  }));

  const formatMonth = (month: string) => `${month.slice(0, 4)}년 ${month.slice(4)}월`;

  return (
    <div className="w-full p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">📊 재질별 평균 성공률</h3>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {months.map((m) => (
            <option key={m} value={m}>
              {formatMonth(m)}
            </option>
          ))}
        </select>
      </div>

      {/* ★ 고정 높이 300px */}
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={translatedData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <PolarGrid gridType="polygon" />
            <PolarAngleAxis dataKey="material" tick={{ fill: "#4B5563", fontSize: 14 }} />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: "#4B5563" }}
              tickFormatter={(value) => `${value}%`}
            />
            <Radar
              name="평균 성공률"
              dataKey="avg_success"
              stroke="#10B981"
              fill="#10B981"
              fillOpacity={0.5}
            />
            <Tooltip
              formatter={(value: number) => [`${value}%`, "평균 성공률"]}
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                border: "1px solid #E5E7EB",
                borderRadius: "0.375rem",
                padding: "0.5rem",
              }}
            />
            <Legend
              wrapperStyle={{
                paddingTop: "1rem",
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   3) 월별 평균 비교 (RankingGraphCard)
   apartmentMonthlyAvgSuccess vs userMonthlyAvgSuccess
   ★ 차트 영역에 h-[300px] 고정
--------------------------------------------------------------- */
interface RankingGraphCardProps {
  apartmentData: Record<string, number>;
  userData: Record<string, number>;
}
function RankingGraphCard({ apartmentData, userData }: RankingGraphCardProps) {
  const months = Object.keys(apartmentData);

  if (!months.length) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-gray-500">월별 평균 데이터가 없습니다</p>
      </div>
    );
  }

  const chartData = months
    .map((month) => ({
      month: `${month.slice(0, 4)}.${month.slice(4)}`,
      단지평균: Number(apartmentData[month]?.toFixed(1)),
      나의평균: Number(userData[month]?.toFixed(1) || 0),
    }))
    .sort((a, b) => a.month.localeCompare(b.month));

  return (
    <div className="w-full p-4">
      <h3 className="text-xl font-semibold text-center mb-4">
        📊 월별 평균 비교
      </h3>

      {/* ★ 고정 높이 300px */}
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis domain={[0, 100]} />
            <Tooltip formatter={(value) => `${value}%`} />
            <Legend />
            <Line
              type="monotone"
              dataKey="단지평균"
              stroke="#2ecc71"
              strokeWidth={3}
            />
            <Line
              type="monotone"
              dataKey="나의평균"
              stroke="#3498db"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
