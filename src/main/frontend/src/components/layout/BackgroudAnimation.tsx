import { motion } from "framer-motion";
import "./BackgroundAnimation.css";

// 오픈소스 이미지 링크들
const CLOUD_IMAGE = "https://www.svgrepo.com/show/513285/cloud.svg";
const LEAF_IMAGE = "https://www.svgrepo.com/show/416476/leaf-salad-seasoning.svg";

const BackgroundAnimation = () => {
  return (
    <div 
    className="background-container fixed top-0 left-0 w-full h-full pointer-events-none z-0"
    style={{ 
      background: 'linear-gradient(to bottom, rgba(217, 234, 244, 0.9), rgba(251, 248, 239, 0.9))',
      backdropFilter: 'blur(3px)'
    }}
    >
      {/* ☁️ 구름 애니메이션 */}
      {[1, 2, 3].map((cloud) => ( 
        <motion.img
          key={cloud}
          src={CLOUD_IMAGE}
          className={`cloud cloud-${cloud}`}
          animate={{ 
            x: [0, window.innerWidth, 0], 
            opacity: [0.3, 0.7, 0.3] 
          }}
          transition={{ 
            duration: 30 * cloud, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        />
      ))}

      {/* 🌿 나뭇잎 애니메이션 */}
      {[...Array(10)].map((_, index) => (
        <motion.img
          key={index}
          src={LEAF_IMAGE}
          className="leaf"
          style={{ 
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
          }}
          animate={{ 
            y: [0, window.innerHeight, 0], 
            x: [-50, 50, -50],
            rotate: [0, 360, 0], 
            opacity: [0, 0.8, 0] 
          }}
          transition={{ 
            duration: 15 + index * 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
      ))}

      {/* ✨ 빛의 흐름 */}
      <motion.div
        className="light-glow"
        animate={{ 
          x: ["-50%", "50%", "-50%"], 
          opacity: [0.2, 0.5, 0.2] 
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      />
    </div>
  );
};

export default BackgroundAnimation;
