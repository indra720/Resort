import React, { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { toast } from '@/store/useToastStore';
import { formatINR } from '@/lib/formatINR';
import {
  Send,
  PlusCircle,
  MessageCircle,
  Mail,
  Smartphone,
  TrendingUp,
  Tag,
  CheckCircle2,
  Users,
  Eye,
  Sparkles,
} from 'lucide-react';

export interface Campaign {
  id: string;
  name: string;
  channel: 'WhatsApp' | 'SMS' | 'Email';
  segment: string;
  promoCode: string;
  sentDate: string;
  recipients: number;
  deliveryRate: string;
  bookingsGenerated: number;
  revenue: number;
  status: 'Active' | 'Scheduled' | 'Completed';
  message: string;
}

const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'CMP-501',
    name: 'Diwali Festive Luxury Escape (25% Off)',
    channel: 'WhatsApp',
    segment: 'High-Spender Repeat Guests',
    promoCode: 'DIWALI25',
    sentDate: '08 Oct 2026',
    recipients: 1250,
    deliveryRate: '98.4%',
    bookingsGenerated: 34,
    revenue: 476000,
    status: 'Active',
    message: '✨ Celebrate Diwali in tranquility! Enjoy 25% off Private Pool Villas + complimentary festive dinner hamper. Book before 20 Oct with code DIWALI25.',
  },
  {
    id: 'CMP-502',
    name: 'Weekend Staycation Flash Sale',
    channel: 'SMS',
    segment: 'Goa & Mumbai Metro Resident List',
    promoCode: 'WEEKENDJOY',
    sentDate: '02 Oct 2026',
    recipients: 3400,
    deliveryRate: '96.2%',
    bookingsGenerated: 21,
    revenue: 294000,
    status: 'Active',
    message: 'Escape the city rush! Luxury Deluxe Cottages at Joy Resorts Candolim from ₹6,999/night including breakfast. Use code WEEKENDJOY.',
  },
  {
    id: 'CMP-503',
    name: 'Ayurvedic Wellness & Spa Immersion',
    channel: 'Email',
    segment: 'Corporate & Wellness Enthusiasts',
    promoCode: 'REJUVENATE',
    sentDate: '25 Sep 2026',
    recipients: 890,
    deliveryRate: '99.1%',
    bookingsGenerated: 12,
    revenue: 216000,
    status: 'Completed',
    message: 'Rejuvenate your senses with our 3-day Ayurvedic Detox package. Inclusive of daily yoga, consultation, and organic meals.',
  },
];

