import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  X,
  QrCode,
  Download,
  Share2,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Home,
  Receipt,
  ScanLine,
} from 'lucide-react';
import { DuesBill } from '../types';

interface BillQrModalProps {
  bill: DuesBill | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenPortal: (bill: DuesBill) => void;
}

export const BillQrModal: React.FC<BillQrModalProps> = ({
  bill,
  isOpen,
  onClose,
  onOpenPortal,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (!bill || !isOpen) return;

    // Generate real scannable QR payload containing portal direct URL
    const baseUrl = typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : 'https://wargahub.id';
    const portalUrl = `${baseUrl}?portalBillId=${bill.id}&token=${bill.portalToken || 'RT04'}`;

    QRCode.toDataURL(portalUrl, {
      width: 320,
      margin: 1.5,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Error generating QR code:', err));
  }, [bill, isOpen]);

  if (!isOpen || !bill) return null;

  const baseUrl = typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : 'https://wargahub.id';
  const portalUrl = `${baseUrl}?portalBillId=${bill.id}&token=${bill.portalToken || 'RT04'}`;

  const handleCopyPortalLink = () => {
    navigator.clipboard.writeText(portalUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `QR-Tagihan-${bill.houseNumber || 'RT04'}-${bill.month.replace(/\s+/g, '-')}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleShareWhatsApp = () => {
    const text = `Halo, berikut QR Code dan Portal Status Pembayaran Iuran RT 04 (${bill.month}) untuk hunian ${bill.houseNumber || 'Blok B4 No. 12'} sejumlah Rp ${bill.totalAmount.toLocaleString('id-ID')}.\n\nBuka portal resmi RT 04: ${portalUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const isPaid = bill.status === 'lunas';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-3xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-slate-900">QR Code Tagihan Iuran RT 04</h2>
              <p className="text-[10px] text-slate-500">Pindai untuk instruksi & portal status</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable QR Body */}
        <div className="flex-1 overflow-y-auto p-5 text-center space-y-4 text-xs">
          {/* Identity Pill */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-left">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-medium">
                  Hunian & Warga
                </span>
                <span className="font-bold text-slate-900 text-xs block">
                  {bill.residentName || 'Bramantyo Wardhana'}
                </span>
                <span className="text-[11px] text-slate-600">
                  {bill.houseNumber || 'Blok B4 No. 12'} · RT 04 / RW 08
                </span>
              </div>

              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}
              >
                {isPaid ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Lunas</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-3 h-3 text-amber-600" />
                    <span>Belum Bayar</span>
                  </>
                )}
              </span>
            </div>

            <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Iuran Periode: {bill.month}</span>
              <span className="font-mono font-bold text-slate-900 tabular-nums">
                Rp {bill.totalAmount.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Dynamic Generated Scannable QR Code Canvas */}
          <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-sm inline-block mx-auto relative group">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`QR Tagihan ${bill.month}`}
                className="w-56 h-56 mx-auto rounded-xl object-contain"
              />
            ) : (
              <div className="w-56 h-56 flex items-center justify-center bg-slate-50 rounded-xl">
                <QrCode className="w-10 h-10 text-slate-400 animate-pulse" />
              </div>
            )}

            <div className="mt-2 text-[10px] font-mono text-slate-500 font-semibold tracking-wider">
              TOKEN: {bill.portalToken || `RT04-${bill.id}`}
            </div>
          </div>

          <p className="text-[11px] text-slate-600 leading-relaxed px-1">
            Arahkan kamera smartphone warga lain, keluarga, atau pengurus RT untuk langsung melihat
            <strong> petunjuk pembayaran</strong> atau <strong>memvalidasi status lunas</strong> tagihan ini.
          </p>

          {/* Action: Open/Simulate Portal Redirection */}
          <button
            onClick={() => onOpenPortal(bill)}
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-2xl text-xs font-bold shadow-sm shadow-emerald-700/20 flex items-center justify-center gap-1.5 transition-all"
          >
            <ScanLine className="w-4 h-4" />
            <span>Simulasikan Scan & Buka Portal Pembayaran</span>
          </button>

          {/* Secondary Action Grid */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleCopyPortalLink}
              className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Salin Tautan</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadQr}
              className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Simpan Gambar</span>
            </button>
          </div>

          <button
            onClick={handleShareWhatsApp}
            className="w-full py-2 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 border border-emerald-200/80 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Bagikan QR via WhatsApp Warga</span>
          </button>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
          <button
            onClick={onClose}
            className="w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
