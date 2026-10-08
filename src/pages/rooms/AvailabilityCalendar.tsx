import React from 'react';
import { MOCK_ROOMS } from '@/data/mockData';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { addDays, format } from 'date-fns';
import { ArrowLeftRight } from 'lucide-react';

export const AvailabilityCalendar: React.FC = () => {
  const today = new Date('2026-10-06');
  const days = Array.from({ length: 7 }, (_, i) => addDays(today, i));

  // Determine mock day status
  const getDayStatus = (roomIndex: number, dayIndex: number) => {
    if (roomIndex === 0 && dayIndex < 2) return 'Available';
    if (roomIndex === 0) return 'Reserved';
    if (roomIndex === 1 && dayIndex < 3) return 'Occupied';
    if (roomIndex === 1) return 'Available';
    if (roomIndex === 2 && dayIndex === 0) return 'Reserved';
    if (roomIndex === 2) return 'Occupied';
    if (roomIndex === 3 && dayIndex === 0) return 'Cleaning';
    if (roomIndex === 3) return 'Available';
    if (roomIndex === 5) return 'Maintenance';
    return dayIndex % 2 === 0 ? 'Occupied' : 'Available';
  };

  return (
    <div className="space-y-4 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h3 className="text-base font-semibold text-[#C2410C]">
          7-Day Occupancy Timeline Grid
        </h3>
        <p className="text-xs text-[#6B7280]">
          Live room availability and housekeeping occupancy status
        </p>
      </div>

      {/* Mobile Swipe Banner */}
      <div className="sm:hidden flex items-center justify-between px-3 py-1.5 rounded-lg bg-[#FFF8F3] border border-[#E5E7EB] text-[11px] text-[#6B7280]">
        <span className="flex items-center gap-1.5">
          <ArrowLeftRight className="w-3.5 h-3.5 text-[#C2410C] animate-pulse shrink-0" />
          <span>Swipe horizontally to view full 7-day schedule</span>
        </span>
        <span className="text-[10px] text-[#C2410C] font-medium bg-[#FFF1E6] px-1.5 py-0.5 rounded border border-[#FED7AA]">
          7 Days
        </span>
      </div>

      {/* Horizontally scrollable container */}
      <div className="overflow-x-auto rounded-xl border border-[#E5E7EB] bg-white shadow-sm pb-1">
        <table className="w-full text-xs text-left border-collapse min-w-[780px]">
          <thead className="bg-[#FFF8F3] text-[#1F2937] border-b border-[#E5E7EB]">
            <tr>
              <th className="py-3.5 px-4 font-semibold sticky left-0 bg-[#FFF8F3] z-10 w-44 shadow-sm whitespace-nowrap">
                Room & Category
              </th>
              {days.map((d, i) => (
                <th key={i} className="py-3 px-3 text-center min-w-[85px] whitespace-nowrap">
                  <span className="font-semibold text-[#1F2937] block">
                    {format(d, 'dd MMM')}
                  </span>
                  <span className="text-[10px] text-[#6B7280]">{format(d, 'EEE')}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {MOCK_ROOMS.map((room, rIdx) => (
              <tr key={room.id} className="hover:bg-[#FFF8F3] transition-colors">
                <td className="py-3.5 px-4 sticky left-0 bg-white z-10 border-r border-[#E5E7EB] whitespace-nowrap">
                  <span className="font-bold text-[#1F2937] block">#{room.roomNumber}</span>
                  <span className="text-[11px] text-[#6B7280] truncate block max-w-[140px]">
                    {room.category}
                  </span>
                </td>
                {days.map((_, dIdx) => {
                  const status = getDayStatus(rIdx, dIdx);
                  const colors: Record<string, string> = {
                    Available: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                    Occupied: 'bg-[#FFF1E6] text-[#C2410C] border-[#FED7AA]',
                    Reserved: 'bg-blue-50 text-blue-700 border-blue-200',
                    Cleaning: 'bg-amber-50 text-amber-700 border-amber-200',
                    Maintenance: 'bg-rose-50 text-rose-700 border-rose-200',
                  };
                  return (
                    <td key={dIdx} className="py-2 px-2 text-center">
                      <span
                        className={`inline-block w-full py-1.5 px-1 rounded-md text-[10px] font-semibold border ${colors[status]}`}
                      >
                        {status}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Calendar Status Legend */}
      <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-[#6B7280]">
        <span>Legend:</span>
        <StatusBadge status="Available" size="sm" />
        <StatusBadge status="Occupied" size="sm" />
        <StatusBadge status="Reserved" size="sm" />
        <StatusBadge status="Cleaning" size="sm" />
        <StatusBadge status="Maintenance" size="sm" />
      </div>
    </div>
  );
};
