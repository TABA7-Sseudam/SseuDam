import { useRef } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { FaGithub } from "react-icons/fa"
import "./company.css"

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
            

            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 mt-28 z-10 text-center">
              <h2 className="text-black font-bold md:text-4xl mb-2 text-3xl">
                AI 기반 스마트 분리배출
              </h2>
              <p className="text-black font-bold md:text-xl text-xl ">
                올바르게 버리고, 가치 있게 돌려받자!
              </p>
            </div>
          </section>

         

      {/* 동영상 섹션 */}
      <section
        ref={(el) => (sectionsRef.current[0] = el)}
        className="relative w-[80vw] max-w-[1000px] aspect-[16/9] overflow-hidden mt-52 mx-auto rounded-3xl shadow-2xl"
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
                    <h3 className="text-2xl font-bold mb-3">🚀 분리수거 시작하기</h3>
                    <p className="text-gray-600 text-lg">집 앞 분리수거장에서 시작해보세요.</p>
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
                    <h3 className="text-2xl font-bold mb-3">📸 사진 촬영하기</h3>
                    <p className="text-gray-600 text-lg">분리수거할 품목을 분석 판 위에 올려놔요.</p>
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
                    <h3 className="text-2xl font-bold mb-3">🤖 AI 분석 시작</h3>
                    <p className="text-gray-600 text-lg">AI가 분리수거 성공률을 계산해요.</p>
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
                    <h3 className="text-2xl font-bold mb-3">✅ 결과 확인하기</h3>
                    <p className="text-gray-600 text-lg">성공률을 높이고 올바른 분리배출 습관을 만들어 보세요. </p>
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
                    <h3 className="text-2xl font-bold mb-3">🎁 포인트 적립하기</h3>
                    <p className="text-gray-600 text-lg"> 포인트를 적립하고 아파트 내 최고 등급에 도전하세요!</p>
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
<section className="relative py-20 px-6 bg-gray-100">
  <div className="max-w-4xl mx-auto">
    
    {/* Title */}
    <motion.div 
      initial={{ opacity: 0, y: 50 }} // 처음에 아래로 50px 이동
      whileInView={{ opacity: 1, y: 0 }} // 위로 올라오면서 나타남
      transition={{ duration: 0.8, ease: "easeOut" }} // 부드러운 효과
      viewport={{ once: true }} // 한 번만 실행
      className="mb-12"
    >
      <h2 className="text-4xl font-bold mb-4">♻ 재활용 보고서</h2>
      <p className="text-gray-600 text-lg">💡 "올바른 재활용 습관이 깨끗한 지구를 만듭니다!"</p>
      <p className="text-gray-600 text-lg">🌿 "작은 실천이 환경을 변화시키는 첫걸음이에요. 지금 당신의 재활용 데이터를 확인해보세요!"</p>
    </motion.div>

    {/* What is Plogging Section */}
    <motion.div 
      className="flex gap-6 items-start mb-12"
      initial={{ opacity: 0, y: 50 }} // 처음에 아래로 50px 이동
      whileInView={{ opacity: 1, y: 0 }} // 위로 올라오면서 나타남
      transition={{ duration: 0.8, ease: "easeOut" }} // 부드러운 효과
      viewport={{ once: true }} // 한 번만 실행
    >
      <div className="bg-[#A7E7C0] rounded-3xl w-48 h-48 flex items-center justify-center shrink-0">
        <div className="text-white text-5xl">♻️</div>
      </div>
      <div className="flex-1 pt-4 relative ">
        <div className=" absolute top-0 right-0 text-[#A7E7C0] text-2xl">*</div>
        <h3 className="text-xl font-bold mb-4">VP(Verda-Point)이란?</h3>
        <p className="text-gray-600 mb-2 text-lg">"💚 올바르게 재활용할수록 쌓이는 포인트!"</p>
        <p className="text-gray-600 text-lg">📢 "재활용을 실천하면 VP 포인트를 받고, 환경 보호에 기여할 수 있어요!"</p>
      </div>
    </motion.div>

  {/* Effects Section */}
  <motion.div 
      className="bg-[#C1F0DC] rounded-3xl p-6 mb-12 relative"
      initial={{ opacity: 0, y: 50 }} // 처음에 아래로 50px 이동
      whileInView={{ opacity: 1, y: 0 }} // 위로 올라오면서 나타남
      transition={{ duration: 0.8, ease: "easeOut" }} // 부드러운 효과
      viewport={{ once: true }} // 한 번만 실행
    >
      <h3 className="text-xl font-bold mb-4">재활용 효과는?</h3>
      <div className="bg-white/50 rounded-xl p-4">
        <p className="text-gray-700 mb-2 text-lg">♻️ **플라스틱 1kg을 올바르게 재활용하면, CO₂ 배출량 3.1kg 감축!**🐢</p>
        <p className="text-gray-700 mb-2 text-lg">🥤 **페트병 1kg 재활용 → CO₂ 배출 2.3~2.5kg 감축, 원유 절약!** 🐢 </p>
        <p className="text-gray-700 mb-2 text-lg">🛍️ **비닐 1kg을 재활용하면, CO₂ 배출량 1.5~2.0kg 감축!**  🐢</p>
   
      </div>
      <div className="absolute right-6 bottom-6">
        <span className="text-green-600 text-2xl">🌱</span>
      </div>
    </motion.div>

    {/* Effects Section */}
    <motion.div 
      className="bg-[#C1F0DC] rounded-3xl p-6 mb-12 relative"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <h3 className="text-xl font-bold mb-4"></h3>
      <div className="bg-white/50 rounded-xl p-4">
       
        <p className="text-gray-700 mb-2 text-lg">🌲 **종이 1톤을 재활용하면 나무 17그루 보호 & 물 26,500L 절약!** 🐢 </p>
        <p className="text-gray-700 mb-2 text-lg">🍾 **유리병 1개를 재활용하면 4시간 동안 전등을 켤 전기 절약!**  🐢</p>
        <p className="text-gray-700 mb-2 text-lg">🏠 **스티로폼 1kg을 재활용하면 CO₂ 배출량 2.5kg 감축!**  🐢</p>
        
      </div>
      <div className="absolute right-6 bottom-6">
        <span className="text-green-600 text-2xl">🌱</span>
      </div>
    </motion.div>

    {/* Bottom Cards */}
    <div className="grid grid-cols-2 gap-6">
      {/* User Count Card */}
      <motion.div 
        className="rounded-3xl overflow-hidden relative  w-full h-[250px] md:h-[250px]"
        initial={{ opacity: 0, y: 50 }} // 처음에 아래로 50px 이동
        whileInView={{ opacity: 1, y: 0 }} // 위로 올라오면서 나타남
        transition={{ duration: 0.8, ease: "easeOut" }} // 부드러운 효과
        viewport={{ once: true }} // 한 번만 실행
      >
        <img 
          src="/Intro/intro00.jpeg" 
          alt="Plogging activity"
          className="w-full h-full object-center"
        />
        <div className="absolute inset-0 bg-black/65 flex flex-col items-center justify-center text-center">
    <p className="text-white text-lg font-semibold">현재 참여자 수</p> 
    <p className="text-white text-4xl font-bold mt-1">12,641명+</p>
  </div>
      </motion.div>

    {/* CTA Button */}
    <motion.div 
          className="neon-button animate-glow"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          onClick={() => navigate("/auth")}
        >
             <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center">
    <p className="text-white text-2xl font-semibold">Verda</p> 
    <p className="text-white text-3xl font-bold mt-1">지금 참여하기</p>
  </div>
        </motion.div>
    </div>
  </div>
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

        <p className="text-sm text-gray-500 mt-6">© 2025 Verda. All rights reserved.</p>
      </footer>
    </div>
  )
}
