import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Delete, CheckCircle2 } from 'lucide-react';
import { haptics } from '../../utils/haptics';

interface UpiPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  recipientName: string;
  onSuccess: () => void;
}

export const UpiPinModal: React.FC<UpiPinModalProps> = ({
  isOpen,
  onClose,
  amount,
  recipientName,
  onSuccess,
}) => {
  const [pin, setPin] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setIsProcessing(false);
      setIsSuccess(false);
    }
  }, [isOpen]);

  const handleKeyPress = (num: number) => {
    if (pin.length < 4 && !isProcessing && !isSuccess) {
      haptics.light();
      setPin(prev => prev + num);
    }
  };

  const handleDelete = () => {
    if (pin.length > 0 && !isProcessing && !isSuccess) {
      haptics.light();
      setPin(prev => prev.slice(0, -1));
    }
  };

  const handleSubmit = () => {
    if (pin.length === 4) {
      haptics.medium();
      setIsProcessing(true);
      
      setTimeout(() => {
        setIsProcessing(false);
        setIsSuccess(true);
        haptics.success();
        
        setTimeout(() => {
          onSuccess();
        }, 1200);
      }, 1500);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-sm bg-white rounded-[32px] overflow-hidden shadow-2xl flex flex-col font-apple"
        >
          {/* Header */}
          <div className="bg-sentinel-900 text-white p-6 pb-8 text-center relative">
            <button 
              onClick={onClose}
              disabled={isProcessing || isSuccess}
              className="absolute top-4 right-4 p-2 text-white/70 hover:text-white rounded-full active:scale-95 transition-all disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="font-bold text-lg mb-1">Enter UPI PIN</h2>
            <p className="text-white/80 text-sm">To: <span className="font-bold text-white">{recipientName}</span></p>
            <div className="text-3xl font-black mt-2">₹{amount.toLocaleString('en-IN')}</div>
          </div>

          <div className="flex-1 bg-white p-8 flex flex-col items-center">
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center py-8">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring' }}
                  className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4"
                >
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </motion.div>
                <p className="font-bold text-ink-primary">PIN Verified</p>
              </div>
            ) : isProcessing ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-sentinel-accent border-t-transparent rounded-full animate-spin mb-4" />
                <p className="font-bold text-ink-primary">Verifying PIN...</p>
              </div>
            ) : (
              <>
                <div className="flex gap-4 mb-10">
                  {[...Array(4)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-4 h-4 rounded-full border-2 transition-all ${
                        pin.length > i ? 'bg-sentinel-900 border-sentinel-900' : 'border-gray-300'
                      }`}
                    />
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-x-8 gap-y-6 w-full max-w-[240px]">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                    <button
                      key={num}
                      onClick={() => handleKeyPress(num)}
                      className="w-16 h-16 rounded-full text-2xl font-bold text-ink-primary active:bg-gray-100 transition-colors flex items-center justify-center"
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    onClick={handleDelete}
                    className="w-16 h-16 rounded-full text-ink-secondary active:bg-gray-100 transition-colors flex items-center justify-center"
                  >
                    <Delete className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => handleKeyPress(0)}
                    className="w-16 h-16 rounded-full text-2xl font-bold text-ink-primary active:bg-gray-100 transition-colors flex items-center justify-center"
                  >
                    0
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={pin.length < 4}
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                      pin.length === 4 
                        ? 'bg-sentinel-accent text-white active:scale-95 shadow-md' 
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    <CheckCircle2 className="w-7 h-7" />
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
