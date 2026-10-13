import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { Lead, LeadStatus, LeadSource, InterestedInType } from "@/types/crm";
import {
  getLeads,
  getLeadStats,
  createLead,
  updateLead,
  deleteLead,
  bulkUpdateLeadStatus,
  bulkAssignLeads,
} from "@/api/leads";
import { LeadFormData } from "@/features/leads/leadValidation";
import { LeadDetailDrawer } from "@/features/leads/LeadDetailDrawer";
import { AddEditLeadModal } from "@/features/leads/AddEditLeadModal";
import { ConvertToBookingModal } from "@/features/leads/ConvertToBookingModal";
import { CSVImportModal } from "@/features/leads/CSVImportModal";
import { SiteVisitModal } from "@/features/leads/SiteVisitModal";
import { exportLeadsToCSV } from "@/features/leads/CSVExport";
import { formatINR } from "@/lib/formatINR";
import { toast } from "@/store/useToastStore";
import {
  Users2,
  UserPlus,
  Search,
  Filter,
  Plus,
  Phone,
  MessageCircle,
  TrendingUp,
  Flame,
  Zap,
  Snowflake,
  MoreVertical,
  CheckCircle2,
  CalendarCheck,
  Building2,
  ChevronRight,
  ChevronLeft,
  Eye,
  Edit,
  Trash2,
  SlidersHorizontal,
  Download,
  Upload,
  Clock,
  Sparkles,
  Kanban,
  FileSpreadsheet,
  AlertTriangle,
} from "lucide-react";
import { computeLeadScore, computeLeadSLA } from "@/api/scoring";
import { canUse } from "@/lib/permissions";

