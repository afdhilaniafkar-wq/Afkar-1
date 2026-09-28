import React from 'react';
import { X, CheckCircle2, Printer, Share2, Building2, ShieldCheck, QrCode } from 'lucide-react';
import { DuesBill } from '../types';

interface ReceiptModalProps {
  bill: DuesBill | null;
  isOpen: boolean;
  onClose: () => void;
  residentName: string;
  residentHouse: string;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  bill,
  isOpen,
  onClose,
  residentName,
  residentHouse,
}) => {
  if (!isOpen || !bill) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Modal Top Bar */}
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Kuitansi Digital Resmi RT 04</span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Receipt Paper Canvas */}
        <div className="flex-1 overflow-y-auto p-5 text-xs text-slate-800 space-y-4">
          <div className="border border-slate-200 rounded-2xl p-5 bg-white relative overflow-hidden shadow-xs">
            {/* Header Stamp */}
            <div className="text-center pb-3 border-b border-slate-200">
              <div className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-600 text-white mb-1.5 shadow-xs">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                PENGURUS RUKUN TETANGGA 04 / RW 08
              </h3>
              <p className="text-[11px] text-slate-600">
                Komplek Griya Sejahtera, Kel. Sukamaju
              </p>
              <div className="mt-2 inline-block px-2.5 py-0.5 bg-emerald-50 text-emerald-800 font-bold text-[10px] tracking-wider rounded border border-emerald-200 uppercase">
                Bukti Pembayaran Iuran Sah
              </div>
            </div>

            {/* Stamp LUNAS Overlay */}
            <div className="absolute right-4 top-24 rotate-[-12deg] pointer-events-none opacity-85">
              <div className="border-2 border-emerald-600 text-emerald-600 px-3 py-1 rounded-lg text-center font-extrabold text-xs uppercase tracking-widest bg-white/80 shadow-xs">
                LUNAS
                <span className="block text-[8px] font-medium tracking-normal text-emerald-700">
                  TERVERIFIKASI
                </span>
              </div>
            </div>

            {/* Receipt Info Grid */}
            <div className="py-3 space-y-2 text-[11px] border-b border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-600">Nomor Resi:</span>
                <span className="font-mono font-bold text-slate-900">
                  {bill.receiptNumber || `KWT-RT04-${bill.year}-091`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Tanggal Bayar:</span>
                <span className="font-medium text-slate-800">
                  {bill.paidAt || '28 September 2026, 12:13 WIB'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Nama Warga / KK:</span>
                <span className="font-semibold text-slate-900">{residentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">No. Rumah / Blok:</span>
                <span className="font-semibold text-slate-900">{residentHouse}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Periode Iuran:</span>
                <span className="font-bold text-emerald-700">{bill.month}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Metode Bayar:</span>
                <span className="font-semibold uppercase text-slate-800">
                  {bill.paymentMethod ? bill.paymentMethod.replace('_', ' ') : 'QRIS NASIONAL'}
                </span>
              </div>
            </div>

            {/* Breakdown Table */}
            <div className="py-3 border-b border-slate-100 space-y-1.5 text-[11px]">
              <span className="font-semibold text-slate-700 block text-[10px] uppercase tracking-wider text-slate-600">
                Rincian Tagihan
              </span>
              <div className="flex justify-between text-slate-600">
                <span>1. Keamanan & Pos Ronda Satpam</span>
                <span className="font-mono tabular-nums">
                  Rp {bill.breakdown.keamanan.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>2. Retribusi Angkut Sampah & Kebersihan</span>
                <span className="font-mono tabular-nums">
                  Rp {bill.breakdown.kebersihan.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>3. Kas Sosial Warga & Santunan</span>
                <span className="font-mono tabular-nums">
                  Rp {bill.breakdown.kasSosial.toLocaleString('id-ID')}
                </span>
              </div>
              {bill.breakdown.perawatanLingkungan && (
                <div className="flex justify-between text-slate-600">
                  <span>4. Perawatan Taman & PJU</span>
                  <span className="font-mono tabular-nums">
                    Rp {bill.breakdown.perawatanLingkungan.toLocaleString('id-ID')}
                  </span>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="pt-3 pb-1 flex justify-between items-center text-xs">
              <span className="font-bold text-slate-900">TOTAL PEMBAYARAN:</span>
              <span className="font-mono font-bold text-base text-emerald-700 tabular-nums">
                Rp {bill.totalAmount.toLocaleString('id-ID')}
              </span>
            </div>

            {/* Footer Verifikasi */}
            <div className="mt-4 pt-3 border-t border-dashed border-slate-200 flex items-center justify-between text-[10px] text-slate-600">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 p-1 border border-slate-300 rounded bg-white">
                  <QrCode className="w-full h-full text-slate-800" />
                </div>
                <div>
                  <span className="block font-medium text-slate-700">QR Validasi Sistem</span>
                  <span>Otentikasi RT 04</span>
                </div>
              </div>
              <div className="text-right">
                <span className="block font-semibold text-slate-800">Bendahara RT 04</span>
                <span className="text-[9px] text-slate-600">Ibu Hj. Yanti</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex-1 h-10 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak / Simpan PDF</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 h-10 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-semibold transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
