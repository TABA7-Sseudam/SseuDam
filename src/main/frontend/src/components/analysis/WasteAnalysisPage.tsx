import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from "recharts"; // Legend 제거
import BackgroundAnimation from "@/components/layout/BackgroudAnimation";
import styles from "./WasteAnalysisPage.module.css";
import TrashLoading from "./TrashLoading";

export default function WasteAnalysisPage() {
  const [currentSection, setCurrentSection] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [sections] = useState<(HTMLElement | null)[]>(new Array(3).fill(null));

  const scrollToSection = (index: number) => {
    if (sections[index]) {
      sections[index]?.scrollIntoView({ behavior: "smooth" });
      setCurrentSection(index);

      if (index === 2) {
        setTimeout(() => setIsAnalyzing(false), 2000);
      }
    }
  };

  // 🔄 단어 애니메이션
  const [wordIndex, setWordIndex] = useState(0);
  const words = ["Start", "Play", "Go!", "Begin", "Recycle"];

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // 📊 데이터 분류
  const separationData = [
    { label: "투입된 수량", value: 12 },
    { label: "올바르게 분리배출", value: 9 },
    { label: "잘못 분리배출", value: 3 },
  ];

  const pointsData = [
    { label: "획득 포인트", value: 90 },
    { label: "차감 포인트", value: -30 },
    { label: "반영 포인트", value: 60 },
    { label: "(월별) 현재 포인트", value: 960 },
    { label: "누적 포인트", value: 4290 },
  ];

  const successData = [{ label: "전체 성공률", value: 75 }];

  return (
    <div className={`min-h-screen bg-white overflow-hidden relative ${styles.pageContainer}`}>
      <BackgroundAnimation />

      <div className={`fixed top-5 left-5 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg ${styles.stepIndicator}`}>
        Step {currentSection + 1} / 3
      </div>

      <div className="relative z-50 pt-16">
        {/* ✅ 1️⃣ 첫 번째 섹션: 시작 화면 */}
        <section
          ref={(el) => el && (sections[0] = el)}
          className={`min-w-full h-screen flex flex-col items-center justify-center text-center bg-white/50 relative ${styles.section}`}
        >
          <motion.h1
            className={`text-5xl font-extrabold text-gray-900 mb-6 drop-shadow-xl ${styles.mainTitle}`}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            🌏 지구를 위한 한 걸음 🌏
          </motion.h1>

          <motion.h2
            className={`text-3xl font-bold text-teal-700 mb-10 ${styles.animatedWord}`}
            key={wordIndex}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            "{words[wordIndex]} with Us!"
          </motion.h2>

          <motion.button
            className={`px-6 py-4 text-xl font-bold text-white bg-gradient-to-r from-blue-600 to-teal-500 rounded-full shadow-xl ${styles.startButton}`}
            whileTap={{ scale: 0.85 }}
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400 }}
            onClick={() => scrollToSection(1)}
          >
            시작하기
          </motion.button>
        </section>

        {/* ✅ 2️⃣ 두 번째 섹션: 쓰레기통 애니메이션 */}
        <section ref={(el) => el && (sections[1] = el)} className={`min-w-full h-screen flex flex-col items-center justify-center text-center bg-white/50 ${styles.truckSection}`}>
          <TrashLoading isLoading={isAnalyzing} loadingText="재활용 쓰레기 수거 중..." />

          <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 2 }} className={`mt-6 ${styles.loadingText}`}>
            🗑️ 분석을 위해 쓰레기를 분류하고 있습니다...
          </motion.div>

          <Button variant="outline" onClick={() => scrollToSection(2)} className={`mt-8 ${styles.actionButton}`}>
            분석 결과 보기
          </Button>
        </section>

        {/* ✅ 3️⃣ 세 번째 섹션: AI 분석 결과 및 차트 시각화 */}
      <section
        ref={(el) => el && (sections[2] = el)}
        className={`min-w-full py-20 flex flex-col items-center justify-center text-center bg-[#ECF1F6] ${styles.resultsSection}`}
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`text-4xl font-bold mb-12 bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent ${styles.sectionTitle}`}
        >
          AI 분석 결과
        </motion.h2>

        {/* 📊 분리배출 데이터 차트 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full flex flex-col items-center mb-12"
        >
          <div className="w-full max-w-3xl bg-[#ECF1F6] border border-gray-300 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">분리배출 현황</h3>
            <p className="text-sm text-gray-500 mb-4">재활용 쓰레기 분리배출 상세 분석</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart layout="vertical" data={separationData}>
                <defs>
                  <linearGradient id="separationGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#00ff08" />
                    <stop offset="100%" stopColor="#00ff08" />
                  </linearGradient>
                </defs>
                <XAxis type="number" stroke="#000000" />
                <YAxis dataKey="label" type="category" width={150} tick={{ fill: "#000000" }} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white/90 border border-gray-200 rounded-lg shadow-lg p-3">
                          <p className="font-medium text-sm text-gray-600">{label}</p>
                          <p className="text-lg font-bold text-gray-900">{payload[0].value}개</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar dataKey="value" fill="url(#separationGradient)" radius={[0, 4, 4, 0]} animationDuration={1500}>
                  <LabelList dataKey="value" position="right" fill="#666" formatter={(value: number) => `${value}개`} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* 📊 포인트 데이터 차트 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-full flex flex-col items-center mb-12"
        >
          <div className="w-full max-w-3xl bg-#E8EFF4 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">포인트 현황</h3>
            <p className="text-sm text-gray-500 mb-4">획득 및 차감 포인트 상세 내역</p>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart layout="vertical" data={pointsData}>
                <defs>
                  <linearGradient id="pointsGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#2196F3" />
                    <stop offset="100%" stopColor="#00BCD4" />
                  </linearGradient>
                </defs>
                <XAxis type="number" stroke="#000000" />
                <YAxis dataKey="label" type="category" width={150} tick={{ fill: "#000000" }} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white/90 border border-gray-200 rounded-lg shadow-lg p-3">
                          <p className="font-medium text-sm text-gray-600">{label}</p>
                          <p className="text-lg font-bold text-gray-900">{payload[0].value} P</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar dataKey="value" fill="url(#pointsGradient)" radius={[0, 4, 4, 0]} animationDuration={1500}>
                  <LabelList dataKey="value" position="right" fill="#666" formatter={(value: number) => `${value} P`} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* 📊 성공률 데이터 차트 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="w-full flex flex-col items-center"
        >
          <div className="w-full max-w-3xl bg-#E8EFF4 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">전체 성공률</h3>
            <p className="text-sm text-gray-500 mb-4">올바른 분리배출 달성률</p>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart layout="vertical" data={successData} barSize={60}>
                <defs>
                  <linearGradient id="successGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#FF9800" />
                    <stop offset="100%" stopColor="#FF5722" />
                  </linearGradient>
                </defs>
                <XAxis type="number" domain={[0, 100]} stroke="#888" />
                <YAxis dataKey="label" type="category" width={150} tick={{ fill: "#666" }} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white/90 border border-gray-200 rounded-lg shadow-lg p-3">
                          <p className="font-medium text-sm text-gray-600">{label}</p>
                          <p className="text-lg font-bold text-gray-900">{payload[0].value}%</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar dataKey="value" fill="url(#successGradient)" radius={[0, 4, 4, 0]} animationDuration={1500}>
                  <LabelList dataKey="value" position="right" fill="#666" formatter={(value: number) => `${value}%`} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </section>
      </div>
    </div>
  );
}