import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Users,
  CheckCircle2,
  Home,
  MapPin,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { Household, HouseholdType, FamilyMember, FamilyRelationship } from '../types';

interface NewHouseholdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (household: Omit<Household, 'id' | 'isVerified'>) => void;
}

export const NewHouseholdModal: React.FC<NewHouseholdModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [householdType, setHouseholdType] = useState<HouseholdType>('kk_dalam_wilayah');
  const [familyCardNumber, setFamilyCardNumber] = useState('');
  const [headOfFamily, setHeadOfFamily] = useState('');
  const [houseNumber, setHouseNumber] = useState('Blok ');
  const [residenceStatus, setResidenceStatus] = useState<Household['residenceStatus']>('Milik Sendiri');
  const [originAddress, setOriginAddress] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [notes, setNotes] = useState('');

  // Initial primary member (Kepala Keluarga)
  const [members, setMembers] = useState<Array<Omit<FamilyMember, 'isVoter'>>>([
    {
      nik: '',
      fullName: '',
      gender: 'Laki-laki',
      birthPlace: 'Jakarta',
      birthDate: '10 Januari 1990',
      religion: 'Islam',
      education: 'D4/S1',
      occupation: 'Karyawan Swasta',
      maritalStatus: 'Kawin',
      relationship: 'Kepala Keluarga',
      bloodType: 'O',
      citizenship: 'WNI',
      phone: '',
    },
  ]);

  if (!isOpen) return null;

  const handleAddMember = () => {
    setMembers([
      ...members,
      {
        nik: '',
        fullName: '',
        gender: 'Perempuan',
        birthPlace: 'Jakarta',
        birthDate: '01 Januari 1995',
        religion: 'Islam',
        education: 'D4/S1',
        occupation: 'Ibu Rumah Tangga',
        maritalStatus: 'Kawin',
        relationship: 'Istri',
        bloodType: 'O',
        citizenship: 'WNI',
      },
    ]);
  };

  const handleRemoveMember = (index: number) => {
    if (members.length <= 1) return;
    setMembers(members.filter((_, idx) => idx !== index));
  };

  const handleMemberChange = (
    index: number,
    field: keyof Omit<FamilyMember, 'isVoter'>,
    value: string
  ) => {
    setMembers((prev) =>
      prev.map((m, idx) => {
        if (idx === index) {
          const updated = { ...m, [field]: value };
          if (idx === 0 && field === 'fullName') {
            setHeadOfFamily(value);
          }
          return updated;
        }
        return m;
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!familyCardNumber || familyCardNumber.length < 16) {
      alert('Nomor KK harus 16 digit sesuai standar Dukcapil!');
      return;
    }

    if (!headOfFamily.trim()) {
      alert('Nama Kepala Keluarga wajib diisi!');
      return;
    }

    if (householdType === 'kk_luar_wilayah' && !originAddress.trim()) {
      alert('Untuk KK Luar Wilayah, wajib mengisi alamat asal KK/KTP!');
      return;
    }

    const processedMembers: FamilyMember[] = members.map((m) => ({
      ...m,
      nik: m.nik.trim() || `3174${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      isVoter: householdType === 'kk_dalam_wilayah',
    }));

    onSubmit({
      familyCardNumber,
      householdType,
      headOfFamily: headOfFamily || processedMembers[0]?.fullName,
      houseNumber,
      rtRw: 'RT 04 / RW 08',
      residenceStatus,
      originAddress: householdType === 'kk_luar_wilayah' ? originAddress : undefined,
      entryDate: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      emergencyContactPhone: emergencyPhone || '0812-3344-5566',
      notes: notes || (householdType === 'kk_luar_wilayah' ? 'Warga domisili/kontrak lapor mandiri.' : 'Warga tetap ber-KTP setempat.'),
      members: processedMembers,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-5 py-4 bg-emerald-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
              <Users className="w-4 h-4 text-emerald-200" />
            </div>
            <div>
              <h2 className="text-sm font-bold">Pendaftaran Data KK Warga Baru</h2>
              <p className="text-[11px] text-emerald-100">
                Pencatatan sensus kependudukan RT 04 berbasis NIK & KK
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Household Type Radio Cards */}
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1.5">
              Klasifikasi Kartu Keluarga (KK) <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setHouseholdType('kk_dalam_wilayah');
                  setResidenceStatus('Milik Sendiri');
                }}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  householdType === 'kk_dalam_wilayah'
                    ? 'border-emerald-600 bg-emerald-50/80 shadow-xs ring-1 ring-emerald-500'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Warga Tetap
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-900">KK Dalam Wilayah</p>
                <p className="text-[10px] text-slate-500 leading-snug mt-0.5">
                  KTP & KK terdaftar resmi di RT 04 / RW 08
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setHouseholdType('kk_luar_wilayah');
                  setResidenceStatus('Sewa / Kontrak');
                }}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  householdType === 'kk_luar_wilayah'
                    ? 'border-amber-600 bg-amber-50/80 shadow-xs ring-1 ring-amber-500'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                    Domisili
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-900">KK Luar Wilayah</p>
                <p className="text-[10px] text-slate-500 leading-snug mt-0.5">
                  KTP/KK Luar RT (Tinggal: Sewa/Kontrak/Kost)
                </p>
              </button>
            </div>
          </div>

          {/* Nomor KK & Hunian RT */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Nomor Kartu Keluarga (16 Digit) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                maxLength={16}
                value={familyCardNumber}
                onChange={(e) => setFamilyCardNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="Contoh: 3174092408100015"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-emerald-500 outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                {familyCardNumber.length}/16 digit
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Alamat Hunian di RT 04 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={houseNumber}
                onChange={(e) => setHouseNumber(e.target.value)}
                placeholder="Blok B4 No. 12"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Status Tempat Tinggal & Kontak */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Status Kepemilikan Hunian
              </label>
              <select
                value={residenceStatus}
                onChange={(e) => setResidenceStatus(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="Milik Sendiri">Milik Sendiri</option>
                <option value="Sewa / Kontrak">Sewa / Kontrak</option>
                <option value="Kost">Kost Mandiri</option>
                <option value="Rumah Keluarga">Rumah Keluarga / Menumpang</option>
                <option value="Rumah Dinas">Rumah Dinas</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                No. HP Kontak Darurat
              </label>
              <input
                type="text"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                placeholder="0812-xxxx-xxxx"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Origin Address for KK Luar Wilayah */}
          {householdType === 'kk_luar_wilayah' && (
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                <span>Alamat Asal Tercatat Sesuai Dokumen KK/KTP Luar Wilayah *</span>
              </div>
              <textarea
                value={originAddress}
                onChange={(e) => setOriginAddress(e.target.value)}
                placeholder="Contoh: Jl. Sukajadi No. 142 RT 03 RW 05, Kel. Pasteur, Kec. Sukajadi, Kota Bandung, Jawa Barat"
                rows={2}
                required
                className="w-full px-3 py-2 border border-amber-300 rounded-xl text-xs bg-white focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
          )}

          {/* Dynamic Members Section */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Daftar Anggota Keluarga Berbasis NIK
                </h3>
                <p className="text-[11px] text-slate-500">
                  Wajib mengisi data NIK 16 digit per jiwa
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddMember}
                className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah Anggota
              </button>
            </div>

            <div className="space-y-3">
              {members.map((member, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 rounded-2xl border border-slate-200 relative space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                      Anggota #{idx + 1} · {member.relationship}
                    </span>
                    {idx > 0 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(idx)}
                        className="text-rose-500 hover:text-rose-700 p-1 rounded-lg"
                        title="Hapus Anggota"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-0.5">
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        value={member.fullName}
                        onChange={(e) => handleMemberChange(idx, 'fullName', e.target.value)}
                        placeholder="Nama sesuai KTP/Akta"
                        required
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-0.5">
                        NIK (16 Digit)
                      </label>
                      <input
                        type="text"
                        maxLength={16}
                        value={member.nik}
                        onChange={(e) =>
                          handleMemberChange(idx, 'nik', e.target.value.replace(/\D/g, ''))
                        }
                        placeholder="317409xxxxxxxxxx"
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-mono bg-white outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-0.5">
                        Hubungan
                      </label>
                      <select
                        value={member.relationship}
                        onChange={(e) =>
                          handleMemberChange(idx, 'relationship', e.target.value as FamilyRelationship)
                        }
                        className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-[11px] bg-white outline-none"
                      >
                        <option value="Kepala Keluarga">Kepala Keluarga</option>
                        <option value="Istri">Istri</option>
                        <option value="Anak">Anak</option>
                        <option value="Orang Tua">Orang Tua</option>
                        <option value="Mertua">Mertua</option>
                        <option value="Famili Lain">Famili Lain</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-0.5">
                        Jenis Kelamin
                      </label>
                      <select
                        value={member.gender}
                        onChange={(e) => handleMemberChange(idx, 'gender', e.target.value as any)}
                        className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-[11px] bg-white outline-none"
                      >
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-0.5">
                        Pekerjaan
                      </label>
                      <input
                        type="text"
                        value={member.occupation}
                        onChange={(e) => handleMemberChange(idx, 'occupation', e.target.value)}
                        placeholder="Contoh: Karyawan Swasta"
                        className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-[11px] bg-white outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Catatan Pengurus RT (Opsional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Catatan tambahan status sensus atau kelengkapan berkas warga..."
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white rounded-2xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Simpan & Daftarkan Data Warga</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
