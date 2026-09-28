import React from 'react';
import { Home, Users, Receipt, AlertCircle, FileText } from 'lucide-react';

export type NavTab = 'beranda' | 'warga' | 'iuran' | 'keluhan' | 'layanan';

interface BottomNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  activeComplaintsCount?: number;
  hasUnpaidDues?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  activeComplaintsCount = 0,
  hasUnpaidDues = false,
}) => {
  const tabs: Array<{
    id: NavTab;
    label: string;
    icon: React.ElementType;
    badgeCount?: number;
    showDot?: boolean;
  }> = [
    { id: 'beranda', label: 'Beranda', icon: Home },
    { id: 'warga', label: 'Warga', icon: Users },
    {
      id: 'iuran',
      label: 'Iuran & Kas',
      icon: Receipt,
      showDot: hasUnpaidDues,
    },
    {
      id: 'keluhan',
      label: 'Keluhan',
      icon: AlertCircle,
      badgeCount: activeComplaintsCount > 0 ? activeComplaintsCount : undefined,
    },
    { id: 'layanan', label: 'Layanan RT', icon: FileText },
  ];

  return (
    <nav
      className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-1 py-1"
      aria-label="Navigasi Utama"
    >
      <div className="grid grid-cols-5 items-center h-14 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center justify-center min-h-[48px] py-1 transition-colors select-none ${
                isActive ? 'text-emerald-700 font-semibold' : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 text-emerald-600' : 'text-slate-500'
                  }`}
                  strokeWidth={isActive ? 2.3 : 1.9}
                />

                {tab.badgeCount !== undefined && tab.badgeCount > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                    {tab.badgeCount}
                  </span>
                )}

                {tab.showDot && (
                  <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
                )}
              </div>

              <span className="text-[10px] leading-tight mt-1 whitespace-nowrap">
                {tab.label}
              </span>

              {isActive && (
                <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

