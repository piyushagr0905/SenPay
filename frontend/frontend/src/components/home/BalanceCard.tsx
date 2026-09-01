import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ShieldCheck, ArrowUpRight, TrendingUp, Edit2 } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { formatCurrency } from '../../utils/formatters';
import { updateUserProfile } from '../../utils/api';

interface BalanceCardProps {
 balance: number;
 onPayClick: () => void;
 onScanClick: () => void;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
 balance: initialBalance,
 onPayClick,
 onScanClick,
}) => {
 const [showBalance, setShowBalance] = useState(true);
 const [isEditing, setIsEditing] = useState(false);
 const [editValue, setEditValue] = useState(initialBalance.toString());
 const [currentBalance, setCurrentBalance] = useState(initialBalance);

 React.useEffect(() => {
   setCurrentBalance(initialBalance);
   setEditValue(initialBalance.toString());
 }, [initialBalance]);

 const handleSave = async () => {
   const newBalance = parseFloat(editValue);
   if (!isNaN(newBalance)) {
     setCurrentBalance(newBalance);
     try {
       await updateUserProfile({ balance: newBalance });
     } catch (e) {
       console.error("Failed to update balance:", e);
     }
   }
   setIsEditing(false);
 };

 const handleKeyDown = (e: React.KeyboardEvent) => {
   if (e.key === 'Enter') handleSave();
   if (e.key === 'Escape') {
     setIsEditing(false);
     setEditValue(currentBalance.toString());
   }
 };

 return (
 <GlassCard className="p-5" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.72) 0%, rgba(219,234,254,0.50) 100%)', borderColor: 'rgba(255,255,255,0.88)', boxShadow: '0 8px 32px rgba(15,23,42,0.10), inset 0 1px 0 rgba(255,255,255,0.95)' }}>
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <span className="text-xs text-ink-muted uppercase tracking-wider font-medium">
 Available Balance
 </span>
 <button
 onClick={() => setShowBalance(!showBalance)}
 className="text-ink-muted hover:text-ink-primary transition-colors p-0.5"
 title={showBalance ? 'Hide balance' : 'Show balance'}
 >
 {showBalance ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
 </button>
 </div>

 <div className="flex items-center gap-1 text-[11px] text-emerald-600 bg-emerald-50/70 backdrop-blur-sm border border-emerald-200/70 px-2 py-0.5 rounded-full shadow-sm">
 <ShieldCheck className="w-3 h-3 stroke-[2.5]" />
 <span>100% Protected</span>
 </div>
 </div>

 <div className="mt-2.5 flex items-baseline justify-between group">
  {isEditing ? (
    <input 
      autoFocus
      type="number"
      value={editValue}
      onChange={e => setEditValue(e.target.value)}
      onBlur={handleSave}
      onKeyDown={handleKeyDown}
      className="text-3xl sm:text-4xl text-ink-primary tracking-tight font-apple bg-transparent border-b-2 border-indigo-400 focus:outline-none w-48"
    />
  ) : (
    <motion.div
      key={showBalance ? 'shown' : 'hidden'}
      initial={{ opacity: 0, y: 3 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-3xl sm:text-4xl text-ink-primary tracking-tight font-apple flex items-center gap-2 cursor-pointer"
      onClick={() => { if(showBalance) setIsEditing(true); }}
    >
      {showBalance ? formatCurrency(currentBalance) : '••••••••'}
      {showBalance && <Edit2 className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />}
    </motion.div>
  )}
 </div>

 <div className="mt-4 pt-3.5 border-t border-gray-100/90 flex items-center justify-between text-xs">
 <div className="flex items-center gap-1.5 text-ink-secondary">
 <span className="w-1.5 h-1.5 rounded-full bg-sentinel-accent" />
 <span>Linked: <strong className="text-ink-primary">HDFC Bank ••4819</strong></span>
 </div>

 <div className="flex items-center gap-2">
 <button
 onClick={onScanClick}
 className="font-semibold px-2.5 py-1 text-xs text-sentinel-700 bg-white/60 backdrop-blur-[12px] hover:bg-white/85 border border-white/80 rounded-lg transition-all shadow-sm flex items-center gap-1"
 >
 Scan QR
 </button>
 <button
 onClick={onPayClick}
 className="font-semibold px-3 py-1 text-xs text-white bg-sentinel-900/90 backdrop-blur-[12px] hover:bg-black/85 border border-white/10 rounded-lg transition-all shadow-[0_4px_12px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)] flex items-center gap-1"
 >
 <span>Pay</span>
 <ArrowUpRight className="w-3 h-3" />
 </button>
 </div>
 </div>
 </GlassCard>
 );
};
