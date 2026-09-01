import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, QrCode, AtSign, Users, Building2, ArrowLeft, Check, ShieldCheck, ChevronRight, Loader2, CreditCard, Globe2 } from 'lucide-react';
import { Recipient, PaymentMethod } from '../types';
import { haptics } from '../utils/haptics';
import { UpiPinModal } from '../components/common/UpiPinModal';

interface PayScreenProps {
  recipients: Recipient[];
  initialRecipientUpi?: string;
  initialAmount?: number;
  initialPurpose?: string;
  method?: PaymentMethod;
  currencyData?: {currency: string, foreignAmount: number, exchangeRate: number} | null;
  onInitiatePayment: (recipient: Recipient, amount: number, purpose: string, method: PaymentMethod) => void;
  onScanQR: () => void;
  onBack: () => void;
}

export const PayScreen: React.FC<PayScreenProps> = ({
  recipients,
  initialRecipientUpi = '',
  initialAmount,
  initialPurpose = '',
  method: initialMethod = 'upi',
  currencyData,
  onInitiatePayment,
  onScanQR,
  onBack,
}) => {
  const [method, setMethod] = useState<PaymentMethod>(initialMethod);
  const [recipientUpi, setRecipientUpi] = useState(initialRecipientUpi);
  const [contactSearch, setContactSearch] = useState('');
  
  // Bank form state
  const [bankAcc, setBankAcc] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [beneName, setBeneName] = useState('');
  
  const [isResolving, setIsResolving] = useState(false);
  const [resolvedName, setResolvedName] = useState('');
  
  const matchedRecipient = recipients.find((r) => r.upiId === initialRecipientUpi);
  const derivedName = matchedRecipient?.name || (initialRecipientUpi ? initialRecipientUpi.split('@')[0] : '');
  
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(matchedRecipient || null);
  const [amount, setAmount] = useState<number | string>(initialAmount || '');
  const [purpose, setPurpose] = useState(initialPurpose);
  const [showPurposeDropdown, setShowPurposeDropdown] = useState(false);
  const [paymentSource, setPaymentSource] = useState<'hdfc' | 'sbi' | 'credit'>('hdfc');
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);

  const purposeOptions = ['Rent', 'Shopping', 'Food', 'Education', 'Bills', 'Travel', 'Salary', 'Transfer', 'Job Registration', 'Other'];

  const handleSelectRecipient = (rec: Recipient) => {
    haptics.light();
    setSelectedRecipient(rec);
    setRecipientUpi(rec.upiId);
  };

  const handleCustomUpiChange = (upi: string) => {
    setRecipientUpi(upi);
  };

  // Debounced UPI Resolver Simulator
  useEffect(() => {
    if (method !== 'upi' || recipientUpi.length < 5) {
      if (method === 'upi') {
        setSelectedRecipient(null);
        setResolvedName('');
        setIsResolving(false);
      }
      return;
    }

    // Check if it's already a known contact
    const existing = recipients.find((r) => r.upiId.toLowerCase() === recipientUpi.toLowerCase() || r.phone === recipientUpi);
    if (existing) {
      setSelectedRecipient(existing);
      setResolvedName(existing.name);
      setIsResolving(false);
      return;
    }

    setIsResolving(true);
    setResolvedName('');
    setSelectedRecipient(null);

    const timer = setTimeout(() => {
      // Mock API response logic
      const mockNames = ['Amit Sharma', 'Priya Patel', 'Rahul Singh', 'Neha Gupta', 'Vikram Reddy'];
      const randomName = mockNames[recipientUpi.length % mockNames.length];
      
      const newRecip: Recipient = {
        id: `custom-${Date.now()}`,
        name: randomName,
        upiId: recipientUpi.includes('@') ? recipientUpi : `${recipientUpi}@oksbi`,
        phone: recipientUpi.includes('@') ? undefined : recipientUpi,
        initials: (randomName[0] || 'U').toUpperCase(),
        isKnown: false,
        previousPaymentsCount: 0,
        totalTransferred: 0,
        trustScore: 30,
        category: 'Unknown',
      };
      
      setSelectedRecipient(newRecip);
      setResolvedName(randomName);
      setIsResolving(false);
      haptics.success();
    }, 1200);

    return () => clearTimeout(timer);
  }, [recipientUpi, method, recipients]);

  const handleBankChange = (acc: string, code: string, name: string) => {
    setBankAcc(acc);
    setIfsc(code);
    setBeneName(name);
    if (acc && code && name) {
      setSelectedRecipient({
        id: `bank-${Date.now()}`,
        name: name,
        upiId: `${acc}@${code.toLowerCase()}.bank`,
        bankAccount: acc,
        initials: (name[0] || 'B').toUpperCase(),
        isKnown: false,
        previousPaymentsCount: 0,
        totalTransferred: 0,
        trustScore: 30,
        category: 'Unknown',
      });
    } else {
      setSelectedRecipient(null);
    }
  };

  const handleContinue = () => {
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) || 0 : amount;
    if (!selectedRecipient || numericAmount <= 0) return;
    haptics.medium();
    setIsPinModalOpen(true);
  };

  const renderRecipientSelection = () => {
    if (method === 'contact') {
      const filteredContacts = recipients.filter(r => r.name.toLowerCase().includes(contactSearch.toLowerCase()) || r.upiId.toLowerCase().includes(contactSearch.toLowerCase()));
      return (
        <div className="space-y-3">
          <input
            type="text"
            value={contactSearch}
            onChange={(e) => setContactSearch(e.target.value)}
            placeholder="Search name or number"
            className="w-full px-4 py-3.5 rounded-2xl bg-white border border-gray-200 text-[15px] focus:outline-none focus:border-sentinel-accent focus:ring-1 focus:ring-sentinel-accent shadow-sm"
          />
          <div className="max-h-48 overflow-y-auto space-y-2">
            {filteredContacts.map(contact => (
              <div 
                key={contact.id} 
                onClick={() => handleSelectRecipient(contact)}
                className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-colors ${selectedRecipient?.id === contact.id ? 'bg-sentinel-50 border border-sentinel-200' : 'bg-white border border-transparent hover:bg-gray-50'}`}
              >
                <div className="w-10 h-10 rounded-full bg-surface-subtle flex items-center justify-center font-bold text-ink-primary">
                  {contact.initials}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-[15px] text-ink-primary">{contact.name}</p>
                  <p className="text-[13px] text-ink-secondary">{contact.phone || contact.upiId}</p>
                </div>
                {selectedRecipient?.id === contact.id && <Check className="w-5 h-5 text-sentinel-accent" />}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (method === 'bank') {
      return (
        <div className="space-y-3">
          <input
            type="number"
            value={bankAcc}
            onChange={(e) => handleBankChange(e.target.value, ifsc, beneName)}
            placeholder="Account Number"
            className="w-full px-4 py-3.5 rounded-2xl bg-white border border-gray-200 text-[15px] focus:outline-none focus:border-sentinel-accent focus:ring-1 focus:ring-sentinel-accent shadow-sm"
          />
          <input
            type="text"
            value={ifsc}
            onChange={(e) => handleBankChange(bankAcc, e.target.value, beneName)}
            placeholder="IFSC Code"
            className="w-full px-4 py-3.5 rounded-2xl bg-white border border-gray-200 text-[15px] focus:outline-none focus:border-sentinel-accent focus:ring-1 focus:ring-sentinel-accent shadow-sm uppercase"
          />
          <input
            type="text"
            value={beneName}
            onChange={(e) => handleBankChange(bankAcc, ifsc, e.target.value)}
            placeholder="Beneficiary Name"
            className="w-full px-4 py-3.5 rounded-2xl bg-white border border-gray-200 text-[15px] focus:outline-none focus:border-sentinel-accent focus:ring-1 focus:ring-sentinel-accent shadow-sm"
          />
        </div>
      );
    }

    return (
      <div className="space-y-3 relative">
        <input
          type="text"
          value={recipientUpi}
          onChange={(e) => handleCustomUpiChange(e.target.value)}
          placeholder="Enter UPI ID or Mobile Number"
          className="w-full px-4 py-3.5 rounded-2xl bg-white border border-gray-200 text-[15px] focus:outline-none focus:border-sentinel-accent focus:ring-1 focus:ring-sentinel-accent shadow-sm"
        />
        
        {recipientUpi.length >= 5 && (
          <div className="absolute right-4 top-3">
            {isResolving ? (
              <Loader2 className="w-5 h-5 text-ink-muted animate-spin" />
            ) : resolvedName ? (
              <Check className="w-5 h-5 text-sentinel-success" />
            ) : null}
          </div>
        )}

        {resolvedName && !isResolving && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-sentinel-200 shadow-sm"
          >
            <div className="w-10 h-10 rounded-full bg-surface-subtle flex items-center justify-center font-bold text-ink-primary">
              {(resolvedName[0] || 'U').toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-[15px] text-ink-primary">{resolvedName}</p>
              <p className="text-[12px] text-sentinel-success font-semibold flex items-center gap-1 mt-0.5">
                <Check className="w-3 h-3" /> Verified Name
              </p>
            </div>
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-surface-bg flex flex-col font-apple pb-32">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 flex items-center bg-white sticky top-0 z-10 border-b border-gray-100">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:scale-95 transition-all">
          <ArrowLeft className="w-6 h-6 text-ink-primary" />
        </button>
        <h1 className="flex-1 text-center font-bold text-[17px] text-ink-primary pr-8">Send Money</h1>
      </div>

      <main className="flex-1 p-5 flex flex-col gap-6 max-w-md w-full mx-auto">
        
        {/* Method Tabs */}
        <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl">
          {[{ id: 'upi', label: 'UPI ID', icon: AtSign }, { id: 'contact', label: 'Contacts', icon: Users }, { id: 'bank', label: 'Bank', icon: Building2 }].map((t) => (
            <button
              key={t.id}
              onClick={() => { haptics.light(); setMethod(t.id as PaymentMethod); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${method === t.id ? 'bg-white text-ink-primary shadow-sm' : 'text-ink-secondary'}`}
            >
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </div>

        {/* Recipient */}
        <section>
          <h2 className="text-[13px] font-bold text-ink-secondary uppercase tracking-wider mb-2 ml-1">To</h2>
          {renderRecipientSelection()}
        </section>

        {/* Amount */}
        <section>
          <h2 className="text-[13px] font-bold text-ink-secondary uppercase tracking-wider mb-2 ml-1">Amount</h2>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-ink-primary font-bold">₹</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className={`w-full pl-10 pr-4 py-4 rounded-2xl bg-white border ${currencyData ? 'border-blue-200 ring-2 ring-blue-500/20' : 'border-gray-200'} text-3xl font-bold text-ink-primary focus:outline-none focus:border-sentinel-accent focus:ring-1 focus:ring-sentinel-accent shadow-sm`}
            />
          </div>
          
          {currencyData && (
            <div className="mt-3 flex items-center justify-between p-3 bg-blue-50/50 rounded-xl border border-blue-100">
              <div className="flex items-center gap-2 text-sm font-medium text-blue-800">
                <Globe2 className="w-4 h-4" />
                Global Mode Active
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-blue-900">{currencyData.foreignAmount} {currencyData.currency}</p>
                <p className="text-[11px] text-blue-600 font-medium">1 {currencyData.currency} = ₹{currencyData.exchangeRate.toFixed(2)}</p>
              </div>
            </div>
          )}
        </section>

        {/* Purpose */}
        <section className="relative">
          <h2 className="text-[13px] font-bold text-ink-secondary uppercase tracking-wider mb-2 ml-1">Purpose</h2>
          <button 
            onClick={() => setShowPurposeDropdown(!showPurposeDropdown)}
            className="w-full px-4 py-3.5 rounded-2xl bg-white border border-gray-200 text-[15px] flex items-center justify-between focus:outline-none shadow-sm"
          >
            <span className={purpose ? "text-ink-primary" : "text-ink-muted"}>{purpose || 'Select payment purpose'}</span>
            <ChevronRight className={`w-5 h-5 text-ink-secondary transition-transform ${showPurposeDropdown ? 'rotate-90' : ''}`} />
          </button>

          <AnimatePresence>
            {showPurposeDropdown && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 z-20 max-h-48 overflow-y-auto p-2 grid grid-cols-2 gap-2"
              >
                {purposeOptions.map(p => (
                  <button
                    key={p}
                    onClick={() => { setPurpose(p); setShowPurposeDropdown(false); haptics.light(); }}
                    className={`text-left px-3 py-2.5 rounded-xl text-[14px] font-medium transition-colors ${purpose === p ? 'bg-sentinel-50 text-sentinel-accent' : 'text-ink-primary hover:bg-gray-50'}`}
                  >
                    {p}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Payment Source */}
        <section className="mt-6">
          <h2 className="text-[13px] font-bold text-ink-secondary uppercase tracking-wider mb-2 ml-1">Payment Source</h2>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <button 
              onClick={() => { setPaymentSource('hdfc'); haptics.light(); }}
              className={`w-full p-4 flex items-center justify-between border-b border-gray-100 transition-colors ${paymentSource === 'hdfc' ? 'bg-sentinel-50/50' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-ink-primary text-sm">HDFC Bank •••• 4321</p>
                  <p className="text-xs text-ink-secondary">Available: ₹68,300</p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentSource === 'hdfc' ? 'border-sentinel-accent bg-sentinel-accent' : 'border-gray-300'}`}>
                {paymentSource === 'hdfc' && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
            </button>
            
            <button 
              onClick={() => { setPaymentSource('sbi'); haptics.light(); }}
              className={`w-full p-4 flex items-center justify-between border-b border-gray-100 transition-colors ${paymentSource === 'sbi' ? 'bg-sentinel-50/50' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-ink-primary text-sm">State Bank of India •••• 9981</p>
                  <p className="text-xs text-ink-secondary">Available: ₹12,450</p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentSource === 'sbi' ? 'border-sentinel-accent bg-sentinel-accent' : 'border-gray-300'}`}>
                {paymentSource === 'sbi' && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
            </button>

            <button 
              onClick={() => { setPaymentSource('credit'); haptics.light(); }}
              className={`w-full p-4 flex items-center justify-between transition-colors ${paymentSource === 'credit' ? 'bg-sentinel-50/50' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 border border-purple-100">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-ink-primary text-sm">SenPay Credit Line</p>
                    <span className="text-[9px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-sm uppercase tracking-wider">Zero Interest</span>
                  </div>
                  <p className="text-xs text-ink-secondary">Pre-approved: ₹50,000</p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentSource === 'credit' ? 'border-sentinel-accent bg-sentinel-accent' : 'border-gray-300'}`}>
                {paymentSource === 'credit' && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
            </button>
          </div>
        </section>

        <div className="flex-1" />

        {/* Trust Banner & CTA */}
        <div className="flex flex-col gap-4 mt-8">
          <div className="flex items-center justify-center gap-2 text-[13px] text-ink-secondary font-medium">
            <ShieldCheck className="w-4 h-4 text-sentinel-shield" />
            Protected by SENTINEL
            <span className="text-sentinel-accent cursor-pointer">How it works →</span>
          </div>
          <button
            onClick={handleContinue}
            disabled={!selectedRecipient || !amount || parseFloat(amount.toString()) <= 0 || !purpose}
            className="w-full py-4 rounded-2xl bg-sentinel-900 text-white font-bold text-[17px] active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100 shadow-md"
          >
            Pay {amount ? `₹${parseFloat(amount.toString()).toLocaleString('en-IN')}` : ''}
          </button>
        </div>

      </main>
      
      <UpiPinModal 
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        amount={typeof amount === 'string' ? parseFloat(amount) || 0 : amount}
        recipientName={selectedRecipient?.name || ''}
        onSuccess={() => {
          setIsPinModalOpen(false);
          const numericAmount = typeof amount === 'string' ? parseFloat(amount) || 0 : amount;
          onInitiatePayment(selectedRecipient!, numericAmount, purpose || 'Transfer', method);
        }}
      />
    </div>
  );
};
