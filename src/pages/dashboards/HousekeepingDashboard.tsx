import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KPICard } from '@/components/ui/KPICard';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ActivityFeed } from '@/components/ui/ActivityFeed';
import { toast } from '@/store/useToastStore';
import { MOCK_ROOMS } from '@/data/mockData';
import { HOUSEKEEPING_ACTIVITIES } from '@/data/dashboardMockData';
import { StatusType } from '@/types';
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Wrench,
  RotateCcw,
} from 'lucide-react';

export const HousekeepingDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState(MOCK_ROOMS);

  const handleUpdateStatus = (id: string, newStatus: StatusType) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    toast.success('Room Status Updated', `Room marked as ${newStatus}`);
  };

  const dirtyCount = rooms.filter((r) => r.status === 'Cleaning').length;
  const maintenanceCount = rooms.filter((r) => r.status === 'Maintenance').length;
  const cleanCount = rooms.filter((r) => r.status === 'Available').length;
  const occupiedCount = rooms.filter((r) => r.status === 'Occupied').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F5F5F7]">
            Housekeeping Management Board
          </h1>
          <p className="text-xs sm:text-sm text-[#A1A1AA]">
            Room turnovers, linen changes, sanitation audit, and maintenance tickets.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate('/housekeeping')}
            leftIcon={<RotateCcw className="w-4 h-4 text-[#FF6B00]" />}
          >
            Kanban Task View
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Turnover In Progress"
          value={`${dirtyCount} Rooms`}
          subtitle="Priority for 2:00 PM Check-Ins"
          trend="down"
          change="Urgent"
          icon={Clock}
          badge="In Progress"
        />
        <KPICard
          title="Sanitized & Ready"
          value={`${cleanCount} Ready`}
          subtitle="Passed Inspection"
          trend="up"
          change="+6 today"
          icon={CheckCircle2}
        />
        <KPICard
          title="Occupied by Guests"
          value={`${occupiedCount} Rooms`}
          subtitle="Do-Not-Disturb monitored"
          icon={Sparkles}
        />
        <KPICard
          title="Maintenance Tickets"
          value={`${maintenanceCount} Open`}
          subtitle="Plumbing / Electrical"
          trend="down"
          change="Action required"
          icon={Wrench}
        />
      </div>

      {/* Quick Action Room Turnover Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-base font-semibold text-[#F5F5F7]">
            Direct Room Turnover Quick-Board
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="p-4 rounded-xl bg-[#14141A] border border-[#2A2A35] space-y-3 text-left hover:border-[#2A2A35]/80 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-base font-bold text-[#F5F5F7]">
                      Room #{room.roomNumber}
                    </span>
                    <p className="text-xs text-[#A1A1AA]">{room.category} • Floor {room.floor}</p>
                  </div>
                  <StatusBadge status={room.status} size="sm" />
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {room.amenities.slice(0, 2).map((a) => (
                    <span
                      key={a}
                      className="text-[10px] px-2 py-0.5 rounded bg-[#1C1C24] text-[#A1A1AA] border border-[#2A2A35]"
                    >
                      {a}
                    </span>
                  ))}
                </div>

                {/* Instant Action Button per Room */}
                <div className="pt-2 border-t border-[#2A2A35]/60 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-[#A1A1AA]">Change Status:</span>
                  <div className="flex items-center gap-1.5">
                    {room.status !== 'Cleaning' && (
                      <button
                        onClick={() => handleUpdateStatus(room.id, 'Cleaning')}
                        className="px-2.5 py-1 text-xs rounded bg-[#F59E0B]/10 hover:bg-[#F59E0B] text-[#F59E0B] hover:text-black font-medium transition-colors"
                      >
                        Cleaning
                      </button>
                    )}
                    {room.status !== 'Available' && (
                      <button
                        onClick={() => handleUpdateStatus(room.id, 'Available')}
                        className="px-2.5 py-1 text-xs rounded bg-[#22C55E]/10 hover:bg-[#22C55E] text-[#22C55E] hover:text-white font-medium transition-colors"
                      >
                        Mark Clean
                      </button>
                    )}
                    {room.status !== 'Maintenance' && (
                      <button
                        onClick={() => handleUpdateStatus(room.id, 'Maintenance')}
                        className="px-2.5 py-1 text-xs rounded bg-[#EF4444]/10 hover:bg-[#EF4444] text-[#EF4444] hover:text-white font-medium transition-colors"
                      >
                        Repair
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-time Housekeeping Log */}
        <div>
          <ActivityFeed
            title="Housekeeping Activity Log"
            activities={HOUSEKEEPING_ACTIVITIES}
          />
        </div>
      </div>
    </div>
  );
};
