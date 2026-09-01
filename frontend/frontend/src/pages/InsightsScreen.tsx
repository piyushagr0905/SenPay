import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, TrendingDown, PieChart, Sparkles, Utensils, ShoppingBag, Car, Coffee } from 'lucide-react';

interface InsightsScreenProps {
  onBack: () => void;
}

export const InsightsScreen: React.FC<InsightsScreenProps> = ({ onBack }) => {
  // Mock data for the donut chart
  const data = [
    { label: 'Food & Dining', value: 45, color: '#3b82f6', icon: Utensils },
    { label: 'Shopping', value: 25, color: '#8b5cf6', icon: ShoppingBag },
    { label: 'Transport', value: 15, color: '#f59e0b', icon: Car },
    { label: 'Others', value: 15, color: '#10b981', icon: Coffee },
  ];

  let cumulativePercent = 0;
  const segments = data.map(slice => {
    const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
    cumulativePercent += slice.value / 100;
    const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
    const largeArcFlag = slice.value > 50 ? 1 : 0;
    const pathData = [
      `M ${startX} ${startY}`,
      `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`
    ].join(' ');
    
    return { ...slice, pathData };
  });

  function getCoordinatesForPercent(percent: number) {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  }

  return (
    <div className="flex flex-col h-full bg-surface-base font-apple relative overflow-hidden">
      
      <main className="flex-1 overflow-y-auto pb-24 px-5 pt-6 space-y-6 max-w-md mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-ink-primary active:scale-95 transition-transform">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-ink-primary">AI Insights</h1>
          <div className="w-10 h-10 rounded-full bg-sentinel-100 flex items-center justify-center text-sentinel-accent">
            <PieChart className="w-5 h-5" />
          </div>
        </div>

        {/* Total Spend */}
        <div className="text-center">
          <p className="text-ink-secondary text-sm font-medium uppercase tracking-wider mb-1">Total Spent This Week</p>
          <h2 className="text-4xl font-extrabold text-ink-primary tracking-tight">₹12,450</h2>
          <div className="flex items-center justify-center gap-1 mt-2 text-rose-500 font-semibold text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>+15% from last week</span>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="relative w-48 h-48 mx-auto mt-8 mb-6">
          <svg viewBox="-1 -1 2 2" className="transform -rotate-90 w-full h-full filter drop-shadow-md">
            {segments.map((segment, index) => (
              <motion.path
                key={index}
                d={segment.pathData}
                fill="none"
                stroke={segment.color}
                strokeWidth="0.3"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: index * 0.2, ease: "easeOut" }}
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-3xl font-black text-ink-primary">4</span>
            <span className="text-[10px] uppercase font-bold text-ink-muted tracking-widest mt-1">Categories</span>
          </div>
        </div>

        {/* AI Insight Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="bg-sentinel-900 rounded-[24px] p-5 shadow-lg relative overflow-hidden"
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-sentinel-accent opacity-20 blur-2xl rounded-full" />
          <div className="flex gap-3 relative z-10">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-sentinel-accent shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-white font-bold text-[15px] mb-1">Sentinel AI Alert</h3>
              <p className="text-white/80 text-[13px] leading-relaxed">
                Your spending on <strong className="text-white">Food & Dining</strong> is exceptionally high this week. 
                We have automatically adjusted your daily recommended limit to <strong className="text-white">₹800</strong> to keep you on track.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Categories Breakdown */}
        <div className="space-y-3">
          <h3 className="font-bold text-ink-primary px-1 mb-2">Spending Breakdown</h3>
          {data.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + (index * 0.1) }}
              className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-inner" style={{ backgroundColor: item.color }}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[14px] text-ink-primary">{item.label}</h4>
                  <p className="text-[12px] text-ink-secondary">{item.value}% of total</p>
                </div>
              </div>
              <span className="font-bold text-[15px] text-ink-primary">
                ₹{((item.value / 100) * 12450).toLocaleString('en-IN')}
              </span>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};
