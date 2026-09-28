import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  MapPin,
  Clock,
  ThumbsUp,
  Lightbulb,
  Trash2,
  Construction,
  Shield,
  Volume2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  User,
} from 'lucide-react';
import { Complaint, ComplaintCategory, ComplaintStatus } from '../../types';

interface ComplaintsViewProps {
  complaints: Complaint[];
  onOpenNewComplaint: () => void;
  onSelectComplaint: (complaint: Complaint) => void;
  onUpvote: (id: string) => void;
  currentUserName: string;
}

const CATEGORY_MAP: Record<ComplaintCategory, { label: string; icon: React.ElementType }> = {
  penerangan: { label: 'Penerangan & PJU', icon: Lightbulb },
  kebersihan: { label: 'Kebersihan & Sampah', icon: Trash2 },
  jalan_saluran: { label: 'Jalan & Saluran Air', icon: Construction },
  keamanan: { label: 'Keamanan Lingkungan', icon: Shield },
  ketertiban: { label: 'Ketertiban & Bising', icon: Volume2 },
  fasilitas: { label: 'Fasilitas Umum', icon: Sparkles },
  lainnya: { label: 'Lainnya', icon: Sparkles },
};

export const ComplaintsView: React.FC<ComplaintsViewProps> = ({
  complaints,
  onOpenNewComplaint,
  onSelectComplaint,
  onUpvote,
  currentUserName,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'semua' | ComplaintStatus | 'saya'>('semua');
  const [categoryFilter, setCategoryFilter] = useState<string>('semua');

  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      // Search
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.ticketNumber.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      // Status
      if (statusFilter === 'saya') {
        if (c.reporterName !== currentUserName && c.reporterName !== 'Bramantyo Wardhana') {
          return false;
        }
      } else if (statusFilter !== 'semua') {
        if (c.status !== statusFilter) return false;
      }

      // Category
      if (categoryFilter !== 'semua' && c.category !== categoryFilter) {
        return false;
      }

      return true;
    });
  }, [complaints, searchQuery, statusFilter, categoryFilter, currentUserName]);

  return (
    <div className="flex-1 pb-24 p-4 space-y-4">
      {/* Title & Stats Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-slate-900">Keluhan & Laporan Warga</h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Saluran resmi pelaporan fasilitas dan ketertiban RT 04
          </p>
        </div>
        <button
          onClick={onOpenNewComplaint}
          className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-sm shadow-emerald-700/20 flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Laporan</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari keluhan, nomor tiket, atau lokasi jalan..."
          className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-2.5 text-xs text-slate-500 hover:text-slate-700"
          >
            Bersihkan
          </button>
        )}
      </div>

      {/* Segmented Status Tabs (Functional Filter Controls) */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar text-xs">
        {[
          { id: 'semua', label: 'Semua Laporan' },
          { id: 'menunggu', label: 'Menunggu' },
          { id: 'diproses', label: 'Diproses' },
          { id: 'selesai', label: 'Selesai' },
          { id: 'saya', label: 'Laporan Saya' },
        ].map((tab) => {
          const isActive = statusFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Complaints List */}
      <div className="space-y-3">
        {filteredComplaints.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-dashed border-slate-200 space-y-2">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-xs font-bold text-slate-700">Tidak Ada Laporan Ditemukan</h3>
            <p className="text-[11px] text-slate-600 max-w-xs mx-auto">
              Tidak ada laporan yang sesuai dengan filter atau kata kunci pencarian Anda.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('semua');
                setCategoryFilter('semua');
              }}
              className="mt-2 text-xs font-semibold text-emerald-700 hover:underline"
            >
              Reset Semua Filter
            </button>
          </div>
        ) : (
          filteredComplaints.map((item) => {
            const cat = CATEGORY_MAP[item.category] || CATEGORY_MAP.lainnya;
            const CatIcon = cat.icon;

            return (
              <div
                key={item.id}
                onClick={() => onSelectComplaint(item)}
                className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs hover:border-slate-300 transition-all cursor-pointer space-y-2.5 active:bg-slate-50/80"
              >
                {/* Header: Ticket & Status */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] font-bold text-slate-600 tracking-wider">
                      {item.ticketNumber}
                    </span>
                    <span className="text-slate-400">·</span>
                    <div className="flex items-center gap-1 text-[11px] text-slate-600 font-medium">
                      <CatIcon className="w-3 h-3 text-slate-500" />
                      <span>{cat.label}</span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      item.status === 'selesai'
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.status === 'diproses'
                        ? 'bg-sky-100 text-sky-800'
                        : item.status === 'ditolak'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-xs font-bold text-slate-900 line-clamp-1">{item.title}</h3>
                  <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Location & Reporter */}
                <div className="flex items-center justify-between text-[11px] text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1 truncate max-w-[190px]">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </div>

                  <span className="text-[10px] text-slate-600 shrink-0 font-medium">
                    {item.isAnonymous ? 'Anonim' : item.reporterHouse}
                  </span>
                </div>

                {/* Bottom Bar: Timeline status + Upvote Button */}
                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <span className="text-[10px] text-slate-600">
                    Dilaporkan {item.createdAt}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpvote(item.id);
                    }}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                      item.upvotedByMe
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>{item.upvotes}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Floating Action Button for thumb zone ergonomics */}
      <div className="fixed bottom-20 right-5 z-20 md:hidden">
        <button
          onClick={onOpenNewComplaint}
          className="w-13 h-13 rounded-full bg-emerald-600 text-white shadow-xl shadow-emerald-700/40 flex items-center justify-center hover:bg-emerald-700 active:scale-95 transition-transform"
          aria-label="Buat Laporan Baru"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
