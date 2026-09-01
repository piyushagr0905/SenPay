import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, ShieldCheck } from 'lucide-react';
import { haptics } from '../../utils/haptics';

interface DigitalGoldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBuyGold: (amount: number) => void;
}

export const DigitalGoldModal: React.FC<DigitalGoldModalProps> = ({ isOpen, onClose, onBuyGold }) => {
  const [amount, setAmount] = useState('');
  const [goldPrice] = useState(7250); // ₹/gm

  useEffect(() => {
    if (isOpen) {
      setAmount('');
    }
  }, [isOpen]);

  const handleBuy = () => {
    const numAmount = parseFloat(amount);
    if (numAmount > 0) {
      haptics.success();
      onBuyGold(numAmount);
    }
  };

  const getGrams = () => {
    const num = parseFloat(amount);
    if (!num || num <= 0) return '0.0000';
    return (num / goldPrice).toFixed(4);
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
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-ink-primary">Digital Gold</h2>
            <button onClick={onClose} className="p-2 text-ink-muted hover:text-ink-primary bg-gray-50 rounded-full active:scale-95 transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-amber-100 rounded-[24px] p-5 mb-6 text-amber-900 border border-amber-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold opacity-80 uppercase tracking-widest">Live Buy Price</span>
              <div className="flex items-center gap-1 bg-white/50 px-2 py-1 rounded-full text-[10px] font-bold">
                <TrendingUp className="w-3 h-3 text-green-600" />
                <span className="text-green-700">+0.4%</span>
              </div>
            </div>
            <p className="text-3xl font-black">₹{goldPrice.toLocaleString('en-IN')}<span className="text-lg opacity-60">/gm</span></p>
            <p className="text-xs font-semibold opacity-60 mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> 24K • 99.99% Purity SafeGold
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-ink-primary mb-1 block">Buy in Rupees (₹)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-ink-primary">₹</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="w-full pl-10 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-2xl font-black text-ink-primary transition-all"
                />
              </div>
            </div>

            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-sm font-semibold text-ink-secondary">You get (approx)</span>
              <span className="text-lg font-bold text-ink-primary">{getGrams()} gm</span>
            </div>

            <button
              onClick={handleBuy}
              disabled={!amount || parseFloat(amount) <= 0}
              className="w-full py-4 bg-amber-500 text-white font-bold rounded-2xl disabled:opacity-50 active:scale-95 transition-transform shadow-md hover:bg-amber-600"
            >
              Buy Gold Instantly
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
