import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Check } from 'lucide-react';
import { Recipient, RiskAssessment } from '../types';
import { formatCurrency } from '../utils/formatters';

interface SentinelCheckScreenProps {
  recipient: Recipient;
  amount: number;
  purpose: string;
  riskAssessment: RiskAssessment;
  onCheckComplete: (riskAssessment: RiskAssessment) => void;
}

export const SentinelCheckScreen: React.FC<SentinelCheckScreenProps> = ({
  recipient,
  amount,
  purpose,
  riskAssessment,
  onCheckComplete,
}) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 600);
    const t2 = setTimeout(() => setStage(2), 1200);
    const t3 = setTimeout(() => setStage(3), 1800);
    const tFinal = setTimeout(() => {
      onCheckComplete(riskAssessment);
    }, 2400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(tFinal);
    };
  }, [riskAssessment, onCheckComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-white flex flex-col items-center justify-center font-apple relative"
    >
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-sentinel-100/50 rounded-full blur-3xl" />
      
      <div className="z-10 flex flex-col items-center text-center px-6">
        <motion.div 
          animate={{ scale: [1, 1.05, 1] }} 
          transition={{ duration: 2, repeat: Infinity }}
          className="w-20 h-20 rounded-full bg-sentinel-50 flex items-center justify-center mb-8 border border-sentinel-100 shadow-sm"
        >
          <ShieldCheck className="w-10 h-10 text-sentinel-shield" />
        </motion.div>

        <h2 className="text-2xl font-bold text-ink-primary tracking-tight mb-2">
          Safety Check
        </h2>
        <p className="text-[15px] text-ink-secondary mb-12">
          SENTINEL is securing your payment.
        </p>

        <div className="w-full max-w-[280px] space-y-5 text-left">
          <div className="flex items-center justify-between">
            <span className={`text-[15px] font-medium transition-colors ${stage >= 0 ? 'text-ink-primary' : 'text-ink-faint'}`}>Verifying recipient</span>
            {stage >= 1 ? <Check className="w-5 h-5 text-sentinel-success" /> : <div className="w-5 h-5 rounded-full border-2 border-gray-200 border-t-sentinel-shield animate-spin" />}
          </div>
          <div className="flex items-center justify-between">
            <span className={`text-[15px] font-medium transition-colors ${stage >= 1 ? 'text-ink-primary' : 'text-ink-faint'}`}>Checking payment pattern</span>
            {stage >= 2 ? <Check className="w-5 h-5 text-sentinel-success" /> : stage >= 1 ? <div className="w-5 h-5 rounded-full border-2 border-gray-200 border-t-sentinel-shield animate-spin" /> : <div className="w-5 h-5" />}
          </div>
          <div className="flex items-center justify-between">
            <span className={`text-[15px] font-medium transition-colors ${stage >= 2 ? 'text-ink-primary' : 'text-ink-faint'}`}>Analysing risk signals</span>
            {stage >= 3 ? <Check className="w-5 h-5 text-sentinel-success" /> : stage >= 2 ? <div className="w-5 h-5 rounded-full border-2 border-gray-200 border-t-sentinel-shield animate-spin" /> : <div className="w-5 h-5" />}
          </div>
        </div>

      </div>

      <div className="absolute bottom-12 left-0 right-0 px-6 flex justify-center">
        <div className="bg-surface-subtle px-4 py-3 rounded-2xl flex items-center justify-between w-full max-w-sm border border-gray-100">
          <div>
            <p className="text-[13px] font-bold text-ink-primary">{recipient.name}</p>
            <p className="text-[11px] text-ink-secondary">{recipient.upiId}</p>
          </div>
          <div className="text-right">
            <p className="text-[14px] font-bold text-ink-primary">{formatCurrency(amount)}</p>
            <p className="text-[11px] text-ink-secondary">{purpose}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
