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
      accessor: (r) => <span className="font-bold text-[#F5F5F7]">#{r.roomNumber}</span>,
      sortable: true,
      sortValue: (r) => r.roomNumber,
    },
    {
      key: 'category',
      header: 'Category',
      accessor: (r) => <span className="text-[#A1A1AA]">{r.category}</span>,
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
        <span className="font-semibold text-[#FF6B00]">{formatINR(r.ratePerNight)}</span>
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

  return (
    <div className="space-y-6 text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F5F5F7]">
            Rooms & Private Villas
          </h1>
          <p className="text-xs sm:text-sm text-[#A1A1AA]">
            Resort inventory management, live room occupancy, and pricing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-[#14141A] border border-[#2A2A35]">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg text-xs flex items-center gap-1.5 transition-colors ${
                viewMode === 'grid'
                  ? 'bg-[#FF6B00] text-white font-semibold'
                  : 'text-[#A1A1AA] hover:text-[#F5F5F7]'
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
                  ? 'bg-[#FF6B00] text-white font-semibold'
                  : 'text-[#A1A1AA] hover:text-[#F5F5F7]'
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
                  ? 'bg-[#FF6B00] text-white font-semibold'
                  : 'text-[#A1A1AA] hover:text-[#F5F5F7]'
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

      {/* Category Filter Pills */}
      {viewMode !== 'calendar' && (
        <div className="flex flex-wrap items-center gap-2">
          {['ALL', 'Deluxe Cottage', 'Luxury Suite', 'Pool Villa'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${
                categoryFilter === cat
                  ? 'bg-[#FF6B00] text-white border-[#FF6B00] font-semibold'
                  : 'bg-[#14141A] text-[#A1A1AA] border-[#2A2A35] hover:text-[#F5F5F7]'
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRooms.map((room) => (
            <div
              key={room.id}
              className="p-5 rounded-2xl bg-[#14141A] border border-[#2A2A35] hover:border-[#FF6B00]/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-lg font-bold text-[#F5F5F7]">
                      Room #{room.roomNumber}
                    </span>
                    <p className="text-xs text-[#A1A1AA]">{room.category} • Floor {room.floor}</p>
                  </div>
                  <StatusBadge status={room.status} size="sm" />
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-[#FF6B00]">
                    {formatINR(room.ratePerNight)}
                  </span>
                  <span className="text-xs text-[#A1A1AA]">/ night + GST</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-[#A1A1AA]">
                  <Users className="w-4 h-4 text-[#FF6B00]" />
                  <span>Up to {room.maxGuests} Guests</span>
                </div>

                {/* Amenities Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {room.amenities.map((am) => (
                    <span
                      key={am}
                      className="text-[10px] px-2 py-0.5 rounded bg-[#1C1C24] text-[#A1A1AA] border border-[#2A2A35]"
                    >
                      {am}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#2A2A35] flex items-center justify-between gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  fullWidth
                  onClick={() => setSelectedRoomDetails(room)}
                >
                  View Details
                </Button>
                {canManage && (
                  <Button
                    size="sm"
                    variant="secondary"
                    fullWidth
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
            <div className="p-4 rounded-xl bg-[#1C1C24] border border-[#2A2A35] flex items-center justify-between">
              <div>
                <span className="text-xs text-[#A1A1AA] block">Standard Tariff</span>
                <span className="text-xl font-bold text-[#FF6B00]">
                  {formatINR(selectedRoomDetails.ratePerNight)}
                </span>
                <span className="text-[11px] text-[#A1A1AA] block">per night</span>
              </div>
              <StatusBadge status={selectedRoomDetails.status} />
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase text-[#A1A1AA] mb-2">
                Included Amenities
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {selectedRoomDetails.amenities.map((am) => (
                  <div key={am} className="flex items-center gap-2 text-[#F5F5F7]">
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
