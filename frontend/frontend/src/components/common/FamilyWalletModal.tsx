import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Baby, Check, AlertCircle } from 'lucide-react';
import { haptics } from '../../utils/haptics';

interface FamilyWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (rules: any) => void;
}

export const FamilyWalletModal: React.FC<FamilyWalletModalProps> = ({ isOpen, onClose, onSave }) => {
  const [dailyLimit, setDailyLimit] = useState('500');
  const [blockGaming, setBlockGaming] = useState(true);

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
          className="relative w-full max-w-sm bg-white rounded-[32px] p-6 shadow-2xl overflow-hidden font-apple"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-ink-primary">Family Controls</h2>
            <button onClick={() => { haptics.light(); onClose(); }} className="p-2 text-ink-muted hover:text-ink-primary bg-gray-50 rounded-full active:scale-95 transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col items-center mb-6 text-center">
            <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center mb-3">
              <Baby className="w-8 h-8 text-pink-600" />
            </div>
            <h3 className="font-bold text-lg text-ink-primary">Teen Wallet Active</h3>
            <p className="text-sm text-ink-secondary">Set AI-enforced spending rules for your teen.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-ink-primary mb-1 block">Daily Spending Limit (₹)</label>
              <input
                type="number"
                value={dailyLimit}
                onChange={e => setDailyLimit(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 font-bold"
              />
            </div>

            <button
              onClick={() => { haptics.light(); setBlockGaming(!blockGaming); }}
              className={`w-full p-4 flex items-center justify-between rounded-xl border ${blockGaming ? 'bg-pink-50 border-pink-200' : 'bg-white border-gray-200'}`}
            >
              <div className="flex items-center gap-2">
                <AlertCircle className={`w-5 h-5 ${blockGaming ? 'text-pink-600' : 'text-gray-400'}`} />
                <span className={`font-bold text-sm ${blockGaming ? 'text-pink-700' : 'text-gray-600'}`}>Block Gaming/In-App Purchases</span>
              </div>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${blockGaming ? 'bg-pink-600 text-white' : 'bg-gray-200'}`}>
                {blockGaming && <Check className="w-4 h-4" />}
              </div>
            </button>
            
            <button
              onClick={() => {
                haptics.success();
                onSave({ dailyLimit, blockGaming });
              }}
              className="w-full py-4 bg-pink-600 text-white font-bold rounded-2xl shadow-md active:scale-95 transition-transform mt-4"
            >
              Save Family Rules
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
