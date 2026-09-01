import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ScanLine, Send, ArrowDownLeft, ShieldCheck, ChevronRight, Wifi, Mic, Sparkles, Building2, Smartphone, Gift, Building, Download, Repeat, Coins, CreditCard, Vault, TrendingDown
} from 'lucide-react';
import { Header } from '../components/layout/Header';
import { UserProfile, PaymentTransaction, NavigationTab } from '../types';

interface HomeScreenProps {
  user: UserProfile;
  recentPayments: PaymentTransaction[];
  onNavigate: (tab: NavigationTab) => void;
  onPayQuick: () => void;
  onScanClick: () => void;
  onSelectTransaction: (tx: PaymentTransaction) => void;
  onOpenProfile: () => void;
  onOpenSafeCheck: () => void;
  onOpenProtect: () => void;
  onOpenBusiness: () => void;
  onOpenAskSentinel: () => void;
  onRequestClick: () => void;
  onViewActivityClick: () => void;
  onTapToPayClick: () => void;
  onVoicePaymentClick: () => void;
  onSplitBillClick: () => void;
  onBillsClick: () => void;
  onRewardsClick: () => void;
  onCheckBalanceClick: () => void;
  onSelfTransferClick: () => void;
  onDownloadStatementClick: () => void;
  onAutoPayClick: () => void;
  onDigitalGoldClick: () => void;
  onVaultsClick: () => void;
  onAiRoundUpsClick: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  user,
  recentPayments,
  onNavigate,
  onPayQuick,
  onScanClick,
  onSelectTransaction,
  onOpenProfile,
  onOpenSafeCheck,
  onOpenProtect,
  onOpenAskSentinel,
  onRequestClick,
  onViewActivityClick,
  onTapToPayClick,
  onVoicePaymentClick,
  onSplitBillClick,
  onBillsClick,
  onRewardsClick,
  onCheckBalanceClick,
  onSelfTransferClick,
  onDownloadStatementClick,
  onAutoPayClick,
  onDigitalGoldClick,
  onVaultsClick,
  onAiRoundUpsClick,
}) => {
  const [showNotification, setShowNotification] = useState(false);

  return (
    <div className="min-h-screen bg-surface-bg pb-24 font-apple flex flex-col">
      <Header
        user={user}
        onOpenProfile={onOpenProfile}
        onOpenNotifications={() => setShowNotification(true)}
      />

      <main className="flex-1 px-5 flex flex-col gap-6 mt-2">
        {/* Actions Section */}
        <section className="flex flex-col items-center mt-4">
          
          {/* Primary Actions */}
          <div className="grid grid-cols-4 gap-3 w-full max-w-sm">
            <button 
              onClick={onScanClick}
              className="col-span-2 bg-sentinel-900 text-white rounded-2xl py-3 flex flex-col items-center justify-center gap-1.5 active:scale-95 transition-transform shadow-md"
            >
              <ScanLine className="w-5 h-5" />
              <span className="text-[13px] font-semibold tracking-tight">Scan & Pay</span>
            </button>
            <button 
              onClick={onPayQuick}
              className="col-span-1 bg-white text-ink-primary rounded-2xl py-3 flex flex-col items-center justify-center gap-1.5 active:scale-95 transition-transform shadow-sm border border-gray-100"
            >
              <Send className="w-5 h-5 text-sentinel-accent" />
              <span className="text-[13px] font-semibold tracking-tight">Send</span>
            </button>
            <button 
              onClick={onTapToPayClick}
              className="col-span-1 bg-white text-ink-primary rounded-2xl py-3 flex flex-col items-center justify-center gap-1.5 active:scale-95 transition-transform shadow-sm border border-gray-100"
            >
              <Wifi className="w-5 h-5 transform rotate-90 text-sentinel-accent" />
              <span className="text-[13px] font-semibold tracking-tight">Tap</span>
            </button>
          </div>
        </section>

        {/* Quick Links (Google Pay Features) */}
        <section className="grid grid-cols-4 gap-2">
          <button onClick={onSelfTransferClick} className="flex flex-col items-center gap-2 active:scale-95 transition-transform">
            <div className="w-14 h-14 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center">
              <Building2 className="w-6 h-6 text-indigo-600" />
            </div>
            <span className="text-[11px] font-bold text-ink-primary text-center">Self<br/>Transfer</span>
          </button>
          <button onClick={onBillsClick} className="flex flex-col items-center gap-2 active:scale-95 transition-transform">
            <div className="w-14 h-14 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-blue-500" />
            </div>
            <span className="text-[11px] font-bold text-ink-primary text-center">Pay<br/>Bills</span>
          </button>
          <button onClick={onCheckBalanceClick} className="flex flex-col items-center gap-2 active:scale-95 transition-transform">
            <div className="w-14 h-14 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center">
              <Building className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-[11px] font-bold text-ink-primary text-center">Check<br/>Balance</span>
          </button>
          <button onClick={onRewardsClick} className="flex flex-col items-center gap-2 active:scale-95 transition-transform">
            <div className="w-14 h-14 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center">
              <Gift className="w-6 h-6 text-yellow-500" />
            </div>
            <span className="text-[11px] font-bold text-ink-primary text-center">Rewards<br/>Offers</span>
          </button>
          <button onClick={onAutoPayClick} className="flex flex-col items-center gap-2 active:scale-95 transition-transform">
            <div className="w-14 h-14 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center">
              <Repeat className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-[11px] font-bold text-ink-primary text-center">Auto-Pay</span>
          </button>
          <button onClick={onDigitalGoldClick} className="flex flex-col items-center gap-2 active:scale-95 transition-transform">
            <div className="w-14 h-14 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center">
              <Coins className="w-6 h-6 text-amber-500" />
            </div>
            <span className="text-[11px] font-bold text-ink-primary text-center">Buy<br/>Gold</span>
          </button>
          <button onClick={onVaultsClick} className="flex flex-col items-center gap-2 active:scale-95 transition-transform">
            <div className="w-14 h-14 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center">
              <Vault className="w-6 h-6 text-indigo-500" />
            </div>
            <span className="text-[11px] font-bold text-ink-primary text-center">Group<br/>Vaults</span>
          </button>
          <button onClick={onAiRoundUpsClick} className="flex flex-col items-center gap-2 active:scale-95 transition-transform">
            <div className="w-14 h-14 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-indigo-100 opacity-50" />
              <TrendingDown className="w-6 h-6 text-purple-600 relative z-10" />
            </div>
            <span className="text-[11px] font-bold text-ink-primary text-center">AI<br/>Round-Ups</span>
          </button>
        </section>

        {/* SenPay Credit Line BNPL Banner */}
        <section>
          <button 
            onClick={onPayQuick}
            className="w-full bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 rounded-[20px] p-4 flex items-center justify-between shadow-md active:scale-95 transition-transform relative overflow-hidden"
          >
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-purple-500 opacity-20 blur-2xl rounded-full" />
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20">
                <CreditCard className="w-5 h-5 text-purple-300" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-sm">SenPay Credit Line</h3>
                  <span className="text-[9px] font-bold bg-amber-400 text-amber-900 px-1.5 py-0.5 rounded-sm uppercase tracking-wider">Zero Interest</span>
                </div>
                <p className="text-[13px] text-purple-200 font-medium mt-0.5">₹50,000 Pre-approved. Buy Now, Pay Later.</p>
              </div>
            </div>
          </button>
        </section>

        {/* AI Features */}
        <section>
          <button 
            onClick={onSplitBillClick}
            className="w-full bg-sentinel-900 rounded-[20px] p-4 flex items-center justify-between shadow-sm active:scale-95 transition-transform"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-sentinel-accent" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-white text-sm">Smart Bill Split</h3>
                <p className="text-[13px] text-white/70 font-medium">Scan receipts with Sentinel AI</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <ChevronRight className="w-4 h-4 text-white" />
            </div>
          </button>
        </section>

        {/* Protection Status */}
        <section>
          <button 
            onClick={onOpenProtect}
            className="w-full bg-white rounded-[20px] p-4 flex items-center justify-between shadow-sm border border-gray-100 active:scale-95 transition-transform"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-sentinel-50 flex items-center justify-center border border-sentinel-100">
                <ShieldCheck className="w-5 h-5 text-sentinel-shield" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-ink-primary text-sm">You're protected</h3>
                <p className="text-[13px] text-ink-secondary font-medium">Sentinel is protecting your payments.</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-green-50 px-2 py-1 rounded-full border border-green-100">
              <span className="w-1.5 h-1.5 rounded-full bg-sentinel-success animate-pulse" />
              <span className="text-[10px] font-bold text-sentinel-success uppercase tracking-wider">Active</span>
            </div>
          </button>
        </section>

        {/* Recent Activity */}
        <section className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-bold text-ink-primary">Recent activity</h3>
            <button 
              onClick={onViewActivityClick}
              className="text-sm font-semibold text-sentinel-accent flex items-center"
            >
              View all <ChevronRight className="w-4 h-4 ml-0.5" />
            </button>
          </div>
          
          <div className="space-y-5">
            {recentPayments.map((tx) => (
              <div 
                key={tx.id} 
                onClick={() => onSelectTransaction(tx)}
                className="flex items-center justify-between cursor-pointer active:opacity-70 transition-opacity"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-surface-subtle flex items-center justify-center font-bold text-ink-primary border border-gray-100 text-lg">
                    {tx.recipient?.initials || tx.recipient?.name.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-[15px] text-ink-primary">{tx.recipient?.name}</span>
                    <span className="text-[13px] text-ink-secondary font-medium">Today</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-bold text-[15px] text-ink-primary">₹{tx.amount.toLocaleString('en-IN')}</span>
                  <span className={`text-[13px] font-semibold ${
                    tx.status === 'completed' || tx.status === 'flagged'
                      ? 'text-sentinel-success' 
                      : tx.status === 'blocked'
                      ? 'text-rose-500'
                      : 'text-amber-500'
                  }`}>
                    {tx.status === 'completed' || tx.status === 'flagged' ? 'Completed' : tx.status === 'blocked' ? 'Blocked' : 'Pending'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={onDownloadStatementClick}
            className="w-full mt-6 py-3.5 bg-gray-50 text-ink-primary font-bold rounded-xl border border-gray-200 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-sm hover:bg-gray-100"
          >
            <Download className="w-5 h-5 text-ink-secondary" />
            Download Statement
          </button>
        </section>
      </main>

      {/* Voice Payment FAB */}
      <button 
        onClick={onVoicePaymentClick}
        className="fixed bottom-24 right-5 w-14 h-14 bg-sentinel-900 text-white rounded-full flex items-center justify-center shadow-xl shadow-sentinel-900/30 active:scale-95 transition-transform z-40 border-2 border-sentinel-accent/30"
      >
        <Mic className="w-6 h-6" />
      </button>
    </div>
  );
};
