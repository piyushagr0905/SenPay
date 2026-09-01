import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  LifeBuoy,
  History,
  ChevronRight,
  ArrowLeft,
  Phone,
} from 'lucide-react';
import { UserProfile } from '../types';

interface ProtectScreenProps {
  user: UserProfile;
  onOpenIncidentWorkflow: () => void;
  onOpenTrustedContacts: () => void;
  onOpenSafetyHistory: () => void;
  onOpenScamShield: () => void;
  onBack: () => void;
}

export const ProtectScreen: React.FC<ProtectScreenProps> = ({
  user,
  onOpenIncidentWorkflow,
  onOpenTrustedContacts,
  onOpenSafetyHistory,
  onOpenScamShield,
  onBack,
}) => {
  const shieldStatus = user.protectionActive ? 'Active' : 'Inactive';
  const contactCount = user.trustedContacts?.length ?? 0;
  const scamsPrevented = user.stats?.scamsPrevented ?? 0;

  return (
    <div className="min-h-screen bg-surface-bg flex flex-col font-apple pb-8">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 flex items-center bg-white sticky top-0 z-10 border-b border-gray-100">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:scale-95 transition-all">
          <ArrowLeft className="w-6 h-6 text-ink-primary" />
        </button>
        <h1 className="flex-1 text-center font-bold text-[17px] text-ink-primary pr-8">Protect Center</h1>
      </div>

      <main className="flex-1 p-5 max-w-md w-full mx-auto space-y-4">
        
        {/* Scam Shield */}
        <button
          onClick={onOpenScamShield}
          className="w-full bg-white p-4 rounded-[20px] shadow-sm border border-gray-100 flex items-center gap-4 active:scale-95 transition-transform"
        >
          <div className="w-12 h-12 rounded-full bg-sentinel-50 text-sentinel-accent flex items-center justify-center shrink-0 border border-sentinel-100">
            <ShieldCheck className="w-6 h-6 stroke-[2]" />
          </div>
          <div className="flex-1 text-left">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="font-bold text-[15px] text-ink-primary">Scam Shield</h3>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                user.protectionActive ? 'text-sentinel-success bg-green-50 border border-green-100' : 'text-amber-700 bg-amber-50 border-amber-100'
              }`}>
                {shieldStatus}
              </span>
            </div>
            <p className="text-[13px] text-ink-secondary">Monitor suspicious payment activity.</p>
          </div>
          <ChevronRight className="w-5 h-5 text-ink-faint shrink-0" />
        </button>

        {/* Family Safety Circle */}
        <button
          onClick={onOpenTrustedContacts}
          className="w-full bg-white p-4 rounded-[20px] shadow-sm border border-gray-100 flex items-center gap-4 active:scale-95 transition-transform"
        >
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
            <Users className="w-6 h-6 stroke-[2]" />
          </div>
          <div className="flex-1 text-left">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="font-bold text-[15px] text-ink-primary">Family Safety Circle</h3>
              <span className="text-[10px] text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full font-bold uppercase">
                {contactCount} {contactCount === 1 ? 'Contact' : 'Contacts'}
              </span>
            </div>
            <p className="text-[13px] text-ink-secondary">Support for high-risk transfers.</p>
          </div>
          <ChevronRight className="w-5 h-5 text-ink-faint shrink-0" />
        </button>

        {/* I Think I Got Scammed */}
        <button
          onClick={onOpenIncidentWorkflow}
          className="w-full bg-rose-50 p-4 rounded-[20px] shadow-sm border border-rose-100 flex items-center gap-4 active:scale-95 transition-transform"
        >
          <div className="w-12 h-12 rounded-full bg-white text-rose-600 flex items-center justify-center shrink-0 border border-rose-200">
            <LifeBuoy className="w-6 h-6 stroke-[2]" />
          </div>
          <div className="flex-1 text-left">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="font-bold text-[15px] text-rose-950">I Think I Got Scammed</h3>
              <span className="text-[10px] text-rose-700 bg-white border border-rose-200 px-2 py-0.5 rounded-full font-bold uppercase">
                Emergency
              </span>
            </div>
            <p className="text-[13px] text-rose-800/80">Start incident workflow & generate reports.</p>
          </div>
          <ChevronRight className="w-5 h-5 text-rose-300 shrink-0" />
        </button>

        {/* Safety History */}
        <button
          onClick={onOpenSafetyHistory}
          className="w-full bg-white p-4 rounded-[20px] shadow-sm border border-gray-100 flex items-center gap-4 active:scale-95 transition-transform"
        >
          <div className="w-12 h-12 rounded-full bg-gray-50 text-gray-600 flex items-center justify-center shrink-0 border border-gray-200">
            <History className="w-6 h-6 stroke-[2]" />
          </div>
          <div className="flex-1 text-left">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="font-bold text-[15px] text-ink-primary">Safety History</h3>
              {scamsPrevented > 0 && (
                <span className="text-[10px] text-gray-700 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-full font-bold uppercase">
                  {scamsPrevented} blocked
                </span>
              )}
            </div>
            <p className="text-[13px] text-ink-secondary">Review previous warnings & scans.</p>
          </div>
          <ChevronRight className="w-5 h-5 text-ink-faint shrink-0" />
        </button>

        {/* Helpline */}
        <div className="mt-8 bg-sentinel-900 p-5 rounded-[20px] shadow-md flex items-center justify-between gap-4 border border-sentinel-800">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[11px] text-white/70 uppercase tracking-widest font-semibold mb-0.5">National Helpline</p>
              <p className="text-[18px] text-white font-bold leading-none">1930</p>
            </div>
          </div>
          <a
            href="tel:1930"
            className="px-4 py-2 bg-white text-sentinel-900 rounded-xl font-bold text-[14px] active:scale-95 transition-transform"
          >
            Call
          </a>
        </div>

      </main>
    </div>
  );
};
