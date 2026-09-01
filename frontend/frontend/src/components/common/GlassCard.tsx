import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../utils/cn';

interface GlassCardProps extends HTMLMotionProps<'div'> {
 children: React.ReactNode;
 className?: string;
 variant?: 'default' | 'subtle' | 'opaque' | 'warning' | 'danger' | 'success' | 'interactive';
 onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
 children,
 className,
 variant = 'default',
 onClick,
 ...props
}) => {
 const variantStyles = {
 default:
 'bg-white/60 backdrop-blur-[28px] saturate-150 border border-white/85 shadow-[0_8px_32px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.95)]',
 subtle:
 'bg-white/40 backdrop-blur-[20px] saturate-150 border border-white/70 shadow-[0_4px_16px_rgba(15,23,42,0.06),inset_0_1px_0_rgba(255,255,255,0.8)]',
 opaque:
 'bg-white/90 backdrop-blur-[16px] border border-white/95 shadow-[0_4px_16px_rgba(15,23,42,0.06)]',
 warning:
 'bg-amber-50/70 backdrop-blur-[24px] saturate-150 border border-amber-200/80 shadow-[0_4px_20px_rgba(255,159,10,0.10),inset_0_1px_0_rgba(255,255,255,0.8)]',
 danger:
 'bg-rose-50/70 backdrop-blur-[24px] saturate-150 border border-rose-200/80 shadow-[0_4px_20px_rgba(244,63,94,0.10),inset_0_1px_0_rgba(255,255,255,0.8)]',
 success:
 'bg-emerald-50/70 backdrop-blur-[24px] saturate-150 border border-emerald-200/80 shadow-[0_4px_20px_rgba(48,209,88,0.10),inset_0_1px_0_rgba(255,255,255,0.8)]',
 interactive:
 'bg-white/60 backdrop-blur-[28px] saturate-150 border border-white/85 shadow-[0_8px_32px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.95)] hover:bg-white/80 hover:shadow-[0_16px_48px_rgba(15,23,42,0.12),inset_0_1px_0_rgba(255,255,255,0.98)] cursor-pointer transition-all duration-200 active:scale-[0.98]',
 };

 return (
 <motion.div
 className={cn(
 'rounded-ios-lg p-4 text-ink-primary relative overflow-hidden',
 variantStyles[variant],
 className
 )}
 onClick={onClick}
 {...props}
 >
 {children}
 </motion.div>
 );
};
