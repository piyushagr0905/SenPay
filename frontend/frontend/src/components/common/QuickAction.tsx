import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface QuickActionProps {
 icon: React.ReactNode;
 label: string;
 sublabel?: string;
 onClick: () => void;
 variant?: 'blue' | 'green' | 'amber' | 'purple' | 'default';
 badge?: string;
 className?: string;
}

export const QuickAction: React.FC<QuickActionProps> = ({
 icon,
 label,
 sublabel,
 onClick,
 variant = 'default',
 badge,
 className,
}) => {
 return (
 <motion.button
 whileTap={{ scale: 0.94 }}
 onClick={onClick}
 className={cn(
 'flex flex-col items-center justify-start py-2 px-1 relative group w-full',
 className
 )}
 >
 {badge && (
 <span className="absolute top-0 right-0 px-1.5 py-0.5 text-[9px] bg-red-500 text-white rounded-full shadow-sm z-10 font-semibold">
 {badge}
 </span>
 )}
 <div
 className={cn(
 'w-10 h-10 rounded-xl flex items-center justify-center mb-1.5 transition-transform duration-200 group-hover:scale-105',
 'bg-[#5f259f] text-white' // PhonePe purple background for icons
 )}
 >
 {icon}
 </div>
 <span className="text-[11px] text-gray-800 tracking-tight font-medium text-center leading-tight">{label}</span>
 {sublabel && <span className="text-[9px] text-gray-500 mt-0.5 text-center">{sublabel}</span>}
 </motion.button>
 );
};
