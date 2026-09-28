import React, { useState } from 'react';
import {
  FileText,
  Plus,
  PhoneCall,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  Shield,
  ExternalLink,
  Download,
  Building2,
  Calendar,
  Printer,
  PenTool,
  QrCode,
  ShieldCheck,
  Search,
  Check,
} from 'lucide-react';
import { EmergencyContact, LetterRequest } from '../../types';

interface ServicesViewProps {
  letterRequests: LetterRequest[];
  emergencyContacts: EmergencyContact[];
  onOpenLetterModal: () => void;
  onCallContact: (contact: EmergencyContact) => void;
  userRole: 'warga' | 'pengurus';
  onViewDocument: (letter: LetterRequest) => void;
  onOpenApproval: (letter: LetterRequest) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({
  letterRequests,
  emergencyContacts,
  onOpenLetterModal,
  onCallContact,
  userRole,
  onViewDocument,
  onOpenApproval,
}) => {
  const [activeSection, setActiveSection] = useState<'surat' | 'ronda' | 'kontak'>('surat');
  const [letterFilter, setLetterFilter] = useState<'semua' | 'menunggu' | 'disetujui'>('semua');

  const filteredLetters = letterRequests.filter((lr) => {
    if (letterFilter === 'menunggu') return lr.status === 'menunggu';
    if (letterFilter === 'disetujui') return lr.status === 'disetujui';
    return true;
  });

  const pendingCount = letterRequests.filter((l) => l.status === 'menunggu').length;
  const approvedCount = letterRequests.filter((l) => l.status === 'disetujui').length;

  const rondaSchedule = [
    { day: 'Senin', block: 'Blok A (Rumah 01-12)', danru: 'Pak Sukardi (Satpam Regu 1)' },
    { day: 'Selasa', block: 'Blok B (Rumah 01-14)', danru: 'Pak Sukardi (Satpam Regu 1)' },
    { day: 'Rabu', block: 'Blok C (Rumah 01-12)', danru: 'Pak Slamet (Satpam Regu 2)' },
    { day: 'Kamis', block: 'Blok D (Rumah 01-16)', danru: 'Pak Slamet (Satpam Regu 2)' },
    { day: 'Jumat', block: 'Gabungan Blok A & C', danru: 'Pak Sukardi & Babinsa' },
    { day: 'Sabtu', block: 'Kerja Bakti & Ronda Bersama', danru: 'Ketua RT & Satpam' },
    { day: 'Minggu', block: 'Blok B & D', danru: 'Pak Slamet (Satpam Regu 2)' },
  ];

  return (
    <div className="flex-1 pb-24 p-4 space-y-4">
      <div>
        <h1 className="text-base font-bold text-slate-900">Layanan & Tata Kelola Warga</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Surat pengantar digital bertanda tangan elektronik, siskamling, dan kontak darurat RT 04
        </p>
      </div>

      {/* Main Feature Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setActiveSection('surat')}
          className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeSection === 'surat'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Surat Pengantar RT</span>
          {pendingCount > 0 && userRole === 'pengurus' && (
            <span className="w-2 h-2 rounded-full bg-amber-300" />
          )}
        </button>

        <button
          onClick={() => setActiveSection('ronda')}
          className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeSection === 'ronda'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Jadwal Siskamling</span>
        </button>

        <button
          onClick={() => setActiveSection('kontak')}
          className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeSection === 'kontak'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Kontak Darurat</span>
        </button>
      </div>

      {/* SECTION 1: PERSURATAN RESMI RT DENGAN TTE & CAP DIGITAL */}
      {activeSection === 'surat' && (
        <div className="space-y-4">
          {/* Header Action & Role Indicator */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                {userRole === 'pengurus' ? 'Daftar Pengajuan Surat Warga' : 'Permohonan Surat Saya'}
              </h2>
              <span className="text-[10px] text-slate-500">
                {userRole === 'pengurus'
                  ? 'Verifikasi data & bubuhkan TTD digital pengurus'
                  : 'Unduh surat resmi berstempel untuk tahap berikutnya'}
              </span>
            </div>

            <button
              onClick={onOpenLetterModal}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Buat Permohonan</span>
            </button>
          </div>

          {/* Pengurus Role Callout Banner */}
          {userRole === 'pengurus' && (
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                  <PenTool className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-amber-950 block text-[11px]">
                    Mode Pengurus: {pendingCount} Permohonan Butuh Tanda Tangan
                  </span>
                  <span className="text-[10px] text-amber-800">
                    Klik tombol "Periksa & Tandatangani" untuk mengesahkan berkas secara digital.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Sub-filter chips */}
          <div className="flex items-center gap-1.5 text-[11px]">
            <button
              onClick={() => setLetterFilter('semua')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                letterFilter === 'semua'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              Semua ({letterRequests.length})
            </button>

            <button
              onClick={() => setLetterFilter('menunggu')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                letterFilter === 'menunggu'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              Menunggu Review ({pendingCount})
            </button>

            <button
              onClick={() => setLetterFilter('disetujui')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                letterFilter === 'disetujui'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              Disahkan / Siap Unduh ({approvedCount})
            </button>
          </div>

          {/* Letter Cards List */}
          <div className="space-y-3">
            {filteredLetters.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-3xl border border-dashed border-slate-200 space-y-2">
                <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                <h3 className="text-xs font-bold text-slate-700">Belum Ada Permohonan Surat</h3>
                <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                  Isi formulir pengajuan surat pengantar lengkap untuk keperluan administrasi resmi.
                </p>
                <button
                  onClick={onOpenLetterModal}
                  className="mt-2 text-xs font-semibold text-emerald-700 hover:underline"
                >
                  Ajukan Surat Sekarang
                </button>
              </div>
            ) : (
              filteredLetters.map((req) => {
                const isApproved = req.status === 'disetujui';
                const isPending = req.status === 'menunggu';
                const isRejected = req.status === 'ditolak';

                return (
                  <div
                    key={req.id}
                    className={`bg-white rounded-2xl border p-4 shadow-xs space-y-3 transition-all ${
                      isApproved
                        ? 'border-emerald-300 ring-1 ring-emerald-400/20'
                        : isPending && userRole === 'pengurus'
                        ? 'border-amber-400 ring-2 ring-amber-400/20'
                        : 'border-slate-200'
                    }`}
                  >
                    {/* Header: Ref No & Status Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[10px] font-bold text-slate-600 tracking-wider">
                            No. {req.referenceNumber}
                          </span>
                        </div>
                        <h3 className="text-xs font-bold text-slate-900 mt-0.5 capitalize">
                          {req.type.replace('_', ' ')}
                        </h3>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          isApproved
                            ? 'bg-emerald-100 text-emerald-800'
                            : isRejected
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {isApproved ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Sah & Siap Unduh</span>
                          </>
                        ) : isRejected ? (
                          <>
                            <AlertCircle className="w-3 h-3 text-rose-600" />
                            <span>Perlu Perbaikan</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>Menunggu Review RT</span>
                          </>
                        )}
                      </span>
                    </div>

                    {/* Metadata Box */}
                    <div className="text-[11px] text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Nama Pemohon:</span>
                        <span className="font-bold text-slate-900">
                          {req.applicantName} ({req.houseNumber})
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-500">NIK KTP:</span>
                        <span className="font-mono font-semibold text-slate-800">{req.nik}</span>
                      </div>

                      <div className="pt-1 border-t border-slate-200/60">
                        <span className="text-slate-500 block">Keperluan:</span>
                        <span className="font-medium text-slate-800">{req.purpose}</span>
                      </div>

                      <div className="flex justify-between text-[10px]">
                        <span className="text-slate-500">Ditujukan Kepada:</span>
                        <span className="text-slate-700 truncate max-w-[190px]">
                          {req.destinationAgency || 'Kelurahan Sukamaju'}
                        </span>
                      </div>

                      {/* Official Endorsement Stamp Info */}
                      {isApproved && (
                        <div className="pt-2 mt-1 border-t border-emerald-200/80 text-emerald-950 text-[10px] space-y-0.5">
                          <div className="flex items-center justify-between font-semibold text-emerald-900">
                            <span className="flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                              <span>Ditandatangani Digital: {req.officerName || 'Ketua RT 04'}</span>
                            </span>
                            <span>Masa Berlaku: s/d {req.validUntil || '28 Okt 2026'}</span>
                          </div>
                          <span className="font-mono text-emerald-700 block">
                            Kode TTE: {req.officerSignatureHash || 'DS-RT04-2026-9F8A'}
                          </span>
                        </div>
                      )}

                      {/* Officer Notes if available */}
                      {req.officerNotes && (
                        <div className="pt-1.5 border-t border-slate-200 text-slate-600 text-[10px]">
                          <strong>Catatan Pengurus:</strong> {req.officerNotes}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-1 flex flex-wrap items-center gap-2">
                      {/* For Citizen: Direct Download / Print Legal Document */}
                      {isApproved && (
                        <button
                          onClick={() => onViewDocument(req)}
                          className="flex-1 h-10 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-xl text-xs font-bold shadow-xs shadow-emerald-700/20 flex items-center justify-center gap-1.5 transition-all"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Unduh & Cetak Surat Resmi (PDF)</span>
                        </button>
                      )}

                      {/* For Pengurus: Review & Digital Sign Modal Trigger */}
                      {userRole === 'pengurus' && (
                        <button
                          onClick={() => onOpenApproval(req)}
                          className={`h-10 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                            isPending
                              ? 'flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-xs'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          <PenTool className="w-3.5 h-3.5" />
                          <span>{isPending ? 'Periksa & Tandatangani Digital' : 'Atur Pengesahan'}</span>
                        </button>
                      )}

                      {/* View document preview even for non-approved or reviewing */}
                      <button
                        onClick={() => onViewDocument(req)}
                        className="px-3 h-10 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-slate-500" />
                        <span>Pratinjau Berkas</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Legal Information Box */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200/70 rounded-2xl text-[11px] text-emerald-950 space-y-1.5">
            <div className="font-bold flex items-center gap-1.5 text-emerald-900">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Keabsahan Hukum Surat Pengantar RT Digital</span>
            </div>
            <p className="text-emerald-800/90 leading-relaxed">
              Dokumen surat pengantar yang diterbitkan melalui aplikasi WargaHub RT 04 dilengkapi
              dengan <strong>Tanda Tangan Elektronik (TTE)</strong>, <strong>Cap Stempel Basah Digital</strong>,
              dan <strong>QR Code Keaslian</strong> berstandar administrasi kenegaraan. Dokumen sah dan dapat
              langsung diajukan ke Kantor Kelurahan Sukamaju, Kecamatan, KUA, Polsek, Dukcapil, atau Bank.
            </p>
          </div>
        </div>
      )}

      {/* SECTION 2: JADWAL SISKAMLING RONDA */}
      {activeSection === 'ronda' && (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Jadwal Ronda Malam Minggu Ini
            </h2>
            <span className="text-[10px] text-slate-500">Pukul 22.00 - 04.30 WIB</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100 shadow-xs">
            {rondaSchedule.map((item, idx) => (
              <div key={idx} className="p-3.5 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-14 font-bold text-slate-800 shrink-0">{item.day}</span>
                  <div>
                    <h4 className="font-semibold text-slate-900">{item.block}</h4>
                    <span className="text-[10px] text-slate-500 block">{item.danru}</span>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-medium">
                  Pos Utama
                </span>
              </div>
            ))}
          </div>

          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/70 rounded-2xl text-emerald-950 text-xs space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-emerald-900">
              <Shield className="w-4 h-4 text-emerald-700" />
              <span>Perlengkapan Pos Ronda</span>
            </div>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              Tersedia senter patroli, tongkat T, jas hujan, kentongan darurat, dan P3K di Pos Satpam
              Utara. Bagi warga yang berhalangan giliran ronda dapat mengonfirmasi kepada Sie Keamanan RT.
            </p>
          </div>
        </div>
      )}

      {/* SECTION 3: KONTAK DARURAT */}
      {activeSection === 'kontak' && (
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Nomor Darurat & Pengurus Lingkungan
          </h2>

          <div className="space-y-2.5">
            {emergencyContacts.map((contact) => (
              <div
                key={contact.id}
                className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                    {contact.type === 'satpam' ? (
                      <Shield className="w-5 h-5 text-emerald-600" />
                    ) : contact.type === 'damkar' ? (
                      <AlertCircle className="w-5 h-5 text-rose-600" />
                    ) : (
                      <PhoneCall className="w-5 h-5 text-sky-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{contact.name}</h3>
                    <p className="text-[10px] text-slate-500">{contact.role}</p>
                    <span className="font-mono text-xs font-bold text-slate-700 block mt-0.5">
                      {contact.phone}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onCallContact(contact)}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all shrink-0"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Hubungi</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
