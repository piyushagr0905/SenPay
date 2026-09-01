import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, CheckCircle2, X } from 'lucide-react';
import { haptics } from '../../utils/haptics';

interface TapToPayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TapToPayModal: React.FC<TapToPayModalProps> = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState<'ready' | 'processing' | 'success'>('ready');

  useEffect(() => {
    if (isOpen) {
      setStatus('ready');
      haptics.medium();
      
      // Simulate reading after 3 seconds for the demo
      const timer = setTimeout(() => {
        setStatus('processing');
        haptics.light();
        
        setTimeout(() => {
          setStatus('success');
          haptics.success();
          
          setTimeout(() => {
            onClose();
          }, 2000);
        }, 1500);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

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
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-sm bg-white rounded-[32px] p-8 shadow-2xl flex flex-col items-center text-center overflow-hidden"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-ink-muted hover:text-ink-primary bg-gray-50 rounded-full active:scale-95 transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-xl font-bold text-ink-primary mt-2">Tap to Pay</h2>
          <p className="text-sm text-ink-secondary mt-2 mb-10">
            {status === 'ready' && 'Hold phone near the reader'}
            {status === 'processing' && 'Processing payment...'}
            {status === 'success' && 'Payment successful!'}
          </p>

          <div className="relative w-48 h-48 flex items-center justify-center mb-8">
            {status === 'ready' && (
              <>
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className="absolute inset-0 bg-sentinel-accent rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0, 0.2] }}
                  transition={{ repeat: Infinity, duration: 2, delay: 0.5, ease: "easeInOut" }}
                  className="absolute inset-[-20%] bg-sentinel-accent rounded-full"
                />
                <div className="relative w-24 h-24 bg-sentinel-900 rounded-full flex items-center justify-center text-white shadow-lg">
                  <Wifi className="w-10 h-10 transform rotate-90" />
                </div>
              </>
            )}

            {status === 'processing' && (
              <div className="relative w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center shadow-inner">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="w-10 h-10 border-4 border-sentinel-accent border-t-transparent rounded-full"
                />
              </div>
            )}

            {status === 'success' && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                className="relative w-24 h-24 bg-sentinel-success rounded-full flex items-center justify-center text-white shadow-lg"
              >
                <CheckCircle2 className="w-12 h-12" />
              </motion.div>
            )}
          </div>
          
          <div className="w-16 h-1 bg-gray-200 rounded-full mt-4" />
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
