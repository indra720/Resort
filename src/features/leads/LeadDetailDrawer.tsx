import React, { useState, useEffect } from 'react';
import {
  X,
  Phone,
  MessageCircle,
  Mail,
  Calendar,
  CalendarCheck,
  CheckCircle2,
  Clock,
  User,
  MapPin,
  Tag,
  DollarSign,
  Flame,
  Snowflake,
  Zap,
  ArrowRight,
  FileText,
  Plus,
  Send,
  AlertCircle,
  Sparkles,
  FileSpreadsheet,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Lead, LeadActivity, LeadNote, LeadFollowUp, Quotation, MessageTemplate } from '@/types/crm';
import { useAuthStore } from '@/store/useAuthStore';
import { formatINR } from '@/lib/formatINR';
import { toast } from '@/store/useToastStore';
import {
  getLeadActivities,
  getLeadNotes,
  addLeadNote,
  getLeadFollowUps,
  completeLeadFollowUp,
  addLeadActivity,
} from '@/api/leads';
import { getQuotations } from '@/api/quotations';
import { getTemplates, sendTemplateToLead, interpolateTemplate } from '@/api/templates';
import { computeLeadScore, computeLeadSLA } from '@/api/scoring';
import { canUse } from '@/lib/permissions';
import { QuotationBuilderModal } from '@/features/crm/QuotationBuilderModal';
import { QuotationPreviewModal } from '@/features/crm/QuotationPreviewModal';

export interface LeadDetailDrawerProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onConvertToBooking: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onRefresh: () => void;
  onScheduleSiteVisit?: (lead: Lead) => void;
}

