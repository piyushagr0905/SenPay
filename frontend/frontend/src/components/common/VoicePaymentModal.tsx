import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, X, Sparkles } from 'lucide-react';
import { haptics } from '../../utils/haptics';

interface VoicePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onParseComplete: (amount: number, purpose: string) => void;
}

export const VoicePaymentModal: React.FC<VoicePaymentModalProps> = ({ 
  isOpen, 
  onClose,
  onParseComplete 
}) => {
  const [phase, setPhase] = useState<'listening' | 'processing' | 'done'>('listening');
  const [transcript, setTranscript] = useState('');
  
  useEffect(() => {
    if (isOpen) {
      setPhase('listening');
      setTranscript('');
      haptics.medium();
      
      // Simulate listening typing effect
      const text = "Send 8500 rupees for job registration";
      let currentIndex = 0;
      const typeInterval = setInterval(() => {
        if (currentIndex <= text.length) {
          setTranscript(text.substring(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typeInterval);
          setPhase('processing');
          haptics.light();
          
          setTimeout(() => {
            setPhase('done');
            haptics.success();
            setTimeout(() => {
              onParseComplete(8500, "Job registration");
            }, 1000);
          }, 1500);
        }
      }, 50);
      
      return () => {
        clearInterval(typeInterval);
      };
    }
  }, [isOpen, onParseComplete]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 pb-0">
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
          initial={{ opacity: 0, y: 300 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 300 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-sm bg-sentinel-900 rounded-t-[32px] sm:rounded-[32px] p-8 shadow-2xl flex flex-col items-center overflow-hidden"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/50 hover:text-white bg-white/10 rounded-full active:scale-95 transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-white/80 font-medium text-sm mb-8 mt-2">
            <Sparkles className="w-4 h-4 text-sentinel-accent" />
            Sentinel AI Voice
          </div>

          <div className="h-20 flex items-center justify-center w-full px-4 mb-8">
            <p className="text-white text-2xl font-semibold text-center leading-tight">
              {transcript || <span className="text-white/30">Listening...</span>}
            </p>
          </div>

          <div className="relative w-32 h-32 flex items-center justify-center mb-6">
            {phase === 'listening' && (
              <>
                <motion.div
                  animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  className="absolute inset-0 bg-sentinel-accent rounded-full blur-xl"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.8, 0.3, 0.8] }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: 0.2, ease: "easeInOut" }}
                  className="absolute inset-[-10%] bg-sentinel-accent/50 rounded-full blur-md"
                />
              </>
            )}
            
            {phase === 'processing' && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="absolute inset-[-20%] rounded-full border-2 border-dashed border-sentinel-accent opacity-50"
              />
            )}

            <div className={`relative w-20 h-20 rounded-full flex items-center justify-center text-white shadow-lg transition-colors duration-500 ${phase === 'done' ? 'bg-sentinel-success' : 'bg-sentinel-900 border-2 border-sentinel-accent'}`}>
              <Mic className={`w-8 h-8 ${phase === 'done' ? 'hidden' : 'block'}`} />
              <Sparkles className={`w-8 h-8 ${phase === 'done' ? 'block' : 'hidden'}`} />
            </div>
          </div>
          
          <div className="w-16 h-1 bg-white/20 rounded-full mt-2 mb-2" />
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
