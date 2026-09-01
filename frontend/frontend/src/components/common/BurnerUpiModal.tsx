import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldAlert, Key, Copy, Check, Fingerprint } from 'lucide-react';
import { haptics } from '../../utils/haptics';

interface BurnerUpiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BurnerUpiModal: React.FC<BurnerUpiModalProps> = ({ isOpen, onClose }) => {
  const [phase, setPhase] = useState<'idle' | 'generating' | 'done'>('idle');
  const [burnerId, setBurnerId] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPhase('idle');
      setBurnerId('');
      setCopied(false);
    }
  }, [isOpen]);

  const generateBurner = () => {
    setPhase('generating');
    haptics.medium();

    const timer = setTimeout(() => {
      setBurnerId(`temp-${Math.floor(Math.random() * 90000) + 10000}@sentinel`);
      setPhase('done');
      haptics.success();
    }, 2000);

    return () => clearTimeout(timer);
  };

  const handleCopy = () => {
    if (burnerId) {
      navigator.clipboard.writeText(burnerId);
      setCopied(true);
      haptics.light();
      setTimeout(() => setCopied(false), 2000);
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
          className="absolute inset-0 bg-black/70 backdrop-blur-md"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-sm bg-sentinel-900 rounded-[32px] p-6 shadow-2xl overflow-hidden border border-sentinel-800"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/50 hover:text-white bg-white/10 rounded-full active:scale-95 transition-all z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center mt-4">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-4 border border-white/20">
              <ShieldAlert className="w-8 h-8 text-sentinel-accent" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Burner UPI ID</h2>
            <p className="text-sm text-white/60 text-center mb-8 px-4">
              Generate a temporary, untraceable UPI ID that expires in 24 hours. Protect your real identity from unknown merchants.
            </p>

            {phase === 'idle' && (
              <button
                onClick={generateBurner}
                className="w-full py-4 bg-sentinel-accent hover:bg-sentinel-accent/90 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
              >
                <Key className="w-5 h-5" /> Generate Burner ID
              </button>
            )}

            {phase === 'generating' && (
              <div className="w-full h-16 border-2 border-dashed border-white/20 rounded-2xl flex items-center justify-center relative overflow-hidden bg-white/5">
                <motion.div
                  animate={{ left: ['-100%', '100%'] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                  className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-sentinel-accent/30 to-transparent"
                />
                <div className="flex items-center gap-2 text-sentinel-accent font-mono font-bold tracking-widest z-10">
                  <Fingerprint className="w-5 h-5 animate-pulse" /> Encrypting...
                </div>
              </div>
            )}

            {phase === 'done' && (
              <div className="w-full">
                <div className="bg-black/40 rounded-2xl p-4 flex flex-col items-center justify-center border border-sentinel-accent/30 mb-4 relative overflow-hidden">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-sentinel-accent/10"
                  />
                  <span className="text-xs text-sentinel-accent font-bold uppercase tracking-wider mb-2 relative z-10">Your temporary ID</span>
                  <span className="text-xl text-white font-mono font-bold relative z-10 tracking-tight">{burnerId}</span>
                </div>
                
                <button
                  onClick={handleCopy}
                  className="w-full py-3.5 bg-white text-sentinel-900 font-bold rounded-2xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-sm"
                >
                  {copied ? (
                    <>
                      <Check className="w-5 h-5 text-sentinel-success" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" /> Copy ID
                    </>
                  )}
                </button>
                <p className="text-[11px] text-white/40 text-center mt-3 flex items-center justify-center gap-1">
                  Expires in <span className="text-white/80 font-mono font-bold">23:59:59</span>
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
