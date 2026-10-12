import React, { useState, useEffect, useMemo } from 'react';
import {
  PhoneCall,
  MessageCircle,
  CalendarCheck,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Plus,
  ArrowRight,
  User,
  Filter,
  Check,
  Flame,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import {
  getFollowUps,
  getFollowUpCounts,
  completeFollowUp,
  createFollowUp,
  rescheduleFollowUp,
} from '@/api/followups';
import { getLeads } from '@/api/leads';
import { LeadFollowUp, Lead } from '@/types/crm';
import { toast } from '@/store/useToastStore';
import { SiteVisitModal } from '@/features/leads/SiteVisitModal';
import { LeadDetailDrawer } from '@/features/leads/LeadDetailDrawer';

export const FollowUpsPage: React.FC = () => {
  const { currentResort, user, role } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'all' | 'today' | 'overdue' | 'upcoming' | 'done'>('today');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [followUps, setFollowUps] = useState<LeadFollowUp[]>([]);
  const [counts, setCounts] = useState({ all: 0, today: 0, overdue: 0, upcoming: 0, done: 0 });
  const [leads, setLeads] = useState<Lead[]>([]);

  // Modals & Scheduling
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isSiteVisitOpen, setIsSiteVisitOpen] = useState(false);
  const [selectedLeadForAction, setSelectedLeadForAction] = useState<Lead | null>(null);

  // New Follow-Up Form State
  const [selectedLeadId, setSelectedLeadId] = useState('');
  const [channel, setChannel] = useState<LeadFollowUp['channel']>('call');
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueTime, setDueTime] = useState('11:00 AM');
  const [assignedTo, setAssignedTo] = useState('Sameer Verma');
  const [notes, setNotes] = useState('');

  // Calendar Date State
  const [calendarMonthOffset, setCalendarMonthOffset] = useState(0);

  const loadData = () => {
    const list = getFollowUps(currentResort.id, user, activeTab);
    setFollowUps(list);
    setCounts(getFollowUpCounts(currentResort.id, user));
    const allLeads = getLeads(currentResort.id, user);
    setLeads(allLeads);
    if (allLeads.length > 0 && !selectedLeadId) {
      setSelectedLeadId(allLeads[0].id);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentResort.id, user, role, activeTab]);

  const handleMarkDone = (id: string) => {
    completeFollowUp(id, currentResort.id, user);
    toast.success('Follow-Up Done', 'Reminder marked completed & logged to timeline.');
    loadData();
  };

  const handleCreateFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeadId || !title) {
      toast.error('Validation Error', 'Please choose a lead and provide a task title.');
      return;
    }

    createFollowUp(
      {
        lead_id: selectedLeadId,
        title,
        channel,
        scheduled_at: `${dueDate}, ${dueTime}`,
        due_date: dueDate,
        due_time: dueTime,
        assigned_to: assignedTo,
        notes,
        priority: 'High',
      },
      currentResort.id,
      user
    );

    toast.success('Follow-Up Scheduled', `Reminder set for ${dueDate} at ${dueTime}.`);
    setIsScheduleOpen(false);
    setTitle('');
    setNotes('');
    loadData();
  };

  // Calendar View Days Matrix
  const calendarDays = useMemo(() => {
    const today = new Date();
    const currentMonth = new Date(today.getFullYear(), today.getMonth() + calendarMonthOffset, 1);
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const firstDayIndex = currentMonth.getDay();

    const days: { dateStr: string; dayNum: number; isCurrentMonth: boolean }[] = [];

    // Empty lead slots before day 1
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ dateStr: '', dayNum: 0, isCurrentMonth: false });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(
        2,
        '0'
      )}-${String(d).padStart(2, '0')}`;
      days.push({ dateStr, dayNum: d, isCurrentMonth: true });
    }

    return { monthName: currentMonth.toLocaleString('en-IN', { month: 'long', year: 'numeric' }), days };
  }, [calendarMonthOffset]);

  const allResortFollowUps = useMemo(() => {
    return getFollowUps(currentResort.id, user, 'all');
  }, [currentResort.id, user, followUps]);

  return (
    <div className="space-y-4 text-left text-[#0F172A]">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#0F172A] flex items-center gap-2">
              <PhoneCall className="w-6 h-6 text-[#0F5132]" />
              <span>Sales Follow-Up Scheduler</span>
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#0F5132] font-semibold border border-emerald-200">
              {currentResort.name}
            </span>
            {counts.overdue > 0 && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold border border-rose-200 flex items-center gap-1 animate-pulse">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{counts.overdue} Overdue</span>
              </span>
            )}
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Never lose an inquiry: Schedule calls, WhatsApp touches, site inspections, and client proposals.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {/* View Switcher */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#CBD5E1]">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                viewMode === 'list' ? 'bg-[#0F5132] text-white shadow-2xs' : 'text-[#64748B]'
              }`}
            >
              List View
            </button>
            <button
              type="button"
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                viewMode === 'calendar' ? 'bg-[#0F5132] text-white shadow-2xs' : 'text-[#64748B]'
              }`}
            >
              Calendar View
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsScheduleOpen(true)}
            className="h-9 px-3.5 bg-[#0F5132] hover:bg-[#0B3D25] text-white rounded-xl text-xs font-bold shadow-2xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Follow-Up</span>
          </button>
        </div>
      </div>

      {/* Tabs Row with Real-Time Badges */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-1.5 sm:p-2 shadow-2xs flex items-center gap-1 overflow-x-auto scrollbar-thin">
        {[
          { id: 'today', label: 'Today', count: counts.today, badgeColor: 'bg-amber-100 text-amber-800' },
          { id: 'overdue', label: 'Overdue', count: counts.overdue, badgeColor: 'bg-rose-100 text-rose-800 font-bold' },
          { id: 'upcoming', label: 'Upcoming', count: counts.upcoming, badgeColor: 'bg-blue-100 text-blue-800' },
          { id: 'done', label: 'Completed (Done)', count: counts.done, badgeColor: 'bg-emerald-100 text-emerald-800' },
          { id: 'all', label: 'All Tasks', count: counts.all, badgeColor: 'bg-slate-100 text-slate-800' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#0F5132] text-white shadow-2xs'
                : 'text-[#475569] hover:bg-[#F8FAFC]'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === tab.id ? 'bg-white/20 text-white' : tab.badgeColor
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* VIEW 1: LIST VIEW */}
      {viewMode === 'list' ? (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
          {followUps.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#0F5132] border border-emerald-200 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#0F172A]">All Clear! No Tasks In This View</h3>
              <p className="text-xs text-[#64748B] max-w-sm mx-auto">
                No reminders due for {activeTab}. Click &quot;Schedule Follow-Up&quot; to queue customer touchpoints.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#E2E8F0]">
              {followUps.map((f) => (
                <div
                  key={f.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#F8FAFC] transition-colors"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    {/* Channel Icon */}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                        f.channel === 'call'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : f.channel === 'whatsapp'
                          ? 'bg-[#25D366]/10 text-[#075E54] border-[#25D366]/30'
                          : f.channel === 'site_visit'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                    >
                      {f.channel === 'call' && <PhoneCall className="w-5 h-5" />}
                      {f.channel === 'whatsapp' && <MessageCircle className="w-5 h-5" />}
                      {f.channel === 'site_visit' && <MapPin className="w-5 h-5" />}
                      {f.channel === 'email' && <Mail className="w-5 h-5" />}
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-[#0F172A]">{f.title}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.2 rounded-full uppercase border ${
                            f.due_category === 'overdue'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : f.due_category === 'today'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : f.due_category === 'done'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}
                        >
                          {f.due_category}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-[#64748B] flex-wrap">
                        <span className="font-semibold text-[#0F172A]">{f.lead_name}</span>
                        <span>•</span>
                        <span>{f.lead_phone}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-semibold text-[#334155]">
                          <Clock className="w-3 h-3" /> {f.scheduled_at}
                        </span>
                        <span>•</span>
                        <span className="text-[#0F5132] font-medium">Assigned: {f.assigned_to}</span>
                      </div>

                      {f.notes && (
                        <p className="text-xs text-[#475569] bg-[#F8FAFC] p-2 rounded-lg border border-[#E2E8F0] mt-1">
                          {f.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                    <a
                      href={`tel:${f.lead_phone}`}
                      className="p-2 rounded-lg bg-white border border-[#CBD5E1] text-[#334155] hover:text-[#0F5132]"
                      title="Call Phone"
                    >
                      <PhoneCall className="w-4 h-4" />
                    </a>
                    <a
                      href={`https://wa.me/91${(f.lead_phone || '').replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg bg-[#25D366]/10 border border-[#25D366]/30 text-[#075E54] hover:bg-[#25D366]/20"
                      title="WhatsApp Touch"
                    >
                      <MessageCircle className="w-4 h-4 text-[#25D366]" />
                    </a>

                    {f.status !== 'completed' ? (
                      <button
                        type="button"
                        onClick={() => handleMarkDone(f.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-[#0F5132] hover:bg-[#0B3D25] text-white font-bold text-xs shadow-2xs flex items-center gap-1.5 transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Mark Done</span>
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Done
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* VIEW 2: CALENDAR VIEW */
        <div className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#0F5132]" />
              <span>{calendarDays.monthName}</span>
            </h2>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCalendarMonthOffset((m) => m - 1)}
                className="p-1.5 rounded-lg border border-[#CBD5E1] hover:bg-[#F1F5F9]"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setCalendarMonthOffset(0)}
                className="px-2.5 py-1 rounded-lg border border-[#CBD5E1] text-xs font-semibold hover:bg-[#F1F5F9]"
              >
                Current Month
              </button>
              <button
                type="button"
                onClick={() => setCalendarMonthOffset((m) => m + 1)}
                className="p-1.5 rounded-lg border border-[#CBD5E1] hover:bg-[#F1F5F9]"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 text-xs">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center font-bold text-[#64748B] py-1 border-b border-[#E2E8F0]">
                {day}
              </div>
            ))}

            {calendarDays.days.map((slot, i) => {
              if (!slot.isCurrentMonth) {
                return <div key={i} className="min-h-24 bg-[#F8FAFC]/50 rounded-xl" />;
              }

              const dayFollowUps = allResortFollowUps.filter((f) => f.due_date === slot.dateStr);

              return (
                <div
                  key={i}
                  className="min-h-24 p-1.5 rounded-xl border border-[#E2E8F0] bg-white hover:border-[#0F5132]/30 flex flex-col justify-between"
                >
                  <div className="flex justify-between items-center text-[11px] font-bold text-[#475569]">
                    <span>{slot.dayNum}</span>
                    {dayFollowUps.length > 0 && (
                      <span className="w-4 h-4 rounded-full bg-[#0F5132] text-white flex items-center justify-center text-[9px]">
                        {dayFollowUps.length}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 overflow-y-auto max-h-16 scrollbar-thin">
                    {dayFollowUps.map((f) => (
                      <div
                        key={f.id}
                        className={`p-1 rounded text-[10px] truncate font-medium border ${
                          f.status === 'completed'
                            ? 'bg-slate-50 text-slate-500 border-slate-200 line-through'
                            : f.channel === 'call'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : f.channel === 'site_visit'
                            ? 'bg-purple-50 text-purple-800 border-purple-200'
                            : 'bg-blue-50 text-blue-800 border-blue-200'
                        }`}
                        title={`${f.title} (${f.scheduled_at})`}
                      >
                        {f.lead_name}: {f.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Schedule Follow-up Modal */}
      {isScheduleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-lg p-5 sm:p-6 shadow-2xl border border-[#E2E8F0] my-auto text-left text-xs text-[#0F172A] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3 mb-4">
              <h2 className="text-base font-bold text-[#0F172A]">Schedule Sales Follow-Up</h2>
              <button
                type="button"
                onClick={() => setIsScheduleOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-[#F1F5F9] flex items-center justify-center text-[#64748B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFollowUp} className="space-y-3.5">
              <div>
                <label className="block font-semibold text-[#1E293B] mb-1">Select Guest Lead *</label>
                <select
                  required
                  value={selectedLeadId}
                  onChange={(e) => setSelectedLeadId(e.target.value)}
                  className="w-full h-9 px-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs font-medium focus:outline-none"
                >
                  {leads.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.lead_code}: {l.name} ({l.phone}) - {l.interested_in}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#1E293B] mb-1">Follow-Up Action Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Call to discuss wedding catering menu tasting"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full h-9 px-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1E293B] mb-1">Touch Channel *</label>
                  <select
                    value={channel}
                    onChange={(e) => setChannel(e.target.value as any)}
                    className="w-full h-9 px-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs font-medium focus:outline-none"
                  >
                    <option value="call">Phone Call</option>
                    <option value="whatsapp">WhatsApp Message</option>
                    <option value="site_visit">Site Visit Tour</option>
                    <option value="email">Email Proposal</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#1E293B] mb-1">Assigned Executive *</label>
                  <select
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full h-9 px-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs font-medium focus:outline-none"
                  >
                    <option value="Sameer Verma">Sameer Verma (Sales Executive)</option>
                    <option value="Amit Singh">Amit Singh</option>
                    <option value="Neha Gupta">Neha Gupta</option>
                    <option value="Rohit Kumar">Rohit Kumar</option>
                    <option value="Pooja Soni">Pooja Soni</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1E293B] mb-1">Due Date *</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full h-9 px-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1E293B] mb-1">Due Time *</label>
                  <input
                    type="text"
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                    placeholder="11:30 AM"
                    className="w-full h-9 px-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#1E293B] mb-1">Task Memo / Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Points to discuss, special package discounts, or villa pictures..."
                  className="w-full p-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setIsScheduleOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#0F5132] hover:bg-[#0B3D25] text-white shadow-2xs"
                >
                  Confirm Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
