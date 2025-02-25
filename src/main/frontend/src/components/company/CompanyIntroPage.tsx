import { useRef } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { FaGithub } from "react-icons/fa"

export function CompanyIntroPage() {
  const navigate = useNavigate()
  const sectionsRef = useRef<(HTMLElement | null)[]>([])
  
  const scrollToSection = (index: number) => {
    sectionsRef.current[index]?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="relative min-h-screen font-[Cafe24Surround] text-gray-900 overflow-hidden">
      {/* 전체 페이지 배경 */}
      <div
        className="background-container fixed top-0 left-0 w-full h-full pointer-events-none z-0"
        style={{
          background: "linear-gradient(to bottom, rgba(217, 234, 244, 0.9), rgba(251, 248, 239, 0.9))",
          backdropFilter: "blur(3px)"
        }}
      ></div>

      {/* 네비게이션 바 */}
      <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md text-black flex items-center justify-between px-6 py-3 z-50 border-b border-gray-300 shadow-sm transition-all">
        <button
          onClick={() => scrollToSection(0)}
          className="text-gray-900 font-serif text-2xl tracking-wide hover:text-teal-600 transition-colors duration-300 flex items-center space-x-2"
        >
          <span>🌿</span>
          <span className="font-bold">Verda</span>
        </button>
        <div className="flex items-center space-x-3 text-black text-sm font-medium">
          <button onClick={() => navigate("/auth")} className="hover:text-teal-600 transition-colors duration-300">
            회원가입
          </button>
          <span className="text-gray-400">|</span>
          <button onClick={() => navigate("/auth")} className="hover:text-teal-600 transition-colors duration-300">
            로그인
          </button>
        </div>
      </nav>

                <section className="relative h-100">

            <div className="absolute inset-0 bg-gray-200 z-0"></div>
            

            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 mt-20 z-10 text-center">
              <h2 className="text-black font-bold md:text-4xl mb-2 text-3xl">
                AI 기반 스마트 분리배출
              </h2>
              <p className="text-black font-bold md:text-xl text-xl">
                올바르게 버리고, 가치 있게 돌려받자!
              </p>
            </div>
          </section>

         

      {/* 동영상 섹션 */}
      <section
        ref={(el) => (sectionsRef.current[0] = el)}
        className="relative w-[80vw] max-w-[1000px] aspect-[16/9] overflow-hidden mt-40 mx-auto rounded-3xl shadow-2xl"
      >
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover m-auto rounded-3xl">
          <source src="/Intro/movie10.mp4" type="video/mp4" />
          브라우저가 비디오 태그를 지원하지 않습니다.
        </video>

        {/* 텍스트 컨테이너 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/20 flex flex-col items-center justify-center text-center text-white px-6">
          <motion.h1 
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 1 }}
            className="text-4xl font-[Cafe24Surround] mb-4 text-white drop-shadow-lg"
          >
           
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.5, duration: 1 }}
          
          >
          
          </motion.p>
        </div>
      </section>

      {/* 브랜드 스토리 섹션 */}
      <section ref={(el) => (sectionsRef.current[1] = el)} className="relative py-20 px-12 text-center">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 mt-5s0">
              이렇게 시작해보세요
            </h2>
            <p className="text-xl text-gray-600">
              쉽고 간단한 5단계로 시작하는 분리수거
            </p>
          </motion.div>

          <div className="relative">
            {/* Connecting Lines */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200/50 hidden md:block" />
            
            {/* Steps */}
            <div className="space-y-40">
              {/* Step 1 */}
              <motion.div 
                className="flex justify-start md:translate-x-[-100px]"
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="flex gap-12 items-center bg-[rgba(217,234,244,0.6)] rounded-2xl p-10 max-w-2xl shadow-lg ">
                  <div className="flex-1">
                    <div className="text-blue-600 font-medium mb-2 text-xl">STEP 1</div>
                    <h3 className="text-2xl font-bold mb-3">분리수거 시작하기</h3>
                    <p className="text-gray-600 text-lg">집 앞 분리수거장에서 시작해보세요</p>
                  </div>
                  <div className="relative w-48 h-48 overflow-hidden rounded-xl">
                    <img 
                      src="/Intro/intro21.png"
                      alt="분리수거 시작하기" 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Step 2 */}
              <motion.div 
                className="flex justify-end md:translate-x-[100px]"
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="flex gap-12 items-center bg-[rgba(234,244,239,0.6)] rounded-2xl p-10 max-w-2xl shadow-lg">
                  <div className="flex-1">
                    <div className="text-green-600 font-medium mb-2 text-xl">STEP 2</div>
                    <h3 className="text-2xl font-bold mb-3">사진 촬영하기</h3>
                    <p className="text-gray-600 text-lg">분리수거 품목을 촬영해주세요</p>
                  </div>
                  <div className="relative w-48 h-48 overflow-hidden rounded-xl">
                    <img 
                      src="/Intro/intro22.png"
                      alt="사진 촬영하기" 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Step 3 */}
              <motion.div 
                className="flex justify-start md:translate-x-[-100px]"
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="flex gap-12 items-center bg-[rgba(244,239,234,0.6)] rounded-2xl p-10 max-w-2xl shadow-lg">
                  <div className="flex-1">
                    <div className="text-yellow-600 font-medium mb-2 text-xl">STEP 3</div>
                    <h3 className="text-2xl font-bold mb-3">AI 분석 시작</h3>
                    <p className="text-gray-600 text-lg">정확한 분리수거 방법을 알려드려요</p>
                  </div>
                  <div className="relative w-48 h-48 overflow-hidden rounded-xl">
                    <img 
                      src="/Intro/intro25.png"
                      alt="AI 분석 시작" 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Step 4 */}
              <motion.div 
                className="flex justify-end md:translate-x-[100px]"
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="flex gap-12 items-center bg-[rgba(239,234,244,0.6)] rounded-2xl p-10 max-w-2xl shadow-lg">
                  <div className="flex-1">
                    <div className="text-purple-600 font-medium mb-2 text-xl">STEP 4</div>
                    <h3 className="text-2xl font-bold mb-3">결과 확인하기</h3>
                    <p className="text-gray-600 text-lg">올바른 분리수거 방법을 실천해보세요</p>
                  </div>
                  <div className="relative w-48 h-48 overflow-hidden rounded-xl">
                    <img 
                      src="/Intro/intro23.png"
                      alt="결과 확인하기" 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Step 5 */}
              <motion.div 
                className="flex justify-start md:translate-x-[-100px]"
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="flex gap-12 items-center bg-[rgba(234,244,244,0.6)] rounded-2xl p-10 max-w-2xl shadow-lg">
                  <div className="flex-1">
                    <div className="text-teal-600 font-medium mb-2 text-xl">STEP 5</div>
                    <h3 className="text-2xl font-bold mb-3">포인트 적립하기</h3>
                    <p className="text-gray-600 text-lg">올바른 분리수거로 포인트를 모아보세요</p>
                  </div>
                  <div className="relative w-48 h-48 overflow-hidden rounded-xl">
                    <img 
                      src="/Intro/intro24.png"
                      alt="포인트 적립하기" 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>


        {/* Tree Planting Section */}
