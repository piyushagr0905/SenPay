import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ChevronRight, CheckCircle, Sparkles, Activity } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';

interface SafetyStatusCardProps {
 onLearnMore: () => void;
 scamsPrevented?: number;
 securityScore?: number;
}

export const SafetyStatusCard: React.FC<SafetyStatusCardProps> = ({
 onLearnMore,
 scamsPrevented = 3,
 securityScore = 98,
}) => {
 return (
 <GlassCard
 onClick={onLearnMore}
 className="p-4 cursor-pointer group transition-all"
 style={{ background: 'linear-gradient(135deg, rgba(219,234,254,0.55) 0%, rgba(255,255,255,0.65) 50%, rgba(238,242,255,0.45) 100%)', borderColor: 'rgba(147,197,253,0.50)', boxShadow: '0 4px 20px rgba(59,130,246,0.08), inset 0 1px 0 rgba(255,255,255,0.9)' }}
 >
 <div className="flex items-start justify-between">
 <div className="flex items-start gap-3">
 <div className="w-10 h-10 rounded-2xl bg-sentinel-shield/10 border border-sentinel-shield/20 flex items-center justify-center text-sentinel-shield shrink-0 shadow-sm group-hover:scale-105 transition-transform">
 <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
 </div>

 <div>
 <div className="flex items-center gap-1.5">
 <h2 className="font-bold text-sm text-ink-primary tracking-tight">
 Your payment protection is active
 </h2>
 </div>
 <p className="text-xs text-ink-secondary mt-0.5 leading-relaxed">
 Every payment can be checked before you send it.
 </p>
 </div>
 </div>

 <ChevronRight className="w-4 h-4 text-ink-muted group-hover:text-ink-primary group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
 </div>

 <div className="mt-3 pt-3 border-t border-blue-100/60 grid grid-cols-2 gap-2 text-xs">
 <div className="flex items-center gap-1.5 text-ink-secondary">
 <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
 <span className="text-[11px]">
 <strong className="text-ink-primary">{scamsPrevented} scams</strong> paused
 </span>
 </div>

 <div className="flex items-center gap-1.5 text-ink-secondary justify-end">
 <Activity className="w-3.5 h-3.5 text-blue-500 shrink-0" />
 <span className="text-[11px]">
 Safety Score: <strong className="text-ink-primary">{securityScore}/100</strong>
 </span>
 </div>
 </div>
 </GlassCard>
 );
};
