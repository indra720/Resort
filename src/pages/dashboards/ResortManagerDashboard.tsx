import React from 'react';
import { useNavigate } from 'react-router-dom';
import { KPICard } from '@/components/ui/KPICard';
import { ChartCard } from '@/components/ui/ChartCard';
import { ActivityFeed } from '@/components/ui/ActivityFeed';
import { Button } from '@/components/ui/Button';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { MOCK_ROOMS } from '@/data/mockData';
import { Room } from '@/types';
import { WEEKLY_MOVEMENT_DATA, FRONT_DESK_ACTIVITIES } from '@/data/dashboardMockData';
import { formatINR } from '@/lib/formatINR';
import {
  Users,
  BedDouble,
  Sparkles,
  ArrowDownLeft,
  ArrowUpRight,
  ClipboardCheck,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export const ResortManagerDashboard: React.FC = () => {
  const navigate = useNavigate();

  const roomColumns: Column<Room>[] = [
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
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (r) => <StatusBadge status={r.status} size="sm" />,
    },
    {
      key: 'ratePerNight',
      header: 'Rate/Night',
      accessor: (r) => (
        <span className="font-semibold text-[#FF6B00]">{formatINR(r.ratePerNight)}</span>
      ),
      sortable: true,
      sortValue: (r) => r.ratePerNight,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F5F5F7]">
            Operations Command Center
          </h1>
          <p className="text-xs sm:text-sm text-[#A1A1AA]">
            Resort Manager daily briefing, property turnover, and guest logistics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate('/housekeeping')}
            leftIcon={<Sparkles className="w-4 h-4 text-[#F59E0B]" />}
          >
            Housekeeping Status
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/bookings')}
            leftIcon={<ClipboardCheck className="w-4 h-4" />}
          >
            Review Arrivals
          </Button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Today's Arrivals"
          value="18 Guests"
          subtitle="4 VIP Villas"
          trend="up"
          change="+3 vs yesterday"
          icon={ArrowDownLeft}
          badge="High Inflow"
        />
        <KPICard
          title="Scheduled Departures"
          value="12 Checkouts"
          subtitle="8 rooms marked dirty"
          trend="neutral"
          icon={ArrowUpRight}
        />
        <KPICard
          title="Active Occupancy"
          value="24 / 30"
          subtitle="80% Total Capacity"
          trend="up"
          change="+5 rooms"
          icon={BedDouble}
        />
        <KPICard
          title="Staff on Active Duty"
          value="42 Staff"
          subtitle="Across 5 Departments"
          icon={Users}
        />
      </div>

      {/* Bar Chart & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard
            title="Weekly Guest Movement (Arrivals vs Departures)"
            description="Peak check-in surges observed Friday & Saturday"
            height={280}
          >
            <BarChart
              data={WEEKLY_MOVEMENT_DATA}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <XAxis dataKey="day" stroke="#A1A1AA" fontSize={11} tickLine={false} />
              <YAxis stroke="#A1A1AA" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#14141A',
                  borderColor: '#2A2A35',
                  borderRadius: '8px',
                  color: '#F5F5F7',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="arrivals" name="Arrivals" fill="#FF6B00" radius={[4, 4, 0, 0]} />
              <Bar dataKey="departures" name="Departures" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartCard>
        </div>

        <div>
          <ActivityFeed
            title="Operational Alerts"
            activities={FRONT_DESK_ACTIVITIES}
          />
        </div>
      </div>

      {/* Room Inventory Overview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-[#F5F5F7]">Room Turnaround Monitor</h3>
          <Button variant="ghost" size="sm" onClick={() => navigate('/rooms')}>
            Open Full Grid
          </Button>
        </div>
        <DataTable
          data={MOCK_ROOMS}
          columns={roomColumns}
          keyExtractor={(r) => r.id}
          pageSize={4}
        />
      </div>
    </div>
  );
};
