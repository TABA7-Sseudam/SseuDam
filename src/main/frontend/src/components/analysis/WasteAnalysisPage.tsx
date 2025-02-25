// WasteAnalysisPage.tsx

import { useState, useEffect } from "react";
import { Client, Frame, Message } from "@stomp/stompjs";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList
} from "recharts";

import BackgroundAnimation from "@/components/layout/BackgroudAnimation";
import styles from "./WasteAnalysisPage.module.css";

/** 카메라 시작용 API */
const CAMERA_START_API = "http://54.180.242.43:8080/api/camera/start";
/** WebSocket 연결 엔드포인트 */
const WS_ENDPOINT = "ws://54.180.242.43:8080/ws/ai-results";  // ws:// 프로토콜로 변경
/** 서버가 메시지를 보내는 STOMP 채널 */
const TOPIC_AI_RESULTS = "/topic/ai-results";

/** 백엔드에서 오는 AI 분석 데이터 구조 */
interface AiAnalysisData {
  totalDetectedObjects: number;
  correctlyClassifiedObjects: number;
  incorrectlyClassifiedObjects: number;
  earnedPoints: number;
  deductedPoints: number;
  finalPoints: number;
  monthlyPoints: number;
  accumulatedPoints: number;
  successRate: number;
  grade?: string;
  promotionMessage?: string;
}

