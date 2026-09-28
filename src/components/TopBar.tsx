import React from 'react';
import { ShieldCheck, UserCheck, Bell, Building2 } from 'lucide-react';
import { CitizenProfile } from '../types';

interface TopBarProps {
  profile: CitizenProfile;
  onToggleRole: () => void;
  unreadCount?: number;
  onOpenNotifications: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  profile,
  onToggleRole,
  unreadCount = 2,
  onOpenNotifications,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 flex items-center justify-between">
      {/* Zone 1: Brand title */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-600/20">
          <Building2 className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-base font-bold tracking-tight text-slate-900 leading-none">
              WargaHub
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200/60">
              RT 04
            </span>
          </div>
          <span className="text-[11px] text-slate-600 leading-tight block mt-0.5">
            RW 08 Komplek Griya Sejahtera
          </span>
        </div>
      </div>

      {/* Zone 3: Primary Actions (Role Switcher & Notifications) */}
      <div className="flex items-center gap-2">
        {/* Role toggle button: quick switch between Resident and RT Official */}
        <button
          onClick={onToggleRole}
          title="Klik untuk beralih mode Warga / Pengurus RT"
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
            profile.role === 'pengurus'
              ? 'bg-amber-500/10 text-amber-800 border border-amber-300'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          {profile.role === 'pengurus' ? (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span className="truncate max-w-[85px]">Pengurus RT</span>
            </>
          ) : (
            <>
              <UserCheck className="w-3.5 h-3.5 text-slate-600" />
              <span className="truncate max-w-[85px]">{profile.houseNumber}</span>
            </>
          )}
        </button>

        <button
          onClick={onOpenNotifications}
          aria-label="Notifikasi Pengumuman"
          className="relative min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
          )}
        </button>
      </div>
    </header>
  );
};
