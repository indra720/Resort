import React, { useState } from 'react';
import { MOCK_BOOKINGS } from '@/data/mockData';
import { useAuthStore } from '@/store/useAuthStore';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { formatINR } from '@/lib/formatINR';
import { toast } from '@/store/useToastStore';
import {
  Users,
  ShieldCheck,
  UploadCloud,
  FileCheck,
  Calendar,
  Eye,
  CreditCard,
  Crown,
  Key,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  Receipt,
} from 'lucide-react';

export interface ResortGuest {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  currentRoom: string;
  kycStatus: 'Verified' | 'Pending Verification';
  idType: 'Aadhaar Card' | 'Passport' | 'Voter ID';
  loyaltyTier: 'Aura Platinum' | 'Aura Gold' | 'Aura Silver';
  totalStays: number;
  totalSpent: number;
  vipNote?: string;
}

const INITIAL_RESORT_GUESTS: ResortGuest[] = [
  {
    id: 'gst-101',
    name: 'Rohan Mehra',
    phone: '+91 98200 44332',
    email: 'rohan.mehra@gmail.com',
    city: 'Mumbai, Maharashtra',
    currentRoom: 'Deluxe Cottage #102',
    kycStatus: 'Verified',
    idType: 'Aadhaar Card',
    loyaltyTier: 'Aura Gold',
    totalStays: 3,
    totalSpent: 74500,
    vipNote: 'Prefers lake-view ground floor cottage and early morning green tea.',
  },
  {
    id: 'gst-102',
    name: 'Kavita Iyer',
    phone: '+91 98411 22998',
    email: 'kavita.iyer@outlook.com',
    city: 'Bengaluru, Karnataka',
    currentRoom: 'Luxury Suite #201',
    kycStatus: 'Verified',
    idType: 'Passport',
    loyaltyTier: 'Aura Platinum',
    totalStays: 5,
    totalSpent: 168000,
    vipNote: 'Allergic to shellfish. Requested private evening gazebo dining setup.',
  },
  {
    id: 'gst-103',
    name: 'Devendra Singhania',
    phone: '+91 97110 55443',
    email: 'd.singhania@group.in',
    city: 'New Delhi',
    currentRoom: 'Presidential Pool Villa #V-01',
    kycStatus: 'Verified',
    idType: 'Passport',
    loyaltyTier: 'Aura Platinum',
    totalStays: 7,
    totalSpent: 385000,
    vipNote: 'VIP Corporate Chairman. Requires private airport BMW pickup.',
  },
  {
    id: 'gst-104',
    name: 'Amitabh Joshi',
    phone: '+91 99220 11442',
    email: 'amitabh.j@tcs.com',
    city: 'Pune, Maharashtra',
    currentRoom: 'Deluxe Cottage #101',
    kycStatus: 'Pending Verification',
    idType: 'Aadhaar Card',
    loyaltyTier: 'Aura Silver',
    totalStays: 1,
    totalSpent: 28500,
    vipNote: 'First-time corporate retreat guest. ID verification pending at front desk.',
  },
  {
    id: 'gst-105',
    name: 'Pooja Hegde',
    phone: '+91 98201 44210',
    email: 'pooja.h@films.in',
    city: 'Hyderabad, Telangana',
    currentRoom: 'Sunset Jacuzzi Suite #V-07',
    kycStatus: 'Verified',
    idType: 'Passport',
    loyaltyTier: 'Aura Platinum',
    totalStays: 4,
    totalSpent: 210000,
    vipNote: 'Celebrity guest. Maintain strict discretion; no unauthorized photography.',
  },
];

