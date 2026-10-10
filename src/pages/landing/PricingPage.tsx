import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { SAAS_PLANS } from '@/api/plansApi';
import { formatINR } from '@/lib/formatINR';
import {
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  HelpCircle,
  Phone,
  ArrowLeft,
} from 'lucide-react';

export const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = SAAS_PLANS;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] font-sans selection:bg-[#0F5132] selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#E2E8F0] px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <Link to="/landing" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#0F5132] flex items-center justify-center text-white shadow-xs">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C6.5 2 2 6.5 2 12c0 3.6 1.9 6.8 4.8 8.5.5-.9 1.1-2 1.7-3.1C6.2 16.3 5 14.3 5 12c0-3.9 3.1-7 7-7 2.3 0 4.3 1.1 5.4 2.8.6-.7 1.4-1.2 2.3-1.6C18.2 3.8 15.3 2 12 2zm0 4c-3.3 0-6 2.7-6 6 0 1.8.8 3.4 2.1 4.5.8-1.5 1.8-2.9 3-3.9-1.2-1.3-1.5-3.3-.6-4.9.4-.7 1-1.2 1.5-1.7zm5.2 3.2c-.7.6-1.3 1.3-1.7 2.1 1.4.3 2.6 1.2 3.3 2.5 1.3-1.3 2.2-3.1 2.2-5.1 0-.9-.2-1.8-.5-2.6-.9 1-2.1 2.1-3.3 3.1zm-3.2 4.1c-.8.8-1.5 1.7-2.1 2.7 1.8.4 3.3 1.7 4 3.4 1.9-.9 3.3-2.6 3.8-4.7-1.7-.2-3.8-.4-5.7-1.4z" />
            </svg>
          </div>
          <span className="text-base font-extrabold tracking-tight text-[#111827]">
            JOY <span className="text-[#0F5132]">RESORTS</span> <span className="text-xs text-[#64748B] font-semibold uppercase ml-1">SaaS</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-xs font-semibold text-[#64748B] hover:text-[#0F5132] px-3 py-1.5"
          >
            Sign In
          </Link>
          <button
            type="button"
            onClick={() => navigate('/resort-signup')}
            className="px-4 py-2 rounded-xl bg-[#0F5132] hover:bg-[#0A3622] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <span>Start 14-Day Trial</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[#0F5132] text-xs font-semibold border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Transparent SaaS Tariffs for Hospitality Owners</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-[#0F172A] tracking-tight max-w-2xl mx-auto leading-tight">
          Run your luxury resort with complete operational command
        </h1>

        <p className="text-xs sm:text-base text-[#64748B] max-w-xl mx-auto">
          Start with a 14-day free trial. No credit card required. Cancel or upgrade anytime with seamless GST compliance.
        </p>

        {/* Billing Cycle Toggle */}
        <div className="pt-4 flex items-center justify-center gap-3">
          <div className="p-1 rounded-xl bg-white border border-[#E2E8F0] inline-flex items-center shadow-2xs">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-[#0F5132] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#111827]'
              }`}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                billingCycle === 'yearly'
                  ? 'bg-[#0F5132] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#111827]'
              }`}
            >
              <span>Annual Billing</span>
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-[#0F5132] text-[10px] font-black">
                Save 17%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan) => {
            const isPro = plan.id === 'plan-pro' || plan.name.includes('Pro');
            const price = billingCycle === 'yearly' ? Math.round(plan.priceYearly / 12) : plan.priceMonthly;

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all ${
                  isPro
                    ? 'bg-white border-2 border-[#0F5132] shadow-xl ring-4 ring-[#0F5132]/10 scale-100 md:scale-105 z-10'
                    : 'bg-white border border-[#E2E8F0] shadow-sm hover:border-slate-300'
                }`}
              >
                {isPro && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#0F5132] text-white text-[11px] font-black uppercase tracking-wider shadow-md">
                    Most Popular Choice
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-[#0F172A]">{plan.name}</h3>
                    <p className="text-xs text-[#64748B] mt-1">
                      {plan.roomLimit} Villas • Up to {plan.userLimit} Staff Users
                    </p>
                  </div>

                  <div className="pt-2">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-black text-[#0F172A]">
                        {formatINR(price)}
                      </span>
                      <span className="text-xs text-[#64748B] font-semibold">/ month</span>
                    </div>
                    <span className="text-[11px] text-[#64748B]">
                      {billingCycle === 'yearly' ? `Billed annually at ${formatINR(plan.priceYearly)}` : 'Billed monthly + 18% GST'}
                    </span>
                  </div>

                  {/* Limits summary badge */}
                  <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5 text-xs text-[#1E293B]">
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Max Villas/Rooms:</span>
                      <span className="font-bold">{plan.roomLimit} Rooms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Staff User Accounts:</span>
                      <span className="font-bold">{plan.userLimit} Users</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Resort Properties:</span>
                      <span className="font-bold">{plan.branchLimit} Property</span>
                    </div>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-2 pt-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] block">
                      Included Operations:
                    </span>
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-[#1E293B]">
                        <Check className="w-4 h-4 text-[#0F5132] shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8">
                  <button
                    type="button"
                    onClick={() => navigate(`/resort-signup?plan=${plan.name.split(' ')[0].toLowerCase()}`)}
                    className={`w-full py-3 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 active:scale-98 ${
                      isPro
                        ? 'bg-[#0F5132] hover:bg-[#0A3622] text-white shadow-emerald-900/20'
                        : 'bg-[#F8FAFC] hover:bg-slate-100 text-[#0F172A] border border-[#E2E8F0]'
                    }`}
                  >
                    <span>Start 14-Day Free Trial</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <span className="block text-center text-[10px] text-[#94A3B8] mt-2">
                    Instant onboarding • Cancel anytime
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Trust & GST Compliance Strip */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-center border-t border-[#E2E8F0] mt-12 space-y-4">
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#64748B]">
          <span className="flex items-center gap-1.5 font-semibold text-[#0F172A]">
            <ShieldCheck className="w-4 h-4 text-[#0F5132]" /> 100% Data Isolation per Tenant
          </span>
          <span className="flex items-center gap-1.5 font-semibold text-[#0F172A]">
            <Building2 className="w-4 h-4 text-[#0F5132]" /> GST (CGST + SGST) Compliant Invoicing
          </span>
          <span className="flex items-center gap-1.5 font-semibold text-[#0F172A]">
            <Phone className="w-4 h-4 text-[#0F5132]" /> 24/7 Dedicated Support
          </span>
        </div>
      </section>
    </div>
  );
};
