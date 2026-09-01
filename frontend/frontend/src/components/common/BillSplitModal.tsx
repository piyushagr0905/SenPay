import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ScanLine, FileText, CheckCircle2 } from 'lucide-react';
import { haptics } from '../../utils/haptics';

interface BillSplitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSplitComplete: (amount: number, contactsCount: number) => void;
}

export const BillSplitModal: React.FC<BillSplitModalProps> = ({ isOpen, onClose, onSplitComplete }) => {
  const [phase, setPhase] = useState<'idle' | 'scan' | 'processing' | 'done' | 'split_details'>('idle');
  const [friendAmounts, setFriendAmounts] = useState<Record<string, number>>({});
  const friendsList = ['Riya', 'Aman', 'Karan', 'Neha', 'Rahul'];
  const totalAmount = 3450;
  
  const totalRequested = Object.values(friendAmounts).reduce((acc, curr) => acc + (curr || 0), 0);
  const myShare = totalAmount - totalRequested;

  useEffect(() => {
    if (isOpen) {
      setPhase('idle');
      // Initialize with equal split for 3 friends
      setFriendAmounts({
        'Riya': 862,
        'Aman': 862,
        'Karan': 862
      });
    }
  }, [isOpen]);

  const startScan = () => {
    setPhase('scan');
    haptics.medium();
    
    const scanTimer = setTimeout(() => {
      setPhase('processing');
      haptics.light();
      
      const procTimer = setTimeout(() => {
        setPhase('done');
        haptics.success();
        
        setTimeout(() => {
          setPhase('split_details');
          haptics.medium();
        }, 1500);
      }, 1500);
    }, 2500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-sm bg-white rounded-[32px] p-8 shadow-2xl flex flex-col items-center overflow-hidden text-center"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-ink-muted hover:text-ink-primary bg-gray-50 rounded-full active:scale-95 transition-all z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-xl font-bold text-ink-primary mt-2">Smart Bill Split</h2>
          <p className="text-sm text-ink-secondary mt-2 mb-6">
            {phase === 'idle' && 'How would you like to provide the bill?'}
            {phase === 'scan' && 'Align your receipt within the frame'}
            {phase === 'processing' && 'Sentinel AI is extracting line items...'}
            {phase === 'done' && 'Total successfully extracted!'}
            {phase === 'split_details' && 'Choose who to split with'}
          </p>

          {phase === 'split_details' ? (
            <div className="w-full flex flex-col items-center">
              <div className="text-center mb-6">
                <span className="text-sm text-ink-secondary uppercase tracking-wider font-bold">Total Bill</span>
                <div className="text-4xl font-black text-ink-primary mt-1">₹{totalAmount}</div>
                <div className="flex justify-between items-center mt-4 text-sm px-2">
                  <span className="text-ink-secondary">Your Share: <span className="font-bold text-sentinel-accent">₹{myShare}</span></span>
                  <span className="text-ink-secondary">Requested: <span className="font-bold text-ink-primary">₹{totalRequested}</span></span>
                </div>
              </div>

              <div className="w-full max-h-48 overflow-y-auto mb-6 bg-gray-50 rounded-2xl border border-gray-100 p-2 space-y-2">
                {friendsList.map(friend => {
                  return (
                    <div 
                      key={friend}
                      className="flex items-center justify-between p-2 rounded-xl bg-white shadow-sm border border-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                          {friend[0]}
                        </div>
                        <span className="font-bold text-ink-primary">{friend}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-ink-secondary">₹</span>
                        <input
                          type="number"
                          value={friendAmounts[friend] || ''}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            setFriendAmounts(prev => ({ ...prev, [friend]: val }));
                          }}
                          placeholder="0"
                          className="w-20 px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-right font-bold text-ink-primary focus:outline-none focus:border-sentinel-accent focus:ring-1 focus:ring-sentinel-accent"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => {
                  haptics.success();
                  const peopleCount = Object.values(friendAmounts).filter(amt => amt > 0).length;
                  onSplitComplete(totalRequested, peopleCount);
                }}
                disabled={totalRequested === 0 || myShare < 0}
                className="w-full py-4 bg-sentinel-900 hover:bg-sentinel-800 text-white font-bold rounded-2xl active:scale-95 transition-all shadow-md disabled:opacity-50"
              >
                {myShare < 0 ? 'Exceeds Total Bill' : `Request ₹${totalRequested}`}
              </button>
            </div>
          ) : phase === 'idle' ? (
            <div className="w-full flex flex-col gap-3 mb-4">
              <button
                onClick={startScan}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md"
              >
                <ScanLine className="w-5 h-5" />
                Scan Receipt
              </button>
              <button
                onClick={() => {
                  // Simulate picking file then starting scan
                  haptics.light();
                  startScan();
                }}
                className="w-full py-4 bg-gray-100 hover:bg-gray-200 text-ink-primary font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <FileText className="w-5 h-5" />
                Upload from Gallery
              </button>
            </div>
          ) : (
            <div className="relative w-full aspect-[3/4] bg-gray-100 rounded-[20px] mb-6 overflow-hidden flex flex-col items-center justify-center border border-gray-200">
              {phase === 'scan' && (
                <>
                  <div className="absolute inset-6 border-2 border-dashed border-sentinel-accent/50 rounded-xl" />
                  <motion.div 
                    initial={{ top: 0 }}
                    animate={{ top: '100%' }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                    className="absolute left-0 right-0 h-1 bg-sentinel-accent/80 shadow-[0_0_15px_5px_rgba(59,130,246,0.3)] z-10"
                  />
                  <FileText className="w-16 h-16 text-gray-300" />
                </>
              )}

              {phase === 'processing' && (
                <div className="flex flex-col items-center justify-center">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="w-12 h-12 border-4 border-sentinel-accent border-t-transparent rounded-full mb-4"
                  />
                  <ScanLine className="w-6 h-6 text-sentinel-accent absolute inset-0 m-auto mt-[40%]" />
                </div>
              )}

              {phase === 'done' && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                  className="w-16 h-16 bg-sentinel-success rounded-full flex items-center justify-center text-white shadow-lg"
                >
                  <CheckCircle2 className="w-8 h-8" />
                </motion.div>
              )}
            </div>
          )}
          
          <div className="w-16 h-1 bg-gray-200 rounded-full mt-2" />
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