export const GuestListPage: React.FC = () => {
  const { role } = useAuthStore();
  const [guests, setGuests] = useState<ResortGuest[]>(INITIAL_RESORT_GUESTS);
  const [selectedGuest, setSelectedGuest] = useState<ResortGuest | null>(null);
  const [uploadedDocName, setUploadedDocName] = useState<string | null>(null);

  const isReceptionist = role === 'Receptionist';
  const isAccountant = role === 'Accountant';

  const handleVerifyKyc = (id: string) => {
    setGuests((prev) =>
      prev.map((g) => (g.id === id ? { ...g, kycStatus: 'Verified' } : g))
    );
    toast.success('KYC Verified', 'Government photo ID verified and stamped.');
    if (selectedGuest) {
      setSelectedGuest({ ...selectedGuest, kycStatus: 'Verified' });
    }
  };

  const columns: Column<ResortGuest>[] = [
    {
      key: 'name',
      header: 'Guest Name & City',
      accessor: (g) => (
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-[#1F2937] block">{g.name}</span>
            {g.loyaltyTier === 'Aura Platinum' && (
              <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            )}
          </div>
          <span className="text-[11px] text-[#6B7280]">{g.city}</span>
        </div>
      ),
      sortable: true,
      sortValue: (g) => g.name,
    },
    {
      key: 'phone',
      header: 'Contact Info',
      accessor: (g) => (
        <div className="text-xs">
          <span className="font-medium text-slate-800 block">{g.phone}</span>
          <span className="text-[11px] text-slate-500">{g.email}</span>
        </div>
      ),
    },
    {
      key: 'room',
      header: 'Current Stay',
      accessor: (g) => (
        <span className="text-xs font-semibold text-[#0F5132]">
          {g.currentRoom}
        </span>
      ),
    },
    {
      key: 'loyalty',
      header: 'Club Tier',
      accessor: (g) => (
        <span
          className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
            g.loyaltyTier === 'Aura Platinum'
              ? 'bg-purple-100 text-purple-800 border border-purple-200'
              : g.loyaltyTier === 'Aura Gold'
              ? 'bg-amber-100 text-amber-800 border border-amber-200'
              : 'bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          {g.loyaltyTier}
        </span>
      ),
    },
    {
      key: 'kyc',
      header: 'Govt KYC (ID Proof)',
      accessor: (g) => (
        <span
          className={`text-[11px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
            g.kycStatus === 'Verified'
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-rose-100 text-rose-800 animate-pulse'
          }`}
        >
          {g.kycStatus === 'Verified' ? (
            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
          ) : (
            <Clock className="w-3 h-3 text-rose-700" />
          )}
          {g.kycStatus}
        </span>
      ),
    },
    {
      key: 'spending',
      header: 'Lifetime Spend',
      accessor: (g) => (
        <div className="text-xs">
          <span className="font-bold text-slate-900 block">{formatINR(g.totalSpent)}</span>
          <span className="text-[10px] text-slate-500">{g.totalStays} visits</span>
        </div>
      ),
      sortable: true,
      sortValue: (g) => g.totalSpent,
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-5 text-left">
      {/* Role-Specific Banner */}
      {isReceptionist && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <Key className="w-5 h-5 text-blue-100" />
            </div>
            <div>
              <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">
                Front Desk Guest Directory & Mandatory KYC Verification
              </span>
              <p className="text-xs text-[#475569] mt-0.5">
                Indian Tourism Regulation requires mandatory Aadhaar / Passport identification before RFID key handover.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-blue-800 bg-white px-3 py-1 rounded-full border border-blue-200">
            {guests.filter((g) => g.kycStatus === 'Verified').length} / {guests.length} KYC Verified
          </span>
        </div>
      )}

      {isAccountant && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0F5132] text-white flex items-center justify-center font-bold">
              <Receipt className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#0F5132] uppercase tracking-wider">
                Guest Ledger & Lifetime Revenue Records
              </span>
              <p className="text-xs text-[#475569] mt-0.5">
                Total guest revenue tracked: <strong>{formatINR(guests.reduce((acc, g) => acc + g.totalSpent, 0))}</strong> across {guests.length} resident guests.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.success('Guest Ledger', 'Guest tax records exported to Excel')}
          >
            Export Ledger
          </Button>
        </div>
      )}

      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F5132]">
          Resort Guest Directory & Resident Profiles
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7280]">
          Verified resident guests, loyalty tiers, stay preferences, and mandatory KYC verification.
        </p>
      </div>

      <DataTable
        data={guests}
        columns={columns}
        keyExtractor={(g) => g.id}
        searchPlaceholder="Search guest directory by name, phone or room..."
        pageSize={6}
        actions={(g) => (
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedGuest(g);
              setUploadedDocName(null);
            }}
            leftIcon={<Eye className="w-3.5 h-3.5" />}
          >
            View Profile
          </Button>
        )}
      />

      {/* Guest Profile & KYC Document Modal */}
      {selectedGuest && (
        <Modal
          isOpen={!!selectedGuest}
          onClose={() => setSelectedGuest(null)}
          title={`Guest Profile: ${selectedGuest.name}`}
          description={`Resident at ${selectedGuest.currentRoom} • ${selectedGuest.loyaltyTier}`}
          maxWidth="2xl"
          footer={
            <div className="flex justify-between w-full">
              {selectedGuest.kycStatus !== 'Verified' && isReceptionist ? (
                <Button
                  variant="primary"
                  onClick={() => handleVerifyKyc(selectedGuest.id)}
                  leftIcon={<CheckCircle2 className="w-4 h-4" />}
                >
                  Approve KYC Document
                </Button>
              ) : (
                <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> ID Verification Complete
                </span>
              )}
              <Button
                variant="outline"
                onClick={() => setSelectedGuest(null)}
              >
                Close Profile
              </Button>
            </div>
          }
        >
          <div className="space-y-4 text-left">
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#0F5132] border-2 border-[#0F5132] flex items-center justify-center font-bold text-base shadow-sm">
                  {selectedGuest.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-base font-bold text-[#1F2937]">{selectedGuest.name}</p>
                  <p className="text-xs text-[#6B7280]">{selectedGuest.email} • {selectedGuest.phone}</p>
                  <p className="text-xs text-[#0F5132] font-semibold">{selectedGuest.currentRoom}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 block">Total Lifetime Spend</span>
                <span className="text-base font-black text-[#0F5132]">{formatINR(selectedGuest.totalSpent)}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* VIP Preferences Note */}
              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                <span className="font-bold block mb-1">Concierge & Butler VIP Note:</span>
                <p>{selectedGuest.vipNote || 'Standard guest profile with no special butler requests.'}</p>
              </div>

              {/* Government ID KYC Verification Section */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">
                    Government Photo ID: {selectedGuest.idType}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      selectedGuest.kycStatus === 'Verified'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {selectedGuest.kycStatus}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  ID Proof verified against UIDAI / Ministry of External Affairs records. Stored encrypted per Indian Digital Data Protection Act.
                </p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
