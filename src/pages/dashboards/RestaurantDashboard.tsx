import React from 'react';
import { useNavigate } from 'react-router-dom';
import { KPICard } from '@/components/ui/KPICard';
import { ChartCard } from '@/components/ui/ChartCard';
import { Button } from '@/components/ui/Button';
import { ActivityFeed } from '@/components/ui/ActivityFeed';
import { RESTAURANT_SALES_DATA, RESTAURANT_ACTIVITIES } from '@/data/dashboardMockData';
import { formatINR } from '@/lib/formatINR';
import {
  Utensils,
  IndianRupee,
  Clock,
  CheckCircle2,
  PlusCircle,
  Flame,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export const RestaurantDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Active Kitchen Queue Orders
  const activeOrders = [
    {
      id: 'KOT-104',
      table: 'Table 4',
      items: '2x Paneer Tikka, 1x Dal Makhani, 4x Butter Naan',
      amount: 1450,
      time: '6m ago',
      status: 'Preparing',
    },
    {
      id: 'KOT-105',
      table: 'Pool Villa V-01 (In-Room)',
      items: '1x Tandoori Pomfret, 1x Steamed Rice, 2x Fresh Lime Soda',
      amount: 2200,
      time: '12m ago',
      status: 'Ready',
    },
    {
      id: 'KOT-106',
      table: 'Table 9 (Lawn)',
      items: '1x Goan Fish Curry, 2x Kokum Cooler',
      amount: 1180,
      time: '18m ago',
      status: 'Served',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#C2410C]">
            Spice & Palm Culinary & F&B Desk
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280]">
            Kitchen Order Tickets (KOT), Table reservations, and in-room dining billing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/restaurant')}
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            Create New KOT Order
          </Button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Today's F&B Sales"
          value={formatINR(329000)}
          subtitle="Across Restaurant & Pool Bar"
          trend="up"
          change="+14.2% vs yesterday"
          icon={IndianRupee}
          badge="Live"
        />
        <KPICard
          title="Active Kitchen KOTs"
          value="8 In Progress"
          subtitle="Average prep time: 14m"
          trend="up"
          icon={Flame}
        />
        <KPICard
          title="Table Occupancy"
          value="18 / 24 Tables"
          subtitle="75% Seating Capacity"
          icon={Utensils}
        />
        <KPICard
          title="Room Service In-Flight"
          value="5 Orders"
          subtitle="Cottages & Villas"
          icon={Clock}
        />
      </div>

      {/* Chart & Kitchen Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard
            title="Dining Revenue by Meal Period (₹)"
            description="Dinner and lunch contribute 70% of total daily revenue"
            height={280}
          >
            <BarChart
              data={RESTAURANT_SALES_DATA}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <XAxis dataKey="meal" stroke="#6B7280" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#6B7280"
                fontSize={11}
                tickFormatter={(v) => `₹${v / 1000}k`}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E5E7EB',
                  borderRadius: '8px',
                  color: '#1F2937',
                  fontSize: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                formatter={(val: number) => [formatINR(val), 'Sales']}
              />
              <Bar dataKey="sales" name="Sales Revenue" fill="#C2410C" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartCard>
        </div>

        <div>
          <ActivityFeed
            title="Dining Orders Activity"
            activities={RESTAURANT_ACTIVITIES}
          />
        </div>
      </div>

      {/* Live Kitchen Order Tickets Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-[#C2410C] flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#C2410C]" />
            <span>Active KOT Orders (Kitchen Display)</span>
          </h3>
          <Button variant="ghost" size="sm" onClick={() => navigate('/restaurant')}>
            Open Restaurant Hub
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activeOrders.map((ord) => (
            <div
              key={ord.id}
              className="p-4 rounded-xl bg-white border border-[#E5E7EB] shadow-sm space-y-3 text-left"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-sm text-[#1F2937]">{ord.id}</span>
                  <p className="text-xs text-[#C2410C] font-medium">{ord.table}</p>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FFF1E6] text-[#C2410C] font-semibold border border-[#FED7AA]">
                  {ord.status}
                </span>
              </div>

              <p className="text-xs text-[#1F2937] bg-[#FFF8F3] p-2.5 rounded-lg border border-[#E5E7EB]">
                {ord.items}
              </p>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-[#E5E7EB]">
                <span className="text-[#6B7280]">Order Value:</span>
                <span className="font-bold text-[#1F2937]">{formatINR(ord.amount)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
