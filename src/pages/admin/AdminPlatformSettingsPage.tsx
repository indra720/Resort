import React, { useState } from 'react';
import { toast } from '@/store/useToastStore';
import {
  Settings,
  CreditCard,
  Key,
  ShieldCheck,
  Server,
  Bell,
  Save,
  RefreshCw,
  Building2,
  Mail,
  Lock,
} from 'lucide-react';

export const AdminPlatformSettingsPage: React.FC = () => {
  const [config, setConfig] = useState({
    platformName: 'Joy Resorts SaaS Engine',
    supportEmail: 'platform-support@joyresorts.com',
    supportHotline: '+91 80000 12345',
    defaultTrialDays: 14,
    platformGSTIN: '27AABCT1334M1Z2',
    razorpayKeyId: 'rzp_live_9921JoyResorts',
    razorpaySecret: '••••••••••••••••••••••••',
    stripeWebhookSecret: 'whsec_88192JoySecretKeyLive',
    smsGateway: 'Twilio Cloud SMS API',
    whatsappProvider: 'Gupshup Enterprise Verified WhatsApp',
    maintenanceMode: false,
    autoBackupDaily: true,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Global SaaS platform configuration saved successfully!');
  };

  return (
    <div className="space-y-4 text-[#111827]">
      {/* Header Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-2xs bg-white">
        <div className="relative h-44 sm:h-48 w-full overflow-hidden flex flex-col justify-between p-4 sm:p-6">
          <img
            src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1920&q=80"
            alt="Platform SaaS Config"
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.96]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-transparent" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#0F5132]/10 text-[#0F5132] uppercase tracking-wider">
                  Platform Core
                </span>
                <span className="text-xs text-[#64748B]">Super Admin Root</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A] mt-1">
                Global SaaS Platform Configuration
              </h1>
              <p className="text-xs sm:text-sm text-[#475569] font-medium mt-0.5">
                Central payment rails, GST compliance parameters, multi-tenant isolation, and SMS gateways
              </p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Section 1: Platform Brand & Operational Parameters */}
        <div className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-2xs space-y-4 text-xs">
          <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-3">
            <Building2 className="w-4 h-4 text-[#0F5132]" />
            <h3 className="text-sm font-bold text-[#0F172A]">Platform Brand & General Settings</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">Platform Brand Name</label>
              <input
                type="text"
                value={config.platformName}
                onChange={(e) => setConfig({ ...config, platformName: e.target.value })}
                className="w-full h-10 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">Platform Support Email</label>
              <input
                type="email"
                value={config.supportEmail}
                onChange={(e) => setConfig({ ...config, supportEmail: e.target.value })}
                className="w-full h-10 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">Support Hotline</label>
              <input
                type="text"
                value={config.supportHotline}
                onChange={(e) => setConfig({ ...config, supportHotline: e.target.value })}
                className="w-full h-10 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">Default Trial Period (Days)</label>
              <input
                type="number"
                value={config.defaultTrialDays}
                onChange={(e) => setConfig({ ...config, defaultTrialDays: Number(e.target.value) })}
                className="w-full h-10 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">Platform Master GSTIN</label>
              <input
                type="text"
                value={config.platformGSTIN}
                onChange={(e) => setConfig({ ...config, platformGSTIN: e.target.value })}
                className="w-full h-10 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Payment Rails & Gateways */}
        <div className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-2xs space-y-4 text-xs">
          <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-3">
            <CreditCard className="w-4 h-4 text-[#0F5132]" />
            <h3 className="text-sm font-bold text-[#0F172A]">Payment Gateways & Subscription Webhooks</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">Razorpay Live Key ID</label>
              <input
                type="text"
                value={config.razorpayKeyId}
                onChange={(e) => setConfig({ ...config, razorpayKeyId: e.target.value })}
                className="w-full h-10 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30 font-mono text-[11px]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">Razorpay API Secret</label>
              <input
                type="password"
                value={config.razorpaySecret}
                onChange={(e) => setConfig({ ...config, razorpaySecret: e.target.value })}
                className="w-full h-10 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30 font-mono text-[11px]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">Stripe Webhook Secret</label>
              <input
                type="text"
                value={config.stripeWebhookSecret}
                onChange={(e) => setConfig({ ...config, stripeWebhookSecret: e.target.value })}
                className="w-full h-10 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30 font-mono text-[11px]"
              />
            </div>
          </div>
        </div>

        {/* Section 3: SMS & WhatsApp Provider */}
        <div className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-2xs space-y-4 text-xs">
          <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-3">
            <Bell className="w-4 h-4 text-[#0F5132]" />
            <h3 className="text-sm font-bold text-[#0F172A]">Messaging & Automated Notifications</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">Primary SMS Gateway</label>
              <input
                type="text"
                value={config.smsGateway}
                onChange={(e) => setConfig({ ...config, smsGateway: e.target.value })}
                className="w-full h-10 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">WhatsApp Business Provider</label>
              <input
                type="text"
                value={config.whatsappProvider}
                onChange={(e) => setConfig({ ...config, whatsappProvider: e.target.value })}
                className="w-full h-10 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Security, Backups & Maintenance */}
        <div className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-2xs space-y-4 text-xs">
          <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-3">
            <Server className="w-4 h-4 text-[#0F5132]" />
            <h3 className="text-sm font-bold text-[#0F172A]">Tenant Schema Security & Backups</h3>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0]">
            <div>
              <p className="font-bold text-[#0F172A]">Daily Automated Cloud Snapshots</p>
              <p className="text-[11px] text-[#64748B]">Backs up isolated tenant databases to encrypted AWS S3 buckets</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.autoBackupDaily}
                onChange={(e) => setConfig({ ...config, autoBackupDaily: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0F5132]" />
            </label>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0]">
            <div>
              <p className="font-bold text-[#0F172A]">Platform Maintenance Mode</p>
              <p className="text-[11px] text-[#64748B]">Displays planned maintenance message to all non-Super Admin users</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.maintenanceMode}
                onChange={(e) => setConfig({ ...config, maintenanceMode: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#DC2626]" />
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-[#0F5132] hover:bg-[#0B3D25] text-white rounded-xl text-xs sm:text-sm font-semibold shadow-2xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Global Platform Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
