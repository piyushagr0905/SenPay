import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, ArrowUpRight, ChevronRight } from 'lucide-react';
import { PaymentTransaction } from '../../types';
import { formatCurrency, formatTimeAgo } from '../../utils/formatters';
import { GlassCard } from '../common/GlassCard';

interface RecentTransactionsProps {
 transactions: PaymentTransaction[];
 onSelectTransaction: (tx: PaymentTransaction) => void;
 onViewAll?: () => void;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
 transactions,
 onSelectTransaction,
 onViewAll,
}) => {
 return (
 <div className="space-y-2.5">
 <div className="flex items-center justify-between px-1">
 <h3 className="font-bold text-xs text-ink-muted uppercase tracking-wider">
 Recent Payment Activity
 </h3>
 {onViewAll && (
 <button
 onClick={onViewAll}
 className="font-semibold text-xs text-sentinel-accent hover:text-blue-700 transition-colors"
 >
 See All
 </button>
 )}
 </div>

 <GlassCard className="p-2 divide-y divide-gray-100/80">
 {transactions.map((tx, index) => {
 const isFlagged = tx.status === 'flagged' || tx.status === 'under_review';
 return (
 <motion.div
 key={tx.id}
 initial={{ opacity: 0, y: 6 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: index * 0.05 }}
 onClick={() => onSelectTransaction(tx)}
 className="flex items-center justify-between p-2.5 hover:bg-black/[0.02] rounded-xl transition-colors cursor-pointer group"
 >
 <div className="flex items-center gap-3">
 <div className="relative">
 <div className="w-10 h-10 rounded-full bg-slate-100 border border-gray-200/80 flex items-center justify-center text-xs text-ink-primary group-hover:scale-105 transition-transform">
 {tx.recipient.initials}
 </div>
 <span
 className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white flex items-center justify-center ${
 isFlagged ? 'bg-amber-500' : 'bg-emerald-500'
 }`}
 >
 {isFlagged ? (
 <ShieldAlert className="w-2 h-2 text-white stroke-[2.5]" />
 ) : (
 <ShieldCheck className="w-2 h-2 text-white stroke-[2.5]" />
 )}
 </span>
 </div>

 <div>
 <div className="flex items-center gap-1.5">
 <p className="text-xs text-ink-primary tracking-tight group-hover:text-sentinel-900 transition-colors">
 {tx.recipient.name}
 </p>
 {isFlagged && (
 <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded-full">
 Flagged
 </span>
 )}
 </div>
 <p className="text-[11px] text-ink-secondary truncate max-w-[140px] sm:max-w-[200px]">
 {tx.purpose}
 </p>
 </div>
 </div>

 <div className="text-right">
 <p className="text-xs text-ink-primary font-apple tracking-tight">
 - {formatCurrency(tx.amount)}
 </p>
 <p className="text-[10px] text-ink-muted mt-0.5">
 {formatTimeAgo(tx.timestamp)}
 </p>
 </div>
 </motion.div>
 );
 })}
 </GlassCard>
 </div>
 );
};
