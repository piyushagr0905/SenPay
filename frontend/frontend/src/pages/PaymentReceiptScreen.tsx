import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, ShieldCheck, Share, Download } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Recipient } from '../types';
import { formatCurrency } from '../utils/formatters';
import { haptics } from '../utils/haptics';

interface PaymentReceiptScreenProps {
  recipient: Recipient;
  amount: number;
  purpose?: string;
  transactionRef?: string;
  onDone: () => void;
  onShare: () => void;
  onSave: () => void;
}

export const PaymentReceiptScreen: React.FC<PaymentReceiptScreenProps> = ({
  recipient,
  amount,
  purpose = 'Payment',
  transactionRef = 'SENT-202409-982138',
  onDone,
  onShare,
  onSave,
}) => {
  useEffect(() => {
    haptics.success();
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.4 },
        colors: ['#0A84FF', '#30D158', '#4d80c3'],
        disableForReducedMotion: true,
      });
    } catch {
      // Graceful fallback
    }
  }, []);

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const timeStr = now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleShare = async () => {
    haptics.light();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Payment Receipt',
          text: `Payment of ₹${amount} to ${recipient.name} was successful.`,
        });
      } catch (err) {
        onShare(); // Fallback if user cancels or share fails
      }
    } else {
      onShare();
    }
  };

  const handleSave = () => {
    haptics.light();
    onSave();
  };

  return (
    <div className="min-h-screen bg-surface-bg flex flex-col font-apple pb-12">
      <main className="flex-1 px-5 pt-12 flex flex-col items-center max-w-md w-full mx-auto">
        
        {/* Animated Check */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.1 }}
          className="w-20 h-20 rounded-full bg-sentinel-success text-white flex items-center justify-center shadow-lg mb-6 relative"
        >
          <div className="absolute inset-0 rounded-full border-4 border-green-200 animate-ping opacity-20" />
          <Check className="w-10 h-10 stroke-[3]" />
        </motion.div>

        <h1 className="text-2xl font-bold text-ink-primary tracking-tight mb-8">
          Payment successful
        </h1>

        {/* Main Receipt Card */}
        <div className="w-full bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <p className="text-[40px] font-bold text-ink-primary tracking-tighter leading-none mb-4">
            {formatCurrency(amount)}
          </p>
          
          <div className="w-12 h-12 rounded-full bg-surface-subtle flex items-center justify-center font-bold text-ink-primary border border-gray-100 text-lg mb-2">
            {recipient.initials}
          </div>
          <p className="font-bold text-[17px] text-ink-primary">{recipient.name}</p>
          <p className="text-[14px] text-ink-secondary mb-4">{recipient.upiId}</p>
          
          <div className="flex items-center gap-1.5 text-sentinel-success text-[14px] font-bold bg-green-50 px-3 py-1.5 rounded-full border border-green-100 mb-6">
            <Check className="w-4 h-4" /> Payment completed
          </div>

          <div className="w-full h-px bg-gray-100 mb-4" />

          {/* Details */}
          <div className="w-full space-y-3 text-[14px]">
            <div className="flex justify-between">
              <span className="text-ink-secondary">Date & Time</span>
              <span className="font-medium text-ink-primary">{dateStr}, {timeStr}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-secondary">Payment ID</span>
              <span className="font-medium text-ink-primary">{transactionRef}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-secondary">Purpose</span>
              <span className="font-medium text-ink-primary">{purpose}</span>
            </div>
          </div>
        </div>

        {/* SENTINEL Safety Check Summary */}
        <div className="w-full mt-6 bg-sentinel-50 rounded-2xl p-5 border border-sentinel-100">
          <h2 className="font-bold text-[15px] text-ink-primary flex items-center gap-2 mb-3">
            <ShieldCheck className="w-5 h-5 text-sentinel-shield" /> SENTINEL Safety Check
          </h2>
          <ul className="space-y-2 text-[14px] text-ink-secondary">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-sentinel-success" /> Recipient verified
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-sentinel-success" /> Payment pattern normal
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-sentinel-success" /> No significant risk signals
            </li>
          </ul>
        </div>

        {/* Buttons */}
        <div className="w-full flex gap-3 mt-8">
          <button 
            onClick={handleShare}
            className="flex-1 py-3.5 rounded-2xl bg-white border border-gray-200 text-ink-primary font-bold text-[15px] flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-sm"
          >
            <Share className="w-4 h-4" /> Share
          </button>
          <button 
            onClick={handleSave}
            className="flex-1 py-3.5 rounded-2xl bg-white border border-gray-200 text-ink-primary font-bold text-[15px] flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-sm"
          >
            <Download className="w-4 h-4" /> Save
          </button>
        </div>
        
        <button
          onClick={() => { haptics.light(); onDone(); }}
          className="w-full mt-3 py-4 rounded-2xl bg-sentinel-900 text-white font-bold text-[16px] active:scale-95 transition-transform shadow-md"
        >
          Done
        </button>

      </main>
    </div>
  );
};
