import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UtensilsCrossed,
  Clock,
  IndianRupee,
  CheckCircle2,
  CalendarDays,
  Plus,
  Search,
  Filter,
  Flame,
  ChefHat,
  Coffee,
  Wine,
  Bell,
  Printer,
  ChevronRight,
} from 'lucide-react';
import { formatINR } from '@/lib/formatINR';
import { toast } from '@/store/useToastStore';
import { cn } from '@/lib/utils';

interface OrderItem {
  name: string;
  qty: number;
}

interface RestaurantOrder {
  id: string;
  table: string;
  zone: 'Lake Deck' | 'Room Service' | 'Gazebo' | 'Indoor Bistro';
  items: OrderItem[];
  total: number;
  status: 'Pending' | 'Preparing' | 'Served';
  time: string;
  server: string;
}

const INITIAL_ORDERS: RestaurantOrder[] = [
  {
    id: 'KOT-101',
    table: 'Lake Deck Table #4',
    zone: 'Lake Deck',
    items: [
      { name: 'Grilled Lake Trout', qty: 2 },
      { name: 'Farm Harvest Salad', qty: 1 },
      { name: 'Garlic Butter Naan', qty: 3 },
    ],
    total: 3200,
    status: 'Preparing',
    time: '12:45 PM',
    server: 'Vikram (Captain)',
  },
  {
    id: 'KOT-102',
    table: 'Room Service Villa #102',
    zone: 'Room Service',
    items: [
      { name: 'Wild Mushroom Risotto', qty: 1 },
      { name: 'Fresh Lime Soda', qty: 2 },
    ],
    total: 1850,
    status: 'Pending',
    time: '12:52 PM',
    server: 'Rohit (Butler)',
  },
  {
    id: 'KOT-103',
    table: 'Gazebo Lounge #1',
    zone: 'Gazebo',
    items: [
      { name: 'Artisanal Cheese Platter', qty: 1 },
      { name: 'Pinot Noir Bottle', qty: 1 },
    ],
    total: 6500,
    status: 'Served',
    time: '12:20 PM',
    server: 'Meenakshi',
  },
  {
    id: 'KOT-104',
    table: 'Indoor Bistro Table #7',
    zone: 'Indoor Bistro',
    items: [
      { name: 'Paneer Tikka Angaar', qty: 2 },
      { name: 'Dal Joy Signature', qty: 1 },
      { name: 'Jeera Rice', qty: 2 },
    ],
    total: 2450,
    status: 'Preparing',
    time: '01:05 PM',
    server: 'Arjun',
  },
];

