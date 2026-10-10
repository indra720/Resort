import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Wrench,
  RotateCcw,
  BedDouble,
  ShieldCheck,
  CalendarDays,
  Search,
  Filter,
} from 'lucide-react';
import { MOCK_ROOMS } from '@/data/mockData';
import { StatusType } from '@/types';
import { toast } from '@/store/useToastStore';
import { cn } from '@/lib/utils';

import { useAuthStore } from '@/store/useAuthStore';
import { getRooms, setRoomStatus, RoomRecord } from '@/api/roomsApi';

export const HousekeepingDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentResort, role } = useAuthStore();
  const [rooms, setRooms] = useState<RoomRecord[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const loadRooms = () => {
    const isSuperAdmin = role === 'Super Admin';
    const list = getRooms(currentResort.id, isSuperAdmin);
    setRooms(list);
  };

  useEffect(() => {
    loadRooms();
  }, [currentResort.id, role]);

  const handleUpdateStatus = (id: string, newStatus: StatusType) => {
    setRoomStatus(id, newStatus);
    loadRooms();
    toast.success(`Room marked as ${newStatus}`);
  };

  const filteredRooms = rooms.filter((r) => {
    if (statusFilter !== 'All' && r.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return r.roomNumber.toLowerCase().includes(q) || r.category.toLowerCase().includes(q);
    }
    return true;
  });

  const availableCount = rooms.filter((r) => r.status === 'Available').length;
  const occupiedCount = rooms.filter((r) => r.status === 'Occupied').length;
  const cleaningCount = rooms.filter((r) => r.status === 'Cleaning').length;
  const maintenanceCount = rooms.filter((r) => r.status === 'Maintenance').length;

  return (
    <div className="space-y-4 text-[#111827]">
      {/* 1. Panoramic Hero Banner with 5 KPI Cards */}
      <div className="relative rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-2xs bg-white">
        <div className="relative h-44 sm:h-52 w-full overflow-hidden flex flex-col justify-between p-5 sm:p-6">
          <img
            src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1920&q=80"
            alt="Joy Resorts Sanctuary"
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.98]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/60 to-transparent" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#0F5132]/10 text-[#0F5132] uppercase tracking-wider">
                  Housekeeping
                </span>
                <span className="text-xs text-[#64748B]">Villa Sanitation Hub</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A] mt-1">
                Housekeeping Command Board
              </h1>
              <p className="text-xs sm:text-sm text-[#475569] font-medium mt-0.5">
                Real-time villa turnover, linen inspection, and sanitization standards
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <div className="flex items-center gap-2 px-3.5 py-1.5 bg-white border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#1E293B] shadow-2xs">
                <CalendarDays className="w-4 h-4 text-[#64748B]" />
                <span>Today: 08 Oct 2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Housekeeping KPI Cards (Responsive spreading cards with top icon layout) */}
        <div className="p-3 sm:p-4 bg-white/95 backdrop-blur-md border-t border-[#E2E8F0]">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#22C55E] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full shrink-0">
                  Ready
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B] leading-snug">Clean & Ready</p>
                <div className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5 whitespace-nowrap">
                  {availableCount}
                </div>
                <p className="text-[10px] sm:text-[11px] text-[#16A34A] font-semibold mt-0.5 whitespace-nowrap">Inspected keys</p>
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#F97316] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full shrink-0">
                  In Progress
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B] leading-snug">Needs Cleaning</p>
                <div className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5 whitespace-nowrap">
                  {cleaningCount}
                </div>
                <p className="text-[10px] sm:text-[11px] text-[#D97706] mt-0.5 whitespace-nowrap">Turnover active</p>
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#38BDF8] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <BedDouble className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full shrink-0">
                  DND Check
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B] leading-snug">Occupied Rooms</p>
                <div className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5 whitespace-nowrap">
                  {occupiedCount}
                </div>
                <p className="text-[10px] sm:text-[11px] text-[#0284C7] mt-0.5 whitespace-nowrap">Stay-over guests</p>
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#EF4444] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <Wrench className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full shrink-0">
                  Service
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B] leading-snug">Maintenance</p>
                <div className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5 whitespace-nowrap">
                  {maintenanceCount}
                </div>
                <p className="text-[10px] sm:text-[11px] text-[#DC2626] mt-0.5 whitespace-nowrap">Repair queued</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#E2E8F0] shadow-2xs">
        <div className="flex-1 min-w-[240px] max-w-md relative">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search villas by room number..."
            className="w-full h-9 pl-9 pr-3 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0F5132] text-[#1E293B]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 px-2.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[#475569] font-medium focus:outline-none focus:ring-1 focus:ring-[#0F5132]"
          >
            <option value="All">All Statuses</option>
            <option value="Available">Available (Clean)</option>
            <option value="Cleaning">Cleaning Required</option>
            <option value="Occupied">Occupied</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      {/* 3. Room Turnover Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRooms.map((room) => (
          <div
            key={room.id}
            className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-base font-bold text-[#0F172A]">Room #{room.roomNumber}</span>
                <p className="text-xs text-[#64748B]">{room.category} • Floor {room.floor}</p>
              </div>
              <span
                className={cn(
                  'px-2.5 py-0.5 rounded-full text-[11px] font-semibold border',
                  room.status === 'Available' && 'bg-emerald-50 text-emerald-700 border-emerald-200',
                  room.status === 'Cleaning' && 'bg-amber-50 text-amber-700 border-amber-200',
                  room.status === 'Occupied' && 'bg-sky-50 text-sky-700 border-sky-200',
                  room.status === 'Maintenance' && 'bg-rose-50 text-rose-700 border-rose-200'
                )}
              >
                {room.status}
              </span>
            </div>

            <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleUpdateStatus(room.id, 'Available')}
                className="px-2.5 py-1 bg-[#0F5132] text-white hover:bg-[#0B3D25] rounded-lg text-xs font-medium transition-colors"
              >
                Mark Clean
              </button>
              <button
                type="button"
                onClick={() => handleUpdateStatus(room.id, 'Cleaning')}
                className="px-2.5 py-1 bg-[#F8FAFC] text-[#475569] hover:bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg text-xs font-medium transition-colors"
              >
                Needs Cleaning
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
