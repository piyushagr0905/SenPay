import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  FileText,
  Image,
  MessageSquare,
  Receipt,
  Link2,
  ArrowRight,
  ShieldCheck,
  Download,
  Copy,
  Check,
} from 'lucide-react';
import { PaymentTransaction, CaseEvidence } from '../types';
import { formatCurrency } from '../utils/formatters';
import { haptics } from '../utils/haptics';

interface ScamIncidentScreenProps {
  recentPayments: PaymentTransaction[];
  initialSelectedTransaction?: PaymentTransaction | null;
  onBack: () => void;
}

export const ScamIncidentScreen: React.FC<ScamIncidentScreenProps> = ({
  recentPayments,
  initialSelectedTransaction,
  onBack,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(initialSelectedTransaction ? 2 : 1);
  const [selectedTx, setSelectedTx] = useState<PaymentTransaction | null>(
    initialSelectedTransaction || recentPayments[0] || null
  );

  const [evidenceList, setEvidenceList] = useState<CaseEvidence[]>([
    {
      id: 'ev-1',
      type: 'screenshot',
      fileName: 'WhatsApp_Chat.png',
      fileSize: '1.2 MB',
      timestamp: 'Today, 2:15 PM',
      extractedText: 'Transfer ₹8,500 security deposit',
    },
    {
      id: 'ev-2',
      type: 'receipt',
      fileName: 'Payment_Receipt.pdf',
      fileSize: '240 KB',
      timestamp: 'Today, 4:20 PM',
    },
  ]);

  const [copiedSummary, setCopiedSummary] = useState(false);

  const handleAddEvidence = (type: 'screenshot' | 'message' | 'receipt' | 'link') => {
    haptics.light();
    const newEv: CaseEvidence = {
      id: `ev-${Date.now()}`,
      type,
      fileName: type === 'screenshot' ? `Screenshot_${Date.now().toString().slice(-4)}.png`
        : type === 'message' ? `SMS_Export.txt`
        : type === 'receipt' ? `Statement.pdf`
        : `Payment_Link.url`,
      fileSize: '450 KB',
      timestamp: 'Just now',
    };
    setEvidenceList((prev) => [...prev, newEv]);
  };

  const caseSummaryText = `=== SENTINEL PAY INCIDENT DOSSIER ===
Case Ref: SEN-CASE-${Date.now().toString().slice(-4)}
Date: ${new Date().toLocaleDateString('en-IN')}
Transaction Ref: ${selectedTx?.transactionRef || 'SENT-2024'}
Reported Amount: ${selectedTx ? formatCurrency(selectedTx.amount) : '₹0.00'}
Beneficiary: ${selectedTx?.recipient.upiId || 'Unknown'}
Dispute Channel: National Cyber Crime Portal (1930)

TIMELINE:
1. Payment Initiated
2. SENTINEL Risk Warning Displayed
3. Payment Settled
4. Incident Reported

ACTION REQUESTED:
Immediate lien on beneficiary handle ${selectedTx?.recipient.upiId || 'Unknown'} under Section 66D IT Act.`;

  const handleCopySummary = () => {
    haptics.success();
    navigator.clipboard.writeText(caseSummaryText);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  return (
    <div className="min-h-screen bg-surface-bg flex flex-col font-apple pb-8">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 flex items-center bg-white sticky top-0 z-10 border-b border-gray-100">
        <button onClick={() => { haptics.light(); onBack(); }} className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:scale-95 transition-all">
          <ArrowLeft className="w-6 h-6 text-ink-primary" />
        </button>
        <h1 className="flex-1 text-center font-bold text-[17px] text-ink-primary pr-8">Incident Guide</h1>
      </div>

      <main className="flex-1 p-5 max-w-md w-full mx-auto space-y-6">
        
        {/* Title */}
        <div className="mb-2">
          <h2 className="text-2xl font-bold text-ink-primary tracking-tight mb-1">Let's work through this.</h2>
          <p className="text-[15px] text-ink-secondary">We'll help you organize what happened and identify next steps.</p>
        </div>

        {/* Steps */}
        <div className="flex gap-2 mb-6">
          {[1, 2, 3].map((step) => (
            <div key={step} className={`h-1 flex-1 rounded-full ${currentStep >= step ? 'bg-sentinel-900' : 'bg-gray-200'}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: Select Transaction */}
          {currentStep === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-4">
              <h3 className="font-bold text-[14px] text-ink-secondary uppercase tracking-wider">Select the transaction</h3>
              <div className="space-y-3">
                {recentPayments.map((tx) => (
                  <button
                    key={tx.id}
                    onClick={() => { haptics.light(); setSelectedTx(tx); }}
                    className={`w-full p-4 rounded-[20px] text-left transition-all border ${
                      selectedTx?.id === tx.id ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-bold text-[15px] text-ink-primary">{tx.recipient.name}</p>
                      <p className="font-bold text-[15px] text-ink-primary">{formatCurrency(tx.amount)}</p>
                    </div>
                    <div className="flex justify-between items-center text-[13px] text-ink-secondary">
                      <p>{tx.recipient.upiId}</p>
                      <p>{tx.formattedDate}</p>
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => { haptics.medium(); setCurrentStep(2); }}
                className="w-full py-4 rounded-2xl bg-sentinel-900 text-white font-bold text-[16px] flex items-center justify-center gap-2 mt-4 active:scale-95 transition-transform"
              >
                Continue <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {/* STEP 2: Add Evidence */}
          {currentStep === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-4">
              <h3 className="font-bold text-[14px] text-ink-secondary uppercase tracking-wider">Add Evidence</h3>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'screenshot', icon: Image, label: 'Image' },
                  { id: 'message', icon: MessageSquare, label: 'Chat' },
                  { id: 'receipt', icon: Receipt, label: 'Receipt' },
                  { id: 'link', icon: Link2, label: 'Link' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleAddEvidence(t.id as any)}
                    className="p-3 bg-white rounded-2xl border border-gray-100 flex flex-col items-center gap-2 active:scale-95 transition-transform shadow-sm"
                  >
                    <div className="w-10 h-10 rounded-full bg-sentinel-50 text-sentinel-accent flex items-center justify-center">
                      <t.icon className="w-5 h-5" />
                    </div>
                    <span className="text-[12px] font-medium text-ink-primary">{t.label}</span>
                  </button>
                ))}
              </div>

              <h3 className="font-bold text-[14px] text-ink-secondary uppercase tracking-wider mt-6">Attached Files</h3>
              <div className="bg-white rounded-[20px] p-3 border border-gray-100 shadow-sm space-y-2">
                {evidenceList.map((ev) => (
                  <div key={ev.id} className="flex items-center justify-between p-2">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-sentinel-accent shrink-0" />
                      <div>
                        <p className="font-medium text-[14px] text-ink-primary">{ev.fileName}</p>
                        <p className="text-[12px] text-ink-secondary">{ev.fileSize} • {ev.timestamp}</p>
                      </div>
                    </div>
                    <Check className="w-4 h-4 text-sentinel-success" />
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => { haptics.light(); setCurrentStep(1); }}
                  className="py-4 px-6 rounded-2xl bg-white border border-gray-200 text-ink-primary font-bold text-[15px] active:scale-95 transition-transform shadow-sm"
                >
                  Back
                </button>
                <button
                  onClick={() => { haptics.medium(); setCurrentStep(3); }}
                  className="flex-1 py-4 rounded-2xl bg-sentinel-900 text-white font-bold text-[15px] flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-md"
                >
                  Generate Timeline <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Timeline */}
          {currentStep === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[14px] text-ink-secondary uppercase tracking-wider">Case Timeline</h3>
                <span className="text-[11px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 font-bold uppercase">
                  Ref: SEN-CASE
                </span>
              </div>

              <div className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-100 relative before:absolute before:left-[31px] before:top-6 before:bottom-6 before:w-px before:bg-gray-200 space-y-6">
                {[
                  { title: 'Payment Initiated', time: '4:19 PM', desc: `Transfer of ${selectedTx ? formatCurrency(selectedTx.amount) : '₹8,500'} started.`, color: 'bg-blue-500' },
                  { title: 'Risk Warning Shown', time: '4:20 PM', desc: 'Pause Before Pay intervention triggered.', color: 'bg-amber-500' },
                  { title: 'Payment Completed', time: '4:21 PM', desc: 'UPI settlement confirmed.', color: 'bg-gray-400' },
                  { title: 'Case Created', time: 'Active', desc: 'Evidence packaged and ready for bank.', color: 'bg-sentinel-success' },
                ].map((ev, i) => (
                  <div key={i} className="flex items-start gap-4 relative">
                    <div className={`w-3 h-3 rounded-full mt-1.5 shrink-0 z-10 border-[3px] border-white ${ev.color}`} />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-bold text-[14px] text-ink-primary">{ev.title}</h4>
                        <span className="text-[12px] text-ink-secondary">{ev.time}</span>
                      </div>
                      <p className="text-[13px] text-ink-secondary mt-1">{ev.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Generate PDF Card */}
              <div className="bg-sentinel-900 p-5 rounded-[20px] shadow-md border border-sentinel-800 text-white">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-[16px]">Official Dispute Dossier</h4>
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                </div>
                <p className="text-[13px] text-white/70 mb-5">
                  Submit this structured summary directly to your Bank Dispute Manager or the National Cyber Crime Portal.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={handleCopySummary}
                    className="flex-1 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[14px] font-bold flex items-center justify-center gap-2 active:scale-95 transition-colors border border-white/10"
                  >
                    {copiedSummary ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    {copiedSummary ? 'Copied' : 'Copy'}
                  </button>
                  <button
                    onClick={() => { haptics.success(); alert('Dossier Downloaded'); }}
                    className="flex-1 py-3 bg-white text-sentinel-900 rounded-xl text-[14px] font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
                  >
                    <Download className="w-4 h-4" /> PDF
                  </button>
                </div>
              </div>

              <button
                onClick={() => { haptics.light(); onBack(); }}
                className="w-full py-4 rounded-2xl bg-white border border-gray-200 text-ink-primary font-bold text-[16px] active:scale-95 transition-transform shadow-sm"
              >
                Return to Protect
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
};
