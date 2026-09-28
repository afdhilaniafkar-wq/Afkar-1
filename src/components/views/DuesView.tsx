import React, { useState } from 'react';
import {
  Receipt,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Building,
  Plus,
  FileCheck,
  ShieldCheck,
  DollarSign,
  Download,
  QrCode,
  ScanLine,
} from 'lucide-react';
import { DuesBill, PaymentMethod, TreasuryRecord } from '../../types';
import { TreasuryChart } from '../TreasuryChart';

interface DuesViewProps {
  bills: DuesBill[];
  treasuryRecords: TreasuryRecord[];
  onOpenPayment: (bill: DuesBill) => void;
  onOpenReceipt: (bill: DuesBill) => void;
  onOpenBillQr: (bill: DuesBill) => void;
  onOpenScanner: () => void;
  userRole: 'warga' | 'pengurus';
  onAddTreasuryRecord?: (record: Omit<TreasuryRecord, 'id'>) => void;
}

export const DuesView: React.FC<DuesViewProps> = ({
  bills,
  treasuryRecords,
  onOpenPayment,
  onOpenReceipt,
  onOpenBillQr,
  onOpenScanner,
  userRole,
  onAddTreasuryRecord,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'iuran_saya' | 'kas_transparan'>('iuran_saya');
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [newExpTitle, setNewExpTitle] = useState('');
  const [newExpAmount, setNewExpAmount] = useState('');
  const [newExpCategory, setNewExpCategory] = useState('Sarana & Prasarana');
  const [newExpType, setNewExpType] = useState<'masuk' | 'keluar'>('keluar');

  // Calculate treasury numbers
  const totalInflow = treasuryRecords
    .filter((r) => r.type === 'masuk')
    .reduce((sum, r) => sum + r.amount, 0);
  const totalOutflow = treasuryRecords
    .filter((r) => r.type === 'keluar')
    .reduce((sum, r) => sum + r.amount, 0);
  const currentBalance = 18750000 + (totalInflow - 11250000) - (totalOutflow - 6570000);

  const handleAddExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpTitle.trim() || !newExpAmount) return;

    if (onAddTreasuryRecord) {
      onAddTreasuryRecord({
        title: newExpTitle.trim(),
        amount: Number(newExpAmount),
        type: newExpType,
        category: newExpCategory,
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        pic: userRole === 'pengurus' ? 'Pengurus RT 04 (Verifikasi)' : 'Bendahara RT 04',
        receiptNumber: `TRX-${Date.now().toString().slice(-6)}`,
      });
    }

    setNewExpTitle('');
    setNewExpAmount('');
    setShowAddExpenseModal(false);
  };

  return (
    <div className="flex-1 pb-24 p-4 space-y-4">
      {/* Title & Quick Scan Action */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-slate-900">Iuran & Kas Lingkungan</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pembayaran iuran digital & transparansi keuangan kas RT 04
          </p>
        </div>

        <button
          onClick={onOpenScanner}
          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
        >
          <ScanLine className="w-3.5 h-3.5 text-emerald-400" />
          <span>Pindai QR Warga</span>
        </button>
      </div>

      {/* Segmented Sub Tabs */}
      <div className="grid grid-cols-2 p-1 bg-slate-200/80 rounded-2xl text-xs font-semibold">
        <button
          onClick={() => setActiveSubTab('iuran_saya')}
          className={`py-2 rounded-xl transition-all ${
            activeSubTab === 'iuran_saya'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Tagihan Iuran Saya
        </button>
        <button
          onClick={() => setActiveSubTab('kas_transparan')}
          className={`py-2 rounded-xl transition-all ${
            activeSubTab === 'kas_transparan'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Buku Kas Transparan
        </button>
      </div>

      {/* SUBTAB 1: TAGIHAN IURAN SAYA */}
      {activeSubTab === 'iuran_saya' && (
        <div className="space-y-4">
          {/* Current Month Active Bill Card */}
          {bills.map((bill) => {
            const isUnpaid = bill.status === 'belum_bayar';

            return (
              <div
                key={bill.id}
                className={`bg-white rounded-3xl border p-4 shadow-xs transition-all space-y-3.5 ${
                  isUnpaid
                    ? 'border-amber-300 ring-2 ring-amber-400/20'
                    : 'border-slate-200'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Periode Tagihan
                    </span>
                    <h2 className="text-base font-bold text-slate-900">{bill.month}</h2>
                    <span className="text-[11px] text-slate-500">
                      Jatuh tempo: {bill.dueDate}
                    </span>
                  </div>

                  <div className="text-right">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        isUnpaid
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {isUnpaid ? (
                        <>
                          <Clock className="w-3 h-3 text-amber-600" />
                          Belum Bayar
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Lunas
                        </>
                      )}
                    </span>
                    <div className="text-base font-bold font-mono text-slate-900 mt-1 tabular-nums">
                      Rp {bill.totalAmount.toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>

                {/* Breakdown List */}
                <div className="bg-slate-50 p-3 rounded-2xl space-y-1.5 text-[11px] text-slate-600">
                  <div className="flex justify-between">
                    <span>1. Keamanan & Pos Ronda</span>
                    <span className="font-mono tabular-nums">
                      Rp {bill.breakdown.keamanan.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>2. Angkut Sampah DLH & Kebersihan</span>
                    <span className="font-mono tabular-nums">
                      Rp {bill.breakdown.kebersihan.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>3. Kas Sosial Warga & Santunan</span>
                    <span className="font-mono tabular-nums">
                      Rp {bill.breakdown.kasSosial.toLocaleString('id-ID')}
                    </span>
                  </div>
                  {bill.breakdown.perawatanLingkungan && (
                    <div className="flex justify-between">
                      <span>4. Perawatan Lampu PJU & Taman</span>
                      <span className="font-mono tabular-nums">
                        Rp {bill.breakdown.perawatanLingkungan.toLocaleString('id-ID')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action buttons: Pay/Receipt + Generate QR Code */}
                <div className="pt-1 flex items-center gap-2">
                  {isUnpaid ? (
                    <button
                      onClick={() => onOpenPayment(bill)}
                      className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-xl text-xs font-bold shadow-sm shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all"
                    >
                      <Receipt className="w-4 h-4" />
                      <span>Bayar Sekarang</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onOpenReceipt(bill)}
                      className="flex-1 h-11 bg-slate-100 hover:bg-slate-200 active:scale-98 text-slate-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                    >
                      <FileCheck className="w-4 h-4 text-emerald-600" />
                      <span>Kuitansi Resmi RT</span>
                    </button>
                  )}

                  <button
                    onClick={() => onOpenBillQr(bill)}
                    title="Generate QR Code Tagihan untuk Dipindai Warga Lain"
                    className="h-11 px-3.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shrink-0"
                  >
                    <QrCode className="w-4 h-4 text-emerald-700" />
                    <span>QR Tagihan</span>
                  </button>
                </div>
              </div>
            );
          })}

          {/* Info Card on Dues Allocation */}
          <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/60 text-xs text-emerald-950 space-y-2">
            <div className="flex items-center justify-between">
              <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Transparansi Alokasi Iuran Warga</span>
              </div>
              <button
                onClick={() => setActiveSubTab('kas_transparan')}
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline"
              >
                <span>Lihat Grafik Kas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-emerald-800/90 leading-relaxed">
              Seluruh dana iuran warga RT 04 dialokasikan secara akuntabel untuk honor 2 orang
              satpam ronda 24 jam, retribusi sampah dinas kebersihan, peremajaan PJU gang, serta dana
              santunan warga yang berduka / sakit.
            </p>
          </div>
        </div>
      )}

      {/* SUBTAB 2: BUKU KAS RT TRANSPARAN */}
      {activeSubTab === 'kas_transparan' && (
        <div className="space-y-4">
          {/* Main Balance Overview */}
          <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-lg space-y-4">
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">
                Total Saldo Kas RT 04 (Bulan Berjalan)
              </span>
              <div className="text-2xl font-bold font-mono tracking-tight text-white mt-1 tabular-nums">
                Rp {currentBalance.toLocaleString('id-ID')}
              </div>
              <span className="text-[10px] text-emerald-400 font-medium block mt-0.5">
                ● Status Keuangan: Sehat & Terverifikasi Warga
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800">
              <div className="bg-slate-800/80 p-3 rounded-2xl">
                <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold mb-0.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Pemasukan Bulan Ini</span>
                </div>
                <div className="text-sm font-bold font-mono tabular-nums text-white">
                  Rp {totalInflow.toLocaleString('id-ID')}
                </div>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-2xl">
                <div className="flex items-center gap-1 text-[10px] text-rose-400 font-semibold mb-0.5">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>Pengeluaran Bulan Ini</span>
                </div>
                <div className="text-sm font-bold font-mono tabular-nums text-white">
                  Rp {totalOutflow.toLocaleString('id-ID')}
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Recharts Component for Kas RT Trends */}
          <TreasuryChart records={treasuryRecords} currentBalance={currentBalance} />

          {/* Admin action: Add Expense / Income Record */}
          {userRole === 'pengurus' && (
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-amber-950 block">Panel Bendahara RT</span>
                <span className="text-[10px] text-amber-700">Catat pemasukan atau pengeluaran baru</span>
              </div>
              <button
                onClick={() => setShowAddExpenseModal(true)}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Catat Transaksi</span>
              </button>
            </div>
          )}

          {/* Ledger Records */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Rincian Arus Kas Lingkungan
              </h3>
              <span className="text-[10px] text-slate-600">
                {treasuryRecords.length} Transaksi Tercatat
              </span>
            </div>

            <div className="space-y-2">
              {treasuryRecords.map((item) => {
                const isIncome = item.type === 'masuk';
                return (
                  <div
                    key={item.id}
                    className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isIncome ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {isIncome ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                          <span>{item.category}</span>
                          <span>·</span>
                          <span>{item.date}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div
                        className={`font-mono text-xs font-bold tabular-nums ${
                          isIncome ? 'text-emerald-700' : 'text-rose-600'
                        }`}
                      >
                        {isIncome ? '+' : '-'} Rp {item.amount.toLocaleString('id-ID')}
                      </div>
                      <span className="text-[9px] text-slate-600 block">
                        PIC: {item.pic.split(' ')[0]}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Add Record Modal for Pengurus */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-slate-900 text-sm">Tambah Catatan Kas RT 04</h3>
              <button
                onClick={() => setShowAddExpenseModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddExpenseSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setNewExpType('keluar')}
                  className={`py-2 rounded-xl font-bold border transition-all ${
                    newExpType === 'keluar'
                      ? 'bg-rose-50 border-rose-400 text-rose-800'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  Pengeluaran (-)
                </button>
                <button
                  type="button"
                  onClick={() => setNewExpType('masuk')}
                  className={`py-2 rounded-xl font-bold border transition-all ${
                    newExpType === 'masuk'
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  Pemasukan (+)
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Uraian Transaksi
                </label>
                <input
                  type="text"
                  required
                  value={newExpTitle}
                  onChange={(e) => setNewExpTitle(e.target.value)}
                  placeholder="Contoh: Perbaikan Engsel Pintu Lapangan"
                  className="w-full px-3 py-2 border rounded-xl bg-slate-50 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Jumlah Nominal (Rp)
                </label>
                <input
                  type="number"
                  required
                  value={newExpAmount}
                  onChange={(e) => setNewExpAmount(e.target.value)}
                  placeholder="150000"
                  className="w-full px-3 py-2 border rounded-xl bg-slate-50 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Kategori
                </label>
                <select
                  value={newExpCategory}
                  onChange={(e) => setNewExpCategory(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl bg-slate-50 text-xs"
                >
                  <option value="Sarana & Prasarana">Sarana & Prasarana</option>
                  <option value="Keamanan Lingkungan">Keamanan Lingkungan</option>
                  <option value="Kebersihan">Kebersihan</option>
                  <option value="Kegiatan Warga">Kegiatan Warga</option>
                  <option value="Kas Sosial">Kas Sosial</option>
                </select>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-xs hover:bg-emerald-700"
                >
                  Simpan Catatan Kas
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddExpenseModal(false)}
                  className="px-4 py-2.5 bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
