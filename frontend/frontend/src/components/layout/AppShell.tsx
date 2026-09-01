import React from 'react';
import { cn } from '../../utils/cn';

interface AppShellProps {
 children: React.ReactNode;
 isDeviceFrame?: boolean;
}

export const AppShell: React.FC<AppShellProps> = ({
 children,
 isDeviceFrame = false,
}) => {
 return (
 <div className="h-[100dvh] w-full text-ink-primary flex flex-col items-center justify-center relative overflow-hidden sm:py-4 bg-black">
 {/* Main Container */}
 <div
 className={cn(
 'transition-all duration-300 relative flex flex-col transform',
 isDeviceFrame
 ? 'w-full max-w-[375px] h-[85vh] max-h-[812px] min-h-[600px] rounded-[40px] border-[8px] sm:border-[10px] border-slate-900 shadow-[0_25px_70px_rgba(0,0,0,0.18),0_0_0_1px_rgba(255,255,255,0.1)] bg-surface-bg overflow-hidden'
 : 'w-full max-w-sm md:max-w-[400px] h-full sm:h-[85vh] sm:max-h-[800px] sm:my-4 sm:rounded-ios-2xl sm:border-[1.5px] sm:border-white/20 sm:shadow-2xl bg-surface-bg overflow-hidden'
 )}
 >
 {/* iPhone Dynamic Island & Speaker Bar if in device frame */}
 {isDeviceFrame && (
 <div className="sticky top-0 z-50 pt-2 pb-1 bg-inherit flex justify-center items-center select-none pointer-events-none">
 <div className="w-28 h-6 bg-black rounded-full flex items-center justify-between px-2.5 shadow-inner">
 <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-800" />
 <div className="flex items-center gap-1.5">
 <span className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
 <span className="text-[9px] text-white tracking-widest uppercase">
 SENTINEL
 </span>
 </div>
 </div>
 </div>
 )}

 {/* Content Viewport */}
 <main className="flex-1 pb-24 relative overflow-y-auto">
 {children}
 </main>
 </div>
 </div>
 );
};
