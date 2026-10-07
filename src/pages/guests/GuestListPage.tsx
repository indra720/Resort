import React, { useState } from 'react';
import { MOCK_USERS, MOCK_BOOKINGS } from '@/data/mockData';
import { User } from '@/types';
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
} from 'lucide-react';

export const GuestListPage: React.FC = () => {
  const [guests] = useState<User[]>(MOCK_USERS);
  const [selectedGuest, setSelectedGuest] = useState<User | null>(null);
  const [uploadedDocName, setUploadedDocName] = useState<string | null>(null);

  const columns: Column<User>[] = [
    {
      key: 'name',
      header: 'Guest Name',
      accessor: (u) => (
        <div>
          <span className="font-semibold text-[#0F172A] block">{u.name}</span>
          <span className="text-[11px] text-[#64748B]">{u.email}</span>
        </div>
      ),
      sortable: true,
      sortValue: (u) => u.name,
    },
    {
      key: 'phone',
      header: 'Mobile Phone',
      accessor: (u) => <span>{u.phone}</span>,
    },
    {
      key: 'role',
      header: 'Category',
      accessor: (u) => (
        <span className="text-xs px-2 py-0.5 rounded-full bg-[#FFF7ED] text-[#B84C00] border border-[#FFEDD5] font-medium">
          {u.role === 'Guest' ? 'Registered Guest' : 'Staff Profile'}
        </span>
      ),
    },
    {
      key: 'department',
      header: 'Loyalty / Notes',
      accessor: (u) => (
        <span className="text-xs text-[#64748B]">
          {u.department || 'Aura Club Gold Member'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-5 text-left">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#B84C00]">
          Resort Guest Directory
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B]">
          Guest profiles, stay history audits, and KYC Aadhaar/Passport verification.
        </p>
      </div>

      <DataTable
        data={guests}
        columns={columns}
        keyExtractor={(g) => g.id}
        searchPlaceholder="Search guest directory by name or phone..."
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
            Guest Profile
          </Button>
        )}
      />

      {/* Guest Profile & ID Document Upload Modal */}
      {selectedGuest && (
        <Modal
          isOpen={!!selectedGuest}
          onClose={() => setSelectedGuest(null)}
          title={`Guest Profile: ${selectedGuest.name}`}
          description="Verified guest profile, stay records, and government KYC documents"
          maxWidth="lg"
          footer={
            <div className="flex justify-end w-full">
              <Button
                variant="primary"
                onClick={() => setSelectedGuest(null)}
              >
                Close Profile
              </Button>
            </div>
          }
        >
          <div className="space-y-4 text-left">
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white border-2 border-[#B84C00] flex items-center justify-center font-bold text-base text-[#B84C00] shadow-sm">
                {selectedGuest.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="space-y-0.5">
                <p className="text-base font-bold text-[#0F172A]">{selectedGuest.name}</p>
                <p className="text-xs text-[#64748B]">{selectedGuest.email} • {selectedGuest.phone}</p>
              </div>
            </div>

            {/* Stay History */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase text-[#64748B]">
                Resort Stay History (Last Visits)
              </h4>
              <div className="space-y-2">
                {MOCK_BOOKINGS.slice(0, 2).map((b) => (
                  <div
                    key={b.id}
                    className="p-3 rounded-lg bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-[#0F172A] block">
                        Room #{b.roomNumber} ({b.bookingCode})
                      </span>
                      <span className="text-[#64748B]">
                        {b.checkIn} to {b.checkOut}
                      </span>
                    </div>
                    <span className="font-bold text-[#B84C00]">{formatINR(b.totalAmount)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Government ID Document Upload UI */}
            <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
              <h4 className="text-xs font-semibold uppercase text-[#64748B] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#B84C00]" />
                <span>KYC Identity Verification Document (Aadhaar / Passport)</span>
              </h4>

              {uploadedDocName ? (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-xs text-emerald-800">
                    <FileCheck className="w-5 h-5 shrink-0 text-emerald-600" />
                    <div>
                      <span className="font-semibold block">{uploadedDocName}</span>
                      <span className="text-[11px] text-[#64748B]">Verified digitally</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setUploadedDocName(null)}
                  >
                    Replace
                  </Button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-[#E2E8F0] hover:border-[#B84C00] rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition-colors bg-[#F8FAFC]">
                  <UploadCloud className="w-8 h-8 text-[#B84C00] mb-2" />
                  <span className="text-xs font-semibold text-[#0F172A]">
                    Upload Scanned ID (PDF, PNG, JPG)
                  </span>
                  <span className="text-[11px] text-[#64748B] mt-0.5">
                    Maximum file size: 5MB
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setUploadedDocName(file.name);
                        toast.success('KYC Uploaded', `${file.name} saved successfully.`);
                      }
                    }}
                  />
                </label>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
