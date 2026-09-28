import React, { useState, useEffect } from 'react';
import { MobileFrame } from './components/MobileFrame';
import { TopBar } from './components/TopBar';
import { BottomNav, NavTab } from './components/BottomNav';
import { HomeView } from './components/views/HomeView';
import { ComplaintsView } from './components/views/ComplaintsView';
import { DuesView } from './components/views/DuesView';
import { ServicesView } from './components/views/ServicesView';
import { CitizensView } from './components/views/CitizensView';
import { NewComplaintModal } from './components/NewComplaintModal';
import { ComplaintDetailModal } from './components/ComplaintDetailModal';
import { PaymentModal } from './components/PaymentModal';
import { ReceiptModal } from './components/ReceiptModal';
import { LetterRequestModal } from './components/LetterRequestModal';
import { LetterDocumentModal } from './components/LetterDocumentModal';
import { LetterApprovalModal } from './components/LetterApprovalModal';
import { BillQrModal } from './components/BillQrModal';
import { BillPortalModal } from './components/BillPortalModal';
import { BillScannerModal } from './components/BillScannerModal';
import { NotificationsModal } from './components/NotificationsModal';
import { FamilyCardModal } from './components/FamilyCardModal';
import { NewHouseholdModal } from './components/NewHouseholdModal';
import {
  initialCitizenProfile,
  initialComplaints,
  initialDuesBills,
  initialTreasuryRecords,
  initialAnnouncements,
  initialEmergencyContacts,
  initialLetterRequests,
  initialHouseholds,
} from './data/initialData';
import {
  CitizenProfile,
  Complaint,
  ComplaintStatus,
  DuesBill,
  EmergencyContact,
  Household,
  LetterRequest,
  PaymentMethod,
  TreasuryRecord,
} from './types';
import { CheckCircle2, Info, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function App() {
  // Navigation & Role State
  const [activeTab, setActiveTab] = useState<NavTab>('beranda');
  const [profile, setProfile] = useState<CitizenProfile>(() => {
    const saved = localStorage.getItem('wargahub_profile');
    return saved ? JSON.parse(saved) : initialCitizenProfile;
  });

  // Data Collections with LocalStorage
  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const saved = localStorage.getItem('wargahub_complaints');
    return saved ? JSON.parse(saved) : initialComplaints;
  });

  const [duesBills, setDuesBills] = useState<DuesBill[]>(() => {
    const saved = localStorage.getItem('wargahub_dues');
    return saved ? JSON.parse(saved) : initialDuesBills;
  });

  const [treasuryRecords, setTreasuryRecords] = useState<TreasuryRecord[]>(() => {
    const saved = localStorage.getItem('wargahub_treasury');
    return saved ? JSON.parse(saved) : initialTreasuryRecords;
  });

  const [letterRequests, setLetterRequests] = useState<LetterRequest[]>(() => {
    const saved = localStorage.getItem('wargahub_letters');
    return saved ? JSON.parse(saved) : initialLetterRequests;
  });

  const [households, setHouseholds] = useState<Household[]>(() => {
    const saved = localStorage.getItem('wargahub_households');
    return saved ? JSON.parse(saved) : initialHouseholds;
  });

  // Modal States
  const [isNewComplaintOpen, setIsNewComplaintOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [selectedBillForPayment, setSelectedBillForPayment] = useState<DuesBill | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const [selectedBillForReceipt, setSelectedBillForReceipt] = useState<DuesBill | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  const [isLetterModalOpen, setIsLetterModalOpen] = useState(false);
  const [selectedLetterForDoc, setSelectedLetterForDoc] = useState<LetterRequest | null>(null);
  const [isLetterDocOpen, setIsLetterDocOpen] = useState(false);

  const [selectedLetterForApproval, setSelectedLetterForApproval] = useState<LetterRequest | null>(null);
  const [isLetterApprovalOpen, setIsLetterApprovalOpen] = useState(false);

  // Household & Census Modal States
  const [selectedHouseholdForCard, setSelectedHouseholdForCard] = useState<Household | null>(null);
  const [isFamilyCardOpen, setIsFamilyCardOpen] = useState(false);
  const [isNewHouseholdOpen, setIsNewHouseholdOpen] = useState(false);

  // Dues QR & Portal Modal States
  const [selectedBillForQr, setSelectedBillForQr] = useState<DuesBill | null>(null);
  const [isBillQrOpen, setIsBillQrOpen] = useState(false);

  const [selectedBillForPortal, setSelectedBillForPortal] = useState<DuesBill | null>(null);
  const [isBillPortalOpen, setIsBillPortalOpen] = useState(false);

  const [isBillScannerOpen, setIsBillScannerOpen] = useState(false);

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Toast notification system
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: 'success' | 'info' | 'warning';
  } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('wargahub_complaints', JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem('wargahub_dues', JSON.stringify(duesBills));
  }, [duesBills]);

  useEffect(() => {
    localStorage.setItem('wargahub_treasury', JSON.stringify(treasuryRecords));
  }, [treasuryRecords]);

  useEffect(() => {
    localStorage.setItem('wargahub_letters', JSON.stringify(letterRequests));
  }, [letterRequests]);

  useEffect(() => {
    localStorage.setItem('wargahub_households', JSON.stringify(households));
  }, [households]);

  useEffect(() => {
    localStorage.setItem('wargahub_profile', JSON.stringify(profile));
  }, [profile]);

  // Check URL query parameters for direct QR scan redirection to payment status portal
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const portalBillId = params.get('portalBillId');
      if (portalBillId) {
        const found = duesBills.find((b) => b.id === portalBillId);
        if (found) {
          setSelectedBillForPortal(found);
          setIsBillPortalOpen(true);
          showToast(`Membuka Portal Status Iuran ${found.month} (${found.houseNumber || 'RT 04'})`, 'info');
        }
      }
    }
  }, [duesBills]);

  // Actions
  const handleToggleRole = () => {
    const nextRole = profile.role === 'warga' ? 'pengurus' : 'warga';
    setProfile((prev) => ({ ...prev, role: nextRole }));
    if (nextRole === 'pengurus') {
      showToast('Beralih ke Mode Pengurus RT 04 (Akses verifikasi laporan & kas)', 'info');
    } else {
      showToast('Beralih ke Mode Warga (Hunian Blok B4 No. 12)', 'info');
    }
  };

  const handleCreateComplaint = (
    newComplaintData: Omit<Complaint, 'id' | 'ticketNumber' | 'createdAt' | 'upvotes' | 'timeline'>
  ) => {
    const ticketNum = `LAP-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newEntry: Complaint = {
      ...newComplaintData,
      id: `c-${Date.now()}`,
      ticketNumber: ticketNum,
      createdAt: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      upvotes: 1,
      upvotedByMe: true,
      timeline: [
        {
          status: 'menunggu',
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          note: 'Laporan keluhan warga berhasil tercatat di sistem RT 04.',
          actor: newComplaintData.isAnonymous ? 'Warga Anonim' : profile.name,
        },
      ],
    };

    setComplaints([newEntry, ...complaints]);
    showToast(`Keluhan berhasil diajukan dengan nomor tiket ${ticketNum}!`);
  };

  const handleUpvoteComplaint = (id: string) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const isUpvoted = c.upvotedByMe;
          return {
            ...c,
            upvotes: isUpvoted ? c.upvotes - 1 : c.upvotes + 1,
            upvotedByMe: !isUpvoted,
          };
        }
        return c;
      })
    );

    // Also update selected modal complaint if open
    if (selectedComplaint && selectedComplaint.id === id) {
      setSelectedComplaint((prev) =>
        prev
          ? {
              ...prev,
              upvotes: prev.upvotedByMe ? prev.upvotes - 1 : prev.upvotes + 1,
              upvotedByMe: !prev.upvotedByMe,
            }
          : null
      );
    }
  };

  const handleUpdateComplaintStatus = (
    id: string,
    newStatus: ComplaintStatus,
    officerNote: string
  ) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const newTimelineItem = {
            status: newStatus,
            timestamp: `${new Date().toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
            })}, ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`,
            note: officerNote,
            actor: 'Pengurus RT 04',
          };
          return {
            ...c,
            status: newStatus,
            officialNotes: officerNote,
            timeline: [...c.timeline, newTimelineItem],
          };
        }
        return c;
      })
    );

    setIsDetailOpen(false);
    showToast(`Status laporan berhasil diperbarui menjadi "${newStatus}"!`);
  };

  const handlePaymentSuccess = (
    billId: string,
    method: PaymentMethod,
    receiptNumber: string
  ) => {
    const paidTimestamp = `${new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })}, ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`;

    let paidBillObj: DuesBill | null = null;

    setDuesBills((prev) =>
      prev.map((b) => {
        if (b.id === billId) {
          paidBillObj = {
            ...b,
            status: 'lunas',
            paidAt: paidTimestamp,
            paymentMethod: method,
            receiptNumber: receiptNumber,
          };
          return paidBillObj;
        }
        return b;
      })
    );

    // Automatically record income in treasury ledger
    const targetBill = duesBills.find((b) => b.id === billId);
    if (targetBill) {
      const newTreasuryItem: TreasuryRecord = {
        id: `tr-${Date.now()}`,
        title: `Penerimaan Iuran ${targetBill.month} - ${profile.houseNumber}`,
        type: 'masuk',
        amount: targetBill.totalAmount,
        category: 'Iuran Rutin Warga',
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        pic: 'Sistem Pembayaran Otomatis QRIS/VA',
        receiptNumber: receiptNumber,
      };
      setTreasuryRecords((prev) => [newTreasuryItem, ...prev]);
    }

    showToast(`Pembayaran iuran ${targetBill?.month || ''} berhasil diverifikasi!`);

    // Open receipt modal after brief delay for delightful experience
    if (paidBillObj) {
      setSelectedBillForReceipt(paidBillObj);
      setIsReceiptOpen(true);
    }
  };

  const handleCreateLetterRequest = (
    reqData: Omit<LetterRequest, 'id' | 'referenceNumber' | 'status' | 'createdAt'>
  ) => {
    const currentMonthRoman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'][
      new Date().getMonth()
    ];
    const refNum = `470/${Math.floor(100 + Math.random() * 900)}/RT.04-RW.08/${currentMonthRoman}/${new Date().getFullYear()}`;
    const newReq: LetterRequest = {
      ...reqData,
      id: `req-${Date.now()}`,
      referenceNumber: refNum,
      status: 'menunggu',
      createdAt: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      officerNotes: 'Permohonan lengkap diajukan warga. Menunggu review & TTD digital pengurus RT.',
    };

    setLetterRequests([newReq, ...letterRequests]);
    showToast(`Formulir surat berhasil diajukan (No: ${refNum})!`);
  };

  const handleApproveLetterWithDetails = (
    id: string,
    approvalData: {
      referenceNumber: string;
      officerName: string;
      officerRole: string;
      validUntil: string;
      officerNotes: string;
      officerSignatureHash: string;
    }
  ) => {
    let approvedLetterObj: LetterRequest | null = null;
    const approvedTimestamp = `${new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })}, ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`;

    setLetterRequests((prev) =>
      prev.map((lr) => {
        if (lr.id === id) {
          approvedLetterObj = {
            ...lr,
            ...approvalData,
            status: 'disetujui',
            approvedAt: approvedTimestamp,
            digitalStampApplied: true,
          };
          return approvedLetterObj;
        }
        return lr;
      })
    );

    showToast('Surat pengantar berhasil disahkan dengan tanda tangan digital resmi!');

    if (approvedLetterObj) {
      setSelectedLetterForDoc(approvedLetterObj);
      setIsLetterDocOpen(true);
    }
  };

  const handleRejectLetter = (id: string, reason: string) => {
    setLetterRequests((prev) =>
      prev.map((lr) => {
        if (lr.id === id) {
          return {
            ...lr,
            status: 'ditolak',
            officerNotes: `Ditolak oleh Pengurus RT: ${reason}`,
          };
        }
        return lr;
      })
    );
    showToast('Permohonan surat ditolak dengan catatan perbaikan.', 'warning');
  };

  const handleAddTreasuryRecord = (newRec: Omit<TreasuryRecord, 'id'>) => {
    const entry: TreasuryRecord = {
      ...newRec,
      id: `tr-${Date.now()}`,
    };
    setTreasuryRecords([entry, ...treasuryRecords]);
    showToast('Transaksi kas RT berhasil disimpan!');
  };

  const handleQuickCall = (contact: EmergencyContact) => {
    showToast(`Menghubungi ${contact.name} (${contact.phone})...`, 'info');
  };

  const handleOpenBillQr = (bill: DuesBill) => {
    setSelectedBillForQr(bill);
    setIsBillQrOpen(true);
  };

  const handleOpenPortalFromQr = (bill: DuesBill) => {
    setIsBillQrOpen(false);
    setSelectedBillForPortal(bill);
    setIsBillPortalOpen(true);
  };

  const handlePayFromPortal = (bill: DuesBill) => {
    setIsBillPortalOpen(false);
    setSelectedBillForPayment(bill);
    setIsPaymentOpen(true);
  };

  const handleViewReceiptFromPortal = (bill: DuesBill) => {
    setIsBillPortalOpen(false);
    setSelectedBillForReceipt(bill);
    setIsReceiptOpen(true);
  };

  const handleCreateHousehold = (newHhData: Omit<Household, 'id' | 'isVerified'>) => {
    const newEntry: Household = {
      ...newHhData,
      id: `kk-${Date.now()}`,
      isVerified: true,
    };
    setHouseholds((prev) => [newEntry, ...prev]);
    showToast(
      `Data KK ${newHhData.headOfFamily} (${
        newHhData.householdType === 'kk_dalam_wilayah' ? 'KK Dalam Wilayah' : 'KK Luar Wilayah'
      }) berhasil didaftarkan!`
    );
  };

  const handleSelectScannedBill = (bill: DuesBill) => {
    setSelectedBillForPortal(bill);
    setIsBillPortalOpen(true);
    showToast(`Berhasil memindai tagihan ${bill.month} (${bill.houseNumber || 'RT 04'})!`);
  };

  // Find unpaid bill
  const unpaidBill = duesBills.find((b) => b.status === 'belum_bayar');
  const activeComplaintsCount = complaints.filter(
    (c) => c.status === 'menunggu' || c.status === 'diproses'
  ).length;

  return (
    <MobileFrame>
      {/* Toast Feedback Bar */}
      {toastMessage && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm transition-all duration-300 animate-in slide-in-from-top-2">
          <div
            className={`p-3 rounded-2xl shadow-xl border flex items-center gap-2.5 text-xs font-semibold backdrop-blur-md ${
              toastMessage.type === 'success'
                ? 'bg-emerald-900/95 text-white border-emerald-500 shadow-emerald-950/30'
                : toastMessage.type === 'warning'
                ? 'bg-amber-900/95 text-white border-amber-500 shadow-amber-950/30'
                : 'bg-slate-900/95 text-white border-slate-600 shadow-black/40'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-amber-400 shrink-0" />
            )}
            <span className="flex-1 leading-snug">{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Top App Bar */}
      <TopBar
        profile={profile}
        onToggleRole={handleToggleRole}
        unreadCount={initialAnnouncements.length}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1 flex flex-col">
        {activeTab === 'beranda' && (
          <HomeView
            profile={profile}
            activeBill={unpaidBill || duesBills[0]}
            complaints={complaints}
            announcements={initialAnnouncements}
            emergencyContacts={initialEmergencyContacts}
            households={households}
            onOpenNewComplaint={() => setIsNewComplaintOpen(true)}
            onOpenPayment={(bill) => {
              setSelectedBillForPayment(bill);
              setIsPaymentOpen(true);
            }}
            onOpenBillQr={handleOpenBillQr}
            onOpenComplaintDetail={(c) => {
              setSelectedComplaint(c);
              setIsDetailOpen(true);
            }}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenLetterModal={() => setIsLetterModalOpen(true)}
            onQuickCall={handleQuickCall}
          />
        )}

        {activeTab === 'warga' && (
          <CitizensView
            households={households}
            userRole={profile.role}
            currentUserName={profile.name}
            onOpenNewHousehold={() => setIsNewHouseholdOpen(true)}
            onSelectHousehold={(hh) => {
              setSelectedHouseholdForCard(hh);
              setIsFamilyCardOpen(true);
            }}
          />
        )}

        {activeTab === 'keluhan' && (
          <ComplaintsView
            complaints={complaints}
            onOpenNewComplaint={() => setIsNewComplaintOpen(true)}
            onSelectComplaint={(c) => {
              setSelectedComplaint(c);
              setIsDetailOpen(true);
            }}
            onUpvote={handleUpvoteComplaint}
            currentUserName={profile.name}
          />
        )}

        {activeTab === 'iuran' && (
          <DuesView
            bills={duesBills}
            treasuryRecords={treasuryRecords}
            onOpenPayment={(bill) => {
              setSelectedBillForPayment(bill);
              setIsPaymentOpen(true);
            }}
            onOpenReceipt={(bill) => {
              setSelectedBillForReceipt(bill);
              setIsReceiptOpen(true);
            }}
            onOpenBillQr={handleOpenBillQr}
            onOpenScanner={() => setIsBillScannerOpen(true)}
            userRole={profile.role}
            onAddTreasuryRecord={handleAddTreasuryRecord}
          />
        )}

        {activeTab === 'layanan' && (
          <ServicesView
            letterRequests={letterRequests}
            emergencyContacts={initialEmergencyContacts}
            onOpenLetterModal={() => setIsLetterModalOpen(true)}
            onCallContact={handleQuickCall}
            userRole={profile.role}
            onViewDocument={(letter) => {
              setSelectedLetterForDoc(letter);
              setIsLetterDocOpen(true);
            }}
            onOpenApproval={(letter) => {
              setSelectedLetterForApproval(letter);
              setIsLetterApprovalOpen(true);
            }}
          />
        )}
      </main>

      {/* Sticky Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        activeComplaintsCount={activeComplaintsCount}
        hasUnpaidDues={!!unpaidBill}
      />

      {/* MODALS */}
      <NewComplaintModal
        isOpen={isNewComplaintOpen}
        onClose={() => setIsNewComplaintOpen(false)}
        onSubmit={handleCreateComplaint}
        defaultReporterName={profile.name}
        defaultReporterHouse={profile.houseNumber}
      />

      <ComplaintDetailModal
        complaint={selectedComplaint}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedComplaint(null);
        }}
        onUpvote={handleUpvoteComplaint}
        userRole={profile.role}
        onUpdateStatus={handleUpdateComplaintStatus}
      />

      <PaymentModal
        bill={selectedBillForPayment}
        isOpen={isPaymentOpen}
        onClose={() => {
          setIsPaymentOpen(false);
          setSelectedBillForPayment(null);
        }}
        onPaymentSuccess={handlePaymentSuccess}
      />

      <ReceiptModal
        bill={selectedBillForReceipt}
        isOpen={isReceiptOpen}
        onClose={() => {
          setIsReceiptOpen(false);
          setSelectedBillForReceipt(null);
        }}
        residentName={profile.name}
        residentHouse={profile.houseNumber}
      />

      <LetterRequestModal
        isOpen={isLetterModalOpen}
        onClose={() => setIsLetterModalOpen(false)}
        onSubmit={handleCreateLetterRequest}
        defaultName={profile.name}
        defaultHouse={profile.houseNumber}
      />

      <LetterDocumentModal
        letter={selectedLetterForDoc}
        isOpen={isLetterDocOpen}
        onClose={() => {
          setIsLetterDocOpen(false);
          setSelectedLetterForDoc(null);
        }}
      />

      <LetterApprovalModal
        letter={selectedLetterForApproval}
        isOpen={isLetterApprovalOpen}
        onClose={() => {
          setIsLetterApprovalOpen(false);
          setSelectedLetterForApproval(null);
        }}
        onApprove={handleApproveLetterWithDetails}
        onReject={handleRejectLetter}
      />

      <BillQrModal
        bill={selectedBillForQr}
        isOpen={isBillQrOpen}
        onClose={() => {
          setIsBillQrOpen(false);
          setSelectedBillForQr(null);
        }}
        onOpenPortal={handleOpenPortalFromQr}
      />

      <BillPortalModal
        bill={selectedBillForPortal}
        isOpen={isBillPortalOpen}
        onClose={() => {
          setIsBillPortalOpen(false);
          setSelectedBillForPortal(null);
        }}
        onPayBill={handlePayFromPortal}
        onViewReceipt={handleViewReceiptFromPortal}
      />

      <BillScannerModal
        bills={duesBills}
        isOpen={isBillScannerOpen}
        onClose={() => setIsBillScannerOpen(false)}
        onSelectScannedBill={handleSelectScannedBill}
      />

      <FamilyCardModal
        household={selectedHouseholdForCard}
        isOpen={isFamilyCardOpen}
        onClose={() => {
          setIsFamilyCardOpen(false);
          setSelectedHouseholdForCard(null);
        }}
        userRole={profile.role}
        currentUserName={profile.name}
      />

      <NewHouseholdModal
        isOpen={isNewHouseholdOpen}
        onClose={() => setIsNewHouseholdOpen(false)}
        onSubmit={handleCreateHousehold}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        announcements={initialAnnouncements}
      />
    </MobileFrame>
  );
}
