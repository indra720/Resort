import React, { useState } from 'react';
import { toast } from '@/store/useToastStore';
import {
  LifeBuoy,
  Search,
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building2,
  X,
  Send,
} from 'lucide-react';

interface SupportTicket {
  id: string;
  resortName: string;
  resortCode: string;
  subject: string;
  category: 'Billing & Invoice' | 'Hardware/KOT Printer' | 'Channel Manager Sync' | 'Staff Role Access';
  priority: 'Urgent' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved';
  submittedBy: string;
  createdAt: string;
  lastReply: string;
}

const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'TCK-1001',
    resortName: 'Joy Resorts - Lakeview Sanctuary',
    resortCode: 'JOY-UDR',
    subject: 'MakeMyTrip OTA API double-booking sync failure investigation',
    category: 'Channel Manager Sync',
    priority: 'Urgent',
    status: 'In Progress',
    submittedBy: 'Ananya Sharma (Manager)',
    createdAt: 'Today, 09:30 AM',
    lastReply: 'Engineering analyzing webhook payloads',
  },
  {
    id: 'TCK-1002',
    resortName: 'Joy Resorts - Pine Heritage Estate',
    resortCode: 'JOY-SHM',
    subject: 'Request GST credit note for annual subscription discount',
    category: 'Billing & Invoice',
    priority: 'Medium',
    status: 'Open',
    submittedBy: 'Rohit Verma (Owner)',
    createdAt: 'Yesterday, 03:15 PM',
    lastReply: 'Pending finance review',
  },
  {
    id: 'TCK-1003',
    resortName: 'Joy Resorts - Emerald Backwaters',
    resortCode: 'JOY-KMR',
    subject: 'Thermal KOT printer IP configuration reset after power surge',
    category: 'Hardware/KOT Printer',
    priority: 'High',
    status: 'Resolved',
    submittedBy: 'Chef Sanjeev Nair',
    createdAt: '08 Oct 2026',
    lastReply: 'Resolved via static IP reassignment',
  },
  {
    id: 'TCK-1004',
    resortName: 'Joy Resorts - Beachfront Dunes',
    resortCode: 'JOY-GOA',
    subject: 'Add 2 additional receptionist user logins under Pro quota',
    category: 'Staff Role Access',
    priority: 'Low',
    status: 'Resolved',
    submittedBy: 'Anthony Fernandes (Owner)',
    createdAt: '05 Oct 2026',
    lastReply: 'User logins created and credentials dispatched',
  },
];

