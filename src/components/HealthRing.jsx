import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

const HealthRing = ({ score, size = 200, strokeWidth = 14 }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const controls = useAnimation();

  useEffect(() => {
    // Count up animation
    let start = 0;
    const end = score;
    if (end === 0) return;
    
    const duration = 1500;
    const stepTime = Math.abs(Math.floor(duration / end));
    
    const timer = setInterval(() => {
      start += 1;
      setAnimatedScore(start);
      if (start >= end) clearInterval(timer);
    }, stepTime);
    
    return () => clearInterval(timer);
  }, [score]);

  const getColor = (val) => {
    if (val >= 80) return '#00FF87'; // Neon Green
    if (val >= 50) return '#FBBF24'; // Yellow
    return '#EF4444'; // Red
  };

  const color = getColor(score);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex justify-center items-center py-4">
      <div className="relative flex justify-center items-center" style={{ width: size, height: size }}>
        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeLinecap="round"
          />
          <motion.circle
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeLinecap="round"
            style={{ strokeDasharray: circumference }}
            className="drop-shadow-[0_0_12px_rgba(0,255,135,0.5)]"
          />
        </svg>

        <div className="text-center flex flex-col items-center justify-center z-10">
          <motion.span 
            className="text-6xl font-black tracking-tighter"
            style={{ color }}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
          >
            {animatedScore}
          </motion.span>
          <span className="text-xs text-white/50 font-bold uppercase tracking-[0.2em] mt-1">
            Health Score
          </span>
        </div>
      </div>
    </div>
  );
};

export default HealthRing;
