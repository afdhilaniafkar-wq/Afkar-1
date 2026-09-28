import React, { useState } from 'react';
import {
  X,
  Printer,
  Copy,
  Check,
  ShieldCheck,
  MapPin,
  Home,
  QrCode,
  FileCheck2,
  Calendar,
  Users,
  Eye,
  EyeOff,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { Household, FamilyMember } from '../types';

interface FamilyCardModalProps {
  household: Household | null;
  isOpen: boolean;
  onClose: () => void;
  userRole?: 'warga' | 'pengurus';
  currentUserName?: string;
}

export const FamilyCardModal: React.FC<FamilyCardModalProps> = ({
  household,
  isOpen,
  onClose,
  userRole = 'warga',
  currentUserName = '',
}) => {
  const [copiedNik, setCopiedNik] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [showFullNik, setShowFullNik] = useState(true);

  if (!isOpen || !household) return null;

  const isDalamWilayah = household.householdType === 'kk_dalam_wilayah';
  const isMyFamily = currentUserName && household.headOfFamily.toLowerCase().includes(currentUserName.toLowerCase());

  const handleCopyNik = (nik: string) => {
    navigator.clipboard.writeText(nik);
    setCopiedNik(nik);
    setTimeout(() => setCopiedNik(null), 2000);
  };

  const handleCopyAllData = () => {
    const summaryText = `[SALINAN KARTU KELUARGA RT 04 / RW 08]
Kategori: ${isDalamWilayah ? 'KK DALAM WILAYAH (Warga Tetap)' : 'KK LUAR WILAYAH (Warga Domisili/Kontrak)'}
No. Kartu Keluarga: ${household.familyCardNumber}
Kepala Keluarga: ${household.headOfFamily}
Hunian Lingkungan: ${household.houseNumber}, ${household.rtRw}
Status Tempat Tinggal: ${household.residenceStatus}
${!isDalamWilayah && household.originAddress ? `Alamat Asal KTP/KK: ${household.originAddress}\n` : ''}
Jumlah Anggota: ${household.members.length} Jiwa

DAFTAR ANGGOTA KELUARGA BERBASIS NIK:
${household.members
  .map(
    (m, idx) =>
      `${idx + 1}. ${m.fullName}
   NIK: ${m.nik} | Hub: ${m.relationship}
   TTL: ${m.birthPlace}, ${m.birthDate} | JK: ${m.gender}
   Agama: ${m.religion} | Gol Darah: ${m.bloodType}
   Pendidikan: ${m.education} | Pekerjaan: ${m.occupation}
   Status Kawin: ${m.maritalStatus} | DPT RT: ${m.isVoter ? 'Terdaftar' : 'Belum/Non-DPT'}`
  )
  .join('\n\n')}

Verifikasi: Sensus Digital Kependudukan RT 04 / RW 08
Tanggal Akses: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`;

    navigator.clipboard.writeText(summaryText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const maskNik = (nik: string) => {
    if (showFullNik) return nik;
    return `${nik.slice(0, 6)}******${nik.slice(-4)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Modal Top Header Bar */}
        <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isDalamWilayah ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Salinan Kependudukan Digital
                </h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isDalamWilayah
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                  }`}
                >
                  {isDalamWilayah ? 'KK Dalam Wilayah (Warga Tetap)' : 'KK Luar Wilayah (Domisili)'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Data resmi kependudukan RT 04 berbasis NIK & No. KK
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowFullNik(!showFullNik)}
              title={showFullNik ? 'Sembunyikan Digit NIK' : 'Tampilkan NIK Lengkap'}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              {showFullNik ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Document Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-slate-800 bg-slate-50/50">
          {/* Authentic Kartu Keluarga Paper Template */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl border-2 border-slate-300 shadow-sm relative overflow-hidden">
            {/* Background Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
              <span className="text-9xl font-extrabold tracking-widest text-slate-900">
                KK
              </span>
            </div>

            {/* KK Official Header */}
            <div className="text-center pb-3 border-b-2 border-slate-800 relative">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-full bg-amber-600/10 flex items-center justify-center border border-amber-500/30 text-amber-700">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h2 className="text-sm sm:text-base font-extrabold tracking-wider text-slate-900 uppercase">
                  REPUBLIK INDONESIA
                </h2>
              </div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                KARTU KELUARGA
              </h1>

              {/* No KK Hero Box */}
              <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-lg border border-slate-300">
                <span className="text-xs font-semibold text-slate-600">No. KK:</span>
                <span className="font-mono text-sm sm:text-base font-bold text-slate-900 tracking-wider">
                  {household.familyCardNumber}
                </span>
                <button
                  onClick={() => handleCopyNik(household.familyCardNumber)}
                  className="p-1 hover:bg-slate-200 rounded text-slate-600 transition-colors"
                  title="Salin Nomor KK"
                >
                  {copiedNik === household.familyCardNumber ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Category Flag Banner */}
              <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                    isDalamWilayah
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isDalamWilayah ? 'bg-emerald-600' : 'bg-amber-600'
                    }`}
                  />
                  {isDalamWilayah
                    ? 'KK Dalam Wilayah · KTP & KK RT Setempat (Warga Tetap)'
                    : 'KK Luar Wilayah · Warga Domisili / Kontrak / Non-Permanen'}
                </span>

                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                  <Home className="w-3 h-3 text-slate-500" />
                  Hunian: {household.residenceStatus}
                </span>
              </div>
            </div>

            {/* KK Metadata Grid (Left & Right Column standard dukcapil style) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-3 border-b border-slate-200 text-xs">
              <div className="space-y-1">
                <div className="flex">
                  <span className="w-32 text-slate-500">Nama Kepala Keluarga</span>
                  <span className="font-bold text-slate-900">: {household.headOfFamily}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-slate-500">Alamat Lingkungan</span>
                  <span className="font-medium text-slate-800">: {household.houseNumber}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-slate-500">RT / RW</span>
                  <span className="font-medium text-slate-800">: {household.rtRw}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-slate-500">Kelurahan / Desa</span>
                  <span className="font-medium text-slate-800">: Sukamaju</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex">
                  <span className="w-32 text-slate-500">Kecamatan</span>
                  <span className="font-medium text-slate-800">: Pancoran</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-slate-500">Kabupaten / Kota</span>
                  <span className="font-medium text-slate-800">: Jakarta Selatan</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-slate-500">Kode Pos & Provinsi</span>
                  <span className="font-medium text-slate-800">: 12780 · DKI Jakarta</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-slate-500">Tanggal Lapor / Masuk</span>
                  <span className="font-medium text-slate-800">: {household.entryDate}</span>
                </div>
              </div>
            </div>

            {/* Special Notice for KK Luar Wilayah */}
            {!isDalamWilayah && (
              <div className="my-3 p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-xs text-amber-900">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Status KK Luar Wilayah:</span>
                    <p className="text-amber-800 leading-relaxed mt-0.5">
                      Keluarga ini tercatat tinggal di RT 04 dengan status{' '}
                      <strong>{household.residenceStatus}</strong>. Dokumen Kartu Keluarga induk
                      tercatat pada alamat asal berikut:
                    </p>
                    <p className="mt-1 font-semibold text-amber-950 bg-amber-100/70 p-1.5 rounded-lg border border-amber-200">
                      📍 {household.originAddress || 'Alamat asal tercatat di luar wilayah RT 04'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TABEL I: DATA ANGGOTA KELUARGA (Identitas & NIK) */}
            <div className="my-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-600" />
                  Tabel I: Daftar Anggota Keluarga & NIK
                </h3>
                <span className="text-[11px] text-slate-500 font-medium">
                  Total: {household.members.length} Jiwa
                </span>
              </div>

              <div className="overflow-x-auto border border-slate-300 rounded-xl">
                <table className="w-full text-[11px] text-left">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300 uppercase">
                    <tr>
                      <th className="px-2 py-2 text-center w-8">No</th>
                      <th className="px-2 py-2">Nama Lengkap</th>
                      <th className="px-2 py-2">NIK (16 Digit)</th>
                      <th className="px-2 py-2">JK</th>
                      <th className="px-2 py-2">Tempat, Tanggal Lahir</th>
                      <th className="px-2 py-2">Agama</th>
                      <th className="px-2 py-2">Pendidikan</th>
                      <th className="px-2 py-2">Pekerjaan</th>
                      <th className="px-2 py-2 text-center">Gol</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {household.members.map((member, idx) => (
                      <tr key={member.nik} className="hover:bg-slate-50 transition-colors">
                        <td className="px-2 py-2.5 text-center font-bold text-slate-500">
                          {idx + 1}
                        </td>
                        <td className="px-2 py-2.5 font-bold text-slate-900 whitespace-nowrap">
                          {member.fullName}
                          {member.relationship === 'Kepala Keluarga' && (
                            <span className="ml-1.5 px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] rounded font-bold">
                              Kepala KK
                            </span>
                          )}
                        </td>
                        <td className="px-2 py-2.5 font-mono whitespace-nowrap">
                          <div className="inline-flex items-center gap-1">
                            <span className="font-semibold text-slate-800 bg-slate-100 px-1 py-0.5 rounded">
                              {maskNik(member.nik)}
                            </span>
                            <button
                              onClick={() => handleCopyNik(member.nik)}
                              className="p-1 hover:bg-slate-200 rounded text-slate-500"
                              title="Salin NIK"
                            >
                              {copiedNik === member.nik ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="px-2 py-2.5 whitespace-nowrap">
                          {member.gender === 'Laki-laki' ? 'L' : 'P'}
                        </td>
                        <td className="px-2 py-2.5 whitespace-nowrap text-slate-700">
                          {member.birthPlace}, {member.birthDate}
                        </td>
                        <td className="px-2 py-2.5 whitespace-nowrap">{member.religion}</td>
                        <td className="px-2 py-2.5 whitespace-nowrap">{member.education}</td>
                        <td className="px-2 py-2.5 whitespace-nowrap text-slate-700">
                          {member.occupation}
                        </td>
                        <td className="px-2 py-2.5 text-center font-bold text-slate-600">
                          {member.bloodType}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* TABEL II: STATUS HUBUNGAN & KEWARGANEGARAAN */}
            <div className="my-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
                Tabel II: Hubungan Keluarga, Status Perkawinan & DPT
              </h3>

              <div className="overflow-x-auto border border-slate-300 rounded-xl">
                <table className="w-full text-[11px] text-left">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300 uppercase">
                    <tr>
                      <th className="px-2 py-2 text-center w-8">No</th>
                      <th className="px-2 py-2">Status Hubungan</th>
                      <th className="px-2 py-2">Status Kawin</th>
                      <th className="px-2 py-2">Warga Negara</th>
                      <th className="px-2 py-2">Nama Ayah</th>
                      <th className="px-2 py-2">Nama Ibu</th>
                      <th className="px-2 py-2 text-center">Hak Suara (DPT RT)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {household.members.map((member, idx) => (
                      <tr key={`rel-${member.nik}`} className="hover:bg-slate-50 transition-colors">
                        <td className="px-2 py-2 text-center font-bold text-slate-500">
                          {idx + 1}
                        </td>
                        <td className="px-2 py-2 font-semibold text-slate-800 whitespace-nowrap">
                          {member.relationship}
                        </td>
                        <td className="px-2 py-2 whitespace-nowrap">{member.maritalStatus}</td>
                        <td className="px-2 py-2 whitespace-nowrap font-medium text-slate-700">
                          {member.citizenship}
                        </td>
                        <td className="px-2 py-2 whitespace-nowrap text-slate-600">
                          {member.fatherName || '-'}
                        </td>
                        <td className="px-2 py-2 whitespace-nowrap text-slate-600">
                          {member.motherName || '-'}
                        </td>
                        <td className="px-2 py-2 text-center whitespace-nowrap">
                          {member.isVoter ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              ✓ DPT RT 04
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-500">
                              {isDalamWilayah ? 'Belum Usia DPT' : 'DPT Luar Wilayah'}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Official Validation & Digital Stamp Area */}
            <div className="pt-4 border-t-2 border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-slate-900 block">Catatan Administrasi Lingkungan:</span>
                <p className="text-[11px] text-slate-600 leading-snug">
                  {household.notes || 'Data kependudukan terdata lengkap dan aktif dalam database sensus warga RT 04.'}
                </p>
                <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    Disahkan di Jakarta Selatan, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block">Verifikasi Digital</span>
                  <span className="font-bold text-slate-900 text-xs block">
                    Pengurus RT 04 / RW 08
                  </span>
                  <span className="text-[9px] text-emerald-700 font-mono block">
                    KODE: REG-KK-{household.id.toUpperCase()}-VERIFIED
                  </span>
                </div>

                <div className="w-14 h-14 bg-white p-1 rounded-lg border border-slate-300 flex items-center justify-center shadow-xs">
                  <QrCode className="w-full h-full text-slate-800" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyAllData}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              {copiedAll ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Tersalin ke Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-600" />
                  <span>Salin Rekap Teks KK</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Cetak / PDF</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
          >
            Tutup Salinan KK
          </button>
        </div>
      </div>
    </div>
  );
};
