import React, { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { toast } from '@/store/useToastStore';
import {
  PhoneCall,
  PlusCircle,
  MessageCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  User,
  Phone,
  Mail,
  Calendar,
  Sparkles,
} from 'lucide-react';

export interface FollowUpItem {
  id: string;
  guestName: string;
  phone: string;
  channel: 'Phone Call' | 'WhatsApp' | 'Email';
  scheduledTime: string;
  dueCategory: 'Overdue' | 'Today' | 'Upcoming';
  priority: 'High' | 'Medium' | 'Low';
  notes: string;
  status: 'Pending' | 'Completed' | 'Rescheduled';
  assignedTo: string;
}

const INITIAL_FOLLOWUPS: FollowUpItem[] = [
  {
    id: 'FLP-101',
    guestName: 'Dr. Siddharth Rao',
    phone: '+91 98201 11223',
    channel: 'Phone Call',
    scheduledTime: 'Today, 11:30 AM',
    dueCategory: 'Today',
    priority: 'High',
    notes: 'Follow up on the pool villa quotation sent yesterday. Address private plunge pool heating query.',
    status: 'Pending',
    assignedTo: 'Kavita Iyer (Sales)',
  },
  {
    id: 'FLP-102',
    guestName: 'Ananya Deshmukh',
    phone: '+91 97665 44332',
    channel: 'WhatsApp',
    scheduledTime: 'Yesterday, 04:00 PM',
    dueCategory: 'Overdue',
    priority: 'High',
    notes: 'Send luxury suite brochure with complimentary breakfast inclusions.',
    status: 'Pending',
    assignedTo: 'Vikram Singh',
  },
  {
    id: 'FLP-103',
    guestName: 'Mehta Destination Wedding Group',
    phone: '+91 98110 99887',
    channel: 'Phone Call',
    scheduledTime: 'Tomorrow, 03:00 PM',
    dueCategory: 'Upcoming',
    priority: 'High',
    notes: 'Call wedding planner regarding banquet menu tasting date and room buyout advance terms.',
    status: 'Pending',
    assignedTo: 'Rajvardhan Oberoi (Owner)',
  },
  {
    id: 'FLP-104',
    guestName: 'Rohan Mehra',
    phone: '+91 98330 22119',
    channel: 'WhatsApp',
    scheduledTime: 'Today, 02:15 PM',
    dueCategory: 'Today',
    priority: 'Medium',
    notes: 'Confirm airport luxury cab transfer requirements for Candolim arrival.',
    status: 'Completed',
    assignedTo: 'Front Desk Concierge',
  },
];

export const FollowUpsPage: React.FC = () => {
  const { currentResort } = useAuthStore();
  const [followUps, setFollowUps] = useState<FollowUpItem[]>(INITIAL_FOLLOWUPS);
  const [activeTab, setActiveTab] = useState<'all' | 'overdue' | 'today' | 'upcoming'>('all');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form State
  const [guestName, setGuestName] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [channel, setChannel] = useState<FollowUpItem['channel']>('Phone Call');
  const [scheduledTime, setScheduledTime] = useState('Today, 04:00 PM');
  const [priority, setPriority] = useState<FollowUpItem['priority']>('High');
  const [notes, setNotes] = useState('');

  const filtered = followUps.filter((f) => {
    if (activeTab === 'overdue' && f.dueCategory !== 'Overdue') return false;
    if (activeTab === 'today' && f.dueCategory !== 'Today') return false;
    if (activeTab === 'upcoming' && f.dueCategory !== 'Upcoming') return false;
    return true;
  });

  const handleMarkComplete = (id: string) => {
    setFollowUps((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: 'Completed' } : f))
    );
    toast.success('Follow-Up Completed', 'Status logged. Interaction archived.');
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !phone) return;

    const newItem: FollowUpItem = {
      id: `FLP-${Math.floor(105 + Math.random() * 90)}`,
      guestName,
      phone,
      channel,
      scheduledTime,
      dueCategory: scheduledTime.toLowerCase().includes('today')
        ? 'Today'
        : scheduledTime.toLowerCase().includes('yesterday')
        ? 'Overdue'
        : 'Upcoming',
      priority,
      notes: notes || 'General follow-up call.',
      status: 'Pending',
      assignedTo: 'Sales Duty Desk',
    };

    setFollowUps([newItem, ...followUps]);
    setIsAddOpen(false);
    toast.success('Follow-Up Scheduled', `Reminder set for ${guestName}`);
    setGuestName('');
    setNotes('');
  };

  const overdueCount = followUps.filter((f) => f.dueCategory === 'Overdue' && f.status === 'Pending').length;
  const todayCount = followUps.filter((f) => f.dueCategory === 'Today' && f.status === 'Pending').length;

  return (
    <div className="space-y-4 sm:space-y-5 text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F5132] flex items-center gap-2">
              <PhoneCall className="w-6 h-6 text-[#0F5132]" />
              <span>CRM Follow-Ups & Guest Contact Scheduler</span>
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200">
              {currentResort.name}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
            Scheduled outbound calls, WhatsApp quotation reminders, and lead nurturing.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsAddOpen(true)}
          leftIcon={<PlusCircle className="w-4 h-4" />}
        >
          Schedule Follow-Up
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs">
          <p className="text-[11px] font-semibold text-[#64748B]">Pending Tasks</p>
          <p className="text-xl sm:text-2xl font-extrabold text-[#0F172A] mt-1">
            {followUps.filter((f) => f.status === 'Pending').length}
          </p>
          <span className="text-[10px] text-[#64748B]">Total active reminders</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs">
          <p className="text-[11px] font-semibold text-rose-600">Overdue SLA</p>
          <p className="text-xl sm:text-2xl font-extrabold text-rose-700 mt-1">{overdueCount}</p>
          <span className="text-[10px] text-rose-600 font-medium">Immediate call required</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs">
          <p className="text-[11px] font-semibold text-amber-600">Due Today</p>
          <p className="text-xl sm:text-2xl font-extrabold text-amber-600 mt-1">{todayCount}</p>
          <span className="text-[10px] text-amber-600 font-medium">Scheduled for today</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs">
          <p className="text-[11px] font-semibold text-emerald-600">Completed</p>
          <p className="text-xl sm:text-2xl font-extrabold text-[#0F5132] mt-1">
            {followUps.filter((f) => f.status === 'Completed').length}
          </p>
          <span className="text-[10px] text-emerald-600 font-medium">Logged & resolved</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-2">
        {[
          { id: 'all', label: 'All Tasks', count: followUps.length },
          { id: 'overdue', label: 'Overdue SLA', count: overdueCount },
          { id: 'today', label: 'Due Today', count: todayCount },
          { id: 'upcoming', label: 'Upcoming', count: followUps.filter((f) => f.dueCategory === 'Upcoming').length },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              activeTab === tab.id
                ? 'bg-[#0F5132] text-white shadow-2xs'
                : 'bg-white hover:bg-slate-100 text-[#64748B] border border-[#E2E8F0]'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Follow-up Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`p-4 sm:p-5 rounded-2xl bg-white border shadow-2xs space-y-3 flex flex-col justify-between ${
              item.status === 'Completed' ? 'opacity-60 border-slate-200' : 'border-[#E2E8F0]'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#0F172A]">{item.guestName}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      item.priority === 'High'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {item.priority} Priority
                  </span>
                </div>

                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    item.status === 'Completed'
                      ? 'bg-emerald-50 text-[#0F5132]'
                      : item.dueCategory === 'Overdue'
                      ? 'bg-rose-50 text-rose-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {item.status === 'Completed' ? 'Completed' : item.scheduledTime}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-[#64748B]">
                <span className="flex items-center gap-1 font-semibold text-[#0F5132]">
                  <Phone className="w-3 h-3" /> {item.phone}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  {item.channel === 'WhatsApp' ? (
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
                  )}
                  {item.channel}
                </span>
              </div>

              <p className="text-xs text-[#334155] bg-[#F8FAFC] p-2.5 rounded-xl border border-slate-100">
                {item.notes}
              </p>
            </div>

            <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between gap-2 text-xs">
              <span className="text-[11px] text-[#64748B]">Assigned: {item.assignedTo}</span>

              <div className="flex items-center gap-2">
                {item.status !== 'Completed' && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleMarkComplete(item.id)}
                    leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                  >
                    Log Completed
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Schedule Follow-Up Reminder"
        description="Set reminder for telephone call, WhatsApp quote, or booking confirmation"
        maxWidth="md"
      >
        <form onSubmit={handleCreate} className="space-y-4 text-left">
          <Input
            label="Guest / Contact Name"
            placeholder="e.g. Vikramaditya Singhania"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Contact Phone"
              placeholder="+91 98000 11223"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <Select
              label="Contact Channel"
              value={channel}
              onChange={(e) => setChannel(e.target.value as any)}
              options={[
                { label: 'Direct Phone Call', value: 'Phone Call' },
                { label: 'WhatsApp Messenger', value: 'WhatsApp' },
                { label: 'Official Email', value: 'Email' },
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Scheduled Date / Time"
              placeholder="e.g. Today, 04:30 PM"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              required
            />
            <Select
              label="Priority Level"
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              options={[
                { label: 'High (VIP / Imminent Booking)', value: 'High' },
                { label: 'Medium (Standard Enquiry)', value: 'Medium' },
                { label: 'Low (General Info)', value: 'Low' },
              ]}
            />
          </div>

          <div>
            <label className="font-semibold text-xs text-[#334155] block mb-1">
              Discussion Notes & Key Points
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Guest requested discount on pool villa. Call with complimentary candle light dinner offer."
              className="w-full text-xs p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0F5132]"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="ghost" type="button" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" rightIcon={<Sparkles className="w-4 h-4" />}>
              Save Follow-Up
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
