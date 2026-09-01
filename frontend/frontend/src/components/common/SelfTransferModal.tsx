import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, ArrowRight, ArrowDownUp } from 'lucide-react';
import { haptics } from '../../utils/haptics';

interface SelfTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInitiateTransfer: (amount: number, fromAccount: string, toAccount: string) => void;
}

export const SelfTransferModal: React.FC<SelfTransferModalProps> = ({ isOpen, onClose, onInitiateTransfer }) => {
  const [amount, setAmount] = useState<string>('');
  const [fromAccount, setFromAccount] = useState('HDFC Bank •••• 4321');
  const [toAccount, setToAccount] = useState('SBI •••• 9876');

  useEffect(() => {
    if (isOpen) {
      setAmount('');
    }
  }, [isOpen]);

  const handleSwap = () => {
    haptics.light();
    const temp = fromAccount;
    setFromAccount(toAccount);
    setToAccount(temp);
  };

  const handleProceed = () => {
    const numAmount = parseFloat(amount);
    if (numAmount > 0) {
      haptics.medium();
      onInitiateTransfer(numAmount, fromAccount, toAccount);
      onClose();
    }
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
            <h2 className="text-xl font-bold text-ink-primary">Self Transfer</h2>
            <button onClick={onClose} className="p-2 text-ink-muted hover:text-ink-primary bg-gray-50 rounded-full active:scale-95 transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Account Selector */}
            <div className="relative">
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-ink-secondary">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-ink-secondary uppercase tracking-widest mb-0.5">From</p>
                    <p className="font-bold text-[15px] text-ink-primary">{fromAccount}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-sentinel-100 flex items-center justify-center shadow-sm text-sentinel-accent">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-ink-secondary uppercase tracking-widest mb-0.5">To</p>
                    <p className="font-bold text-[15px] text-ink-primary">{toAccount}</p>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={handleSwap}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-ink-primary active:scale-90 transition-transform z-10"
              >
                <ArrowDownUp className="w-4 h-4" />
              </button>
            </div>

            {/* Amount Input */}
            <div className="flex flex-col items-center justify-center py-4">
              <span className="text-3xl font-bold text-ink-primary">₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                autoFocus
                className="w-full text-center text-5xl font-black text-ink-primary bg-transparent focus:outline-none placeholder-gray-300 mt-2"
              />
            </div>

            <button
              onClick={handleProceed}
              disabled={!amount || parseFloat(amount) <= 0}
              className="w-full py-4 bg-sentinel-900 text-white font-bold rounded-2xl disabled:opacity-50 active:scale-95 transition-transform"
            >
              Transfer Now
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
