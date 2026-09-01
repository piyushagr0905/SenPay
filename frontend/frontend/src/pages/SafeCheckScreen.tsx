import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  AtSign,
  Phone,
  QrCode,
  Link,
  MessageSquareWarning,
  Search,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  Loader2,
  ArrowLeft,
} from 'lucide-react';
import { SafeCheckType, SafeCheckResult } from '../types';
import { evaluateSafeCheck } from '../utils/riskEngine';
import { haptics } from '../utils/haptics';

interface SafeCheckScreenProps {
  onOpenMessageAnalyzer: () => void;
  onScanQR: () => void;
  onBack: () => void;
}

export const SafeCheckScreen: React.FC<SafeCheckScreenProps> = ({
  onOpenMessageAnalyzer,
  onScanQR,
  onBack,
}) => {
  const [activeType, setActiveType] = useState<SafeCheckType>('upi');
  const [query, setQuery] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<SafeCheckResult | null>(null);

  const handleCheck = () => {
    if (!query.trim()) return;
    haptics.medium();
    setIsChecking(true);
    setResult(null);

    setTimeout(() => {
      setIsChecking(false);
      setResult(evaluateSafeCheck(query, activeType));
      if (evaluateSafeCheck(query, activeType).riskLevel === 'high') {
        haptics.error();
      } else {
        haptics.success();
      }
    }, 1200);
  };

  const quickSamples: Record<SafeCheckType, string[]> = {
    upi: ['rahul@upi', 'swiggy.pay@hdfcbank'],
    phone: ['+91 91234 56789'],
    qr: ['BharatPe QR'],
    link: ['http://hdfc-kyc-verify.net'],
    message: [],
  };

  return (
    <div className="min-h-screen bg-surface-bg flex flex-col font-apple pb-32">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 flex items-center bg-white sticky top-0 z-10 border-b border-gray-100">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:scale-95 transition-all">
          <ArrowLeft className="w-6 h-6 text-ink-primary" />
        </button>
        <h1 className="flex-1 text-center font-bold text-[17px] text-ink-primary pr-8">SafeCheck</h1>
      </div>

      <main className="flex-1 p-5 flex flex-col max-w-md w-full mx-auto">
        
        {/* Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-ink-primary tracking-tight mb-1">Check before you pay.</h2>
          <p className="text-[15px] text-ink-secondary">Verify UPI IDs, links, or numbers instantly.</p>
        </div>

        {/* Message Analyzer Banner */}
        <button 
          onClick={onOpenMessageAnalyzer}
          className="w-full bg-sentinel-900 text-white p-4 rounded-2xl flex items-center justify-between shadow-md mb-6 active:scale-95 transition-transform"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <MessageSquareWarning className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-[15px]">Analyze a Message</h3>
              <p className="text-[13px] text-white/70">Check WhatsApp/SMS for scams</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-white/50" />
        </button>

        {/* Look up tool */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 mb-6">
          <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl mb-4">
            {[{ id: 'upi', label: 'UPI ID', icon: AtSign }, { id: 'phone', label: 'Phone', icon: Phone }, { id: 'link', label: 'Link', icon: Link }].map((t) => (
              <button
                key={t.id}
                onClick={() => { haptics.light(); setActiveType(t.id as SafeCheckType); setQuery(''); setResult(null); }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${activeType === t.id ? 'bg-white text-ink-primary shadow-sm' : 'text-ink-secondary'}`}
              >
                <t.icon className="w-4 h-4" /> {t.label}
              </button>
            ))}
          </div>

          <div className="relative mb-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Enter ${activeType.toUpperCase()}...`}
              className="w-full pl-4 pr-24 py-4 rounded-2xl bg-surface-subtle border border-transparent text-[15px] focus:outline-none focus:border-sentinel-accent focus:bg-white focus:ring-1 focus:ring-sentinel-accent transition-all"
            />
            <button
              onClick={handleCheck}
              disabled={isChecking || !query.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2.5 bg-sentinel-900 text-white font-bold text-[13px] rounded-xl active:scale-95 transition-transform disabled:opacity-50 flex items-center gap-1"
            >
              {isChecking ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Check'}
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {quickSamples[activeType].map((s) => (
              <button
                key={s}
                onClick={() => setQuery(s)}
                className="px-3 py-1.5 rounded-full bg-gray-100 text-ink-secondary text-[12px] font-medium whitespace-nowrap active:scale-95 transition-transform"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <div className={`rounded-3xl p-5 border ${
                result.riskLevel === 'high' ? 'bg-rose-50 border-rose-100' :
                result.riskLevel === 'medium' ? 'bg-amber-50 border-amber-100' :
                'bg-emerald-50 border-emerald-100'
              }`}>
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                    result.riskLevel === 'high' ? 'bg-rose-100 text-rose-600' :
                    result.riskLevel === 'medium' ? 'bg-amber-100 text-amber-600' :
                    'bg-emerald-100 text-emerald-600'
                  }`}>
                    {result.riskLevel === 'high' ? <ShieldAlert className="w-6 h-6" /> :
                     result.riskLevel === 'medium' ? <ShieldAlert className="w-6 h-6" /> :
                     <CheckCircle2 className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-[16px] text-ink-primary mb-1">{result.target}</h3>
                    <p className={`text-[14px] ${
                      result.riskLevel === 'high' ? 'text-rose-700' :
                      result.riskLevel === 'medium' ? 'text-amber-700' :
                      'text-emerald-700'
                    }`}>
                      {result.reputationSummary}
                    </p>
                  </div>
                </div>

                <div className="w-full h-px bg-black/5 mb-4" />

                <h4 className="text-[12px] font-bold text-ink-secondary uppercase tracking-wider mb-2">Signals Found</h4>
                <ul className="space-y-2">
                  {result.signalsFound.map((sig, i) => (
                    <li key={i} className="text-[14px] text-ink-primary flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-ink-muted shrink-0 mt-2" />
                      {sig}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
};