export default function WasteAnalysisPage() {
  // 섹션: [0] 인트로, [1] 결과
  const [sections] = useState<(HTMLElement | null)[]>(new Array(2).fill(null));
  const [currentSection, setCurrentSection] = useState(0);

  // 분석 진행 상태 및 팝업 관련
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // 에러 상태
  const [apiError, setApiError] = useState<string | null>(null);
  // 현재 코드에서는 isLoading을 별도로 쓰지 않으므로, 필요하면 추가 사용
  const [, setIsLoading] = useState(false);

  // 차트 상태
  const [separationData, setSeparationData] = useState([
    { label: "투입된 수량", value: 0 },
    { label: "올바르게 분리배출", value: 0 },
    { label: "잘못 분리배출", value: 0 },
  ]);
  const [pointsData, setPointsData] = useState([
    { label: "획득 포인트", value: 0 },
    { label: "차감 포인트", value: 0 },
    { label: "반영 포인트", value: 0 },
    { label: "(월별) 현재 포인트", value: 0 },
    { label: "누적 포인트", value: 0 },
  ]);
  const [successData, setSuccessData] = useState([
    { label: "전체 성공률", value: 0 },
  ]);

  // ──────────────────────────────────────────────
  // 1) WebSocket 연결 (STOMP)
  // ──────────────────────────────────────────────
  useEffect(() => {
    console.log("[WS] useEffect triggered. Connecting to:", WS_ENDPOINT);

    // 테스트용 백엔드 예상 데이터 출력
    console.log("%c📡 백엔드 로그에 표시된 데이터:", "color: purple; font-weight: bold;");
    console.log({totalDetectedObjects: 1, finalPoints: -5, accumulatedPoints: 2856, successRate: 0, promotionMessage: "", grade: "🌍 지구 지킴이", incorrectlyClassifiedObjects: 1, earnedPoints: 0, deductedPoints: 5, monthlyPoints: -134, correctlyClassifiedObjects: 0});

    const client = new Client({
      brokerURL: WS_ENDPOINT,
      debug: function(str) {
        console.log("[STOMP Debug]", str);
      },
      reconnectDelay: 5000
    });
    
    // 메시지 수신 여부를 확인하기 위한 상태 및 타이머
    let messageReceived = false;
    let connectionTimer: NodeJS.Timeout | null = null;
    
    // 메시지 처리 함수 분리
    const handleMessage = (message: Message) => {
      // 메시지 수신 표시 업데이트
      messageReceived = true;
      
      // 현재 타임스탬프 표시
      const timestamp = new Date().toLocaleTimeString();
      console.log("%c🔔 [" + timestamp + "] 메시지 수신됨! 데이터 도착!", "color: green; font-size: 16px; font-weight: bold; background: #e6ffe6; padding: 5px; border-radius: 5px;");
      console.log("==================================================");
      
      if (message.body) {
        console.log("[STOMP] 원본 메시지 내용:", message.body);
        
        try {
          const data: AiAnalysisData = JSON.parse(message.body);
          console.log("[STOMP] 파싱된 AI 분석 데이터:", data);
          console.table(data); // 테이블 형태로 데이터 표시
          
          // 주요 데이터 값 강조 표시
          console.log("%c📊 분석 결과: " + 
            `총 ${data.totalDetectedObjects}개 항목 중 ` + 
            `${data.correctlyClassifiedObjects}개 정확히 분류, ` + 
            `${data.incorrectlyClassifiedObjects}개 오분류, ` + 
            `성공률 ${data.successRate}%`,
            "color: green; font-weight: bold; font-size: 14px;");
          
          // 차트 state 갱신
          updateChartData(data);

          // 분석 완료 처리
          setIsAnalyzing(false);
          setAnalysisComplete(true);
          console.log("✅ [UI] 분석 완료 - 차트 업데이트 및 UI 상태 변경됨");
          
          // Alert으로도 데이터 수신 표시 (개발 중에만 사용)
          if (process.env.NODE_ENV === 'development') {
            alert(`데이터 수신 성공!\n총 항목: ${data.totalDetectedObjects}개\n성공률: ${data.successRate}%`);
          }
        } catch (error) {
          console.error("❌ [STOMP] JSON 파싱 오류:", error);
          console.error("원본 메시지:", message.body);
        }
      } else {
        console.warn("⚠️ [STOMP] 메시지 본문 없음!");
      }
      console.log("==================================================");
    };
    
    // 연결 성공 콜백
    client.onConnect = (frame: Frame) => {
      console.log("[STOMP] Connected to broker. Frame:", frame);
      console.log("%c🔌 WebSocket 연결 성공! 데이터 수신 대기 중...", "color: blue; font-size: 16px; font-weight: bold;");

      // 5초마다 연결 상태와 메시지 수신 여부 확인
      connectionTimer = setInterval(() => {
        if (!messageReceived) {
          console.log("%c⏳ 아직 메시지 수신 없음 - 대기 중...", "color: orange; font-weight: bold;");
        }
      }, 5000);

      // 다양한 토픽 경로 구독 시도
      console.log("[STOMP] 다양한 토픽 경로 구독 시도...");
      
      // 1. 기본 토픽 구독
      console.log("[STOMP] 기본 토픽 구독:", TOPIC_AI_RESULTS);
      client.subscribe(TOPIC_AI_RESULTS, handleMessage);
      
      // 2. 슬래시가 추가된 토픽 구독
      console.log("[STOMP] 슬래시 추가 토픽 구독:", `${TOPIC_AI_RESULTS}/`);
      client.subscribe(`${TOPIC_AI_RESULTS}/`, handleMessage);
      
      // 3. 사용자 ID 포함 경로 구독 (있는 경우)
      const userUid = localStorage.getItem("uid");
      if (userUid) {
        console.log("[STOMP] 사용자 ID 포함 토픽 구독:", `${TOPIC_AI_RESULTS}/${userUid}`);
        client.subscribe(`${TOPIC_AI_RESULTS}/${userUid}`, handleMessage);
      }
      
      // 4. 로그에 표시된 정확한 경로 구독
      console.log("[STOMP] 백엔드 로그 경로 구독: /topic/ai-results");
      client.subscribe("/topic/ai-results", handleMessage);
      
      // 5. 모든 경로 구독 (와일드카드)
      console.log("[STOMP] 와일드카드 구독:", "/topic/ai-results/*");
      client.subscribe("/topic/ai-results/*", handleMessage);
    };

    // 연결 에러 콜백
    client.onStompError = (error: Frame | string) => {
      console.error("[STOMP] Error (onStompError):", error);
      setApiError("STOMP 프로토콜 오류가 발생했습니다.");
    };
    
    // 클라이언트 활성화
    client.activate();

    // 수동 테스트용 타이머 (개발 중에만 사용)
    let testTimer: NodeJS.Timeout | null = null;
    if (process.env.NODE_ENV === 'development') {
      // 30초 후에 데이터를 수신하지 못한 경우 수동 테스트 시도
      testTimer = setTimeout(() => {
        if (!messageReceived) {
          console.log("%c🔧 데이터 수신 없음 - 수동 테스트 시도...", "color: red; font-weight: bold;");
          
          // 백엔드에서 표시된 데이터 형식으로 수동 테스트
          const testData: AiAnalysisData = {
            totalDetectedObjects: 1,
            correctlyClassifiedObjects: 0, 
            incorrectlyClassifiedObjects: 1,
            earnedPoints: 0,
            deductedPoints: 5,
            finalPoints: -5,
            monthlyPoints: -134,
            accumulatedPoints: 2856,
            successRate: 0,
            grade: "🌍 지구 지킴이",
            promotionMessage: ""
          };
          
          console.log("%c🧪 수동 테스트 데이터:", "color: purple; font-weight: bold;");
          console.table(testData);
          
          // 차트 업데이트 및 UI 상태 변경
          updateChartData(testData);
          setIsAnalyzing(false);
          setAnalysisComplete(true);
        }
      }, 30000);
    }

    return () => {
      // 타이머 정리
      if (connectionTimer) {
        clearInterval(connectionTimer);
      }
      
      if (testTimer) {
        clearTimeout(testTimer);
      }
      
      console.log("[WS] Cleaning up - deactivating STOMP client...");
      client.deactivate();
    };
  }, []);

  // ──────────────────────────────────────────────
  // 2) WebSocket으로 받은 AI 데이터 → 차트 state 업데이트
  // ──────────────────────────────────────────────
  function updateChartData(data: AiAnalysisData) {
    console.log("[updateChartData] 데이터 처리 시작:", data);

    // 분리배출 현황 차트 데이터 업데이트
    const newSeparation = [
      { label: "투입된 수량", value: data.totalDetectedObjects },
      { label: "올바르게 분리배출", value: data.correctlyClassifiedObjects },
      { label: "잘못 분리배출", value: data.incorrectlyClassifiedObjects },
    ];
    console.log("[Chart] 분리배출 현황 데이터 업데이트:", newSeparation);
    setSeparationData(newSeparation);

    // 포인트 현황 차트 데이터 업데이트
    const newPoints = [
      { label: "획득 포인트", value: data.earnedPoints },
      { label: "차감 포인트", value: data.deductedPoints },
      { label: "반영 포인트", value: data.finalPoints },
      { label: "(월별) 현재 포인트", value: data.monthlyPoints },
      { label: "누적 포인트", value: data.accumulatedPoints },
    ];
    console.log("[Chart] 포인트 현황 데이터 업데이트:", newPoints);
    setPointsData(newPoints);

    // 성공률 차트 데이터 업데이트
    const newSuccess = [
      { label: "전체 성공률", value: data.successRate },
    ];
    console.log("[Chart] 성공률 데이터 업데이트:", newSuccess);
    setSuccessData(newSuccess);
    
    // 추가 정보 로깅
    if (data.grade || data.promotionMessage) {
      console.log("%c🏆 등급 및 메시지: " + 
        `등급: ${data.grade || '없음'}, ` + 
        `메시지: ${data.promotionMessage || '없음'}`,
        "color: blue; font-weight: bold;");
    }
    
    console.log("[updateChartData] 데이터 처리 완료");
  }

  // ──────────────────────────────────────────────
  // 3) "시작하기" 버튼 클릭 시: 카메라 시작 + 로딩 팝업 표시
  // ──────────────────────────────────────────────
  async function handleStartButtonClick() {
    console.log("[UI] '시작하기' 버튼 클릭됨.");
    setApiError(null);
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      console.log("[UI] Retrieved token from localStorage:", token);

      if (!token) {
        throw new Error("로그인이 필요합니다 (토큰 없음)");
      }
      // 분석 시작 전 상태 업데이트
      setIsAnalyzing(true);
      setAnalysisComplete(false);
      setShowModal(true);

      console.log("[HTTP] POST /camera/start (카메라 시작 요청)");
      const res = await fetch(CAMERA_START_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error(`Camera start failed. status=${res.status}`);
      }
      console.log("[HTTP] 카메라 시작 성공");
      // 이후, 백엔드가 AI 분석 후 WebSocket으로 결과를 push하면 updateChartData() 호출됨.
    } catch (err: any) {
      console.error("[UI] 카메라 시작 에러:", err);
      setApiError(err.message);
      setIsAnalyzing(false);
      setAnalysisComplete(false);
      setShowModal(false);
    } finally {
      setIsLoading(false);
    }
  }

  // ──────────────────────────────────────────────
  // 4) 팝업 "확인" 버튼 클릭 시: 팝업 닫고 결과 섹션으로 이동
  // ──────────────────────────────────────────────
  function handleModalConfirm() {
    console.log("[UI] '확인' 버튼 클릭 -> 팝업 닫고 결과 섹션으로 이동");
    setShowModal(false);
    scrollToSection(1);
  }

  // ──────────────────────────────────────────────
  // 5) 섹션 스크롤 이동 함수
  // ──────────────────────────────────────────────
  function scrollToSection(index: number) {
    if (sections[index]) {
      console.log(`[UI] Scrolling to section index=${index}`);
      sections[index]?.scrollIntoView({ behavior: "smooth" });
      setCurrentSection(index);
    }
  }

  // ──────────────────────────────────────────────
  // 6) 텍스트 애니메이션 (Start, Play, Go!, Begin, Recycle)
  // ──────────────────────────────────────────────
  const [wordIndex, setWordIndex] = useState(0);
  const words = ["Start", "Play", "Go!", "Begin", "Recycle"];
  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // ──────────────────────────────────────────────
  // 렌더링
  // ──────────────────────────────────────────────
  return (
    <div className={`min-h-screen bg-white overflow-hidden relative pt-16 ${styles.pageContainer}`}>
      <BackgroundAnimation />

      {/* 왼쪽 상단 STEP 표시 */}
      <div className={`fixed top-5 left-5 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg ${styles.stepIndicator}`}>
        Step {currentSection + 1} / 2
      </div>

      <div className="relative z-50 pt-16">
        {/* (A) 인트로 섹션 */}
        <section
          ref={(el) => el && (sections[0] = el)}
          className={`min-w-full h-screen flex flex-col items-center justify-center text-center bg-white/40 relative mt-[-64px] ${styles.section}`}
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

          {/* "시작하기" 버튼 → 카메라 시작 + 로딩 팝업 */}
          <motion.button
            className="px-6 py-4 text-xl font-bold text-white bg-gradient-to-r from-blue-600 to-teal-500 rounded-full shadow-xl"
            whileTap={{ scale: 0.85 }}
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400 }}
            onClick={handleStartButtonClick}
          >
            시작하기
          </motion.button>
          <div className="mt-4">{apiError && <p className="text-red-600">{apiError}</p>}</div>
        </section>

        {/* (B) 결과 섹션 */}
        <section
          ref={(el) => el && (sections[1] = el)}
          className={`min-w-full py-20 flex flex-col items-center justify-center text-center bg-[#ECF1F6] ${styles.resultsSection}`}
        >
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold mb-12 bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent"
          >
            AI 분석 결과
          </motion.h2>

          {/* 분리배출 현황 차트 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full flex flex-col items-center mb-12"
          >
            <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">분리배출 현황</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart layout="vertical" data={separationData}>
                  <defs>
                    <linearGradient id="sepGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#00ff08" />
                      <stop offset="100%" stopColor="#00ff08" />
                    </linearGradient>
                  </defs>
                  <XAxis type="number" stroke="#000" />
                  <YAxis dataKey="label" type="category" width={150} tick={{ fill: "#000" }} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white/90 border border-gray-200 rounded-lg shadow-lg p-3">
                            <p className="font-medium text-sm text-gray-600">{label}</p>
                            <p className="text-lg font-bold text-gray-900">{payload[0].value}개</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="value" fill="url(#sepGrad)" radius={[0, 4, 4, 0]} animationDuration={1500}>
                    <LabelList dataKey="value" position="right" fill="#666" formatter={(val: number) => `${val}개`} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* 포인트 현황 차트 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-full flex flex-col items-center mb-12"
          >
            <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">포인트 현황</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart layout="vertical" data={pointsData}>
                  <defs>
                    <linearGradient id="pointsGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#2196F3" />
                      <stop offset="100%" stopColor="#00BCD4" />
                    </linearGradient>
                  </defs>
                  <XAxis type="number" stroke="#000" />
                  <YAxis dataKey="label" type="category" width={150} tick={{ fill: "#000" }} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white/90 border border-gray-200 rounded-lg shadow-lg p-3">
                            <p className="font-medium text-sm text-gray-600">{label}</p>
                            <p className="text-lg font-bold text-gray-900">{payload[0].value} P</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="value" fill="url(#pointsGrad)" radius={[0, 4, 4, 0]} animationDuration={1500}>
                    <LabelList dataKey="value" position="right" fill="#666" formatter={(val: number) => `${val} P`} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* 성공률 차트 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="w-full flex flex-col items-center"
          >
            <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">전체 성공률</h3>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart layout="vertical" data={successData}>
                  <defs>
                    <linearGradient id="succGrad" x1="0" y1="0" x2="1" y2="0">
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
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="value" fill="url(#succGrad)" radius={[0, 4, 4, 0]} animationDuration={1500}>
                    <LabelList dataKey="value" position="right" fill="#666" formatter={(val: number) => `${val}%`} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </section>
      </div>

      {/* 로딩 / 완료 팝업 */}
      {showModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 text-center">
            {isAnalyzing && !analysisComplete ? (
              <>
                <h3 className="text-xl font-bold mb-2 text-gray-800">실시간 AI 분석 중...</h3>
                <p className="text-gray-600">조금만 기다려주세요.</p>
              </>
            ) : analysisComplete ? (
              <>
                <h3 className="text-xl font-bold mb-2 text-green-600">분석 완료!</h3>
                <p className="text-gray-600 mb-4">결과를 확인해보세요.</p>
                <Button
                  variant="outline"
                  onClick={handleModalConfirm}
                  className="bg-blue-500 text-white hover:bg-blue-600 mt-2"
                >
                  확인
                </Button>
              </>
            ) : null}
            {apiError && <p className="text-red-600 mt-4">{apiError}</p>}
          </div>
        </div>
      )}
    </div>
  );
}