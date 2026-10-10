import React, { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { checkResortLimits } from '@/api/plansApi';
import { updateResortSubscription } from '@/api/resortsApi';
import { getDbItem, DB_KEYS } from '@/api/db';
import { Invoice } from '@/types';
import { formatINR } from '@/lib/formatINR';
import { toast } from '@/store/useToastStore';
import {
  CreditCard,
  Sparkles,
  Check,
  ShieldCheck,
  Download,
  CheckCircle2,
  AlertCircle,
  Building2,
  Calendar,
  Layers,
  IndianRupee,
  Lock,
} from 'lucide-react';

export const SubscriptionPage: React.FC = () => {
  const { currentResort, switchResort, addAuditLog, role } = useAuthStore();
  const isOwner = role === 'Resort Owner' || role === 'Super Admin';
  const limits = checkResortLimits(currentResort?.id || 'resort-1');

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPlanToUpgrade, setSelectedPlanToUpgrade] = useState<'Pro' | 'Enterprise'>('Enterprise');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  // Invoices for this resort
  const allInvoices = getDbItem<Invoice[]>(DB_KEYS.INVOICES, []);
  const resortInvoices = allInvoices.filter((inv) => (inv as any).resortId === currentResort?.id);

  const handleSimulatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const updated = updateResortSubscription(currentResort?.id || 'resort-1', selectedPlanToUpgrade, billingCycle);
      if (updated) {
        switchResort(updated.id);
      }
      setIsProcessing(false);
      setIsCheckoutOpen(false);
      toast.success(
        'Subscription Activated!',
        `Your resort is now active on the ${selectedPlanToUpgrade} Plan with full limits unlocked.`
      );
      addAuditLog(
        'SaaS Subscription Paid',
        `Resort upgraded to ${selectedPlanToUpgrade} (${billingCycle}) via ${paymentMethod.toUpperCase()}`,
        'Info'
      );
    }, 1200);
  };

  const planPrices = {
    Pro: { monthly: 27999, yearly: 279990 },
    Enterprise: { monthly: 49999, yearly: 499990 },
  };

  const activePrice = planPrices[selectedPlanToUpgrade][billingCycle];
  const gstTax = Math.round(activePrice * 0.18);
  const grandTotal = activePrice + gstTax;

  return (
    <div className="space-y-5 text-[#111827] w-full pb-10">
      {/* Role-Specific Perspective Top Banner */}
      {isOwner ? (
        <div className="p-4 bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0F5132] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
              <Sparkles className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex flex-col lg:flex-row items-center gap-2">
                <span className="text-xs font-bold text-[#0F5132] uppercase tracking-wider">
                  Resort Owner Billing & License Desk
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#DCFCE7] text-[#0F5132]">
                  Payment Authority
                </span>
              </div>
              <p className="text-xs text-[#475569] mt-0.5">
                You hold financial authority to upgrade SaaS plans, add room keys, configure payment UPI/cards, and download GST tax receipts.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#0F5132] text-white self-start sm:self-auto shrink-0 shadow-2xs">
            Billing Subscriber
          </span>
        </div>
      ) : role === 'Resort Manager' ? (
        <div className="p-4 bg-gradient-to-r from-blue-50 via-sky-50/50 to-white border border-blue-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0284C7] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
              <Lock className="w-5 h-5 text-sky-100" />
            </div>
            <div>
              <div className="flex flex-col lg:flex-row items-center gap-2">
                <span className="text-xs font-bold text-[#0369A1] uppercase tracking-wider">
                  General Manager View-Only Quota Mode
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-sky-100 text-[#0369A1]">
                  Capacity Monitor
                </span>
              </div>
              <p className="text-xs text-[#475569] mt-0.5">
                You can monitor active capacity meters and room limits. Changing subscription tiers or billing cards is reserved strictly for the Resort Owner.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#0284C7] text-white self-start sm:self-auto shrink-0 shadow-2xs">
            View-Only
          </span>
        </div>
      ) : null}

      {/* Header */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-col lg:flex-row items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#0F5132] text-[11px] font-bold uppercase tracking-wider border border-emerald-200">
              SaaS Billing & Plan Limits
            </span>
            <span className="text-xs text-[#64748B]">Tenant: {currentResort?.name}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight mt-1">
            Subscription & Capacity Command
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Manage your operational tier, room capacities, staff user quotas and GST invoice receipts
          </p>
        </div>

        {isOwner ? (
          <button
            type="button"
            onClick={() => setIsCheckoutOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#0F5132] hover:bg-[#0A3622] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>Upgrade / Renew Plan</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() =>
              toast.info(
                'Owner Request Sent',
                'A quota expansion notification has been dispatched to the Resort Owner.'
              )
            }
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all border border-slate-300 flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span>Request Owner Upgrade</span>
          </button>
        )}
      </div>

      {/* Plan Status & Quota Meters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Active Plan Card */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B]">Active Plan</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                currentResort?.status === 'Trial'
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-emerald-100 text-[#0F5132] border border-emerald-300'
              }`}
            >
              {currentResort?.status === 'Trial' ? '14-Day Free Trial' : 'Active Subscription'}
            </span>
          </div>

          <div>
            <h2 className="text-2xl font-black text-[#0F172A]">{limits.plan} Plan</h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Next renewal: <strong>15 Nov 2026</strong>
            </p>
          </div>

          <div className="pt-2 text-xs text-[#64748B] space-y-1">
            <div className="flex justify-between">
              <span>Billed Amount:</span>
              <strong className="text-[#0F172A]">{formatINR(currentResort?.mrr || 27999)} /mo</strong>
            </div>
            <div className="flex justify-between">
              <span>GST Compliance:</span>
              <strong className="text-emerald-700">18% B2B Tax Invoice</strong>
            </div>
          </div>
        </div>

        {/* Room / Villa Quota Meter */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B]">Room / Villa Capacity</span>
            <span className="text-xs font-bold text-[#0F172A]">
              {limits.roomsUsed} / {limits.roomLimit}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                limits.isRoomLimitReached
                  ? 'bg-rose-500'
                  : limits.roomsUsed / limits.roomLimit > 0.8
                  ? 'bg-amber-500'
                  : 'bg-[#0F5132]'
              }`}
              style={{ width: `${Math.min(100, (limits.roomsUsed / limits.roomLimit) * 100)}%` }}
            />
          </div>

          <p className="text-[11px] text-[#64748B]">
            {limits.isRoomLimitReached ? (
              <span className="text-rose-600 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Villa limit reached. Upgrade to add more rooms.
              </span>
            ) : (
              `${limits.roomLimit - limits.roomsUsed} additional villas can be added on your tier.`
            )}
          </p>
        </div>

        {/* Staff User Quota Meter */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B]">Staff User Seats</span>
            <span className="text-xs font-bold text-[#0F172A]">
              {limits.usersUsed} / {limits.userLimit} Seats
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                limits.isUserLimitReached ? 'bg-rose-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, (limits.usersUsed / limits.userLimit) * 100)}%` }}
            />
          </div>

          <p className="text-[11px] text-[#64748B]">
            {limits.isUserLimitReached ? (
              <span className="text-rose-600 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> User limit full. Upgrade to invite staff.
              </span>
            ) : (
              `${limits.userLimit - limits.usersUsed} team seats available for Reception & Kitchen staff.`
            )}
          </p>
        </div>
      </div>

      {/* Subscription Invoices Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#0F172A]">SaaS Subscription GST Invoices</h3>
            <p className="text-xs text-[#64748B]">
              Download GST tax invoices with input tax credit (ITC) for your company books
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            GSTIN: 29AABCJ1928K1Z5
          </span>
        </div>

        {/* Mobile / Tablet Horizontal Scroll Notice */}
        <div className="lg:hidden flex flex-col md:flex-row items-center justify-between px-4 py-2 bg-[#F8FAFC] border-b border-[#E2E8F0] text-xs text-[#64748B]">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="inline-block w-2 h-2 rounded-full bg-[#0F5132] animate-pulse" />
            Scroll table horizontally to view GST invoice receipts
          </span>
          <span className="text-[10px] font-semibold text-[#0F5132] bg-white px-2 py-0.5 rounded border border-[#E2E8F0] whitespace-nowrap">
            ↔ Swipe to explore
          </span>
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[850px] text-left text-xs border-collapse">
            <thead className="bg-[#F8FAFC] text-[#64748B] uppercase text-[10px] font-semibold border-y border-[#E2E8F0] whitespace-nowrap">
              <tr>
                <th className="py-3 px-3 min-w-[140px]">Invoice Number</th>
                <th className="py-3 px-3 min-w-[110px]">Billing Date</th>
                <th className="py-3 px-3 min-w-[110px]">Subtotal</th>
                <th className="py-3 px-3 min-w-[160px]">18% GST (CGST+SGST)</th>
                <th className="py-3 px-3 min-w-[120px]">Grand Total</th>
                <th className="py-3 px-3 min-w-[90px]">Status</th>
                <th className="py-3 px-3 text-right min-w-[110px]">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {resortInvoices.length > 0 ? (
                resortInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3 px-3 font-bold text-[#0F172A]">{inv.invoiceNumber}</td>
                    <td className="py-3 px-3 text-[#64748B]">{inv.date}</td>
                    <td className="py-3 px-3 font-medium">{formatINR(inv.subTotal)}</td>
                    <td className="py-3 px-3 text-[#64748B]">{formatINR(inv.gstAmount)}</td>
                    <td className="py-3 px-3 font-bold text-[#0F5132]">{formatINR(inv.grandTotal)}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Paid
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => toast.success('Receipt Downloaded', `PDF for ${inv.invoiceNumber} dispatched`)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0F5132] hover:underline"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-xs text-[#94A3B8]">
                    No subscription invoices yet. Upgrading will generate an instant GST receipt.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simulated Indian Payment Gateway Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 text-left">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div>
                <h3 className="text-lg font-bold text-[#0F172A]">Upgrade Resort Subscription</h3>
                <p className="text-xs text-[#64748B]">Simulated Indian Payment Gateway (UPI / Card / NetBanking)</p>
              </div>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="text-[#64748B] hover:text-[#0F172A] font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSimulatePayment} className="space-y-4">
              {/* Select Plan */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1E293B]">Select Plan Upgrade:</label>
                <div className="grid grid-cols-2 gap-2">
                  <div
                    onClick={() => setSelectedPlanToUpgrade('Pro')}
                    className={`p-3 rounded-xl border cursor-pointer text-xs transition-all ${
                      selectedPlanToUpgrade === 'Pro'
                        ? 'bg-emerald-50 border-[#0F5132] ring-1 ring-[#0F5132]'
                        : 'border-[#E2E8F0] hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-bold">Pro Plan</div>
                    <div className="text-[11px] text-[#64748B]">30 Villas • 15 Users</div>
                    <div className="font-extrabold text-[#0F5132] mt-1">{formatINR(27999)} /mo</div>
                  </div>

                  <div
                    onClick={() => setSelectedPlanToUpgrade('Enterprise')}
                    className={`p-3 rounded-xl border cursor-pointer text-xs transition-all ${
                      selectedPlanToUpgrade === 'Enterprise'
                        ? 'bg-emerald-50 border-[#0F5132] ring-1 ring-[#0F5132]'
                        : 'border-[#E2E8F0] hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-bold">Enterprise Plan</div>
                    <div className="text-[11px] text-[#64748B]">Unlimited Villas & Staff</div>
                    <div className="font-extrabold text-[#0F5132] mt-1">{formatINR(49999)} /mo</div>
                  </div>
                </div>
              </div>

              {/* Billing Cycle */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs">
                <span className="font-semibold text-[#1E293B]">Billing Cycle:</span>
                <div className="flex flex-col lg:flex-row items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      billingCycle === 'monthly' ? 'bg-[#0F5132] text-white' : 'text-[#64748B]'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle('yearly')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      billingCycle === 'yearly' ? 'bg-[#0F5132] text-white' : 'text-[#64748B]'
                    }`}
                  >
                    Yearly (Save 17%)
                  </button>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1E293B]">Payment Method:</label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-2 rounded-xl border text-center font-bold transition-all ${
                      paymentMethod === 'upi' ? 'bg-emerald-50 border-[#0F5132] text-[#0F5132]' : 'border-[#E2E8F0]'
                    }`}
                  >
                    UPI (GooglePay)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-2 rounded-xl border text-center font-bold transition-all ${
                      paymentMethod === 'card' ? 'bg-emerald-50 border-[#0F5132] text-[#0F5132]' : 'border-[#E2E8F0]'
                    }`}
                  >
                    Corporate Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`p-2 rounded-xl border text-center font-bold transition-all ${
                      paymentMethod === 'netbanking' ? 'bg-emerald-50 border-[#0F5132] text-[#0F5132]' : 'border-[#E2E8F0]'
                    }`}
                  >
                    NetBanking (HDFC)
                  </button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between text-[#64748B]">
                  <span>Plan Subtotal:</span>
                  <span>{formatINR(activePrice)}</span>
                </div>
                <div className="flex justify-between text-[#64748B]">
                  <span>18% GST (CGST 9% + SGST 9%):</span>
                  <span>{formatINR(gstTax)}</span>
                </div>
                <div className="flex justify-between font-black text-sm text-[#0F172A] pt-1 border-t border-slate-200">
                  <span>Total Payable:</span>
                  <span className="text-[#0F5132]">{formatINR(grandTotal)}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-bold text-[#64748B] hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex-1 py-2.5 rounded-xl bg-[#0F5132] hover:bg-[#0A3622] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  {isProcessing ? (
                    <span>Processing Payment...</span>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Pay {formatINR(grandTotal)} & Activate</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
