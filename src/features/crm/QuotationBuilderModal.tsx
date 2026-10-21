import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  FileText,
  DollarSign,
  AlertCircle,
  Sparkles,
  Calendar,
  Tag,
  Check,
} from 'lucide-react';
import { Quotation, QuotationItem, Lead, InterestedInType } from '@/types/crm';
import { useAuthStore } from '@/store/useAuthStore';
import { createQuotation, updateQuotation, calculateQuotationTotals } from '@/api/quotations';
import { validateCoupon, incrementCouponUsage } from '@/api/coupons';
import { formatINR } from '@/lib/formatINR';
import { toast } from '@/store/useToastStore';

export interface QuotationBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefillLead?: Lead | null;
  quotationToEdit?: Quotation | null;
  onSuccess: () => void;
}

export const QuotationBuilderModal: React.FC<QuotationBuilderModalProps> = ({
  isOpen,
  onClose,
  prefillLead,
  quotationToEdit,
  onSuccess,
}) => {
  const { currentResort, user } = useAuthStore();

  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [interestedIn, setInterestedIn] = useState<InterestedInType>('Weekend Stay');
  const [leadId, setLeadId] = useState<string | undefined>(undefined);

  const [items, setItems] = useState<QuotationItem[]>([
    { id: '1', description: 'Luxury Suite 2-Nights Stay', quantity: 2, rate: 12500, amount: 25000 },
  ]);

  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [taxType, setTaxType] = useState<'GST_12' | 'GST_18' | 'NONE'>('GST_18');
  const [validUntil, setValidUntil] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast.error('Coupon Error', 'Please enter a coupon code.');
      return;
    }
    const currentSubtotal = items.reduce((acc, i) => acc + (i.amount || 0), 0);
    const res = validateCoupon(couponCode, currentSubtotal, 2, currentResort.id);
    if (res.isValid) {
      setDiscountType(res.discountType);
      setDiscountValue(res.discountValue);
      setAppliedCoupon(res.coupon?.code || couponCode.toUpperCase());
      toast.success('Coupon Applied!', res.message);
    } else {
      toast.error('Invalid Coupon', res.message);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setDiscountValue(0);
    toast.info('Coupon Removed', 'Standard pricing restored.');
  };

  useEffect(() => {
    if (isOpen) {
      if (quotationToEdit) {
        setGuestName(quotationToEdit.guest_name);
        setGuestPhone(quotationToEdit.guest_phone);
        setGuestEmail(quotationToEdit.guest_email);
        setInterestedIn(quotationToEdit.interested_in || 'Weekend Stay');
        setLeadId(quotationToEdit.lead_id);
        setItems(quotationToEdit.items);
        setDiscountType(quotationToEdit.discount_type);
        setDiscountValue(quotationToEdit.discount_value);
        setTaxType(quotationToEdit.tax_type);
        setValidUntil(quotationToEdit.valid_until);
        setNotes(quotationToEdit.notes || '');
      } else if (prefillLead) {
        setGuestName(prefillLead.name);
        setGuestPhone(prefillLead.phone);
        setGuestEmail(prefillLead.email);
        setInterestedIn(prefillLead.interested_in);
        setLeadId(prefillLead.id);
        const estRate = Math.round((prefillLead.budget_max || 25000) / 2);
        setItems([
          {
            id: '1',
            description: `${prefillLead.interested_in} Package for ${prefillLead.guests_adults} Adults`,
            quantity: 2,
            rate: estRate,
            amount: estRate * 2,
          },
        ]);
        setDiscountType('percentage');
        setDiscountValue(5);
        setTaxType('GST_18');
        setValidUntil(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
        setNotes(prefillLead.remarks || 'Special inclusions: breakfast buffet and resort amenities access.');
      } else {
        setGuestName('');
        setGuestPhone('');
        setGuestEmail('');
        setInterestedIn('Weekend Stay');
        setLeadId(undefined);
        setItems([
          { id: '1', description: 'Pool Villa 2-Night Luxury Stay', quantity: 2, rate: 15000, amount: 30000 },
        ]);
        setDiscountType('percentage');
        setDiscountValue(0);
        setTaxType('GST_18');
        setValidUntil(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
        setNotes('');
      }
    }
  }, [isOpen, prefillLead, quotationToEdit]);

  if (!isOpen) return null;

  // Real-time calculated totals
  const totals = calculateQuotationTotals(items, discountType, discountValue, taxType);

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: `item-${Date.now()}`,
        description: '',
        quantity: 1,
        rate: 5000,
        amount: 5000,
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) {
      toast.error('Minimum 1 item required');
      return;
    }
    setItems(items.filter((i) => i.id !== id));
  };

  const handleItemChange = (id: string, field: keyof QuotationItem, value: any) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === 'quantity' || field === 'rate') {
            const qty = field === 'quantity' ? Number(value) || 0 : item.quantity;
            const rate = field === 'rate' ? Number(value) || 0 : item.rate;
            updated.amount = qty * rate;
          }
          return updated;
        }
        return item;
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) {
      toast.error('Validation Error', 'Guest name is required.');
      return;
    }

    setIsSubmitting(true);

    if (quotationToEdit) {
      const res = updateQuotation(
        quotationToEdit.id,
        {
          guest_name: guestName,
          guest_phone: guestPhone,
          guest_email: guestEmail,
          interested_in: interestedIn,
          items,
          discount_type: discountType,
          discount_value: discountValue,
          tax_type: taxType,
          valid_until: validUntil,
          notes,
        },
        currentResort.id,
        user
      );
      setIsSubmitting(false);
      if (res.success) {
        toast.success('Quotation Updated', 'Changes saved successfully.');
        onSuccess();
        onClose();
      } else {
        toast.error('Update Failed', res.error);
      }
    } else {
      const res = createQuotation(
        {
          lead_id: leadId,
          guest_name: guestName,
          guest_phone: guestPhone,
          guest_email: guestEmail,
          interested_in: interestedIn,
          items,
          subtotal: totals.subtotal,
          discount_type: discountType,
          discount_value: discountValue,
          discount_amount: totals.discountAmount,
          tax_type: taxType,
          cgst_rate: totals.cgstRate,
          sgst_rate: totals.sgstRate,
          igst_rate: totals.igstRate,
          tax_amount: totals.taxAmount,
          grand_total: totals.grandTotal,
          status: 'Draft',
          valid_until: validUntil,
          notes,
          created_by: user?.name || 'Sales Rep',
        },
        currentResort.id,
        user
      );
      setIsSubmitting(false);
      if (res.success) {
        if (appliedCoupon) {
          incrementCouponUsage(appliedCoupon, currentResort.id);
        }
        toast.success('Quotation Created', `Proposal ${res.quotation?.quotation_number} generated.`);
        onSuccess();
        onClose();
      } else {
        toast.error('Creation Failed', res.error);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl lg:max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#CBD5E1] text-[#0F172A] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#0F172A] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#0F5132]" />
              <span>{quotationToEdit ? 'Edit Quotation Proposal' : 'Create New Quotation Proposal'}</span>
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Curate custom tariffs, package inclusions, GST slabs, and discount for {currentResort.name}.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-xs">
          
          {/* Guest Information */}
          <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0] space-y-3">
            <span className="font-bold text-[#0F172A] uppercase tracking-wider text-[11px] block">
              Guest & Inquiring Party Details
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#475569] mb-1">Guest Name *</label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="e.g. Vikram Singhania"
                  className="w-full h-9 px-3 rounded-xl bg-white border border-[#CBD5E1] font-medium focus:outline-none focus:border-[#0F5132]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#475569] mb-1">Phone Number</label>
                <input
                  type="text"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  placeholder="+91 98200 11223"
                  className="w-full h-9 px-3 rounded-xl bg-white border border-[#CBD5E1] font-medium focus:outline-none focus:border-[#0F5132]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#475569] mb-1">Email Address</label>
                <input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="guest@example.com"
                  className="w-full h-9 px-3 rounded-xl bg-white border border-[#CBD5E1] font-medium focus:outline-none focus:border-[#0F5132]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-[#475569] mb-1">Package Experience Type</label>
                <select
                  value={interestedIn}
                  onChange={(e) => setInterestedIn(e.target.value as InterestedInType)}
                  className="w-full h-9 px-3 rounded-xl bg-white border border-[#CBD5E1] font-medium focus:outline-none focus:border-[#0F5132]"
                >
                  <option value="Weekend Stay">Weekend Stay</option>
                  <option value="Family Stay">Family Stay</option>
                  <option value="Luxury Stay">Luxury Stay</option>
                  <option value="Wedding">Wedding Celebration</option>
                  <option value="Corporate Event">Corporate Event</option>
                  <option value="Nature Camp">Nature Camp</option>
                  <option value="Team Outing">Team Outing</option>
                  <option value="Adventure Activities">Adventure Activities</option>
                  <option value="Conference">Conference</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#475569] mb-1">Valid Until Date</label>
                <input
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl bg-white border border-[#CBD5E1] font-medium focus:outline-none focus:border-[#0F5132]"
                />
              </div>
            </div>
          </div>

          {/* Package Line Items */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#0F172A] uppercase tracking-wider text-[11px]">
                Package Line Items & Tariffs
              </span>
              <button
                type="button"
                onClick={handleAddItem}
                className="px-2.5 py-1 rounded-lg bg-emerald-50 text-[#0F5132] border border-emerald-200 text-xs font-bold hover:bg-emerald-100 flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1]"
                >
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Item description (e.g. Deluxe Suite 2 Nights with Breakfast)"
                      value={item.description}
                      onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                      className="w-full h-8 px-2.5 rounded-lg bg-white border border-[#CBD5E1] font-medium text-xs focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-20">
                      <input
                        type="number"
                        min="1"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                        className="w-full h-8 px-2 rounded-lg bg-white border border-[#CBD5E1] font-medium text-xs text-center focus:outline-none"
                      />
                    </div>

                    <div className="w-28">
                      <input
                        type="number"
                        min="0"
                        placeholder="Rate ₹"
                        value={item.rate}
                        onChange={(e) => handleItemChange(item.id, 'rate', e.target.value)}
                        className="w-full h-8 px-2 rounded-lg bg-white border border-[#CBD5E1] font-medium text-xs text-right focus:outline-none"
                      />
                    </div>

                    <div className="w-28 text-right font-bold text-xs text-[#0F172A] px-1">
                      {formatINR(item.amount)}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Promo Code & Coupon Box */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#0F5132]" />
                <span className="text-xs font-bold text-[#0F5132]">Apply Promotional Coupon</span>
                {appliedCoupon && (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[11px] font-bold flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    {appliedCoupon}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {!appliedCoupon ? (
                  <>
                    <input
                      type="text"
                      placeholder="e.g. DIWALI25, CORPJOY"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="h-8 px-2.5 rounded-lg bg-white border border-emerald-300 font-mono font-bold text-xs uppercase focus:outline-none focus:border-[#0F5132] w-40"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="h-8 px-3 rounded-lg bg-[#0F5132] text-white font-bold text-xs hover:bg-[#0D4429] transition-colors"
                    >
                      Apply
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="h-8 px-3 rounded-lg bg-white border border-rose-300 text-rose-600 hover:bg-rose-50 font-bold text-xs transition-colors"
                  >
                    Remove Coupon
                  </button>
                )}
              </div>
            </div>
            <p className="text-[10px] text-emerald-800 mt-1.5">
              Available offers: <strong>DIWALI25</strong> (25% off villas), <strong>EARLYBIRD10</strong> (10% off advance), <strong>CORPJOY</strong> (₹5k corporate).
            </p>
          </div>

          {/* Discount & Tax Slab Configuration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0]">
            {/* Discount */}
            <div className="space-y-2">
              <label className="block text-[11px] font-semibold text-[#475569]">Privilege Discount</label>
              <div className="flex gap-2">
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value as any)}
                  className="h-8 px-2 rounded-lg bg-white border border-[#CBD5E1] font-medium text-xs focus:outline-none"
                >
                  <option value="percentage">% Percent</option>
                  <option value="fixed">₹ Flat INR</option>
                </select>
                <input
                  type="number"
                  min="0"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(Number(e.target.value) || 0)}
                  placeholder={discountType === 'percentage' ? '10%' : '5000'}
                  className="flex-1 h-8 px-2.5 rounded-lg bg-white border border-[#CBD5E1] font-medium text-xs focus:outline-none"
                />
              </div>
            </div>

            {/* GST Tax Slab */}
            <div className="space-y-2">
              <label className="block text-[11px] font-semibold text-[#475569]">
                GST Slab (Hospitality Slab)
              </label>
              <select
                value={taxType}
                onChange={(e) => setTaxType(e.target.value as any)}
                className="w-full h-8 px-2.5 rounded-lg bg-white border border-[#CBD5E1] font-medium text-xs focus:outline-none"
              >
                <option value="GST_18">GST 18% (Luxury Rooms &amp; Banquets &gt; ₹7,500)</option>
                <option value="GST_12">GST 12% (Standard Rooms &amp; Dining &lt;= ₹7,500)</option>
                <option value="NONE">Exempt / Zero Rated (0%)</option>
              </select>
              <p className="text-[10px] text-[#64748B]">
                ⚖️ Note: Confirm applicable rates with your Chartered Accountant for ITC claims.
              </p>
            </div>
          </div>

          {/* Notes & Special Inclusions */}
          <div>
            <label className="block text-[11px] font-semibold text-[#475569] mb-1">
              Special Inclusions & Custom Terms
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Complimentary airport transfer included. Swimming pool open till 9:00 PM."
              className="w-full p-2.5 rounded-xl bg-white border border-[#CBD5E1] font-medium text-xs focus:outline-none focus:border-[#0F5132]"
            />
          </div>

          {/* Live Calculation Box */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-[#0F172A] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1 text-xs text-[#334155]">
              <div className="flex gap-4">
                <span>Subtotal: <strong>{formatINR(totals.subtotal)}</strong></span>
                {totals.discountAmount > 0 && (
                  <span className="text-emerald-800">
                    Discount: <strong>- {formatINR(totals.discountAmount)}</strong>
                  </span>
                )}
                <span>GST: <strong>{formatINR(totals.taxAmount)}</strong></span>
              </div>
              <p className="text-[11px] text-[#64748B]">All calculations auto-update in real time.</p>
            </div>

            <div className="text-right">
              <span className="text-[11px] font-bold text-[#64748B] uppercase block">Grand Total</span>
              <span className="text-xl font-black text-[#0F5132]">{formatINR(totals.grandTotal)}</span>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-2 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs font-semibold text-[#475569] hover:bg-[#F8FAFC]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-[#0F5132] hover:bg-[#0B3D25] text-white rounded-xl text-xs font-bold shadow-2xs transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>{quotationToEdit ? 'Save Changes' : 'Generate Proposal'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
