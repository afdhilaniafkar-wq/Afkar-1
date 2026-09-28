import React, { useState, useEffect } from 'react';
import {
  X,
  QrCode,
  CreditCard,
  Building,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  Upload,
  ArrowRight,
  Info,
} from 'lucide-react';
import { DuesBill, PaymentMethod } from '../types';

interface PaymentModalProps {
  bill: DuesBill | null;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (billId: string, method: PaymentMethod, receiptNumber: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  bill,
  isOpen,
  onClose,
  onPaymentSuccess,
}) => {
  const [method, setMethod] = useState<PaymentMethod>('qris');
  const [selectedBank, setSelectedBank] = useState<'bca' | 'mandiri' | 'bri'>('bca');
  const [copiedVA, setCopiedVA] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [countdown, setCountdown] = useState(899); // 14:59

  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen || !bill) return null;

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getVANumber = () => {
    if (selectedBank === 'bca') return '8004 0812 8765 4321';
    if (selectedBank === 'mandiri') return '8904 0812 8765 4321';
    return '1204 0812 8765 4321';
  };

  const handleCopyVA = () => {
    navigator.clipboard.writeText(getVANumber().replace(/\s/g, ''));
    setCopiedVA(true);
    setTimeout(() => setCopiedVA(false), 2000);
  };

  const handleSimulateSuccess = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const generatedReceipt = `KWT-RT04-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.floor(100 + Math.random() * 900)}`;
      setIsProcessing(false);
      onPaymentSuccess(bill.id, method, generatedReceipt);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-base font-bold text-slate-900">Pembayaran Iuran RT 04</h2>
            <p className="text-xs text-slate-500 mt-0.5">Periode: {bill.month}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* Summary Box */}
          <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-emerald-800 font-medium">Total Tagihan Lingkungan</span>
              <span className="text-lg font-bold text-emerald-950 font-mono tabular-nums">
                Rp {bill.totalAmount.toLocaleString('id-ID')}
              </span>
            </div>

            <div className="pt-2 border-t border-emerald-200/70 space-y-1 text-[11px] text-emerald-900/80">
              <div className="flex justify-between">
                <span>• Iuran Keamanan & Satpam</span>
                <span className="font-mono tabular-nums">Rp {bill.breakdown.keamanan.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span>• Kebersihan & Angkut Sampah</span>
                <span className="font-mono tabular-nums">Rp {bill.breakdown.kebersihan.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span>• Kas Sosial & Fasum Warga</span>
                <span className="font-mono tabular-nums">Rp {bill.breakdown.kasSosial.toLocaleString('id-ID')}</span>
              </div>
              {bill.breakdown.perawatanLingkungan && (
                <div className="flex justify-between">
                  <span>• Perawatan Jalan & Taman</span>
                  <span className="font-mono tabular-nums">
                    Rp {bill.breakdown.perawatanLingkungan.toLocaleString('id-ID')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Pilih Metode Pembayaran
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMethod('qris')}
                className={`flex flex-col items-center p-2.5 rounded-xl border transition-all ${
                  method === 'qris'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-500'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <QrCode className="w-5 h-5 mb-1 text-emerald-600" />
                <span className="font-bold text-[11px]">QRIS</span>
                <span className="text-[9px] text-slate-500">Semua E-Wallet</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('va_bca')}
                className={`flex flex-col items-center p-2.5 rounded-xl border transition-all ${
                  method.startsWith('va')
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-500'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <CreditCard className="w-5 h-5 mb-1 text-sky-600" />
                <span className="font-bold text-[11px]">Virtual Account</span>
                <span className="text-[9px] text-slate-500">BCA, Mandiri, BRI</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('tunai_bendahara')}
                className={`flex flex-col items-center p-2.5 rounded-xl border transition-all ${
                  method === 'tunai_bendahara'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-500'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <Building className="w-5 h-5 mb-1 text-amber-600" />
                <span className="font-bold text-[11px]">Kas Bendahara</span>
                <span className="text-[9px] text-slate-500">Transfer/Tunai</span>
              </button>
            </div>
          </div>

          {/* Tab 1: QRIS Display */}
          {method === 'qris' && (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col items-center text-center space-y-3">
              <div className="flex items-center justify-between w-full px-2 text-[11px] text-slate-600">
                <span className="font-semibold text-slate-700">QRIS STANDAR NASIONAL</span>
                <span className="font-mono font-bold text-rose-600 tabular-nums">
                  Kedaluwarsa: {formatCountdown(countdown)}
                </span>
              </div>

              {/* Dynamic QR Code Canvas */}
              <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-200 inline-block relative">
                <svg
                  className="w-44 h-44 mx-auto"
                  viewBox="0 0 160 160"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="160" height="160" fill="white" />
                  {/* Outer markers */}
                  <rect x="12" y="12" width="40" height="40" rx="4" fill="#0f172a" />
                  <rect x="18" y="18" width="28" height="28" fill="white" />
                  <rect x="24" y="24" width="16" height="16" rx="2" fill="#0f172a" />

                  <rect x="108" y="12" width="40" height="40" rx="4" fill="#0f172a" />
                  <rect x="114" y="18" width="28" height="28" fill="white" />
                  <rect x="120" y="24" width="16" height="16" rx="2" fill="#0f172a" />

                  <rect x="12" y="108" width="40" height="40" rx="4" fill="#0f172a" />
                  <rect x="18" y="114" width="28" height="28" fill="white" />
                  <rect x="24" y="120" width="16" height="16" rx="2" fill="#0f172a" />

                  {/* Random QR data points pattern */}
                  <rect x="60" y="16" width="10" height="10" fill="#0f172a" />
                  <rect x="76" y="16" width="18" height="8" fill="#0f172a" />
                  <rect x="64" y="32" width="8" height="14" fill="#0f172a" />
                  <rect x="80" y="30" width="14" height="10" fill="#0f172a" />
                  <rect x="60" y="52" width="38" height="8" fill="#0f172a" />

                  <rect x="16" y="62" width="32" height="10" fill="#0f172a" />
                  <rect x="16" y="78" width="12" height="14" fill="#0f172a" />
                  <rect x="36" y="80" width="14" height="16" fill="#0f172a" />

                  {/* Center emblem */}
                  <rect x="60" y="68" width="40" height="40" rx="8" fill="#059669" />
                  <path
                    d="M72 88L78 94L88 82"
                    stroke="white"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <rect x="108" y="62" width="14" height="16" fill="#0f172a" />
                  <rect x="130" y="62" width="18" height="10" fill="#0f172a" />
                  <rect x="112" y="86" width="36" height="8" fill="#0f172a" />

                  <rect x="60" y="116" width="16" height="12" fill="#0f172a" />
                  <rect x="82" y="116" width="16" height="28" fill="#0f172a" />
                  <rect x="60" y="134" width="14" height="14" fill="#0f172a" />

                  <rect x="108" y="108" width="18" height="12" fill="#0f172a" />
                  <rect x="132" y="112" width="16" height="14" fill="#0f172a" />
                  <rect x="108" y="130" width="38" height="14" fill="#0f172a" />
                </svg>

                <div className="mt-1 text-[10px] font-mono text-slate-500 font-semibold">
                  NMID: ID1020260408129
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-800 text-xs block">
                  KAS RT 04 GRIYA SEJAHTERA
                </span>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Buka aplikasi GoPay, OVO, Dana, BCA Mobile, Livin, atau BRImo Anda lalu scan kode di atas.
                </p>
              </div>
            </div>
          )}

          {/* Tab 2: Virtual Account */}
          {method.startsWith('va') && (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex gap-2">
                {[
                  { id: 'bca', name: 'BCA Virtual Account' },
                  { id: 'mandiri', name: 'Mandiri VA' },
                  { id: 'bri', name: 'BRI BRIVA' },
                ].map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSelectedBank(b.id as any)}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-semibold transition-all ${
                      selectedBank === b.id
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {b.id.toUpperCase()}
                  </button>
                ))}
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 block mb-1">Nomor Virtual Account RT 04:</span>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-base font-bold text-slate-900 tracking-wider">
                    {getVANumber()}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyVA}
                    className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[11px] font-medium transition-colors"
                  >
                    {copiedVA ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-semibold">Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>Salin No</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 space-y-1">
                <p>1. Masuk menu Transfer &gt; Virtual Account pada Mobile Banking</p>
                <p>2. Masukkan nomor VA di atas, nama penerima akan muncul <strong>KAS RT 04 BRAMANTYO</strong></p>
                <p>3. Konfirmasi pembayaran sejumlah <strong>Rp {bill.totalAmount.toLocaleString('id-ID')}</strong></p>
              </div>
            </div>
          )}

          {/* Tab 3: Tunai / Manual Bendahara */}
          {method === 'tunai_bendahara' && (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs">
                <div className="font-semibold flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>Bendahara RT 04: Ibu Hj. Yanti</span>
                </div>
                <p className="text-[11px] text-amber-800">
                  Alamat: Rumah Blok B1 No. 02 (Buka setiap hari 08.00 - 20.00 WIB)
                  <br />
                  Nomor Rekening Kas RT: Bank Mandiri 127-00-9988771-0 a.n KAS RT 04 RW 08
                </p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-dashed border-slate-300 text-center">
                <Upload className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                <span className="text-[11px] font-medium text-slate-700 block">
                  Simulasi Unggah Struk / Bukti Transfer Manual
                </span>
                <span className="text-[10px] text-slate-500">
                  Foto struk ATM atau screenshot m-banking
                </span>
              </div>
            </div>
          )}

          {/* Simulation Action CTA */}
          <div className="pt-2">
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleSimulateSuccess}
              className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-semibold rounded-xl transition-all shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 text-xs"
            >
              {isProcessing ? (
                <span>Memproses Verifikasi Pembayaran...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simulasikan Pembayaran Berhasil (Instan)</span>
                </>
              )}
            </button>
            <p className="text-[10px] text-center text-slate-600 mt-2">
              Sistem akan otomatis mencatat kas RT dan menerbitkan Kuitansi Digital Resmi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
