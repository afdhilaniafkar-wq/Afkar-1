import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Clock,
  QrCode,
  CreditCard,
  Building,
  Receipt,
  FileCheck,
  ShieldCheck,
  ArrowRight,
  Copy,
  Check,
  Info,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { DuesBill } from '../types';

interface BillPortalModalProps {
  bill: DuesBill | null;
  isOpen: boolean;
  onClose: () => void;
  onPayBill: (bill: DuesBill) => void;
  onViewReceipt: (bill: DuesBill) => void;
}

export const BillPortalModal: React.FC<BillPortalModalProps> = ({
  bill,
  isOpen,
  onClose,
  onPayBill,
  onViewReceipt,
}) => {
  const [copiedVA, setCopiedVA] = useState(false);
  const [activePaymentTab, setActivePaymentTab] = useState<'qris' | 'va' | 'tunai'>('qris');

  if (!isOpen || !bill) return null;

  const isPaid = bill.status === 'lunas';

  const handleCopyVA = (va: string) => {
    navigator.clipboard.writeText(va.replace(/\s/g, ''));
    setCopiedVA(true);
    setTimeout(() => setCopiedVA(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Portal Top Bar */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shadow-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-xs font-bold tracking-tight text-white">Portal Iuran RT 04</h2>
                <span className="text-[9px] font-bold px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-400/30">
                  Resmi RW 08
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Verifikasi Status & Instruksi Pembayaran</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Portal Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* Resident Identity Banner */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Identitas Hunian Warga
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                  {bill.residentName || 'Bramantyo Wardhana'}
                </h3>
                <span className="text-xs text-slate-600 font-medium">
                  {bill.houseNumber || 'Blok B4 No. 12'} · RT 04 / RW 08
                </span>
              </div>

              <div className="text-right">
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {isPaid ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>LUNAS</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>BELUM BAYAR</span>
                    </>
                  )}
                </span>
                <div className="text-base font-bold font-mono text-slate-900 mt-1 tabular-nums">
                  Rp {bill.totalAmount.toLocaleString('id-ID')}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
              <span>Periode Iuran: <strong>{bill.month}</strong></span>
              <span>Jatuh Tempo: <strong>{bill.dueDate}</strong></span>
            </div>
          </div>

          {/* Breakdown Component */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5 text-[11px] text-slate-600">
            <span className="font-bold text-slate-800 text-[10px] uppercase tracking-wider block mb-1">
              Rincian Komponen Tagihan
            </span>
            <div className="flex justify-between">
              <span>• Pos Ronda & Keamanan Satpam</span>
              <span className="font-mono tabular-nums">
                Rp {bill.breakdown.keamanan.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="flex justify-between">
              <span>• Angkutan Sampah DLH & Kebersihan</span>
              <span className="font-mono tabular-nums">
                Rp {bill.breakdown.kebersihan.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="flex justify-between">
              <span>• Dana Kas Sosial Warga RT</span>
              <span className="font-mono tabular-nums">
                Rp {bill.breakdown.kasSosial.toLocaleString('id-ID')}
              </span>
            </div>
            {bill.breakdown.perawatanLingkungan && (
              <div className="flex justify-between">
                <span>• Perawatan Fasilitas & PJU</span>
                <span className="font-mono tabular-nums">
                  Rp {bill.breakdown.perawatanLingkungan.toLocaleString('id-ID')}
                </span>
              </div>
            )}
          </div>

          {/* Conditional Display: If PAID vs If UNPAID */}
          {isPaid ? (
            /* PAID STATE: Official Digital Receipt Verification */
            <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-emerald-950 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Status Pembayaran Telah Sah & Terverifikasi</span>
              </div>

              <div className="text-[11px] text-emerald-900/90 space-y-1 bg-white/80 p-3 rounded-xl border border-emerald-100 font-sans">
                <div className="flex justify-between">
                  <span className="text-slate-500">Nomor Kuitansi Resmi:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {bill.receiptNumber || 'KWT-RT04-2026-LUNAS'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Waktu Pembayaran:</span>
                  <span className="font-semibold text-slate-800">
                    {bill.paidAt || 'Telah Diverifikasi Bendahara'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Metode Bayar:</span>
                  <span className="font-semibold uppercase text-slate-800">
                    {bill.paymentMethod ? bill.paymentMethod.replace('_', ' ') : 'QRIS DIGITAL'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onViewReceipt(bill)}
                className="w-full h-10 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>Lihat & Cetak Kuitansi Resmi RT 04</span>
              </button>
            </div>
          ) : (
            /* UNPAID STATE: Full Payment Instructions for Scanning Resident / Family */
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-emerald-600" />
                  <span>Petunjuk & Saluran Pembayaran Iuran</span>
                </h4>
                <span className="text-[10px] text-slate-500">Pilih Metode:</span>
              </div>

              {/* Payment Method Tabs */}
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => setActivePaymentTab('qris')}
                  className={`py-1.5 rounded-lg transition-all ${
                    activePaymentTab === 'qris'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  QRIS Nasional
                </button>
                <button
                  type="button"
                  onClick={() => setActivePaymentTab('va')}
                  className={`py-1.5 rounded-lg transition-all ${
                    activePaymentTab === 'va'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Virtual Account
                </button>
                <button
                  type="button"
                  onClick={() => setActivePaymentTab('tunai')}
                  className={`py-1.5 rounded-lg transition-all ${
                    activePaymentTab === 'tunai'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Kas Bendahara
                </button>
              </div>

              {/* Tab 1: QRIS Instruction */}
              {activePaymentTab === 'qris' && (
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
                  <span className="font-bold text-[11px] text-slate-800 block">
                    Scan QRIS Kas RT 04 dengan E-Wallet / M-Banking
                  </span>
                  <div className="p-2 bg-white rounded-xl border border-slate-200 inline-block">
                    <QrCode className="w-32 h-32 mx-auto text-slate-900" />
                  </div>
                  <p className="text-[10px] text-slate-600">
                    Bisa di-scan menggunakan GoPay, OVO, Dana, ShopeePay, BCA Mobile, Livin, atau BRImo.
                    Penerima: <strong>KAS RT 04 GRIYA SEJAHTERA</strong>
                  </p>
                </div>
              )}

              {/* Tab 2: Virtual Account Instruction */}
              {activePaymentTab === 'va' && (
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-[11px]">
                  <div>
                    <span className="text-[10px] text-slate-500 block">BCA Virtual Account:</span>
                    <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200 mt-0.5">
                      <span className="font-mono font-bold text-slate-900">8004 0812 8765 4321</span>
                      <button
                        onClick={() => handleCopyVA('8004 0812 8765 4321')}
                        className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-semibold text-slate-700"
                      >
                        {copiedVA ? 'Tersalin' : 'Salin'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 block">Mandiri Virtual Account:</span>
                    <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200 mt-0.5">
                      <span className="font-mono font-bold text-slate-900">8904 0812 8765 4321</span>
                      <button
                        onClick={() => handleCopyVA('8904 0812 8765 4321')}
                        className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-semibold text-slate-700"
                      >
                        Salin
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Tunai Bendahara Instruction */}
              {activePaymentTab === 'tunai' && (
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-950 text-[11px] space-y-1">
                  <span className="font-bold block">Bendahara RT 04: Ibu Hj. Yanti</span>
                  <p className="text-amber-900 leading-relaxed">
                    Alamat: Rumah Blok B1 No. 02 RT 04 (Buka jam 08.00 - 20.00 WIB).
                    Warga dapat menyetorkan iuran secara langsung dan mendapatkan bukti tanda terima fisik.
                  </p>
                </div>
              )}

              {/* CTA: Pay on behalf or for this bill */}
              <div className="pt-2">
                <button
                  onClick={() => onPayBill(bill)}
                  className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-700/20 flex items-center justify-center gap-1.5 transition-all"
                >
                  <Receipt className="w-4 h-4" />
                  <span>Bayarkan Tagihan Ini Sekarang (Rp {bill.totalAmount.toLocaleString('id-ID')})</span>
                </button>
                <p className="text-[10px] text-center text-slate-500 mt-1.5">
                  Anggota keluarga, penyewa, atau tetangga dapat membayarkan iuran ini secara instan.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
          <button
            onClick={onClose}
            className="w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
          >
            Tutup Portal
          </button>
        </div>
      </div>
    </div>
  );
};
