import React, { useState } from 'react';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { toast } from '@/store/useToastStore';
import { Boxes, AlertTriangle, PlusCircle, CheckCircle2 } from 'lucide-react';

interface StockItem {
  id: string;
  itemCode: string;
  name: string;
  category: 'Linen' | 'Toiletries' | 'F&B Supplies' | 'Spa' | 'Maintenance';
  quantity: number;
  unit: string;
  minThreshold: number;
  location: string;
}

export const InventoryPage: React.FC = () => {
  const [stock, setStock] = useState<StockItem[]>([
    {
      id: 'stk-1',
      itemCode: 'LIN-01',
      name: 'Egyptian Cotton King Bed Sheets (400 TC)',
      category: 'Linen',
      quantity: 42,
      unit: 'Pairs',
      minThreshold: 50,
      location: 'Central Linen Room',
    },
    {
      id: 'stk-2',
      itemCode: 'TOI-05',
      name: 'Forest Essentials Sandalwood Bath Kit (50ml)',
      category: 'Toiletries',
      quantity: 120,
      unit: 'Sets',
      minThreshold: 60,
      location: 'Housekeeping Hub',
    },
    {
      id: 'stk-3',
      itemCode: 'FNB-18',
      name: 'Organic Goan Cashew Nuts (Grade W-240)',
      category: 'F&B Supplies',
      quantity: 15,
      unit: 'Kg',
      minThreshold: 25,
      location: 'Kitchen Dry Store',
    },
    {
      id: 'stk-4',
      itemCode: 'SPA-03',
      name: 'Ayurvedic Sesame & Brahmi Massage Oil',
      category: 'Spa',
      quantity: 18,
      unit: 'Litres',
      minThreshold: 20,
      location: 'Spa Dispensary',
    },
    {
      id: 'stk-5',
      itemCode: 'MNT-12',
      name: 'LED Warm White Ambient Bulbs (9W)',
      category: 'Maintenance',
      quantity: 65,
      unit: 'Units',
      minThreshold: 30,
      location: 'Engineering Workshop',
    },
  ]);

  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [purchaseItemName, setPurchaseItemName] = useState('');
  const [purchaseQuantity, setPurchaseQuantity] = useState(50);
  const [purchaseCategory, setPurchaseCategory] = useState('Linen');

  const handleCreatePurchaseRequest = () => {
    if (!purchaseItemName) return;
    toast.success(
      'Purchase Requisition Logged',
      `PO for ${purchaseQuantity}x ${purchaseItemName} submitted to General Manager for approval.`
    );
    setIsPurchaseModalOpen(false);
    setPurchaseItemName('');
  };

  const columns: Column<StockItem>[] = [
    {
      key: 'itemCode',
      header: 'Item SKU',
      accessor: (s) => <span className="font-bold text-[#C2410C]">{s.itemCode}</span>,
      sortable: true,
      sortValue: (s) => s.itemCode,
    },
    {
      key: 'name',
      header: 'Stock Description',
      accessor: (s) => (
        <div>
          <span className="font-semibold text-[#1F2937] block">{s.name}</span>
          <span className="text-[11px] text-[#6B7280]">{s.location}</span>
        </div>
      ),
      sortable: true,
      sortValue: (s) => s.name,
    },
    {
      key: 'category',
      header: 'Category',
      accessor: (s) => <span className="text-xs">{s.category}</span>,
      sortable: true,
      sortValue: (s) => s.category,
    },
    {
      key: 'quantity',
      header: 'Current Stock',
      accessor: (s) => {
        const isLow = s.quantity < s.minThreshold;
        return (
          <div className="flex items-center gap-2">
            <span
              className={`font-bold ${
                isLow ? 'text-[#EF4444]' : 'text-[#22C55E]'
              }`}
            >
              {s.quantity} {s.unit}
            </span>
            {isLow && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 font-medium border border-rose-200 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Low
              </span>
            )}
          </div>
        );
      },
      sortable: true,
      sortValue: (s) => s.quantity,
    },
    {
      key: 'minThreshold',
      header: 'Threshold Limit',
      accessor: (s) => (
        <span className="text-xs text-[#6B7280]">Min: {s.minThreshold} {s.unit}</span>
      ),
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-5 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#C2410C]">
            Resort Inventory & Store Procurement
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280]">
            Linen stock, organic toiletries, kitchen supplies, and purchase orders.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsPurchaseModalOpen(true)}
          leftIcon={<PlusCircle className="w-4 h-4" />}
        >
          New Purchase Request
        </Button>
      </div>

      <DataTable
        data={stock}
        columns={columns}
        keyExtractor={(s) => s.id}
        searchPlaceholder="Search items by SKU or description..."
        pageSize={6}
      />

      {/* Purchase Request Modal */}
      <Modal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        title="Create Material Purchase Request (PO)"
        description="Notify purchase manager and accountant for restocking"
        maxWidth="md"
        footer={
          <div className="flex justify-end gap-3 w-full">
            <Button variant="ghost" onClick={() => setIsPurchaseModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreatePurchaseRequest}>
              Submit Request
            </Button>
          </div>
        }
      >
        <div className="space-y-4 text-left">
          <Input
            label="Material / Item Name"
            placeholder="e.g. Organic Herbal Shampoo 500ml"
            value={purchaseItemName}
            onChange={(e) => setPurchaseItemName(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Store Department"
              value={purchaseCategory}
              onChange={(e) => setPurchaseCategory(e.target.value)}
              options={[
                { label: 'Linen & Housekeeping', value: 'Linen' },
                { label: 'Toiletries & Amenities', value: 'Toiletries' },
                { label: 'Kitchen & F&B Dry Store', value: 'F&B Supplies' },
                { label: 'Ayurvedic Spa Consumables', value: 'Spa' },
                { label: 'Engineering & Maintenance', value: 'Maintenance' },
              ]}
            />

            <Input
              label="Requisition Quantity"
              type="number"
              value={purchaseQuantity}
              onChange={(e) => setPurchaseQuantity(Number(e.target.value))}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
