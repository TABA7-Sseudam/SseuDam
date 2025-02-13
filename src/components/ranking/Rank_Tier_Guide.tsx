// src/components/ranking/Rank_Tier_Guide.tsx
// import React from "react";
import { motion } from "framer-motion";

const images = [
  '/Ranking/1.jpg',
  '/Ranking/2.jpg',
  '/Ranking/3.jpg',
  '/Ranking/3.5.2.jpg',
  '/Ranking/4.jpg',
  '/Ranking/5.jpg',
  '/Ranking/6.jpg',
  '/Ranking/7.jpg',
  '/Ranking/8.jpg'
];

export default function RankTierGuide() {
  return (
    <div className="space-y-12 py-8">
      {images.map((src, index) => (
        <section
          key={index}
          className="w-full flex justify-center items-center"
        >
          <motion.img
            src={src}
            alt={`Ranking Image ${index + 1}`}
            className="w-full max-w-5xl h-auto"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.04 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          />
        </section>
      ))}
    </div>
  );
}
