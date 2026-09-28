import React, { useState } from 'react';
import {
  X,
  MapPin,
  Clock,
  ThumbsUp,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Trash2,
  Construction,
  Shield,
  Volume2,
  Sparkles,
  ArrowRight,
  Send,
} from 'lucide-react';
import { Complaint, ComplaintCategory, ComplaintStatus } from '../types';

interface ComplaintDetailModalProps {
  complaint: Complaint | null;
  isOpen: boolean;
  onClose: () => void;
  onUpvote: (id: string) => void;
  userRole: 'warga' | 'pengurus';
  onUpdateStatus?: (id: string, newStatus: ComplaintStatus, officerNote: string) => void;
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

export const ComplaintDetailModal: React.FC<ComplaintDetailModalProps> = ({
  complaint,
  isOpen,
  onClose,
  onUpvote,
  userRole,
  onUpdateStatus,
}) => {
  const [officerNoteInput, setOfficerNoteInput] = useState('');
  const [selectedNextStatus, setSelectedNextStatus] = useState<ComplaintStatus>('diproses');

  if (!isOpen || !complaint) return null;

  const categoryMeta = CATEGORY_MAP[complaint.category] || CATEGORY_MAP.lainnya;
  const CategoryIcon = categoryMeta.icon;

  const handleStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateStatus) {
      onUpdateStatus(
        complaint.id,
        selectedNextStatus,
        officerNoteInput.trim() || `Status diperbarui menjadi ${selectedNextStatus} oleh Pengurus RT.`
      );
      setOfficerNoteInput('');
    }
  };

  const getStatusBadge = (status: ComplaintStatus) => {
    switch (status) {
      case 'selesai':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Selesai Ditangani
          </span>
        );
      case 'diproses':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-100 text-sky-800">
            <Clock className="w-3 h-3 text-sky-600" />
            Sedang Diproses
          </span>
        );
      case 'ditolak':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-800">
            <AlertCircle className="w-3 h-3 text-rose-600" />
            Ditolak / Non-Relevan
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800">
            <Clock className="w-3 h-3 text-amber-600" />
            Menunggu Verifikasi
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] font-bold text-slate-500 tracking-wider">
                {complaint.ticketNumber}
              </span>
              {getStatusBadge(complaint.status)}
            </div>
            <h2 className="text-sm font-bold text-slate-900 mt-1 line-clamp-1">{complaint.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* Metadata banner */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-2">
            <div className="flex items-center justify-between text-slate-600">
              <div className="flex items-center gap-1.5">
                <CategoryIcon className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-medium text-slate-800">{categoryMeta.label}</span>
              </div>
              <span className="text-[11px] text-slate-600">{complaint.createdAt}</span>
            </div>

            <div className="flex items-center gap-1 text-slate-600">
              <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="text-[11px] text-slate-700">{complaint.location}</span>
            </div>

            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
              <span>Pelapor: {complaint.isAnonymous ? 'Warga Anonim (Privasi Terjaga)' : `${complaint.reporterName} (${complaint.reporterHouse})`}</span>
              <span
                className={`font-semibold uppercase tracking-wider text-[9px] px-1.5 py-0.5 rounded ${
                  complaint.priority === 'darurat'
                    ? 'bg-rose-100 text-rose-800'
                    : complaint.priority === 'penting'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                Prioritas {complaint.priority}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Deskripsi Laporan
            </h3>
            <p className="text-slate-800 leading-relaxed bg-white p-3 rounded-xl border border-slate-200 text-xs">
              {complaint.description}
            </p>
          </div>

          {/* Upvote & Citizen Endorsement */}
          <div className="flex items-center justify-between p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/60">
            <div>
              <span className="text-xs font-bold text-emerald-950 block">
                {complaint.upvotes} Warga Mendukung Keluhan Ini
              </span>
              <span className="text-[10px] text-emerald-700 block mt-0.5">
                Semakin banyak dukungan, semakin diprioritaskan oleh pengurus RT
              </span>
            </div>
            <button
              onClick={() => onUpvote(complaint.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                complaint.upvotedByMe
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>{complaint.upvotedByMe ? 'Didukung' : 'Dukung'}</span>
            </button>
          </div>

          {/* Official Notes if available */}
          {complaint.officialNotes && (
            <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/80">
              <div className="flex items-center gap-1.5 text-amber-900 font-semibold mb-1">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Catatan Tindak Lanjut Pengurus RT</span>
              </div>
              <p className="text-xs text-amber-900/90 leading-relaxed">
                {complaint.officialNotes}
              </p>
            </div>
          )}

          {/* Timeline Tracking */}
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Riwayat Kronologi Penanganan
            </h3>
            <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 pl-1">
              {complaint.timeline.map((step, idx) => (
                <div key={idx} className="relative flex items-start gap-3 pl-6">
                  <div className="absolute left-1.5 top-1 w-3 h-3 rounded-full bg-emerald-600 ring-4 ring-white" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-900">{step.actor}</span>
                      <span className="text-slate-600">{step.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 leading-snug">{step.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pengurus RT Admin Action Panel */}
          {userRole === 'pengurus' && onUpdateStatus && (
            <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-xs text-amber-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Panel Tindak Lanjut Pengurus RT</span>
                </div>
                <span className="text-[10px] text-slate-400">Mode Pengurus</span>
              </div>

              <form onSubmit={handleStatusSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Ubah Status Penanganan:
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'diproses', label: 'Diproses' },
                      { id: 'selesai', label: 'Selesai' },
                      { id: 'ditolak', label: 'Tolak' },
                    ].map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSelectedNextStatus(s.id as ComplaintStatus)}
                        className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                          selectedNextStatus === s.id
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Tulis Catatan untuk Warga:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={officerNoteInput}
                      onChange={(e) => setOfficerNoteInput(e.target.value)}
                      placeholder="Misal: Sudah ditugaskan ke Pak Sukardi..."
                      className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-400"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                    >
                      <Send className="w-3 h-3" />
                      <span>Simpan</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-semibold transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
