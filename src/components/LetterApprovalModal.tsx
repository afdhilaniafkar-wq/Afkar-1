import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  MapPin,
  Calendar,
  Building,
  Check,
  Ban,
  PenTool,
  QrCode,
} from 'lucide-react';
import { LetterRequest } from '../types';

interface LetterApprovalModalProps {
  letter: LetterRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (
    id: string,
    approvalData: {
      referenceNumber: string;
      officerName: string;
      officerRole: string;
      validUntil: string;
      officerNotes: string;
      officerSignatureHash: string;
    }
  ) => void;
  onReject: (id: string, reason: string) => void;
}

export const LetterApprovalModal: React.FC<LetterApprovalModalProps> = ({
  letter,
  isOpen,
  onClose,
  onApprove,
  onReject,
}) => {
  if (!isOpen || !letter) return null;

  const currentMonthRoman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'][
    new Date().getMonth()
  ];
  const defaultRefNumber =
    letter.referenceNumber ||
    `470/${Math.floor(100 + Math.random() * 900)}/RT.04-RW.08/${currentMonthRoman}/${new Date().getFullYear()}`;

  const [refNumber, setRefNumber] = useState(defaultRefNumber);
  const [officerName, setOfficerName] = useState('Bpk. H. Budi Santoso');
  const [officerRole, setOfficerRole] = useState('Ketua RT 04 / RW 08');
  const [officerNotes, setOfficerNotes] = useState(
    'Data kependudukan terverifikasi valid, status iuran RT lunas. Surat pengantar disahkan dengan tanda tangan digital resmi.'
  );
  const [validDays, setValidDays] = useState('30');
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const calculateValidUntil = () => {
    const d = new Date();
    d.setDate(d.getDate() + Number(validDays));
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const handleApproveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const signatureHash = `DS-RT04-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    onApprove(letter.id, {
      referenceNumber: refNumber.trim(),
      officerName,
      officerRole,
      validUntil: calculateValidUntil(),
      officerNotes: officerNotes.trim(),
      officerSignatureHash: signatureHash,
    });
    onClose();
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectReason.trim()) return;
    onReject(letter.id, rejectReason.trim());
    setIsRejecting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold">Verifikasi & Pengesahan Surat Pengantar</h2>
              <p className="text-[11px] text-slate-400">
                Mode Pengurus RT 04 · Penandatanganan Digital & Cap Stempel
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* Citizen's Submitted Form Review Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center justify-between border-b pb-2 border-slate-200">
              <span className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                Formulir yang Diisi Warga
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                {letter.type.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-500 block">Nama Pemohon:</span>
                <span className="font-bold text-slate-900">{letter.applicantName}</span>
              </div>
              <div>
                <span className="text-slate-500 block">No. Rumah / Blok:</span>
                <span className="font-semibold text-slate-900">{letter.houseNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 block">NIK KTP (16 Digit):</span>
                <span className="font-mono font-semibold text-slate-900">{letter.nik}</span>
              </div>
              <div>
                <span className="text-slate-500 block">No. Kartu Keluarga (KK):</span>
                <span className="font-mono font-semibold text-slate-900">
                  {letter.noKk || '3174092408100015'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Tempat, Tanggal Lahir:</span>
                <span className="text-slate-900">
                  {letter.birthPlace || 'Jakarta'}, {letter.birthDate || '12 April 1985'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Agama / Status:</span>
                <span className="text-slate-900">
                  {letter.religion || 'Islam'} / {letter.maritalStatus || 'Kawin'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Pekerjaan:</span>
                <span className="text-slate-900">{letter.occupation || 'Karyawan Swasta'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Status Iuran Lingkungan:</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Lunas Terverifikasi
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 text-[11px] space-y-1">
              <div>
                <span className="text-slate-500">Maksud & Keperluan:</span>
                <p className="font-semibold text-slate-900 mt-0.5">{letter.purpose}</p>
              </div>
              <div>
                <span className="text-slate-500">Instansi Tujuan:</span>
                <p className="font-medium text-slate-800">{letter.destinationAgency || 'Instansi Terkait / Kelurahan'}</p>
              </div>
              {letter.businessName && (
                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-950">
                  <span className="font-bold block">Detail Usaha:</span>
                  <span>{letter.businessName} ({letter.businessType}) - {letter.businessAddress}</span>
                </div>
              )}
            </div>
          </div>

          {!isRejecting ? (
            /* Approval Form */
            <form onSubmit={handleApproveSubmit} className="space-y-3.5">
              <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs">
                <PenTool className="w-4 h-4 text-emerald-600" />
                <span>Format Pengesahan & Tanda Tangan Digital Pengurus</span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Nomor Registrasi Surat RT (Buku Agenda) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={refNumber}
                  onChange={(e) => setRefNumber(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl bg-slate-50 text-xs font-mono font-bold text-slate-900 focus:bg-white focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Pejabat Penandatangan
                  </label>
                  <select
                    value={officerName}
                    onChange={(e) => setOfficerName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl bg-slate-50 text-xs focus:bg-white"
                  >
                    <option value="Bpk. H. Budi Santoso">Bpk. H. Budi Santoso (Ketua RT 04)</option>
                    <option value="Bpk. Bambang Sujarwo">Bpk. Bambang Sujarwo (Sekretaris RT 04)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Masa Berlaku Surat
                  </label>
                  <select
                    value={validDays}
                    onChange={(e) => setValidDays(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl bg-slate-50 text-xs focus:bg-white"
                  >
                    <option value="30">30 Hari (Standar)</option>
                    <option value="60">60 Hari (2 Bulan)</option>
                    <option value="90">90 Hari (3 Bulan)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Catatan Resmi Pengurus RT (Tertera pada surat & akun warga)
                </label>
                <textarea
                  rows={2}
                  value={officerNotes}
                  onChange={(e) => setOfficerNotes(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl bg-slate-50 text-xs focus:bg-white focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Digital Signature Security Preview */}
              <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <QrCode className="w-7 h-7 text-emerald-700" />
                  <div>
                    <span className="font-bold text-emerald-950 block">
                      Tanda Tangan Elektronik & Cap Basah Digital
                    </span>
                    <span className="text-[10px] text-emerald-700">
                      Otomatis dibubuhi QR Verifikasi Resmi dan Enkripsi Keaslian
                    </span>
                  </div>
                </div>
                <span className="px-2 py-1 bg-emerald-600 text-white rounded text-[10px] font-bold">
                  Siap Dibubuhkan
                </span>
              </div>

              {/* Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-xl text-xs font-bold shadow-sm shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Tandatangani & Sahkan Surat Resmi</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsRejecting(true)}
                  className="px-3 h-11 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Ban className="w-3.5 h-3.5" />
                  <span>Tolak Permohonan</span>
                </button>
              </div>
            </form>
          ) : (
            /* Rejection Form */
            <form onSubmit={handleRejectSubmit} className="space-y-3 p-3 bg-rose-50 border border-rose-200 rounded-2xl">
              <div className="flex items-center gap-1.5 font-bold text-rose-900 text-xs">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>Alasan Penolakan Permohonan Surat</span>
              </div>
              <p className="text-[11px] text-rose-800">
                Warga akan menerima pemberitahuan beserta catatan perbaikan agar dapat mengajukan ulang.
              </p>
              <textarea
                required
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Contoh: Dokumen NIK tidak sesuai data Kartu Keluarga, mohon periksa kembali nomor NIK..."
                className="w-full px-3 py-2 border border-rose-300 rounded-xl bg-white text-xs"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs"
                >
                  Konfirmasi Tolak Permohonan
                </button>
                <button
                  type="button"
                  onClick={() => setIsRejecting(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs"
                >
                  Batal
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
