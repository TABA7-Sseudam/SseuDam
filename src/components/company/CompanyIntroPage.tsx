import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

// npm install framer-motion
// npm install -D tailwindcss
// npx tailwindcss init
// npm install bootstrap

export function CompanyIntroPage() {
  const navigate = useNavigate()
  const [currentSection, setCurrentSection] = useState(0)
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([])

  const handleNext = () => {
    if (currentSection < sectionsRef.current.length - 1) {
      const nextSection = currentSection + 1
      sectionsRef.current[nextSection]?.scrollIntoView({ behavior: "smooth" })
      setCurrentSection(nextSection)
    }
  }

  const handlePrev = () => {
    if (currentSection > 0) {
      const prevSection = currentSection - 1
      sectionsRef.current[prevSection]?.scrollIntoView({ behavior: "smooth" })
      setCurrentSection(prevSection)
    }
  }

  const scrollToSection = (index: number) => {
    sectionsRef.current[index]?.scrollIntoView({ behavior: "smooth" })
    setCurrentSection(index)
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden relative">

      {/* 네비게이션 바 */}
      <nav className="fixed top-0 left-0 w-full bg-white text-black flex items-center justify-between px-8 py-4 z-50 shadow-md">
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-gray-100 px-4 py-2 rounded-full shadow-sm">
          <button
            onClick={() => scrollToSection(0)}
            className="px-4 py-1 bg-gradient-to-r from-teal-400 to-blue-400 text-white rounded-full font-bold shadow-md"
          >
            Clify
          </button>
          <button onClick={() => scrollToSection(1)} className="text-gray-700 hover:text-teal-500 transition">
            하는 일
          </button>
          <button onClick={() => scrollToSection(2)} className="text-gray-700 hover:text-teal-500 transition">
            시설 안내
          </button>
          <button onClick={() => scrollToSection(3)} className="text-teal-500 font-semibold hover:text-teal-600 transition">
            상담 신청
          </button>
        </div>
        <div className="flex items-center space-x-4 ml-auto">
          <button onClick={() => navigate("/auth")} className="text-gray-700 hover:text-black transition">
            회원가입
          </button>
          <button
            onClick={() => navigate("/auth")}
            className="px-4 py-1 border border-teal-400 text-teal-400 rounded-full hover:bg-gradient-to-r hover:from-teal-400 hover:to-blue-400 hover:text-white transition"
          >
            로그인
          </button>
        </div>
      </nav>

      {/* 첫 번째 섹션 */}
      <section
        ref={(el) => (sectionsRef.current[0] = el as HTMLDivElement | null)}
        className="min-w-full h-screen relative overflow-hidden"
      >
        {/* 동영상 배경 */}
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src="/Movie.mp4" type="video/mp4" />
          브라우저가 비디오 태그를 지원하지 않습니다.
        </video>

        {/* 텍스트 오버레이 */}
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-6xl font-extrabold mb-4"
          >
            분리수거, 게임처럼 즐기세요!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-xl mb-8"
          >
            포인트를 쌓고 보상을 받아가세요.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 1 }}>
            <Button
              onClick={() => navigate("/about")}
              className="bg-gradient-to-r from-teal-400 to-blue-500 text-white px-6 py-3 rounded-full shadow-lg hover:from-teal-500 hover:to-blue-600 transition"
            >
              지금 시작하기
            </Button>
          </motion.div>

          {/* 스크롤 유도 메시지 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute bottom-10 flex flex-col items-center cursor-pointer"
            onClick={() => scrollToSection(1)}
          >
            <p className="text-white text-sm mb-2">아래로 스크롤하세요</p>
            <svg className="w-6 h-6 text-white animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </div>
      </section>

      {/* 두 번째 섹션 */}
      <section
        ref={(el) => (sectionsRef.current[1] = el as HTMLDivElement | null)}
        className="min-w-full h-screen bg-gradient-to-r from-gray-600 to-green-600 relative overflow-hidden"
      >
        {/* 흐릿한 빛 효과 */}
        <div className="absolute w-72 h-72 bg-green-200 rounded-full blur-3xl opacity-30 top-10 left-1/3 transform -translate-x-1/2"></div>
        <div className="absolute w-96 h-96 bg-green-300 rounded-full blur-3xl opacity-20 bottom-10 right-1/4 transform translate-x-1/3"></div>

        {/* 텍스트 콘텐츠 */}
        <div className="relative z-10 flex flex-col justify-center h-full px-12 lg:px-32">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-5xl font-extrabold text-white mb-4"
          >
            OO 는 당신과 함께 지속 가능한 미래를 만듭니다.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="text-lg text-white mb-6 leading-relaxed"
          >
            OO는 단순한 분리수거 앱이 아닙니다.<br />
            스마트 감지 기술과 지역별 친환경 통계를 통해, 당신과 지역 사회가 함께 만드는 새로운 친환경 플랫폼입니다.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="px-4 py-2 border border-white text-white rounded-full hover:bg-white hover:text-teal-500 transition duration-300 self-start"
            onClick={() => navigate("/brand-story")}
          >
            브랜드 스토리 보기
          </motion.button>
        </div>
      </section>

      {/* 세 번째 섹션 */}
      <section
        ref={(el) => (sectionsRef.current[2] = el as HTMLDivElement | null)}
        className="min-w-full h-screen bg-gradient-to-r from-gray-500 to-green-500 relative overflow-hidden"
      >
        {/* 흐릿한 빛 효과 */}
        <div className="absolute w-72 h-72 bg-green-150 rounded-full blur-3xl opacity-30 top-10 left-1/3 transform -translate-x-1/2"></div>
        <div className="absolute w-96 h-96 bg-green-250 rounded-full blur-3xl opacity-20 bottom-10 right-1/4 transform translate-x-1/3"></div>

        {/* 콘텐츠 영역 */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-4xl font-bold text-white mb-2"
          >
            우리가 하는 일
          </motion.h2>

          <div className="flex flex-col lg:flex-row justify-between items-start gap-10 w-full max-w-7xl mx-auto px-10">
            {[
              {
                src: "/Intro/intro1.jpg",
                title: "정확하고 보람 있는 분리수거",
                desc: "단순히 분리수거를 넘어서, 정확한 감지 시스템으로 보람 있는 보상을 제공합니다."
              },
              {
                src: "/Intro/intro6.jpg",
                title: "지역 사회와 함께하는 친환경 문화 확산",
                desc: "환경 보호를 위한 다양한 재활용 캠페인을 통해 지속 가능한 가치를 전달합니다."
              },
              {
                src: "/Intro/intro3.jpg",
                title: "환경 보호와 기술의 융합",
                desc: "모두가 참여하는 스마트 환경 플랫폼으로 새로운 친환경 트렌드를 만들어갑니다."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * (index + 1), duration: 1 }}
                className="w-80 flex flex-col items-center text-center"
              >
                <img src={item.src} alt={item.title} className="w-80 h-80 object-cover rounded-md mb-2 mt-3" />
                <h3 className="text-lg font-semibold text-white mt-3">{item.title}</h3>
                <p className="text-sm text-white mt-3 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mt-8 px-4 py-2 border border-white text-white rounded-full hover:bg-white hover:text-teal-500 transition duration-300"
            onClick={() => navigate("/services")}
          >
            서비스 더 알아보기
          </motion.button>
        </div>
      </section>

      {/* 마지막 섹션 */}
      <section
        ref={(el) => (sectionsRef.current[3] = el as HTMLDivElement | null)}
        className="min-w-full h-screen bg-gradient-to-r from-gray-400 to-green-400 relative overflow-hidden"
      >
        {/* 흐릿한 빛 효과 */}
        <div className="absolute w-64 h-64 bg-green-100 rounded-full blur-3xl opacity-30 top-16 left-1/4 transform -translate-x-1/2"></div>
        <div className="absolute w-80 h-80 bg-green-200 rounded-full blur-3xl opacity-20 bottom-16 right-1/3 transform translate-x-1/3"></div>

        {/* 텍스트 콘텐츠 */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-12 lg:px-32">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-5xl font-extrabold text-white mb-4"
          >
            지속 가능한 미래로의 초대
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="text-lg text-white leading-relaxed mb-6"
          >
            작은 실천이 큰 변화를 만듭니다.<br />
            우리와 함께 더 나은 지구를 만들어보세요.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="px-6 py-3 border border-white text-white rounded-full hover:bg-white hover:text-teal-500 transition duration-300"
            onClick={() => navigate("/contact")}
          >
            지금 참여하기
          </motion.button>
        </div>
      </section>

    </div>
  )
}