export const MarketingPage: React.FC = () => {
  const { currentResort } = useAuthStore();
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form
  const [name, setName] = useState('');
  const [channel, setChannel] = useState<Campaign['channel']>('WhatsApp');
  const [segment, setSegment] = useState('High-Spender Repeat Guests');
  const [promoCode, setPromoCode] = useState('JOYSEASON');
  const [message, setMessage] = useState('');

  const totalRevenue = campaigns.reduce((acc, c) => acc + c.revenue, 0);
  const totalBookings = campaigns.reduce((acc, c) => acc + c.bookingsGenerated, 0);
  const totalReach = campaigns.reduce((acc, c) => acc + c.recipients, 0);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;

    const newCampaign: Campaign = {
      id: `CMP-${Math.floor(504 + Math.random() * 80)}`,
      name,
      channel,
      segment,
      promoCode: promoCode.toUpperCase(),
      sentDate: 'Today',
      recipients: channel === 'WhatsApp' ? 1400 : 2500,
      deliveryRate: '98.5%',
      bookingsGenerated: 0,
      revenue: 0,
      status: 'Active',
      message,
    };

    setCampaigns([newCampaign, ...campaigns]);
    setIsCreateOpen(false);
    toast.success('Campaign Dispatched', `Broadcast launched across ${newCampaign.channel} to ${newCampaign.segment}.`);
    setName('');
    setMessage('');
  };

  return (
    <div className="space-y-4 sm:space-y-5 text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex flex-col lg:flex-row items-center gap-2">
            <h1 className="text-md sm:text-2xl font-bold tracking-tight text-[#0F5132] flex items-center gap-2">
              <Send className="w-6 h-6 text-[#0F5132]" />
              <span>Marketing Campaigns & Guest Outreach</span>
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200">
              {currentResort.name}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
            Broadcast promotional offers via WhatsApp, SMS, and Email to drive direct villa bookings.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsCreateOpen(true)}
          leftIcon={<PlusCircle className="w-4 h-4" />}
        >
          Create Campaign
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs">
          <p className="text-[11px] font-semibold text-[#64748B]">Attributed Revenue</p>
          <p className="text-xl sm:text-2xl font-extrabold text-[#0F5132] mt-1">{formatINR(totalRevenue)}</p>
          <span className="text-[10px] text-[#16A34A] font-medium">+18.2% from campaigns</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs">
          <p className="text-[11px] font-semibold text-[#64748B]">Bookings Converted</p>
          <p className="text-xl sm:text-2xl font-extrabold text-[#0F172A] mt-1">{totalBookings} Stays</p>
          <span className="text-[10px] text-[#64748B]">Direct without OTA commissions</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs">
          <p className="text-[11px] font-semibold text-[#64748B]">Total Audience Reached</p>
          <p className="text-xl sm:text-2xl font-extrabold text-[#0F172A] mt-1">
            {totalReach.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-[#16A34A] font-medium">97.8% Avg Delivery</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs">
          <p className="text-[11px] font-semibold text-[#64748B]">Average ROI</p>
          <p className="text-xl sm:text-2xl font-extrabold text-emerald-600 mt-1">11.4x</p>
          <span className="text-[10px] text-[#16A34A] font-medium">Industry leading</span>
        </div>
      </div>

      {/* Campaign Cards List */}
      <div className="space-y-3.5">
        {campaigns.map((c) => (
          <div
            key={c.id}
            className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8F0] pb-3">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 ${
                    c.channel === 'WhatsApp'
                      ? 'bg-[#25D366]'
                      : c.channel === 'SMS'
                      ? 'bg-blue-600'
                      : 'bg-indigo-600'
                  }`}
                >
                  {c.channel === 'WhatsApp' ? (
                    <MessageCircle className="w-5 h-5" />
                  ) : c.channel === 'SMS' ? (
                    <Smartphone className="w-5 h-5" />
                  ) : (
                    <Mail className="w-5 h-5" />
                  )}
                </div>
                <div className=''>
                 
                  <div className="flex flex-col md:flex-row items-center gap-2 text-xs text-[#64748B]">
                    <span>Target: <strong>{c.segment}</strong></span>
                    
                    <span><span>•</span> Sent: {c.sentDate}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  Promo: {c.promoCode}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-[#0F5132] border border-emerald-200">
                  {c.status}
                </span>
              </div>
            </div>

            {/* Broadcast Copy Preview */}
            <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#334155] leading-relaxed">
              <span className="text-[10px] font-bold text-[#64748B] block mb-0.5 uppercase tracking-wider">
                Broadcast Content
              </span>
              {c.message}
            </div>

            {/* Metrics Breakdown Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-[#64748B] block">Recipients Reached:</span>
                <span className="font-bold text-slate-800">{c.recipients} ({c.deliveryRate})</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-[#64748B] block">Confirmed Bookings:</span>
                <span className="font-bold text-slate-800">{c.bookingsGenerated} Reservations</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-[#64748B] block">Direct Revenue Yield:</span>
                <span className="font-bold text-[#0F5132]">{formatINR(c.revenue)}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-[#64748B] block">Channel:</span>
                <span className="font-bold text-slate-800">{c.channel} Broadcast</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Launch Guest Marketing Campaign"
        description="Broadcast discount incentives and promotional copy to targeted guest lists"
        maxWidth="md"
      >
        <form onSubmit={handleCreate} className="space-y-4 text-left">
          <Input
            label="Campaign Title"
            placeholder="e.g. Winter Luxury Weekend 20% Off"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Broadcast Channel"
              value={channel}
              onChange={(e) => setChannel(e.target.value as any)}
              options={[
                { label: 'WhatsApp Messenger API', value: 'WhatsApp' },
                { label: 'Fast SMS Gateway', value: 'SMS' },
                { label: 'HTML Email Newsletter', value: 'Email' },
              ]}
            />
            <Input
              label="Promo Voucher Code"
              placeholder="e.g. WINTER20"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              required
            />
          </div>

          <Select
            label="Audience Segment"
            value={segment}
            onChange={(e) => setSegment(e.target.value)}
            options={[
              { label: 'High-Spender Repeat Guests', value: 'High-Spender Repeat Guests' },
              { label: 'Goa & Mumbai Metro Resident List', value: 'Goa & Mumbai Metro Resident List' },
              { label: 'Corporate & Wellness Enthusiasts', value: 'Corporate & Wellness Enthusiasts' },
              { label: 'All Registered Past Guests', value: 'All Registered Past Guests' },
            ]}
          />

          <div>
            <label className="font-semibold text-xs text-[#334155] block mb-1">
              Broadcast Message Copy
            </label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Escape to Joy Resorts this season! Enjoy 20% off all Villas when you book before Sunday with code..."
              className="w-full text-xs p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0F5132]"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="ghost" type="button" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" rightIcon={<Sparkles className="w-4 h-4" />}>
              Launch Broadcast
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
