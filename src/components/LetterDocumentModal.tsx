import React, { useState } from 'react';
import {
  X,
  Printer,
  Download,
  Share2,
  CheckCircle2,
  ShieldCheck,
  QrCode,
  Building2,
  Calendar,
  Check,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { LetterRequest } from '../types';

interface LetterDocumentModalProps {
  letter: LetterRequest | null;
  isOpen: boolean;
  onClose: () => void;
}

const LETTER_TITLE_MAP: Record<string, string> = {
  domisili: 'SURAT KETERANGAN DOMISILI TEMPAT TINGGAL',
  pengantar_ktp: 'SURAT PENGANTAR KARTU TANDA PENDUDUK / KARTU KELUARGA',
  keterangan_usaha: 'SURAT KETERANGAN DOMISILI TEMPAT USAHA (UMKM)',
  pengantar_nikah: 'SURAT PENGANTAR KETERANGAN MENIKAH (MODEL N1 - N4)',
  skck_kelakuan_baik: 'SURAT KETERANGAN CATATAN LINGKUNGAN / SKCK',
  keterangan_tidak_mampu: 'SURAT KETERANGAN TIDAK MAMPU / BANTUAN SOSIAL',
  kematian_kelahiran: 'SURAT PENGANTAR KETERANGAN KELAHIRAN / KEMATIAN',
};

export const LetterDocumentModal: React.FC<LetterDocumentModalProps> = ({
  letter,
  isOpen,
  onClose,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen || !letter) return null;

  const letterTitle = LETTER_TITLE_MAP[letter.type] || 'SURAT PENGANTAR / KETERANGAN WARGA';
  const issueDate = letter.approvedAt
    ? letter.approvedAt.split(',')[0]
    : `${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyVerification = () => {
    const text = `Verifikasi Surat Pengantar Resmi RT 04: No. ${letter.referenceNumber} a.n ${letter.applicantName} (NIK: ${letter.nik}). TTE Hash: ${letter.officerSignatureHash || 'DS-RT04-VALID'}. Status: SAH & LEGAL.`;
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl max-h-[95vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Modal App Header - Hidden on Print */}
        <div className="print:hidden px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">
                  Dokumen Surat Pengantar Resmi
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Legal & Ditandatangani Digital
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                No: {letter.referenceNumber}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Paper Canvas */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100/70 text-slate-900 text-xs">
          {/* Printable White Paper Sheet (Standard A4 Letter Simulation) */}
          <div
            id="printable-letter"
            className="bg-white mx-auto max-w-[620px] p-6 sm:p-10 rounded-xl shadow-md border border-slate-200 print:shadow-none print:border-none print:p-0 font-['Times_New_Roman',serif] text-[13px] leading-relaxed relative"
          >
            {/* Watermark Logo Background (Subtle) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none">
              <Building2 className="w-96 h-96 text-slate-900" />
            </div>

            {/* KOP SURAT RESMI RT/RW */}
            <div className="text-center relative pb-3">
              <div className="flex items-center justify-center gap-4 mb-1">
                {/* Garuda / Bintang Lambang Administrasi */}
                <div className="w-14 h-14 rounded-full border-2 border-slate-900 flex items-center justify-center shrink-0 p-1">
                  <div className="w-full h-full rounded-full border border-slate-700 flex flex-col items-center justify-center text-[8px] font-bold font-sans text-center">
                    <span>RT 04</span>
                    <span>RW 08</span>
                  </div>
                </div>

                <div className="text-center">
                  <h4 className="text-[12px] font-bold uppercase tracking-widest text-slate-900 font-sans">
                    Pemerintah Kota Administrasi Jakarta Selatan
                  </h4>
                  <h4 className="text-[12px] font-bold uppercase tracking-wider text-slate-900 font-sans">
                    Kecamatan Pancoran · Kelurahan Sukamaju
                  </h4>
                  <h2 className="text-[17px] font-extrabold uppercase tracking-tight text-slate-950 font-sans mt-0.5">
                    Rukun Tetangga 04 / Rukun Warga 08
                  </h2>
                  <p className="text-[10px] text-slate-700 font-sans mt-0.5">
                    Sekretariat: Balai Pertemuan RT 04, Jl. Griya Sejahtera Blok B No. 1, Jakarta Selatan 12760
                    <br />
                    WhatsApp Resmi Pengurus: 0813-1122-3344 | Layanan Terpadu Warga Digital
                  </p>
                </div>
              </div>

              {/* Official Double Line Separator */}
              <div className="mt-2">
                <div className="w-full h-[2.5px] bg-black" />
                <div className="w-full h-[0.8px] bg-black mt-[1.5px]" />
              </div>
            </div>

            {/* NOMOR & JUDUL SURAT */}
            <div className="text-center my-4">
              <h3 className="text-sm font-extrabold tracking-wide uppercase underline underline-offset-4 text-slate-950">
                {letterTitle}
              </h3>
              <p className="font-mono text-xs font-bold text-slate-800 mt-1">
                Nomor: {letter.referenceNumber}
              </p>
            </div>

            {/* KALIMAT PENGANTAR */}
            <div className="space-y-3 text-justify">
              <p>
                Yang bertanda tangan di bawah ini, Pengurus Rukun Tetangga 04 Rukun Warga 08
                Kelurahan Sukamaju, Kecamatan Pancoran, Kota Administrasi Jakarta Selatan, dengan
                ini menerangkan dengan sebenarnya bahwa:
              </p>

              {/* TABEL BIODATA PEMOHON */}
              <div className="my-2 ml-4 space-y-1 font-sans text-[12px]">
                <div className="grid grid-cols-12 gap-1 py-0.5">
                  <span className="col-span-4 font-semibold text-slate-700">1. Nama Lengkap</span>
                  <span className="col-span-1 text-center">:</span>
                  <span className="col-span-7 font-bold text-slate-950 uppercase">
                    {letter.applicantName}
                  </span>
                </div>

                <div className="grid grid-cols-12 gap-1 py-0.5">
                  <span className="col-span-4 font-semibold text-slate-700">2. NIK (No. KTP)</span>
                  <span className="col-span-1 text-center">:</span>
                  <span className="col-span-7 font-mono font-bold text-slate-900">
                    {letter.nik}
                  </span>
                </div>

                <div className="grid grid-cols-12 gap-1 py-0.5">
                  <span className="col-span-4 font-semibold text-slate-700">3. No. Kartu Keluarga</span>
                  <span className="col-span-1 text-center">:</span>
                  <span className="col-span-7 font-mono text-slate-900">
                    {letter.noKk || '3174092408100015'}
                  </span>
                </div>

                <div className="grid grid-cols-12 gap-1 py-0.5">
                  <span className="col-span-4 font-semibold text-slate-700">4. Tempat / Tgl. Lahir</span>
                  <span className="col-span-1 text-center">:</span>
                  <span className="col-span-7 text-slate-900">
                    {letter.birthPlace || 'Jakarta'}, {letter.birthDate || '12 April 1985'}
                  </span>
                </div>

                <div className="grid grid-cols-12 gap-1 py-0.5">
                  <span className="col-span-4 font-semibold text-slate-700">5. Jenis Kelamin</span>
                  <span className="col-span-1 text-center">:</span>
                  <span className="col-span-7 text-slate-900">
                    {letter.gender || 'Laki-laki'}
                  </span>
                </div>

                <div className="grid grid-cols-12 gap-1 py-0.5">
                  <span className="col-span-4 font-semibold text-slate-700">6. Bangsa / Agama</span>
                  <span className="col-span-1 text-center">:</span>
                  <span className="col-span-7 text-slate-900">
                    {letter.nationality || 'Indonesia (WNI)'} / {letter.religion || 'Islam'}
                  </span>
                </div>

                <div className="grid grid-cols-12 gap-1 py-0.5">
                  <span className="col-span-4 font-semibold text-slate-700">7. Status Perkawinan</span>
                  <span className="col-span-1 text-center">:</span>
                  <span className="col-span-7 text-slate-900">
                    {letter.maritalStatus || 'Kawin'}
                  </span>
                </div>

                <div className="grid grid-cols-12 gap-1 py-0.5">
                  <span className="col-span-4 font-semibold text-slate-700">8. Pekerjaan</span>
                  <span className="col-span-1 text-center">:</span>
                  <span className="col-span-7 text-slate-900">
                    {letter.occupation || 'Karyawan Swasta'}
                  </span>
                </div>

                <div className="grid grid-cols-12 gap-1 py-0.5">
                  <span className="col-span-4 font-semibold text-slate-700">9. Alamat Sesuai KTP</span>
                  <span className="col-span-1 text-center">:</span>
                  <span className="col-span-7 text-slate-900">
                    {letter.addressKtp || letter.houseNumber}
                  </span>
                </div>

                <div className="grid grid-cols-12 gap-1 py-0.5">
                  <span className="col-span-4 font-semibold text-slate-700">10. Alamat Domisili</span>
                  <span className="col-span-1 text-center">:</span>
                  <span className="col-span-7 text-slate-900 font-semibold">
                    {letter.addressDomisili || `${letter.houseNumber} RT 04 RW 08 Kel. Sukamaju`}
                  </span>
                </div>

                {/* Additional conditional business details */}
                {letter.type === 'keterangan_usaha' && letter.businessName && (
                  <>
                    <div className="grid grid-cols-12 gap-1 py-0.5 pt-1 border-t border-slate-200">
                      <span className="col-span-4 font-semibold text-emerald-800">Nama Usaha / Merk</span>
                      <span className="col-span-1 text-center">:</span>
                      <span className="col-span-7 font-bold text-slate-950">
                        {letter.businessName}
                      </span>
                    </div>
                    <div className="grid grid-cols-12 gap-1 py-0.5">
                      <span className="col-span-4 font-semibold text-emerald-800">Bidang Usaha</span>
                      <span className="col-span-1 text-center">:</span>
                      <span className="col-span-7 text-slate-900">
                        {letter.businessType || 'Perdagangan & Jasa'}
                      </span>
                    </div>
                    <div className="grid grid-cols-12 gap-1 py-0.5">
                      <span className="col-span-4 font-semibold text-emerald-800">Alamat Tempat Usaha</span>
                      <span className="col-span-1 text-center">:</span>
                      <span className="col-span-7 text-slate-900">
                        {letter.businessAddress || letter.houseNumber}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* KETERANGAN STATUS & KEPERLUAN RESMI */}
              <p>
                Berdasarkan pendataan administrasi kependudukan di lingkungan RT 04 RW 08 Kelurahan
                Sukamaju, nama tersebut di atas adalah <strong>benar-benar warga penduduk kami</strong> yang
                bertempat tinggal di alamat tersebut serta tercatat berkelakuan baik, rukun bermasyarakat,
                dan memenuhi kewajiban iuran lingkungan warga.
              </p>

              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded font-sans text-[12px] space-y-1">
                <p>
                  <strong className="text-slate-800">Maksud / Keperluan:</strong> {letter.purpose}
                </p>
                <p>
                  <strong className="text-slate-800">Ditujukan Kepada:</strong>{' '}
                  {letter.destinationAgency || 'Instansi Terkait / Kelurahan Sukamaju'}
                </p>
                <p className="text-[11px] text-slate-600">
                  <strong>Masa Berlaku:</strong> Surat pengantar ini berlaku selama 30 (tiga puluh)
                  hari terhitung sejak tanggal diterbitkan hingga {letter.validUntil || '28 Oktober 2026'}.
                </p>
              </div>

              <p>
                Demikian Surat Pengantar ini dibuat dengan sebenarnya dengan penuh rasa tanggung jawab
                agar dapat dipergunakan sebagaimana mestinya untuk keperluan kelanjutan proses
                administrasi ke tahap berikutnya.
              </p>
            </div>

            {/* BLOK TANDA TANGAN LEGALITAS (3 KOLOM RESMI KENEGARAAN) */}
            <div className="mt-8 pt-2 grid grid-cols-3 gap-2 text-center font-sans text-[11px] relative">
              {/* Kolom 1: Pemohon */}
              <div className="flex flex-col justify-between h-36">
                <div>
                  <p className="text-slate-500">Tanda Tangan</p>
                  <p className="font-semibold text-slate-800">Pemohon / Warga</p>
                </div>
                <div className="mt-auto">
                  <p className="font-bold text-slate-900 uppercase underline">
                    {letter.applicantName}
                  </p>
                  <p className="text-[10px] text-slate-500">NIK: {letter.nik.slice(0, 8)}****</p>
                </div>
              </div>

              {/* Kolom 2: Mengetahui Ketua RW 08 */}
              <div className="flex flex-col justify-between h-36">
                <div>
                  <p className="text-slate-500">Mengetahui,</p>
                  <p className="font-semibold text-slate-800">Ketua RW 08</p>
                </div>
                <div className="text-[10px] text-slate-400 italic py-3">
                  (Reg. No: RW08-2026-OK)
                </div>
                <div className="mt-auto">
                  <p className="font-bold text-slate-900 uppercase underline">
                    ( Bpk. Ir. H. Bambang )
                  </p>
                  <p className="text-[10px] text-slate-500">Rukun Warga 08</p>
                </div>
              </div>

              {/* Kolom 3: Pengurus RT 04 (Lengkap TTD Digital & Cap Stempel Basah) */}
              <div className="flex flex-col justify-between h-36 relative">
                <div>
                  <p className="text-slate-700">Jakarta, {issueDate}</p>
                  <p className="font-bold text-slate-900">Ketua RT 04 / RW 08</p>
                </div>

                {/* DIGITAL SIGNATURE & OFFICIAL PURPLE STAMP OVERLAY */}
                <div className="relative my-1 flex items-center justify-center h-16">
                  {/* Digital Calligraphic Signature */}
                  <div className="font-serif italic font-bold text-slate-800 text-lg tracking-wider transform -rotate-3 select-none">
                    <span className="font-['Brush_Script_MT',cursive] text-2xl text-slate-800">
                      Budi Santoso
                    </span>
                  </div>

                  {/* Authentic Indonesian RT Official Purple Stamp */}
                  <div className="absolute -left-3 -top-2 w-24 h-24 rounded-full border-[2.5px] border-violet-800/80 flex items-center justify-center p-1 transform rotate-[-8deg] pointer-events-none select-none shadow-xs">
                    <div className="w-full h-full rounded-full border border-violet-700/80 flex flex-col items-center justify-center text-center p-0.5 text-violet-800 font-bold uppercase">
                      <span className="text-[6.5px] tracking-tight">RUKUN TETANGGA 04</span>
                      <div className="w-12 h-[1px] bg-violet-700/80 my-0.5" />
                      <span className="text-[7.5px] font-extrabold">RW 08</span>
                      <div className="w-12 h-[1px] bg-violet-700/80 my-0.5" />
                      <span className="text-[5.5px] tracking-tighter">KEL. SUKAMAJU</span>
                    </div>
                  </div>
                </div>

                <div className="mt-auto">
                  <p className="font-bold text-slate-900 uppercase underline">
                    ( {letter.officerName || 'Bpk. H. Budi Santoso'} )
                  </p>
                  <p className="text-[10px] text-slate-500">Ketua RT 04 Sukamaju</p>
                </div>
              </div>
            </div>

            {/* SECURITY VALIDATION & QR FOOTER */}
            <div className="mt-8 pt-3 border-t border-dashed border-slate-300 flex items-center justify-between text-[9px] font-sans text-slate-600">
              <div className="flex items-center gap-2.5">
                <div className="w-11 h-11 p-1 bg-white border border-slate-300 rounded shadow-xs shrink-0">
                  <QrCode className="w-full h-full text-slate-900" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block text-[10px]">
                    Sertifikasi Tanda Tangan Elektronik (TTE) RT 04
                  </span>
                  <span>Kode Hash Otentikasi: {letter.officerSignatureHash || 'DS-RT04-2026-9F8A-E42B-77CD'}</span>
                  <p className="text-slate-500">
                    Dokumen ini sah diterbitkan melalui Sistem Administrasi WargaHub RT 04 RW 08.
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[9px] border border-emerald-300">
                  ✓ DOKUMEN SAH & LEGAL
                </span>
                <span className="block text-slate-400 mt-1">Dicetak dari WargaHub Digital</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal App Footer Actions - Hidden on Print */}
        <div className="print:hidden p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyVerification}
              className="px-3 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Salin Data Verifikasi</span>
                </>
              )}
            </button>

            <span className="text-[11px] text-slate-500 hidden sm:inline">
              Dapat langsung dibawa ke Kantor Kelurahan Sukamaju / KUA / Bank
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh / Cetak Surat PDF</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
