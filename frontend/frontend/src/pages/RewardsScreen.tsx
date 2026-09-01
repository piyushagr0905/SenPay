import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Gift, Sparkles, Ticket } from 'lucide-react';
import { haptics } from '../utils/haptics';

interface RewardsScreenProps {
  onBack: () => void;
  onClaimReward: (amount: number) => void;
}

export const RewardsScreen: React.FC<RewardsScreenProps> = ({ onBack, onClaimReward }) => {
  const [scratchedCards, setScratchedCards] = useState<Record<number, boolean>>({});
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [totalWinnings, setTotalWinnings] = useState(345);

  const rewards = [
    { id: 1, amount: 45 },
    { id: 2, amount: 15 },
    { id: 3, amount: 0, text: 'Better luck next time!' },
    { id: 4, amount: 120 },
  ];

  const handleScratch = (id: number, amount: number) => {
    if (scratchedCards[id]) return;
    
    haptics.medium();
    setActiveCard(id);

    setTimeout(() => {
      setScratchedCards(prev => ({ ...prev, [id]: true }));
      haptics.success();
      if (amount > 0) {
        setTotalWinnings(prev => prev + amount);
        onClaimReward(amount);
      }
      setTimeout(() => setActiveCard(null), 1500);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-full bg-surface-base font-apple relative overflow-hidden">
      
      <main className="flex-1 overflow-y-auto pb-24 px-5 pt-6 space-y-6 max-w-md mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-ink-primary active:scale-95 transition-transform">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-ink-primary">Rewards</h1>
          <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
            <Gift className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-sentinel-900 rounded-[24px] p-6 shadow-lg text-center relative overflow-hidden mb-6">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-yellow-400 opacity-20 blur-2xl rounded-full" />
          <h2 className="text-white font-bold text-lg mb-1 relative z-10">Total Winnings</h2>
          <p className="text-4xl font-black text-yellow-400 relative z-10">₹{totalWinnings}</p>
        </div>

        <h3 className="font-bold text-ink-primary px-1 mb-2 text-lg">Your Scratch Cards</h3>
        
        <div className="grid grid-cols-2 gap-4">
          {rewards.map((reward) => {
            const isScratched = scratchedCards[reward.id];
            const isActivelyScratching = activeCard === reward.id;

            return (
              <motion.div
                key={reward.id}
                whileTap={!isScratched ? { scale: 0.95 } : {}}
                onClick={() => handleScratch(reward.id, reward.amount)}
                className={`relative aspect-[3/4] rounded-2xl overflow-hidden shadow-sm cursor-pointer ${
                  isScratched ? 'bg-white border border-gray-200' : 'bg-gradient-to-br from-indigo-500 to-purple-600'
                }`}
              >
                {/* Underneath (The Reward) */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                  {reward.amount > 0 ? (
                    <>
                      <Sparkles className="w-8 h-8 text-yellow-500 mb-2" />
                      <span className="text-xs font-bold text-ink-secondary uppercase tracking-wider mb-1">You won</span>
                      <span className="text-3xl font-black text-ink-primary">₹{reward.amount}</span>
                    </>
                  ) : (
                    <>
                      <Ticket className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm font-bold text-ink-secondary">{reward.text}</span>
                    </>
                  )}
                </div>

                {/* The Scratch Cover */}
                <AnimatePresence>
                  {!isScratched && (
                    <motion.div
                      exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 flex flex-col items-center justify-center z-10"
                    >
                      {isActivelyScratching ? (
                        <motion.div 
                          animate={{ rotate: [0, -10, 10, -10, 0] }}
                          transition={{ repeat: Infinity, duration: 0.3 }}
                          className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
                        >
                          <Gift className="w-6 h-6 text-white" />
                        </motion.div>
                      ) : (
                        <>
                          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm mb-2">
                            <Gift className="w-6 h-6 text-white" />
                          </div>
                          <span className="text-white font-bold text-sm">Tap to scratch</span>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
};
