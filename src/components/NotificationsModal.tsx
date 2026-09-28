import React from 'react';
import { X, Bell, Calendar, Shield, Receipt, Megaphone } from 'lucide-react';
import { Announcement } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  announcements: Announcement[];
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  announcements,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Bell className="w-4 h-4 text-emerald-600" />
            <span>Pusat Informasi & Pengumuman RT 04</span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className="p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200 transition-colors space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                  {ann.category === 'kegiatan' ? (
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  ) : ann.category === 'iuran' ? (
                    <Receipt className="w-3.5 h-3.5 text-amber-600" />
                  ) : (
                    <Shield className="w-3.5 h-3.5 text-sky-600" />
                  )}
                  <span>{ann.title}</span>
                </div>
                <span className="text-[10px] text-slate-400">{ann.date}</span>
              </div>

              <p className="text-[11px] text-slate-600 leading-relaxed">{ann.content}</p>

              <div className="pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500">
                <span>
                  Oleh: {ann.author} ({ann.authorRole})
                </span>
                {ann.pinned && (
                  <span className="text-emerald-700 font-bold">📌 Disematkan</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-100 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
