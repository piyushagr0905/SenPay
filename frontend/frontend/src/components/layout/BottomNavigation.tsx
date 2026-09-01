import React from 'react';
import { motion } from 'framer-motion';
import { Home, Send, ShieldCheck, ShieldAlert, User, PieChart } from 'lucide-react';
import { NavigationTab } from '../../types';
import { cn } from '../../utils/cn';

interface BottomNavigationProps {
 activeTab: NavigationTab;
 onTabChange: (tab: NavigationTab) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
 activeTab,
 onTabChange,
}) => {
 const tabs = [
 { id: 'home' as NavigationTab, label: 'Home', icon: Home },
 { id: 'pay' as NavigationTab, label: 'Pay', icon: Send, isSpecial: true },
 { id: 'safecheck' as NavigationTab, label: 'SafeCheck', icon: ShieldCheck },
 { id: 'insights' as NavigationTab, label: 'Insights', icon: PieChart },
 { id: 'profile' as NavigationTab, label: 'Profile', icon: User },
 ];

 return (
 <div className="fixed bottom-4 inset-x-0 z-40 flex justify-center px-4 pointer-events-none">
 <nav
 aria-label="Main Navigation"
 className="pointer-events-auto flex items-center justify-between gap-1 sm:gap-2 px-3 py-2 bg-white/55 backdrop-blur-[28px] saturate-150 border border-white/85 shadow-[0_8px_40px_rgba(15,23,42,0.14),inset_0_1px_0_rgba(255,255,255,0.95)] rounded-full max-w-md w-full"
 >
 {tabs.map((tab) => {
 const Icon = tab.icon;
 const isActive = activeTab === tab.id;

 if (tab.isSpecial) {
 return (
 <motion.button
 key={tab.id}
 whileTap={{ scale: 0.92 }}
 onClick={() => onTabChange(tab.id)}
 className="relative flex flex-col items-center justify-center -my-3 px-3 py-1.5 focus:outline-none"
 >
 <div
 className={cn(
 'w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300',
 isActive
 ? 'bg-sentinel-900 text-white shadow-sentinel-900/30 scale-105'
 : 'bg-sentinel-accent text-white shadow-blue-500/25 hover:bg-blue-600'
 )}
 >
 <Icon className="w-5 h-5 stroke-[2.2]" />
 </div>
 <span
 className={cn(
 'text-[10px] mt-1 transition-colors',
 isActive ? 'text-sentinel-900 ' : 'text-ink-secondary'
 )}
 >
 {tab.label}
 </span>
 </motion.button>
 );
 }

 return (
 <motion.button
 key={tab.id}
 whileTap={{ scale: 0.92 }}
 onClick={() => onTabChange(tab.id)}
 className="relative flex-1 py-1.5 px-2 flex flex-col items-center justify-center rounded-2xl transition-colors focus:outline-none"
 >
 {isActive && (
 <motion.div
 layoutId="active-pill-bg"
 className="absolute inset-0 bg-white/70 backdrop-blur-[12px] rounded-2xl -z-10 border border-white/90 shadow-sm"
 transition={{ type: 'spring', stiffness: 500, damping: 35 }}
 />
 )}

 <Icon
 className={cn(
 'w-5 h-5 transition-colors duration-200',
 isActive ? 'text-sentinel-900 stroke-[2.4]' : 'text-ink-muted group-hover:text-ink-primary'
 )}
 />
 <span
 className={cn(
 'text-[10px] tracking-tight transition-colors duration-200 mt-1',
 isActive ? 'text-sentinel-900 ' : 'text-ink-muted '
 )}
 >
 {tab.label}
 </span>
 </motion.button>
 );
 })}
 </nav>
 </div>
 );
};
