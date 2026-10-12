import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Kanban,
  Search,
  Filter,
  Plus,
  ArrowRight,
  Flame,
  Phone,
  MessageCircle,
  MoreVertical,
  Layers,
  Lock,
  ChevronRight,
  TrendingUp,
  X,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { getLeads, updateLead } from '@/api/leads';
import { Lead, LeadStatus } from '@/types/crm';
import { formatINR } from '@/lib/formatINR';
import { toast } from '@/store/useToastStore';
import { canUse } from '@/lib/permissions';
import { AddEditLeadModal } from '@/features/leads/AddEditLeadModal';
import { LeadDetailDrawer } from '@/features/leads/LeadDetailDrawer';
import { ConvertToBookingModal } from '@/features/leads/ConvertToBookingModal';

export const LeadPipelinePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentResort, user, role } = useAuthStore();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [executiveFilter, setExecutiveFilter] = useState('ALL');
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);

  // Lost Reason Modal State
  const [isLostReasonOpen, setIsLostReasonOpen] = useState(false);
  const [pendingLostLeadId, setPendingLostLeadId] = useState<string | null>(null);
  const [lostReason, setLostReason] = useState('Too expensive');

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [convertLead, setConvertLead] = useState<Lead | null>(null);
  const [isConvertOpen, setIsConvertOpen] = useState(false);

  const loadData = () => {
    setLeads(getLeads(currentResort.id, user));
  };

  useEffect(() => {
    loadData();
  }, [currentResort.id, user, role]);

  // Plan gating check
  const isPipelineUnlocked = canUse(currentResort, 'pipeline');

  const columns: { id: LeadStatus; label: string; bgBadge: string }[] = [
    { id: 'New', label: '1. New Enquiries', bgBadge: 'bg-blue-50 text-blue-800 border-blue-200' },
    { id: 'Contacted', label: '2. Contacted', bgBadge: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
    { id: 'Site Visit', label: '3. Site Visit', bgBadge: 'bg-purple-50 text-purple-800 border-purple-200' },
    { id: 'Interested', label: '4. Interested', bgBadge: 'bg-amber-50 text-amber-800 border-amber-200' },
    { id: 'Booked', label: '5. Booked', bgBadge: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
    { id: 'Lost', label: '6. Lost', bgBadge: 'bg-rose-50 text-rose-800 border-rose-200' },
  ];

  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      if (executiveFilter !== 'ALL' && l.assigned_to !== executiveFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          l.name.toLowerCase().includes(q) ||
          l.lead_code.toLowerCase().includes(q) ||
          l.city.toLowerCase().includes(q) ||
          l.phone.includes(q) ||
          l.interested_in.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [leads, searchQuery, executiveFilter]);

  // Drag and Drop handlers
  const handleDragStart = (leadId: string) => {
    setDraggedLeadId(leadId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetStatus: LeadStatus) => {
    if (!draggedLeadId) return;

    if (targetStatus === 'Lost') {
      setPendingLostLeadId(draggedLeadId);
      setIsLostReasonOpen(true);
      setDraggedLeadId(null);
      return;
    }

    const res = updateLead(draggedLeadId, { status: targetStatus }, currentResort.id, user);
    if (res.success) {
      toast.success('Lead Status Updated', `Advanced to ${targetStatus}`);
      loadData();
    }
    setDraggedLeadId(null);
  };

  const handleMoveTo = (leadId: string, newStatus: LeadStatus) => {
    if (newStatus === 'Lost') {
      setPendingLostLeadId(leadId);
      setIsLostReasonOpen(true);
      return;
    }

    const res = updateLead(leadId, { status: newStatus }, currentResort.id, user);
    if (res.success) {
      toast.success('Pipeline Updated', `Moved to ${newStatus}`);
      loadData();
    }
  };

  const handleConfirmLostReason = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingLostLeadId) return;

    updateLead(
      pendingLostLeadId,
      { status: 'Lost', lost_reason: lostReason },
      currentResort.id,
      user
    );
    toast.info('Lead Marked as Lost', `Reason logged: ${lostReason}`);
    setIsLostReasonOpen(false);
    setPendingLostLeadId(null);
    loadData();
  };

  // If SaaS Plan is Basic and Pipeline is locked
  if (!isPipelineUnlocked) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center mb-4 shadow-sm">
          <Lock className="w-8 h-8" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 mb-2">
          Pro & Enterprise Feature
        </span>
        <h2 className="text-2xl font-black text-[#0F172A] tracking-tight mb-2">
          Pipeline Kanban Board is Locked
        </h2>
        <p className="text-xs sm:text-sm text-[#64748B] max-w-md mb-6 leading-relaxed">
          The visual Drag & Drop Pipeline Kanban board is part of the <strong>Pro Plan</strong>. Your current resort property (<strong>{currentResort.name}</strong>) is on the <strong>{currentResort.plan} Plan</strong>.
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate('/leads')}
            className="px-4 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs font-semibold text-[#334155] hover:bg-[#F8FAFC]"
          >
            Back to Leads List
          </button>
          <button
            type="button"
            onClick={() => navigate('/subscription')}
            className="px-5 py-2 bg-[#0F5132] hover:bg-[#0B3D25] text-white rounded-xl text-xs font-bold shadow-2xs transition-colors"
          >
            Upgrade to Pro
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-left text-[#0F172A]">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#0F172A] flex items-center gap-2">
              <Kanban className="w-6 h-6 text-[#0F5132]" />
              <span>Pipeline Kanban Board</span>
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#0F5132] font-semibold border border-emerald-200">
              {currentResort.name}
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Drag & drop leads across sales stages. Real-time stage totals computed in ₹.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => navigate('/leads')}
            className="h-9 px-3.5 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#CBD5E1] rounded-xl text-xs font-semibold text-[#475569] transition-colors"
          >
            Table View
          </button>
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="h-9 px-4 bg-[#0F5132] hover:bg-[#0B3D25] text-white rounded-xl text-xs font-bold shadow-2xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 bg-white p-3 rounded-2xl border border-[#E2E8F0] shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pipeline cards by name, phone, city, or package..."
            className="w-full h-9 pl-9 pr-3 text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={executiveFilter}
            onChange={(e) => setExecutiveFilter(e.target.value)}
            className="h-9 px-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs font-medium focus:outline-none"
          >
            <option value="ALL">All Executives</option>
            <option value="Sameer Verma">Sameer Verma</option>
            <option value="Amit Singh">Amit Singh</option>
            <option value="Neha Gupta">Neha Gupta</option>
            <option value="Rohit Kumar">Rohit Kumar</option>
            <option value="Pooja Soni">Pooja Soni</option>
          </select>
        </div>
      </div>

      {/* Mobile Swipe Notice (< 1024px) */}
      <div className="lg:hidden flex items-center justify-between gap-2 px-3.5 py-2 bg-emerald-50/80 rounded-xl border border-emerald-200 text-xs text-emerald-950 font-medium">
        <span>↔ Swipe horizontally to view all pipeline stages</span>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-[#0F5132] border border-emerald-300">
          6 Stages
        </span>
      </div>

      {/* Kanban Columns Container */}
      <div className="bg-white rounded-3xl p-4 border border-[#E2E8F0] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin pb-3">
          <div className="flex gap-4 min-w-[1350px]">
            {columns.map((col) => {
              const colLeads = filteredLeads.filter((l) => l.status === col.id);
              const colTotal = colLeads.reduce(
                (acc, l) => acc + (l.budget_max || l.budget_min || 0),
                0
              );

              return (
                <div
                  key={col.id}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(col.id)}
                  className="flex-1 min-w-[210px] max-w-[250px] bg-[#F8FAFC] rounded-2xl p-3 border border-[#E2E8F0] flex flex-col"
                >
                  {/* Column Header */}
                  <div className="pb-3 border-b border-[#E2E8F0] mb-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#0F172A]">{col.label}</span>
                      <span className="px-2 py-0.5 rounded-full bg-white border border-[#CBD5E1] text-[11px] font-bold text-[#475569]">
                        {colLeads.length}
                      </span>
                    </div>
                    <p className="text-[11px] font-bold text-[#0F5132] mt-1">
                      {formatINR(colTotal)}
                    </p>
                  </div>

                  {/* Cards in this stage */}
                  <div className="space-y-3 flex-1 overflow-y-auto max-h-[640px] scrollbar-thin">
                    {colLeads.map((l) => (
                      <div
                        key={l.id}
                        draggable
                        onDragStart={() => handleDragStart(l.id)}
                        onClick={() => {
                          setSelectedLead(l);
                          setIsDetailOpen(true);
                        }}
                        className="p-3 bg-white rounded-2xl border border-[#E2E8F0] hover:border-[#0F5132]/40 shadow-2xs hover:shadow-xs transition-all space-y-2 text-xs cursor-grab active:cursor-grabbing group"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200">
                            {l.lead_code}
                          </span>
                          {l.score === 'Hot' && (
                            <span className="text-[10px] font-bold text-rose-600 flex items-center gap-0.5">
                              <Flame className="w-3 h-3 fill-rose-600" /> Hot
                            </span>
                          )}
                        </div>

                        <div>
                          <h4 className="font-bold text-[#0F172A] text-xs leading-snug group-hover:text-[#0F5132] transition-colors">
                            {l.name}
                          </h4>
                          <p className="text-[11px] text-[#64748B]">
                            {l.city} • {l.interested_in}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-1.5 border-t border-[#F1F5F9]">
                          <span className="text-xs font-black text-[#0F5132]">
                            {formatINR(l.budget_max)}
                          </span>
                          <span className="text-[10px] text-[#94A3B8] truncate max-w-[90px]">
                            {l.assigned_to}
                          </span>
                        </div>

                        {/* Mobile & Quick "Move to" Dropdown */}
                        <div
                          className="pt-1.5 border-t border-[#F8FAFC] flex items-center justify-between gap-1 text-[11px]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="text-[10px] text-[#94A3B8]">Move to:</span>
                          <select
                            value={l.status}
                            onChange={(e) => handleMoveTo(l.id, e.target.value as LeadStatus)}
                            className="h-6 px-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded text-[10px] font-semibold text-[#334155]"
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Site Visit">Site Visit</option>
                            <option value="Interested">Interested</option>
                            <option value="Booked">Booked</option>
                            <option value="Lost">Lost</option>
                          </select>
                        </div>
                      </div>
                    ))}

                    {colLeads.length === 0 && (
                      <div className="p-4 rounded-xl border border-dashed border-[#CBD5E1] text-center text-[11px] text-[#94A3B8]">
                        No leads in this stage
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lost Reason Modal (Mandatory when dropping or moving to Lost) */}
      {isLostReasonOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-md p-5 sm:p-6 shadow-2xl border border-[#E2E8F0] text-left text-xs text-[#0F172A] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3 mb-3">
              <h3 className="text-base font-bold text-[#0F172A]">Reason for Lost Lead</h3>
              <button
                type="button"
                onClick={() => {
                  setIsLostReasonOpen(false);
                  setPendingLostLeadId(null);
                }}
                className="w-7 h-7 rounded-full hover:bg-[#F1F5F9] flex items-center justify-center text-[#64748B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmLostReason} className="space-y-3.5">
              <p className="text-xs text-[#64748B]">
                Please record why this inquiry could not be closed so sales conversion metrics remain accurate.
              </p>

              <div>
                <label className="block font-semibold text-[#1E293B] mb-1">Select Lost Reason *</label>
                <select
                  required
                  value={lostReason}
                  onChange={(e) => setLostReason(e.target.value)}
                  className="w-full h-10 px-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30"
                >
                  <option value="Too expensive">Too expensive</option>
                  <option value="No response after follow-up">No response after follow-up</option>
                  <option value="Chose competitor">Chose competitor</option>
                  <option value="Dates not available">Dates not available</option>
                  <option value="Location too far">Location too far</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => {
                    setIsLostReasonOpen(false);
                    setPendingLostLeadId(null);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-[#F1F5F9] text-[#475569] font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-2xs"
                >
                  Confirm Lost
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Drawer and Modals */}
      <LeadDetailDrawer
        lead={selectedLead}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedLead(null);
        }}
        onConvertToBooking={(l) => {
          setIsDetailOpen(false);
          setConvertLead(l);
          setIsConvertOpen(true);
        }}
        onEdit={(l) => {
          setIsDetailOpen(false);
        }}
        onRefresh={loadData}
      />

      <ConvertToBookingModal
        lead={convertLead}
        isOpen={isConvertOpen}
        onClose={() => {
          setIsConvertOpen(false);
          setConvertLead(null);
        }}
        onSuccess={loadData}
      />

      <AddEditLeadModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmitLead={(formData) => {
          loadData();
          setIsAddOpen(false);
        }}
      />
    </div>
  );
};