<section className="relative py-20 px-6">
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true }}
    className="max-w-4xl mx-auto"
  >
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-12 border border-gray-100">
      {/* 메인 타이틀 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-center space-y-6"
      >
        <div className="inline-flex items-center justify-center space-x-2">
          <span className="text-3xl">🌱</span>
          <h2 className="text-3xl font-bold">
            지금까지 <span className="text-green-600">23,521그루</span>의
          </h2>
        </div>
        <h2 className="text-3xl font-bold">
          나무를 심었습니다!
        </h2>
        <p className="text-gray-600 text-lg">
          올바른 재활용으로 지구를 지키는 작은 실천, 지금 함께하세요.
        </p>
      </motion.div>

      {/* 카운터 섹션 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mt-12 mb-12"
      >
        <div className="bg-green-50/50 backdrop-blur-sm rounded-2xl p-8 text-center border border-green-100">
          <div className="flex items-center justify-center space-x-4">
            <span className="text-4xl">🌲</span>
            <span className="text-4xl font-bold text-green-600">+120 그루</span>
          </div>
          <p className="mt-4 text-gray-600">
            오늘 하루 동안 사용자들이 심은 나무 수
          </p>
        </div>
      </motion.div>

      {/* 참여 버튼 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="text-center"
      >
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 flex items-center justify-center mx-auto group hover:shadow-lg"
          onClick={() => navigate("/participate")}
        >
          <span className="mr-2">✏️</span>
          나도 함께하기
        </button>
      </motion.div>
    </div>
  </motion.div>
</section>

      {/* 푸터 섹션 */}
      <footer className="relative z-10 bg-gradient-to-t from-gray-200 to-gray-100 text-gray-700 text-center py-10 mt-20">
        <div className="flex justify-center items-center space-x-2 text-2xl font-semibold text-gray-800">
          <span>🌿</span>
          <span>Verda</span>
        </div>

        <div className="flex justify-center space-x-6 mt-4 text-gray-600 font-medium">
        </div>

        <div className="flex justify-center items-center space-x-6 mt-4 text-gray-500">
          <a href="mailto:contact@ssuedam.com" className="flex items-center space-x-2 hover:text-gray-700 transition">
            <span>📧 Verda@naver.com</span>
          </a>
          <a href="https://github.com/Verda" target="_blank" rel="noopener noreferrer"
            className="flex items-center space-x-2 hover:text-gray-700 transition">
            <FaGithub size={20} />
            <span>GitHub</span>
          </a>
        </div>

        <p className="text-sm text-gray-500 mt-6">© 2024 Verda. All rights reserved.</p>
      </footer>
    </div>
  )
}