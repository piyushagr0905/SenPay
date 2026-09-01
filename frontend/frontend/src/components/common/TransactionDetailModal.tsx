import React from 'react';
import { ShieldCheck, ShieldAlert, LifeBuoy } from 'lucide-react';
import { Modal } from './Modal';
import { PaymentTransaction } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { haptics } from '../../utils/haptics';

interface TransactionDetailModalProps {
  transaction: PaymentTransaction | null;
  isOpen: boolean;
  onClose: () => void;
  onReportScam?: (tx: PaymentTransaction) => void;
  onDispute?: (tx: PaymentTransaction) => void;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  transaction,
  isOpen,
  onClose,
  onReportScam,
  onDispute,
}) => {
  if (!transaction) return null;

  const isFlagged = transaction.status === 'flagged' || transaction.status === 'under_review';

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => { haptics.light(); onClose(); }}
      title="Payment Details"
      subtitle={`Ref: ${transaction.transactionRef || 'SENT-TX-99210'}`}
      maxWidth="md"
    >
      <div className="space-y-4 font-apple">
        {/* Main Amount & Status Banner */}
        <div className="text-center p-5 rounded-[20px] bg-surface-subtle border border-gray-100 flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center font-bold text-[16px] text-ink-primary border border-gray-100 mb-3">
            {transaction.recipient.initials}
          </div>
          <p className="text-[28px] font-bold text-ink-primary leading-none mb-1">
            {formatCurrency(transaction.amount)}
          </p>
          <p className="text-[13px] text-ink-secondary">
            To: {transaction.recipient.name} ({transaction.recipient.upiId})
          </p>

          <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white border border-gray-100 shadow-sm">
            {isFlagged ? (
              <>
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                <span className="text-amber-700">Flagged for Safety Review</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="text-emerald-700">Protected by SENTINEL</span>
              </>
            )}
          </div>
        </div>

        {/* Transaction Metadata Grid */}
        <div className="p-4 rounded-[20px] bg-white border border-gray-100 space-y-3 text-[13px] shadow-sm">
          <div className="flex justify-between items-center">
            <span className="text-ink-muted">Purpose</span>
            <span className="text-ink-primary font-medium">{transaction.purpose}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-ink-muted">Category</span>
            <span className="text-ink-primary font-medium">{transaction.purposeCategory}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-ink-muted">Timestamp</span>
            <span className="text-ink-primary font-medium">{formatDate(transaction.timestamp)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-ink-muted">Payment Channel</span>
            <span className="text-ink-primary font-medium uppercase">{transaction.paymentMethod}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          {onDispute && (
            <button
              onClick={() => {
                haptics.medium();
                onClose();
                onDispute(transaction);
              }}
              className="w-full py-3.5 bg-blue-50 text-blue-700 font-bold text-[14px] rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <LifeBuoy className="w-4 h-4" /> File AI Dispute
            </button>
          )}
          {onReportScam && (
            <button
              onClick={() => {
                haptics.medium();
                onClose();
                onReportScam(transaction);
              }}
              className="w-full py-3.5 bg-rose-50 text-rose-700 font-bold text-[14px] rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <ShieldAlert className="w-4 h-4" /> Start Incident Case
            </button>
          )}

          <button
            onClick={() => { haptics.light(); onClose(); }}
            className="w-full py-3.5 bg-gray-100 hover:bg-gray-200 text-ink-primary font-bold text-[14px] rounded-xl active:scale-95 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </Modal>
  );
};
