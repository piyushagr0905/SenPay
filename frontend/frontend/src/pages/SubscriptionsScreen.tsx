import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Repeat, Play, Pause, AlertCircle } from 'lucide-react';
import { haptics } from '../utils/haptics';

interface SubscriptionsScreenProps {
  onBack: () => void;
}

interface Subscription {
  id: string;
  name: string;
  amount: number;
  nextBilling: string;
  frequency: string;
  status: 'active' | 'paused';
  icon: string;
}

export const SubscriptionsScreen: React.FC<SubscriptionsScreenProps> = ({ onBack }) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    { id: '1', name: 'Netflix Premium', amount: 649, nextBilling: '12 Sep 2026', frequency: 'Monthly', status: 'active', icon: 'N' },
    { id: '2', name: 'Groww Mutual Fund SIP', amount: 5000, nextBilling: '15 Sep 2026', frequency: 'Monthly', status: 'active', icon: 'G' },
    { id: '3', name: 'Spotify Premium', amount: 119, nextBilling: '03 Oct 2026', frequency: 'Monthly', status: 'paused', icon: 'S' },
  ]);

  const toggleStatus = (id: string) => {
    haptics.medium();
    setSubscriptions(subs => subs.map(sub => {
      if (sub.id === id) {
        return { ...sub, status: sub.status === 'active' ? 'paused' : 'active' };
      }
      return sub;
    }));
  };

  return (
    <div className="flex flex-col h-full bg-surface-base font-apple relative overflow-hidden">
      <main className="flex-1 overflow-y-auto pb-24 px-5 pt-6 space-y-6 max-w-md mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-ink-primary active:scale-95 transition-transform">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-ink-primary">Auto-Pay</h1>
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <Repeat className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 text-center mb-6">
          <h2 className="text-sm font-bold text-ink-secondary mb-1 uppercase tracking-wider">Total Monthly Mandates</h2>
          <p className="text-4xl font-black text-ink-primary">₹5,768</p>
        </div>

        <div className="flex items-center gap-2 bg-amber-50 p-3 rounded-xl border border-amber-100 mb-6 text-amber-800 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>You can pause or revoke any auto-pay mandate instantly.</p>
        </div>

        <h3 className="font-bold text-ink-primary px-1 mb-2 text-lg">Active Mandates</h3>
        
        <div className="space-y-4">
          {subscriptions.map((sub) => (
            <motion.div 
              key={sub.id}
              layout
              className={`bg-white rounded-2xl p-4 shadow-sm border transition-colors ${sub.status === 'active' ? 'border-gray-100' : 'border-gray-200 opacity-60'}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl text-white ${sub.status === 'active' ? 'bg-ink-primary' : 'bg-gray-400'}`}>
                    {sub.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-ink-primary text-[15px]">{sub.name}</h4>
                    <p className="text-[13px] text-ink-secondary">{sub.frequency} • {sub.status === 'active' ? `Next: ${sub.nextBilling}` : 'Paused'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-ink-primary text-[15px]">₹{sub.amount}</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => toggleStatus(sub.id)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
                    sub.status === 'active' 
                      ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' 
                      : 'bg-sentinel-100 text-sentinel-700 hover:bg-sentinel-200'
                  }`}
                >
                  {sub.status === 'active' ? (
                    <><Pause className="w-4 h-4" /> Pause Auto-Pay</>
                  ) : (
                    <><Play className="w-4 h-4" /> Resume Auto-Pay</>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};
