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
  Check,
  Flame,
  ChevronRight,
} from 'lucide-react';
import { StatusType } from '@/types';
import { toast } from '@/store/useToastStore';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';
import { getRooms, setRoomStatus, RoomRecord } from '@/api/roomsApi';

export const HousekeepingDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentResort, role } = useAuthStore();
  const [rooms, setRooms] = useState<RoomRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'All' | 'Cleaning' | 'Available' | 'Occupied' | 'Maintenance'>('All');
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
    toast.success(`Room status updated`, `Marked as ${newStatus}`);
  };

  const filteredRooms = rooms.filter((r) => {
    if (activeTab !== 'All' && r.status !== activeTab) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        r.roomNumber.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const availableCount = rooms.filter((r) => r.status === 'Available').length;
  const occupiedCount = rooms.filter((r) => r.status === 'Occupied').length;
  const cleaningCount = rooms.filter((r) => r.status === 'Cleaning').length;
  const maintenanceCount = rooms.filter((r) => r.status === 'Maintenance').length;
  const totalCount = rooms.length || 32;
  const cleanPercentage = Math.round((availableCount / totalCount) * 100);

  return (
    <div className="space-y-4 text-[#111827] w-full pb-8">
      {/* 1. Panoramic Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-2xs bg-white">
        <div className="relative min-h-[180px] sm:min-h-[200px] h-auto w-full overflow-hidden flex flex-col justify-between p-4 sm:p-6">
          <img
            src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1920&q=80"
            alt="Joy Resorts Sanctuary"
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.98]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 sm:via-white/60 to-white/30 sm:to-transparent" />

          {/* Header Row */}
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-50 text-[#0F5132] uppercase tracking-wider border border-emerald-200/80 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0F5132] animate-pulse" />
                  Housekeeping Command Board
                </span>
                <span className="text-xs font-medium text-[#64748B]">5-Star Sanitization Standards</span>
              </div>
              <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A] mt-1.5">
                Villa Turnover & Linen Inspection
              </h1>
              <p className="text-xs sm:text-sm text-[#475569] font-medium mt-0.5 max-w-2xl">
                Real-time villa cleaning turnover, deep sanitization, and maintenance repairs
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
              <div className="flex items-center gap-2 px-3.5 py-1.5 bg-white border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#1E293B] shadow-2xs">
                <CalendarDays className="w-4 h-4 text-[#64748B]" />
                <span>Today: 08 Oct 2026</span>
              </div>
            </div>
          </div>

          {/* Turnover Progress Meter Bar */}
          <div className="relative z-10 mt-3 pt-3 border-t border-slate-200/60 max-w-md">
            <div className="flex items-center justify-between text-xs font-semibold text-[#1E293B] mb-1">
              <span>Turnover Completion Rate</span>
              <span className="text-[#0F5132] font-black">{cleanPercentage}% Ready</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full bg-[#0F5132] rounded-full transition-all duration-500"
                style={{ width: `${cleanPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* 4 Housekeeping KPI Cards */}
        <div className="p-3 sm:p-4 bg-white/95 backdrop-blur-md border-t border-[#E2E8F0]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
            {/* KPI 1 */}
            <div
              onClick={() => setActiveTab('Available')}
              className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-xs hover:border-[#0F5132]/50 transition-all cursor-pointer flex flex-col justify-between min-w-0"
            >
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#22C55E] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full shrink-0">
                  Ready
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B] leading-snug">
                  Clean & Ready
                </p>
                <div className="flex justify-between items-baseline text-lg sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5">
                  {availableCount}
                  <p className="text-[10px] sm:text-[11px] text-[#16A34A] font-semibold mt-0.5 truncate">
                    Inspected keys
                  </p>
                </div>
              </div>
            </div>

            {/* KPI 2 */}
            <div
              onClick={() => setActiveTab('Cleaning')}
              className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-xs hover:border-amber-400 transition-all cursor-pointer flex flex-col justify-between min-w-0"
            >
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#F97316] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full shrink-0">
                  In Progress
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B] leading-snug">
                  Needs Cleaning
                </p>
                <div className="flex justify-between items-baseline text-lg sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5">
                  {cleaningCount}
                  <p className="text-[10px] sm:text-[11px] text-[#D97706] mt-0.5 truncate">
                    Turnover active
                  </p>
                </div>
              </div>
            </div>

            {/* KPI 3 */}
            <div
              onClick={() => setActiveTab('Occupied')}
              className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-xs hover:border-sky-400 transition-all cursor-pointer flex flex-col justify-between min-w-0"
            >
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#38BDF8] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <BedDouble className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full shrink-0">
                  Stay-Over
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B] leading-snug">
                  Occupied Rooms
                </p>
                <div className="flex justify-between items-baseline text-lg sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5">
                  {occupiedCount}
                  <p className="text-[10px] sm:text-[11px] text-[#0284C7] mt-0.5 truncate">
                    DND / Stay-over
                  </p>
                </div>
              </div>
            </div>

            {/* KPI 4 */}
            <div
              onClick={() => setActiveTab('Maintenance')}
              className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-xs hover:border-rose-400 transition-all cursor-pointer flex flex-col justify-between min-w-0"
            >
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#EF4444] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <Wrench className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full shrink-0">
                  Repairs
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B] leading-snug">
                  Maintenance
                </p>
                <div className="flex justify-between items-baseline text-lg sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5">
                  {maintenanceCount}
                  <p className="text-[10px] sm:text-[11px] text-[#DC2626] mt-0.5 truncate">
                    Engineering queued
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Filter Tabs Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8F0] pb-2">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none py-1 max-w-full">
          {[
            { id: 'All', label: 'All Villas', count: rooms.length },
            { id: 'Cleaning', label: 'Needs Cleaning', count: cleaningCount },
            { id: 'Available', label: 'Clean & Ready', count: availableCount },
            { id: 'Occupied', label: 'Stay-Over', count: occupiedCount },
            { id: 'Maintenance', label: 'Maintenance', count: maintenanceCount },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  'relative flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap rounded-lg shrink-0',
                  isActive
                    ? 'text-[#0F5132] font-bold'
                    : 'text-[#64748B] hover:text-[#1E293B] hover:bg-[#F1F5F9]'
                )}
              >
                <span>{tab.label}</span>
                <span
                  className={cn(
                    'text-[11px] px-2 py-0.5 rounded-full font-semibold',
                    isActive
                      ? 'bg-[#DCFCE7] text-[#0F5132]'
                      : 'bg-[#F1F5F9] text-[#64748B]'
                  )}
                >
                  {tab.count}
                </span>

                {isActive && (
                  <div className="absolute -bottom-2.5 left-2 right-2 h-0.5 bg-[#0F5132] rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        <div className="relative self-end sm:self-auto w-full sm:w-64">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search villa # or category..."
            className="w-full h-9 pl-9 pr-3 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30 focus:border-[#0F5132] text-[#1E293B] placeholder-[#94A3B8]"
          />
        </div>
      </div>

      {/* 3. High-End Villa Cards Grid (Stayora Luxury Native App Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {filteredRooms.map((room) => (
          <div
            key={room.id}
            className="bg-white rounded-2xl border border-[#E2E8F0] p-3.5 sm:p-4 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:shadow-xs hover:border-[#0F5132]/30 transition-all space-y-3 text-left"
          >
            {/* Top Row: Room number left, Status badge right */}
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs font-bold bg-slate-100 text-[#0F172A] px-2.5 py-0.5 rounded-md border border-slate-200">
                Villa #{room.roomNumber}
              </span>
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border shrink-0',
                  room.status === 'Available' && 'bg-emerald-50 text-emerald-700 border-emerald-200',
                  room.status === 'Cleaning' && 'bg-amber-50 text-amber-700 border-amber-200',
                  room.status === 'Occupied' && 'bg-sky-50 text-sky-700 border-sky-200',
                  room.status === 'Maintenance' && 'bg-rose-50 text-rose-700 border-rose-200'
                )}
              >
                <span
                  className={cn(
                    'w-1.5 h-1.5 rounded-full',
                    room.status === 'Available'
                      ? 'bg-emerald-500'
                      : room.status === 'Cleaning'
                      ? 'bg-amber-500'
                      : room.status === 'Occupied'
                      ? 'bg-sky-500'
                      : 'bg-rose-500'
                  )}
                />
                {room.status}
              </span>
            </div>

            {/* Villa Identity */}
            <div className="flex items-start gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0F5132] to-[#15803D] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
                <BedDouble className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-[#0F172A] text-sm truncate">{room.category}</h4>
                <p className="text-[11px] text-[#64748B] truncate">Floor {room.floor} • Lakefront Wing</p>
                <p className="text-[10px] text-emerald-700 font-semibold mt-0.5 truncate">
                  Linen sanitized & minibar stocked
                </p>
              </div>
            </div>

            {/* 3-Column Stayora Stat Box */}
            <div className="grid grid-cols-3 gap-2 p-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-center text-xs">
              <div className="min-w-0">
                <span className="text-[10px] text-[#64748B] block font-medium">Floor</span>
                <span className="font-bold text-[#0F172A] truncate block">Level {room.floor}</span>
              </div>
              <div className="border-x border-[#E2E8F0] min-w-0">
                <span className="text-[10px] text-[#64748B] block font-medium">Linens</span>
                <span className="font-bold text-[#0F5132] truncate block">100% Fresh</span>
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-[#64748B] block font-medium">Turnover</span>
                <span className="font-bold text-[#0F172A] truncate block">20 mins</span>
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="pt-2 border-t border-[#E2E8F0] flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleUpdateStatus(room.id, 'Available')}
                className="flex-1 py-2 px-2 bg-[#0F5132] hover:bg-[#0B3D25] text-white rounded-xl text-xs font-bold transition-all shadow-2xs active:scale-[0.98] flex items-center justify-center gap-1.5 min-w-0"
              >
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Mark Clean</span>
              </button>
              <button
                type="button"
                onClick={() => handleUpdateStatus(room.id, 'Cleaning')}
                className="flex-1 py-2 px-2 bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#475569] border border-[#CBD5E1] rounded-xl text-xs font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 min-w-0"
              >
                <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Turnover</span>
              </button>
              <button
                type="button"
                onClick={() => handleUpdateStatus(room.id, 'Maintenance')}
                title="Flag for Maintenance"
                className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl transition-all active:scale-[0.98] shrink-0"
              >
                <Wrench className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
