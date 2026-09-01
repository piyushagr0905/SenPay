import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Plus, Target, PiggyBank, Sparkles } from 'lucide-react';
import { haptics } from '../utils/haptics';

interface GroupVaultsScreenProps {
  onBack: () => void;
}

export const GroupVaultsScreen: React.FC<GroupVaultsScreenProps> = ({ onBack }) => {
  const [vaults] = useState([
    {
      id: '1',
      name: 'Goa Trip 2026',
      target: 50000,
      current: 32500,
      members: ['You', 'Rahul', 'Sneha', 'Kabir'],
      aiPrediction: 'On track to reach goal by Nov 15th'
    },
    {
      id: '2',
      name: 'Startup Fund',
      target: 200000,
      current: 45000,
      members: ['You', 'Vikram'],
      aiPrediction: 'Contribution rate dropped. Goal delayed by 2 months.'
    }
  ]);

  return (
    <div className="flex flex-col h-full bg-surface-base font-apple relative overflow-hidden">
      <main className="flex-1 overflow-y-auto pb-24 px-5 pt-6 space-y-6 max-w-md mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => { haptics.light(); onBack(); }} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-ink-primary active:scale-95 transition-transform">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-ink-primary">Group Vaults</h1>
          <button className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 active:scale-95 transition-transform">
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Hero */}
        <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-[24px] p-6 shadow-md text-white">
          <PiggyBank className="w-8 h-8 text-indigo-300 mb-3" />
          <h2 className="text-2xl font-black mb-1">Pool money together</h2>
          <p className="text-sm text-indigo-200 font-medium opacity-90">Save with friends and let Sentinel AI predict exactly when you'll reach your goal.</p>
        </div>

        <h3 className="font-bold text-ink-primary px-1 text-lg mt-2">Active Vaults</h3>

        <div className="space-y-4">
          {vaults.map((vault) => (
            <motion.div 
              key={vault.id}
              whileHover={{ scale: 1.01 }}
              className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center border border-indigo-100">
                    <Target className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-ink-primary text-lg">{vault.name}</h4>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {vault.members.map((m, i) => (
                        <span key={i} className="text-[10px] font-bold bg-gray-100 text-ink-secondary px-2 py-0.5 rounded-full">{m}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-2 flex justify-between text-sm font-bold">
                <span className="text-ink-primary">₹{vault.current.toLocaleString()}</span>
                <span className="text-ink-muted">Goal: ₹{vault.target.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden mb-4">
                <div 
                  className="bg-indigo-600 h-full rounded-full" 
                  style={{ width: `${(vault.current / vault.target) * 100}%` }}
                />
              </div>

              <div className="flex items-center gap-2 bg-indigo-50/50 p-3 rounded-xl border border-indigo-50">
                <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
                <p className="text-[12px] font-semibold text-indigo-900">{vault.aiPrediction}</p>
              </div>

              <button 
                onClick={() => haptics.medium()}
                className="w-full mt-4 py-3 bg-gray-50 text-indigo-700 font-bold rounded-xl active:scale-95 transition-transform"
              >
                Contribute via UPI
              </button>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};
