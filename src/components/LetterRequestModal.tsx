import React, { useState } from 'react';
import {
  X,
  FileText,
  Send,
  CheckCircle2,
  AlertCircle,
  Building,
  User,
  MapPin,
  Calendar,
  Briefcase,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { LetterRequest, LetterType } from '../types';

interface LetterRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: Omit<LetterRequest, 'id' | 'referenceNumber' | 'status' | 'createdAt'>) => void;
  defaultName: string;
  defaultHouse: string;
}

const LETTER_TYPES: Array<{
  id: LetterType;
  title: string;
  description: string;
  defaultDestination: string;
}> = [
  {
    id: 'domisili',
    title: 'Surat Keterangan Domisili Tempat Tinggal',
    description: 'Untuk pembukaan rekening bank, kantor, sekolah, atau sewa',
    defaultDestination: 'Pimpinan Bank / Instansi Tempat Bekerja',
  },
  {
    id: 'pengantar_ktp',
    title: 'Surat Pengantar KTP / KK Baru (Dukcapil)',
    description: 'Syarat pengurusan KTP-el hilang, rusak, atau pembaruan KK',
    defaultDestination: 'Lurah Sukamaju & Suku Dinas Dukcapil Jakarta Selatan',
  },
  {
    id: 'keterangan_usaha',
    title: 'Surat Keterangan Domisili Usaha (UMKM)',
    description: 'Untuk izin usaha NIB OSS, rekening bisnis, atau pinjaman modal',
    defaultDestination: 'Dinas Penanaman Modal & Pelayanan Terpadu Satu Pintu (PMPTSP)',
  },
  {
    id: 'pengantar_nikah',
    title: 'Surat Pengantar Keterangan Menikah (N1-N4)',
    description: 'Persyaratan berkas pernikahan ke Kantor Urusan Agama (KUA)',
    defaultDestination: 'Kepala Kantor Urusan Agama (KUA) Kec. Pancoran',
  },
  {
    id: 'skck_kelakuan_baik',
    title: 'Surat Keterangan Kelakuan Baik / Pengantar SKCK',
    description: 'Untuk rekomendasi pengurusan SKCK Polsek/Polres atau melamar kerja',
    defaultDestination: 'Kepala Kepolisian Sektor (Kapolsek) Sukamaju',
  },
  {
    id: 'keterangan_tidak_mampu',
    title: 'Surat Pengantar Keterangan Tidak Mampu / Bansos',
    description: 'Untuk KJP, KIS, beasiswa, atau bantuan sosial pemerintah',
    defaultDestination: 'Lurah Sukamaju & Seksi Kesejahteraan Rakyat',
  },
  {
    id: 'kematian_kelahiran',
    title: 'Surat Pengantar Keterangan Kelahiran / Kematian',
    description: 'Untuk pencatatan akta kelahiran baru atau akta kematian',
    defaultDestination: 'Lurah Sukamaju & Kantor Catatan Sipil',
  },
];

