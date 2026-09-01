import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Smartphone, Zap, Droplet, Tv, CreditCard, ChevronRight, CheckCircle2 } from 'lucide-react';
import { haptics } from '../../utils/haptics';

interface BillsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPayBill: (amount: number, purpose: string) => void;
}

export const BillsModal: React.FC<BillsModalProps> = ({ isOpen, onClose, onPayBill }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [billerId, setBillerId] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [fetchedBill, setFetchedBill] = useState<{ amount: number; name: string; dueDate: string } | null>(null);

  const categories = [
    { id: 'mobile', label: 'Mobile Recharge', icon: Smartphone, color: 'bg-blue-100 text-blue-600' },
    { id: 'electricity', label: 'Electricity', icon: Zap, color: 'bg-yellow-100 text-yellow-600' },
    { id: 'water', label: 'Water', icon: Droplet, color: 'bg-cyan-100 text-cyan-600' },
    { id: 'dth', label: 'DTH / Cable', icon: Tv, color: 'bg-indigo-100 text-indigo-600' },
    { id: 'creditcard', label: 'Credit Card', icon: CreditCard, color: 'bg-rose-100 text-rose-600' },
  ];

  const handleFetchBill = () => {
    if (!billerId) return;
    haptics.medium();
    setIsFetching(true);
    
    // Simulate fetching bill from Bharat BillPay
    setTimeout(() => {
      setIsFetching(false);
      setFetchedBill({
        name: 'Maharashtra State Electricity Board',
        amount: Math.floor(Math.random() * 2000) + 500,
        dueDate: 'Due in 3 days',
      });
      haptics.success();
    }, 1500);
  };

  const handlePay = () => {
    if (fetchedBill) {
      onPayBill(fetchedBill.amount, `Bill Payment - ${selectedCategory}`);
      setTimeout(onClose, 500);
    }
  };

  // Reset state when closing or opening
  React.useEffect(() => {
    if (isOpen) {
      setSelectedCategory(null);
      setBillerId('');
      setFetchedBill(null);
      setIsFetching(false);
    }
  }, [isOpen]);

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
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-md bg-white rounded-t-[32px] rounded-b-[32px] shadow-2xl overflow-hidden mt-auto mb-0 sm:mb-auto sm:mt-auto sm:rounded-[32px] flex flex-col max-h-[80vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-white sticky top-0 z-10">
            <h2 className="text-lg font-bold text-ink-primary">
              {selectedCategory ? 'Pay Bill' : 'Bills & Recharges'}
            </h2>
            <button 
              onClick={selectedCategory ? () => setSelectedCategory(null) : onClose}
              className="p-2 text-ink-muted hover:text-ink-primary bg-gray-50 rounded-full active:scale-95 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 overflow-y-auto">
            {!selectedCategory ? (
              <div className="space-y-4">
                <p className="text-sm font-semibold text-ink-secondary mb-2 uppercase tracking-wider">Bharat BillPay Supported</p>
                <div className="grid grid-cols-4 gap-4">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => { haptics.light(); setSelectedCategory(cat.id); }}
                      className="flex flex-col items-center gap-2 active:scale-95 transition-transform"
                    >
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center ${cat.color}`}>
                        <cat.icon className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-semibold text-ink-primary text-center leading-tight">
                        {cat.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {!fetchedBill ? (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    <div>
                      <label className="text-sm font-bold text-ink-primary mb-1 block">Enter Consumer / Biller ID</label>
                      <input
                        type="text"
                        value={billerId}
                        onChange={(e) => setBillerId(e.target.value)}
                        placeholder="e.g. 1234567890"
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:border-sentinel-accent focus:ring-1 focus:ring-sentinel-accent text-[15px]"
                      />
                    </div>
                    <button
                      onClick={handleFetchBill}
                      disabled={!billerId || isFetching}
                      className="w-full py-3.5 bg-sentinel-accent text-white font-bold rounded-2xl disabled:opacity-50 transition-colors flex justify-center items-center"
                    >
                      {isFetching ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        'Fetch Bill'
                      )}
                    </button>
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                    <div className="bg-sentinel-50 p-5 rounded-2xl border border-sentinel-200">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-ink-primary text-[15px]">{fetchedBill.name}</h3>
                          <p className="text-[13px] text-ink-secondary">ID: {billerId}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-sentinel-100 flex items-center justify-center text-sentinel-accent">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-gray-100 flex justify-between items-center shadow-sm">
                        <div>
                          <p className="text-[12px] font-bold text-rose-500 uppercase">{fetchedBill.dueDate}</p>
                          <p className="text-[28px] font-black text-ink-primary leading-none mt-1">
                            ₹{fetchedBill.amount.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handlePay}
                      className="w-full py-3.5 bg-sentinel-900 text-white font-bold rounded-2xl shadow-md active:scale-95 transition-transform"
                    >
                      Proceed to Pay
                    </button>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
