import React, { useState } from 'react';
import {
  X,
  ScanLine,
  Camera,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  QrCode,
  Building,
} from 'lucide-react';
import { DuesBill } from '../types';

interface BillScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  bills: DuesBill[];
  onSelectScannedBill: (bill: DuesBill) => void;
}

export const BillScannerModal: React.FC<BillScannerModalProps> = ({
  isOpen,
  onClose,
  bills,
  onSelectScannedBill,
}) => {
  const [tokenInput, setTokenInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const query = tokenInput.trim().toLowerCase();
    if (!query) {
      setErrorMsg('Masukkan kode tagihan atau nomor token');
      return;
    }

    const found = bills.find(
      (b) =>
        b.id.toLowerCase() === query ||
        (b.portalToken && b.portalToken.toLowerCase().includes(query)) ||
        (b.houseNumber && b.houseNumber.toLowerCase().includes(query))
    );

    if (found) {
      setErrorMsg('');
      onSelectScannedBill(found);
      onClose();
    } else {
      setErrorMsg('Tagihan tidak ditemukan. Periksa kembali token atau nomor hunian.');
    }
  };

  const handleQuickScan = (bill: DuesBill) => {
    onSelectScannedBill(bill);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <ScanLine className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-slate-900">Pindai QR Tagihan Warga</h2>
              <p className="text-[10px] text-slate-500">Lihat instruksi & status iuran hunian</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* Simulated Camera Viewfinder */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 text-white p-6 flex flex-col items-center justify-center border border-slate-800 shadow-inner">
            {/* Viewfinder Target Reticle */}
            <div className="w-40 h-40 border-2 border-emerald-400/80 rounded-2xl relative flex items-center justify-center bg-slate-900/40">
              <div className="absolute inset-x-2 h-0.5 bg-emerald-400/90 animate-pulse shadow-sm shadow-emerald-400" />
              <Camera className="w-8 h-8 text-emerald-400/60" />
            </div>
            <span className="text-[10px] text-slate-400 mt-3 font-medium">
              Arahkan kamera ke QR Code Tagihan Iuran Warga
            </span>
          </div>

          {/* Quick Select Presets for Testing / Real Usage */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-700 block">
              Pilih Simulasi Tagihan Warga yang Dipindai:
            </span>
            <div className="space-y-1.5">
              {bills.map((bill) => (
                <button
                  key={bill.id}
                  onClick={() => handleQuickScan(bill)}
                  className="w-full p-2.5 bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-300 rounded-xl text-left flex items-center justify-between transition-all group"
                >
                  <div>
                    <div className="font-bold text-[11px] text-slate-900 group-hover:text-emerald-950">
                      {bill.month} · {bill.houseNumber || 'Blok B4 No. 12'}
                    </div>
                    <span className="text-[10px] text-slate-500">
                      Rp {bill.totalAmount.toLocaleString('id-ID')} · {bill.residentName || 'Bramantyo'}
                    </span>
                  </div>

                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      bill.status === 'lunas'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {bill.status === 'lunas' ? 'Lunas' : 'Belum Bayar'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Manual Token Search */}
          <form onSubmit={handleLookup} className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-[11px] font-semibold text-slate-700">
              Atau Masukkan Nomor Token / Blok Rumah:
            </label>
            <div className="flex gap-1.5">
              <input
                type="text"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="Misal: RT04-B412 atau B4"
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Cari
              </button>
            </div>
            {errorMsg && <p className="text-[10px] text-rose-500 mt-1">{errorMsg}</p>}
          </form>
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
