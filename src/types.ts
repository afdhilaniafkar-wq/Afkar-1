export type ComplaintCategory =
  | 'kebersihan'
  | 'keamanan'
  | 'penerangan'
  | 'jalan_saluran'
  | 'fasilitas'
  | 'ketertiban'
  | 'lainnya';

export type ComplaintStatus = 'menunggu' | 'diproses' | 'selesai' | 'ditolak';

export type ComplaintPriority = 'normal' | 'penting' | 'darurat';

export interface ComplaintTimelineItem {
  status: ComplaintStatus;
  timestamp: string;
  note: string;
  actor: string;
}

export interface Complaint {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  location: string;
  reporterName: string;
  reporterHouse: string;
  isAnonymous: boolean;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  createdAt: string;
  imageUrl?: string;
  completionImageUrl?: string;
  officialNotes?: string;
  upvotes: number;
  upvotedByMe?: boolean;
  timeline: ComplaintTimelineItem[];
}

export interface DuesBreakdown {
  keamanan: number;
  kebersihan: number;
  kasSosial: number;
  perawatanLingkungan?: number;
}

export type PaymentMethod = 'qris' | 'va_bca' | 'va_mandiri' | 'tunai_bendahara';

export interface DuesBill {
  id: string;
  month: string;
  year: number;
  dueDate: string;
  breakdown: DuesBreakdown;
  totalAmount: number;
  status: 'lunas' | 'belum_bayar' | 'menunggu_verifikasi';
  paidAt?: string;
  paymentMethod?: PaymentMethod;
  receiptNumber?: string;
  proofImageUrl?: string;
  residentName?: string;
  houseNumber?: string;
  qrCodePayload?: string;
  portalToken?: string;
}

export interface TreasuryRecord {
  id: string;
  title: string;
  type: 'masuk' | 'keluar';
  amount: number;
  category: string;
  date: string;
  pic: string;
  receiptNumber?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  authorRole: string;
  category: 'kegiatan' | 'iuran' | 'keamanan' | 'pengumuman';
  pinned?: boolean;
}

export interface EmergencyContact {
  id: string;
  name: string;
  role: string;
  phone: string;
  available24h: boolean;
  type: 'satpam' | 'ketua_rt' | 'puskesmas' | 'polisi' | 'damkar';
}

export type LetterType =
  | 'domisili'
  | 'pengantar_ktp'
  | 'keterangan_usaha'
  | 'pengantar_nikah'
  | 'skck_kelakuan_baik'
  | 'keterangan_tidak_mampu'
  | 'kematian_kelahiran';

export interface LetterRequest {
  id: string;
  referenceNumber: string;
  type: LetterType;
  applicantName: string;
  houseNumber: string;
  nik: string;
  noKk: string;
  birthPlace: string;
  birthDate: string;
  gender: 'Laki-laki' | 'Perempuan';
  nationality: string;
  religion: string;
  maritalStatus: 'Belum Kawin' | 'Kawin' | 'Cerai Hidup' | 'Cerai Mati';
  occupation: string;
  addressKtp: string;
  addressDomisili: string;
  purpose: string;
  destinationAgency: string;
  businessName?: string;
  businessType?: string;
  businessAddress?: string;
  requiredAttachments: string[];
  status: 'menunggu' | 'disetujui' | 'ditolak';
  createdAt: string;
  approvedAt?: string;
  validUntil?: string;
  officerNotes?: string;
  officerName?: string;
  officerRole?: string;
  officerSignatureHash?: string;
  digitalStampApplied?: boolean;
}

export interface CitizenProfile {
  name: string;
  houseNumber: string;
  rtRw: string;
  phone: string;
  role: 'warga' | 'pengurus';
  familyMembersCount: number;
  nikMasked: string;
  avatarUrl: string;
}

export type HouseholdType = 'kk_dalam_wilayah' | 'kk_luar_wilayah';

export type FamilyRelationship =
  | 'Kepala Keluarga'
  | 'Istri'
  | 'Anak'
  | 'Orang Tua'
  | 'Mertua'
  | 'Famili Lain';

export interface FamilyMember {
  nik: string; // 16 digit NIK berbasis KTP/Akta
  fullName: string;
  gender: 'Laki-laki' | 'Perempuan';
  birthPlace: string;
  birthDate: string;
  religion: 'Islam' | 'Kristen' | 'Katolik' | 'Hindu' | 'Buddha' | 'Konghucu' | 'Lainnya';
  education: 'Tidak/Belum Sekolah' | 'SD' | 'SMP' | 'SMA/SMK' | 'D3' | 'D4/S1' | 'S2' | 'S3';
  occupation: string;
  maritalStatus: 'Belum Kawin' | 'Kawin' | 'Cerai Hidup' | 'Cerai Mati';
  relationship: FamilyRelationship;
  bloodType: 'A' | 'B' | 'AB' | 'O' | '-';
  fatherName?: string;
  motherName?: string;
  citizenship: 'WNI' | 'WNA';
  phone?: string;
  isVoter: boolean;
}

export interface Household {
  id: string;
  familyCardNumber: string; // 16 digit Nomor Kartu Keluarga (KK)
  householdType: HouseholdType; // 'kk_dalam_wilayah' vs 'kk_luar_wilayah'
  headOfFamily: string;
  houseNumber: string;
  rtRw: string;
  residenceStatus: 'Milik Sendiri' | 'Sewa / Kontrak' | 'Kost' | 'Rumah Keluarga' | 'Rumah Dinas';
  originAddress?: string; // Wajib terisi jika KK Luar Wilayah (alamat tercatat pada KK aslinya)
  entryDate: string; // Tanggal tinggal / lapor RT
  emergencyContactPhone: string;
  isVerified: boolean;
  notes?: string;
  members: FamilyMember[];
}
