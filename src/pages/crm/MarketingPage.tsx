import React, { useState, useEffect, useMemo } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { canUse } from "@/lib/permissions";
import { formatINR } from "@/lib/formatINR";
import { toast } from "@/store/useToastStore";
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
  Filter,
  Search,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  DollarSign,
  RefreshCw,
  BarChart3,
  PieChart,
  Layers,
  Trash2,
  Play,
  Pause,
  ChevronRight,
  Lock,
  Calendar,
  Globe,
  Share2,
  Gift,
  Award,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";
import {
  Campaign,
  CampaignChannel,
  CampaignStatus,
  Coupon,
  LeadSourceConfig,
  AudienceSegment,
  BroadcastMessage,
  LeadCaptureForm,
  LeadCaptureFieldId,
  ReferralRecord,
  MarketingDashboardMetrics,
  MessageTemplate,
} from "@/types/crm";
import {
  getMarketingMetrics,
  getLeadSources,
  createLeadSource,
  toggleLeadSourceActive,
  getCampaigns,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  toggleCampaignStatus,
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  toggleCouponActive,
  getAudienceSegments,
  getBroadcasts,
  scheduleBroadcast,
  getCaptureForms,
  saveCaptureForm,
  getReferrals,
  createReferral,
  updateReferralStatus,
} from "@/api";
import { getTemplates } from "@/api/templates";

type MarketingTab =
  | "overview"
  | "campaigns"
  | "coupons"
  | "segments"
  | "broadcasts"
  | "forms"
  | "referrals";

