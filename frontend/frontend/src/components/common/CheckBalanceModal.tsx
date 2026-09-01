import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, ShieldCheck, Asterisk } from 'lucide-react';
import { haptics } from '../../utils/haptics';

interface CheckBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  bankName?: string;
  accountNumber?: string;
}

export const CheckBalanceModal: React.FC<CheckBalanceModalProps> = ({ 
  isOpen, 
  onClose,
  bankName = 'HDFC Bank',
  accountNumber = '•••• 4321'
}) => {
  const [pin, setPin] = useState('');
  const [phase, setPhase] = useState<'pin' | 'checking' | 'balance'>('pin');
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setPhase('pin');
      // Generate a random balance to make it feel realistic
      setBalance(Math.floor(Math.random() * 50000) + 10000);
    }
  }, [isOpen]);

  const handlePinInput = (num: number) => {
    if (pin.length < 4) {
      haptics.light();
      setPin(prev => prev + num);
      if (pin.length === 3) {
        // Auto submit when 4 digits entered
        setTimeout(() => {
          setPhase('checking');
          haptics.medium();
          setTimeout(() => {
            setPhase('balance');
            haptics.success();
          }, 1500);
        }, 300);
      }
    }
  };

  const handleBackspace = () => {
    if (pin.length > 0) {
      haptics.light();
      setPin(prev => prev.slice(0, -1));
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-end sm:justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full max-w-md bg-white rounded-t-[32px] sm:rounded-[32px] overflow-hidden flex flex-col shadow-2xl relative"
        >
          {/* Header */}
          <div className="bg-sentinel-900 p-5 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm">{bankName}</h3>
                <p className="text-white/60 text-xs">Account {accountNumber}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 bg-white/10 rounded-full active:scale-95">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 flex flex-col items-center">
            {phase === 'pin' && (
              <>
                <h2 className="text-xl font-bold text-ink-primary mb-2">Enter 4-Digit UPI PIN</h2>
                <p className="text-sm text-ink-secondary mb-8 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-sentinel-success" /> Secured by Sentinel
                </p>

                {/* PIN Display */}
                <div className="flex gap-4 mb-8">
                  {[...Array(4)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-colors ${
                        pin.length > i ? 'border-sentinel-accent bg-sentinel-50' : 'border-gray-200 bg-white'
                      }`}
                    >
                      {pin.length > i && <Asterisk className="w-6 h-6 text-sentinel-accent" />}
                    </div>
                  ))}
                </div>

                {/* Keypad */}
                <div className="grid grid-cols-3 gap-x-6 gap-y-4 w-full px-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <button
                      key={num}
                      onClick={() => handlePinInput(num)}
                      className="h-14 rounded-full bg-gray-50 flex items-center justify-center text-xl font-bold text-ink-primary active:bg-gray-200 active:scale-95 transition-all"
                    >
                      {num}
                    </button>
                  ))}
                  <div />
                  <button
                    onClick={() => handlePinInput(0)}
                    className="h-14 rounded-full bg-gray-50 flex items-center justify-center text-xl font-bold text-ink-primary active:bg-gray-200 active:scale-95 transition-all"
                  >
                    0
                  </button>
                  <button
                    onClick={handleBackspace}
                    className="h-14 rounded-full bg-gray-50 flex items-center justify-center active:bg-gray-200 active:scale-95 transition-all"
                  >
                    <X className="w-6 h-6 text-ink-secondary" />
                  </button>
                </div>
              </>
            )}

            {phase === 'checking' && (
              <div className="py-16 flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-sentinel-100 border-t-sentinel-accent rounded-full animate-spin mb-4" />
                <p className="font-bold text-ink-primary">Fetching balance securely...</p>
              </div>
            )}

            {phase === 'balance' && (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="py-8 flex flex-col items-center justify-center w-full"
              >
                <p className="text-sm font-semibold text-ink-secondary uppercase tracking-wider mb-2">Available Balance</p>
                <h1 className="text-4xl font-black text-ink-primary mb-8 tracking-tight">
                  ₹{balance.toLocaleString('en-IN')}
                </h1>
                <button
                  onClick={onClose}
                  className="w-full py-3.5 bg-sentinel-900 text-white font-bold rounded-2xl active:scale-95 transition-transform"
                >
                  Done
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
