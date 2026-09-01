import React from 'react';
import { motion } from 'framer-motion';

interface SecurityScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

export const SecurityScoreRing: React.FC<SecurityScoreRingProps> = ({
  score,
  size = 120,
  strokeWidth = 10,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;
  
  // Determine color based on score
  let colorClass = 'text-sentinel-success'; // Green
  let strokeColor = '#30D158'; // Green
  
  if (score < 40) {
    colorClass = 'text-rose-500';
    strokeColor = '#F43F5E';
  } else if (score < 75) {
    colorClass = 'text-amber-500';
    strokeColor = '#F59E0B';
  }

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Background Ring */}
      <svg className="absolute transform -rotate-90" width={size} height={size}>
        <circle
          className="text-gray-100"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Animated Progress Ring */}
        <motion.circle
          className={colorClass}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference} // Start empty
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
        />
      </svg>
      
      {/* Score Text */}
      <div className="absolute flex flex-col items-center justify-center text-center">
        <motion.span 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className={`font-bold tracking-tighter leading-none ${colorClass}`}
          style={{ fontSize: size * 0.28 }}
        >
          {score}
        </motion.span>
        <span className="text-[10px] text-ink-secondary font-bold uppercase tracking-widest mt-1">
          Score
        </span>
      </div>
    </div>
  );
};
