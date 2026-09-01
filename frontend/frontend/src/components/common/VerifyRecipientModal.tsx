import React from 'react';
import { ShieldAlert, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';
import { Recipient } from '../../types';
import { haptics } from '../../utils/haptics';

interface VerifyRecipientModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipient: Recipient;
  onContinuePayment?: () => void;
  onCancelPayment?: () => void;
}

export const VerifyRecipientModal: React.FC<VerifyRecipientModalProps> = ({
  isOpen,
  onClose,
  recipient,
  onCancelPayment,
}) => {
  const isUnverified = !recipient.isKnown || recipient.trustScore < 50;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => { haptics.light(); onClose(); }}
      title="Recipient Deep Verification"
      subtitle={`National UPI Network Signal Audit`}
      maxWidth="md"
    >
      <div className="space-y-4 font-apple">
        {/* Profile Card */}
        <div className="p-4 rounded-[20px] bg-surface-subtle border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white border border-gray-100 flex items-center justify-center text-[15px] font-bold text-ink-primary shadow-sm">
              {recipient.initials}
            </div>
            <div>
              <h4 className="font-bold text-[15px] text-ink-primary">{recipient.name}</h4>
              <p className="text-[13px] text-ink-secondary">{recipient.upiId}</p>
            </div>
          </div>

          <span
            className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
              isUnverified
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-green-50 text-sentinel-success border-green-200'
            }`}
          >
            Trust: {recipient.trustScore}/100
          </span>
        </div>

        {/* Verification Checkpoints */}
        <div className="space-y-2">
          <p className="text-[12px] font-bold text-ink-muted uppercase tracking-wider ml-1">
            Verification Signals
          </p>

          <div className="space-y-2">
            <div className="p-4 rounded-[20px] border border-gray-100 bg-white shadow-sm flex items-start gap-3">
              {isUnverified ? (
                <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-bold text-[14px] text-ink-primary mb-0.5">Account History & Age</p>
                <p className="text-[13px] text-ink-secondary leading-relaxed">
                  {isUnverified
                    ? 'Account registered very recently (under 14 days ago). High-frequency peer-to-peer transfers detected.'
                    : 'Account has been active for over 2 years with consistent transactions.'}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-[20px] border border-gray-100 bg-white shadow-sm flex items-start gap-3">
              {isUnverified ? (
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-bold text-[14px] text-ink-primary mb-0.5">Merchant Business Registration</p>
                <p className="text-[13px] text-ink-secondary leading-relaxed">
                  {isUnverified
                    ? 'No registered GSTIN or official corporate banking relationship found. Listed as personal P2P handle.'
                    : 'Verified business account with active GSTIN compliance.'}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-[20px] border border-gray-100 bg-white shadow-sm flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[14px] text-ink-primary mb-0.5">Community Safety Flags</p>
                <p className="text-[13px] text-ink-secondary leading-relaxed">
                  3 inquiries logged in the last 72 hours related to "recruitment deposit" and "task bonus".
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Guidance Box */}
        <div className="p-4 rounded-[20px] bg-amber-50 border border-amber-200 text-amber-950 space-y-1.5 shadow-sm">
          <p className="flex items-center gap-2 font-bold text-[14px]">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            SENTINEL Recommendation
          </p>
          <p className="text-[13px] leading-relaxed">
            Do not proceed unless you have personally spoken with this individual via voice/video or verified their business entity.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          {onCancelPayment && (
            <button
              onClick={() => {
                haptics.medium();
                onClose();
                onCancelPayment();
              }}
              className="w-full py-3.5 bg-sentinel-900 text-white font-bold text-[15px] rounded-xl active:scale-95 transition-transform"
            >
              Cancel Payment (Safest Choice)
            </button>
          )}

          <button
            onClick={() => { haptics.light(); onClose(); }}
            className="w-full py-3.5 bg-gray-100 hover:bg-gray-200 text-ink-primary font-bold text-[15px] rounded-xl active:scale-95 transition-colors"
          >
            Back to Safety Check
          </button>
        </div>
      </div>
    </Modal>
  );
};
