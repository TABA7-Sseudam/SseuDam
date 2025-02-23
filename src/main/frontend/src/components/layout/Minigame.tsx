import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface MinigameProps {
  className?: string;
}

export default function Minigame({ className }: MinigameProps) {
  const [score, setScore] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [remainingAttempts, setRemainingAttempts] = useState(3);
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const hasInitialized = useRef(false); // ✅ 중복 실행 방지

  // ✅ 로그인한 사용자 이메일 가져오기
  useEffect(() => {
    if (hasInitialized.current) return; // ✅ 한 번만 실행
    hasInitialized.current = true;

    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (storedUser?.email) {
      console.log("✅ 로그인된 사용자 이메일:", storedUser.email);
      setUserEmail(storedUser.email);
    } else {
      console.warn("⚠️ 사용자 정보 없음. 로그인 필요");
    }
  }, []);

  // ✅ 퀴즈 데이터
  const quizQuestions = [
    {
      question: "플라스틱 병을 올바르게 버리려면?",
      options: ["물로 헹군 후 버린다", "라벨을 제거하고 버린다", "뚜껑을 닫아 버린다"],
      answer: "라벨을 제거하고 버린다",
    },
    {
      question: "음식물이 묻은 종이컵은?",
      options: ["종이류로 분리배출", "일반 쓰레기", "세척 후 종이류 배출"],
      answer: "일반 쓰레기",
    },
    {
      question: "깨진 유리는 어떻게 버릴까?",
      options: ["유리병으로 배출", "일반 쓰레기로 배출", "고철류로 배출"],
      answer: "일반 쓰레기로 배출",
    },
    {
      question: "택배 상자의 스티커는?",
      options: ["그대로 배출", "제거 후 배출", "물에 불려서 배출"],
      answer: "제거 후 배출",
    },
  ];

  // ✅ 사용자별 도전 횟수 저장
  useEffect(() => {
    if (!userEmail) return;

    const today = new Date().toISOString().split("T")[0];
    const storedData = JSON.parse(localStorage.getItem(`quizData_${userEmail}`) || "{}");

    if (storedData.date === today) {
      setRemainingAttempts(storedData.remainingAttempts);
      setScore(storedData.score);
    } else {
      resetQuizData(today);
    }

    setQuizIndex(Math.floor(Math.random() * quizQuestions.length)); // ✅ 랜덤 문제 선택
  }, [userEmail]);

  // ✅ 퀴즈 데이터 초기화
  const resetQuizData = (date: string) => {
    setRemainingAttempts(3);
    setScore(0);
    localStorage.setItem(
      `quizData_${userEmail}`,
      JSON.stringify({ date, remainingAttempts: 3, score: 0 })
    );
  };

  // ✅ 정답 제출 & 포인트 적립 API 호출
  const submitCorrectAnswer = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:8080/api/quiz/correct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userEmail }),
      });

      if (!response.ok) {
        throw new Error("포인트 적립에 실패했습니다.");
      }

      const data = await response.json();
      console.log("✅ 포인트 적립 성공:", data.message);
    } catch (error) {
      console.error(error);
      alert("⚠️ 포인트 적립 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (option: string) => {
    if (remainingAttempts === 0 || !userEmail) return;

    setSelectedAnswer(option);
    let newScore = score;
    let newAttempts = remainingAttempts - 1;

    if (option === quizQuestions[quizIndex].answer) {
      newScore += 1;
      setMessage("✅ 정답입니다! +1점");
      await submitCorrectAnswer();
    } else {
      setMessage("❌ 틀렸어요! 다시 도전해보세요.");
    }

    setScore(newScore);
    setRemainingAttempts(newAttempts);

    const today = new Date().toISOString().split("T")[0];
    localStorage.setItem(
      `quizData_${userEmail}`,
      JSON.stringify({ date: today, remainingAttempts: newAttempts, score: newScore })
    );

    setTimeout(() => {
      setMessage("");
      setSelectedAnswer(null);
      setQuizIndex(Math.floor(Math.random() * quizQuestions.length));
    }, 2000);
  };

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`hidden md:flex flex-col w-64 bg-[#4CAF50] text-white p-6 space-y-4 rounded-r-lg shadow-lg ${className}`}
    >
      <h2 className="text-2xl font-bold text-center whitespace-nowrap">🌿 친환경 미니게임</h2>

      {userEmail ? (
        <p className="text-center text-sm text-gray-200">남은 기회: {remainingAttempts} / 3</p>
      ) : (
        <p className="text-center text-sm text-red-400">로그인이 필요합니다.</p>
      )}

      {userEmail ? (
        remainingAttempts > 0 ? (
          <div className="bg-green-700 p-4 rounded-lg shadow">
            <h3 className="text-xl font-semibold">🌱 환경 퀴즈</h3>
            <p className="text-sm mt-2">{quizQuestions[quizIndex].question}</p>

            <div className="mt-3 space-y-2">
              {quizQuestions[quizIndex].options.map((option) => (
                <motion.button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  className={`block w-full py-2 text-sm rounded-md transition ${
                    selectedAnswer === option
                      ? option === quizQuestions[quizIndex].answer
                        ? "bg-green-500"
                        : "bg-red-500"
                      : "bg-[#4CAF50] hover:bg-green-500" // ✅ 버튼 색상도 조정
                  }`}
                  disabled={selectedAnswer !== null || loading}
                >
                  {loading && option === quizQuestions[quizIndex].answer ? "포인트 적립 중..." : option}
                </motion.button>
              ))}
            </div>

            {message && <p className="mt-2 text-sm text-center">{message}</p>}
          </div>
        ) : (
          <p className="text-sm text-center text-yellow-200">🚫 오늘 도전 횟수가 끝났습니다. 내일 다시 도전하세요! 🌍</p>
        )
      ) : null}
    </motion.div>
  );
}
