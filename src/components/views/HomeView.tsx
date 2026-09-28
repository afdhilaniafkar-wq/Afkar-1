import React from 'react';
import {
  AlertCircle,
  Receipt,
  PlusCircle,
  ArrowRight,
  ShieldAlert,
  FileText,
  DollarSign,
  PhoneCall,
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles,
  MapPin,
  ChevronRight,
  QrCode,
  Users,
  Building2,
} from 'lucide-react';
import { Announcement, CitizenProfile, Complaint, DuesBill, EmergencyContact, Household } from '../../types';
import { assets, initialHouseholds } from '../../data/initialData';
import { NavTab } from '../BottomNav';

interface HomeViewProps {
  profile: CitizenProfile;
  activeBill: DuesBill | undefined;
  complaints: Complaint[];
  announcements: Announcement[];
  emergencyContacts: EmergencyContact[];
  households?: Household[];
  onOpenNewComplaint: () => void;
  onOpenPayment: (bill: DuesBill) => void;
  onOpenBillQr?: (bill: DuesBill) => void;
  onOpenComplaintDetail: (complaint: Complaint) => void;
  onNavigateTab: (tab: NavTab) => void;
  onOpenLetterModal: () => void;
  onQuickCall: (contact: EmergencyContact) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  profile,
  activeBill,
  complaints,
  announcements,
  emergencyContacts,
  households = initialHouseholds,
  onOpenNewComplaint,
  onOpenPayment,
  onOpenBillQr,
  onOpenComplaintDetail,
  onNavigateTab,
  onOpenLetterModal,
  onQuickCall,
}) => {
  const satpamContact = emergencyContacts.find((c) => c.type === 'satpam') || emergencyContacts[0];
  const recentComplaints = complaints.slice(0, 3);
  const pinnedAnnouncement = announcements.find((a) => a.pinned) || announcements[0];

  const totalKK = households.length;
  const kkDalam = households.filter((h) => h.householdType === 'kk_dalam_wilayah').length;
  const kkLuar = households.filter((h) => h.householdType === 'kk_luar_wilayah').length;
  const totalJiwa = households.reduce((sum, h) => sum + h.members.length, 0);

  return (
    <div className="flex-1 pb-20 space-y-4">
      {/* Hero Welcome Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-900 text-white p-5 rounded-b-3xl shadow-lg">
        {/* Subtle background image overlay */}
        <div className="absolute inset-0 opacity-15 mix-blend-overlay pointer-events-none">
          <img
            src={assets.neighborhoodBanner}
            alt="Lingkungan RT 04"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/25 border border-emerald-400/30 text-[10px] font-medium text-emerald-100 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping" />
              Sistem Tata Kelola Warga Pintar
            </div>
            <h1 className="text-lg font-bold tracking-tight text-white">
              Halo, {profile.name}
            </h1>
            <p className="text-xs text-emerald-100/90 mt-0.5">
              Hunian: {profile.houseNumber} · {profile.rtRw}
            </p>
          </div>

          <div className="relative">
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-12 h-12 rounded-2xl object-cover ring-2 ring-emerald-300/40 shadow-sm"
            />
            <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 bg-emerald-500 text-[9px] font-bold rounded text-white border border-white">
              KK
            </span>
          </div>
        </div>

        {/* Quick Dues Status Card inside Hero */}
        <div className="mt-4 pt-3.5 border-t border-emerald-600/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              activeBill && activeBill.status === 'belum_bayar'
                ? 'bg-amber-400 text-amber-950'
                : 'bg-emerald-400/20 text-emerald-200'
            }`}>
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-emerald-200/90 block">Status Iuran Lingkungan</span>
              <span className="text-xs font-bold text-white">
                {activeBill && activeBill.status === 'belum_bayar'
                  ? `${activeBill.month} · Belum Bayar`
                  : 'Oktober 2026 · Lunas'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {activeBill && onOpenBillQr && (
              <button
                onClick={() => onOpenBillQr(activeBill)}
                title="Tampilkan QR Code Tagihan Hunian"
                className="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
              >
                <QrCode className="w-4 h-4" />
              </button>
            )}
            {activeBill && activeBill.status === 'belum_bayar' ? (
              <button
                onClick={() => onOpenPayment(activeBill)}
                className="px-3 py-1.5 bg-white text-emerald-900 hover:bg-emerald-50 rounded-xl text-xs font-bold shadow-sm transition-transform active:scale-95 flex items-center gap-1"
              >
                <span>Bayar Rp 150rb</span>
                <ArrowRight className="w-3 h-3 text-emerald-700" />
              </button>
            ) : (
              <span className="px-2.5 py-1 bg-emerald-500/30 text-emerald-100 text-[11px] font-semibold rounded-lg flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                Lunas
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {/* Quick Action Grid (6 essential shortcuts) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Layanan Utama Warga
            </h2>
            <span className="text-[10px] text-slate-600">Akses Cepat</span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={onOpenNewComplaint}
              className="flex flex-col items-center justify-center p-2.5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 hover:shadow-sm transition-all group active:scale-95"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                <AlertCircle className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-800 text-center leading-tight">
                Lapor Keluhan
              </span>
            </button>

            <button
              onClick={() => onNavigateTab('iuran')}
              className="flex flex-col items-center justify-center p-2.5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 hover:shadow-sm transition-all group active:scale-95"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                <Receipt className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-800 text-center leading-tight">
                Bayar Iuran
              </span>
            </button>

            <button
              onClick={() => onNavigateTab('iuran')}
              className="flex flex-col items-center justify-center p-2.5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 hover:shadow-sm transition-all group active:scale-95"
            >
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                <DollarSign className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-800 text-center leading-tight">
                Kas Terbuka
              </span>
            </button>

            <button
              onClick={onOpenLetterModal}
              className="flex flex-col items-center justify-center p-2.5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 hover:shadow-sm transition-all group active:scale-95"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-800 text-center leading-tight">
                Surat Pengantar
              </span>
            </button>
          </div>
        </div>

        {/* Kependudukan & Sensus Warga RT 04 Widget */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Users className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-xs font-bold text-slate-900">
                Sensus Kependudukan RT 04
              </h2>
            </div>
            <button
              onClick={() => onNavigateTab('warga')}
              className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5"
            >
              <span>Kelola Warga</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 py-1">
            <div className="p-2 bg-slate-50 rounded-xl text-center border border-slate-100">
              <span className="text-[10px] font-semibold text-slate-500 block">Total KK</span>
              <span className="text-sm font-extrabold text-slate-900">{totalKK} KK</span>
            </div>
            <div className="p-2 bg-emerald-50/70 rounded-xl text-center border border-emerald-100">
              <span className="text-[10px] font-semibold text-emerald-700 block">KK Dalam</span>
              <span className="text-sm font-extrabold text-emerald-900">{kkDalam} KK</span>
            </div>
            <div className="p-2 bg-amber-50/70 rounded-xl text-center border border-amber-100">
              <span className="text-[10px] font-semibold text-amber-700 block">KK Luar</span>
              <span className="text-sm font-extrabold text-amber-900">{kkLuar} KK</span>
            </div>
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">
              Terdata: <strong className="text-slate-700">{totalJiwa} Jiwa</strong> berbasis NIK
            </span>
            <button
              onClick={() => onNavigateTab('warga')}
              className="font-bold text-emerald-700 hover:underline flex items-center gap-1"
            >
              <span>Buka Salinan KK</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Urgent Emergency / Security Bar */}
        <div className="p-3 bg-red-50 rounded-2xl border border-red-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <ShieldAlert className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <span className="text-xs font-bold text-red-950 block">Kontak Pos Satpam 24 Jam</span>
              <span className="text-[10px] text-red-700 block">
                {satpamContact.name} ({satpamContact.phone})
              </span>
            </div>
          </div>
          <button
            onClick={() => onQuickCall(satpamContact)}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1 transition-all"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Panggil</span>
          </button>
        </div>

        {/* Pinned Announcement */}
        {pinnedAnnouncement && (
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-emerald-800 text-[11px] font-bold">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>Agenda Warga RT 04</span>
              </div>
              <span className="text-[10px] text-slate-600 font-medium">
                {pinnedAnnouncement.date}
              </span>
            </div>

            <h3 className="text-xs font-bold text-slate-900 mb-1">
              {pinnedAnnouncement.title}
            </h3>
            <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
              {pinnedAnnouncement.content}
            </p>

            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-600">
                Oleh: {pinnedAnnouncement.author} ({pinnedAnnouncement.authorRole})
              </span>
              <button
                onClick={() => onNavigateTab('layanan')}
                className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5"
              >
                <span>Lihat Semua</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Live Citizen Complaints Tracker */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Keluhan Lingkungan Terkini
              </h2>
              <span className="text-[10px] text-slate-600">Pantau proses perbaikan fasilitas</span>
            </div>
            <button
              onClick={() => onNavigateTab('keluhan')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5"
            >
              <span>Semua ({complaints.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {recentComplaints.map((item) => (
              <div
                key={item.id}
                onClick={() => onOpenComplaintDetail(item)}
                className="p-3 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all cursor-pointer active:bg-slate-50"
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="font-mono text-[10px] font-bold text-slate-600">
                        {item.ticketNumber}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
                          item.status === 'selesai'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'diproses'
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                      {item.title}
                    </h4>
                  </div>
                  <span className="text-[10px] text-slate-600 shrink-0 font-medium">
                    {item.createdAt.split(' ')[0]}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1.5 border-t border-slate-100">
                  <div className="flex items-center gap-1 truncate max-w-[200px]">
                    <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-700">
                    👍 {item.upvotes} Dukungan
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Add Complaint Banner */}
          <button
            onClick={onOpenNewComplaint}
            className="w-full mt-3 py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-300/80 rounded-2xl text-emerald-800 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <PlusCircle className="w-4 h-4 text-emerald-700" />
            <span>Ada fasilitas rusak? Laporkan di Sini</span>
          </button>
        </div>
      </div>
    </div>
  );
};
