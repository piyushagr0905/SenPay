import React from 'react';
import { Bell, User } from 'lucide-react';
import { UserProfile } from '../../types';

interface HeaderProps {
  user: UserProfile;
  onOpenProfile: () => void;
  onOpenNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onOpenProfile,
  onOpenNotifications,
}) => {
  const getGreeting = () => {
    // Get current hour in Indian Standard Time
    const istTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
    const hour = new Date(istTime).getHours();
    
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    if (hour < 21) return 'Good evening';
    return 'Good night';
  };

  return (
    <header className="px-5 pt-6 pb-4 flex items-center justify-between bg-surface-bg sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenProfile}
          className="relative group transition-transform active:scale-95 flex flex-col items-start text-left"
        >
          <p className="text-[10px] text-ink-secondary font-bold tracking-wider uppercase mb-0.5 ml-1">{getGreeting()}</p>
          <img src="/logo.png" alt="SenPay" className="h-7 w-auto object-contain" />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={onOpenNotifications}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center transition-transform active:scale-95 relative shadow-sm border border-gray-100"
        >
          <Bell className="w-5 h-5 text-ink-primary" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-sentinel-danger rounded-full border border-white" />
        </button>
      </div>
    </header>
  );
};
