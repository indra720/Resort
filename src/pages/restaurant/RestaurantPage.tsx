import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { formatINR } from '@/lib/formatINR';
import { toast } from '@/store/useToastStore';
import {
  Utensils,
  PlusCircle,
  Flame,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  Coffee,
  Beer,
  Sparkles,
} from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  category: 'Starters' | 'Main Course' | 'Beverages' | 'Desserts';
  price: number;
  description: string;
  isVeg: boolean;
}

interface RestaurantOrder {
  id: string;
  table: string;
  items: string;
  total: number;
  status: 'New' | 'Preparing' | 'Ready' | 'Served';
  time: string;
}

interface TableStatus {
  id: number;
  number: string;
  capacity: number;
  status: 'Vacant' | 'Occupied' | 'Reserved';
  currentKOT?: string;
}

export const RestaurantPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'tables'>('orders');

  // Menu items state with realistic Goan and Indian resort cuisine in ₹
  const [menuItems] = useState<MenuItem[]>([
    {
      id: 'm-1',
      name: 'Paneer Tikka Angara',
      category: 'Starters',
      price: 450,
      description: 'Cottage cheese marinated in clay-oven spices with mint chutney',
      isVeg: true,
    },
    {
      id: 'm-2',
      name: 'Butter Garlic Tiger Prawns',
      category: 'Starters',
      price: 850,
      description: 'Catch of the day prawns tossed in Goa farm butter and garlic flakes',
      isVeg: false,
    },
    {
      id: 'm-3',
      name: 'Authentic Goan Fish Curry',
      category: 'Main Course',
      price: 680,
      description: 'Kingfish simmered in coconut gravy with freshly ground Tirphal',
      isVeg: false,
    },
    {
      id: 'm-4',
      name: 'Dal Makhani Bukhara',
      category: 'Main Course',
      price: 420,
      description: 'Black lentils slow-cooked overnight with churned butter and cream',
      isVeg: true,
    },
    {
      id: 'm-5',
      name: 'Tender Coconut Kokum Cooler',
      category: 'Beverages',
      price: 220,
      description: 'Chilled coastal refresher with roasted cumin and mint',
      isVeg: true,
    },
    {
      id: 'm-6',
      name: 'Traditional Goan Bebinca',
      category: 'Desserts',
      price: 320,
      description: 'Multi-layered coconut milk pudding served warm with vanilla gelato',
      isVeg: true,
    },
  ]);

  // Orders Kanban state
  const [orders, setOrders] = useState<RestaurantOrder[]>([
    {
      id: 'KOT-201',
      table: 'Table 4',
      items: '2x Paneer Tikka, 1x Dal Makhani, 4x Butter Naan',
      total: 1450,
      status: 'New',
      time: '4m ago',
    },
    {
      id: 'KOT-202',
      table: 'Pool Villa V-01',
      items: '1x Butter Garlic Prawns, 2x Kokum Cooler',
      total: 1290,
      status: 'Preparing',
      time: '12m ago',
    },
    {
      id: 'KOT-203',
      table: 'Table 7 (Lawn)',
      items: '2x Goan Fish Curry, 2x Steamed Rice',
      total: 1600,
      status: 'Ready',
      time: '18m ago',
    },
    {
      id: 'KOT-204',
      table: 'Table 2',
      items: '2x Bebinca with Gelato',
      total: 640,
      status: 'Served',
      time: '28m ago',
    },
  ]);

  // Tables state (12 tables)
  const [tables, setTables] = useState<TableStatus[]>([
    { id: 1, number: 'T-01', capacity: 2, status: 'Vacant' },
    { id: 2, number: 'T-02', capacity: 4, status: 'Occupied', currentKOT: 'KOT-204' },
    { id: 3, number: 'T-03', capacity: 4, status: 'Vacant' },
    { id: 4, number: 'T-04', capacity: 6, status: 'Occupied', currentKOT: 'KOT-201' },
    { id: 5, number: 'T-05', capacity: 2, status: 'Reserved' },
    { id: 6, number: 'T-06', capacity: 8, status: 'Vacant' },
    { id: 7, number: 'T-07', capacity: 2, status: 'Occupied', currentKOT: 'KOT-203' },
    { id: 8, number: 'T-08', capacity: 4, status: 'Vacant' },
    { id: 9, number: 'T-09', capacity: 4, status: 'Reserved' },
    { id: 10, number: 'T-10', capacity: 6, status: 'Vacant' },
    { id: 11, number: 'T-11', capacity: 4, status: 'Vacant' },
    { id: 12, number: 'T-12', capacity: 10, status: 'Vacant' },
  ]);

  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState('T-01');
  const [orderItemsText, setOrderItemsText] = useState('1x Paneer Tikka, 2x Kokum Cooler');
  const [orderAmount, setOrderAmount] = useState(890);

  const moveOrder = (
    orderId: string,
    target: 'New' | 'Preparing' | 'Ready' | 'Served'
  ) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: target } : o))
    );
    toast.success('KOT Updated', `Order ${orderId} moved to ${target}`);
  };

  const handleCreateOrder = () => {
    const newOrd: RestaurantOrder = {
      id: `KOT-${Math.floor(210 + Math.random() * 800)}`,
      table: selectedTable,
      items: orderItemsText,
      total: orderAmount,
      status: 'New',
      time: 'Just now',
    };
    setOrders((prev) => [newOrd, ...prev]);
    toast.success('KOT Dispatched', `New order sent to Kitchen for ${selectedTable}`);
    setIsNewOrderModalOpen(false);
  };

  const orderStatuses: ('New' | 'Preparing' | 'Ready' | 'Served')[] = [
    'New',
    'Preparing',
    'Ready',
    'Served',
  ];

  return (
    <div className="space-y-4 sm:space-y-5 text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F5132]">
            Spice & Palm Culinary & Restaurant
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280]">
            Kitchen display system (KDS), menu catalog in ₹, and dining table management.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsNewOrderModalOpen(true)}
          leftIcon={<PlusCircle className="w-4 h-4" />}
        >
          New KOT Order
        </Button>
      </div>

      {/* Tabs */}
      <div className="w-[300px] min-w-0 md:w-full overflow-x-auto flex border-b border-[#E5E7EB] gap-4">
        <button
          onClick={() => setActiveTab('orders')}
          className={`shrink-0 whitespace-nowrap  flex items-center gap-2 pb-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'orders'
              ? 'border-[#0F5132] text-[#0F5132]'
              : 'border-transparent text-[#6B7280] hover:text-[#1F2937]'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>Orders Kanban ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('menu')}
          className={`shrink-0 whitespace-nowrap flex items-center gap-2 pb-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'menu'
              ? 'border-[#0F5132] text-[#0F5132]'
              : 'border-transparent text-[#6B7280] hover:text-[#1F2937]'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>Resort Dining Menu ({menuItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('tables')}
          className={`shrink-0 whitespace-nowrap flex items-center gap-2 pb-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'tables'
              ? 'border-[#0F5132] text-[#0F5132]'
              : 'border-transparent text-[#6B7280] hover:text-[#1F2937]'
          }`}
        >
          <Coffee className="w-4 h-4" />
          <span>Table Floorplan ({tables.length})</span>
        </button>
      </div>

      {/* 1. ORDERS KANBAN (Horizontal scroll on mobile, 'Move to' buttons) */}
      {activeTab === 'orders' && (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-[1000px] lg:min-w-0 lg:grid lg:grid-cols-4">
            {orderStatuses.map((st) => {
              const columnOrders = orders.filter((o) => o.status === st);
              const headerColors: Record<string, string> = {
                New: 'bg-[#3B82F6]',
                Preparing: 'bg-[#0F5132]',
                Ready: 'bg-[#F59E0B]',
                Served: 'bg-[#22C55E]',
              };

              return (
                <div
                  key={st}
                  className="flex-1 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm p-3.5 flex flex-col space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB]">
                    <div className="flex flex-col lg:flex-row items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${headerColors[st]}`} />
                      <h3 className="text-sm font-bold text-[#1F2937]">{st}</h3>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#F8FAFC] text-[#6B7280] font-bold">
                      {columnOrders.length}
                    </span>
                  </div>

                  <div className="space-y-3 flex-1">
                    {columnOrders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] space-y-2 text-left"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-bold text-sm text-[#1F2937]">{ord.id}</span>
                            <p className="text-xs text-[#0F5132] font-semibold">{ord.table}</p>
                          </div>
                          <span className="text-[10px] text-[#6B7280]">{ord.time}</span>
                        </div>

                        <p className="text-xs text-[#1F2937] bg-white p-2.5 rounded-lg border border-[#E5E7EB]">
                          {ord.items}
                        </p>

                        <div className="flex items-center justify-between text-xs pt-1 border-t border-[#E5E7EB]">
                          <span className="font-bold text-[#1F2937]">{formatINR(ord.total)}</span>

                          {/* "Move to" Buttons */}
                          <div className="flex items-center gap-1">
                            {st === 'New' && (
                              <Button
                                size="sm"
                                variant="primary"
                                onClick={() => moveOrder(ord.id, 'Preparing')}
                              >
                                Cook
                              </Button>
                            )}
                            {st === 'Preparing' && (
                              <Button
                                size="sm"
                                variant="primary"
                                onClick={() => moveOrder(ord.id, 'Ready')}
                              >
                                Ready
                              </Button>
                            )}
                            {st === 'Ready' && (
                              <Button
                                size="sm"
                                variant="success"
                                onClick={() => moveOrder(ord.id, 'Served')}
                              >
                                Serve
                              </Button>
                            )}
                            {st === 'Served' && (
                              <span className="text-[11px] text-[#22C55E] font-medium">
                                Completed
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. MENU CATALOG VIEW */}
      {activeTab === 'menu' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#F8FAFC] text-[#6B7280] border border-[#E5E7EB]">
                    {item.category}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      item.isVeg
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {item.isVeg ? '🟢 VEG' : '🔴 NON-VEG'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#1F2937] pt-1">{item.name}</h3>
                <p className="text-xs text-[#6B7280] leading-relaxed">{item.description}</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#E5E7EB]">
                <span className="text-base font-bold text-[#0F5132]">
                  {formatINR(item.price)}
                </span>
                <span className="text-[11px] text-[#6B7280]">+ 5% GST</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. TABLE FLOORPLAN VIEW */}
      {activeTab === 'tables' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {tables.map((tbl) => {
            const statusColors: Record<string, string> = {
              Vacant: 'border-emerald-200 text-emerald-700 bg-emerald-50/50',
              Occupied: 'border-[#BBF7D0] text-[#0F5132] bg-[#F0FDF4]',
              Reserved: 'border-blue-200 text-blue-700 bg-blue-50/50',
            };

            return (
              <div
                key={tbl.id}
                className={`p-4 rounded-2xl bg-white border ${statusColors[tbl.status]} shadow-sm space-y-2 text-center`}
              >
                <div className="w-10 h-10 rounded-full bg-[#F8FAFC] border border-[#E5E7EB] mx-auto flex items-center justify-center font-bold text-sm text-[#1F2937]">
                  {tbl.number}
                </div>
                <span className="font-bold text-sm block text-[#1F2937]">
                  Seats {tbl.capacity}
                </span>
                <span className="text-xs font-semibold block">{tbl.status}</span>
                {tbl.currentKOT && (
                  <span className="text-[10px] text-[#6B7280] block">{tbl.currentKOT}</span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* New KOT Modal */}
      <Modal
        isOpen={isNewOrderModalOpen}
        onClose={() => setIsNewOrderModalOpen(false)}
        title="Generate Kitchen Order Ticket (KOT)"
        description="Dispatch order to master chef kitchen display"
        maxWidth="md"
        footer={
          <div className="flex justify-end gap-3 w-full">
            <Button variant="ghost" onClick={() => setIsNewOrderModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateOrder}>
              Print & Send to Kitchen
            </Button>
          </div>
        }
      >
        <div className="space-y-4 text-left">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Dining Location / Table"
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
              options={[
                { label: 'Table T-01 (Poolside)', value: 'T-01' },
                { label: 'Table T-04 (Indoor)', value: 'T-04' },
                { label: 'Table T-07 (Lawn)', value: 'T-07' },
                { label: 'In-Room: Villa V-01', value: 'Villa V-01' },
                { label: 'In-Room: Cottage 102', value: 'Cottage 102' },
              ]}
            />
            <Input
              label="Order Amount (₹)"
              type="number"
              value={orderAmount}
              onChange={(e) => setOrderAmount(Number(e.target.value))}
            />
          </div>

          <Input
            label="Dishes & Quantities"
            value={orderItemsText}
            onChange={(e) => setOrderItemsText(e.target.value)}
            helperText="Include special cooking instructions (e.g. less spicy)"
          />
        </div>
      </Modal>
    </div>
  );
};
