import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, AlertTriangle, Crosshair, Activity, Clock, ArrowLeft, BarChart3, Database } from 'lucide-react';
import { fetchBusinessRiskFeed, fetchBusinessStats, fetchBusinessPatterns, fetchBusinessQueue, resolveBusinessQueue } from '../utils/api';
import { PaymentTransaction } from '../types';
import { haptics } from '../utils/haptics';

interface BusinessDashboardScreenProps {
  onBack: () => void;
  onViewCase: (caseId: string) => void;
}

export const BusinessDashboardScreen: React.FC<BusinessDashboardScreenProps> = ({ onBack, onViewCase }) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'queue' | 'patterns'>('feed');
  const [stats, setStats] = useState<any>(null);
  const [riskFeed, setRiskFeed] = useState<PaymentTransaction[]>([]);
  const [patterns, setPatterns] = useState<any[]>([]);
  const [queue, setQueue] = useState<PaymentTransaction[]>([]);
  const [isResolving, setIsResolving] = useState<string | null>(null);

  const handleResolve = async (txId: string, action: 'release' | 'block') => {
    try {
      haptics.medium();
      setIsResolving(txId);
      await resolveBusinessQueue(txId, action);
      setQueue((prev) => prev.filter(tx => tx.id !== txId));
      setRiskFeed((prev) => prev.map(tx => tx.id === txId ? { ...tx, status: action === 'release' ? 'completed' : 'blocked' } : tx));
    } catch (error) {
      console.error(`Failed to ${action} transaction`, error);
    } finally {
      setIsResolving(null);
    }
  };

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, feedData, queueData, patternsData] = await Promise.all([
          fetchBusinessStats(),
          fetchBusinessRiskFeed(),
          fetchBusinessQueue(),
          fetchBusinessPatterns(),
        ]);
        setStats(statsData);
        setRiskFeed(feedData);
        setQueue(queueData);
        setPatterns(patternsData);
      } catch (error) {
        console.error("Failed to load business data", error);
      }
    }
    loadData();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-[#0A0F1C] text-slate-300 font-apple max-w-md mx-auto relative overflow-hidden">
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-indigo-900/20 to-transparent pointer-events-none" />

      {/* Header */}
      <div className="px-5 pt-6 pb-4 border-b border-white/10 sticky top-0 bg-[#0A0F1C]/90 backdrop-blur-xl z-20">
        <div className="flex items-center gap-3">
          <button onClick={() => { haptics.light(); onBack(); }} className="p-2 -ml-2 rounded-full hover:bg-white/10 active:scale-95 transition-all text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              <h1 className="font-bold text-[17px] text-white tracking-tight">SENTINEL RISK</h1>
            </div>
            <p className="text-[10px] text-indigo-200/60 font-bold tracking-widest uppercase">Platform Intelligence</p>
          </div>
        </div>

        {/* Stats Row */}
        {stats && (
          <div className="grid grid-cols-3 gap-2 mt-5">
            <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">Scans Today</p>
              <p className="text-[18px] font-bold text-white">{(stats.totalScansToday || 0).toLocaleString()}</p>
            </div>
            <div className="bg-rose-500/10 border border-rose-500/20 p-3 rounded-2xl">
              <p className="text-[10px] text-rose-300/80 font-bold uppercase mb-0.5">Interventions</p>
              <p className="text-[18px] font-bold text-rose-400">{stats.interventionsToday || 0}</p>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-2xl">
              <p className="text-[10px] text-emerald-300/80 font-bold uppercase mb-0.5">Protected ₹</p>
              <p className="text-[18px] font-bold text-emerald-400">{((stats.amountSavedToday || 0) / 1000).toFixed(1)}k</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex items-center gap-2 mt-5 overflow-x-auto no-scrollbar">
          <button onClick={() => { haptics.light(); setActiveTab('feed'); }} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-bold transition-colors shrink-0 ${activeTab === 'feed' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-400'}`}>
            <Activity className="w-4 h-4" /> Risk Feed
          </button>
          <button onClick={() => { haptics.light(); setActiveTab('queue'); }} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-bold transition-colors shrink-0 ${activeTab === 'queue' ? 'bg-amber-600 text-white' : 'bg-white/5 text-slate-400'}`}>
            <Clock className="w-4 h-4" /> Review Queue <span className="ml-1 bg-white/20 px-1.5 py-0.5 rounded-full text-[10px]">{queue.length}</span>
          </button>
          <button onClick={() => { haptics.light(); setActiveTab('patterns'); }} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-bold transition-colors shrink-0 ${activeTab === 'patterns' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-400'}`}>
            <Crosshair className="w-4 h-4" /> Radars
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-5 flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          
          {/* Feed Tab */}
          {activeTab === 'feed' && (
            <motion.div key="feed" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">
              {riskFeed.map((tx) => (
                <div key={tx.id} className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${tx.riskAssessment?.level === 'critical' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}`}>
                        {tx.riskAssessment?.level || 'unknown'} RISK
                      </span>
                      {tx.status === 'blocked' && <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-rose-600/90 text-white">BLOCKED</span>}
                      {tx.status === 'completed' && <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-600/90 text-white">RELEASED</span>}
                    </div>
                    <span className="text-slate-500 text-[11px] font-medium">{tx.timestamp ? new Date(tx.timestamp).toLocaleTimeString() : ''}</span>
                  </div>
                  <div>
                    <p className="text-[15px] font-bold text-white mb-0.5">₹{(tx.amount || 0).toLocaleString('en-IN')} to {tx.recipient?.name || 'Unknown'}</p>
                    <p className="text-[13px] text-slate-400">{(tx.riskAssessment?.reasons && tx.riskAssessment.reasons[0]?.description) || 'Unusual payment activity detected'}</p>
                  </div>
                  <button 
                    onClick={() => { haptics.light(); onViewCase(tx.id); }} 
                    className="mt-2 w-full py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-[13px] font-bold text-white transition-colors active:scale-95"
                  >
                    View Case File
                  </button>
                </div>
              ))}
            </motion.div>
          )}

          {/* Queue Tab */}
          {activeTab === 'queue' && (
            <motion.div key="queue" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 text-center">
                <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-3" />
                <h3 className="font-bold text-[16px] text-amber-400">{queue.length} Cases require manual review</h3>
                <p className="text-[13px] text-amber-200/70 mt-1">Transactions paused pending analyst approval.</p>
              </div>
              {queue.map((tx) => (
                <div key={tx.id} className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">Ref: {(tx.id || 'unknown').substring(0,8)}</span>
                    <span className="text-[10px] bg-amber-500/20 text-amber-400 font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">Pending</span>
                  </div>
                  <p className="text-[14px] text-white leading-relaxed mb-4">
                    User attempted <strong className="text-white">₹{(tx.amount || 0).toLocaleString('en-IN')}</strong> transfer to {tx.recipient?.name || 'Unknown'}. 
                    {(tx.riskAssessment?.reasons && tx.riskAssessment.reasons[0]?.description) || 'Flagged for manual review.'}
                  </p>
                  <div className="flex gap-3">
                    <button onClick={() => handleResolve(tx.id, 'release')} disabled={isResolving === tx.id} className="flex-1 bg-emerald-500/20 text-emerald-400 py-3 rounded-xl text-[13px] font-bold border border-emerald-500/30 hover:bg-emerald-500/30 active:scale-95 transition-all">
                      Release
                    </button>
                    <button onClick={() => handleResolve(tx.id, 'block')} disabled={isResolving === tx.id} className="flex-1 bg-rose-500/20 text-rose-400 py-3 rounded-xl text-[13px] font-bold border border-rose-500/30 hover:bg-rose-500/30 active:scale-95 transition-all">
                      Block
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Patterns Tab */}
          {activeTab === 'patterns' && (
            <motion.div key="patterns" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">
              <h3 className="text-[13px] font-bold text-slate-400 uppercase tracking-wider mb-4 ml-1">Emerging Threat Clusters</h3>
              {patterns.map((p) => (
                <div key={p.id} className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${p.severity === 'critical' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : p.severity === 'high' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>
                      <Database className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-[15px] font-bold text-white">{p.name}</h4>
                      <p className="text-[12px] text-slate-400">{p.occurrences} incidents detected</p>
                    </div>
                  </div>
                  <div className={`text-[14px] font-bold ${p.growth.startsWith('+') ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {p.growth}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};