export const MarketingPage: React.FC = () => {
  const { currentResort, user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<MarketingTab>("overview");

  // Plan Gating Checks
  const isMarketingRoiUnlocked = canUse(currentResort, "marketing_roi");
  const isCampaignsUnlocked = canUse(currentResort, "campaigns");
  const isCouponsUnlocked = canUse(currentResort, "coupons");
  const isFormBuilderUnlocked = canUse(currentResort, "form_builder");
  const isReferralsUnlocked = canUse(currentResort, "referral_program");

  // Data States
  const [metrics, setMetrics] = useState<MarketingDashboardMetrics | null>(
    null,
  );
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [sources, setSources] = useState<LeadSourceConfig[]>([]);
  const [segments, setSegments] = useState<AudienceSegment[]>([]);
  const [broadcasts, setBroadcasts] = useState<BroadcastMessage[]>([]);
  const [captureForms, setCaptureForms] = useState<LeadCaptureForm[]>([]);
  const [referrals, setReferrals] = useState<ReferralRecord[]>([]);

  // Reload trigger
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!currentResort?.id) return;
    setMetrics(getMarketingMetrics(currentResort.id));
    setCampaigns(getCampaigns(currentResort.id));
    setCoupons(getCoupons(currentResort.id));
    setSources(getLeadSources(currentResort.id));
    setSegments(getAudienceSegments(currentResort.id));
    setBroadcasts(getBroadcasts(currentResort.id));
    setCaptureForms(getCaptureForms(currentResort.id));
    setReferrals(getReferrals(currentResort.id));
  }, [currentResort?.id, reloadKey]);

  const refreshData = () => {
    setReloadKey((prev) => prev + 1);
  };

  // ==========================================
  // TAB 1: OVERVIEW & ANALYTICS STATE & MODALS
  // ==========================================
  const [isAddSourceOpen, setIsAddSourceOpen] = useState(false);
  const [newSourceName, setNewSourceName] = useState("");
  const [newSourceCategory, setNewSourceCategory] = useState<
    "Digital" | "Offline" | "Referral" | "Direct"
  >("Digital");
  const [newSourceEstCpl, setNewSourceEstCpl] = useState(500);

  const handleAddSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSourceName.trim()) return;
    const res = createLeadSource(
      {
        name: newSourceName.trim(),
        category: newSourceCategory,
        estimated_cpl: Number(newSourceEstCpl) || 0,
        is_active: true,
      },
      currentResort.id,
      user,
    );
    if (res.success) {
      toast.success("Source Added", `Channel "${newSourceName}" registered.`);
      setIsAddSourceOpen(false);
      setNewSourceName("");
      refreshData();
    }
  };

  // ==========================================
  // TAB 2: CAMPAIGNS STATE & MODALS
  // ==========================================
  const [isCreateCampaignOpen, setIsCreateCampaignOpen] = useState(false);
  const [campaignSearch, setCampaignSearch] = useState("");
  const [campaignChannelFilter, setCampaignChannelFilter] =
    useState<string>("All");
  const [campaignStatusFilter, setCampaignStatusFilter] =
    useState<string>("All");

  // New Campaign Form
  const [campName, setCampName] = useState("");
  const [campChannel, setCampChannel] = useState<CampaignChannel>("WhatsApp");
  const [campBudget, setCampBudget] = useState(50000);
  const [campSpend, setCampSpend] = useState(0);
  const [campStartDate, setCampStartDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [campEndDate, setCampEndDate] = useState(
    new Date(Date.now() + 86400000 * 30).toISOString().slice(0, 10),
  );
  const [campAudience, setCampAudience] = useState("High-Spender Past Guests");
  const [campOfferCode, setCampOfferCode] = useState("");
  const [campStatus, setCampStatus] = useState<CampaignStatus>("Running");
  const [campMessage, setCampMessage] = useState("");

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(campaignSearch.toLowerCase()) ||
        c.target_audience.toLowerCase().includes(campaignSearch.toLowerCase());
      const matchChannel =
        campaignChannelFilter === "All" || c.channel === campaignChannelFilter;
      const matchStatus =
        campaignStatusFilter === "All" || c.status === campaignStatusFilter;
      return matchSearch && matchChannel && matchStatus;
    });
  }, [campaigns, campaignSearch, campaignChannelFilter, campaignStatusFilter]);

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campName.trim()) {
      toast.error("Validation Error", "Campaign name is required.");
      return;
    }

    const res = createCampaign(
      {
        resort_id: currentResort.id,
        name: campName.trim(),
        channel: campChannel,
        budget: Number(campBudget) || 0,
        spend: Number(campSpend) || 0,
        start_date: campStartDate,
        end_date: campEndDate,
        target_audience: campAudience,
        offer_code: campOfferCode.toUpperCase() || undefined,
        status: campStatus,
        leads_generated: 0,
        bookings_generated: 0,
        revenue_generated: 0,
        message: campMessage,
      },
      currentResort.id,
      user,
    );

    if (res.success) {
      toast.success(
        "Campaign Created",
        `Campaign "${campName}" is now active.`,
      );
      setIsCreateCampaignOpen(false);
      setCampName("");
      setCampMessage("");
      refreshData();
    } else {
      toast.error("Failed", res.error);
    }
  };

  const handleToggleCampaign = (campaign: Campaign) => {
    const nextStatus: CampaignStatus =
      campaign.status === "Running"
        ? "Paused"
        : campaign.status === "Paused"
          ? "Running"
          : "Running";
    const res = toggleCampaignStatus(
      campaign.id,
      nextStatus,
      currentResort.id,
      user,
    );
    if (res.success) {
      toast.info(
        "Status Updated",
        `Campaign "${campaign.name}" is now ${nextStatus}.`,
      );
      refreshData();
    }
  };

  const handleDeleteCampaign = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete campaign "${name}"?`)) {
      const res = deleteCampaign(id, currentResort.id, user);
      if (res.success) {
        toast.success("Deleted", "Campaign removed.");
        refreshData();
      }
    }
  };

  // ==========================================
  // TAB 3: COUPONS STATE & MODALS
  // ==========================================
  const [isCreateCouponOpen, setIsCreateCouponOpen] = useState(false);
  const [cpnCode, setCpnCode] = useState("");
  const [cpnDesc, setCpnDesc] = useState("");
  const [cpnType, setCpnType] = useState<"percentage" | "fixed">("percentage");
  const [cpnValue, setCpnValue] = useState(15);
  const [cpnMinStay, setCpnMinStay] = useState(1);
  const [cpnMinSpend, setCpnMinSpend] = useState(10000);
  const [cpnValidFrom, setCpnValidFrom] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [cpnValidTo, setCpnValidTo] = useState(
    new Date(Date.now() + 86400000 * 60).toISOString().slice(0, 10),
  );
  const [cpnLimit, setCpnLimit] = useState(100);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cpnCode.trim()) {
      toast.error("Validation Error", "Coupon code is required.");
      return;
    }

    const res = createCoupon(
      {
        resort_id: currentResort.id,
        code: cpnCode.trim().toUpperCase(),
        description: cpnDesc.trim() || "Promotional Discount Offer",
        discount_type: cpnType,
        discount_value: Number(cpnValue) || 0,
        min_stay_nights: Number(cpnMinStay) || 1,
        min_spend: Number(cpnMinSpend) || 0,
        valid_from: cpnValidFrom,
        valid_to: cpnValidTo,
        usage_limit: Number(cpnLimit) || 100,
        is_active: true,
      },
      currentResort.id,
      user,
    );

    if (res.success) {
      toast.success(
        "Coupon Created",
        `Promo code ${cpnCode.toUpperCase()} is active.`,
      );
      setIsCreateCouponOpen(false);
      setCpnCode("");
      setCpnDesc("");
      refreshData();
    } else {
      toast.error("Error", res.error);
    }
  };

  const handleToggleCoupon = (coupon: Coupon) => {
    const res = toggleCouponActive(coupon.id, currentResort.id, user);
    if (res.success) {
      toast.info(
        "Coupon Toggled",
        `${coupon.code} is now ${coupon.is_active ? "Disabled" : "Enabled"}.`,
      );
      refreshData();
    }
  };

  const handleDeleteCoupon = (id: string, code: string) => {
    if (confirm(`Delete coupon code ${code}?`)) {
      const res = deleteCoupon(id, currentResort.id, user);
      if (res.success) {
        toast.success("Deleted", "Coupon removed.");
        refreshData();
      }
    }
  };

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success("Code Copied", `${code} copied to clipboard.`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // ==========================================
  // TAB 5: BROADCAST COMPOSER STATE
  // ==========================================
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastChannel, setBroadcastChannel] = useState<
    "WhatsApp" | "Email" | "SMS"
  >("WhatsApp");
  const [broadcastSegmentId, setBroadcastSegmentId] = useState(
    segments[0]?.id || "seg-001",
  );
  const [broadcastTemplateId, setBroadcastTemplateId] = useState<string>("");
  const [broadcastMessagePreview, setBroadcastMessagePreview] = useState("");
  const [broadcastOptInChecked, setBroadcastOptInChecked] = useState(false);

  const templates = useMemo(() => {
    return currentResort?.id ? getTemplates(currentResort.id) : [];
  }, [currentResort?.id]);

  const selectedSegment = useMemo(() => {
    return segments.find((s) => s.id === broadcastSegmentId) || segments[0];
  }, [segments, broadcastSegmentId]);

  const handleTemplateSelect = (templateId: string) => {
    setBroadcastTemplateId(templateId);
    const tmpl = templates.find((t: MessageTemplate) => t.id === templateId);
    if (tmpl) {
      setBroadcastMessagePreview(tmpl.content);
    }
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim()) {
      toast.error("Validation Error", "Broadcast title is required.");
      return;
    }
    if (!broadcastOptInChecked) {
      toast.error(
        "Compliance Requirement",
        "Please check the TRAI / DND compliance consent box.",
      );
      return;
    }

    const reach = selectedSegment ? selectedSegment.member_count : 25;

    const res = scheduleBroadcast(
      {
        resort_id: currentResort.id,
        title: broadcastTitle.trim(),
        segment_id: selectedSegment?.id || "seg-custom",
        segment_name: selectedSegment?.name || "Selected Audience",
        channel: broadcastChannel,
        template_id: broadcastTemplateId || undefined,
        scheduled_at: new Date().toISOString(),
        status: "Sent",
        estimated_reach: reach,
        opt_in_confirmed: broadcastOptInChecked,
        message_preview:
          broadcastMessagePreview || "Custom seasonal announcement message.",
        created_by: user?.name || "Staff Admin",
      },
      currentResort.id,
      user,
    );

    if (res.success) {
      toast.success(
        "Broadcast Dispatched",
        `Dispatched to ${reach} verified recipients in ${selectedSegment?.name} via ${broadcastChannel}.`,
      );
      setIsBroadcastModalOpen(false);
      setBroadcastTitle("");
      setBroadcastOptInChecked(false);
      refreshData();
    } else {
      toast.error("Failed", res.error);
    }
  };

  const handleQuickBroadcastSegment = (segment: AudienceSegment) => {
    setBroadcastSegmentId(segment.id);
    setBroadcastTitle(`${segment.name} Special Broadcast`);
    setIsBroadcastModalOpen(true);
  };

  // ==========================================
  // TAB 6: FORM BUILDER STATE
  // ==========================================
  const activeForm = captureForms[0] || {
    id: "form-001",
    resort_id: currentResort?.id || "resort-1",
    title: "Direct Villa & Staycation Enquiry Form",
    description: "Check luxury villa tariff & availability instantly",
    fields: [
      "name",
      "phone",
      "email",
      "preferred_date",
      "guests",
      "interested_in",
    ] as LeadCaptureFieldId[],
    primary_color: "#0F5132",
    button_text: "Request Instant Tariff Proposal",
    success_message:
      "Thank you for your enquiry! Our concierge will call within 15 minutes.",
    utm_campaign_default: "website_direct",
    embed_code: "",
    created_at: new Date().toISOString(),
  };

  const [formTitle, setFormTitle] = useState(activeForm.title);
  const [formDesc, setFormDesc] = useState(activeForm.description);
  const [formButtonText, setFormButtonText] = useState(activeForm.button_text);
  const [formColor, setFormColor] = useState(activeForm.primary_color);
  const [formFields, setFormFields] = useState<LeadCaptureFieldId[]>(
    activeForm.fields,
  );
  const [isCopiedIframe, setIsCopiedIframe] = useState(false);

  const handleToggleField = (fieldId: LeadCaptureFieldId) => {
    if (fieldId === "name" || fieldId === "phone") {
      toast.info(
        "Mandatory Field",
        "Name and Phone are mandatory lead capture fields.",
      );
      return;
    }
    if (formFields.includes(fieldId)) {
      setFormFields(formFields.filter((f) => f !== fieldId));
    } else {
      setFormFields([...formFields, fieldId]);
    }
  };

  const handleSaveFormBuilder = () => {
    const res = saveCaptureForm(
      {
        id: activeForm.id,
        resort_id: currentResort.id,
        title: formTitle,
        description: formDesc,
        fields: formFields,
        primary_color: formColor,
        button_text: formButtonText,
        success_message: activeForm.success_message,
        utm_campaign_default: activeForm.utm_campaign_default,
      },
      currentResort.id,
      user,
    );
    if (res.success) {
      toast.success("Form Saved", "Embedded widget configuration updated.");
      refreshData();
    }
  };

  const embedUrl = `${window.location.origin}/enquire/${currentResort?.id || "resort-1"}`;
  const iframeCode = `<iframe src="${embedUrl}" width="100%" height="700" frameborder="0" style="border:none;border-radius:16px;box-shadow:0 8px 30px rgba(0,0,0,0.08);"></iframe>`;

  const handleCopyIframe = () => {
    navigator.clipboard.writeText(iframeCode);
    setIsCopiedIframe(true);
    toast.success(
      "Embed Code Copied",
      "Paste into your WordPress, Webflow, or custom website.",
    );
    setTimeout(() => setIsCopiedIframe(false), 2500);
  };

  // ==========================================
  // TAB 7: REFERRALS STATE & MODALS
  // ==========================================
  const [isAddReferralOpen, setIsAddReferralOpen] = useState(false);
  const [refName, setRefName] = useState("");
  const [refPhone, setRefPhone] = useState("");
  const [refEmail, setRefEmail] = useState("");
  const [refLeadName, setRefLeadName] = useState("");
  const [refReward, setRefReward] = useState(2500);
  const [refNotes, setRefNotes] = useState("");

  const handleAddReferral = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refName.trim() || !refLeadName.trim()) {
      toast.error(
        "Validation Error",
        "Referrer and Referred Guest names are required.",
      );
      return;
    }
    const res = createReferral(
      {
        resort_id: currentResort.id,
        referrer_name: refName.trim(),
        referrer_phone: refPhone.trim(),
        referrer_email: refEmail.trim() || undefined,
        referred_lead_name: refLeadName.trim(),
        reward_amount: Number(refReward) || 0,
        status: "Pending",
        notes: refNotes.trim() || "Guest word-of-mouth referral",
      },
      currentResort.id,
      user,
    );
    if (res.success) {
      toast.success(
        "Referral Recorded",
        `Referral for ${refLeadName} tracked.`,
      );
      setIsAddReferralOpen(false);
      setRefName("");
      setRefPhone("");
      setRefLeadName("");
      setRefNotes("");
      refreshData();
    }
  };

  const handleUpdateReferralStatus = (
    id: string,
    status: "Pending" | "Rewarded" | "Rejected",
    notes?: string,
  ) => {
    const res = updateReferralStatus(id, status, currentResort.id, user, notes);
    if (res.success) {
      toast.info("Referral Status Updated", `Status changed to ${status}.`);
      refreshData();
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-[#0F5132] flex items-center gap-2">
              <Send className="w-4 h-4 text-[#0F5132]" />
              <span>Marketing & Guest Acquisition</span>
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#0F5132] font-bold border border-emerald-200">
              {currentResort?.name}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200">
              Plan: {currentResort?.plan || "Pro"}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
            Omnichannel campaigns, promo coupons, audience segments, website
            lead capture, and referral tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={refreshData}
            title="Refresh Marketing Data"
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              if (!isCampaignsUnlocked) {
                toast.warning(
                  "Plan Upgrade Required",
                  "Campaigns require Pro or Enterprise plan.",
                );
                return;
              }
              setIsCreateCampaignOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-[#0F5132] text-white text-xs font-bold hover:bg-[#0D4429] flex items-center gap-1.5 shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Campaign</span>
          </button>
        </div>
      </div>

      {/* 7-Tab Navigation Bar */}
      <div className="bg-white p-1 rounded-2xl border border-[#E5E7EB] shadow-xs overflow-x-auto flex items-center gap-1 scrollbar-none">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "overview"
              ? "bg-[#0F5132] text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Overview & ROI</span>
        </button>

        <button
          onClick={() => setActiveTab("campaigns")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "campaigns"
              ? "bg-[#0F5132] text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Campaigns ({campaigns.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("coupons")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "coupons"
              ? "bg-[#0F5132] text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>Coupons & Offers ({coupons.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("segments")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "segments"
              ? "bg-[#0F5132] text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Audience Segments</span>
        </button>

        <button
          onClick={() => setActiveTab("broadcasts")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "broadcasts"
              ? "bg-[#0F5132] text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>Broadcast Composer</span>
        </button>

        <button
          onClick={() => setActiveTab("forms")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "forms"
              ? "bg-[#0F5132] text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Form Builder</span>
          {!isFormBuilderUnlocked && (
            <Lock className="w-3 h-3 text-amber-500" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("referrals")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "referrals"
              ? "bg-[#0F5132] text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Gift className="w-3.5 h-3.5" />
          <span>Referral Program</span>
          {!isReferralsUnlocked && <Lock className="w-3 h-3 text-amber-500" />}
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: OVERVIEW & ROI ANALYTICS DASHBOARD                 */}
      {/* ======================================================== */}
      {activeTab === "overview" && (
        <div className="space-y-5">
          {/* 6 Top KPI Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3.5">
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex flex-col justify-between">
              <span className="text-xs font-semibold text-[#64748B] block truncate">
                Total Leads Acquired
              </span>
              <div className="flex justify-between items-baseline lg:block text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight mt-1">
                <span>{metrics?.totalLeads || 0}</span>
                <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                  <TrendingUp className="w-3 h-3" />
                  <span>+14.2% MoM</span>
                </span>
              </div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex flex-col justify-between">
              <span className="text-xs font-semibold text-[#64748B] block truncate">
                Direct Bookings
              </span>
              <div className="flex justify-between items-baseline lg:block text-xl sm:text-2xl font-black text-[#0F5132] tracking-tight mt-1">
                <span>{metrics?.totalBookings || 0}</span>
                <span className="text-[10px] text-[#64748B] font-medium mt-0.5">
                  {metrics?.totalLeads
                    ? Math.round(
                        ((metrics.totalBookings || 0) / metrics.totalLeads) *
                          100,
                      )
                    : 0}
                  % Conversion Rate
                </span>
              </div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex flex-col justify-between">
              <span className="text-xs font-semibold text-[#64748B] block truncate">
                Attributed Revenue
              </span>
              <div className="flex justify-between items-baseline lg:block text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight mt-1">
                <span>{formatINR(metrics?.totalRevenue || 0)}</span>
                <span className="text-[10px] text-emerald-600 font-medium mt-0.5">
                  Closed leads
                </span>
              </div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex flex-col justify-between">
              <span className="text-xs font-semibold text-[#64748B] block truncate">
                Marketing Spend
              </span>
              <div className="flex justify-between items-baseline lg:block text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight mt-1">
                <span>{formatINR(metrics?.totalMarketingSpend || 0)}</span>
                <span className="text-[10px] text-[#64748B] font-medium mt-0.5">
                  Active budgets
                </span>
              </div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex flex-col justify-between">
              <span className="text-xs font-semibold text-[#64748B] block truncate">
                Cost Per Lead (CPL)
              </span>
              <div className="flex justify-between items-baseline lg:block text-xl sm:text-2xl font-black text-blue-700 tracking-tight mt-1">
                <span>{formatINR(metrics?.overallCPL || 0)}</span>
                <span className="text-[10px] text-[#64748B] font-medium mt-0.5">
                  Acquisition cost
                </span>
              </div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex flex-col justify-between">
              <span className="text-xs font-semibold text-[#64748B] block truncate">
                Blended ROI
              </span>
              <div className="flex justify-between items-baseline lg:block text-xl sm:text-2xl font-black text-emerald-700 tracking-tight mt-1">
                <span>{metrics?.overallROI || 0}%</span>
                <span className="text-[10px] text-emerald-600 font-bold mt-0.5">
                  CPB: {formatINR(metrics?.overallCPB || 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Visual Channel Performance & Donut Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Leads by Source Donut & Share */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <PieChart className="w-4 h-4 text-[#0F5132]" />
                    <span>Leads by Source Share</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Real-time distribution from leads repository
                  </p>
                </div>
                <button
                  onClick={() => setIsAddSourceOpen(true)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 text-[#0F5132] border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition-colors"
                >
                  + Add Source
                </button>
              </div>

              {/* Visual Bars for Sources */}
              <div className="space-y-3 pt-2">
                {metrics?.sourcesDistribution.slice(0, 5).map((s, idx) => {
                  const colors = [
                    "bg-emerald-600",
                    "bg-blue-600",
                    "bg-purple-600",
                    "bg-amber-500",
                    "bg-rose-500",
                  ];
                  const barColor = colors[idx % colors.length];

                  return (
                    <div key={s.source} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-700">{s.source}</span>
                        <span className="text-slate-900 font-bold">
                          {s.leadsCount} leads ({s.percentageOfLeads}%)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full ${barColor} rounded-full transition-all duration-500`}
                          style={{
                            width: `${Math.max(s.percentageOfLeads, 4)}%`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-500">
                        <span>Est. CPL: {formatINR(s.cpl)}</span>
                        <span>
                          Conv: {s.conversionRate}% ({s.bookingsCount} bookings)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Campaign Channel Performance Cards */}
            <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4 text-[#0F5132]" />
                    <span>Outreach Channel Performance Matrix</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Direct comparison of channel efficiency, spend, and
                    generated ROI
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                {metrics?.channelPerformance.map((ch) => (
                  <div
                    key={ch.channel}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2 hover:border-emerald-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                        {ch.channel === "WhatsApp" && (
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                        )}
                        {ch.channel === "Google Ads" && (
                          <Globe className="w-3.5 h-3.5 text-blue-600" />
                        )}
                        {ch.channel === "Meta Ads" && (
                          <Share2 className="w-3.5 h-3.5 text-pink-600" />
                        )}
                        {ch.channel === "Email" && (
                          <Mail className="w-3.5 h-3.5 text-purple-600" />
                        )}
                        {ch.channel === "SMS" && (
                          <Smartphone className="w-3.5 h-3.5 text-amber-600" />
                        )}
                        <span>{ch.channel}</span>
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                        {ch.roi}% ROI
                      </span>
                    </div>

                    <div className="space-y-1 text-[11px] text-slate-600">
                      <div className="flex justify-between">
                        <span>Spend:</span>
                        <strong className="text-slate-900">
                          {formatINR(ch.spend)}
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Leads Generated:</span>
                        <strong className="text-slate-900">{ch.leads}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Attributed Rev:</span>
                        <strong className="text-emerald-700">
                          {formatINR(ch.revenue)}
                        </strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sources Detailed Audit Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Lead Sources & Unit Economics
                </h3>
                <p className="text-[11px] text-slate-500">
                  Unit cost per lead, booking conversion, and active status
                  toggle.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 uppercase font-semibold text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Source Channel</th>
                    <th className="px-3 py-3">Leads Count</th>
                    <th className="px-3 py-3">Bookings</th>
                    <th className="px-3 py-3">Conversion %</th>
                    <th className="px-3 py-3">Unit CPL</th>
                    <th className="px-3 py-3">Est. CPB</th>
                    <th className="px-3 py-3">Revenue</th>
                    <th className="px-4 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {metrics?.sourcesDistribution.map((s) => {
                    const srcConfig = sources.find(
                      (cfg) => cfg.name === s.source,
                    );
                    const isActive = srcConfig ? srcConfig.is_active : true;

                    return (
                      <tr
                        key={s.source}
                        className="hover:bg-slate-50/70 transition-colors"
                      >
                        <td className="px-4 py-3 font-bold text-slate-900">
                          {s.source}
                        </td>
                        <td className="px-3 py-3 font-semibold text-slate-800">
                          {s.leadsCount}
                        </td>
                        <td className="px-3 py-3 font-bold text-[#0F5132]">
                          {s.bookingsCount}
                        </td>
                        <td className="px-3 py-3">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 font-semibold text-slate-800">
                            {s.conversionRate}%
                          </span>
                        </td>
                        <td className="px-3 py-3 font-medium text-slate-700">
                          {formatINR(s.cpl)}
                        </td>
                        <td className="px-3 py-3 font-medium text-slate-700">
                          {formatINR(s.cpb)}
                        </td>
                        <td className="px-3 py-3 font-bold text-slate-900">
                          {formatINR(s.revenue)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {srcConfig ? (
                            <button
                              onClick={() => {
                                toggleLeadSourceActive(
                                  srcConfig.id,
                                  currentResort.id,
                                  user,
                                );
                                refreshData();
                              }}
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                                isActive
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                                  : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
                              }`}
                            >
                              {isActive ? "Active" : "Disabled"}
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-semibold">
                              Standard
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: CAMPAIGNS MANAGER                                 */}
      {/* ======================================================== */}
      {activeTab === "campaigns" && (
        <div className="space-y-4">
          {/* Filters & Actions */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search campaigns..."
                  value={campaignSearch}
                  onChange={(e) => setCampaignSearch(e.target.value)}
                  className="h-9 pl-9 pr-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#0F5132] w-48 sm:w-60"
                />
              </div>

              <select
                value={campaignChannelFilter}
                onChange={(e) => setCampaignChannelFilter(e.target.value)}
                className="h-9 px-3 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-none"
              >
                <option value="All">All Channels</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Google Ads">Google Ads</option>
                <option value="Meta Ads">Meta Ads</option>
                <option value="Email">Email</option>
                <option value="SMS">SMS</option>
              </select>

              <select
                value={campaignStatusFilter}
                onChange={(e) => setCampaignStatusFilter(e.target.value)}
                className="h-9 px-3 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Running">Running</option>
                <option value="Paused">Paused</option>
                <option value="Completed">Completed</option>
                <option value="Draft">Draft</option>
              </select>
            </div>

            <button
              onClick={() => setIsCreateCampaignOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-[#0F5132] text-white text-xs font-bold hover:bg-[#0D4429] flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Campaign</span>
            </button>
          </div>

          {/* Campaigns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCampaigns.map((camp) => {
              const spendPercentage =
                camp.budget > 0
                  ? Math.round((camp.spend / camp.budget) * 100)
                  : 0;

              return (
                <div
                  key={camp.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 flex flex-col justify-between space-y-3.5 hover:shadow-md transition-shadow text-xs"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-slate-900 text-sm leading-tight">
                        {camp.name}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                          camp.status === "Running"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : camp.status === "Paused"
                              ? "bg-amber-50 text-amber-800 border border-amber-200"
                              : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}
                      >
                        {camp.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 font-semibold text-slate-700 text-[11px] flex items-center gap-1">
                        {camp.channel === "WhatsApp" && (
                          <MessageCircle className="w-3 h-3 text-emerald-600" />
                        )}
                        {camp.channel === "Google Ads" && (
                          <Globe className="w-3 h-3 text-blue-600" />
                        )}
                        {camp.channel === "Meta Ads" && (
                          <Share2 className="w-3 h-3 text-pink-600" />
                        )}
                        {camp.channel === "Email" && (
                          <Mail className="w-3 h-3 text-purple-600" />
                        )}
                        {camp.channel === "SMS" && (
                          <Smartphone className="w-3 h-3 text-amber-600" />
                        )}
                        <span>{camp.channel}</span>
                      </span>

                      {camp.offer_code && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-mono text-[10px] font-bold flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {camp.offer_code}
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      Audience: {camp.target_audience}
                    </p>

                    {/* Spend progress */}
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[11px] text-slate-600">
                        <span>Spend vs Budget:</span>
                        <span className="font-bold text-slate-900">
                          {formatINR(camp.spend)} / {formatINR(camp.budget)}
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-[#0F5132] rounded-full"
                          style={{
                            width: `${Math.min(spendPercentage, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Campaign Stats */}
                  <div className="pt-2 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
                    <div className="bg-slate-50 p-2 rounded-xl">
                      <span className="text-[10px] text-slate-500 block">
                        Leads
                      </span>
                      <strong className="text-slate-900 text-xs">
                        {camp.leads_generated}
                      </strong>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-xl">
                      <span className="text-[10px] text-slate-500 block">
                        Bookings
                      </span>
                      <strong className="text-[#0F5132] text-xs">
                        {camp.bookings_generated}
                      </strong>
                    </div>
                    <div className="bg-emerald-50 p-2 rounded-xl">
                      <span className="text-[10px] text-emerald-700 block">
                        ROI
                      </span>
                      <strong className="text-emerald-800 text-xs">
                        {camp.roi_percent}%
                      </strong>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                    <span className="text-[10px] text-slate-400">
                      Dates: {camp.start_date.slice(5)} to{" "}
                      {camp.end_date.slice(5)}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggleCampaign(camp)}
                        title={
                          camp.status === "Running"
                            ? "Pause Campaign"
                            : "Resume Campaign"
                        }
                        className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                      >
                        {camp.status === "Running" ? (
                          <Pause className="w-3.5 h-3.5 text-amber-600" />
                        ) : (
                          <Play className="w-3.5 h-3.5 text-emerald-600" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteCampaign(camp.id, camp.name)}
                        title="Delete Campaign"
                        className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: OFFERS & COUPONS                                  */}
      {/* ======================================================== */}
      {activeTab === "coupons" && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Promotional Coupons & Voucher Codes
              </h3>
              <p className="text-[11px] text-slate-500">
                Staff can apply these codes during quotation generation, or
                guests can enter them on booking links.
              </p>
            </div>
            <button
              onClick={() => setIsCreateCouponOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-[#0F5132] text-white text-xs font-bold hover:bg-[#0D4429] flex items-center gap-1.5 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Coupon</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coupons.map((cpn) => {
              const usagePercent =
                cpn.usage_limit > 0
                  ? Math.round((cpn.used_count / cpn.usage_limit) * 100)
                  : 0;

              return (
                <div
                  key={cpn.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 flex flex-col justify-between space-y-3 hover:shadow-md transition-shadow text-xs"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-[#0F5132] border border-emerald-200 font-mono font-extrabold text-xs">
                          {cpn.code}
                        </span>
                        <button
                          onClick={() => handleCopyCoupon(cpn.code)}
                          title="Copy Code"
                          className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                          {copiedCode === cpn.code ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      <button
                        onClick={() => handleToggleCoupon(cpn)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                          cpn.is_active
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : "bg-slate-100 text-slate-500 border-slate-200"
                        }`}
                      >
                        {cpn.is_active ? "Active" : "Disabled"}
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-600 font-medium">
                      {cpn.description}
                    </p>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-slate-500">
                          Discount Benefit:
                        </span>
                        <strong className="text-emerald-800">
                          {cpn.discount_type === "percentage"
                            ? `${cpn.discount_value}% Off`
                            : `Flat ${formatINR(cpn.discount_value)} Off`}
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Min Spend:</span>
                        <strong className="text-slate-800">
                          {formatINR(cpn.min_spend)}
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Min Stay:</span>
                        <strong className="text-slate-800">
                          {cpn.min_stay_nights} Night
                          {cpn.min_stay_nights > 1 ? "s" : ""}
                        </strong>
                      </div>
                    </div>

                    {/* Usage bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-500">
                        <span>
                          Used: {cpn.used_count} of {cpn.usage_limit}
                        </span>
                        <span>{usagePercent}% Claimed</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 rounded-full"
                          style={{ width: `${Math.min(usagePercent, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                    <span>
                      Valid: {cpn.valid_from} to {cpn.valid_to}
                    </span>
                    <button
                      onClick={() => handleDeleteCoupon(cpn.id, cpn.code)}
                      className="p-1 rounded text-rose-500 hover:bg-rose-50 transition-colors"
                      title="Delete Coupon"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: AUDIENCE SEGMENTS                                 */}
      {/* ======================================================== */}
      {activeTab === "segments" && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Dynamic Audience Segments
              </h3>
              <p className="text-[11px] text-slate-500">
                Live evaluated cohorts based on leads, bookings, and enquiry
                criteria in the database.
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              ⚡ Real-time Synced
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {segments.map((seg) => (
              <div
                key={seg.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow text-xs"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-slate-900 text-sm">
                      {seg.name}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-[#0F5132] text-white text-xs font-extrabold shrink-0">
                      {seg.member_count} Members
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {seg.description}
                  </p>

                  {seg.sample_tags && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {seg.sample_tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-semibold"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-medium">
                    Cohort: {seg.filter_type}
                  </span>
                  <button
                    onClick={() => handleQuickBroadcastSegment(seg)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-50 text-[#0F5132] border border-emerald-200 text-xs font-bold hover:bg-emerald-100 flex items-center gap-1 transition-colors"
                  >
                    <Send className="w-3 h-3" />
                    <span>Broadcast</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: BROADCAST COMPOSER & HISTORY                      */}
      {/* ======================================================== */}
      {activeTab === "broadcasts" && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Direct Broadcast Outreach
              </h3>
              <p className="text-[11px] text-slate-500">
                Compose verified promotional blasts across WhatsApp, Email, or
                SMS with TRAI compliance.
              </p>
            </div>
            <button
              onClick={() => setIsBroadcastModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-[#0F5132] text-white text-xs font-bold hover:bg-[#0D4429] flex items-center gap-1.5 transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>Compose New Broadcast</span>
            </button>
          </div>

          {/* Broadcasts History Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Broadcast Dispatch Audit Log
              </h4>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 uppercase font-semibold text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Campaign / Title</th>
                    <th className="px-3 py-3">Channel</th>
                    <th className="px-3 py-3">Target Segment</th>
                    <th className="px-3 py-3">Estimated Reach</th>
                    <th className="px-3 py-3">Dispatched At</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Sender</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {broadcasts.map((bc) => (
                    <tr
                      key={bc.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="font-bold text-slate-900 block">
                          {bc.title}
                        </span>
                        <span className="text-[10px] text-slate-500 line-clamp-1">
                          {bc.message_preview}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 font-semibold text-slate-700 text-[11px]">
                          {bc.channel}
                        </span>
                      </td>
                      <td className="px-3 py-3 font-medium text-slate-800">
                        {bc.segment_name}
                      </td>
                      <td className="px-3 py-3 font-bold text-slate-900">
                        {bc.actual_sent > 0
                          ? `${bc.actual_sent} Sent`
                          : `${bc.estimated_reach} Est.`}
                      </td>
                      <td className="px-3 py-3 text-slate-600">
                        {bc.scheduled_at.slice(0, 16).replace("T", " ")}
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            bc.status === "Sent"
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : "bg-blue-50 text-blue-800 border border-blue-200"
                          }`}
                        >
                          {bc.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-slate-500 font-medium">
                        {bc.created_by}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 6: LEAD CAPTURE FORM BUILDER                         */}
      {/* ======================================================== */}
      {activeTab === "forms" && (
        <div className="space-y-4">
          {!isFormBuilderUnlocked && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-3 text-xs text-amber-900">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <span>
                  <strong>Enterprise Plan Feature:</strong> Live website iframe
                  embed generation and custom styling are unlocked for
                  Enterprise properties. (Preview enabled below).
                </span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Left: Configuration Panel */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Website Embed Form Customizer
                </h3>
                <p className="text-[11px] text-slate-500">
                  Configure fields and brand styling for your public enquiry
                  portal.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Form Header Title
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full h-8 px-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Form Subtitle
                  </label>
                  <input
                    type="text"
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    className="w-full h-8 px-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Call-to-Action Button Label
                  </label>
                  <input
                    type="text"
                    value={formButtonText}
                    onChange={(e) => setFormButtonText(e.target.value)}
                    className="w-full h-8 px-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none"
                  />
                </div>

                {/* Primary Color Picker */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                    Resort Brand Accent Color
                  </label>
                  <div className="flex items-center gap-2">
                    {[
                      "#0F5132",
                      "#0284C7",
                      "#7C3AED",
                      "#B45309",
                      "#BE185D",
                      "#111827",
                    ].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setFormColor(c)}
                        className={`w-7 h-7 rounded-full border-2 transition-transform ${
                          formColor === c
                            ? "scale-110 ring-2 ring-emerald-500 ring-offset-2"
                            : ""
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                    <input
                      type="text"
                      value={formColor}
                      onChange={(e) => setFormColor(e.target.value)}
                      className="w-24 h-7 px-2 rounded-lg border border-slate-200 font-mono text-xs text-center"
                    />
                  </div>
                </div>

                {/* Enabled Form Fields */}
                <div className="space-y-2 pt-2">
                  <label className="block text-[11px] font-bold text-slate-700">
                    Form Field Visibility & Toggles
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    {[
                      {
                        id: "name" as LeadCaptureFieldId,
                        label: "Full Name (Mandatory)",
                      },
                      {
                        id: "phone" as LeadCaptureFieldId,
                        label: "Mobile Number (Mandatory)",
                      },
                      {
                        id: "email" as LeadCaptureFieldId,
                        label: "Email Address",
                      },
                      {
                        id: "city" as LeadCaptureFieldId,
                        label: "City of Residence",
                      },
                      {
                        id: "preferred_date" as LeadCaptureFieldId,
                        label: "Check-In Date",
                      },
                      {
                        id: "guests" as LeadCaptureFieldId,
                        label: "Guest Count",
                      },
                      {
                        id: "budget" as LeadCaptureFieldId,
                        label: "Budget Slider",
                      },
                      {
                        id: "interested_in" as LeadCaptureFieldId,
                        label: "Experience Type",
                      },
                      {
                        id: "remarks" as LeadCaptureFieldId,
                        label: "Special Requests",
                      },
                    ].map((f) => (
                      <label
                        key={f.id}
                        className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formFields.includes(f.id)}
                          onChange={() => handleToggleField(f.id)}
                          disabled={f.id === "name" || f.id === "phone"}
                          className="accent-[#0F5132]"
                        />
                        <span className="text-slate-800">{f.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <button
                  onClick={handleSaveFormBuilder}
                  className="px-4 py-2 rounded-xl bg-[#0F5132] text-white font-bold text-xs hover:bg-[#0D4429] transition-colors"
                >
                  Save Form Settings
                </button>

                <a
                  href={`/enquire/${currentResort?.id || "resort-1"}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center gap-1 transition-colors"
                >
                  <span>Open Standalone URL</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Right: Copyable Embed Code & Live Preview */}
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Copyable Embed Snippet
                  </h4>
                  <button
                    onClick={handleCopyIframe}
                    className="px-3 py-1 rounded-lg bg-emerald-50 text-[#0F5132] border border-emerald-200 text-xs font-bold hover:bg-emerald-100 flex items-center gap-1 transition-colors"
                  >
                    {isCopiedIframe ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>
                      {isCopiedIframe ? "Copied!" : "Copy <iframe> Code"}
                    </span>
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 text-emerald-400 font-mono text-[11px] overflow-x-auto leading-relaxed">
                  {iframeCode}
                </div>
                <p className="text-[10px] text-slate-500">
                  Submissions from this embed automatically create a Lead with
                  source <strong>"Website"</strong>, track UTM tags, and alert
                  your reservation desk.
                </p>
              </div>

              {/* Form Live Preview Mini Card */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Interactive Live Preview (What your guests see)
                </span>
                <div className="rounded-2xl border border-stone-200 overflow-hidden shadow-xs text-xs">
                  <div
                    className="p-4 text-white text-center"
                    style={{ backgroundColor: formColor }}
                  >
                    <h4 className="font-bold text-sm">{formTitle}</h4>
                    <p className="text-[11px] text-white/80 mt-0.5">
                      {formDesc}
                    </p>
                  </div>
                  <div className="p-4 bg-stone-50 space-y-2.5">
                    <div className="h-7 bg-white rounded-lg border border-stone-200 px-2 flex items-center text-slate-400 text-[11px]">
                      Full Name *
                    </div>
                    <div className="h-7 bg-white rounded-lg border border-stone-200 px-2 flex items-center text-slate-400 text-[11px]">
                      Mobile Number (+91) *
                    </div>
                    <div className="h-7 bg-white rounded-lg border border-stone-200 px-2 flex items-center text-slate-400 text-[11px]">
                      Preferred Date
                    </div>
                    <button
                      type="button"
                      className="w-full py-2 rounded-xl text-white font-bold text-xs"
                      style={{ backgroundColor: formColor }}
                    >
                      {formButtonText}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 7: REFERRAL PROGRAM                                  */}
      {/* ======================================================== */}
      {activeTab === "referrals" && (
        <div className="space-y-4">
          {!isReferralsUnlocked && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-3 text-xs text-amber-900">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <span>
                  <strong>Enterprise Plan Feature:</strong> Automated referral
                  reward payouts and loyalty voucher tracking require an
                  Enterprise plan.
                </span>
              </div>
            </div>
          )}

          {/* Referral KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Total Referred Inquiries
              </span>
              <div className="text-2xl font-bold text-slate-900">
                {referrals.length}
              </div>
              <span className="text-[10px] text-emerald-600 font-medium">
                Guest word-of-mouth
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Rewards Disbursed
              </span>
              <div className="text-2xl font-bold text-[#0F5132]">
                {formatINR(
                  referrals
                    .filter((r) => r.status === "Rewarded")
                    .reduce((acc, r) => acc + r.reward_amount, 0),
                )}
              </div>
              <span className="text-[10px] text-slate-500 font-medium">
                {referrals.filter((r) => r.status === "Rewarded").length}{" "}
                rewarded bookings
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Pending Escrow
              </span>
              <div className="text-2xl font-bold text-amber-600">
                {formatINR(
                  referrals
                    .filter((r) => r.status === "Pending")
                    .reduce((acc, r) => acc + r.reward_amount, 0),
                )}
              </div>
              <span className="text-[10px] text-slate-500 font-medium">
                Payable upon check-in
              </span>
            </div>
          </div>

          {/* Referrals Table & Action */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Guest Referral Ledger
                </h3>
                <p className="text-[11px] text-slate-500">
                  Track referrers, referred guests, voucher amounts, and reward
                  status.
                </p>
              </div>
              <button
                onClick={() => setIsAddReferralOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-[#0F5132] text-white text-xs font-bold hover:bg-[#0D4429] flex items-center gap-1.5 transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Log New Referral</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 uppercase font-semibold text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Referrer</th>
                    <th className="px-3 py-3">Referred Guest / Lead</th>
                    <th className="px-3 py-3">Reward Amount</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3">Remarks</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {referrals.map((ref) => (
                    <tr
                      key={ref.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="font-bold text-slate-900 block">
                          {ref.referrer_name}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {ref.referrer_phone}
                        </span>
                      </td>
                      <td className="px-3 py-3 font-semibold text-slate-800">
                        {ref.referred_lead_name}
                      </td>
                      <td className="px-3 py-3 font-bold text-[#0F5132]">
                        {formatINR(ref.reward_amount)}
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            ref.status === "Rewarded"
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : ref.status === "Pending"
                                ? "bg-amber-50 text-amber-800 border border-amber-200"
                                : "bg-rose-50 text-rose-800 border border-rose-200"
                          }`}
                        >
                          {ref.status}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-slate-600 max-w-xs truncate">
                        {ref.notes || "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {ref.status === "Pending" ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() =>
                                handleUpdateReferralStatus(ref.id, "Rewarded")
                              }
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[10px] hover:bg-emerald-700 transition-colors"
                            >
                              Reward
                            </button>
                            <button
                              onClick={() =>
                                handleUpdateReferralStatus(ref.id, "Rejected")
                              }
                              className="px-2 py-1 rounded-lg bg-slate-100 text-slate-600 hover:text-rose-600 font-bold text-[10px] transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-medium">
                            Closed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD LEAD SOURCE                                   */}
      {/* ======================================================== */}
      {isAddSourceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl border border-slate-200 space-y-4 text-xs animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Add Custom Acquisition Source
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Track performance for external and offline lead channels.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddSourceOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddSource} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Source Channel Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. WeddingWire, Outdoor Billboard"
                  value={newSourceName}
                  onChange={(e) => setNewSourceName(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-[#0F5132]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={newSourceCategory}
                  onChange={(e) => setNewSourceCategory(e.target.value as any)}
                  className="w-full h-9 px-3 rounded-xl border border-slate-200 font-medium bg-white focus:outline-none"
                >
                  <option value="Digital">Digital Marketing</option>
                  <option value="Offline">Offline / Event</option>
                  <option value="Referral">Referral / Partnership</option>
                  <option value="Direct">Direct / Walk-In</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Estimated Unit CPL (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={newSourceEstCpl}
                  onChange={(e) =>
                    setNewSourceEstCpl(Number(e.target.value) || 0)
                  }
                  className="w-full h-9 px-3 rounded-xl border border-slate-200 font-medium focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddSourceOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0F5132] text-white font-bold hover:bg-[#0D4429]"
                >
                  Save Source
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: CREATE CAMPAIGN                                   */}
      {/* ======================================================== */}
      {isCreateCampaignOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4 text-xs animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Launch New Marketing Campaign
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Set campaign budget, channel, promo voucher, and target cohort.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateCampaignOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Campaign Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Winter Snowfall Luxury Villa Retreat"
                  value={campName}
                  onChange={(e) => setCampName(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-[#0F5132]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Channel
                  </label>
                  <select
                    value={campChannel}
                    onChange={(e) => setCampChannel(e.target.value as any)}
                    className="w-full h-9 px-3 rounded-xl border border-slate-200 font-medium bg-white focus:outline-none"
                  >
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Google Ads">Google Ads</option>
                    <option value="Meta Ads">Meta Ads</option>
                    <option value="Email">Email</option>
                    <option value="SMS">SMS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Offer Coupon
                  </label>
                  <select
                    value={campOfferCode}
                    onChange={(e) => setCampOfferCode(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-slate-200 font-medium bg-white focus:outline-none"
                  >
                    <option value="">None (Standard)</option>
                    {coupons.map((c) => (
                      <option key={c.id} value={c.code}>
                        {c.code} (
                        {c.discount_type === "percentage"
                          ? `${c.discount_value}%`
                          : `₹${c.discount_value}`}
                        )
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Budget (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={campBudget}
                    onChange={(e) => setCampBudget(Number(e.target.value) || 0)}
                    className="w-full h-9 px-3 rounded-xl border border-slate-200 font-medium focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Initial Spend (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={campSpend}
                    onChange={(e) => setCampSpend(Number(e.target.value) || 0)}
                    className="w-full h-9 px-3 rounded-xl border border-slate-200 font-medium focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={campStartDate}
                    onChange={(e) => setCampStartDate(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-slate-200 font-medium focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={campEndDate}
                    onChange={(e) => setCampEndDate(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-slate-200 font-medium focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Target Audience Persona
                </label>
                <input
                  type="text"
                  placeholder="e.g. Metro tech executives, couples looking for anniversary packages"
                  value={campAudience}
                  onChange={(e) => setCampAudience(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-slate-200 font-medium focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Promotional Message Text
                </label>
                <textarea
                  rows={2}
                  placeholder="✨ Escape the city rush! Book your villa with complimentary spa..."
                  value={campMessage}
                  onChange={(e) => setCampMessage(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateCampaignOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0F5132] text-white font-bold hover:bg-[#0D4429]"
                >
                  Launch Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: CREATE COUPON                                     */}
      {/* ======================================================== */}
      {isCreateCouponOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4 text-xs animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Create Promotional Coupon Code
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Generate voucher codes with usage thresholds, stay minimums, and
                  discount slabs.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateCouponOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Coupon Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DIWALI25"
                    value={cpnCode}
                    onChange={(e) => setCpnCode(e.target.value.toUpperCase())}
                    className="w-full h-9 px-3 rounded-xl border border-slate-200 font-mono font-bold uppercase focus:outline-none focus:border-[#0F5132]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Discount Type
                  </label>
                  <select
                    value={cpnType}
                    onChange={(e) => setCpnType(e.target.value as any)}
                    className="w-full h-9 px-3 rounded-xl border border-slate-200 font-medium bg-white focus:outline-none"
                  >
                    <option value="percentage">% Percentage</option>
                    <option value="fixed">₹ Flat INR</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Discount Value {cpnType === "percentage" ? "(%)" : "(₹)"}
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={cpnValue}
                  onChange={(e) => setCpnValue(Number(e.target.value) || 0)}
                  className="w-full h-9 px-3 rounded-xl border border-slate-200 font-bold text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Offer Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. 25% Off on luxury private pool villas"
                  value={cpnDesc}
                  onChange={(e) => setCpnDesc(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-slate-200 font-medium focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Min Stay (Nights)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={cpnMinStay}
                    onChange={(e) => setCpnMinStay(Number(e.target.value) || 1)}
                    className="w-full h-9 px-3 rounded-xl border border-slate-200 font-medium focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Min Spend (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={cpnMinSpend}
                    onChange={(e) =>
                      setCpnMinSpend(Number(e.target.value) || 0)
                    }
                    className="w-full h-9 px-3 rounded-xl border border-slate-200 font-medium focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Valid From
                  </label>
                  <input
                    type="date"
                    value={cpnValidFrom}
                    onChange={(e) => setCpnValidFrom(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-slate-200 font-medium focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Valid To
                  </label>
                  <input
                    type="date"
                    value={cpnValidTo}
                    onChange={(e) => setCpnValidTo(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-slate-200 font-medium focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Usage Limit (Redemption Cap)
                </label>
                <input
                  type="number"
                  min="1"
                  value={cpnLimit}
                  onChange={(e) => setCpnLimit(Number(e.target.value) || 100)}
                  className="w-full h-9 px-3 rounded-xl border border-slate-200 font-medium focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateCouponOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0F5132] text-white font-bold hover:bg-[#0D4429]"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: BROADCAST COMPOSER                                */}
      {/* ======================================================== */}
      {isBroadcastModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4 text-xs animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Compose Guest Broadcast
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Send verified outbound messages with dynamic template
                  interpolation.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsBroadcastModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Broadcast Campaign Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Diwali Villa Flash WhatsApp Blast"
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-[#0F5132]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Outreach Channel
                  </label>
                  <select
                    value={broadcastChannel}
                    onChange={(e) => setBroadcastChannel(e.target.value as any)}
                    className="w-full h-9 px-3 rounded-xl border border-slate-200 font-medium bg-white focus:outline-none"
                  >
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Email">Email</option>
                    <option value="SMS">SMS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Audience Segment
                  </label>
                  <select
                    value={broadcastSegmentId}
                    onChange={(e) => setBroadcastSegmentId(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-slate-200 font-medium bg-white focus:outline-none"
                  >
                    {segments.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.member_count} members)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Template Select */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Choose Message Template (Optional)
                </label>
                <select
                  value={broadcastTemplateId}
                  onChange={(e) => handleTemplateSelect(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-slate-200 font-medium bg-white focus:outline-none"
                >
                  <option value="">Custom Message (Write below)</option>
                  {templates.map((t: MessageTemplate) => (
                    <option key={t.id} value={t.id}>
                      [{t.channel.toUpperCase()}] {t.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message Preview */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Message Content Preview
                </label>
                <textarea
                  rows={3}
                  value={broadcastMessagePreview}
                  onChange={(e) => setBroadcastMessagePreview(e.target.value)}
                  placeholder="Namaste {guest_name}! Exclusive holiday luxury package available..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none"
                />
              </div>

              {/* Estimated Reach Indicator */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                <span className="text-[11px] text-emerald-900 font-medium">
                  Estimated Audience Reach:
                </span>
                <span className="font-extrabold text-[#0F5132] text-xs">
                  {selectedSegment
                    ? `${selectedSegment.member_count} Verified Contacts`
                    : "25 Contacts"}
                </span>
              </div>

              {/* TRAI / DND Compliance Checkbox */}
              <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="optInCheck"
                    checked={broadcastOptInChecked}
                    onChange={(e) => setBroadcastOptInChecked(e.target.checked)}
                    className="mt-0.5 accent-[#0F5132] cursor-pointer"
                  />
                  <label
                    htmlFor="optInCheck"
                    className="text-[11px] font-semibold text-slate-800 leading-tight cursor-pointer"
                  >
                    TRAI / DND Compliance & Consent Acknowledgement *
                  </label>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed pl-5">
                  I confirm that all recipients in this segment have explicitly
                  provided consent for hospitality updates in accordance with
                  TRAI Commercial Communications Customer Preference Regulations
                  (TCCCPR 2018).
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsBroadcastModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!broadcastOptInChecked}
                  className={`px-4 py-2 rounded-xl text-white font-bold transition-colors ${
                    broadcastOptInChecked
                      ? "bg-[#0F5132] hover:bg-[#0D4429]"
                      : "bg-slate-300 cursor-not-allowed"
                  }`}
                >
                  Dispatch Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD REFERRAL                                      */}
      {/* ======================================================== */}
      {isAddReferralOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4 text-xs animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Record Guest Referral
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Credit word-of-mouth advocates and allocate reward credits.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddReferralOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddReferral} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Advocate / Referrer Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Radhika Sen"
                  value={refName}
                  onChange={(e) => setRefName(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-[#0F5132]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Referrer Mobile
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98450 11223"
                    value={refPhone}
                    onChange={(e) => setRefPhone(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-slate-200 font-medium focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Reward Value (₹)
                  </label>
                  <input
                    type="number"
                    min="500"
                    value={refReward}
                    onChange={(e) => setRefReward(Number(e.target.value) || 0)}
                    className="w-full h-9 px-3 rounded-xl border border-slate-200 font-bold text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Referred Guest / Inquiring Lead *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikramaditya Singhania"
                  value={refLeadName}
                  onChange={(e) => setRefLeadName(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-slate-200 font-medium focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Referral Inclusions / Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Referred for 3-day anniversary getaway..."
                  value={refNotes}
                  onChange={(e) => setRefNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddReferralOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0F5132] text-white font-bold hover:bg-[#0D4429]"
                >
                  Save Referral
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
