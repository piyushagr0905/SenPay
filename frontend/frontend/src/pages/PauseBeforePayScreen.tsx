import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Info, ArrowRight, XCircle, Users, CheckCircle, ChevronDown, UserX, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Recipient, RiskAssessment } from '../types';
import { formatCurrency } from '../utils/formatters';
import { haptics } from '../utils/haptics';

interface PauseBeforePayScreenProps {
  recipient: Recipient;
  amount: number;
  purpose: string;
  riskAssessment: RiskAssessment;
  onVerifyRecipient: () => void;
  onAskTrustedContact: () => void;
  onCancelPayment: () => void;
  onExplainRisk: () => void;
  onProceedAnyway: () => void;
  seniorSafetyMode?: boolean;
}

export const PauseBeforePayScreen: React.FC<PauseBeforePayScreenProps> = ({
  recipient,
  amount,
  purpose,
  riskAssessment,
  onVerifyRecipient,
  onAskTrustedContact,
  onCancelPayment,
  onExplainRisk,
  onProceedAnyway,
  seniorSafetyMode = false,
}) => {
  const [showOverride, setShowOverride] = useState(false);
  const [showWhy, setShowWhy] = useState(false);

  return (
    <div className="min-h-screen bg-white font-apple flex flex-col relative">
      
      {/* Reassuring Header Area */}
      <div className="px-6 pt-12 pb-6 bg-sentinel-50 border-b border-sentinel-100 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-6 shadow-sm border border-amber-200">
          <ShieldAlert className="w-8 h-8 text-amber-600" />
        </div>
        <h1 className="text-2xl font-bold text-ink-primary tracking-tight mb-2">
          Take a moment before paying.
        </h1>
        <p className="text-[15px] text-ink-secondary max-w-[280px]">
          We noticed a few things worth checking before sending this money.
        </p>
      </div>

      <main className="flex-1 px-5 py-6 flex flex-col gap-6">
        
        {/* Payment Summary */}
        <div className="bg-surface-subtle p-4 rounded-2xl flex items-center justify-between border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-lg font-bold text-ink-primary shadow-sm border border-gray-100">
              {recipient.initials}
            </div>
            <div>
              <p className="font-bold text-[15px] text-ink-primary">{recipient.name}</p>
              <p className="text-[13px] text-ink-secondary">{recipient.upiId}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-[17px] text-ink-primary">{formatCurrency(amount)}</p>
            <p className="text-[12px] text-ink-secondary max-w-[100px] truncate">{purpose}</p>
          </div>
        </div>

        {/* The Risks / Why */}
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-bold text-[14px] text-ink-primary uppercase tracking-wider">What we noticed</h3>
            <button 
              onClick={() => { haptics.light(); setShowWhy(true); }}
              className="text-[13px] font-bold text-sentinel-accent flex items-center gap-1 active:scale-95 transition-transform"
            >
              Why am I seeing this? <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-amber-50/50 rounded-2xl p-4 border border-amber-100 space-y-4">
            <div className="flex items-start gap-3">
              <UserX className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[14px] text-ink-primary">New recipient</p>
                <p className="text-[13px] text-ink-secondary">You've never paid this recipient before.</p>
              </div>
            </div>
            <div className="h-px bg-amber-100 w-full" />
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[14px] text-ink-primary">Unusual amount</p>
                <p className="text-[13px] text-ink-secondary">This payment is significantly higher than your usual payments.</p>
              </div>
            </div>
            <div className="h-px bg-amber-100 w-full" />
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[14px] text-ink-primary">Payment context</p>
                <p className="text-[13px] text-ink-secondary">This request contains signals commonly associated with scams.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1" />

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pb-6">
          <p className="text-center text-[12px] font-bold text-ink-secondary uppercase tracking-widest mb-1">Recommended Action</p>
          
          <button
            onClick={() => { haptics.medium(); onVerifyRecipient(); }}
            className="w-full py-4 rounded-2xl bg-sentinel-900 text-white font-bold text-[16px] flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-md"
          >
            <ShieldCheck className="w-5 h-5" /> Verify recipient
          </button>

          <div className="grid grid-cols-2 gap-3 mt-2">
            <button
              onClick={() => { haptics.light(); onAskTrustedContact(); }}
              className="py-3.5 rounded-2xl bg-white border border-gray-200 text-ink-primary font-bold text-[14px] flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-sm"
            >
              <Users className="w-4 h-4 text-sentinel-accent" /> Ask someone
            </button>
            <button
              onClick={() => { haptics.light(); onCancelPayment(); }}
              className="py-3.5 rounded-2xl bg-white border border-gray-200 text-ink-primary font-bold text-[14px] flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-sm hover:bg-gray-50 hover:text-sentinel-danger hover:border-red-100"
            >
              <XCircle className="w-4 h-4 text-ink-secondary" /> Cancel
            </button>
          </div>

          <button
            onClick={() => setShowOverride(true)}
            className="mt-4 text-[13px] text-ink-muted hover:text-ink-primary font-medium underline underline-offset-4 decoration-ink-faint transition-colors text-center"
          >
            Continue anyway
          </button>
        </div>
      </main>

      {/* WHY AM I SEEING THIS BOTTOM SHEET */}
      <AnimatePresence>
        {showWhy && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowWhy(false)}
              className="absolute inset-0 z-40 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl flex flex-col max-h-[85vh]"
            >
              <div className="p-2 flex justify-center">
                <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
              </div>
              <div className="px-6 pt-4 pb-8 overflow-y-auto">
                <h2 className="text-xl font-bold text-ink-primary mb-6">Why SENTINEL flagged this</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-[16px] text-ink-primary flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs">1</div>
                      New recipient
                    </h3>
                    <p className="text-[14px] text-ink-secondary ml-8">You've never paid this recipient before. Scammers often use new, untraceable accounts.</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-[16px] text-ink-primary flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs">2</div>
                      Amount
                    </h3>
                    <p className="text-[14px] text-ink-secondary ml-8">This payment is significantly higher than your normal activity.</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-[16px] text-ink-primary flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs">3</div>
                      Context
                    </h3>
                    <p className="text-[14px] text-ink-secondary ml-8">The payment request contains unusual urgency indicators commonly found in scams.</p>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-sentinel-50 rounded-2xl border border-sentinel-100">
                  <p className="font-bold text-[14px] text-sentinel-900 mb-2">Verify independently</p>
                  <ul className="text-[13px] text-sentinel-800 space-y-2 list-disc pl-4 marker:text-sentinel-400">
                    <li>Call the recipient using a number you already know.</li>
                    <li>Open the organisation's official website yourself.</li>
                    <li>Don't use contact details provided in a suspicious message.</li>
                  </ul>
                </div>

                <button 
                  onClick={() => setShowWhy(false)}
                  className="w-full mt-6 py-3.5 rounded-2xl bg-gray-100 text-ink-primary font-bold text-[15px] active:scale-95 transition-transform"
                >
                  Got it
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* PROCEED ANYWAY BOTTOM SHEET (Subtle Friction) */}
      <AnimatePresence>
        {showOverride && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowOverride(false)}
              className="absolute inset-0 z-40 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl flex flex-col"
            >
              <div className="p-2 flex justify-center">
                <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
              </div>
              <div className="px-6 pt-4 pb-8">
                <h2 className="text-xl font-bold text-ink-primary mb-2">Are you sure?</h2>
                <p className="text-[14px] text-ink-secondary mb-6">
                  We highly recommend verifying this recipient first. UPI transfers are instant and cannot be easily reversed if this turns out to be a mistake.
                </p>

                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => { setShowOverride(false); onCancelPayment(); }}
                    className="w-full py-4 rounded-2xl bg-sentinel-900 text-white font-bold text-[16px] active:scale-95 transition-transform shadow-md"
                  >
                    Cancel payment (Recommended)
                  </button>
                  <button 
                    onClick={() => { setShowOverride(false); onProceedAnyway(); }}
                    className="w-full py-4 rounded-2xl bg-white border border-gray-200 text-ink-primary font-bold text-[15px] active:scale-95 transition-transform shadow-sm"
                  >
                    Yes, I want to proceed
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};
