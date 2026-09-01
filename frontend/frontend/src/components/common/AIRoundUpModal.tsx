import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingDown, TrendingUp, Sparkles, AlertTriangle, Settings, PiggyBank } from 'lucide-react';
import { haptics } from '../../utils/haptics';

interface AIRoundUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIRoundUpModal: React.FC<AIRoundUpModalProps> = ({ isOpen, onClose }) => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [marketStatus, setMarketStatus] = useState<'dipping' | 'stable' | 'peaking'>('dipping');
  const [multiplier, setMultiplier] = useState(2.5); // Random multiplier for dipping
  const [investedAmount] = useState(1450); // Dummy saved amount

  useEffect(() => {
    if (isOpen) {
      // Simulate real-time market check
      const statuses: ('dipping' | 'stable' | 'peaking')[] = ['dipping', 'dipping', 'stable'];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      setMarketStatus(status);
      setMultiplier(status === 'dipping' ? 2.5 : status === 'stable' ? 1.0 : 0.5);
    }
  }, [isOpen]);

  const handleToggle = () => {
    haptics.light();
    setIsEnabled(!isEnabled);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-sm bg-white rounded-[32px] p-6 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-ink-primary flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" /> AI Round-Ups
            </h2>
            <button onClick={onClose} className="p-2 text-ink-muted hover:text-ink-primary bg-gray-50 rounded-full active:scale-95 transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* AI "Buy the Dip" logic box */}
          <div className={`rounded-[24px] p-5 mb-6 text-white border relative overflow-hidden ${
            marketStatus === 'dipping' 
              ? 'bg-gradient-to-br from-purple-600 to-indigo-800 border-purple-400' 
              : 'bg-gradient-to-br from-slate-700 to-slate-900 border-slate-600'
          }`}>
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white opacity-10 blur-2xl rounded-full" />
            
            <div className="flex justify-between items-center mb-3 relative z-10">
              <span className="text-[11px] font-bold opacity-80 uppercase tracking-widest flex items-center gap-1">
                Sentinel AI Market Scan
              </span>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${
                marketStatus === 'dipping' ? 'bg-red-500/20 text-red-200' : 'bg-green-500/20 text-green-200'
              }`}>
                {marketStatus === 'dipping' ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                <span>{marketStatus === 'dipping' ? 'Market Dipping' : 'Market Stable'}</span>
              </div>
            </div>
            
            <p className="text-xl font-black relative z-10 leading-tight">
              {marketStatus === 'dipping' 
                ? "Aggressive Buying Mode Active." 
                : "Conservative Buying Mode."}
            </p>
            <p className="text-xs font-medium opacity-80 mt-2 relative z-10">
              {marketStatus === 'dipping'
                ? `Stocks are down. Sentinel is applying a ${multiplier}x multiplier to your round-ups to buy the dip.`
                : `Market is stable. Sentinel is using standard 1x round-ups.`}
            </p>
          </div>

          <div className="space-y-4">
            {/* Toggle Switch */}
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isEnabled ? 'bg-purple-100 text-purple-600' : 'bg-gray-200 text-gray-500'}`}>
                  <PiggyBank className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-ink-primary">Auto-Invest Change</span>
                  <span className="text-xs text-ink-secondary">Round up every payment</span>
                </div>
              </div>
              <button 
                onClick={handleToggle}
                className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${isEnabled ? 'bg-purple-600' : 'bg-gray-300'}`}
              >
                <motion.div 
                  className="w-4 h-4 bg-white rounded-full shadow-sm"
                  animate={{ x: isEnabled ? 24 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>

            {/* Example Box */}
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold text-amber-900">How it works right now</span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                If you buy a coffee for <strong>₹145</strong>, we'll round up <strong>₹5</strong>. 
                <br/>Because the market is {marketStatus}, we apply a <strong>{multiplier}x</strong> multiplier.
                <br/>Total invested: <strong>₹{(5 * multiplier).toFixed(1)}</strong> into your index fund.
              </p>
            </div>

            {/* Stats */}
            <div className="flex justify-between items-center px-2 py-1">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-ink-muted">Total Invested</span>
                <span className="text-lg font-black text-ink-primary">₹{investedAmount.toLocaleString('en-IN')}</span>
              </div>
              <button className="text-purple-600 p-2 bg-purple-50 rounded-full">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
