import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShieldAlert, ShieldCheck, Clock, XCircle, AlertTriangle } from 'lucide-react';
import { PaymentTransaction } from '../types';
import { formatCurrency } from '../utils/formatters';
import { haptics } from '../utils/haptics';

interface SafetyHistoryScreenProps {
  onBack: () => void;
  transactions: PaymentTransaction[];
}

export const SafetyHistoryScreen: React.FC<SafetyHistoryScreenProps> = ({
  onBack,
  transactions,
}) => {
  const [filter, setFilter] = useState<'all' | 'flagged' | 'blocked' | 'safe'>('all');

  const getStatusIcon = (status: string, riskLevel?: string) => {
    if (status === 'cancelled') return <XCircle className="w-5 h-5 text-rose-600" />;
    if (status === 'flagged' || riskLevel === 'high' || riskLevel === 'critical') return <ShieldAlert className="w-5 h-5 text-amber-600" />;
    if (status === 'completed' && (!riskLevel || riskLevel === 'low' || riskLevel === 'safe')) return <ShieldCheck className="w-5 h-5 text-emerald-600" />;
    return <Clock className="w-5 h-5 text-gray-400" />;
  };

  const filteredTransactions = transactions.filter(tx => {
    if (filter === 'all') return true;
    if (filter === 'blocked') return tx.status === 'cancelled';
    if (filter === 'flagged') return tx.status === 'flagged' || tx.riskAssessment?.level === 'high';
    if (filter === 'safe') return tx.status === 'completed' && (!tx.riskAssessment || tx.riskAssessment.level === 'low' || tx.riskAssessment.level === 'safe');
    return true;
  });

  return (
    <div className="min-h-screen bg-surface-bg flex flex-col font-apple pb-8">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 flex items-center bg-white sticky top-0 z-10 border-b border-gray-100">
        <button onClick={() => { haptics.light(); onBack(); }} className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:scale-95 transition-all">
          <ArrowLeft className="w-6 h-6 text-ink-primary" />
        </button>
        <h1 className="flex-1 text-center font-bold text-[17px] text-ink-primary pr-8">Safety History</h1>
      </div>

      <main className="flex-1 p-5 max-w-md w-full mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-ink-primary tracking-tight mb-1">Your Safety Record</h2>
          <p className="text-[14px] text-ink-secondary">SENTINEL decisions and blocked attempts.</p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
          {(['all', 'blocked', 'flagged', 'safe'] as const).map((f) => (
            <button
              key={f}
              onClick={() => { haptics.light(); setFilter(f); }}
              className={`px-4 py-2 rounded-full text-[13px] font-bold capitalize transition-all whitespace-nowrap active:scale-95 ${
                filter === f
                  ? 'bg-sentinel-900 text-white shadow-sm'
                  : 'bg-white text-ink-secondary border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredTransactions.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-8 text-center bg-white rounded-[20px] border border-gray-100 shadow-sm mt-4">
                <ShieldCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="font-bold text-[15px] text-ink-primary">No records found</p>
                <p className="text-[13px] text-ink-secondary mt-1">No transactions match this filter.</p>
              </motion.div>
            ) : (
              filteredTransactions.map((tx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={tx.id} 
                  className="p-4 bg-white rounded-[20px] border border-gray-100 shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-surface-bg flex items-center justify-center border border-gray-100 shrink-0">
                        {getStatusIcon(tx.status, tx.riskAssessment?.level)}
                      </div>
                      <div className="pt-0.5">
                        <h4 className="font-bold text-[15px] text-ink-primary">{tx.recipient.name}</h4>
                        <p className="text-[12px] text-ink-secondary mt-0.5">{tx.formattedDate}</p>
                        <span className={`inline-block mt-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          tx.status === 'cancelled' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                          tx.status === 'flagged' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                          'bg-emerald-50 text-emerald-700 border-emerald-100'
                        }`}>
                          {tx.status === 'cancelled' ? 'BLOCKED' : tx.status === 'flagged' ? 'FLAGGED' : 'SAFE'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right pt-0.5">
                      <p className="font-bold text-[15px] text-ink-primary">
                        {formatCurrency(tx.amount)}
                      </p>
                      <p className="text-[11px] text-ink-muted truncate max-w-[80px] mt-0.5">
                        {tx.purposeCategory}
                      </p>
                    </div>
                  </div>
                  
                  {tx.riskAssessment && tx.riskAssessment.level !== 'low' && tx.riskAssessment.level !== 'safe' && (
                    <div className="pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-1.5 mb-2">
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                        <p className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
                          SENTINEL Findings
                        </p>
                      </div>
                      <ul className="space-y-1.5">
                        {tx.riskAssessment.reasons.map((r, idx) => (
                          <li key={idx} className="text-[12px] text-ink-secondary flex items-start gap-2 leading-relaxed">
                            <span className="text-amber-500 mt-1.5 w-1 h-1 rounded-full shrink-0"></span>
                            <span><strong className="text-ink-primary font-semibold">{r.title}:</strong> {r.description}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};