export const RestaurantDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<RestaurantOrder[]>(INITIAL_ORDERS);
  const [activeTab, setActiveTab] = useState<'all' | 'preparing' | 'pending' | 'served'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);

  // New order form state
  const [newTable, setNewTable] = useState('Lake Deck Table #1');
  const [newItems, setNewItems] = useState('2x Chicken Biryani, 1x Raita');
  const [newAmount, setNewAmount] = useState('1450');

  const handleUpdateStatus = (id: string, newStatus: 'Pending' | 'Preparing' | 'Served') => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
    toast.success(`Order ${id} marked as ${newStatus}`);
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const newKOT: RestaurantOrder = {
      id: `KOT-${Math.floor(100 + Math.random() * 900)}`,
      table: newTable,
      zone: newTable.includes('Villa') ? 'Room Service' : 'Lake Deck',
      items: [{ name: newItems, qty: 1 }],
      total: Number(newAmount) || 1200,
      status: 'Pending',
      time: 'Just now',
      server: 'Front Staff',
    };
    setOrders([newKOT, ...orders]);
    setIsNewOrderOpen(false);
    toast.success('KOT Generated', `${newKOT.id} sent to kitchen display!`);
  };

  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'preparing' && o.status !== 'Preparing') return false;
    if (activeTab === 'pending' && o.status !== 'Pending') return false;
    if (activeTab === 'served' && o.status !== 'Served') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        o.id.toLowerCase().includes(q) ||
        o.table.toLowerCase().includes(q) ||
        o.items.some((i) => i.name.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-4 text-[#111827] w-full pb-8">
      {/* 1. Panoramic Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-2xs bg-white">
        <div className="relative min-h-[180px] sm:min-h-[200px] h-auto w-full overflow-hidden flex flex-col justify-between p-4 sm:p-6">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=80"
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
                  Culinary & Kitchen Command
                </span>
                <span className="text-xs font-medium text-[#64748B]">Lakefront Bistro & In-Villa Dining</span>
              </div>
              <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A] mt-1.5">
                Fine Dining & Kitchen KOT Board
              </h1>
              <p className="text-xs sm:text-sm text-[#475569] font-medium mt-0.5 max-w-2xl">
                Kitchen order tickets (KOT), active dining tables, and gourmet catering
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
              <div className="flex items-center gap-2 px-3.5 py-1.5 bg-white border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#1E293B] shadow-2xs">
                <CalendarDays className="w-4 h-4 text-[#64748B]" />
                <span>Today: 08 Oct 2026</span>
              </div>
              <button
                type="button"
                onClick={() => setIsNewOrderOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0F5132] hover:bg-[#0B3D25] text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New KOT Order</span>
                <span className="sm:hidden">New KOT</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="p-3 sm:p-4 bg-white/95 backdrop-blur-md border-t border-[#E2E8F0]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
            {/* KPI 1: F&B Sales */}
            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between min-w-0">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#22C55E] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <IndianRupee className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full flex items-center shrink-0">
                  +14.2%
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B] leading-snug">Today's F&B Sales</p>
                <div className="flex justify-between items-baseline text-lg sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5">
                  ₹1,84,500
                  <p className="text-[10px] sm:text-[11px] text-[#16A34A] font-semibold mt-0.5 truncate">
                    vs yesterday
                  </p>
                </div>
              </div>
            </div>

            {/* KPI 2: Active Tables */}
            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between min-w-0">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#38BDF8] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <UtensilsCrossed className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full shrink-0">
                  72% Capacity
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B] leading-snug">Active Tables</p>
                <div className="flex justify-between items-baseline text-lg sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5">
                  16 / 22
                  <p className="text-[10px] sm:text-[11px] text-[#0284C7] mt-0.5 truncate">
                    Dining zones active
                  </p>
                </div>
              </div>
            </div>

            {/* KPI 3: Kitchen Orders */}
            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between min-w-0">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#F97316] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full shrink-0">
                  Avg 18m
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B] leading-snug">Kitchen Prep Queue</p>
                <div className="flex justify-between items-baseline text-lg sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5">
                  7 KOTs
                  <p className="text-[10px] sm:text-[11px] text-[#D97706] mt-0.5 truncate">
                    Live prep orders
                  </p>
                </div>
              </div>
            </div>

            {/* KPI 4: Delivered Today */}
            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between min-w-0">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#8B5CF6] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full shrink-0">
                  Completed
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B] leading-snug">Delivered Today</p>
                <div className="flex justify-between items-baseline text-lg sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5">
                  48 Orders
                  <p className="text-[10px] sm:text-[11px] text-[#7C3AED] mt-0.5 truncate">
                    Room & lake deck
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Dining Floor Zones Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
        <div className="p-3 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex items-center justify-between min-w-0">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#0F5132] flex items-center justify-center font-bold text-xs shrink-0">
              LD
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-[#0F172A] block truncate">Lake Deck</span>
              <span className="text-[10px] text-[#64748B] block truncate">8 / 10 Tables Active</span>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0 ml-1.5" />
        </div>

        <div className="p-3 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex items-center justify-between min-w-0">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold text-xs shrink-0">
              GZ
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-[#0F172A] block truncate">Gazebo Lawn</span>
              <span className="text-[10px] text-[#64748B] block truncate">3 / 4 Tables Active</span>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0 ml-1.5" />
        </div>

        <div className="p-3 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex items-center justify-between min-w-0">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs shrink-0">
              IB
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-[#0F172A] block truncate">Indoor Bistro</span>
              <span className="text-[10px] text-[#64748B] block truncate">5 / 8 Tables Active</span>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0 ml-1.5" />
        </div>

        <div className="p-3 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex items-center justify-between min-w-0">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0">
              RS
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-[#0F172A] block truncate">In-Villa Service</span>
              <span className="text-[10px] text-[#64748B] block truncate">4 Room Trays</span>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0 ml-1.5" />
        </div>
      </div>

      {/* 3. Filter Tabs Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8F0] pb-2">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none py-1 max-w-full">
          {[
            { id: 'all', label: 'All Orders', count: orders.length },
            { id: 'preparing', label: 'Kitchen Preparing', count: orders.filter((o) => o.status === 'Preparing').length },
            { id: 'pending', label: 'Pending KOTs', count: orders.filter((o) => o.status === 'Pending').length },
            { id: 'served', label: 'Delivered / Served', count: orders.filter((o) => o.status === 'Served').length },
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
            placeholder="Search KOT, table, or food item..."
            className="w-full h-9 pl-9 pr-3 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30 focus:border-[#0F5132] text-[#1E293B] placeholder-[#94A3B8]"
          />
        </div>
      </div>

      {/* 4. Live Orders Board */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
        <div className="p-3.5 sm:p-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-bold text-[#0F172A]">
            Live Dining & Room Service KOT Tickets
          </h3>
          <span className="text-xs text-[#0F5132] font-semibold">
            {filteredOrders.length} Tickets active
          </span>
        </div>

        {/* Mobile View: High-End Native App Card Layout (Stayora Luxury Native App Style) */}
        <div className="block lg:hidden p-2.5 sm:p-3.5 space-y-3 bg-[#F8FAFC]/50">
          {filteredOrders.map((o) => (
            <div
              key={o.id}
              className="p-3.5 rounded-2xl bg-white border border-[#E2E8F0] shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] space-y-3 text-left"
            >
              {/* Top Row: KOT ID left, Status badge right (Only 2 badges for 320px safety) */}
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] font-bold text-[#0F5132] bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200/60">
                  {o.id}
                </span>
                <span
                  className={cn(
                    'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border shrink-0',
                    o.status === 'Served' && 'bg-emerald-50 text-emerald-700 border-emerald-200',
                    o.status === 'Preparing' && 'bg-amber-50 text-amber-700 border-amber-200',
                    o.status === 'Pending' && 'bg-sky-50 text-sky-700 border-sky-200'
                  )}
                >
                  <span
                    className={cn(
                      'w-1.5 h-1.5 rounded-full',
                      o.status === 'Served'
                        ? 'bg-emerald-500'
                        : o.status === 'Preparing'
                        ? 'bg-amber-500'
                        : 'bg-sky-500'
                    )}
                  />
                  {o.status}
                </span>
              </div>

              {/* Table / Destination Identity */}
              <div className="flex items-start gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0F5132] to-[#15803D] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
                  <ChefHat className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-[#0F172A] text-sm truncate">{o.table}</h4>
                  <p className="text-[11px] text-[#64748B] truncate">
                    Zone: {o.zone} • Server: {o.server}
                  </p>
                  <p className="text-[10px] text-[#94A3B8] mt-0.5">Ordered at {o.time}</p>
                </div>
              </div>

              {/* Items List Box */}
              <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">
                  Kitchen Order Items:
                </span>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {o.items.map((i, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-[#1E293B]"
                    >
                      {i.qty}x {i.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Amount & Actions */}
              <div className="pt-0.5 flex items-center justify-between gap-2 border-t border-slate-100">
                <div>
                  <span className="text-[10px] text-[#64748B] block font-medium">Bill Amount</span>
                  <span className="text-sm font-black text-[#0F5132]">{formatINR(o.total)}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {o.status === 'Pending' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(o.id, 'Preparing')}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-2xs"
                    >
                      Start Prep
                    </button>
                  )}
                  {o.status === 'Preparing' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(o.id, 'Served')}
                      className="px-3 py-1.5 bg-[#0F5132] hover:bg-[#0B3D25] text-white rounded-xl text-xs font-bold transition-all shadow-2xs"
                    >
                      Mark Served
                    </button>
                  )}
                  {o.status === 'Served' && (
                    <span className="text-xs text-emerald-700 font-bold px-2 py-1 bg-emerald-50 rounded-lg">
                      Ready / Settled
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View: Full Table */}
        <div className="hidden lg:block overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[850px] text-left text-xs text-[#1E293B] border-collapse">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-semibold whitespace-nowrap">
              <tr>
                <th className="py-3.5 px-4 min-w-[110px]">Order ID</th>
                <th className="py-3.5 px-4 min-w-[180px]">Destination / Table</th>
                <th className="py-3.5 px-4 min-w-[280px]">Order Items</th>
                <th className="py-3.5 px-4 min-w-[110px]">Time</th>
                <th className="py-3.5 px-4 min-w-[120px]">Bill Total</th>
                <th className="py-3.5 px-4 min-w-[110px]">Status</th>
                <th className="py-3.5 px-4 text-right min-w-[140px]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filteredOrders.map((o) => (
                <tr key={o.id} className="hover:bg-[#F8FAFC] whitespace-nowrap">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#0F5132] whitespace-nowrap">{o.id}</td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-bold text-[#0F172A] block">{o.table}</span>
                    <span className="text-[11px] text-[#64748B]">{o.zone} • {o.server}</span>
                  </td>
                  <td className="py-3.5 px-4 text-[#475569]">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {o.items.map((i, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 text-[#0F172A] font-medium text-[11px]">
                          {i.qty}x {i.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-[#64748B] whitespace-nowrap">{o.time}</td>
                  <td className="py-3.5 px-4 font-bold text-[#0F172A] whitespace-nowrap">{formatINR(o.total)}</td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border',
                        o.status === 'Served' && 'bg-emerald-50 text-emerald-700 border-emerald-200',
                        o.status === 'Preparing' && 'bg-amber-50 text-amber-700 border-amber-200',
                        o.status === 'Pending' && 'bg-sky-50 text-sky-700 border-sky-200'
                      )}
                    >
                      <span
                        className={cn(
                          'w-1.5 h-1.5 rounded-full',
                          o.status === 'Served'
                            ? 'bg-emerald-500'
                            : o.status === 'Preparing'
                            ? 'bg-amber-500'
                            : 'bg-sky-500'
                        )}
                      />
                      {o.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    {o.status === 'Pending' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(o.id, 'Preparing')}
                        className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold transition-colors"
                      >
                        Start Prep
                      </button>
                    )}
                    {o.status === 'Preparing' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(o.id, 'Served')}
                        className="px-3 py-1 bg-[#0F5132] hover:bg-[#0B3D25] text-white rounded-lg text-xs font-semibold transition-colors"
                      >
                        Mark Served
                      </button>
                    )}
                    {o.status === 'Served' && (
                      <span className="text-xs text-[#64748B] italic">Completed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New KOT Order Modal */}
      {isNewOrderOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <h3 className="text-base font-bold text-[#0F172A]">Generate Kitchen KOT Order</h3>
              <button
                type="button"
                onClick={() => setIsNewOrderOpen(false)}
                className="text-[#64748B] hover:text-[#0F172A] text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-[#334155] block mb-1">Table / Villa Destination</label>
                <select
                  value={newTable}
                  onChange={(e) => setNewTable(e.target.value)}
                  className="w-full h-9 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0F5132]"
                >
                  <option value="Lake Deck Table #1">Lake Deck Table #1</option>
                  <option value="Lake Deck Table #2">Lake Deck Table #2</option>
                  <option value="Gazebo Lounge #1">Gazebo Lounge #1</option>
                  <option value="Indoor Bistro Table #3">Indoor Bistro Table #3</option>
                  <option value="Room Service Villa #101">Room Service Villa #101</option>
                  <option value="Room Service Villa #105">Room Service Villa #105</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-[#334155] block mb-1">Ordered Dishes & Items</label>
                <input
                  type="text"
                  required
                  value={newItems}
                  onChange={(e) => setNewItems(e.target.value)}
                  placeholder="e.g. 2x Grilled Lake Trout, 1x Naan"
                  className="w-full h-9 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0F5132]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#334155] block mb-1">Estimated Amount (₹)</label>
                <input
                  type="number"
                  required
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  placeholder="1200"
                  className="w-full h-9 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0F5132]"
                />
              </div>

              <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewOrderOpen(false)}
                  className="px-3.5 py-2 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl font-semibold text-[#475569]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0F5132] hover:bg-[#0B3D25] text-white rounded-xl font-semibold shadow-2xs"
                >
                  Send to Kitchen KOT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