export const AdminSupportTicketsPage: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Open' | 'In Progress' | 'Resolved'>('All');
  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);
  const [replyMessage, setReplyMessage] = useState('');

  const filtered = tickets.filter((t) => {
    if (statusFilter !== 'All' && t.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        t.subject.toLowerCase().includes(q) ||
        t.resortName.toLowerCase().includes(q) ||
        t.resortCode.toLowerCase().includes(q) ||
        t.submittedBy.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim() || !activeTicket) return;

    setTickets((prev) =>
      prev.map((t) =>
        t.id === activeTicket.id
          ? { ...t, status: 'In Progress', lastReply: replyMessage.trim() }
          : t
      )
    );
    toast.success(`Dispatched support reply to ${activeTicket.resortName}`);
    setActiveTicket(null);
    setReplyMessage('');
  };

  const handleMarkResolved = (id: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'Resolved' } : t))
    );
    toast.success('Ticket marked as resolved.');
  };

  return (
    <div className="space-y-4 text-[#111827]">
      {/* Header Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-2xs bg-white">
        <div className="relative h-54 w-full overflow-hidden flex flex-col justify-between p-4 sm:p-6">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80"
            alt="Support Desk"
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.96]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-transparent" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <div className="flex flex-col lg:flex-row items-center gap-2">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#0F5132]/10 text-[#0F5132] uppercase tracking-wider">
                  Platform Operations Desk
                </span>
                <span className="text-xs text-[#64748B]">Multi-Tenant Help</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A] mt-1">
                Tenant Support & SLA Escalations
              </h1>
              <p className="text-xs sm:text-sm text-[#475569] font-medium mt-0.5">
                Centralized ticketing for hardware integration, billing inquiries, and channel sync issues
              </p>
            </div>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="p-3 sm:p-4 bg-white/95 backdrop-blur-md border-t border-[#E2E8F0]">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3.5">
            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 rounded-xl bg-[#DC2626] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full shrink-0">
                  Active
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B]">Open & In Progress</p>
                <div className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5">
                  {tickets.filter((t) => t.status !== 'Resolved').length} Tickets
                </div>
                <p className="text-[10px] text-[#DC2626] mt-0.5">Under SLA response limit</p>
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 rounded-xl bg-[#22C55E] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-semibold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full shrink-0">
                  Resolved
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B]">Resolved This Week</p>
                <div className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5">
                  {tickets.filter((t) => t.status === 'Resolved').length}
                </div>
                <p className="text-[10px] text-[#16A34A] mt-0.5">Avg resolution: 2.4 hrs</p>
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 rounded-xl bg-[#3B82F6] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full shrink-0">
                  Speed
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B]">First Response Time</p>
                <div className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5">
                  18 Minutes
                </div>
                <p className="text-[10px] text-[#2563EB] mt-0.5">Enterprise 24/7 desk</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#E2E8F0] shadow-2xs">
        <div className="flex-1 min-w-[220px] max-w-md relative">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tickets by property, subject, contact..."
            className="w-full h-9 pl-9 pr-3 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30"
          />
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-2">
          {(['All', 'Open', 'In Progress', 'Resolved'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`h-8 px-3 rounded-xl text-xs font-semibold transition-colors ${
                statusFilter === st
                  ? 'bg-[#0F5132] text-white shadow-2xs'
                  : 'bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-[#E2E8F0] flex flex-col md:flex-row items-center justify-between">
          <h3 className="text-base font-bold text-[#0F172A]">Tenant Inquiries & Issues</h3>
          <span className="text-xs text-[#64748B]">{filtered.length} tickets matching</span>
        </div>

        {/* Compact Mobile / Tablet Swipe Notice */}
        <div className="lg:hidden flex items-center justify-between gap-2 px-3 sm:px-4 py-1.5 bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] text-[#475569]">
          <span className="flex items-center gap-1.5 font-medium min-w-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0F5132] animate-pulse shrink-0" />
            <span className="truncate">Swipe horizontally to see all columns</span>
          </span>
          <span className="text-[10px] font-bold text-[#0F5132] bg-emerald-50/80 px-2 py-0.5 rounded border border-emerald-200 whitespace-nowrap shrink-0">
            ↔ Swipe
          </span>
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[900px] text-left text-xs text-[#1E293B] border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-semibold whitespace-nowrap">
                <th className="py-3.5 px-4 min-w-[120px]">Ticket #</th>
                <th className="py-3.5 px-4 min-w-[200px]">Resort Tenant</th>
                <th className="py-3.5 px-4 min-w-[280px]">Subject & Details</th>
                <th className="py-3.5 px-4 min-w-[140px]">Category</th>
                <th className="py-3.5 px-4 min-w-[100px]">Priority</th>
                <th className="py-3.5 px-4 min-w-[110px]">Status</th>
                <th className="py-3.5 px-4 text-right min-w-[150px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#0F5132] whitespace-nowrap">
                    {t.id}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div>
                      <p className="font-bold text-[#0F172A]">{t.resortName}</p>
                      <p className="text-[11px] text-[#64748B]">By {t.submittedBy}</p>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-[#0F172A]">{t.subject}</p>
                    <p className="text-[11px] text-[#64748B] mt-0.5 truncate max-w-sm">
                      Latest: {t.lastReply}
                    </p>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap text-[#475569]">
                    {t.category}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        t.priority === 'Urgent'
                          ? 'bg-rose-100 text-rose-700'
                          : t.priority === 'High'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {t.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-semibold text-[11px] border ${
                        t.status === 'Resolved'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : t.status === 'In Progress'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setActiveTicket(t)}
                        className="px-2.5 py-1 rounded-xl bg-[#0F5132]/10 hover:bg-[#0F5132] text-[#0F5132] hover:text-white font-semibold text-xs transition-colors"
                      >
                        Reply
                      </button>
                      {t.status !== 'Resolved' && (
                        <button
                          type="button"
                          onClick={() => handleMarkResolved(t.id)}
                          className="px-2 py-1 rounded-xl hover:bg-[#DCFCE7] text-[#16A34A] text-xs font-semibold"
                          title="Mark Resolved"
                        >
                          ✓
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reply Modal */}
      {activeTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl border border-[#E2E8F0] space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">Reply to {activeTicket.id}</h3>
                <p className="text-xs text-[#64748B]">{activeTicket.resortName}</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTicket(null)}
                className="w-8 h-8 rounded-full hover:bg-[#F1F5F9] flex items-center justify-center text-[#64748B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#F8FAFC] p-3 rounded-2xl border border-[#E2E8F0] space-y-1">
              <p className="font-bold text-[#0F172A]">{activeTicket.subject}</p>
              <p className="text-[11px] text-[#64748B]">Submitted by {activeTicket.submittedBy}</p>
            </div>

            <form onSubmit={handleSendReply} className="space-y-3">
              <div>
                <label className="block font-semibold text-[#1E293B] mb-1">Your Support Message / Fix:</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide resolution steps or status update..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="w-full p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setActiveTicket(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#0F5132] hover:bg-[#0B3D25] text-white shadow-2xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Dispatch Reply</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
