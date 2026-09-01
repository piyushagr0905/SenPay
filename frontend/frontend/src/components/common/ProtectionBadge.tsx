import React from 'react';
import { ShieldCheck, ShieldAlert } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ProtectionBadgeProps {
 active?: boolean;
 size?: 'sm' | 'md';
 pulse?: boolean;
 className?: string;
}

export const ProtectionBadge: React.FC<ProtectionBadgeProps> = ({
 active = true,
 size = 'md',
 pulse = true,
 className,
}) => {
 return (
 <div
 className={cn(
 'inline-flex items-center rounded-full tracking-tight backdrop-blur-md transition-all',
 active
 ? 'bg-emerald-500/10 border border-emerald-500/25 text-emerald-700'
 : 'bg-rose-500/10 border border-rose-500/25 text-rose-700',
 size === 'sm' ? 'px-2.5 py-0.5 text-[11px] gap-1.5' : 'px-3 py-1 text-xs gap-2',
 className
 )}
 >
 <span className="relative flex h-2 w-2">
 {active && pulse && (
 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
 )}
 <span
 className={cn(
 'relative inline-flex rounded-full h-2 w-2',
 active ? 'bg-emerald-500' : 'bg-rose-500'
 )}
 />
 </span>
 {active ? (
 <span className="flex items-center gap-1">
 <ShieldCheck className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
 SENTINEL ACTIVE
 </span>
 ) : (
 <span className="flex items-center gap-1">
 <ShieldAlert className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
 PROTECTION PAUSED
 </span>
 )}
 </div>
 );
};
