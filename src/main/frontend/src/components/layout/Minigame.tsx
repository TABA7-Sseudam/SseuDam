import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { auth } from "@/lib/firebase/firebase";

interface MinigameProps {
  className?: string;
}

export default function Minigame({ className }: MinigameProps) {
  const [score, setScore] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [quizAttempts, setQuizAttempts] = useState(0);

  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      if (storedUser?.email) {
        console.log("✅ 로그인된 사용자 이메일:", storedUser.email);
        setUserEmail(storedUser.email);
      } else {
        console.warn("⚠️ 사용자 정보 없음. 로그인 필요");
      }
    } catch (err) {
      console.error("사용자 정보 파싱 중 오류:", err);
      setError("사용자 정보를 불러올 수 없습니다.");
    }

    // 퀴즈 횟수 로드
    const today = new Date().toISOString().split("T")[0];
    const storedAttempts = JSON.parse(localStorage.getItem("quizAttempts") || "{}");

    if (storedAttempts.date === today) {
      setQuizAttempts(storedAttempts.count);
    } else {
      localStorage.setItem("quizAttempts", JSON.stringify({ date: today, count: 0 }));
      setQuizAttempts(0);
    }
  }, []);

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
    {
      question: "일회용 커피컵은 어떻게 버릴까?",
      options: ["종이류로 배출", "일반 쓰레기로 배출", "유리병으로 배출"],
      answer: "일반 쓰레기로 배출",
    },
    {
      question: "음료수 캔을 버릴 때 올바른 방법은?",
      options: ["깨끗이 씻어서 배출", "찌그러뜨려 배출", "뚜껑을 제거하고 배출"],
      answer: "깨끗이 씻어서 배출",
    },
    {
      question: "비닐봉지는 어떻게 분리배출해야 하나요?",
      options: ["종이류와 함께 배출", "플라스틱으로 배출", "비닐로 분리배출"],
      answer: "비닐로 분리배출",
    },
    {
      question: "사용한 휴지는 어떻게 버릴까요?",
      options: ["재활용 가능", "일반 쓰레기로 버린다", "종이류로 배출"],
      answer: "일반 쓰레기로 버린다",
    },
    {
      question: "깨끗한 종이팩은 어떻게 배출하나요?",
      options: ["종이류와 함께 배출", "분리해서 따로 배출", "유리병과 함께 배출"],
      answer: "분리해서 따로 배출",
    },
    {
      question: "전자제품 배출 시 올바른 방법은?",
      options: ["일반 쓰레기로 버린다", "대형폐기물로 신고 후 배출", "플라스틱으로 배출"],
      answer: "대형폐기물로 신고 후 배출",
    },
  ];

  const submitCorrectAnswer = async () => {
    setLoading(true);
    setError(null);

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("로그인이 필요합니다.");
      }

      const idToken = await currentUser.getIdToken(true);

      const response = await fetch("http://54.180.242.43:8080/api/quiz/correct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          userEmail: currentUser.email,
          points: 1,
        }),
      });

      if (response.status === 401) {
        throw new Error("인증이 만료되었습니다. 다시 로그인해주세요.");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "포인트 적립에 실패했습니다.");
      }

      console.log("✅ 포인트 적립 성공");
      return true;
    } catch (error) {
      console.error("포인트 적립 오류:", error);
      setError(error instanceof Error ? error.message : "포인트 적립 중 오류 발생");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (option: string) => {
    if (!userEmail) {
      setError("로그인이 필요한 서비스입니다.");
      return;
    }

    if (loading || quizAttempts >= 3) {
      return; // 중복 제출 방지 또는 3회 초과 시 막기
    }

    setSelectedAnswer(option);
    let newScore = score;

    if (option === quizQuestions[quizIndex].answer) {
      setMessage("정답 확인 중...");
      const pointsAdded = await submitCorrectAnswer();
      if (pointsAdded) {
        newScore += 1;
        setMessage("✅ 정답입니다! +1점");
      }
    } else {
      setMessage("❌ 틀렸어요! 다시 도전해보세요.");
    }

    setScore(newScore);
    const newAttempts = quizAttempts + 1;
    setQuizAttempts(newAttempts);

    // localStorage에 진행 횟수 저장
    const today = new Date().toISOString().split("T")[0];
    localStorage.setItem("quizAttempts", JSON.stringify({ date: today, count: newAttempts }));

    setTimeout(() => {
      setMessage("");
      setError(null);
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
        <p className="text-center text-sm text-gray-200">점수: {score}</p>
      ) : (
        <p className="text-center text-sm text-red-400">로그인이 필요합니다.</p>
      )}

      {error && (
        <div className="bg-red-500 p-2 rounded text-sm text-white text-center">{error}</div>
      )}

      {userEmail && (
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
                    : "bg-[#4CAF50] hover:bg-green-500"
                }`}
                disabled={selectedAnswer !== null || loading || quizAttempts >= 3}
              >
                {loading && option === quizQuestions[quizIndex].answer
                  ? "포인트 적립 중..."
                  : option}
              </motion.button>
            ))}
          </div>

          {message && <p className="mt-2 text-sm text-center">{message}</p>}
          {quizAttempts >= 3 && <p className="text-red-300 text-sm text-center">오늘의 퀴즈 제한 도달!</p>}
        </div>
      )}
    </motion.div>
  );
}
