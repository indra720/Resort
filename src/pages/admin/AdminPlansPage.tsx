import React, { useState } from 'react';
import { PLATFORM_PLANS } from '@/data/mockData';
import { PlatformPlan } from '@/types';
import { formatINR } from '@/lib/formatINR';
import { toast } from '@/store/useToastStore';
import {
  Layers,
  CheckCircle2,
  Sparkles,
  Edit2,
  Plus,
  ShieldCheck,
  Check,
  Users,
  Building2,
  Zap,
} from 'lucide-react';

export const AdminPlansPage: React.FC = () => {
  const [plans, setPlans] = useState<PlatformPlan[]>(PLATFORM_PLANS);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [editingPlan, setEditingPlan] = useState<PlatformPlan | null>(null);

  const handleUpdatePrice = (planId: string, newMonthly: number) => {
    setPlans((prev) =>
      prev.map((p) => {
        if (p.id === planId) {
          return {
            ...p,
            priceMonthly: newMonthly,
            priceYearly: Math.round(newMonthly * 10), // 2 months free
          };
        }
        return p;
      })
    );
    toast.success('Plan pricing updated successfully!');
    setEditingPlan(null);
  };

  return (
    <div className="space-y-4 text-[#111827]">
      {/* Header Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-2xs bg-white">
        <div className="relative h-44 sm:h-48 w-full overflow-hidden flex flex-col justify-between p-4 sm:p-6">
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=80"
            alt="Plans & Pricing"
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.96]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-transparent" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#0F5132]/10 text-[#0F5132] uppercase tracking-wider">
                  SaaS Revenue Engine
                </span>
                <span className="text-xs text-[#64748B]">Platform Plans</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A] mt-1">
                SaaS Subscription Plans & Pricing
              </h1>
              <p className="text-xs sm:text-sm text-[#475569] font-medium mt-0.5">
                Manage tenant tier pricing, room quotas, user limits, and feature access permissions
              </p>
            </div>

            {/* Monthly / Yearly Billing Cycle Switcher */}
            <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md p-1.5 rounded-2xl border border-[#E2E8F0] shadow-2xs self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  billingCycle === 'monthly'
                    ? 'bg-[#0F5132] text-white shadow-2xs'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('yearly')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  billingCycle === 'yearly'
                    ? 'bg-[#0F5132] text-white shadow-2xs'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                <span>Yearly</span>
                <span className="px-1.5 py-0.2 rounded-md bg-emerald-100 text-[#0F5132] text-[10px]">
                  2 Mos Free
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Tier Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((p) => {
          const price = billingCycle === 'monthly' ? p.priceMonthly : p.priceYearly;
          return (
            <div
              key={p.id}
              className={`p-5 rounded-3xl bg-white border flex flex-col justify-between shadow-2xs transition-shadow relative ${
                p.isPopular ? 'border-[#0F5132] ring-2 ring-[#0F5132]/20 shadow-md' : 'border-[#E2E8F0]'
              }`}
            >
              {p.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#0F5132] text-white text-[10px] font-bold tracking-wider uppercase shadow-xs flex items-center gap-1">
                  <Zap className="w-3 h-3 fill-white" /> Most Popular
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-[#0F172A]">{p.name}</h3>
                  <button
                    type="button"
                    onClick={() => setEditingPlan(p)}
                    className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F5132] hover:bg-[#F1F5F9] transition-colors"
                    title="Edit Plan"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-[#64748B] mt-0.5">
                  {p.id === 'plan-basic'
                    ? 'Ideal for boutique villas & homestays'
                    : p.id === 'plan-pro'
                    ? 'Perfect for growing luxury resorts'
                    : 'For luxury hotel chains & multi-property groups'}
                </p>

                <div className="mt-4 mb-4 pb-4 border-b border-[#E2E8F0]">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-[#0F5132] tracking-tight">
                      {formatINR(price)}
                    </span>
                    <span className="text-xs text-[#64748B] font-medium">
                      /{billingCycle === 'monthly' ? 'month' : 'year'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#94A3B8] mt-0.5">+ 18% GST applicable</p>
                </div>

                {/* Quotas */}
                <div className="space-y-2 mb-4 bg-[#F8FAFC] p-3 rounded-2xl border border-[#E2E8F0] text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B] flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-[#0F5132]" /> Room Keys
                    </span>
                    <span className="font-bold text-[#0F172A]">Up to {p.roomLimit} Rooms</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B] flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#0F5132]" /> Staff Logins
                    </span>
                    <span className="font-bold text-[#0F172A]">{p.userLimit} Users</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B] flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#0F5132]" /> Branch Limit
                    </span>
                    <span className="font-bold text-[#0F172A]">{p.branchLimit} Resort Property</span>
                  </div>
                </div>

                {/* Features List */}
                <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-2">
                  Included Capabilities:
                </p>
                <ul className="space-y-2 text-xs text-[#334155]">
                  {p.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setEditingPlan(p)}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-center border border-[#0F5132] text-[#0F5132] hover:bg-[#0F5132] hover:text-white transition-colors shadow-2xs"
                >
                  Configure Tier Details
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Plan Modal */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-[#E2E8F0] space-y-4 text-xs">
            <h3 className="text-base font-bold text-[#0F172A]">Edit Pricing for {editingPlan.name}</h3>

            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-[#1E293B] mb-1">Monthly Fee (₹ INR)</label>
                <input
                  type="number"
                  defaultValue={editingPlan.priceMonthly}
                  id="editMonthlyPrice"
                  className="w-full h-10 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setEditingPlan(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById('editMonthlyPrice') as HTMLInputElement;
                    if (input && Number(input.value)) {
                      handleUpdatePrice(editingPlan.id, Number(input.value));
                    }
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#0F5132] hover:bg-[#0B3D25] text-white shadow-2xs"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