export const LeadDetailDrawer: React.FC<LeadDetailDrawerProps> = ({
  lead,
  isOpen,
  onClose,
  onConvertToBooking,
  onEdit,
  onRefresh,
  onScheduleSiteVisit,
}) => {
  const { user, currentResort, role } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'notes' | 'documents'>('overview');
  const [activities, setActivities] = useState<LeadActivity[]>([]);
  const [notes, setNotes] = useState<LeadNote[]>([]);
  const [followUps, setFollowUps] = useState<LeadFollowUp[]>([]);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  // Phase 3 Advanced Sales State
  const [showScoreBreakdown, setShowScoreBreakdown] = useState(false);
  const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false);
  const [previewQuotation, setPreviewQuotation] = useState<Quotation | null>(null);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [leadQuotations, setLeadQuotations] = useState<Quotation[]>([]);

  // Load activities, notes, followups, quotations, and templates
  useEffect(() => {
    if (lead && isOpen) {
      setActivities(getLeadActivities(lead.id, currentResort.id));
      setNotes(getLeadNotes(lead.id, currentResort.id));
      setFollowUps(getLeadFollowUps(lead.id, currentResort.id));
      const quots = getQuotations(currentResort.id, user).filter((q) => q.lead_id === lead.id);
      setLeadQuotations(quots);
      const tList = getTemplates(currentResort.id);
      setTemplates(tList);
      if (tList.length > 0) setSelectedTemplateId(tList[0].id);
    }
  }, [lead, isOpen, currentResort.id, user]);

  const refreshLeadData = () => {
    if (!lead) return;
    setActivities(getLeadActivities(lead.id, currentResort.id));
    setLeadQuotations(getQuotations(currentResort.id, user).filter((q) => q.lead_id === lead.id));
    onRefresh();
  };

  if (!isOpen || !lead) return null;

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;

    setIsSubmittingNote(true);
    addLeadNote(lead.id, currentResort.id, newNoteContent.trim(), user);
    setNewNoteContent('');
    setNotes(getLeadNotes(lead.id, currentResort.id));
    setActivities(getLeadActivities(lead.id, currentResort.id));
    setIsSubmittingNote(false);
    toast.success('Note Added', 'Note saved to lead timeline.');
    onRefresh();
  };

  const handleMarkFollowUpDone = (flpId: string) => {
    completeLeadFollowUp(flpId, currentResort.id, user);
    setFollowUps(getLeadFollowUps(lead.id, currentResort.id));
    setActivities(getLeadActivities(lead.id, currentResort.id));
    toast.success('Follow-up Marked Done', 'Reminder archived.');
    onRefresh();
  };

  const handleQuickLog = (type: 'call' | 'whatsapp') => {
    addLeadActivity(lead.id, currentResort.id, {
      actor_name: user?.name || 'Sales Staff',
      actor_role: role,
      type,
      title: type === 'call' ? 'Sales Call Logged' : 'WhatsApp Message Sent',
      description: `Reached out to ${lead.name} regarding ${lead.interested_in} requirements.`,
    });
    setActivities(getLeadActivities(lead.id, currentResort.id));
    toast.success(`${type === 'call' ? 'Call' : 'WhatsApp'} Logged`, 'Interaction recorded on lead timeline.');
    onRefresh();
  };

  const cleanPhone = lead.phone.replace(/\D/g, '');
  const waUrl = `https://wa.me/91${cleanPhone.length > 10 ? cleanPhone.slice(-10) : cleanPhone}?text=${encodeURIComponent(
    `Hello ${lead.name}, greetings from ${currentResort.name}! We received your inquiry for ${lead.interested_in}. How can we assist you with your booking?`
  )}`;

  const scoreBreakdown = lead ? computeLeadScore(lead, activities) : null;
  const slaStatus = lead ? computeLeadSLA(lead) : null;

  const handleSendTemplate = () => {
    if (!lead || !selectedTemplateId) return;
    const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);
    if (!selectedTemplate) return;

    const res = sendTemplateToLead(lead.id, selectedTemplateId, currentResort.id, currentResort.name, user);
    if (res.success) {
      toast.success('Template Dispatched', `Sent "${selectedTemplate.name}" to ${lead.name}`);
      setIsTemplateModalOpen(false);
      refreshLeadData();

      if (selectedTemplate.channel === 'whatsapp') {
        const cleanP = lead.phone.replace(/\D/g, '');
        const url = `https://wa.me/91${cleanP.length > 10 ? cleanP.slice(-10) : cleanP}?text=${encodeURIComponent(
          res.renderedMessage || ''
        )}`;
        window.open(url, '_blank');
      }
    } else {
      toast.error('Dispatch Failed', res.error || 'Could not send template.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end">
      {/* Drawer Container: Full-screen on mobile, 480px on desktop */}
      <div className="w-full sm:max-w-xl md:max-w-2xl bg-white h-full shadow-2xl flex flex-col text-left overflow-hidden border-l border-[#E2E8F0] animate-in slide-in-from-right duration-250">
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              {lead.avatar ? (
                <img
                  src={lead.avatar}
                  alt={lead.name}
                  className="w-12 h-12 rounded-2xl object-cover border border-[#CBD5E1] shrink-0"
                />
              ) : (
                <div
                  className={`w-12 h-12 rounded-2xl ${
                    lead.initials_bg || 'bg-[#0F5132]'
                  } text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs`}
                >
                  {lead.initials || lead.name.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-bold text-[#0F172A] truncate">{lead.name}</h2>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-white border border-[#CBD5E1] text-[#475569]">
                    {lead.lead_code}
                  </span>
                  {scoreBreakdown && (
                    <button
                      type="button"
                      onClick={() => setShowScoreBreakdown(!showScoreBreakdown)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 transition-all cursor-pointer ${
                        scoreBreakdown.rating === 'Hot'
                          ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                          : scoreBreakdown.rating === 'Warm'
                          ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                          : 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100'
                      }`}
                      title="Click to view AI lead score factor breakdown"
                    >
                      {scoreBreakdown.rating === 'Hot' && <Flame className="w-3 h-3 text-rose-600 fill-rose-600" />}
                      {scoreBreakdown.rating === 'Warm' && <Zap className="w-3 h-3 text-amber-600" />}
                      {scoreBreakdown.rating === 'Cold' && <Snowflake className="w-3 h-3 text-sky-600" />}
                      <span>{scoreBreakdown.rating} ({scoreBreakdown.totalScore}/100)</span>
                      <Info className="w-2.5 h-2.5 opacity-60" />
                    </button>
                  )}

                  {slaStatus && lead.status === 'New' && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                        slaStatus.status === 'breached'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : slaStatus.status === 'warning'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                      title={slaStatus.label}
                    >
                      {slaStatus.status === 'breached' && <AlertTriangle className="w-3 h-3 text-rose-600" />}
                      {slaStatus.status === 'warning' && <Clock className="w-3 h-3 text-amber-600" />}
                      {slaStatus.status === 'ok' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                      <span>{slaStatus.label}</span>
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#64748B] mt-0.5 flex items-center gap-1.5 flex-wrap">
                  <span>{lead.city}</span>
                  <span>•</span>
                  <span>Source: {lead.source}</span>
                  <span>•</span>
                  <span className="font-semibold text-[#0F5132]">{lead.interested_in}</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0] transition-colors shrink-0"
              aria-label="Close details"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Interactive Score Breakdown Card */}
          {showScoreBreakdown && scoreBreakdown && (
            <div className="mt-3 p-3 bg-white border border-[#CBD5E1] rounded-2xl shadow-xs text-xs space-y-2 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-1.5">
                <div className="flex items-center gap-1.5 font-bold text-[#0F172A]">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>AI Lead Quality Breakdown ({scoreBreakdown.totalScore}/100)</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowScoreBreakdown(false)}
                  className="text-[11px] text-[#64748B] hover:text-[#0F172A]"
                >
                  Close
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {scoreBreakdown.factors.map((f, idx) => (
                  <div key={idx} className="p-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-[#0F172A]">{f.factor}</span>
                      <span className="font-bold text-[#0F5132]">+{f.score} / {f.maxScore} pts</span>
                    </div>
                    <p className="text-[10px] text-[#64748B] mt-0.5">{f.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Row & Convert to Booking Button */}
          <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <a
                href={`tel:${lead.phone}`}
                onClick={() => handleQuickLog('call')}
                className="h-8 px-2.5 rounded-lg bg-white border border-[#CBD5E1] text-xs font-semibold text-[#334155] hover:bg-[#F1F5F9] flex items-center gap-1.5 transition-colors"
                title="Call Guest"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>Call</span>
              </a>
              <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => handleQuickLog('whatsapp')}
                className="h-8 px-2.5 rounded-lg bg-[#25D366]/10 border border-[#25D366]/30 text-xs font-semibold text-[#075E54] hover:bg-[#25D366]/20 flex items-center gap-1.5 transition-colors"
                title="Chat on WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                <span>WhatsApp</span>
              </a>
              <a
                href={`mailto:${lead.email}`}
                className="h-8 px-2.5 rounded-lg bg-white border border-[#CBD5E1] text-xs font-semibold text-[#334155] hover:bg-[#F1F5F9] flex items-center gap-1.5 transition-colors"
                title="Send Email"
              >
                <Mail className="w-3.5 h-3.5 text-blue-600" />
                <span>Email</span>
              </a>

              {/* Phase 3: Create Quotation Button */}
              {canUse(currentResort, 'quotations') && (
                <button
                  type="button"
                  onClick={() => setIsQuotationModalOpen(true)}
                  className="h-8 px-2.5 rounded-lg bg-amber-50 border border-amber-300 text-xs font-semibold text-amber-900 hover:bg-amber-100 flex items-center gap-1.5 transition-colors"
                  title="Create Custom Price Proposal"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-amber-700" />
                  <span>Quotation</span>
                </button>
              )}

              {/* Phase 3: Send Template Button */}
              {canUse(currentResort, 'templates') && (
                <button
                  type="button"
                  onClick={() => setIsTemplateModalOpen(true)}
                  className="h-8 px-2.5 rounded-lg bg-indigo-50 border border-indigo-300 text-xs font-semibold text-indigo-900 hover:bg-indigo-100 flex items-center gap-1.5 transition-colors"
                  title="Send Message Template"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-700" />
                  <span>Template</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => onEdit(lead)}
                className="h-8 px-2.5 rounded-lg bg-white border border-[#CBD5E1] text-xs font-semibold text-[#334155] hover:bg-[#F1F5F9] transition-colors"
              >
                Edit
              </button>
              {onScheduleSiteVisit && lead.status !== 'Booked' && (
                <button
                  type="button"
                  onClick={() => onScheduleSiteVisit(lead)}
                  className="h-8 px-2.5 rounded-lg bg-emerald-50 border border-emerald-300 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 flex items-center gap-1.5 transition-colors"
                  title="Schedule Guided Site Inspection"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Site Visit</span>
                </button>
              )}
            </div>

            {lead.status !== 'Booked' ? (
              <button
                type="button"
                onClick={() => onConvertToBooking(lead)}
                className="h-8 px-3.5 rounded-lg bg-[#0F5132] hover:bg-[#0B3D25] text-white text-xs font-bold shadow-2xs flex items-center gap-1.5 transition-colors"
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>Convert to Booking</span>
              </button>
            ) : (
              <span className="h-8 px-3 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Booked</span>
              </span>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-[#CBD5E1] mt-3 -mb-4 gap-4 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`pb-2.5 border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-[#0F5132] text-[#0F5132] font-bold'
                  : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('activity')}
              className={`pb-2.5 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'activity'
                  ? 'border-[#0F5132] text-[#0F5132] font-bold'
                  : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <span>Activity</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 font-bold">
                {activities.length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('notes')}
              className={`pb-2.5 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'notes'
                  ? 'border-[#0F5132] text-[#0F5132] font-bold'
                  : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <span>Notes</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 font-bold">
                {notes.length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('documents')}
              className={`pb-2.5 border-b-2 transition-colors ${
                activeTab === 'documents'
                  ? 'border-[#0F5132] text-[#0F5132] font-bold'
                  : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Documents
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Follow-up reminder banner if exists */}
              {followUps.filter((f) => f.status === 'pending').length > 0 && (
                <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-[#0F172A] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-900 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-amber-600" /> Next Follow-Up Due
                    </span>
                    <span className="text-[11px] text-amber-800 font-semibold">
                      {followUps.find((f) => f.status === 'pending')?.scheduled_at}
                    </span>
                  </div>
                  <p className="text-xs text-amber-950 font-medium">
                    {followUps.find((f) => f.status === 'pending')?.title}
                  </p>
                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={() =>
                        handleMarkFollowUpDone(followUps.find((f) => f.status === 'pending')!.id)
                      }
                      className="px-2.5 py-1 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Mark Done</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Status & Priority Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[11px] font-semibold text-[#64748B] block">Current Status</span>
                  <span className="text-xs font-bold text-[#0F172A] mt-0.5 block">{lead.status}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[11px] font-semibold text-[#64748B] block">Priority</span>
                  <span className="text-xs font-bold text-[#0F172A] mt-0.5 block">{lead.priority}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[11px] font-semibold text-[#64748B] block">Lead Score</span>
                  <span className="text-xs font-bold text-[#0F5132] mt-0.5 block">{lead.score}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[11px] font-semibold text-[#64748B] block">Assigned Rep</span>
                  <span className="text-xs font-bold text-[#0F172A] mt-0.5 truncate block">
                    {lead.assigned_to}
                  </span>
                </div>
              </div>

              {/* Stay & Requirement Details */}
              <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-3">
                <h3 className="font-bold text-[#0F172A] text-xs uppercase tracking-wider text-[#64748B]">
                  Stay & Booking Requirement
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#64748B] block">Interested In</span>
                    <span className="font-semibold text-[#0F172A]">{lead.interested_in}</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] block">Preferred Date</span>
                    <span className="font-semibold text-[#0F172A]">{lead.preferred_date}</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] block">Guests</span>
                    <span className="font-semibold text-[#0F172A]">
                      {lead.guests_adults} Adults
                      {lead.guests_children > 0 ? `, ${lead.guests_children} Children` : ''}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#64748B] block">Budget (₹ INR)</span>
                    <span className="font-bold text-[#0F5132]">
                      {formatINR(lead.budget_min)} - {formatINR(lead.budget_max)}
                    </span>
                  </div>
                </div>

                {lead.remarks && (
                  <div className="pt-2 border-t border-[#F1F5F9]">
                    <span className="text-[#64748B] block mb-0.5">Remarks / Guest Preferences:</span>
                    <p className="text-[#1E293B] bg-[#F8FAFC] p-2.5 rounded-xl border border-[#E2E8F0] leading-relaxed">
                      {lead.remarks}
                    </p>
                  </div>
                )}
              </div>

              {/* Contact Information */}
              <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-2.5">
                <h3 className="font-bold text-[#0F172A] text-xs uppercase tracking-wider text-[#64748B]">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[#64748B] block">Phone</span>
                    <span className="font-semibold text-[#0F172A]">{lead.phone}</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] block">Email</span>
                    <span className="font-semibold text-[#0F172A]">{lead.email}</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] block">Location / City</span>
                    <span className="font-semibold text-[#0F172A]">{lead.city}</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] block">Lead Source</span>
                    <span className="font-semibold text-[#0F172A]">{lead.source}</span>
                  </div>
                </div>

                {lead.tags && lead.tags.length > 0 && (
                  <div className="pt-2 border-t border-[#F1F5F9]">
                    <span className="text-[#64748B] block mb-1">Tags:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {lead.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-semibold border border-emerald-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ACTIVITY TIMELINE */}
          {activeTab === 'activity' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1">
                <span className="font-semibold text-[#64748B]">Interaction History</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleQuickLog('call')}
                    className="px-2 py-1 bg-white hover:bg-[#F1F5F9] border border-[#CBD5E1] text-[#334155] rounded-lg text-[11px] font-semibold flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3 text-emerald-600" /> + Log Call
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLog('whatsapp')}
                    className="px-2 py-1 bg-white hover:bg-[#F1F5F9] border border-[#CBD5E1] text-[#334155] rounded-lg text-[11px] font-semibold flex items-center gap-1"
                  >
                    <MessageCircle className="w-3 h-3 text-[#25D366]" /> + Log WhatsApp
                  </button>
                </div>
              </div>

              {activities.length === 0 ? (
                <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-dashed border-[#CBD5E1] text-center text-[#94A3B8]">
                  No activity history logged yet.
                </div>
              ) : (
                <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-[#E2E8F0]">
                  {activities.map((act) => (
                    <div key={act.id} className="relative flex items-start gap-3 pl-1">
                      <div className="w-6 h-6 rounded-full bg-white border-2 border-[#0F5132] text-[#0F5132] flex items-center justify-center shrink-0 z-10">
                        <div className="w-2 h-2 rounded-full bg-[#0F5132]" />
                      </div>
                      <div className="flex-1 bg-white p-3 rounded-xl border border-[#E2E8F0] shadow-2xs space-y-0.5">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-bold text-[#0F172A] text-xs">{act.title}</span>
                          <span className="text-[10px] text-[#94A3B8]">{act.timestamp}</span>
                        </div>
                        <p className="text-[#475569] text-xs">{act.description}</p>
                        <span className="text-[10px] text-[#64748B] block pt-0.5">
                          By {act.actor_name} ({act.actor_role})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: NOTES */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              <form onSubmit={handleAddNote} className="space-y-2">
                <label className="block font-semibold text-[#1E293B]">Add Sales Note / Client Memo</label>
                <textarea
                  rows={3}
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  placeholder="Record meal requirements, discount agreements, or custom requests..."
                  className="w-full p-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmittingNote || !newNoteContent.trim()}
                    className="px-3.5 py-1.5 rounded-xl bg-[#0F5132] hover:bg-[#0B3D25] disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Save Note</span>
                  </button>
                </div>
              </form>

              <div className="space-y-2.5 pt-2 border-t border-[#F1F5F9]">
                <span className="font-semibold text-[#64748B] block">Saved Notes ({notes.length})</span>
                {notes.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-dashed border-[#CBD5E1] text-center text-[#94A3B8]">
                    No notes added yet.
                  </div>
                ) : (
                  notes.map((n) => (
                    <div
                      key={n.id}
                      className="p-3 bg-white rounded-xl border border-[#E2E8F0] shadow-2xs space-y-1"
                    >
                      <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                        <span className="font-semibold text-[#0F172A]">{n.author_name}</span>
                        <span>{n.created_at}</span>
                      </div>
                      <p className="text-[#334155] text-xs leading-relaxed">{n.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: DOCUMENTS & QUOTATIONS */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              {/* Quotations & Proposals Section */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between pb-1">
                  <div className="flex items-center gap-1.5 font-bold text-[#0F172A]">
                    <FileSpreadsheet className="w-4 h-4 text-[#0F5132]" />
                    <span>Price Quotations & Proposals ({leadQuotations.length})</span>
                  </div>
                  {canUse(currentResort, 'quotations') && (
                    <button
                      type="button"
                      onClick={() => setIsQuotationModalOpen(true)}
                      className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg text-xs font-semibold text-[#0F5132] flex items-center gap-1 transition-colors"
                    >
                      <Plus className="w-3 h-3" /> + New Quotation
                    </button>
                  )}
                </div>

                {leadQuotations.length === 0 ? (
                  <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-dashed border-[#CBD5E1] text-center space-y-1.5">
                    <p className="text-xs font-medium text-[#64748B]">No price quotations created for this lead yet.</p>
                    <p className="text-[11px] text-[#94A3B8]">
                      Generate a luxury itemized proposal with automatic GST and discount math.
                    </p>
                    {canUse(currentResort, 'quotations') && (
                      <button
                        type="button"
                        onClick={() => setIsQuotationModalOpen(true)}
                        className="mt-1 px-3 py-1.5 bg-[#0F5132] hover:bg-[#0B3D25] text-white rounded-xl text-xs font-semibold transition-colors shadow-2xs inline-flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Create Quotation
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {leadQuotations.map((q) => (
                      <div
                        key={q.id}
                        className="p-3.5 bg-white rounded-xl border border-[#E2E8F0] shadow-2xs flex items-center justify-between gap-3 hover:border-[#CBD5E1] transition-all"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-[#0F172A]">{q.quotation_code}</span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                q.status === 'Accepted'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : q.status === 'Sent'
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : q.status === 'Draft'
                                  ? 'bg-slate-100 text-slate-700 border border-slate-200'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}
                            >
                              {q.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#64748B] mt-0.5">
                            Total: <strong className="text-[#0F5132]">{formatINR(q.grand_total)}</strong> • Valid till {q.valid_until}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => setPreviewQuotation(q)}
                            className="px-2.5 py-1 rounded-lg bg-[#F8FAFC] hover:bg-[#E2E8F0] text-xs font-semibold text-[#334155] border border-[#CBD5E1] transition-colors"
                          >
                            View / Send
                          </button>
                          {q.status === 'Accepted' && lead.status !== 'Booked' && (
                            <button
                              type="button"
                              onClick={() => onConvertToBooking(lead)}
                              className="px-2.5 py-1 rounded-lg bg-[#0F5132] hover:bg-[#0B3D25] text-xs font-semibold text-white shadow-2xs transition-colors"
                            >
                              Book
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* General Property Documents */}
              <div className="space-y-2 pt-2 border-t border-[#F1F5F9]">
                <div className="flex items-center justify-between pb-1">
                  <span className="font-semibold text-[#64748B]">Property Brochures & Info</span>
                  <button
                    type="button"
                    onClick={() => toast.info('Document Attachment', 'Resort brochure is available.')}
                    className="px-2.5 py-1 bg-white hover:bg-[#F1F5F9] border border-[#CBD5E1] rounded-lg text-xs font-semibold text-[#0F5132] flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Upload File
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#0F5132] flex items-center justify-center shrink-0 border border-emerald-200">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#0F172A]">Resort Brochure & Package Rates.pdf</p>
                      <span className="text-[10px] text-[#64748B]">PDF Document • 2.4 MB • Sent via WhatsApp</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toast.success('Brochure Opened', 'Displaying PDF preview.')}
                    className="px-2.5 py-1 rounded-lg bg-[#F8FAFC] hover:bg-[#E2E8F0] text-xs font-semibold text-[#334155] border border-[#CBD5E1]"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Phase 3: Quotation Builder Modal */}
      <QuotationBuilderModal
        isOpen={isQuotationModalOpen}
        onClose={() => setIsQuotationModalOpen(false)}
        prefillLead={lead}
        onSuccess={() => {
          setIsQuotationModalOpen(false);
          refreshLeadData();
        }}
      />

      {/* Phase 3: Quotation Preview & Send Modal */}
      <QuotationPreviewModal
        isOpen={Boolean(previewQuotation)}
        onClose={() => setPreviewQuotation(null)}
        quotation={previewQuotation}
        onRefresh={() => {
          refreshLeadData();
        }}
      />

      {/* Phase 3: Template Dispatch Modal */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl lg:max-w-3xl bg-white rounded-2xl shadow-2xl border border-[#CBD5E1] overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#0F5132]" />
                <h3 className="font-bold text-sm text-[#0F172A]">Send Message Template</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsTemplateModalOpen(false)}
                className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3.5 text-xs text-left">
              <div>
                <label className="block font-semibold text-[#334155] mb-1">Select Template</label>
                <select
                  value={selectedTemplateId}
                  onChange={(e) => setSelectedTemplateId(e.target.value)}
                  className="w-full p-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs font-medium focus:outline-none"
                >
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>
                      [{t.channel.toUpperCase()}] {t.name} ({t.category})
                    </option>
                  ))}
                </select>
              </div>

              {selectedTemplateId && (
                <div>
                  <span className="block font-semibold text-[#334155] mb-1">Interpolated Live Preview:</span>
                  {(() => {
                    const t = templates.find((item) => item.id === selectedTemplateId);
                    if (!t) return null;
                    const rendered = interpolateTemplate(t.content, {
                      guest_name: lead.name,
                      resort_name: currentResort.name,
                      dates: lead.preferred_date || 'Upcoming Weekend',
                      amount: lead.budget_max ? formatINR(lead.budget_max) : 'Customized',
                      quotation_link: `https://joyresorts.com/quote/${lead.lead_code}`,
                      contact_number: '+91 98200 11223',
                    });
                    return (
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[#334155] text-xs whitespace-pre-wrap leading-relaxed font-mono">
                        {rendered}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsTemplateModalOpen(false)}
                className="px-3 py-1.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold text-[#475569] hover:bg-[#F1F5F9]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendTemplate}
                className="px-4 py-1.5 rounded-xl bg-[#0F5132] hover:bg-[#0B3D25] text-white text-xs font-bold shadow-2xs flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send to {lead.name}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
