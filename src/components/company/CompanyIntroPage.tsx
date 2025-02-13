// src/components/company/CompanyIntroPage.tsx
import { useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export function CompanyIntroPage() {
  const navigate = useNavigate()
  const sectionsRef = useRef<(HTMLElement | null)[]>([])

  const scrollToSection = (index: number) => {
    sectionsRef.current[index]?.scrollIntoView({ behavior: "smooth" })
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
            홈
          </button>
          <button
            onClick={() => scrollToSection(1)}
            className="text-gray-700 hover:text-teal-500 transition"
          >
            알아보기
          </button>
          <button
            onClick={() => scrollToSection(2)}
            className="text-gray-700 hover:text-teal-500 transition"
          >
            시작하기
          </button>
        </div>
        <div className="flex items-center space-x-4 ml-auto">
          <button
            onClick={() => navigate("/auth")}
            className="text-gray-700 hover:text-black transition"
          >
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

      {/* Section 0: 동영상 섹션 */}
      <section
        ref={(el) => (sectionsRef.current[0] = el)}
        className="min-w-full h-screen relative overflow-hidden"
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/Movie.mp4" type="video/mp4" />
          브라우저가 비디오 태그를 지원하지 않습니다.
        </video>
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
          >
            <Button
              onClick={() => navigate("/auth")}
              className="bg-gradient-to-r from-teal-400 to-blue-500 text-white px-6 py-3 rounded-full shadow-lg hover:from-teal-500 hover:to-blue-600 transition"
            >
              지금 시작하기
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute bottom-10 flex flex-col items-center cursor-pointer"
            onClick={() => scrollToSection(1)}
          >
            <p className="text-white text-sm mb-2">아래로 스크롤하세요</p>
            <svg
              className="w-6 h-6 text-white animate-bounce"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </div>
      </section>

      {/* Section 1: 아이콘 및 텍스트 */}
      <motion.section
        ref={(el) => (sectionsRef.current[1] = el)}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="w-full bg-[#ffffff] h-[1334px] relative overflow-hidden"
      >
        {/* 아이콘1 & 텍스트 */}
        <img
          className="w-20 h-20 absolute left-[202px] top-[calc(50%_-_-227px)] overflow-hidden"
          style={{
            background: "linear-gradient(to left, #ffffff, #ffffff)",
            objectFit: "cover",
          }}
          src="/Intro/_652-d-0-dc-129-f-6-f-7-d-9-d-25-d-19-ba-1-p-500-png0.png"
          alt="icon1"
        />
        <div className="text-[#1a1b1f] text-left font-['Inter-Bold',_sans-serif] text-[24.4765625px] leading-[34px] font-bold absolute left-[306px] top-[873px] w-[372px] h-[34px] flex items-center justify-start">
          재미없는 분리수거는 그만
        </div>
        <div className="text-[#1a1b1f] text-left font-['Inter-Regular',_sans-serif] text-[14.875px] leading-7 font-normal absolute left-[306px] top-[917px] w-[357px] h-7 flex items-center justify-start">
          모두 구분 없이 커버링 봉투에 담아주세요.
        </div>

        {/* 아이콘2 & 텍스트 */}
        <img
          className="w-20 h-20 absolute left-[812px] top-[calc(50%_-_-227px)] overflow-hidden"
          style={{
            background: "linear-gradient(to left, #ffffff, #ffffff)",
            objectFit: "cover",
          }}
          src="/Intro/_652-d-0-dc-12-f-14-a-03-af-6-ae-9-a-18-2-p-500-png0.png"
          alt="icon2"
        />
        <div className="text-[#1a1b1f] text-left font-['Inter-Bold',_sans-serif] text-[24.4765625px] leading-[34px] font-bold absolute left-[916px] top-[873px] w-[284px] h-[34px] flex items-center justify-start">
          환경을 지켜요
        </div>
        <div className="text-[#1a1b1f] text-left font-['Inter-Regular',_sans-serif] text-[14.875px] leading-7 font-normal absolute left-[916px] top-[917px] w-[571px] h-7 flex items-center justify-start">
          쓰레기 선별장에서 엄격한 처리를 통해 재활용 업체에 전달해요.
        </div>

        {/* 아이콘3 & 텍스트 */}
        <img
          className="w-20 h-20 absolute left-[202px] top-[calc(50%_-_-389px)] overflow-hidden"
          style={{
            background: "linear-gradient(to left, #ffffff, #ffffff)",
            objectFit: "cover",
          }}
          src="/Intro/_652-d-0-dc-1-e-51-ee-095-a-841477-a-3-p-500-png0.png"
          alt="icon3"
        />
        <div className="text-[#1a1b1f] text-left font-['Inter-Bold',_sans-serif] text-[24.4765625px] leading-[34px] font-bold absolute left-[306px] top-[1035px] w-96 h-[34px] flex items-center justify-start">
          실시간으로 반영되는 순위
        </div>
        <div className="text-[#1a1b1f] text-left font-['Inter-Regular',_sans-serif] text-[14.875px] leading-7 font-normal absolute left-[306px] top-[1079px] w-[466px] h-7 flex items-center justify-start">
          정해진 날짜를 기다릴 필요 없이 언제든지 수거 신청을 할 수 있어요.
        </div>

        {/* 아이콘4 & 텍스트 */}
        <img
          className="w-20 h-20 absolute left-[812px] top-[calc(50%_-_-389px)] overflow-hidden"
          style={{
            background: "linear-gradient(to left, #ffffff, #ffffff)",
            objectFit: "cover",
          }}
          src="/Intro/_652-d-0-dc-2-aad-5541-c-2-fef-2-bff-4-p-500-png0.png"
          alt="icon4"
        />
        <div className="text-[#1a1b1f] text-left font-['Inter-Bold',_sans-serif] text-[24.4765625px] leading-[34px] font-bold absolute left-[916px] top-[1035px] w-[328px] h-[34px] flex items-center justify-start">
          이웃과 소통
        </div>
        <div className="text-[#1a1b1f] text-left font-['Inter-Regular',_sans-serif] text-[14.875px] leading-7 font-normal absolute left-[916px] top-[1079px] w-[498px] h-7 flex items-center justify-start">
          멀리 분리수거장까지 갈 필요 없이 간편하게 문 앞에 두기만 하세요.
        </div>

        {/* 메인 이미지 (중앙에 고정) */}
        <img
          className="rounded-[20px] w-[1140px] h-[500px] absolute left-[50%] top-[calc(50%_-_411px)]"
          style={{ transform: "translate(-50%)", objectFit: "cover" }}
          src="/Intro/image0.png"
          alt="main image"
        />
      </motion.section>

      {/* Section 2: 75% 비율 적용 (zoom 사용) 및 wrapper로 레이아웃 높이 조정 */}
      <motion.section
        ref={(el) => (sectionsRef.current[2] = el)}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="w-full relative overflow-hidden"
        style={{ height: "750px" }}
      >
        <div
          className="bg-[#ffffff] relative overflow-hidden"
          style={{
            zoom: 0.75,
            width: "calc(100% / 0.75)",
            height: "calc(1176px / 0.75)"
          }}
        >
          <img
            className="rounded-[20px] w-[300px] h-[300px] absolute left-[287px] top-[169px]"
            style={{ objectFit: "cover" }}
            src="/Intro/rectangle0.png"
            alt="rectangle0"
          />
          <img
            className="rounded-[20px] w-[300px] h-[300px] absolute left-[1493px] top-[255px]"
            style={{ objectFit: "cover" }}
            src="/Intro/rectangle1.png"
            alt="rectangle1"
          />
          <img
            className="rounded-tr-[20px] rounded-br-[20px] w-[500px] h-[400px] absolute left-[-27px] top-[578px]"
            style={{ objectFit: "cover" }}
            src="/Intro/rectangle2.png"
            alt="rectangle2"
          />
          <img
            className="rounded-tl-[20px] rounded-bl-[20px] w-[400px] h-[324px] absolute left-[1653px] top-[698px]"
            style={{ objectFit: "cover" }}
            src="/Intro/rectangle-41580.png"
            alt="rectangle-41580"
          />
          <div className="text-[#34426b] text-center font-['Roboto-ExtraBold',_sans-serif] text-5xl leading-6 font-extrabold absolute left-[818px] top-[255px] w-[407px] h-[214px] flex items-center justify-center">
            분리배출 AI
          </div>
          <div className="bg-[#080808] rounded-[50px] w-[200px] h-[70px] absolute left-[922px] top-[848px]"></div>
          <div className="text-[#000000] text-center font-['Roboto-ExtraBold',_sans-serif] text-[64px] leading-6 font-extrabold absolute left-[391px] top-[513px] w-[1262px] h-[130px] flex items-center justify-center">
            우리 같이 분리수거할까요? <br />
          </div>
          <div className="text-[#000000] text-center font-['Roboto-Regular',_sans-serif] text-2xl leading-6 font-normal absolute left-[-177px] top-[496px] w-[2397px] h-[452px] flex items-center justify-center">
          분리수거로 등급을 올리고, 지구를 지키자!<br /><br /><br /><br />
            쓰레기도 게임처럼, 환경도 즐겁게!
          </div>
          {/* 버튼으로 변경된 '야옹' */}
          <motion.button
            className="absolute left-[915px] top-[845px] w-[212px] h-[75px] bg-teal-500 text-white text-[24px] font-bold rounded-full shadow-lg hover:bg-teal-600 transition"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/home')} 
          >
            시작하기
          </motion.button>
        </div>
      </motion.section>
    </div>
  )
}
