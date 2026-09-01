import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AppShell } from './components/layout/AppShell';
import { ToastContainer, ToastMessage } from './components/common/Toast';
import { ScanQrModal } from './components/common/ScanQrModal';
import { TrustedContactModal } from './components/common/TrustedContactModal';
import { BottomNavigation } from './components/layout/BottomNavigation';
import { VerifyRecipientModal } from './components/common/VerifyRecipientModal';
import { TransactionDetailModal } from './components/common/TransactionDetailModal';
import { TapToPayModal } from './components/common/TapToPayModal';
import { VoicePaymentModal } from './components/common/VoicePaymentModal';
import { BillSplitModal } from './components/common/BillSplitModal';
import { BillsModal } from './components/common/BillsModal';
import { CheckBalanceModal } from './components/common/CheckBalanceModal';
import { SelfTransferModal } from './components/common/SelfTransferModal';
import { StatementModal } from './components/common/StatementModal';
import { DigitalGoldModal } from './components/common/DigitalGoldModal';
import { DisputeModal } from './components/common/DisputeModal';
import { FamilyWalletModal } from './components/common/FamilyWalletModal';
import { AIRoundUpModal } from './components/common/AIRoundUpModal';

// Screens
import { LandingScreen } from './pages/LandingScreen';
import { HomeScreen } from './pages/HomeScreen';
import { PayScreen } from './pages/PayScreen';
import { SentinelCheckScreen } from './pages/SentinelCheckScreen';
import { PauseBeforePayScreen } from './pages/PauseBeforePayScreen';
import { ExplainRiskScreen } from './pages/ExplainRiskScreen';
import { SafeCheckScreen } from './pages/SafeCheckScreen';
import { ScamAnalyzerScreen } from './pages/ScamAnalyzerScreen';
import { ProtectScreen } from './pages/ProtectScreen';
import { ScamIncidentScreen } from './pages/ScamIncidentScreen';
import { PaymentReceiptScreen } from './pages/PaymentReceiptScreen';
import { ProfileScreen } from './pages/ProfileScreen';
import { BusinessDashboardScreen } from './pages/BusinessDashboardScreen';
import { BusinessCaseDetailsScreen } from './pages/BusinessCaseDetailsScreen';
import { SafetyHistoryScreen } from './pages/SafetyHistoryScreen';
import { AskSentinelScreen } from './pages/AskSentinelScreen';
import { InsightsScreen } from './pages/InsightsScreen';
import { RewardsScreen } from './pages/RewardsScreen';
import { SubscriptionsScreen } from './pages/SubscriptionsScreen';
import { GroupVaultsScreen } from './pages/GroupVaultsScreen';

// Types & Data
import {
 NavigationTab,
 PaymentTransaction,
 Recipient,
 PaymentMethod,
 RiskAssessment,
 UserProfile,
} from './types';
import { fetchUserProfile, fetchPayments, fetchRecipients, updateUserProfile } from './utils/api';
import { evaluatePaymentRisk } from './utils/riskEngine';

const savePaymentToDb = async (tx: PaymentTransaction) => {
  try {
    await fetch('http://localhost:5000/api/payments', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-Device-Id': 'global-demo-device'
      },
      body: JSON.stringify({
        amount: tx.amount,
        purpose: tx.purpose,
        purposeCategory: tx.purposeCategory,
        paymentMethod: tx.paymentMethod,
        recipientId: tx.recipient?.id,
        recipientUpi: tx.recipient?.upiId,
        recipientName: tx.recipient?.name,
        riskAssessment: tx.riskAssessment,
      })
    });
  } catch (e) {
    console.warn('Could not save payment to DB:', e);
  }
};

type ActiveView =
 | 'landing'
 | 'home'
 | 'pay'
 | 'sentinel_check'
 | 'pause_before_pay'
 | 'explain_risk'
 | 'safecheck'
 | 'scam_analyzer'
 | 'protect'
 | 'scam_incident'
 | 'payment_receipt'
 | 'profile'
 | 'business_dashboard'
 | 'business_case_details'
 | 'safety_history'
 | 'ask_sentinel'
 | 'insights'
 | 'rewards'
 | 'subscriptions'
 | 'vaults';

