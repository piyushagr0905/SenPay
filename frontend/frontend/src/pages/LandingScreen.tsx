import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, Zap, Lock, Activity, ChevronRight, Fingerprint } from 'lucide-react';
import { haptics } from '../utils/haptics';

interface LandingScreenProps {
  onStartDemo: () => void;
}

export function LandingScreen({ onStartDemo }: LandingScreenProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (window.innerWidth > 768) {
      setMousePosition({ x: e.clientX, y: e.clientY });
    }
  };

  return (
    <div 
      className="relative w-full h-full bg-surface-bg flex flex-col items-center justify-between overflow-hidden font-apple"
      onMouseMove={handleMouseMove}
    >
      {/* Interactive Background Gradient */}
      <motion.div 
        animate={{
          x: mousePosition.x / 25,
          y: mousePosition.y / 25,
        }}
        transition={{ type: "spring", damping: 50, stiffness: 200 }}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      >
        <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[60%] bg-gradient-radial from-indigo-200/50 to-transparent blur-3xl opacity-80 mix-blend-multiply" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[70%] bg-gradient-radial from-purple-200/50 to-transparent blur-3xl opacity-80 mix-blend-multiply" />
      </motion.div>

      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4xNSkiLz48L3N2Zz4=')] [mask-image:linear-gradient(to_bottom,white,transparent)] pointer-events-none" />

      <div className="flex-1 w-full flex flex-col items-center justify-center px-6 z-10 pt-16 pb-8">
        
        {/* Top Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="px-4 py-1.5 rounded-full bg-white/60 border border-gray-200 backdrop-blur-md shadow-sm mb-10 flex items-center gap-2"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sentinel-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sentinel-accent"></span>
          </span>
          <span className="text-[10px] font-bold text-ink-secondary tracking-wider uppercase">Sentinel Pay v2.0</span>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="flex flex-col items-center mb-10 text-center"
        >
          <div className="relative mb-6 group cursor-default flex items-center justify-center">
            <div className="absolute inset-0 bg-sentinel-900 blur-2xl opacity-20 rounded-full animate-pulse" />
            <img src="/logo.png" alt="SenPay Logo" className="h-20 w-auto object-contain relative z-10" />
          </div>
          
          <h1 className="text-[44px] md:text-[54px] font-black tracking-tight text-ink-primary mb-4 leading-[1.1]">
            Pay with <br/>
            <span className="text-sentinel-accent">Confidence.</span>
          </h1>
          <p className="text-[15px] text-ink-secondary font-medium max-w-[260px] leading-relaxed">
            The world's first AI-powered risk intelligence for every UPI transaction.
          </p>
        </motion.div>

        {/* Feature Cards Matrix */}
        <div className="w-full max-w-sm grid grid-cols-2 gap-3 mb-8">
          <FeatureCard delay={0.3} icon={<Zap className="w-5 h-5 text-sentinel-accent" />} title="Instant UPI" />
          <FeatureCard delay={0.4} icon={<Activity className="w-5 h-5 text-indigo-500" />} title="AI Risk Engine" />
          <FeatureCard delay={0.5} icon={<Lock className="w-5 h-5 text-sentinel-900" />} title="Scam Shield" />
          <FeatureCard delay={0.6} icon={<Fingerprint className="w-5 h-5 text-purple-500" />} title="Biometrics" />
        </div>
      </div>

      {/* Action Footer */}
      <motion.div 
        className="w-full px-6 pb-12 z-20 max-w-sm mx-auto"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7, type: "spring" }}
      >
        <button
          onClick={() => { haptics.medium(); onStartDemo(); }}
          className="w-full py-4 bg-sentinel-900 text-white rounded-[20px] font-bold text-[17px] shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          Launch Application <ArrowRight className="w-5 h-5" />
        </button>
        
        <button 
          onClick={() => { haptics.light(); onStartDemo(); }}
          className="w-full mt-6 flex items-center justify-center gap-2 text-ink-muted font-semibold text-[13px] hover:text-ink-primary transition-colors active:scale-95"
        >
          Explore Technical Features <ChevronRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
}

function FeatureCard({ icon, title, delay }: { icon: React.ReactNode; title: string; delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, type: "spring" }}
      className="flex flex-col items-start p-4 rounded-[1.5rem] bg-white border border-gray-100 shadow-sm"
    >
      <div className="w-10 h-10 rounded-[1rem] bg-surface-bg flex items-center justify-center mb-3 border border-gray-100">
        {icon}
      </div>
      <h3 className="font-bold text-ink-primary tracking-tight text-[14px]">{title}</h3>
    </motion.div>
  );
}
