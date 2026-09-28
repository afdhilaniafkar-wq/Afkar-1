import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  FileText,
  ShieldCheck,
  MapPin,
  Home,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ChevronRight,
  Download,
  Building2,
  UserCheck,
  Vote,
  Sparkles,
  Phone,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Household, HouseholdType, FamilyMember } from '../../types';

interface CitizensViewProps {
  households: Household[];
  userRole: 'warga' | 'pengurus';
  currentUserName: string;
  onOpenNewHousehold: () => void;
  onSelectHousehold: (household: Household) => void;
}

export const CitizensView: React.FC<CitizensViewProps> = ({
  households,
  userRole,
  currentUserName,
  onOpenNewHousehold,
  onSelectHousehold,
}) => {
  const [activeTypeFilter, setActiveTypeFilter] = useState<'semua' | HouseholdType>('semua');
  const [selectedBlock, setSelectedBlock] = useState<string>('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFullNik, setShowFullNik] = useState(false);
  const [copiedNik, setCopiedNik] = useState<string | null>(null);
  const [copiedExport, setCopiedExport] = useState(false);

  // Compute Statistics
  const stats = useMemo(() => {
    const totalKK = households.length;
    const kkDalam = households.filter((h) => h.householdType === 'kk_dalam_wilayah').length;
    const kkLuar = households.filter((h) => h.householdType === 'kk_luar_wilayah').length;

    let totalJiwa = 0;
    let maleCount = 0;
    let femaleCount = 0;
    let voterCount = 0;

    households.forEach((h) => {
      totalJiwa += h.members.length;
      h.members.forEach((m) => {
        if (m.gender === 'Laki-laki') maleCount++;
        else femaleCount++;
        if (m.isVoter) voterCount++;
      });
    });

    return { totalKK, kkDalam, kkLuar, totalJiwa, maleCount, femaleCount, voterCount };
  }, [households]);

  // Filter households
  const filteredHouseholds = useMemo(() => {
    return households.filter((h) => {
      // Type filter
      if (activeTypeFilter !== 'semua' && h.householdType !== activeTypeFilter) {
        return false;
      }
      // Block filter
      if (selectedBlock !== 'semua') {
        const blockName = `Blok ${selectedBlock}`;
        if (!h.houseNumber.includes(blockName)) return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchHead = h.headOfFamily.toLowerCase().includes(q);
        const matchKK = h.familyCardNumber.includes(q);
        const matchHouse = h.houseNumber.toLowerCase().includes(q);
        const matchOrigin = (h.originAddress || '').toLowerCase().includes(q);
        const matchMember = h.members.some(
          (m) => m.fullName.toLowerCase().includes(q) || m.nik.includes(q)
        );
        return matchHead || matchKK || matchHouse || matchOrigin || matchMember;
      }
      return true;
    });
  }, [households, activeTypeFilter, selectedBlock, searchQuery]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNik(text);
    setTimeout(() => setCopiedNik(null), 2000);
  };

  const handleExportCensus = () => {
    const textData = `=== REKAP SENSUS DATA KEPENDUDUKAN RT 04 / RW 08 ===
Tanggal Export: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
Total KK Terdata: ${stats.totalKK} KK
- KK Dalam Wilayah (Warga Tetap): ${stats.kkDalam} KK
- KK Luar Wilayah (Warga Domisili/Kontrak): ${stats.kkLuar} KK
Total Jiwa: ${stats.totalJiwa} Jiwa (L: ${stats.maleCount}, P: ${stats.femaleCount})
Hak Suara DPT RT: ${stats.voterCount} Jiwa

DAFTAR KEPALA KELUARGA & RINCIAN NIK:
${households
  .map(
    (h, idx) =>
      `${idx + 1}. [${h.householdType === 'kk_dalam_wilayah' ? 'KK DALAM' : 'KK LUAR'}] No. KK: ${h.familyCardNumber}
   Kepala Keluarga: ${h.headOfFamily} (${h.houseNumber})
   Status Tinggal: ${h.residenceStatus}${h.originAddress ? ` | Asal: ${h.originAddress}` : ''}
   Anggota (${h.members.length} jiwa):
   ${h.members.map((m) => `  - ${m.fullName} | NIK: ${m.nik} (${m.relationship}, ${m.occupation})`).join('\n   ')}`
  )
  .join('\n\n')}`;

    navigator.clipboard.writeText(textData);
    setCopiedExport(true);
    setTimeout(() => setCopiedExport(false), 2500);
  };

  const maskNik = (nik: string) => {
    if (showFullNik) return nik;
    return `${nik.slice(0, 6)}******${nik.slice(-4)}`;
  };

  return (
    <div className="flex-1 pb-24 px-4 pt-3 space-y-4">
      {/* Top Banner & Title */}
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold mb-1">
            <Users className="w-3 h-3 text-emerald-600" />
            Sensus Kependudukan RT 04 / RW 08
          </div>
          <h1 className="text-lg font-black text-slate-900 tracking-tight">
            Data Warga Berbasis NIK & KK
          </h1>
          <p className="text-xs text-slate-500">
            Pencatatan KK Dalam Wilayah & Luar Wilayah terintegrasi
          </p>
        </div>

        {userRole === 'pengurus' && (
          <button
            onClick={onOpenNewHousehold}
            className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah KK</span>
          </button>
        )}
      </div>

      {/* Demographic Overview KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Keluarga</span>
            <Building2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-black text-slate-900">{stats.totalKK} KK</p>
          <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500 font-medium">
            <span className="text-emerald-700 font-semibold">{stats.kkDalam} Dalam</span>
            <span>·</span>
            <span className="text-amber-700 font-semibold">{stats.kkLuar} Luar</span>
          </div>
        </div>

        <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Jiwa (NIK)</span>
            <UserCheck className="w-4 h-4 text-sky-600" />
          </div>
          <p className="text-xl font-black text-slate-900">{stats.totalJiwa} Jiwa</p>
          <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500 font-medium">
            <span>{stats.maleCount} Pria</span>
            <span>·</span>
            <span>{stats.femaleCount} Wanita</span>
          </div>
        </div>

        <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-200 shadow-xs">
          <div className="flex items-center justify-between text-emerald-800 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">KK Dalam Wilayah</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-black text-emerald-950">{stats.kkDalam} KK</p>
          <p className="text-[10px] text-emerald-700 font-medium mt-1">
            Warga Tetap (KTP RT 04)
          </p>
        </div>

        <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200 shadow-xs">
          <div className="flex items-center justify-between text-amber-800 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">KK Luar Wilayah</span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-xl font-black text-amber-950">{stats.kkLuar} KK</p>
          <p className="text-[10px] text-amber-800 font-medium mt-1">
            Domisili / Kontrak / Kost
          </p>
        </div>
      </div>

      {/* Distinction Guide Notice Box */}
      <div className="p-3 bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 rounded-2xl border border-slate-200 text-xs">
        <div className="flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold text-slate-900 block">
              Pembedaan Administrasi Kependudukan RT 04:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1.5 text-[11px] text-slate-600">
              <div className="flex items-start gap-1.5 bg-white/70 p-2 rounded-xl border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0 mt-1" />
                <div>
                  <strong className="text-emerald-900 block font-bold">KK Dalam Wilayah</strong>
                  Warga tetap yang tercatat resmi memiliki KTP & KK beralamat langsung di RT 04 / RW 08. Masuk dalam daftar DPT Pilkada/Pemilu setempat.
                </div>
              </div>
              <div className="flex items-start gap-1.5 bg-white/70 p-2 rounded-xl border border-amber-200">
                <span className="w-2 h-2 rounded-full bg-amber-600 shrink-0 mt-1" />
                <div>
                  <strong className="text-amber-900 block font-bold">KK Luar Wilayah</strong>
                  Warga berdomisili fisik di RT 04 (Kontrak, Kost, Sewa, Dinas) dengan KTP & No. KK induk terdaftar di luar wilayah kelurahan/kota.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Privacy Tool Bar */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama warga, No KK, NIK 16 digit, atau blok..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFullNik(!showFullNik)}
            title={showFullNik ? 'Sembunyikan NIK Lengkap' : 'Tampilkan NIK Lengkap'}
            className={`px-2.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
              showFullNik
                ? 'bg-slate-800 text-white border-slate-700'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {showFullNik ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{showFullNik ? 'Sensor NIK' : 'Lihat NIK'}</span>
          </button>

          <button
            onClick={handleExportCensus}
            title="Salin rekap data kependudukan ke clipboard"
            className="px-2.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            {copiedExport ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Download className="w-3.5 h-3.5 text-slate-600" />
            )}
            <span className="hidden sm:inline">
              {copiedExport ? 'Tersalin' : 'Export'}
            </span>
          </button>
        </div>

        {/* Filter Pills: Type (Semua / Dalam / Luar) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTypeFilter('semua')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTypeFilter === 'semua'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Semua KK ({stats.totalKK})
          </button>

          <button
            onClick={() => setActiveTypeFilter('kk_dalam_wilayah')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTypeFilter === 'kk_dalam_wilayah'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-emerald-700 border border-emerald-300 hover:bg-emerald-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            KK Dalam Wilayah ({stats.kkDalam})
          </button>

          <button
            onClick={() => setActiveTypeFilter('kk_luar_wilayah')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTypeFilter === 'kk_luar_wilayah'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-amber-700 border border-amber-300 hover:bg-amber-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            KK Luar Wilayah ({stats.kkLuar})
          </button>
        </div>

        {/* Block Selector */}
        <div className="flex items-center gap-1.5 text-xs text-slate-600 overflow-x-auto pb-1">
          <span className="text-[11px] font-semibold text-slate-400 pl-1">Blok:</span>
          {['semua', 'A', 'B', 'C', 'D'].map((block) => (
            <button
              key={block}
              onClick={() => setSelectedBlock(block)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                selectedBlock === block
                  ? 'bg-emerald-100 text-emerald-800 font-bold border border-emerald-300'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {block === 'semua' ? 'Semua Blok' : `Blok ${block}`}
            </button>
          ))}
        </div>
      </div>

      {/* Household Cards List */}
      <div className="space-y-3">
        {filteredHouseholds.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-3xl border border-slate-200 p-6 space-y-2">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">Data Tidak Ditemukan</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Tidak ada data KK yang sesuai dengan pencarian atau filter yang dipilih.
            </p>
          </div>
        ) : (
          filteredHouseholds.map((household) => {
            const isDalam = household.householdType === 'kk_dalam_wilayah';
            const isMyHousehold =
              currentUserName &&
              household.headOfFamily.toLowerCase().includes(currentUserName.toLowerCase());

            return (
              <div
                key={household.id}
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-xs hover:shadow-md ${
                  isMyHousehold
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                    : isDalam
                    ? 'border-slate-200 hover:border-emerald-300'
                    : 'border-amber-200 hover:border-amber-400'
                }`}
              >
                {/* Card Header Banner */}
                <div
                  className={`px-4 py-2.5 flex items-center justify-between border-b ${
                    isDalam
                      ? 'bg-emerald-50/70 border-emerald-100 text-emerald-950'
                      : 'bg-amber-50/70 border-amber-100 text-amber-950'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        isDalam ? 'bg-emerald-600' : 'bg-amber-500'
                      }`}
                    />
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        isDalam
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                    >
                      {isDalam ? 'KK DALAM WILAYAH' : 'KK LUAR WILAYAH'}
                    </span>

                    {isMyHousehold && (
                      <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                        Keluarga Anda
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] font-semibold text-slate-600">
                    {household.members.length} Jiwa Terdaftar
                  </span>
                </div>

                {/* Card Content Body */}
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-sm font-black text-slate-900">
                        {household.headOfFamily}
                      </h2>
                      <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1 mt-0.5">
                        <Home className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>
                          {household.houseNumber} · {household.rtRw}
                        </span>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-lg block">
                        {household.residenceStatus}
                      </span>
                    </div>
                  </div>

                  {/* No KK Pill with copy */}
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Nomor Kartu Keluarga:</span>
                      <span className="font-mono text-xs font-bold text-slate-800 tracking-wider">
                        {household.familyCardNumber}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopy(household.familyCardNumber)}
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

                  {/* For Out of Region: show Origin Address */}
                  {!isDalam && household.originAddress && (
                    <div className="p-2 bg-amber-50/70 rounded-xl border border-amber-200/80 text-[11px] text-amber-900">
                      <span className="font-bold flex items-center gap-1 text-[10px] text-amber-800 uppercase">
                        <MapPin className="w-3 h-3 text-amber-600" />
                        Alamat Asal Tercatat di Dokumen KK:
                      </span>
                      <p className="text-amber-950 font-medium leading-relaxed mt-0.5">
                        {household.originAddress}
                      </p>
                    </div>
                  )}

                  {/* Family Members Preview Chips */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">
                      Anggota Keluarga ({household.members.length}):
                    </span>
                    <div className="space-y-1">
                      {household.members.map((m) => (
                        <div
                          key={m.nik}
                          className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-slate-50/80 hover:bg-slate-100 transition-colors"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span
                              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                m.gender === 'Laki-laki' ? 'bg-sky-500' : 'bg-rose-400'
                              }`}
                            />
                            <span className="font-bold text-slate-800 truncate">{m.fullName}</span>
                            <span className="text-[10px] text-slate-500">({m.relationship})</span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0 ml-2">
                            <span className="font-mono text-[10px] text-slate-600 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                              {maskNik(m.nik)}
                            </span>
                            <button
                              onClick={() => handleCopy(m.nik)}
                              className="p-0.5 text-slate-400 hover:text-slate-700"
                              title="Salin NIK"
                            >
                              {copiedNik === m.nik ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-slate-500">
                      Tinggal sejak: {household.entryDate}
                    </span>

                    <button
                      onClick={() => onSelectHousehold(household)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-xs"
                    >
                      <FileText className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Salinan Kartu Keluarga (KK)</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
