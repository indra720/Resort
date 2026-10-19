import React, { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { PERMISSIONS } from '@/lib/permissions';
import { MOCK_ROOMS } from '@/data/mockData';
import { Room } from '@/types';
import { Button } from '@/components/ui/Button';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Modal } from '@/components/ui/Modal';
import { AddEditRoomModal } from './AddEditRoomModal';
import { AvailabilityCalendar } from './AvailabilityCalendar';
import { formatINR } from '@/lib/formatINR';
import { toast } from '@/store/useToastStore';
import {
  BedDouble,
  LayoutGrid,
  Table as TableIcon,
  Calendar,
  PlusCircle,
  Users,
  CheckCircle,
  Edit2,
  Eye,
  Crown,
  Activity,
  Clock,
  Building2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export const RoomsPage: React.FC = () => {
  const { role } = useAuthStore();
  const canManage = PERMISSIONS.canManageRooms(role);

  const [rooms, setRooms] = useState<Room[]>(MOCK_ROOMS);
  const [viewMode, setViewMode] = useState<'grid' | 'table' | 'calendar'>('grid');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Modal states
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [selectedRoomDetails, setSelectedRoomDetails] = useState<Room | null>(null);

  const handleSaveRoom = (updatedRoom: Partial<Room>) => {
    if (editingRoom) {
      setRooms((prev) =>
        prev.map((r) => (r.id === editingRoom.id ? ({ ...r, ...updatedRoom } as Room) : r))
      );
    } else {
      setRooms((prev) => [updatedRoom as Room, ...prev]);
    }
  };

  const filteredRooms = rooms.filter((r) => {
    if (categoryFilter === 'ALL') return true;
    return r.category === categoryFilter;
  });

  const columns: Column<Room>[] = [
    {
      key: 'roomNumber',
      header: 'Room',
      accessor: (r) => <span className="font-bold text-[#1F2937]">#{r.roomNumber}</span>,
      sortable: true,
      sortValue: (r) => r.roomNumber,
    },
    {
      key: 'category',
      header: 'Category',
      accessor: (r) => <span className="text-[#6B7280]">{r.category}</span>,
      sortable: true,
      sortValue: (r) => r.category,
    },
    {
      key: 'floor',
      header: 'Floor',
      accessor: (r) => <span>Floor {r.floor}</span>,
    },
    {
      key: 'ratePerNight',
      header: 'Tariff / Night',
      accessor: (r) => (
        <span className="font-semibold text-[#0F5132]">{formatINR(r.ratePerNight)}</span>
      ),
      sortable: true,
      sortValue: (r) => r.ratePerNight,
    },
    {
      key: 'maxGuests',
      header: 'Capacity',
      accessor: (r) => <span>{r.maxGuests} Guests</span>,
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (r) => <StatusBadge status={r.status} size="sm" />,
    },
  ];

  const isOwner = role === 'Resort Owner' || role === 'Super Admin';
  const isManager = role === 'Resort Manager';
  const isReceptionist = role === 'Receptionist';
  const isHousekeeping = role === 'Housekeeping';
  const isGuest = role === 'Guest';

  return (
    <div className="space-y-3.5 sm:space-y-4 text-left pb-28 sm:pb-12">
      {/* Role-Specific Perspective Top Banner */}
      {isOwner ? (
        <div className="p-4 bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0F5132] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
              <Crown className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="text-xs font-bold text-[#0F5132] uppercase tracking-wider">
                  Resort Owner Asset Portfolio & Capex Valuation
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#DCFCE7] text-[#0F5132]">
                  Asset Inventory
                </span>
              </div>
              <p className="text-xs text-[#475569] mt-0.5">
                30 Active Keys with total property asset valuation of <strong>₹18.50 Cr</strong> (Avg ₹61.6L / key). Portfolio RevPAR sits at <strong>₹11,360</strong>.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold shrink-0 self-start sm:self-auto">
            <span className="px-2.5 py-1 rounded-full bg-white border border-emerald-300 text-[#0F5132]">
              ADR: ₹14,200
            </span>
            <span className="px-2.5 py-1 rounded-full bg-[#0F5132] text-white">
              Yield: 19.4%
            </span>
          </div>
        </div>
      ) : isManager ? (
        <div className="p-4 bg-gradient-to-r from-blue-50 via-sky-50/50 to-white border border-blue-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0284C7] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
              <Activity className="w-5 h-5 text-sky-100" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="text-xs font-bold text-[#0369A1] uppercase tracking-wider">
                  General Manager Live Inventory & Housekeeping SLA
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-sky-100 text-[#0369A1]">
                  Turnaround State
                </span>
              </div>
              <p className="text-xs text-[#475569] mt-0.5">
                Live operational readiness across all resort wings. Prioritize turnaround for Pool Villas before 14:00 check-in rush.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-bold shrink-0 self-start sm:self-auto">
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
              22 Clean & Ready
            </span>
            <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">
              2 In Cleaning
            </span>
          </div>
        </div>
      ) : isHousekeeping ? (
        <div className="p-4 bg-gradient-to-r from-amber-50 via-orange-50/50 to-white border border-amber-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
              <Sparkles className="w-5 h-5 text-amber-100" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                  Housekeeping Villa Inspection & Cleaning Roster
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-900">
                  Daily Shift Board
                </span>
              </div>
              <p className="text-xs text-[#475569] mt-0.5">
                Check sanitized linen replenishment, mini-bar restocking, and room readiness before front desk check-in.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-bold shrink-0 self-start sm:self-auto">
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
              Available Clean ({rooms.filter((r) => r.status === 'Available').length})
            </span>
            <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">
              Cleaning In-Progress ({rooms.filter((r) => r.status === 'Cleaning').length})
            </span>
          </div>
        </div>
      ) : isReceptionist ? (
        <div className="p-4 bg-gradient-to-r from-indigo-50 via-blue-50/50 to-white border border-indigo-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
              <Building2 className="w-5 h-5 text-indigo-100" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
                  Front Desk Room Keys & Allocation Availability
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-100 text-indigo-900">
                  Ready for Arrival
                </span>
              </div>
              <p className="text-xs text-[#475569] mt-0.5">
                Available rooms ready for immediate guest key programming and walk-in reservation assignment.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-bold shrink-0 self-start sm:self-auto">
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
              {rooms.filter((r) => r.status === 'Available').length} Ready for Check-In
            </span>
          </div>
        </div>
      ) : isGuest ? (
        <div className="p-4 bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0F5132] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="text-xs font-bold text-[#0F5132] uppercase tracking-wider">
                  Luxury Villas & Private Pool Cottages Gallery
                </span>
              </div>
              <p className="text-xs text-[#475569] mt-0.5">
                Explore our signature Goan architecture, private plunge pools, and open-air rainforest showers.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F172A]">
            {isOwner ? 'Resort Keys & Asset Portfolio' : 'Rooms & Operational Villas'}
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280]">
            {isOwner
              ? 'Capex inventory management, tariff tiers, and asset yield.'
              : 'Resort inventory management, live room occupancy, and turnaround status.'}
          </p>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2.5 w-full sm:w-auto">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-white border border-[#E5E7EB] shadow-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg text-xs flex items-center gap-1.5 transition-colors ${
                viewMode === 'grid'
                  ? 'bg-[#0F5132] text-white font-semibold'
                  : 'text-[#6B7280] hover:text-[#1F2937]'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg text-xs flex items-center gap-1.5 transition-colors ${
                viewMode === 'table'
                  ? 'bg-[#0F5132] text-white font-semibold'
                  : 'text-[#6B7280] hover:text-[#1F2937]'
              }`}
              title="Table View"
            >
              <TableIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Table</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`p-2 rounded-lg text-xs flex items-center gap-1.5 transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-[#0F5132] text-white font-semibold'
                  : 'text-[#6B7280] hover:text-[#1F2937]'
              }`}
              title="Availability Calendar"
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Calendar</span>
            </button>
          </div>

          {/* Add Room Button (Only allowed for Super Admin & Resort Manager) */}
          {canManage && (
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                setEditingRoom(null);
                setIsAddEditModalOpen(true);
              }}
              leftIcon={<PlusCircle className="w-4 h-4" />}
            >
              Add Room
            </Button>
          )}
        </div>
      </div>

      {/* Category Filter Pills (Smooth horizontal scroll without ugly scrollbar) */}
      {viewMode !== 'calendar' && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {['ALL', 'Deluxe Cottage', 'Luxury Suite', 'Pool Villa'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-1.5 text-xs rounded-xl border transition-all shrink-0 whitespace-nowrap ${
                categoryFilter === cat
                  ? 'bg-[#0F5132] text-white border-[#0F5132] font-bold shadow-2xs'
                  : 'bg-white text-[#64748B] border-[#E2E8F0] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
              }`}
            >
              {cat === 'ALL' ? 'All Accommodations' : cat}
            </button>
          ))}
        </div>
      )}

      {/* View Mode: Calendar */}
      {viewMode === 'calendar' && <AvailabilityCalendar />}

      {/* View Mode: Table (Plain HTML Table without TanStack) */}
      {viewMode === 'table' && (
        <DataTable
          data={filteredRooms}
          columns={columns}
          keyExtractor={(r) => r.id}
          pageSize={6}
          actions={(room) => (
            <div className="flex items-center justify-end gap-1.5">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedRoomDetails(room)}
                leftIcon={<Eye className="w-3.5 h-3.5" />}
              >
                View
              </Button>
              {canManage && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingRoom(room);
                    setIsAddEditModalOpen(true);
                  }}
                  leftIcon={<Edit2 className="w-3.5 h-3.5" />}
                >
                  Edit
                </Button>
              )}
            </div>
          )}
        />
      )}

      {/* View Mode: Grid (Cards with zero data truncation on mobile) */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {filteredRooms.map((room) => (
            <div
              key={room.id}
              className="rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#0F5132]/40 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.05)] hover:shadow-md transition-all flex flex-col justify-between overflow-hidden text-left"
            >
              {/* Card Header Banner */}
              <div className="bg-gradient-to-r from-emerald-50/70 via-slate-50/50 to-white px-4 py-3 border-b border-[#F1F5F9] flex items-center justify-between gap-2">
                <div>
                  <span className="text-base sm:text-lg font-black text-[#0F172A] block">
                    Room #{room.roomNumber}
                  </span>
                  <p className="text-[11px] font-semibold text-[#64748B]">{room.category} • Floor {room.floor}</p>
                </div>
                <StatusBadge status={room.status} size="sm" />
              </div>

              <div className="p-4 space-y-3 flex-1">
                <div className="flex items-baseline justify-between gap-1 p-2.5 rounded-xl bg-[#F8FAFC] border border-slate-100">
                  <div>
                    <span className="text-[10px] text-[#64748B] uppercase font-bold block">Tariff</span>
                    <span className="text-lg sm:text-xl font-black text-[#0F5132]">
                      {formatINR(room.ratePerNight)}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#64748B] font-medium self-end">/ night + GST</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-[#475569]">
                  <Users className="w-4 h-4 text-[#0F5132] shrink-0" />
                  <span>Up to <strong>{room.maxGuests} Guests</strong> capacity</span>
                </div>

                {/* Amenities Tags */}
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {room.amenities.map((am) => (
                    <span
                      key={am}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white text-[#475569] border border-slate-200 shadow-2xs"
                    >
                      {am}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-3 bg-[#F8FAFC]/90 border-t border-[#F1F5F9] flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 min-w-0"
                  onClick={() => setSelectedRoomDetails(room)}
                >
                  View Details
                </Button>
                {canManage && (
                  <Button
                    size="sm"
                    variant="secondary"
                    className="flex-1 min-w-0"
                    onClick={() => {
                      setEditingRoom(room);
                      setIsAddEditModalOpen(true);
                    }}
                  >
                    Edit Tariff
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Room Details Modal */}
      {selectedRoomDetails && (
        <Modal
          isOpen={!!selectedRoomDetails}
          onClose={() => setSelectedRoomDetails(null)}
          title={`Room #${selectedRoomDetails.roomNumber} Details`}
          description={selectedRoomDetails.category}
          footer={
            <div className="flex justify-end gap-3 w-full">
              <Button
                variant="primary"
                onClick={() => setSelectedRoomDetails(null)}
              >
                Close
              </Button>
            </div>
          }
        >
          <div className="space-y-4 text-left">
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] flex items-center justify-between">
              <div>
                <span className="text-xs text-[#6B7280] block">Standard Tariff</span>
                <span className="text-xl font-bold text-[#0F5132]">
                  {formatINR(selectedRoomDetails.ratePerNight)}
                </span>
                <span className="text-[11px] text-[#6B7280] block">per night</span>
              </div>
              <StatusBadge status={selectedRoomDetails.status} />
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase text-[#6B7280] mb-2">
                Included Amenities
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {selectedRoomDetails.amenities.map((am) => (
                  <div key={am} className="flex items-center gap-2 text-[#1F2937]">
                    <CheckCircle className="w-3.5 h-3.5 text-[#22C55E]" />
                    <span>{am}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Add / Edit Modal */}
      <AddEditRoomModal
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        onSave={handleSaveRoom}
        initialRoom={editingRoom}
      />
    </div>
  );
};
