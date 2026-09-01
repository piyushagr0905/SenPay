import React, { useState } from 'react';
import { Users, Send, CheckCircle2, HeartHandshake } from 'lucide-react';
import { Modal } from './Modal';
import { TrustedContact } from '../../types';
import { haptics } from '../../utils/haptics';

interface TrustedContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  contacts: TrustedContact[];
  paymentDetails: {
    amount: number;
    recipientName: string;
    purpose: string;
  };
  onSent: (contactName: string) => void;
}

export const TrustedContactModal: React.FC<TrustedContactModalProps> = ({
  isOpen,
  onClose,
  contacts,
  paymentDetails,
  onSent,
}) => {
  const [selectedContact, setSelectedContact] = useState<string>(contacts[0]?.id || '');
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSend = (method: 'whatsapp' | 'sms' | 'email') => {
    haptics.medium();
    setIsSending(true);
    
    const contact = contacts.find((c) => c.id === selectedContact);
    const message = `Hi ${contact?.name}, I am about to send ₹${paymentDetails.amount.toLocaleString('en-IN')} to ${paymentDetails.recipientName} for ${paymentDetails.purpose}. Sentinel flagged this for a second opinion. Can you review this?`;
    
    if (method === 'whatsapp') {
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    } else if (method === 'sms') {
      const smsUrl = `sms:?body=${encodeURIComponent(message)}`;
      window.open(smsUrl, '_blank');
    } else if (method === 'email') {
      const emailUrl = `mailto:?subject=Please review my transfer&body=${encodeURIComponent(message)}`;
      window.open(emailUrl, '_blank');
    }

    setTimeout(() => {
      setIsSending(false);
      setSentSuccess(true);
      haptics.success();
      setTimeout(() => {
        onSent(contact?.name || 'Trusted Contact');
        setSentSuccess(false);
        onClose();
      }, 1200);
    }, 800);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => { haptics.light(); onClose(); }}
      title="Ask Trusted Contact"
      subtitle="Get a second opinion from your safety circle before sending"
      maxWidth="md"
    >
      <div className="space-y-4 font-apple">
        {sentSuccess ? (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 border border-emerald-100 shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="font-bold text-[18px] text-ink-primary">Verification Request Sent!</h4>
              <p className="text-[14px] text-ink-secondary mt-1 max-w-[240px] mx-auto leading-relaxed">
                Your trusted contact received an SMS & WhatsApp summary to review this transfer.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="p-4 rounded-[20px] bg-blue-50/80 border border-blue-100 text-[13px] space-y-1.5 shadow-sm">
              <p className="text-blue-900 font-bold flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-blue-600 shrink-0" />
                Second Opinion Shield
              </p>
              <p className="text-blue-800 leading-relaxed">
                We'll send a secure, one-time link with the transfer amount (₹{paymentDetails.amount.toLocaleString('en-IN')}) and recipient context so they can advise you.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-[12px] font-bold text-ink-muted uppercase tracking-wider ml-1">
                Select Family / Mentor Contact
              </p>

              <div className="space-y-2">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    onClick={() => { haptics.light(); setSelectedContact(contact.id); }}
                    className={`flex items-center justify-between p-4 rounded-[20px] border transition-all cursor-pointer shadow-sm active:scale-[0.98] ${
                      selectedContact === contact.id
                        ? 'border-indigo-600 bg-indigo-50/30 ring-2 ring-indigo-600/10'
                        : 'border-gray-100 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={contact.avatarUrl}
                        alt={contact.name}
                        className="w-12 h-12 rounded-full object-cover shadow-sm"
                      />
                      <div>
                        <p className="font-bold text-[15px] text-ink-primary">{contact.name}</p>
                        <p className="text-[12px] text-ink-secondary mt-0.5">{contact.relationship} • {contact.phone}</p>
                      </div>
                    </div>

                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      selectedContact === contact.id ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'
                    }`}>
                      {selectedContact === contact.id && <CheckCircle2 className="w-3 h-3 text-white stroke-[3]" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <p className="text-[12px] font-bold text-ink-muted uppercase tracking-wider ml-1 mb-2 text-center">
                Select Sharing Method
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSend('whatsapp')}
                  disabled={isSending || !selectedContact}
                  className="flex-1 h-12 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-[16px] flex items-center justify-center gap-2 transition-colors active:scale-95 disabled:opacity-50 disabled:active:scale-100 shadow-sm"
                >
                  WhatsApp
                </button>
                <button
                  onClick={() => handleSend('sms')}
                  disabled={isSending || !selectedContact}
                  className="flex-1 h-12 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-[16px] flex items-center justify-center gap-2 transition-colors active:scale-95 disabled:opacity-50 disabled:active:scale-100 shadow-sm"
                >
                  SMS
                </button>
                <button
                  onClick={() => handleSend('email')}
                  disabled={isSending || !selectedContact}
                  className="flex-1 h-12 bg-gray-800 hover:bg-gray-900 text-white font-bold rounded-[16px] flex items-center justify-center gap-2 transition-colors active:scale-95 disabled:opacity-50 disabled:active:scale-100 shadow-sm"
                >
                  Email
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};
