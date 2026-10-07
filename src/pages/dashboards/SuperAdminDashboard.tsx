import React from 'react';
import { useNavigate } from 'react-router-dom';
import { KPICard } from '@/components/ui/KPICard';
import { ChartCard } from '@/components/ui/ChartCard';
import { ActivityFeed } from '@/components/ui/ActivityFeed';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { formatINR, formatCompactINR } from '@/lib/formatINR';
import { formatDate } from '@/lib/utils';
import { MOCK_BOOKINGS } from '@/data/mockData';
import { Booking } from '@/types';
import {
  MONTHLY_REVENUE_DATA,
  ROOM_OCCUPANCY_DATA,
  SUPER_ADMIN_ACTIVITIES,
} from '@/data/dashboardMockData';
import {
  IndianRupee,
  BedDouble,
  TrendingUp,
  Percent,
  PlusCircle,
  FileSpreadsheet,
  CalendarCheck,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export const SuperAdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Booking table columns
  const bookingColumns: Column<Booking>[] = [
    {
      key: 'bookingCode',
      header: 'Booking #',
      accessor: (b) => <span className="font-semibold text-[#FF8A3D]">{b.bookingCode}</span>,
      sortable: true,
      sortValue: (b) => b.bookingCode,
    },
    {
      key: 'guestName',
      header: 'Guest Name',
      accessor: (b) => <span className="font-medium text-[#F5F5F7]">{b.guestName}</span>,
      sortable: true,
      sortValue: (b) => b.guestName,
    },
    {
      key: 'roomNumber',
      header: 'Room',
      accessor: (b) => <span>Room #{b.roomNumber}</span>,
      sortable: true,
      sortValue: (b) => b.roomNumber,
    },
    {
      key: 'checkIn',
      header: 'Check-In',
      accessor: (b) => <span>{formatDate(b.checkIn)}</span>,
    },
    {
      key: 'totalAmount',
      header: 'Tariff + GST',
      accessor: (b) => (
        <span className="font-semibold text-[#F5F5F7]">{formatINR(b.totalAmount)}</span>
      ),
      sortable: true,
      sortValue: (b) => b.totalAmount,
    },
    {
      key: 'paymentStatus',
      header: 'Status',
      accessor: (b) => <StatusBadge status={b.paymentStatus} size="sm" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner / Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F5F5F7]">
            Super Admin Executive Command
          </h1>
          <p className="text-xs sm:text-sm text-[#A1A1AA]">
            Resort-wide operational intelligence, revenue analytics, and occupancy.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate('/reports')}
            leftIcon={<FileSpreadsheet className="w-4 h-4 text-[#FF8A3D]" />}
          >
            Export GSTR & PnL
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/rooms')}
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            Manage Villas
          </Button>
        </div>
      </div>

      {/* KPI Grid: 4-col desktop, 2-col tablet, 1-col mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Monthly Revenue"
          value={formatCompactINR(5600000)}
          subtitle="Oct 2026 Target Met"
          change="+18.4% MoM"
          trend="up"
          icon={IndianRupee}
          badge="Live"
        />

        <KPICard
          title="Resort Occupancy"
          value="82.4%"
          subtitle="24 of 30 Rooms Booked"
          change="+6.2% vs last week"
          trend="up"
          icon={Percent}
        />

        <KPICard
          title="ADR (Avg Daily Rate)"
          value={formatINR(9450)}
          subtitle="Per occupied room"
          change="+₹620 uptick"
          trend="up"
          icon={BedDouble}
        />

        <KPICard
          title="RevPAR (Yield)"
          value={formatINR(7786)}
          subtitle="Per available room"
          change="+12.1% YoY"
          trend="up"
          icon={TrendingUp}
        />
      </div>

      {/* Charts Row: Monthly Revenue Trend + Occupancy Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Line Chart (2-cols on desktop) */}
        <div className="lg:col-span-2">
          <ChartCard
            title="Revenue Trajectory (₹ Lakhs)"
            description="Room reservations vs Food & Beverage earnings"
            height={280}
          >
            <LineChart
              data={MONTHLY_REVENUE_DATA}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
            >
              <XAxis dataKey="month" stroke="#A1A1AA" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#A1A1AA"
                fontSize={11}
                tickFormatter={(val) => `₹${val / 100000}L`}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#14141A',
                  borderColor: '#2A2A35',
                  borderRadius: '8px',
                  color: '#F5F5F7',
                  fontSize: '12px',
                }}
                formatter={(value: number) => [formatINR(value), 'Revenue']}
              />
              <Legend
                wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                iconType="circle"
              />
              <Line
                type="monotone"
                dataKey="rooms"
                name="Rooms Revenue"
                stroke="#CC5500"
                strokeWidth={3}
                dot={{ r: 4, fill: '#CC5500' }}
              />
              <Line
                type="monotone"
                dataKey="fnb"
                name="F&B Dining"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ r: 3, fill: '#3B82F6' }}
              />
            </LineChart>
          </ChartCard>
        </div>

        {/* Occupancy Donut Chart */}
        <div>
          <ChartCard
            title="Inventory Allocation"
            description="Live status distribution across 30 keys"
            height={280}
          >
            <PieChart>
              <Pie
                data={ROOM_OCCUPANCY_DATA}
                cx="50%"
                cy="45%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {ROOM_OCCUPANCY_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#14141A',
                  borderColor: '#2A2A35',
                  borderRadius: '8px',
                  color: '#F5F5F7',
                  fontSize: '12px',
                }}
                formatter={(val: number) => [`${val} Units`, 'Quantity']}
              />
              <Legend
                verticalAlign="bottom"
                wrapperStyle={{ fontSize: '11px', paddingTop: '5px' }}
              />
            </PieChart>
          </ChartCard>
        </div>
      </div>

      {/* Tables and Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings (2-cols on desktop) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-[#F5F5F7] flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-[#FF8A3D]" />
              <span>Recent Guest Bookings</span>
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/bookings')}
            >
              View All Bookings
            </Button>
          </div>

          <DataTable
            data={MOCK_BOOKINGS}
            columns={bookingColumns}
            keyExtractor={(b) => b.id}
            searchPlaceholder="Filter guest bookings..."
            pageSize={4}
          />
        </div>

        {/* Real-time Activity Feed (1-col) */}
        <div>
          <ActivityFeed
            title="Management Audit Log"
            activities={SUPER_ADMIN_ACTIVITIES}
          />
        </div>
      </div>
    </div>
  );
};
