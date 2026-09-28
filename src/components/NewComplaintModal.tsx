import React, { useState } from 'react';
import {
  X,
  Camera,
  Check,
  AlertTriangle,
  MapPin,
  Shield,
  Lightbulb,
  Trash2,
  Construction,
  Volume2,
  Sparkles,
} from 'lucide-react';
import { Complaint, ComplaintCategory, ComplaintPriority } from '../types';

interface NewComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newComplaint: Omit<Complaint, 'id' | 'ticketNumber' | 'createdAt' | 'upvotes' | 'timeline'>) => void;
  defaultReporterName: string;
  defaultReporterHouse: string;
}

const CATEGORIES: Array<{
  id: ComplaintCategory;
  label: string;
  icon: React.ElementType;
  description: string;
}> = [
  { id: 'penerangan', label: 'Penerangan & PJU', icon: Lightbulb, description: 'Lampu jalan mati, tiang miring, saklar' },
  { id: 'kebersihan', label: 'Kebersihan & Sampah', icon: Trash2, description: 'Sampah lambat angkut, dahan pohon, bau' },
  { id: 'jalan_saluran', label: 'Jalan & Saluran Air', icon: Construction, description: 'Aspal berlubang, got mampet, grill drainase' },
  { id: 'keamanan', label: 'Keamanan Lingkungan', icon: Shield, description: 'Orang mencurigakan, pagar, portal rusak' },
  { id: 'ketertiban', label: 'Ketertiban & Bising', icon: Volume2, description: 'Hewan peliharaan, musik larut, parkir liar' },
  { id: 'fasilitas', label: 'Fasilitas Umum', icon: Sparkles, description: 'Taman bermain, lapangan, balai warga' },
];

const PRESET_LOCATIONS = [
  'Jl. Mawar Blok A',
  'Jl. Melati Blok B',
  'Jl. Anggrek Blok C',
  'Jl. Kenanga Blok D',
  'Taman & Lapangan RT 04',
  'Pos Satpam Utama',
  'Gerbang Portal Masuk',
];

