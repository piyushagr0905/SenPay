import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Download, CheckCircle2 } from 'lucide-react';
import { haptics } from '../../utils/haptics';

interface StatementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StatementModal: React.FC<StatementModalProps> = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setStatus('idle');
    }
  }, [isOpen]);

  const handleAction = (type: 'email' | 'device') => {
    haptics.medium();
    setStatus('processing');
    
    setTimeout(() => {
      haptics.success();
      setStatus('success');
      setActionMessage(type === 'email' ? 'Statement sent to your registered email.' : 'Statement downloaded to your device successfully.');
      
      if (type === 'device') {
        const text = "SenPay Account Statement\n\nDate: Today\nAccount: HDFC Bank •••• 4321\nAvailable Balance: ₹68,300\n\nRecent Transactions:\n- Amazon: ₹1,150\n- Swiggy: ₹450\n- Uber: ₹250\n\nThank you for using SenPay!";
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'SenPay_Statement.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      
      setTimeout(() => {
        onClose();
      }, 2500);
    }, 1500);
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
          onClick={status === 'processing' ? undefined : onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-sm bg-white rounded-[32px] p-6 shadow-2xl overflow-hidden text-center flex flex-col items-center"
        >
          {status === 'idle' && (
            <>
              <div className="w-16 h-16 rounded-full bg-sentinel-50 flex items-center justify-center mb-4 border border-sentinel-100">
                <Download className="w-8 h-8 text-sentinel-accent" />
              </div>
              <h2 className="text-xl font-bold text-ink-primary mb-2">Download Statement</h2>
              <p className="text-sm text-ink-secondary mb-8">How would you like to receive your account statement for this month?</p>

              <div className="flex flex-col gap-3 w-full">
                <button
                  onClick={() => handleAction('email')}
                  className="w-full py-4 bg-sentinel-900 text-white font-bold rounded-2xl active:scale-95 transition-transform flex items-center justify-center gap-2 shadow-md"
                >
                  <Mail className="w-5 h-5 text-white/80" />
                  Send to Email
                </button>
                <button
                  onClick={() => handleAction('device')}
                  className="w-full py-4 bg-white text-ink-primary font-bold rounded-2xl active:scale-95 transition-transform flex items-center justify-center gap-2 border border-gray-200 shadow-sm"
                >
                  <Download className="w-5 h-5 text-ink-secondary" />
                  Save to Device
                </button>
              </div>
            </>
          )}

          {status === 'processing' && (
            <div className="py-12 flex flex-col items-center justify-center w-full">
              <div className="w-12 h-12 border-4 border-sentinel-100 border-t-sentinel-accent rounded-full animate-spin mb-4" />
              <p className="font-bold text-ink-primary">Processing request...</p>
            </div>
          )}

          {status === 'success' && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="py-8 flex flex-col items-center justify-center w-full"
            >
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-sentinel-success" />
              </div>
              <h3 className="font-bold text-ink-primary text-lg mb-2">Success!</h3>
              <p className="text-sm text-ink-secondary">{actionMessage}</p>
            </motion.div>
          )}

          {status !== 'processing' && (
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-ink-muted hover:text-ink-primary bg-gray-50 rounded-full active:scale-95 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
