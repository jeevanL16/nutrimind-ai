import React from 'react';
import { motion } from 'framer-motion';

const HealthRing = ({ score, size = 200, strokeWidth = 14 }) => {
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
    <div className="relative flex justify-center items-center">
      <div className="relative flex justify-center items-center" style={{ width: size, height: size }}>
        {/* Glow effect */}
        <div 
          className="absolute inset-0 rounded-full blur-[40px] opacity-20 transition-all duration-1000"
          style={{ backgroundColor: color }}
        />
        
        <svg className="absolute inset-0 w-full h-full transform -rotate-90 filter drop-shadow-2xl">
          <defs>
            <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} />
              <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.5" />
            </linearGradient>
          </defs>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255,255,255,0.03)"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeLinecap="round"
          />
          <motion.circle
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 2, ease: [0.23, 1, 0.32, 1] }}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeLinecap="round"
            style={{ strokeDasharray: circumference, filter: `drop-shadow(0 0 10px ${color})` }}
          />
        </svg>
      </div>
    </div>
  );
};

export default HealthRing;
