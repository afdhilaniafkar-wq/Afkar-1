import React, { useState } from 'react';
import { Smartphone, Monitor, Wifi, BatteryCharging } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  const [isPhoneFrame, setIsPhoneFrame] = useState(true);

  return (
    <div className="min-h-screen bg-slate-900/90 md:bg-slate-900 text-slate-800 flex flex-col items-center justify-start p-0 md:py-6 md:px-4">
      {/* Desktop Helper Bar: view mode switcher & RT identity */}
      <div className="hidden md:flex items-center justify-between w-full max-w-xl mb-3 px-3 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-medium text-slate-200">WargaHub Lingkungan RT 04 / RW 08</span>
        </div>

        <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700">
          <button
            onClick={() => setIsPhoneFrame(true)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              isPhoneFrame
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Tampilkan dalam frame smartphone mobile"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Layar HP (Mobile)</span>
          </button>
          <button
            onClick={() => setIsPhoneFrame(false)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              !isPhoneFrame
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Tampilkan layar lebar responsif"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Responsif Lebar</span>
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div
        className={`w-full transition-all duration-300 flex flex-col bg-slate-50 ${
          isPhoneFrame
            ? 'max-w-[430px] md:rounded-[40px] md:shadow-2xl md:shadow-black/60 md:border-[10px] md:border-slate-800 md:ring-1 md:ring-slate-700/50 min-h-screen md:min-h-[860px] md:max-h-[920px] overflow-hidden'
            : 'max-w-3xl md:rounded-2xl md:shadow-xl md:border md:border-slate-800 min-h-screen overflow-hidden'
        }`}
      >
        {/* Simulated Mobile Status Bar (Visible in phone frame) */}
        {isPhoneFrame && (
          <div className="bg-white/95 border-b border-slate-100 text-slate-700 px-6 pt-3 pb-1.5 flex items-center justify-between text-xs select-none">
            <span className="font-semibold text-[13px] tracking-tight text-slate-800">12:13</span>
            <div className="w-20 h-4 bg-slate-900 rounded-full mx-auto hidden md:block" />
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="text-[10px] font-bold">5G</span>
              <Wifi className="w-3.5 h-3.5" />
              <div className="flex items-center gap-0.5">
                <span className="text-[10px] font-bold">98%</span>
                <BatteryCharging className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
          </div>
        )}

        {/* Inner Scrollable Canvas */}
        <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden relative">
          {children}
        </div>
      </div>
    </div>
  );
};
