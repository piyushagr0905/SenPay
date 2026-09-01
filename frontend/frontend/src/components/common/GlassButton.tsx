import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../utils/cn';

interface GlassButtonProps extends HTMLMotionProps<'button'> {
 children: React.ReactNode;
 variant?: 'primary' | 'secondary' | 'safe' | 'warning' | 'danger' | 'ghost' | 'glass';
 size?: 'sm' | 'md' | 'lg';
 fullWidth?: boolean;
 disabled?: boolean;
 leftIcon?: React.ReactNode;
 rightIcon?: React.ReactNode;
 onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
 children,
 className,
 variant = 'primary',
 size = 'md',
 fullWidth = false,
 disabled = false,
 leftIcon,
 rightIcon,
 onClick,
 ...props
}) => {
 const sizeStyles = {
 sm: 'text-xs px-3.5 py-1.5 rounded-full gap-1.5 min-h-[32px]',
 md: 'text-sm px-5 py-2.5 rounded-ios-sm gap-2 min-h-[44px]',
 lg: 'text-base px-6 py-3.5 rounded-ios gap-2.5 min-h-[52px]',
 };

 const variantStyles = {
 primary:
 'bg-sentinel-900/90 backdrop-blur-[16px] text-white border border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.12)] hover:bg-black/85 active:bg-zinc-900 disabled:bg-gray-200 disabled:text-gray-400',
 secondary:
 'bg-white/60 backdrop-blur-[16px] text-ink-primary border border-white/80 shadow-[0_4px_16px_rgba(15,23,42,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] hover:bg-white/80',
 safe:
 'bg-emerald-600/90 backdrop-blur-[16px] text-white border border-emerald-400/30 shadow-[0_4px_16px_rgba(48,209,88,0.25),inset_0_1px_0_rgba(255,255,255,0.12)] hover:bg-emerald-700',
 warning:
 'bg-amber-500/90 backdrop-blur-[16px] text-white border border-amber-300/30 shadow-[0_4px_16px_rgba(255,159,10,0.25),inset_0_1px_0_rgba(255,255,255,0.12)] hover:bg-amber-600',
 danger:
 'bg-rose-500/90 backdrop-blur-[16px] text-white border border-rose-300/30 shadow-[0_4px_16px_rgba(244,63,94,0.25),inset_0_1px_0_rgba(255,255,255,0.12)] hover:bg-rose-600',
 ghost:
 'bg-transparent text-ink-secondary hover:text-ink-primary hover:bg-white/40 backdrop-blur-[8px] active:bg-white/60',
 glass:
 'bg-white/55 backdrop-blur-[20px] saturate-150 text-ink-primary border border-white/85 shadow-[0_4px_16px_rgba(15,23,42,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] hover:bg-white/75',
 };

 return (
 <motion.button
 whileTap={{ scale: disabled ? 1 : 0.97 }}
 transition={{ type: 'spring', stiffness: 400, damping: 25 }}
 disabled={disabled}
 className={cn(
 'inline-flex items-center justify-center transition-colors select-none font-apple tracking-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-sentinel-accent/40',
 sizeStyles[size],
 variantStyles[variant],
 fullWidth && 'w-full',
 disabled && 'cursor-not-allowed opacity-60',
 className
 )}
 onClick={onClick}
 {...props}
 >
 {leftIcon && <span className="shrink-0">{leftIcon}</span>}
 <span>{children}</span>
 {rightIcon && <span className="shrink-0">{rightIcon}</span>}
 </motion.button>
 );
};