export function App() {
 // Navigation & Shell State
 const [activeTab, setActiveTab] = useState<NavigationTab>('home');
 const [activeView, setActiveView] = useState<ActiveView>('landing');

 // User & Transactions State
 const [user, setUser] = useState<UserProfile | null>(null);
 const [payments, setPayments] = useState<PaymentTransaction[]>([]);
 const [recipients, setRecipients] = useState<Recipient[]>([]);
 const [loading, setLoading] = useState(true);
 const [loadError, setLoadError] = useState(false);

 // Active Transaction in Progress
 const [activeRecipient, setActiveRecipient] = useState<Recipient | null>(null);
 const [activeAmount, setActiveAmount] = useState<number>(0);
 const [activePurpose, setActivePurpose] = useState<string>('');
 const [activeMethod, setActiveMethod] = useState<PaymentMethod>('upi');
 const [activeCurrency, setActiveCurrency] = useState<{currency: string, foreignAmount: number, exchangeRate: number} | null>(null);
 const [activeRiskAssessment, setActiveRiskAssessment] = useState<RiskAssessment | null>(null);
 const [lastCompletedTx, setLastCompletedTx] = useState<PaymentTransaction | null>(null);

 // Selected past transaction for detail modal or reporting
 const [inspectedTx, setInspectedTx] = useState<PaymentTransaction | null>(null);
 const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

 // Modals State
 const [isScanQrOpen, setIsScanQrOpen] = useState(false);
 const [isTrustedContactOpen, setIsTrustedContactOpen] = useState(false);
 const [isVerifyRecipientOpen, setIsVerifyRecipientOpen] = useState(false);
 const [isTxDetailOpen, setIsTxDetailOpen] = useState(false);
 const [isTapToPayOpen, setIsTapToPayOpen] = useState(false);
 const [isVoicePaymentOpen, setIsVoicePaymentOpen] = useState(false);
 const [isBillSplitOpen, setIsBillSplitOpen] = useState(false);
 const [isBillsOpen, setIsBillsOpen] = useState(false);
 const [isCheckBalanceOpen, setIsCheckBalanceOpen] = useState(false);
 const [isSelfTransferOpen, setIsSelfTransferOpen] = useState(false);
 const [isStatementOpen, setIsStatementOpen] = useState(false);
 const [isDigitalGoldOpen, setIsDigitalGoldOpen] = useState(false);
 const [isDisputeOpen, setIsDisputeOpen] = useState(false);
 const [isFamilyModalOpen, setIsFamilyModalOpen] = useState(false);
 const [isAiRoundUpOpen, setIsAiRoundUpOpen] = useState(false);

 useEffect(() => {
  async function loadData() {
   setLoadError(false);
   try {
    const minSplashTime = new Promise(resolve => setTimeout(resolve, 2200));
    const dataPromise = Promise.all([
      fetchUserProfile(),
      fetchPayments(),
      fetchRecipients(),
    ]);

    const [, [userData, paymentsData, recipientsData]] = await Promise.all([
      minSplashTime,
      dataPromise
    ]);
    
    setUser(userData);
    setPayments(paymentsData);
    setRecipients(recipientsData);
    if (recipientsData.length > 0) {
    setActiveRecipient(recipientsData[0]);
    }
   } catch (error) {
    console.error('Error loading data:', error);
    setLoadError(true);
   } finally {
    setLoading(false);
   }
  }
  loadData();
  }, []);

 

 // Toasts
 const [toasts, setToasts] = useState<ToastMessage[]>([]);

 const addToast = (type: ToastMessage['type'], title: string, description?: string) => {
 const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
 setToasts((prev) => [...prev, { id, type, title, description }]);
 setTimeout(() => {
 setToasts((prev) => prev.filter((t) => t.id !== id));
 }, 3800);
 };

 const removeToast = (id: string) => {
 setToasts((prev) => prev.filter((t) => t.id !== id));
 };

 // Tab Navigation Handler
 const handleTabChange = (tab: NavigationTab) => {
 setActiveTab(tab);
 if (tab === 'home') setActiveView('home');
    if (tab === 'pay') {
      setActiveRecipient(null);
      setActiveAmount(0);
      setActivePurpose('');
      setActiveCurrency(null);
      setActiveView('pay');
    }
 if (tab === 'safecheck') setActiveView('safecheck');
 if (tab === 'protect') setActiveView('protect');
 if (tab === 'profile') setActiveView('profile');
 if (tab === 'business_dashboard') setActiveView('business_dashboard');
 if (tab === 'insights') setActiveView('insights');
 };

 // Initiate Payment from Pay Screen
 const handleInitiatePayment = (
    recipient: Recipient, 
    initialAmount: number = 0, 
    initialPurpose: string = '', 
    method: PaymentMethod = 'upi',
    currencyData: {currency: string, foreignAmount: number, exchangeRate: number} | null = null
  ) => {
    setActiveRecipient(recipient);
    setActiveAmount(initialAmount);
    setActivePurpose(initialPurpose);
    setActiveMethod(method);
    setActiveCurrency(currencyData);

    // Run AI Risk Evaluation
    const assessment = evaluatePaymentRisk(recipient, initialAmount, initialPurpose);
    setActiveRiskAssessment(assessment);

    // Transition to Screen 3: SENTINEL Safety Check
    setActiveView('sentinel_check');
 };

 // Complete SENTINEL Check Screen
 const handleCheckComplete = (assessment: RiskAssessment) => {
 if (assessment.decision === 'pause' || assessment.decision === 'verify') {
  // Save flagged transaction to DB so it shows in Risk Feed & Review Queue
  const flaggedTx: PaymentTransaction = {
  id: `tx-${Date.now()}`,
  recipient: activeRecipient!,
  amount: activeAmount,
  purpose: activePurpose,
  purposeCategory: 'General Transfer',
  paymentMethod: activeMethod,
  timestamp: new Date().toISOString(),
  formattedDate: 'Just now',
  status: 'paused',
  transactionRef: `SENT-${Date.now().toString().slice(-6)}`,
  riskAssessment: assessment,
  };
  savePaymentToDb(flaggedTx);
  // Transition to Screen 4: PAUSE BEFORE PAY
  setActiveView('pause_before_pay');
 } else {
  // Safe payment: Deduct balance, append payment, show Receipt
  const newTx: PaymentTransaction = {
  id: `tx-${Date.now()}`,
  recipient: activeRecipient!,
  amount: activeAmount,
  purpose: activePurpose,
  purposeCategory: 'General Transfer',
  paymentMethod: activeMethod,
  timestamp: new Date().toISOString(),
  formattedDate: 'Just now',
  status: 'completed',
  transactionRef: `SENT-${Date.now().toString().slice(-6)}`,
  riskAssessment: assessment,
  };

  savePaymentToDb(newTx);
  setUser((prev) => {
  if (!prev) return prev;
  return {
  ...prev,
  balance: Math.max(0, prev.balance - activeAmount),
  stats: {
  ...prev.stats,
  safePaymentsCount: prev.stats.safePaymentsCount + 1,
  },
  };
  });
  setPayments((prev) => [newTx, ...prev]);
  setLastCompletedTx(newTx);
  setActiveView('payment_receipt');
 }
 };

 // Cancel Payment Flow
 const handleCancelPayment = () => {
 addToast(
 'success',
 'Payment Cancelled Safely',
 `Transfer of ₹${activeAmount.toLocaleString('en-IN')} to ${activeRecipient?.name || 'Unknown'} was stopped.`
 );
 setUser((prev) => {
 if (!prev) return prev;
 return {
 ...prev,
 stats: {
 ...prev.stats,
 scamsPrevented: prev.stats.scamsPrevented + 1,
 amountSaved: prev.stats.amountSaved + activeAmount,
 },
 };
 });
 setActiveTab('home');
 setActiveView('home');
 };

 // Override Proceed Anyway Flow
 const handleProceedAnyway = () => {
 const newTx: PaymentTransaction = {
 id: `tx-${Date.now()}`,
 recipient: activeRecipient!,
 amount: activeAmount,
 purpose: activePurpose,
 purposeCategory: 'Job Application / Registration Fee',
 paymentMethod: activeMethod,
 timestamp: new Date().toISOString(),
 formattedDate: 'Just now',
 status: 'flagged',
 transactionRef: `SENT-OVERRIDE-${Date.now().toString().slice(-6)}`,
 riskAssessment: activeRiskAssessment!,
 note: 'User bypassed SENTINEL Pause intervention after risk acknowledgment.',
 };

 setUser((prev) => {
 if (!prev) return prev;
 return {
 ...prev,
 balance: Math.max(0, prev.balance - activeAmount),
 };
 });
 setPayments((prev) => [newTx, ...prev]);
 setLastCompletedTx(newTx);
 addToast(
 'warning',
 'Payment Executed with High-Risk Override',
 'Transaction was logged and flagged in your Safety History.'
 );
 setActiveView('payment_receipt');
 };

  if (loading) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-black">
      <AppShell isDeviceFrame={false}>
        <motion.div 
          className="absolute inset-0 z-50 bg-[#5f259f] flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            initial={{ scale: 0.6, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 100, delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <div className="bg-white p-4 rounded-3xl flex items-center justify-center shadow-2xl relative overflow-hidden">
              <img src="/logo.png" alt="SenPay Logo" className="h-20 w-auto object-contain" />
            </div>
          </motion.div>
        </motion.div>
      </AppShell>
    </div>
  );
  }

 if (loadError || !user) {
 return (
  <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white gap-4">
  <p className="text-rose-400 font-semibold">Could not connect to server.</p>
  <p className="text-slate-400 text-sm">Make sure the backend is running, then tap Retry.</p>
  <button
   onClick={() => { setLoading(true); setLoadError(false); setTimeout(() => window.location.reload(), 100); }}
   className="mt-2 px-6 py-2 bg-indigo-600 rounded-full text-white font-bold"
  >Retry</button>
  </div>
 );
 }

 return (
 <div className="min-h-screen w-full flex flex-col items-center bg-black">
 {/* Toast Notifications */}
 <ToastContainer toasts={toasts} onDismiss={removeToast} />

 {/* Main Apple Application Shell */}
 <AppShell isDeviceFrame={false}>
 <AnimatePresence mode="wait">
 {/* SCREEN 0: LANDING */}
 {activeView === 'landing' && (
 <LandingScreen
 key="landing"
 onStartDemo={() => setActiveView('home')}
 />
 )}

 {/* SCREEN 1: HOME */}
 {activeView === 'home' && (
 <HomeScreen
 key="home"
 user={user}
 recentPayments={payments.slice(0, 4)}
 onNavigate={handleTabChange}
 onPayQuick={() => {
 setActiveRecipient(null);
 setActiveAmount(0);
 setActivePurpose('');
 setActiveCurrency(null);
 setActiveTab('pay');
 setActiveView('pay');
 }}
 onScanClick={() => setIsScanQrOpen(true)}
 onSelectTransaction={(tx) => {
 setInspectedTx(tx);
 setIsTxDetailOpen(true);
 }}
 onOpenProfile={() => {
 setActiveTab('profile');
 setActiveView('profile');
 }}
 onOpenSafeCheck={() => {
 setActiveTab('safecheck');
 setActiveView('safecheck');
 }}
 onOpenProtect={() => {
 setActiveTab('protect');
 setActiveView('protect');
 }}
 onOpenBusiness={() => setActiveView('business_dashboard')}
 onOpenAskSentinel={() => setActiveView('ask_sentinel')}
 onRequestClick={() => addToast('info', 'Coming Soon', 'Payment requests will be available in the next release.')}
 onViewActivityClick={() => addToast('info', 'Coming Soon', 'Full transaction history is coming soon.')}
 onTapToPayClick={() => setIsTapToPayOpen(true)}
 onVoicePaymentClick={() => setIsVoicePaymentOpen(true)}
 onSplitBillClick={() => setIsBillSplitOpen(true)}
 onBillsClick={() => setIsBillsOpen(true)}
 onCheckBalanceClick={() => setIsCheckBalanceOpen(true)}
 onSelfTransferClick={() => setIsSelfTransferOpen(true)}
 onRewardsClick={() => setActiveView('rewards')}
 onDownloadStatementClick={() => setIsStatementOpen(true)}
 onAutoPayClick={() => setActiveView('subscriptions')}
 onDigitalGoldClick={() => setIsDigitalGoldOpen(true)}
 onVaultsClick={() => setActiveView('vaults')}
 onAiRoundUpsClick={() => setIsAiRoundUpOpen(true)}
 />
 )}

 {/* SCREEN 2: PAY */}
 {activeView === 'pay' && (
 <PayScreen
 key="pay_screen"
 recipients={recipients}
 initialRecipientUpi={activeRecipient?.upiId || ''}
 initialAmount={activeAmount}
 initialPurpose={activePurpose}
 method={activeMethod}
 currencyData={activeCurrency}
 onInitiatePayment={handleInitiatePayment}
 onScanQR={() => setIsScanQrOpen(true)}
 onBack={() => {
 setActiveTab('home');
 setActiveView('home');
 }}
 />
 )}

 {/* SCREEN 3: SENTINEL CHECKING */}
 {activeView === 'sentinel_check' && activeRecipient && activeRiskAssessment && (
 <SentinelCheckScreen
 key="sentinel_check"
 recipient={activeRecipient}
 amount={activeAmount}
 purpose={activePurpose}
 riskAssessment={activeRiskAssessment}
 onCheckComplete={handleCheckComplete}
 />
 )}

 {/* SCREEN 4: PAUSE BEFORE PAY (SIGNATURE SCREEN) */}
 {activeView === 'pause_before_pay' && activeRecipient && activeRiskAssessment && (
 <PauseBeforePayScreen
 key="pause_before_pay"
 recipient={activeRecipient}
 amount={activeAmount}
 purpose={activePurpose}
 riskAssessment={activeRiskAssessment}
 seniorSafetyMode={user.seniorSafetyMode}
 onVerifyRecipient={() => setIsVerifyRecipientOpen(true)}
 onAskTrustedContact={() => setIsTrustedContactOpen(true)}
 onCancelPayment={handleCancelPayment}
 onExplainRisk={() => setActiveView('explain_risk')}
 onProceedAnyway={handleProceedAnyway}
 />
 )}

 {/* SCREEN 5: EXPLAIN MY RISK */}
 {activeView === 'explain_risk' && activeRecipient && activeRiskAssessment && (
 <ExplainRiskScreen
 key="explain_risk"
 recipient={activeRecipient}
 amount={activeAmount}
 purpose={activePurpose}
 riskAssessment={activeRiskAssessment}
 onBackToPause={() => setActiveView('pause_before_pay')}
 onCancelPayment={handleCancelPayment}
 />
 )}

 {/* SCREEN 6: SAFECHECK */}
 {activeView === 'safecheck' && (
 <SafeCheckScreen
 key="safecheck"
 onOpenMessageAnalyzer={() => setActiveView('scam_analyzer')}
 onScanQR={() => setIsScanQrOpen(true)}
 onBack={() => {
 setActiveTab('home');
 setActiveView('home');
 }}
 />
 )}

 {/* SCREEN 7: SCAM MESSAGE ANALYZER */}
 {activeView === 'scam_analyzer' && (
 <ScamAnalyzerScreen
 key="scam_analyzer"
 onBack={() => {
 setActiveView('safecheck');
 }}
 />
 )}

 {/* SCREEN 8: PROTECT */}
 {activeView === 'protect' && (
 <ProtectScreen
 key="protect"
 user={user}
 onOpenIncidentWorkflow={() => setActiveView('scam_incident')}
 onOpenTrustedContacts={() => setIsTrustedContactOpen(true)}
 onOpenSafetyHistory={() => {
 setActiveView('safety_history');
 }}
 onOpenScamShield={() => {
 addToast('success', 'Scam Shield Active', 'Continuous background heuristics active.');
 }}
 onBack={() => {
 setActiveTab('home');
 setActiveView('home');
 }}
 />
 )}

 {/* SCREEN 9: I THINK I GOT SCAMMED (INCIDENT GUIDE) */}
 {activeView === 'scam_incident' && (
 <ScamIncidentScreen
 key="scam_incident"
 recentPayments={payments}
 initialSelectedTransaction={inspectedTx}
 onBack={() => {
 setActiveTab('protect');
 setActiveView('protect');
 }}
 />
 )}

 {/* SCREEN 10: PAYMENT RECEIPT */}
 {activeView === 'payment_receipt' && (lastCompletedTx || activeRecipient) && (
 <PaymentReceiptScreen
 key="payment_receipt"
 recipient={lastCompletedTx?.recipient || activeRecipient!}
 amount={lastCompletedTx?.amount || activeAmount}
 purpose={lastCompletedTx?.purpose || activePurpose}
 transactionRef={lastCompletedTx?.transactionRef}
 onDone={() => {
 setActiveTab('home');
 setActiveView('home');
 }}
 onShare={() => addToast('success', 'Shared successfully', 'Receipt shared to your network.')}
 onSave={() => addToast('success', 'Saved to device', 'Receipt saved to your gallery.')}
 />
 )}

 {/* SCREEN 11: PROFILE */}
 {activeView === 'profile' && (
 <ProfileScreen
 key="profile"
 user={user}
 onUpdateUser={async (updated) => {
    // Optimistic local update to preserve frontend-only states
    setUser(prev => prev ? { ...prev, ...updated } : null);
    try {
      await updateUserProfile(updated);
    } catch (e) {
      console.error("Failed to sync user profile to backend:", e);
    }
    if (updated.protectionActive !== undefined) {
      addToast(
        updated.protectionActive ? 'success' : 'warning',
        updated.protectionActive ? 'SENTINEL Protection Active' : 'Protection Paused'
      );
    }
 }}
 onOpenTrustedContactsModal={() => setIsTrustedContactOpen(true)}
 onOpenFamilyModal={() => setIsFamilyModalOpen(true)}
 onBack={() => {
 setActiveTab('home');
 setActiveView('home');
 }}
 />
 )}

 {/* SCREEN 12: BUSINESS DASHBOARD */}
 {activeView === 'business_dashboard' && (
 <BusinessDashboardScreen
 key="business_dashboard"
 onViewCase={(id) => {
 setSelectedCaseId(id);
 setActiveView('business_case_details');
 }}
 onBack={() => {
 setActiveTab('home');
 setActiveView('home');
 }}
 />
 )}

 {/* SCREEN 12.5: BUSINESS CASE DETAILS */}
 {activeView === 'business_case_details' && selectedCaseId && (
 <BusinessCaseDetailsScreen
 key="business_case_details"
 caseId={selectedCaseId}
 onBack={() => {
 setActiveView('business_dashboard');
 }}
 />
 )}

 {/* SCREEN 13: SAFETY HISTORY */}
 {activeView === 'safety_history' && (
 <SafetyHistoryScreen
 key="safety_history"
 transactions={payments}
 onBack={() => {
 setActiveTab('protect');
 setActiveView('protect');
 }}
 />
 )}

 {/* SCREEN 14: ASK SENTINEL */}
 {activeView === 'ask_sentinel' && (
 <AskSentinelScreen
 key="ask_sentinel"
 onBack={() => {
 setActiveTab('home');
 setActiveView('home');
 }}
 />
 )}

 {/* SCREEN 15: INSIGHTS */}
 {activeView === 'insights' && (
 <InsightsScreen
 key="insights"
 onBack={() => setActiveView('home')}
 />
 )}

 {/* SCREEN 16: REWARDS */}
 {activeView === 'rewards' && (
 <RewardsScreen
 key="rewards"
 onBack={() => setActiveView('home')}
 onClaimReward={(amount) => {
 setUser(prev => {
 if (!prev) return prev;
 return { ...prev, balance: prev.balance + amount };
 });
 }}
 />
 )}

 {/* SCREEN 17: SUBSCRIPTIONS (Auto-Pay) */}
 {activeView === 'subscriptions' && (
 <SubscriptionsScreen
 key="subscriptions"
 onBack={() => setActiveView('home')}
 />
 )}

 {/* SCREEN 18: GROUP VAULTS */}
 {activeView === 'vaults' && (
 <GroupVaultsScreen
 key="vaults"
 onBack={() => setActiveView('home')}
 />
 )}
 </AnimatePresence>
 <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
 </AppShell>

 {/* Modals & Overlays */}
 <TapToPayModal 
   isOpen={isTapToPayOpen} 
   onClose={() => setIsTapToPayOpen(false)} 
 />

 <VoicePaymentModal 
   isOpen={isVoicePaymentOpen} 
   onClose={() => setIsVoicePaymentOpen(false)}
   onParseComplete={(amt, purp) => {
     setIsVoicePaymentOpen(false);
     setActiveAmount(amt);
     setActivePurpose(purp);
     setActiveTab('pay');
     setActiveView('pay');
   }}
 />

 <BillSplitModal 
   isOpen={isBillSplitOpen}
   onClose={() => setIsBillSplitOpen(false)}
   onSplitComplete={(total, count) => {
     setIsBillSplitOpen(false);
     const splitAmt = Math.round(total / count);
     setActiveAmount(splitAmt);
     setActivePurpose('Dinner Split');
     addToast('success', 'Bill Split', `Requesting ₹${splitAmt} from ${count} friends.`);
   }}
 />

 <BillsModal
   isOpen={isBillsOpen}
   onClose={() => setIsBillsOpen(false)}
   onPayBill={(amount, purpose) => {
     setIsBillsOpen(false);
     setActiveAmount(amount);
     setActivePurpose(purpose);
     setActiveTab('pay');
     setActiveView('pay');
   }}
 />

 <CheckBalanceModal
   isOpen={isCheckBalanceOpen}
   onClose={() => setIsCheckBalanceOpen(false)}
 />

 <SelfTransferModal
   isOpen={isSelfTransferOpen}
   onClose={() => setIsSelfTransferOpen(false)}
   onInitiateTransfer={(amount, fromAccount, toAccount) => {
     setIsSelfTransferOpen(false);
     setUser(prev => {
       if (!prev) return prev;
       return {
         ...prev,
         balance: prev.balance + amount // Simulating a transfer TO the primary account
       };
     });
     addToast('success', 'Self Transfer', `Transferred ₹${amount} from ${fromAccount} to ${toAccount}`);
   }}
 />

 <StatementModal
   isOpen={isStatementOpen}
   onClose={() => setIsStatementOpen(false)}
 />

 <DigitalGoldModal
   isOpen={isDigitalGoldOpen}
   onClose={() => setIsDigitalGoldOpen(false)}
   onBuyGold={(amount) => {
     setIsDigitalGoldOpen(false);
     addToast('success', 'Digital Gold', `Successfully purchased ₹${amount} of 24K Gold!`);
     // Deduct from balance
     setUser(prev => {
       if (!prev) return prev;
       return { ...prev, balance: prev.balance - amount };
     });
   }}
 />

 <DisputeModal
   isOpen={isDisputeOpen}
   onClose={() => setIsDisputeOpen(false)}
   transaction={inspectedTx}
 />

 <FamilyWalletModal
   isOpen={isFamilyModalOpen}
   onClose={() => setIsFamilyModalOpen(false)}
   onSave={(rules) => {
     setIsFamilyModalOpen(false);
     addToast('success', 'Family UI Updated', `Saved new rules. Gaming block: ${rules.blockGaming ? 'On' : 'Off'}`);
   }}
 />

 <AIRoundUpModal
   isOpen={isAiRoundUpOpen}
   onClose={() => setIsAiRoundUpOpen(false)}
 />

 <ScanQrModal
 isOpen={isScanQrOpen}
 onClose={() => setIsScanQrOpen(false)}
 user={user}
 onScanComplete={(qrData) => {
 const scannedName = qrData.name && qrData.name !== 'Unknown Recipient' && qrData.name !== 'External QR Link' && qrData.name !== 'Unknown Text QR'
 ? qrData.name
 : qrData.recipientUpi.split('@')[0];
          handleInitiatePayment(
            {
              id: `qr-${Date.now()}`,
              name: scannedName,
              upiId: qrData.recipientUpi,
              initials: scannedName.charAt(0),
              isKnown: false,
              previousPaymentsCount: 0,
              totalTransferred: 0,
              trustScore: 40,
              category: 'Merchant'
            },
            qrData.amount || 0,
            qrData.purpose || 'Retail Purchase',
            'qr',
            qrData.currency ? {
              currency: qrData.currency,
              foreignAmount: qrData.foreignAmount || 0,
              exchangeRate: qrData.exchangeRate || 1
            } : null
          );
 }}
 />

 {/* 2. Trusted Contact Modal */}
 <TrustedContactModal
 isOpen={isTrustedContactOpen}
 onClose={() => setIsTrustedContactOpen(false)}
 contacts={user.trustedContacts}
 paymentDetails={{
 amount: activeAmount,
 recipientName: activeRecipient?.name || 'Unknown',
 purpose: activePurpose,
 }}
 onSent={(contactName) => {
 addToast(
 'success',
 'Verification Sent',
 `Summary link sent to ${contactName} for review.`
 );
 }}
 />

 {/* 3. Verify Recipient Modal */}
 {activeRecipient && (
 <VerifyRecipientModal
 isOpen={isVerifyRecipientOpen}
 onClose={() => setIsVerifyRecipientOpen(false)}
 recipient={activeRecipient}
 onCancelPayment={handleCancelPayment}
 />
 )}

 {/* 4. Past Transaction Detail Modal */}
 <TransactionDetailModal
 isOpen={isTxDetailOpen}
 onClose={() => setIsTxDetailOpen(false)}
 transaction={inspectedTx}
 onReportScam={() => {
   setActiveTab('protect');
   setActiveView('scam_incident');
   setIsTxDetailOpen(false);
 }}
 onDispute={() => {
   setIsDisputeOpen(true);
   setIsTxDetailOpen(false);
 }}
 />
 </div>
 );
}

export default App;