export const LeadsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, currentResort, role } = useAuthStore();

  // Primary data state loaded via API
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState(getLeadStats(currentResort.id, user));

  // Filters & Search
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState<string>("ALL");
  const [interestFilter, setInterestFilter] = useState<string>("ALL");

  // Table selection & bulk actions
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Column visibility
  const [visibleColumns, setVisibleColumns] = useState({
    code: true,
    name: true,
    contact: true,
    interest: true,
    status: true,
    activity: true,
    assigned: true,
  });
  const [isColumnDropdownOpen, setIsColumnDropdownOpen] = useState(false);

  // Modals & Drawer State
  const [detailLead, setDetailLead] = useState<Lead | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState<Lead | null>(null);

  const [convertLead, setConvertLead] = useState<Lead | null>(null);
  const [isConvertOpen, setIsConvertOpen] = useState(false);

  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isSiteVisitOpen, setIsSiteVisitOpen] = useState(false);
  const [siteVisitLead, setSiteVisitLead] = useState<Lead | null>(null);

  // Load leads from API
  const loadLeadsData = () => {
    const list = getLeads(currentResort.id, user);
    setLeads(list);
    setStats(getLeadStats(currentResort.id, user));
  };

  useEffect(() => {
    loadLeadsData();
    setSelectedLeadIds([]);
    setCurrentPage(1);
  }, [currentResort.id, role, user]);

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      // Tab filter
      if (activeTab !== "all" && l.status !== activeTab) {
        return false;
      }
      // Source filter
      if (sourceFilter !== "ALL" && l.source !== sourceFilter) {
        return false;
      }
      // Interest filter
      if (interestFilter !== "ALL" && l.interested_in !== interestFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = l.name.toLowerCase().includes(q);
        const matchPhone = l.phone.includes(q);
        const matchEmail = l.email.toLowerCase().includes(q);
        const matchCity = l.city.toLowerCase().includes(q);
        const matchCode = l.lead_code.toLowerCase().includes(q);
        const matchAssigned = l.assigned_to.toLowerCase().includes(q);
        if (
          !matchName &&
          !matchPhone &&
          !matchEmail &&
          !matchCity &&
          !matchCode &&
          !matchAssigned
        ) {
          return false;
        }
      }
      return true;
    });
  }, [leads, activeTab, sourceFilter, interestFilter, searchQuery]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / pageSize));
  const paginatedLeads = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLeads.slice(start, start + pageSize);
  }, [filteredLeads, currentPage, pageSize]);

  // Checkbox Selection
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedLeadIds(paginatedLeads.map((l) => l.id));
    } else {
      setSelectedLeadIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedLeadIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // Bulk Actions
  const handleBulkStatusChange = (newStatus: LeadStatus) => {
    if (selectedLeadIds.length === 0) return;
    const count = bulkUpdateLeadStatus(
      selectedLeadIds,
      newStatus,
      currentResort.id,
      user,
    );
    toast.success(
      "Bulk Status Updated",
      `Updated ${count} leads to ${newStatus}.`,
    );
    setSelectedLeadIds([]);
    loadLeadsData();
  };

  const handleBulkAssign = (assignee: string) => {
    if (selectedLeadIds.length === 0) return;
    const count = bulkAssignLeads(
      selectedLeadIds,
      assignee,
      currentResort.id,
      user,
    );
    toast.success(
      "Bulk Assign Completed",
      `Assigned ${count} leads to ${assignee}.`,
    );
    setSelectedLeadIds([]);
    loadLeadsData();
  };

  // Lead CRUD handlers
  const handleSaveLead = (formData: LeadFormData) => {
    const tagsArray = formData.tags
      ? formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    if (leadToEdit) {
      // Update
      const res = updateLead(
        leadToEdit.id,
        {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          city: `${formData.city}, India`,
          interested_in: formData.interested_in,
          guests_adults: formData.guests_adults,
          guests_children: formData.guests_children,
          preferred_date: formData.preferred_date,
          budget_min: formData.budget_min,
          budget_max: formData.budget_max,
          source: formData.source,
          priority: formData.priority,
          status: formData.status,
          score: formData.score || "Warm",
          tags: tagsArray,
          assigned_to: formData.assigned_to,
          remarks: formData.remarks || "",
          lost_reason: formData.lost_reason,
        },
        currentResort.id,
        user,
      );

      if (!res.success) {
        toast.error("Update Failed", res.error);
        return;
      }
      toast.success("Lead Updated", `Changes saved for ${formData.name}.`);
    } else {
      // Create
      const res = createLead(
        {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          city: `${formData.city}, India`,
          interested_in: formData.interested_in,
          guests_adults: formData.guests_adults,
          guests_children: formData.guests_children,
          preferred_date: formData.preferred_date,
          budget_min: formData.budget_min,
          budget_max: formData.budget_max,
          source: formData.source,
          priority: formData.priority,
          status: formData.status,
          score: formData.score || "Warm",
          tags: tagsArray,
          assigned_to: formData.assigned_to,
          remarks: formData.remarks || "",
          lost_reason: formData.lost_reason,
        },
        currentResort.id,
        user,
      );

      if (!res.success) {
        toast.error("Creation Failed", res.error);
        return;
      }
      toast.success(
        "Lead Created",
        `Added ${formData.name} to sales pipeline.`,
      );
    }

    setIsAddEditOpen(false);
    setLeadToEdit(null);
    loadLeadsData();
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete lead for ${name}?`)) {
      deleteLead(id, currentResort.id);
      toast.success("Lead Deleted", `${name} has been removed.`);
      loadLeadsData();
      if (detailLead?.id === id) {
        setIsDetailOpen(false);
        setDetailLead(null);
      }
    }
  };

  const openDetail = (l: Lead) => {
    setDetailLead(l);
    setIsDetailOpen(true);
  };

  const openEdit = (l: Lead) => {
    setLeadToEdit(l);
    setIsAddEditOpen(true);
  };

  const openConvert = (l: Lead) => {
    setConvertLead(l);
    setIsConvertOpen(true);
  };

  return (
    <div className="space-y-4 sm:space-y-5 text-left text-[#0F172A]">
      {/* 1. Header Banner & Resort Context */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#0F172A] flex items-center gap-2">
              <Users2 className="w-6 h-6 text-[#0F5132]" />
              <span>Lead Management</span>
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#0F5132] font-semibold border border-emerald-200">
              {currentResort.name}
            </span>
            {role === "Sales Executive" && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                Assigned to: {user?.name}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Capture, nurture, and convert inquiries into confirmed luxury stays
            and banquet bookings.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            type="button"
            onClick={() => navigate("/leads/pipeline")}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs sm:text-sm font-semibold border border-slate-300 transition-colors shrink-0"
            title="Kanban Pipeline Board"
          >
            <Kanban className="w-4 h-4 text-[#0F5132]" />
            <span>Pipeline Board</span>
          </button>

          {canUse(currentResort, "quotations") && (
            <button
              type="button"
              onClick={() => navigate("/quotations")}
              className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl text-xs sm:text-sm font-semibold border border-amber-300 transition-colors shrink-0"
              title="Quotations & Proposals (INR ₹)"
            >
              <FileSpreadsheet className="w-4 h-4 text-amber-700" />
              <span>Quotations</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              exportLeadsToCSV(filteredLeads, currentResort.name);
              toast.success(
                "CSV Exported",
                `Exported ${filteredLeads.length} leads.`,
              );
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#475569] rounded-xl text-xs sm:text-sm font-semibold border border-[#CBD5E1] transition-colors shrink-0"
            title="Export filtered leads to CSV"
          >
            <Download className="w-4 h-4 text-[#64748B]" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setIsImportOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#475569] rounded-xl text-xs sm:text-sm font-semibold border border-[#CBD5E1] transition-colors shrink-0"
            title="Import leads from CSV template"
          >
            <Upload className="w-4 h-4 text-[#64748B]" />
            <span className="hidden sm:inline">Import CSV</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setLeadToEdit(null);
              setIsAddEditOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#0F5132] hover:bg-[#0B3D25] text-white rounded-xl text-xs sm:text-sm font-bold shadow-2xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>
              {role === "Receptionist" ? "Add Walk-in Lead" : "Add Lead"}
            </span>
          </button>
        </div>
      </div>

      {/* 2. Top 5 KPI Cards (Matching Screenshot) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
        {/* Total Leads */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between gap-1 mb-1.5">
            <span className="text-xs font-semibold text-[#64748B] truncate">
              Total Leads
            </span>
            <span className="text-[11px] font-bold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full shrink-0">
              {stats.totalLeadsTrend}
            </span>
          </div>
          <div>
            <div className="flex justify-between items-baseline lg:block text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
              <span>{stats.totalLeads}</span>
              <p className="text-[11px] font-normal text-[#94A3B8] mt-0.5">
                All active pipeline leads
              </p>
            </div>
          </div>
        </div>

        {/* New Enquiries */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between gap-1 mb-1.5">
            <span className="text-xs font-semibold text-[#64748B] truncate">
              New Enquiries
            </span>
            <span className="text-[11px] font-bold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full shrink-0">
              {stats.newEnquiriesTrend}
            </span>
          </div>
          <div>
            <div className="flex justify-between items-baseline lg:block text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
              <span>{stats.newEnquiries}</span>
              <p className="text-[11px] font-normal text-[#94A3B8] mt-0.5">
                Awaiting initial response
              </p>
            </div>
          </div>
        </div>

        {/* Site Visits */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between gap-1 mb-1.5">
            <span className="text-xs font-semibold text-[#64748B] truncate">
              Site Visits
            </span>
            <span className="text-[11px] font-bold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full shrink-0">
              {stats.siteVisitsTrend}
            </span>
          </div>
          <div>
            <div className="flex justify-between items-baseline lg:block text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
              <span>{stats.siteVisits}</span>
              <p className="text-[11px] font-normal text-[#94A3B8] mt-0.5">
                Banquets & villa tours
              </p>
            </div>
          </div>
        </div>

        {/* Bookings */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between gap-1 mb-1.5">
            <span className="text-xs font-semibold text-[#64748B] truncate">
              Bookings
            </span>
            <span className="text-[11px] font-bold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full shrink-0">
              {stats.bookingsTrend}
            </span>
          </div>
          <div>
            <div className="flex justify-between items-baseline lg:block text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
              <span>{stats.bookings}</span>
              <p className="text-[11px] font-normal text-[#16A34A] mt-0.5">
                Confirmed reservation files
              </p>
            </div>
          </div>
        </div>

        {/* Revenue */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-1 p-3.5 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex flex-col justify-between min-w-0">
          <div className="flex items-center justify-between gap-1 mb-1.5">
            <span className="text-xs font-semibold text-[#64748B] truncate">
              Revenue
            </span>
            <span className="text-[11px] font-bold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full shrink-0">
              {stats.revenueTrend}
            </span>
          </div>
          <div>
            <div className="flex justify-between items-baseline lg:block text-2xl sm:text-3xl font-black text-[#0F5132] tracking-tight truncate">
              <span className="truncate">{stats.revenueFormatted}</span>
              <p className="text-[11px] text-[#0F5132] font-semibold mt-0.5 truncate">
                {formatINR(stats.revenue)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Status Tabs (Matching Screenshot) */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-1.5 sm:p-2 shadow-2xs overflow-x-auto scrollbar-thin">
        <div className="flex items-center gap-1 min-w-max">
          {[
            {
              id: "all",
              label: "All Leads",
              count: stats.statusCounts.all || 0,
            },
            { id: "New", label: "New", count: stats.statusCounts.New || 0 },
            {
              id: "Contacted",
              label: "Contacted",
              count: stats.statusCounts.Contacted || 0,
            },
            {
              id: "Site Visit",
              label: "Site Visit",
              count: stats.statusCounts["Site Visit"] || 0,
            },
            {
              id: "Interested",
              label: "Interested",
              count: stats.statusCounts.Interested || 0,
            },
            {
              id: "Booked",
              label: "Booked",
              count: stats.statusCounts.Booked || 0,
            },
            { id: "Lost", label: "Lost", count: stats.statusCounts.Lost || 0 },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                activeTab === tab.id
                  ? "bg-[#0F5132] text-white shadow-2xs"
                  : "text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeTab === tab.id
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Controls Bar: Search + Filters + Column Visibility + Bulk Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 bg-white p-3 rounded-2xl border border-[#E2E8F0] shadow-2xs">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by name, phone, email, city, or lead code..."
              className="w-full h-9 pl-9 pr-3 text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30"
            />
          </div>

          {/* Filters & Dropdowns */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Source Filter */}
            <select
              value={sourceFilter}
              onChange={(e) => {
                setSourceFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="h-9 px-2.5 text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl font-medium focus:outline-none"
            >
              <option value="ALL">All Sources</option>
              <option value="Website">Website</option>
              <option value="Walk-in">Walk-in</option>
              <option value="Instagram">Instagram</option>
              <option value="Facebook">Facebook</option>
              <option value="Google Ads">Google Ads</option>
              <option value="Referral">Referral</option>
              <option value="MakeMyTrip">MakeMyTrip</option>
              <option value="Travel Agent">Travel Agent</option>
              <option value="LinkedIn">LinkedIn</option>
            </select>

            {/* Interested Stay Filter */}
            <select
              value={interestFilter}
              onChange={(e) => {
                setInterestFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="h-9 px-2.5 text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl font-medium focus:outline-none"
            >
              <option value="ALL">All Packages</option>
              <option value="Weekend Stay">Weekend Stay</option>
              <option value="Family Stay">Family Stay</option>
              <option value="Luxury Stay">Luxury Stay</option>
              <option value="Wedding">Wedding</option>
              <option value="Corporate Event">Corporate Event</option>
              <option value="Nature Camp">Nature Camp</option>
              <option value="Team Outing">Team Outing</option>
              <option value="Adventure Activities">Adventure Activities</option>
              <option value="Conference">Conference</option>
            </select>

            {/* Column Visibility Toggle */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsColumnDropdownOpen(!isColumnDropdownOpen)}
                className="h-9 px-3 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#CBD5E1] rounded-xl text-xs font-semibold text-[#475569] flex items-center gap-1.5 transition-colors"
                title="Toggle columns"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Columns</span>
              </button>

              {isColumnDropdownOpen && (
                <div className="absolute right-0 top-11 z-20 w-48 bg-white border border-[#CBD5E1] rounded-2xl shadow-xl p-2 space-y-1 text-xs">
                  <div className="px-2 py-1 text-[11px] font-bold text-[#64748B] border-b border-[#F1F5F9]">
                    Toggle Table Columns
                  </div>
                  {Object.keys(visibleColumns).map((colKey) => (
                    <label
                      key={colKey}
                      className="flex items-center gap-2 px-2 py-1.5 hover:bg-[#F8FAFC] rounded-lg cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={(visibleColumns as any)[colKey]}
                        onChange={(e) =>
                          setVisibleColumns({
                            ...visibleColumns,
                            [colKey]: e.target.checked,
                          })
                        }
                        className="rounded text-[#0F5132] focus:ring-[#0F5132]"
                      />
                      <span className="capitalize">{colKey}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bulk Action Bar (Visible when rows selected) */}
        {selectedLeadIds.length > 0 && (
          <div className="p-3 bg-emerald-50/90 border border-emerald-300 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs animate-in fade-in duration-150">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#0F5132] text-white flex items-center justify-center font-bold text-[11px]">
                {selectedLeadIds.length}
              </span>
              <span className="font-semibold text-emerald-950">
                leads selected for bulk action
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <select
                onChange={(e) => {
                  if (e.target.value)
                    handleBulkStatusChange(e.target.value as LeadStatus);
                }}
                defaultValue=""
                className="h-8 px-2.5 bg-white border border-emerald-300 rounded-xl text-xs font-semibold text-emerald-900"
              >
                <option value="" disabled>
                  Change Status To...
                </option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Site Visit">Site Visit</option>
                <option value="Interested">Interested</option>
                <option value="Booked">Booked</option>
                <option value="Lost">Lost</option>
              </select>

              <select
                onChange={(e) => {
                  if (e.target.value) handleBulkAssign(e.target.value);
                }}
                defaultValue=""
                className="h-8 px-2.5 bg-white border border-emerald-300 rounded-xl text-xs font-semibold text-emerald-900"
              >
                <option value="" disabled>
                  Assign Rep To...
                </option>
                <option value="Sameer Verma">Sameer Verma</option>
                <option value="Amit Singh">Amit Singh</option>
                <option value="Neha Gupta">Neha Gupta</option>
                <option value="Rohit Kumar">Rohit Kumar</option>
                <option value="Pooja Soni">Pooja Soni</option>
              </select>

              <button
                type="button"
                onClick={() => setSelectedLeadIds([])}
                className="h-8 px-2.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 hover:underline"
              >
                Deselect All
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 5. Main Leads Table (Desktop) & Responsive Cards (Mobile) */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
        {paginatedLeads.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#0F5132] border border-emerald-200 mx-auto flex items-center justify-center">
              <Users2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#0F172A]">
              No Leads Found
            </h3>
            <p className="text-xs text-[#64748B] max-w-sm mx-auto">
              {searchQuery || sourceFilter !== "ALL" || interestFilter !== "ALL"
                ? "No inquiries match the current search or filter filters. Try clearing filters."
                : 'No leads registered yet for this resort property. Click "Add Lead" to register walk-ins or inquiries.'}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View (sm and above) */}
            <div className="hidden sm:block overflow-x-auto scrollbar-thin">
              <table className="w-full min-w-[950px] text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-semibold whitespace-nowrap">
                    <th className="py-3.5 px-4 w-10">
                      <input
                        type="checkbox"
                        checked={
                          paginatedLeads.length > 0 &&
                          selectedLeadIds.length === paginatedLeads.length
                        }
                        onChange={handleSelectAll}
                        className="rounded text-[#0F5132] focus:ring-[#0F5132]"
                      />
                    </th>
                    {visibleColumns.code && (
                      <th className="py-3.5 px-3 w-20"># Code</th>
                    )}
                    {visibleColumns.name && (
                      <th className="py-3.5 px-4 min-w-[190px]">Lead Name</th>
                    )}
                    {visibleColumns.contact && (
                      <th className="py-3.5 px-4 min-w-[170px]">
                        Contact Info
                      </th>
                    )}
                    {visibleColumns.interest && (
                      <th className="py-3.5 px-4 min-w-[180px]">
                        Interested In
                      </th>
                    )}
                    {visibleColumns.status && (
                      <th className="py-3.5 px-3 min-w-[110px]">Status</th>
                    )}
                    {visibleColumns.activity && (
                      <th className="py-3.5 px-3 min-w-[140px]">
                        Last Activity
                      </th>
                    )}
                    {visibleColumns.assigned && (
                      <th className="py-3.5 px-3 min-w-[140px]">
                        Assigned Rep
                      </th>
                    )}
                    <th className="py-3.5 px-4 text-right min-w-[110px]">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#E2E8F0]">
                  {paginatedLeads.map((l) => (
                    <tr
                      key={l.id}
                      className="hover:bg-[#F8FAFC]/80 transition-colors group cursor-pointer"
                      onClick={() => openDetail(l)}
                    >
                      {/* Checkbox */}
                      <td
                        className="py-3.5 px-4"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedLeadIds.includes(l.id)}
                          onChange={() => handleToggleSelect(l.id)}
                          className="rounded text-[#0F5132] focus:ring-[#0F5132]"
                        />
                      </td>

                      {/* Code */}
                      {visibleColumns.code && (
                        <td className="py-3.5 px-3 whitespace-nowrap font-bold text-[#475569]">
                          <span className="px-2 py-0.5 rounded-md bg-[#F1F5F9] border border-[#CBD5E1]">
                            {l.lead_code}
                          </span>
                        </td>
                      )}

                      {/* Name + Avatar */}
                      {visibleColumns.name && (
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2.5">
                            {l.avatar ? (
                              <img
                                src={l.avatar}
                                alt={l.name}
                                className="w-8 h-8 rounded-xl object-cover border border-[#CBD5E1] shrink-0"
                              />
                            ) : (
                              <div
                                className={`w-8 h-8 rounded-xl ${
                                  l.initials_bg || "bg-[#0F5132]"
                                } text-white flex items-center justify-center font-bold text-xs shrink-0`}
                              >
                                {l.initials || l.name.slice(0, 2).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-[#0F172A] group-hover:text-[#0F5132] transition-colors">
                                  {l.name}
                                </span>
                                {(() => {
                                  const sc = computeLeadScore(l);
                                  return (
                                    <span
                                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full border flex items-center gap-0.5 ${
                                        sc.rating === "Hot"
                                          ? "bg-rose-50 text-rose-700 border-rose-200"
                                          : sc.rating === "Warm"
                                            ? "bg-amber-50 text-amber-700 border-amber-200"
                                            : "bg-sky-50 text-sky-700 border-sky-200"
                                      }`}
                                      title={`AI Score: ${sc.totalScore}/100 (${sc.rating})`}
                                    >
                                      {sc.rating === "Hot" && (
                                        <Flame className="w-2.5 h-2.5 text-rose-600 fill-rose-600" />
                                      )}
                                      {sc.rating === "Warm" && (
                                        <Zap className="w-2.5 h-2.5 text-amber-600" />
                                      )}
                                      {sc.rating === "Cold" && (
                                        <Snowflake className="w-2.5 h-2.5 text-sky-600" />
                                      )}
                                      <span>{sc.totalScore}</span>
                                    </span>
                                  );
                                })()}
                              </div>
                              <span className="text-[11px] text-[#64748B] block">
                                {l.city}
                              </span>
                            </div>
                          </div>
                        </td>
                      )}

                      {/* Contact */}
                      {visibleColumns.contact && (
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="font-semibold text-[#0F172A]">
                              {l.phone}
                            </span>
                            <span className="text-[11px] text-[#64748B] truncate max-w-[160px]">
                              {l.email}
                            </span>
                          </div>
                        </td>
                      )}

                      {/* Interested In */}
                      {visibleColumns.interest && (
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div>
                            <span className="font-semibold text-[#0F172A] block">
                              {l.interested_in}
                            </span>
                            <span className="text-[11px] text-[#0F5132] font-bold">
                              {formatINR(l.budget_min)} -{" "}
                              {formatINR(l.budget_max)}
                            </span>
                          </div>
                        </td>
                      )}

                      {/* Status */}
                      {visibleColumns.status && (
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <div className="flex flex-col gap-1 items-start">
                            <span
                              className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] border ${
                                l.status === "New"
                                  ? "bg-blue-50 text-blue-800 border-blue-200"
                                  : l.status === "Contacted"
                                    ? "bg-indigo-50 text-indigo-800 border-indigo-200"
                                    : l.status === "Site Visit"
                                      ? "bg-purple-50 text-purple-800 border-purple-200"
                                      : l.status === "Interested"
                                        ? "bg-amber-50 text-amber-800 border-amber-200"
                                        : l.status === "Booked"
                                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                          : "bg-rose-50 text-rose-800 border-rose-200"
                              }`}
                            >
                              {l.status}
                            </span>
                            {(() => {
                              const sla = computeLeadSLA(l);
                              if (
                                l.status === "New" &&
                                sla.status === "breached"
                              ) {
                                return (
                                  <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200 flex items-center gap-0.5">
                                    <AlertTriangle className="w-2.5 h-2.5 text-rose-600" />{" "}
                                    Overdue
                                  </span>
                                );
                              }
                              if (
                                l.status === "New" &&
                                sla.status === "warning"
                              ) {
                                return (
                                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200 flex items-center gap-0.5">
                                    <Clock className="w-2.5 h-2.5 text-amber-600" />{" "}
                                    &lt;30m left
                                  </span>
                                );
                              }
                              return null;
                            })()}
                          </div>
                        </td>
                      )}

                      {/* Last Activity */}
                      {visibleColumns.activity && (
                        <td className="py-3.5 px-3 whitespace-nowrap text-[#64748B]">
                          <span>{l.last_activity_at}</span>
                        </td>
                      )}

                      {/* Assigned Rep */}
                      {visibleColumns.assigned && (
                        <td className="py-3.5 px-3 whitespace-nowrap text-[#475569] font-medium">
                          <div className="flex items-center gap-1.5">
                            {l.assigned_to_avatar ? (
                              <img
                                src={l.assigned_to_avatar}
                                alt={l.assigned_to}
                                className="w-5 h-5 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold">
                                {l.assigned_to[0]}
                              </div>
                            )}
                            <span>{l.assigned_to}</span>
                          </div>
                        </td>
                      )}

                      {/* Actions */}
                      <td
                        className="py-3.5 px-4 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1">
                          <a
                            href={`tel:${l.phone}`}
                            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F5132] hover:bg-[#F1F5F9]"
                            title="Call Guest"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                          <a
                            href={`https://wa.me/91${l.phone.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#25D366] hover:bg-[#F1F5F9]"
                            title="WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                          {l.status !== "Booked" && (
                            <button
                              type="button"
                              onClick={() => openConvert(l)}
                              className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#0F5132] font-semibold text-[11px] border border-emerald-200 flex items-center gap-1 transition-colors"
                              title="Convert to Booking"
                            >
                              <CalendarCheck className="w-3 h-3" />
                              <span className="hidden xl:inline">Book</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => openEdit(l)}
                            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]"
                            title="Edit"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(l.id, l.name)}
                            className="p-1.5 rounded-lg text-[#64748B] hover:text-rose-600 hover:bg-rose-50"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Stacked Cards View (< 640px) */}
            <div className="sm:hidden divide-y divide-[#E2E8F0]">
              {paginatedLeads.map((l) => (
                <div
                  key={l.id}
                  onClick={() => openDetail(l)}
                  className="p-4 space-y-3 cursor-pointer hover:bg-[#F8FAFC] transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-9 h-9 rounded-xl ${
                          l.initials_bg || "bg-[#0F5132]"
                        } text-white flex items-center justify-center font-bold text-xs shrink-0`}
                      >
                        {l.initials || l.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-[#0F172A] text-sm">
                            {l.name}
                          </h4>
                          {(() => {
                            const sc = computeLeadScore(l);
                            return (
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full border flex items-center gap-0.5 ${
                                  sc.rating === "Hot"
                                    ? "bg-rose-50 text-rose-700 border-rose-200"
                                    : sc.rating === "Warm"
                                      ? "bg-amber-50 text-amber-700 border-amber-200"
                                      : "bg-sky-50 text-sky-700 border-sky-200"
                                }`}
                              >
                                {sc.rating === "Hot" && (
                                  <Flame className="w-2.5 h-2.5 text-rose-600 fill-rose-600" />
                                )}
                                {sc.rating === "Warm" && (
                                  <Zap className="w-2.5 h-2.5 text-amber-600" />
                                )}
                                {sc.rating === "Cold" && (
                                  <Snowflake className="w-2.5 h-2.5 text-sky-600" />
                                )}
                                <span>{sc.totalScore}</span>
                              </span>
                            );
                          })()}
                        </div>
                        <span className="text-[11px] text-[#64748B]">
                          {l.city}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold text-[10px] border ${
                          l.status === "New"
                            ? "bg-blue-50 text-blue-800 border-blue-200"
                            : l.status === "Booked"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : "bg-slate-100 text-slate-800 border-slate-200"
                        }`}
                      >
                        {l.status}
                      </span>
                      {(() => {
                        const sla = computeLeadSLA(l);
                        if (l.status === "New" && sla.status === "breached") {
                          return (
                            <span className="text-[9px] font-bold text-rose-700 bg-rose-50 px-1 py-0.2 rounded border border-rose-200 flex items-center gap-0.5">
                              <AlertTriangle className="w-2.5 h-2.5 text-rose-600" />{" "}
                              Overdue
                            </span>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-[#F8FAFC] p-2.5 rounded-xl border border-[#E2E8F0]">
                    <div>
                      <span className="text-[#64748B] block">Requirement:</span>
                      <span className="font-semibold text-[#0F172A]">
                        {l.interested_in}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#64748B] block">Budget:</span>
                      <span className="font-bold text-[#0F5132]">
                        {formatINR(l.budget_max)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#64748B] block">Contact:</span>
                      <span className="font-semibold text-[#0F172A]">
                        {l.phone}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#64748B] block">Assigned:</span>
                      <span className="font-medium text-[#475569]">
                        {l.assigned_to}
                      </span>
                    </div>
                  </div>

                  <div
                    className="flex items-center justify-between pt-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${l.phone}`}
                        className="px-2.5 py-1 rounded-lg bg-white border border-[#CBD5E1] text-[11px] font-semibold text-[#334155] flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3 text-emerald-600" /> Call
                      </a>
                      <a
                        href={`https://wa.me/91${l.phone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-[#25D366]/10 border border-[#25D366]/30 text-[11px] font-semibold text-[#075E54] flex items-center gap-1"
                      >
                        <MessageCircle className="w-3 h-3 text-[#25D366]" />{" "}
                        WhatsApp
                      </a>
                    </div>

                    {l.status !== "Booked" && (
                      <button
                        type="button"
                        onClick={() => openConvert(l)}
                        className="px-3 py-1 rounded-lg bg-[#0F5132] text-white text-[11px] font-bold shadow-2xs"
                      >
                        Convert
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="p-3 sm:p-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#64748B]">
              <div className="flex items-center gap-2">
                <span>Show</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="h-8 px-2 bg-white border border-[#CBD5E1] rounded-lg font-semibold text-[#0F172A]"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span>of {filteredLeads.length} leads</span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-1.5 rounded-lg border border-[#CBD5E1] bg-white disabled:opacity-40 hover:bg-[#F1F5F9] transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-3 py-1 font-bold text-[#0F172A]">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  className="p-1.5 rounded-lg border border-[#CBD5E1] bg-white disabled:opacity-40 hover:bg-[#F1F5F9] transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 6. Lead Detail Panel Drawer */}
      <LeadDetailDrawer
        lead={detailLead}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setDetailLead(null);
        }}
        onConvertToBooking={(l) => {
          setIsDetailOpen(false);
          openConvert(l);
        }}
        onEdit={(l) => {
          setIsDetailOpen(false);
          openEdit(l);
        }}
        onScheduleSiteVisit={(l) => {
          setIsDetailOpen(false);
          setSiteVisitLead(l);
          setIsSiteVisitOpen(true);
        }}
        onRefresh={loadLeadsData}
      />

      {/* 7. Add / Edit Lead Modal */}
      <AddEditLeadModal
        isOpen={isAddEditOpen}
        onClose={() => {
          setIsAddEditOpen(false);
          setLeadToEdit(null);
        }}
        leadToEdit={leadToEdit}
        onSubmitLead={handleSaveLead}
      />

      {/* 8. Convert to Booking Modal */}
      <ConvertToBookingModal
        isOpen={isConvertOpen}
        onClose={() => {
          setIsConvertOpen(false);
          setConvertLead(null);
        }}
        lead={convertLead}
        onSuccess={loadLeadsData}
      />

      {/* 9. CSV Import Modal */}
      <CSVImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onSuccess={loadLeadsData}
      />

      {/* 10. Site Visit Modal */}
      <SiteVisitModal
        isOpen={isSiteVisitOpen}
        onClose={() => {
          setIsSiteVisitOpen(false);
          setSiteVisitLead(null);
        }}
        lead={siteVisitLead}
        onSuccess={loadLeadsData}
      />
    </div>
  );
};
