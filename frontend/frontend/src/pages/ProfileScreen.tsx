import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Shield,
  Users,
  Lock,
  Sparkles,
  ChevronRight,
  Info,
  Sliders,
  FileCheck2,
  HeartHandshake,
  ArrowLeft,
  Key,
  Globe2,
  Baby,
} from 'lucide-react';
import { Modal } from '../components/common/Modal';
import { SecurityScoreRing } from '../components/common/SecurityScoreRing';
import { BurnerUpiModal } from '../components/common/BurnerUpiModal';
import { UserProfile } from '../types';
import { haptics } from '../utils/haptics';

interface ProfileScreenProps {
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onOpenTrustedContactsModal: () => void;
  onOpenFamilyModal: () => void;
  onBack: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  onUpdateUser,
  onOpenTrustedContactsModal,
  onOpenFamilyModal,
  onBack,
}) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [isBurnerModalOpen, setIsBurnerModalOpen] = useState(false);

  const toggleProtection = () => {
    haptics.medium();
    onUpdateUser({ protectionActive: !user.protectionActive });
  };

  const toggleSeniorSafety = () => {
    haptics.medium();
    onUpdateUser({ seniorSafetyMode: !user.seniorSafetyMode });
  };

  const toggleGlobalMode = () => {
    haptics.medium();
    onUpdateUser({ globalModeEnabled: !user.globalModeEnabled });
  };

  const toggleFamilyUI = () => {
    haptics.medium();
    onUpdateUser({ familyUIEnabled: !user.familyUIEnabled });
  };

  return (
    <div className="min-h-screen bg-surface-bg flex flex-col font-apple pb-12">
      {/* Profile Header */}
      <div className="px-5 pt-6 pb-4 flex items-center bg-white sticky top-0 z-10 border-b border-gray-100">
        <button onClick={() => { haptics.light(); onBack(); }} className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:scale-95 transition-all">
          <ArrowLeft className="w-6 h-6 text-ink-primary" />
        </button>
        <h1 className="flex-1 text-center font-bold text-[17px] text-ink-primary pr-8">Profile</h1>
      </div>

      <main className="flex-1 p-5 max-w-md w-full mx-auto space-y-6">
        {/* User Info & Score */}
        <div className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-16 h-16 rounded-full object-cover shadow-sm"
              />
              <div>
                <h1 className="font-bold text-[20px] text-ink-primary tracking-tight leading-tight">{user.name}</h1>
                <p className="text-[14px] text-ink-secondary mt-0.5">{user.upiId}</p>
                <p className="text-[14px] text-ink-secondary">{user.phone}</p>
              </div>
            </div>
            
            <div className="shrink-0 pl-4 border-l border-gray-100">
              <SecurityScoreRing score={user.securityScore} size={80} strokeWidth={8} />
            </div>
          </div>
        </div>

        {/* SECTION 1: Protection */}
        <div className="space-y-2">
          <span className="text-[13px] font-bold text-ink-secondary uppercase tracking-wider px-1">
            Protection Status
          </span>
          <div className="bg-white p-4 rounded-[20px] shadow-sm border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                  user.protectionActive
                    ? 'bg-green-50 text-sentinel-success'
                    : 'bg-rose-50 text-rose-600'
                }`}
              >
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-[15px] text-ink-primary">
                  SENTINEL — {user.protectionActive ? 'Active' : 'Paused'}
                </p>
                <p className="text-[13px] text-ink-secondary mt-0.5">
                  Real-time scanning on transfers
                </p>
              </div>
            </div>

            <button
              onClick={toggleProtection}
              className={`w-14 h-8 rounded-full p-1 transition-colors duration-200 flex items-center shrink-0 ${
                user.protectionActive ? 'bg-sentinel-success' : 'bg-gray-300'
              }`}
            >
              <motion.div
                layout
                className={`w-6 h-6 rounded-full bg-white shadow-md ${
                  user.protectionActive ? 'ml-auto' : 'mr-auto'
                }`}
              />
            </button>
          </div>
        </div>

        {/* SECTION 2: Safety */}
        <div className="space-y-2">
          <span className="text-[13px] font-bold text-ink-secondary uppercase tracking-wider px-1">
            Safety Controls
          </span>

          <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 divide-y divide-gray-100 overflow-hidden">
            {/* Trusted Contacts */}
            <button
              onClick={() => { haptics.light(); onOpenTrustedContactsModal(); }}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-bold text-[15px] text-ink-primary">Trusted Contacts</p>
                  <p className="text-[13px] text-ink-secondary">
                    {user.trustedContacts.length} family members connected
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-ink-faint" />
            </button>

            {/* Senior Safety Mode */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <HeartHandshake className="w-5 h-5 text-indigo-600" />
                <div>
                  <p className="font-bold text-[15px] text-ink-primary">Senior Safety Mode</p>
                  <p className="text-[13px] text-ink-secondary">
                    Enforces 10s pause on transfers &gt;₹3,000
                  </p>
                </div>
              </div>
              <button
                onClick={toggleSeniorSafety}
                className={`w-14 h-8 rounded-full p-1 transition-colors duration-200 flex items-center shrink-0 ${
                  user.seniorSafetyMode ? 'bg-sentinel-900' : 'bg-gray-300'
                }`}
              >
                <motion.div
                  layout
                  className={`w-6 h-6 rounded-full bg-white shadow-md ${
                    user.seniorSafetyMode ? 'ml-auto' : 'mr-auto'
                  }`}
                />
              </button>
            </div>

            {/* Global Mode */}
            <div className="p-4 flex items-center justify-between border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Globe2 className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-bold text-[15px] text-ink-primary">Global UPI Mode</p>
                  <p className="text-[13px] text-ink-secondary">
                    Enable international QR payments
                  </p>
                </div>
              </div>
              <button
                onClick={toggleGlobalMode}
                className={`w-14 h-8 rounded-full p-1 transition-colors duration-200 flex items-center shrink-0 ${
                  user.globalModeEnabled ? 'bg-sentinel-900' : 'bg-gray-300'
                }`}
              >
                <motion.div
                  layout
                  className={`w-6 h-6 rounded-full bg-white shadow-md ${
                    user.globalModeEnabled ? 'ml-auto' : 'mr-auto'
                  }`}
                />
              </button>
            </div>

            {/* Family UI */}
            <div className="p-4 flex items-center justify-between border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Baby className="w-5 h-5 text-pink-500" />
                <div>
                  <p className="font-bold text-[15px] text-ink-primary">Family / Teen UI</p>
                  <p className="text-[13px] text-ink-secondary">
                    Enable parental controls & spending limits
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  haptics.light();
                  if (!user.familyUIEnabled) {
                    onUpdateUser({ familyUIEnabled: true });
                  }
                  onOpenFamilyModal();
                }}
                className={`w-20 h-8 rounded-full transition-colors duration-200 flex items-center justify-center shrink-0 text-xs font-bold ${
                  user.familyUIEnabled ? 'bg-sentinel-900 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {user.familyUIEnabled ? 'Configure' : 'Enable'}
              </button>
            </div>

            {/* Burner UPI ID */}
            <button
              onClick={() => { haptics.light(); setIsBurnerModalOpen(true); }}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <Key className="w-5 h-5 text-indigo-600" />
                <div>
                  <p className="font-bold text-[15px] text-ink-primary">Burner UPI ID</p>
                  <p className="text-[13px] text-ink-secondary">Generate temporary IDs</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-ink-faint" />
            </button>

            {/* Protection Preferences */}
            <button
              onClick={() => { haptics.light(); setActiveModal('preferences'); }}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <Sliders className="w-5 h-5 text-ink-secondary" />
                <div>
                  <p className="font-bold text-[15px] text-ink-primary">Protection Preferences</p>
                  <p className="text-[13px] text-ink-secondary">
                    Friction level: Proportional intervention
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-ink-faint" />
            </button>
          </div>
        </div>

        {/* SECTION 3: Privacy */}
        <div className="space-y-2">
          <span className="text-[13px] font-bold text-ink-secondary uppercase tracking-wider px-1">
            Privacy & Security
          </span>

          <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 divide-y divide-gray-100 overflow-hidden">
            <button
              onClick={() => { haptics.light(); setActiveModal('privacy'); }}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="font-bold text-[15px] text-ink-primary">Data & Privacy</p>
                  <p className="text-[13px] text-ink-secondary">Zero raw SMS logs stored</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-ink-faint" />
            </button>

            <button
              onClick={() => { haptics.light(); setActiveModal('consent'); }}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <FileCheck2 className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-bold text-[15px] text-ink-primary">Consent Management</p>
                  <p className="text-[13px] text-ink-secondary">Revocable permissions</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-ink-faint" />
            </button>
          </div>
        </div>

        {/* SECTION 4: About */}
        <div className="space-y-2">
          <span className="text-[13px] font-bold text-ink-secondary uppercase tracking-wider px-1">
            About SENTINEL
          </span>

          <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 divide-y divide-gray-100 overflow-hidden">
            <button
              onClick={() => { haptics.light(); setActiveModal('how-it-works'); }}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <Info className="w-5 h-5 text-indigo-600" />
                <div>
                  <p className="font-bold text-[15px] text-ink-primary">How SENTINEL works</p>
                  <p className="text-[13px] text-ink-secondary">Proportional friction model</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-ink-faint" />
            </button>

            <button
              onClick={() => { haptics.light(); setActiveModal('responsible-ai'); }}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <div>
                  <p className="font-bold text-[15px] text-ink-primary">Responsible AI</p>
                  <p className="text-[13px] text-ink-secondary">Explainable risk decisions</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-ink-faint" />
            </button>

            <button
              onClick={() => { haptics.light(); setActiveModal('about-product'); }}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-bold text-[15px] text-ink-primary">About SENTINEL PAY</p>
                  <p className="text-[13px] text-ink-secondary">Version 2.0</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-ink-faint" />
            </button>
          </div>
        </div>

        {/* Info Modals */}
        <Modal
          isOpen={activeModal !== null}
          onClose={() => setActiveModal(null)}
          title={
            activeModal === 'how-it-works'
              ? 'How SENTINEL Works'
              : activeModal === 'responsible-ai'
              ? 'Responsible AI Principles'
              : activeModal === 'privacy'
              ? 'Data & Privacy Philosophy'
              : 'SENTINEL PAY'
          }
          subtitle="Intelligent payment safety before money moves"
          maxWidth="md"
        >
          <div className="space-y-4 text-[14px] text-ink-secondary leading-relaxed p-2">
            {activeModal === 'how-it-works' && (
              <>
                <p>
                  SENTINEL operates on the principle of <strong className="text-ink-primary">Proportional Friction</strong>.
                </p>
                <p>
                  Unlike traditional security models that either blindly allow or aggressively block transfers, SENTINEL evaluates the recipient reputation, transfer volume deviation, and conversational context in real-time.
                </p>
                <p>
                  When signals indicate high ambiguity (such as an upfront job fee or an urgent unverified handle), it introduces a calm, high-context pause to prevent social engineering losses.
                </p>
              </>
            )}

            {activeModal === 'responsible-ai' && (
              <>
                <p>
                  <strong className="text-ink-primary">Zero Accusatory Language:</strong> SENTINEL never declares a recipient is definitely a criminal. It clearly states: “This payment shows multiple signals that deserve verification.”
                </p>
                <p>
                  <strong className="text-ink-primary">Transparent Explanations:</strong> Every flagged transfer provides a clear breakdown of why it was surfaced.
                </p>
                <p>
                  <strong className="text-ink-primary">User Autonomy:</strong> Users always retain ultimate control to verify, ask family, or proceed with explicit conscious confirmation.
                </p>
              </>
            )}

            {activeModal === 'privacy' && (
              <>
                <p>
                  Privacy is at the core of SENTINEL PAY. Contextual evaluation runs through client-side local inference models and tokenized APIs without storing raw personal chat logs or sensitive credentials.
                </p>
              </>
            )}

            {activeModal === 'about-product' && (
              <>
                <p className="text-ink-primary font-bold">
                  “The future of payments should not only be instant. It should be intelligent enough to help people pause when something is wrong.”
                </p>
                <p className="mt-2">
                  Built as a frontend prototype demonstrating AI payment safety, designed with modern minimalist aesthetic principles.
                </p>
              </>
            )}

            <div className="pt-4">
              <button
                className="w-full py-4 bg-gray-100 hover:bg-gray-200 text-ink-primary font-bold rounded-xl transition-colors active:scale-95"
                onClick={() => { haptics.light(); setActiveModal(null); }}
              >
                Close
              </button>
            </div>
          </div>
        </Modal>

        <BurnerUpiModal 
          isOpen={isBurnerModalOpen}
          onClose={() => setIsBurnerModalOpen(false)}
        />
      </main>
    </div>
  );
};
