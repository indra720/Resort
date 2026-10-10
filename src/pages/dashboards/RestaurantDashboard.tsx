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
  items: OrderItem[];
  total: number;
  status: 'Pending' | 'Preparing' | 'Served';
}

const INITIAL_ORDERS: RestaurantOrder[] = [
  {
    id: 'KOT-101',
    table: 'Lake Deck Table #4',
    items: [{ name: 'Grilled Lake Trout', qty: 2 }, { name: 'Farm Harvest Salad', qty: 1 }],
    total: 3200,
    status: 'Preparing',
  },
  {
    id: 'KOT-102',
    table: 'Room Service #102',
    items: [{ name: 'Wild Mushroom Risotto', qty: 1 }, { name: 'Fresh Lime Soda', qty: 2 }],
    total: 1850,
    status: 'Pending',
  },
  {
    id: 'KOT-103',
    table: 'Gazebo Lounge #1',
    items: [{ name: 'Artisanal Cheese Platter', qty: 1 }, { name: 'Pinot Noir Bottle', qty: 1 }],
    total: 6500,
    status: 'Served',
  },
];

export const RestaurantDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<RestaurantOrder[]>(INITIAL_ORDERS);

  const handleUpdateStatus = (id: string, newStatus: 'Pending' | 'Preparing' | 'Served') => {
    setOrders((prev: RestaurantOrder[]) =>
      prev.map((o: RestaurantOrder) => (o.id === id ? { ...o, status: newStatus } : o))
    );
    toast.success(`Order updated to ${newStatus}`);
  };

  return (
    <div className="space-y-4 text-[#111827]">
      {/* 1. Panoramic Hero Banner */}
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
                  Dining & F&B
                </span>
                <span className="text-xs text-[#64748B]">Lakefront Culinary Hub</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A] mt-1">
                Fine Dining & Room Service
              </h1>
              <p className="text-xs sm:text-sm text-[#475569] font-medium mt-0.5">
                Kitchen order tickets (KOT), active dining tables, and gourmet catering
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <div className="flex items-center gap-2 px-3.5 py-1.5 bg-white border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#1E293B] shadow-2xs">
                <CalendarDays className="w-4 h-4 text-[#64748B]" />
                <span>Today: 08 Oct 2026</span>
              </div>
              <button
                type="button"
                onClick={() => navigate('/restaurant')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0F5132] hover:bg-[#0B3D25] text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>New KOT Order</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 Metric Cards (Responsive spreading cards with top icon layout) */}
        <div className="p-3 sm:p-4 bg-white/95 backdrop-blur-md border-t border-[#E2E8F0]">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
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
                <div className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5 whitespace-nowrap">
                  ₹1,84,500
                </div>
                <p className="text-[10px] sm:text-[11px] text-[#16A34A] font-semibold mt-0.5 whitespace-nowrap">vs yesterday</p>
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#38BDF8] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <UtensilsCrossed className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full shrink-0">
                  72% Seats
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B] leading-snug">Active Tables</p>
                <div className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5 whitespace-nowrap">
                  16 / 22
                </div>
                <p className="text-[10px] sm:text-[11px] text-[#0284C7] mt-0.5 whitespace-nowrap">Dining capacity</p>
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#F97316] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full shrink-0">
                  Avg 18m
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B] leading-snug">Kitchen Orders</p>
                <div className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5 whitespace-nowrap">
                  7 Pending
                </div>
                <p className="text-[10px] sm:text-[11px] text-[#D97706] mt-0.5 whitespace-nowrap">Live prep queue</p>
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
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
                <div className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5 whitespace-nowrap">
                  48 Orders
                </div>
                <p className="text-[10px] sm:text-[11px] text-[#7C3AED] mt-0.5 whitespace-nowrap">Room & lakeside</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <h3 className="text-base font-bold text-[#0F172A]">Live Dining & Room Service Orders</h3>
        </div>

        {/* Mobile / Tablet Horizontal Scroll Notice */}
        <div className="lg:hidden flex items-center justify-between px-4 py-2 bg-[#F8FAFC] border-b border-[#E2E8F0] text-xs text-[#64748B]">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="inline-block w-2 h-2 rounded-full bg-[#0F5132] animate-pulse" />
            Scroll table horizontally to view order items & actions
          </span>
          <span className="text-[10px] font-semibold text-[#0F5132] bg-white px-2 py-0.5 rounded border border-[#E2E8F0] whitespace-nowrap">
            ↔ Swipe to explore
          </span>
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[780px] text-left text-xs text-[#1E293B] border-collapse">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-semibold whitespace-nowrap">
              <tr>
                <th className="py-3 px-3 min-w-[100px]">Order ID</th>
                <th className="py-3 px-3 min-w-[120px]">Destination</th>
                <th className="py-3 px-3 min-w-[240px]">Items</th>
                <th className="py-3 px-3 min-w-[110px]">Amount</th>
                <th className="py-3 px-3 min-w-[110px]">Status</th>
                <th className="py-3 px-3 text-right min-w-[110px]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-[#F8FAFC] whitespace-nowrap">
                  <td className="py-3 px-3 font-bold text-[#0F5132] whitespace-nowrap">{o.id}</td>
                  <td className="py-3 px-3 font-medium text-[#0F172A] whitespace-nowrap">{o.table}</td>
                  <td className="py-3 px-3 text-[#64748B] min-w-[240px] whitespace-nowrap">{o.items.map((i) => `${i.name} (${i.qty})`).join(', ')}</td>
                  <td className="py-3 px-3 font-bold text-[#0F172A] whitespace-nowrap">{formatINR(o.total)}</td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded-full text-[11px] font-semibold border',
                        o.status === 'Served' && 'bg-emerald-50 text-emerald-700 border-emerald-200',
                        o.status === 'Preparing' && 'bg-amber-50 text-amber-700 border-amber-200',
                        o.status === 'Pending' && 'bg-sky-50 text-sky-700 border-sky-200'
                      )}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(o.id, 'Served')}
                      className="px-2.5 py-1 bg-[#0F5132] text-white hover:bg-[#0B3D25] rounded-lg text-xs font-medium transition-colors whitespace-nowrap"
                    >
                      Mark Served
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
