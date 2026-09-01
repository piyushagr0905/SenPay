import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ShieldAlert,
  User,
  DollarSign,
  FileText,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { Recipient, RiskAssessment } from '../types';
import { formatCurrency } from '../utils/formatters';
import { haptics } from '../utils/haptics';

interface ExplainRiskScreenProps {
  recipient: Recipient;
  amount: number;
  purpose: string;
  riskAssessment: RiskAssessment;
  onBackToPause: () => void;
  onCancelPayment: () => void;
}

export const ExplainRiskScreen: React.FC<ExplainRiskScreenProps> = ({
  recipient,
  amount,
  purpose,
  riskAssessment,
  onBackToPause,
  onCancelPayment,
}) => {
  return (
    <div className="min-h-screen bg-surface-bg flex flex-col font-apple pb-8">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 flex items-center bg-white sticky top-0 z-10 border-b border-gray-100">
        <button onClick={() => { haptics.light(); onBackToPause(); }} className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:scale-95 transition-all">
          <ArrowLeft className="w-6 h-6 text-ink-primary" />
        </button>
        <h1 className="flex-1 text-center font-bold text-[17px] text-ink-primary pr-8">Risk Breakdown</h1>
      </div>

      <main className="flex-1 p-5 max-w-md w-full mx-auto space-y-6">
        <div className="mb-2">
          <h2 className="font-bold text-[24px] text-ink-primary tracking-tight leading-tight">
            Why was this payment flagged?
          </h2>
          <p className="text-[14px] text-ink-secondary mt-1">
            SENTINEL uses proportional friction to highlight unusual patterns before funds settle.
          </p>
        </div>

        {/* Visual Timeline / Stack Stack */}
        <div className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-100 relative before:absolute before:left-[39px] before:top-8 before:bottom-8 before:w-[2px] before:bg-gray-100 space-y-6">
          
          {/* Step 1: Recipient */}
          <div className="flex items-start gap-4 relative">
            <div className="w-10 h-10 rounded-full bg-amber-50 border-2 border-white flex items-center justify-center text-amber-600 shrink-0 z-10">
              <User className="w-5 h-5" />
            </div>
            <div className="flex-1 pt-0.5">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-bold text-[15px] text-ink-primary">Recipient</h4>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                  Unverified
                </span>
              </div>
              <p className="text-[13px] text-ink-secondary">
                First payment to this UPI ID ({recipient.upiId}). No verified merchant credentials.
              </p>
            </div>
          </div>

          {/* Step 2: Amount */}
          <div className="flex items-start gap-4 relative">
            <div className="w-10 h-10 rounded-full bg-rose-50 border-2 border-white flex items-center justify-center text-rose-600 shrink-0 z-10">
              <DollarSign className="w-5 h-5" />
            </div>
            <div className="flex-1 pt-0.5">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-bold text-[15px] text-ink-primary">Amount</h4>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                  Outlier
                </span>
              </div>
              <p className="text-[13px] text-ink-secondary">
                {formatCurrency(amount)} is higher than your typical payment pattern of ₹850 – ₹1,500.
              </p>
            </div>
          </div>

          {/* Step 3: Context */}
          <div className="flex items-start gap-4 relative">
            <div className="w-10 h-10 rounded-full bg-rose-50 border-2 border-white flex items-center justify-center text-rose-600 shrink-0 z-10">
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex-1 pt-0.5">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-bold text-[15px] text-ink-primary">Context</h4>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                  Critical
                </span>
              </div>
              <p className="text-[13px] text-ink-secondary">
                Job-related payment request with upfront fee keywords. Legitimate companies never charge deposits.
              </p>
            </div>
          </div>

          {/* Step 4: Behaviour */}
          <div className="flex items-start gap-4 relative">
            <div className="w-10 h-10 rounded-full bg-amber-50 border-2 border-white flex items-center justify-center text-amber-600 shrink-0 z-10">
              <Activity className="w-5 h-5" />
            </div>
            <div className="flex-1 pt-0.5">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-bold text-[15px] text-ink-primary">Behaviour</h4>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                  Urgency
                </span>
              </div>
              <p className="text-[13px] text-ink-secondary">
                UPI handle was pasted from an external app without normal address book lookup.
              </p>
            </div>
          </div>
        </div>

        {/* Step 5: Decision */}
        <div className="bg-rose-50 border border-rose-200 p-5 rounded-[20px] shadow-sm flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-white text-rose-600 flex items-center justify-center shrink-0 border border-rose-100 shadow-sm">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-[14px] text-rose-950 uppercase tracking-wide mb-1">
              SENTINEL Decision: PAUSE
            </h4>
            <p className="text-[13px] text-rose-800/90 leading-relaxed">
              Friction applied to protect your balance against irreversible instant settlement.
            </p>
          </div>
        </div>

        {/* Recommended Action Card */}
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-[20px] flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          <div>
            <h4 className="font-bold text-[14px] text-emerald-950">Recommended Action</h4>
            <p className="text-[13px] text-emerald-800">Verify the recipient independently before sending money.</p>
          </div>
        </div>

        {/* Bottom CTA Buttons */}
        <div className="space-y-3 pt-4">
          <button
            onClick={() => { haptics.medium(); onCancelPayment(); }}
            className="w-full py-4 bg-sentinel-900 text-white rounded-[20px] font-bold text-[16px] shadow-lg active:scale-95 transition-transform"
          >
            Cancel Payment
          </button>

          <button
            onClick={() => { haptics.light(); onBackToPause(); }}
            className="w-full py-4 bg-white border border-gray-200 text-ink-primary rounded-[20px] font-bold text-[16px] shadow-sm active:scale-95 transition-transform"
          >
            Back to Safety Options
          </button>
        </div>
      </main>
    </div>
  );
};