export const LetterRequestModal: React.FC<LetterRequestModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  defaultName,
  defaultHouse,
}) => {
  const [type, setType] = useState<LetterType>('domisili');
  const [applicantName, setApplicantName] = useState(defaultName);
  const [houseNumber, setHouseNumber] = useState(defaultHouse);
  const [nik, setNik] = useState('3174091204850002');
  const [noKk, setNoKk] = useState('3174092408100015');
  const [birthPlace, setBirthPlace] = useState('Jakarta');
  const [birthDate, setBirthDate] = useState('12 April 1985');
  const [gender, setGender] = useState<'Laki-laki' | 'Perempuan'>('Laki-laki');
  const [religion, setReligion] = useState('Islam');
  const [maritalStatus, setMaritalStatus] = useState<'Belum Kawin' | 'Kawin' | 'Cerai Hidup' | 'Cerai Mati'>('Kawin');
  const [occupation, setOccupation] = useState('Karyawan Swasta');
  const [addressKtp, setAddressKtp] = useState('Komplek Griya Sejahtera Blok B4 No. 12 RT 04 RW 08, Kel. Sukamaju, Kec. Pancoran');
  const [addressDomisili, setAddressDomisili] = useState('Komplek Griya Sejahtera Blok B4 No. 12 RT 04 RW 08');
  const [purpose, setPurpose] = useState('');
  const [destinationAgency, setDestinationAgency] = useState('Pimpinan PT Bank Mandiri KC Sudirman');

  // Business specific fields
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('Kuliner & Minuman Olahan');
  const [businessAddress, setBusinessAddress] = useState(defaultHouse);

  // Attachments & declarations
  const [attachKtp, setAttachKtp] = useState(true);
  const [attachKk, setAttachKk] = useState(true);
  const [attachIuran, setAttachIuran] = useState(true);
  const [isAgreed, setIsAgreed] = useState(true);

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleTypeSelect = (selectedType: LetterType) => {
    setType(selectedType);
    const meta = LETTER_TYPES.find((t) => t.id === selectedType);
    if (meta) {
      setDestinationAgency(meta.defaultDestination);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!applicantName.trim()) newErrors.applicantName = 'Nama pemohon wajib diisi sesuai KTP';
    if (!nik.trim() || nik.length < 16) newErrors.nik = 'NIK wajib 16 digit angka';
    if (!noKk.trim() || noKk.length < 16) newErrors.noKk = 'Nomor KK wajib 16 digit angka';
    if (!purpose.trim() || purpose.length < 8) {
      newErrors.purpose = 'Tuliskan maksud dan keperluan permohonan surat secara jelas (min. 8 karakter)';
    }
    if (!destinationAgency.trim()) newErrors.destinationAgency = 'Instansi tujuan surat wajib diisi';

    if (type === 'keterangan_usaha' && !businessName.trim()) {
      newErrors.businessName = 'Nama usaha / merk dagang wajib diisi untuk Surat Keterangan Usaha';
    }

    if (!isAgreed) {
      newErrors.agreement = 'Anda wajib menyetujui pernyataan kebenaran data kependudukan';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const attachments: string[] = [];
    if (attachKtp) attachments.push('Fotokopi KTP Pemohon');
    if (attachKk) attachments.push('Fotokopi Kartu Keluarga');
    if (attachIuran) attachments.push('Bukti Lunas Iuran RT 04');

    onSubmit({
      type,
      applicantName: applicantName.trim(),
      houseNumber: houseNumber.trim(),
      nik: nik.trim(),
      noKk: noKk.trim(),
      birthPlace: birthPlace.trim(),
      birthDate: birthDate.trim(),
      gender,
      nationality: 'WNI',
      religion,
      maritalStatus,
      occupation: occupation.trim(),
      addressKtp: addressKtp.trim(),
      addressDomisili: addressDomisili.trim(),
      purpose: purpose.trim(),
      destinationAgency: destinationAgency.trim(),
      businessName: type === 'keterangan_usaha' ? businessName.trim() : undefined,
      businessType: type === 'keterangan_usaha' ? businessType.trim() : undefined,
      businessAddress: type === 'keterangan_usaha' ? businessAddress.trim() : undefined,
      requiredAttachments: attachments,
    });

    setPurpose('');
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full sm:max-w-xl rounded-t-3xl sm:rounded-2xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Modal Top Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Formulir Pengajuan Surat Pengantar RT</h2>
              <p className="text-[11px] text-slate-500">
                Wajib diisi lengkap & akurat untuk verifikasi pengurus RT 04
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* Step 1: Jenis Surat */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              1. Pilih Jenis Surat Pengantar <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 gap-1.5">
              {LETTER_TYPES.map((lt) => {
                const isSelected = type === lt.id;
                return (
                  <button
                    key={lt.id}
                    type="button"
                    onClick={() => handleTypeSelect(lt.id)}
                    className={`p-2.5 rounded-xl border text-left flex items-start justify-between transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-500'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-xs text-slate-900">{lt.title}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{lt.description}</div>
                    </div>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 ml-2">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Instansi Tujuan & Maksud */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <h3 className="font-bold text-xs text-slate-900">
              2. Tujuan & Maksud Penggunaan Surat
            </h3>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Ditujukan Kepada (Instansi / Lembaga / Perusahaan) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={destinationAgency}
                onChange={(e) => setDestinationAgency(e.target.value)}
                placeholder="Misal: Lurah Sukamaju / Pimpinan Bank Mandiri KC Sudirman"
                className={`w-full px-3 py-2 rounded-xl border bg-white text-xs ${
                  errors.destinationAgency ? 'border-rose-400' : 'border-slate-200'
                }`}
              />
              {errors.destinationAgency && (
                <p className="text-[10px] text-rose-500 mt-0.5">{errors.destinationAgency}</p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Keperluan Spesifik <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={2}
                value={purpose}
                onChange={(e) => {
                  setPurpose(e.target.value);
                  if (errors.purpose) setErrors((prev) => ({ ...prev, purpose: '' }));
                }}
                placeholder="Contoh: Persyaratan pembukaan rekening bank payroll kantor atau berkas pernikahan..."
                className={`w-full px-3 py-2 rounded-xl border bg-white text-xs ${
                  errors.purpose ? 'border-rose-400' : 'border-slate-200'
                }`}
              />
              {errors.purpose && (
                <p className="text-[10px] text-rose-500 mt-0.5">{errors.purpose}</p>
              )}
            </div>
          </div>

          {/* Conditional: Detail Usaha if Surat Keterangan Usaha */}
          {type === 'keterangan_usaha' && (
            <div className="p-3.5 bg-amber-50/80 rounded-2xl border border-amber-200 space-y-3">
              <h3 className="font-bold text-xs text-amber-950 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-amber-700" />
                <span>Rincian Usaha Lingkungan (Wajib Diisi)</span>
              </h3>

              <div>
                <label className="block text-[11px] font-semibold text-amber-900 mb-1">
                  Nama Usaha / Merk Dagang <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Contoh: Kopi Sejahtera Nusantara"
                  className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white text-xs"
                />
                {errors.businessName && (
                  <p className="text-[10px] text-rose-500 mt-0.5">{errors.businessName}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-amber-900 mb-1">
                    Bidang Usaha
                  </label>
                  <input
                    type="text"
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    placeholder="Kuliner / Perdagangan"
                    className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-amber-900 mb-1">
                    Lokasi / Alamat Usaha
                  </label>
                  <input
                    type="text"
                    value={businessAddress}
                    onChange={(e) => setBusinessAddress(e.target.value)}
                    placeholder="Ruko Griya Plaza Blok A-02"
                    className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Data Kependudukan Pemohon (Wajib Standar Pemerintahan) */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <h3 className="font-bold text-xs text-slate-900">
              3. Data Kependudukan Pemohon (Sesuai KTP & KK)
            </h3>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Nama Lengkap (Sesuai KTP) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
              />
              {errors.applicantName && (
                <p className="text-[10px] text-rose-500 mt-0.5">{errors.applicantName}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Nomor Induk Kependudukan (NIK) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={16}
                  value={nik}
                  onChange={(e) => setNik(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-mono"
                />
                {errors.nik && <p className="text-[10px] text-rose-500 mt-0.5">{errors.nik}</p>}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Nomor Kartu Keluarga (KK) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={16}
                  value={noKk}
                  onChange={(e) => setNoKk(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-mono"
                />
                {errors.noKk && <p className="text-[10px] text-rose-500 mt-0.5">{errors.noKk}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Tempat Lahir
                </label>
                <input
                  type="text"
                  value={birthPlace}
                  onChange={(e) => setBirthPlace(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Tanggal Lahir
                </label>
                <input
                  type="text"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Jenis Kelamin
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full px-2 py-2 rounded-xl border border-slate-200 bg-white text-xs"
                >
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Agama
                </label>
                <select
                  value={religion}
                  onChange={(e) => setReligion(e.target.value)}
                  className="w-full px-2 py-2 rounded-xl border border-slate-200 bg-white text-xs"
                >
                  <option value="Islam">Islam</option>
                  <option value="Kristen">Kristen</option>
                  <option value="Katolik">Katolik</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Buddha">Buddha</option>
                  <option value="Konghucu">Konghucu</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Status Kawin
                </label>
                <select
                  value={maritalStatus}
                  onChange={(e) => setMaritalStatus(e.target.value as any)}
                  className="w-full px-2 py-2 rounded-xl border border-slate-200 bg-white text-xs"
                >
                  <option value="Kawin">Kawin</option>
                  <option value="Belum Kawin">Belum Kawin</option>
                  <option value="Cerai Hidup">Cerai Hidup</option>
                  <option value="Cerai Mati">Cerai Mati</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Pekerjaan
                </label>
                <input
                  type="text"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  No. Rumah / Blok di RT 04
                </label>
                <input
                  type="text"
                  value={houseNumber}
                  onChange={(e) => setHouseNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Alamat KTP Lengkap
              </label>
              <input
                type="text"
                value={addressKtp}
                onChange={(e) => setAddressKtp(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs"
              />
            </div>
          </div>

          {/* Step 4: Lampiran Dokumen & Klausul Hukum */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
            <h3 className="font-bold text-xs text-slate-900">
              4. Lampiran Pendukung & Pengesahan
            </h3>

            <div className="space-y-1.5">
              <label className="flex items-center gap-2 cursor-pointer select-none text-[11px] text-slate-700">
                <input
                  type="checkbox"
                  checked={attachKtp}
                  onChange={(e) => setAttachKtp(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Lampirkan data e-KTP Pemohon yang masih berlaku</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none text-[11px] text-slate-700">
                <input
                  type="checkbox"
                  checked={attachKk}
                  onChange={(e) => setAttachKk(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Lampirkan data Kartu Keluarga (KK) terdaftar</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none text-[11px] text-slate-700">
                <input
                  type="checkbox"
                  checked={attachIuran}
                  onChange={(e) => setAttachIuran(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Sertakan status lunas iuran kebersihan & keamanan RT</span>
              </label>
            </div>

            <div className="pt-2 border-t border-slate-200">
              <label className="flex items-start gap-2 cursor-pointer select-none text-[11px] text-slate-800">
                <input
                  type="checkbox"
                  checked={isAgreed}
                  onChange={(e) => setIsAgreed(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 shrink-0"
                />
                <span className="leading-snug">
                  Saya menyatakan bahwa data kependudukan yang diisi adalah <strong>benar dan sah</strong> sesuai
                  dokumen kependudukan resmi negara untuk diproses oleh Pengurus RT 04.
                </span>
              </label>
              {errors.agreement && (
                <p className="text-[10px] text-rose-500 mt-1">{errors.agreement}</p>
              )}
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold rounded-xl transition-all shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 text-xs"
            >
              <Send className="w-4 h-4" />
              <span>Kirim Formulir Permohonan ke Pengurus RT 04</span>
            </button>
            <p className="text-[10px] text-center text-slate-500 mt-2">
              Pengurus RT akan memverifikasi dan menandatangani secara digital dalam waktu 1x24 jam.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
