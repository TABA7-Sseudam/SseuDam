import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BackgroundAnimation from '@/components/layout/BackgroudAnimation';

const images = [
  '/Ranking/1.png',
  '/Ranking/2.png',
  '/Ranking/3.png',
  '/Ranking/3.5.2.png',
  '/Ranking/4.jpg',
  '/Ranking/5.jpg',
  '/Ranking/6.jpg',
  '/Ranking/7.jpg',
  '/Ranking/8.jpg'
];

export default function RankTierGuide() {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (index: number) => {
    const section = document.getElementById(`section-${index}`);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (location.state && typeof location.state.scrollTo === 'number') {
      // 300ms 딜레이 후에 스크롤 처리
      setTimeout(() => {
        scrollToSection(location.state.scrollTo);
      }, 300);
    }
  }, [location]);

  return (
    <div className="relative min-h-screen">
      {/* 뒤로가기 버튼 */}
      <div className="absolute top-[75px] left-64 z-[999]">
        <button
          onClick={() => navigate(-1)}
          className="bg-white text-black border border-gray-300 shadow-md hover:bg-gray-300 active:bg-gray-500 px-4 py-2 rounded transition-colors"
        >
          ← 뒤로 가기
        </button>
      </div>

      {/* 백그라운드 애니메이션 */}
      <BackgroundAnimation />

      {/* 이미지 섹션 */}
      <div className="space-y-12 py-8 relative z-50 pt-16">
        {images.map((src, index) => (
          <section
            key={index}
            id={`section-${index}`}
            className={`w-full flex justify-center items-center relative ${index === 0 ? "mt-14" : ""}`}
          >
            <motion.img
              src={src}
              alt={`Ranking Image ${index + 1}`}
              className="w-full max-w-5xl h-auto"
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </section>
        ))}
      </div>
    </div>
  );
}