export const NewComplaintModal: React.FC<NewComplaintModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  defaultReporterName,
  defaultReporterHouse,
}) => {
  const [category, setCategory] = useState<ComplaintCategory>('penerangan');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState<ComplaintPriority>('normal');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [selectedPhotoPreset, setSelectedPhotoPreset] = useState<string | null>(null);
  const [customPhotoName, setCustomPhotoName] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!title.trim()) newErrors.title = 'Judul laporan keluhan wajib diisi';
    if (!description.trim() || description.length < 10) {
      newErrors.description = 'Deskripsi keluhan minimal 10 karakter agar pengurus mudah memahami';
    }
    if (!location.trim()) newErrors.location = 'Lokasi kejadian / titik fasilitas wajib diisi';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      category,
      location: location.trim(),
      priority,
      isAnonymous,
      reporterName: isAnonymous ? 'Warga Anonim' : defaultReporterName,
      reporterHouse: isAnonymous ? 'Dirahasiakan' : defaultReporterHouse,
      status: 'menunggu',
      imageUrl: selectedPhotoPreset || (customPhotoName ? 'custom-uploaded' : undefined),
    });

    // Reset
    setTitle('');
    setDescription('');
    setLocation('');
    setCategory('penerangan');
    setPriority('normal');
    setIsAnonymous(false);
    setSelectedPhotoPreset(null);
    setCustomPhotoName(null);
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-base font-bold text-slate-900">Buat Laporan Keluhan Warga</h2>
            <p className="text-xs text-slate-500 mt-0.5">Sampaikan keluhan fasilitas atau lingkungan RT 04</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* Category Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Pilih Kategori Keluhan <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`flex flex-col items-start p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900 ring-1 ring-emerald-500'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-700' : 'text-slate-500'}`} />
                      <span className="font-semibold text-[11px] leading-tight">{cat.label}</span>
                    </div>
                    <span className="text-[10px] text-slate-600 line-clamp-1">{cat.description}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Judul Keluhan Singkat <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
              }}
              placeholder="Contoh: Lampu PJU Mati di Tikungan Blok C"
              className={`w-full px-3 py-2.5 rounded-xl border bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                errors.title ? 'border-rose-400' : 'border-slate-200'
              }`}
            />
            {errors.title && <p className="text-[11px] text-rose-500 mt-1">{errors.title}</p>}
          </div>

          {/* Location */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Lokasi / Titik Kejadian <span className="text-rose-500">*</span>
              </label>
              <span className="text-[10px] text-slate-600">Klik rekomendasi di bawah:</span>
            </div>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  if (errors.location) setErrors((prev) => ({ ...prev, location: '' }));
                }}
                placeholder="Misal: Depan rumah Blok B4 No. 12 atau Jalan Utama"
                className={`w-full pl-8 pr-3 py-2.5 rounded-xl border bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  errors.location ? 'border-rose-400' : 'border-slate-200'
                }`}
              />
            </div>
            {/* Quick chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {PRESET_LOCATIONS.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setLocation(loc)}
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[10px] font-medium transition-colors"
                >
                  + {loc}
                </button>
              ))}
            </div>
            {errors.location && <p className="text-[11px] text-rose-500 mt-1">{errors.location}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Deskripsi Lengkap Masalah <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
              }}
              placeholder="Ceritakan detail kondisi, perkiraan waktu kejadian, atau dampaknya pada kenyamanan warga sekitar..."
              className={`w-full px-3 py-2.5 rounded-xl border bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                errors.description ? 'border-rose-400' : 'border-slate-200'
              }`}
            />
            {errors.description && <p className="text-[11px] text-rose-500 mt-1">{errors.description}</p>}
          </div>

          {/* Photo Attachment Simulation */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Lampirkan Foto Bukti (Opsional)
            </label>
            <div className="border border-dashed border-slate-300 rounded-xl p-3 bg-slate-50/70 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Camera className="w-5 h-5 text-slate-400" />
                <span className="text-[11px] font-medium text-slate-600">Pilih simulasi foto atau file kamera</span>
              </div>
              <div className="flex flex-wrap justify-center gap-1.5">
                {[
                  { id: 'photo-pju', label: 'Foto PJU Mati' },
                  { id: 'photo-sampah', label: 'Foto Sampah Menumpuk' },
                  { id: 'photo-saluran', label: 'Foto Selokan Rusak' },
                  { id: 'photo-aspal', label: 'Foto Jalan Berlubang' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSelectedPhotoPreset(selectedPhotoPreset === item.id ? null : item.id);
                      setCustomPhotoName(null);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all ${
                      selectedPhotoPreset === item.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {selectedPhotoPreset === item.id ? '✓ ' : ''}
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Tingkat Urgensi
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'normal', label: 'Normal', desc: 'Penanganan rutin' },
                { id: 'penting', label: 'Penting', desc: 'Butuh 1x24 jam' },
                { id: 'darurat', label: 'Darurat', desc: 'Membahayakan warga' },
              ].map((p) => {
                const isSelected = priority === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPriority(p.id as ComplaintPriority)}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      isSelected
                        ? p.id === 'darurat'
                          ? 'border-rose-500 bg-rose-50 text-rose-800 ring-1 ring-rose-400'
                          : p.id === 'penting'
                          ? 'border-amber-500 bg-amber-50 text-amber-800 ring-1 ring-amber-400'
                          : 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-500'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <div className="font-semibold text-xs">{p.label}</div>
                    <div className="text-[10px] text-slate-600 mt-0.5">{p.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Anonymous Option */}
          <div className="p-3 bg-slate-100/80 rounded-xl flex items-center justify-between">
            <div className="pr-3">
              <span className="font-semibold text-slate-800 block text-xs">Laporkan sebagai Anonim</span>
              <span className="text-[10px] text-slate-500 block leading-snug">
                Nama dan nomor rumah Anda tidak akan ditampilkan ke publik (hanya dicatat sistem untuk rekap RT).
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsAnonymous(!isAnonymous)}
              className={`w-6 h-6 rounded-md border flex items-center justify-center transition-colors ${
                isAnonymous ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
              }`}
            >
              {isAnonymous && <Check className="w-4 h-4 stroke-[3]" />}
            </button>
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-semibold rounded-xl transition-all shadow-sm shadow-emerald-700/20 flex items-center justify-center gap-2 text-xs"
            >
              Kirim Laporan Keluhan ke RT 04
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
