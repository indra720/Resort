import React, { useState, useEffect } from 'react';
import {
  Settings,
  Clock,
  AlertTriangle,
  Sliders,
  Users2,
  Webhook,
  Database,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Save,
  RotateCcw,
  ShieldCheck,
  Send,
  Download,
  Lock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Info,
  Check,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { canUse } from '@/lib/permissions';
import { toast } from '@/store/useToastStore';
import {
  getLostReasons,
  addLostReason,
  toggleLostReason,
  deleteLostReason,
  getSLAConfig,
  updateSLAConfig,
  getScoringWeights,
  updateScoringWeights,
  DEFAULT_SCORING_WEIGHTS,
  getIntegrationsConfig,
  updateIntegrationsConfig,
  testMockWebhook,
  exportFullCRMBackup,
  exportAllLeadsCSV,
} from '@/api/crmSettings';
import {
  getAutoAssignmentConfig,
  saveAutoAssignmentConfig,
} from '@/api/automations';
import {
  LostReasonConfig,
  SLAConfig,
  LeadScoringWeightConfig,
  CRMIntegrationsConfig,
  AutoAssignmentConfig,
} from '@/types/crm';

export const CRMSettingsPage: React.FC = () => {
  const { currentResort } = useAuthStore();
  const resortId = currentResort?.id || 'resort-1';

  const isSettingsUnlocked = canUse(currentResort, 'crm_settings');
  const isScoringUnlocked = canUse(currentResort, 'lead_scoring_editor');
  const isWebhooksUnlocked = canUse(currentResort, 'crm_webhooks');
  const isBackupUnlocked = canUse(currentResort, 'crm_export_backup');

  const [activeTab, setActiveTab] = useState<
    'sla' | 'lost_reasons' | 'scoring' | 'auto_assign' | 'integrations' | 'backup'
  >('sla');

  // 1. SLA State
  const [slaConfig, setSlaConfig] = useState<SLAConfig>(() => getSLAConfig(resortId));

  // 2. Lost Reasons State
  const [lostReasons, setLostReasons] = useState<LostReasonConfig[]>([]);
  const [newReasonText, setNewReasonText] = useState('');

  // 3. Scoring Weights State
  const [scoringWeights, setScoringWeights] = useState<LeadScoringWeightConfig>(() =>
    getScoringWeights(resortId)
  );

  // 4. Auto-Assign State
  const [autoAssignConfig, setAutoAssignConfig] = useState<AutoAssignmentConfig>(() =>
    getAutoAssignmentConfig(resortId)
  );

  // 5. Integrations State
  const [integrationsConfig, setIntegrationsConfig] = useState<CRMIntegrationsConfig>(() =>
    getIntegrationsConfig(resortId)
  );
  const [webhookLog, setWebhookLog] = useState<{
    service: string;
    message: string;
    timestamp: string;
  } | null>(null);

  // Simulator State for Lead Scoring preview
  const [simBudget, setSimBudget] = useState<number>(150000);
  const [simGuests, setSimGuests] = useState<number>(12);
  const [simSource, setSimSource] = useState<'Website' | 'Social' | 'Walk-in'>('Website');
  const [simDays, setSimDays] = useState<number>(10);
  const [simIsVip, setSimIsVip] = useState<boolean>(true);

  const loadData = () => {
    setSlaConfig(getSLAConfig(resortId));
    setLostReasons(getLostReasons(resortId));
    setScoringWeights(getScoringWeights(resortId));
    setAutoAssignConfig(getAutoAssignmentConfig(resortId));
    setIntegrationsConfig(getIntegrationsConfig(resortId));
  };

  useEffect(() => {
    loadData();
  }, [resortId]);

  // Tab 1: Save SLA
  const handleSaveSLA = () => {
    const res = updateSLAConfig(slaConfig, resortId);
    if (res.success) {
      toast.success('SLA Settings Saved', 'Response SLA targets have been updated.');
    } else {
      toast.error('Save Failed', res.error || 'Failed to update SLA');
    }
  };

  // Tab 2: Lost Reasons handlers
  const handleAddReason = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReasonText.trim()) return;
    const res = addLostReason(newReasonText.trim(), resortId);
    if (res.success) {
      setNewReasonText('');
      setLostReasons(getLostReasons(resortId));
      toast.success('Reason Added', `Added "${newReasonText.trim()}"`);
    } else {
      toast.error('Add Failed', res.error || 'Could not add reason');
    }
  };

  const handleToggleReason = (id: string) => {
    const res = toggleLostReason(id, resortId);
    if (res.success) {
      setLostReasons(getLostReasons(resortId));
      toast.info('Status Updated', 'Lost reason status toggled.');
    }
  };

  const handleDeleteReason = (id: string, reasonName: string) => {
    if (window.confirm(`Delete "${reasonName}"?`)) {
      const res = deleteLostReason(id, resortId);
      if (res.success) {
        setLostReasons(getLostReasons(resortId));
        toast.success('Deleted', `Removed "${reasonName}"`);
      }
    }
  };

  // Tab 3: Scoring handlers
  const handleSaveScoring = () => {
    const res = updateScoringWeights(scoringWeights, resortId);
    if (res.success) {
      toast.success('Scoring Weights Saved', 'Lead scoring algorithms updated.');
    } else {
      toast.error('Save Failed', res.error || 'Could not save scoring weights');
    }
  };

  const handleResetScoring = () => {
    setScoringWeights(DEFAULT_SCORING_WEIGHTS);
    updateScoringWeights(DEFAULT_SCORING_WEIGHTS, resortId);
    toast.info('Reset to Defaults', 'Scoring rule weights restored to factory presets.');
  };

  // Calculated score for live simulator
  const calculatedSimulatorScore = () => {
    let pts = 0;
    if (simBudget >= 100000) pts += scoringWeights.budget_high_weight;
    else if (simBudget >= 40000) pts += scoringWeights.budget_mid_weight;

    if (simGuests >= 8) pts += scoringWeights.large_party_weight;
    if (simSource === 'Website') pts += scoringWeights.high_intent_source_weight;
    if (simDays <= 14) pts += scoringWeights.urgent_date_weight;
    if (simIsVip) pts += scoringWeights.vip_tag_weight;

    let label: 'Hot' | 'Warm' | 'Cold' = 'Cold';
    if (pts >= 60) label = 'Hot';
    else if (pts >= 35) label = 'Warm';

    return { pts, label };
  };

  // Tab 4: Auto-assign handler
  const handleSaveAutoAssign = () => {
    saveAutoAssignmentConfig(resortId, autoAssignConfig);
    toast.success('Auto-Assignment Saved', 'Distribution routing rules updated.');
  };

  const handleToggleExecutive = (exec: string) => {
    const current = autoAssignConfig.active_executives;
    const exists = current.includes(exec);
    const updated = exists ? current.filter((e) => e !== exec) : [...current, exec];
    if (updated.length === 0) {
      toast.warning('Warning', 'At least one executive must be active.');
      return;
    }
    setAutoAssignConfig({ ...autoAssignConfig, active_executives: updated });
  };

  // Tab 5: Integrations Handlers
  const handleSaveIntegrations = () => {
    const res = updateIntegrationsConfig(integrationsConfig, resortId);
    if (res.success) {
      toast.success('Integrations Saved', 'Webhook tokens and API credentials updated.');
    }
  };

  const handleTestWebhook = (service: 'whatsapp' | 'meta' | 'sheets' | 'zapier') => {
    const res = testMockWebhook(service, resortId);
    setWebhookLog({
      service: service.toUpperCase(),
      message: res.message,
      timestamp: new Date(res.timestamp).toLocaleTimeString(),
    });
    setIntegrationsConfig(getIntegrationsConfig(resortId));
    toast.success('Test Dispatch Passed', res.message);
  };

  // Tab 6: Backup & Export Handlers
  const handleDownloadFullBackup = () => {
    try {
      const { filename, jsonContent } = exportFullCRMBackup(resortId);
      const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('Backup Downloaded', `Full CRM database exported (${filename}).`);
    } catch {
      toast.error('Backup Failed', 'Could not compile JSON archive.');
    }
  };

  const handleDownloadAllLeadsCSV = () => {
    try {
      const { filename, csvContent } = exportAllLeadsCSV(resortId);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('CSV Downloaded', `All leads exported (${filename}).`);
    } catch {
      toast.error('Export Failed', 'Could not compile CSV file.');
    }
  };

  if (!isSettingsUnlocked) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center mb-4 shadow-sm">
          <Lock className="w-8 h-8" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 mb-2">
          Pro & Enterprise Feature
        </span>
        <h2 className="text-2xl font-black text-[#0F172A] tracking-tight mb-2">
          CRM Configuration Desk is Locked
        </h2>
        <p className="text-xs sm:text-sm text-[#64748B] max-w-md mb-6 leading-relaxed">
          Configure response SLAs, custom lost reasons, round-robin auto-assignment, webhooks, and full data backups on the <strong>Pro Plan</strong>.
        </p>
        <button
          onClick={() => toast.info('Upgrade Plan', 'Please contact support or visit SaaS Billing.')}
          className="px-5 py-2.5 rounded-xl bg-[#0F5132] text-white font-bold text-sm shadow hover:bg-[#0c4128] transition-colors"
        >
          Upgrade to Pro
        </button>
      </div>
    );
  }

  const tabs: {
    id: typeof activeTab;
    label: string;
    icon: React.FC<{ className?: string }>;
    enterpriseOnly?: boolean;
  }[] = [
    { id: 'sla', label: 'Response SLA', icon: Clock },
    { id: 'lost_reasons', label: 'Lost Reasons', icon: AlertTriangle },
    { id: 'scoring', label: 'Lead Scoring', icon: Sliders, enterpriseOnly: true },
    { id: 'auto_assign', label: 'Auto-Assignment', icon: Users2 },
    { id: 'integrations', label: 'Webhooks & APIs', icon: Webhook, enterpriseOnly: true },
    { id: 'backup', label: 'Data Backup', icon: Database, enterpriseOnly: true },
  ];

  return (
    <div className="space-y-6 text-left pb-16">
      {/* Page Header */}
      <div className="border-b border-[#E2E8F0] pb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
            CRM Settings & Configuration
          </h1>
          <span className="bg-slate-100 text-slate-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-slate-300">
            Resort Admin
          </span>
        </div>
        <p className="text-xs sm:text-sm text-[#64748B] mt-1">
          Customize sales response SLAs, reasons for lost deals, rule weights, auto-assignment distribution, and integrations for{' '}
          <strong className="text-[#0F172A]">{currentResort?.name || 'Resort'}</strong>.
        </p>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[#E2E8F0] scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#0F5132] text-white shadow-2xs'
                  : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.enterpriseOnly && (
                <span
                  className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded ${
                    isActive ? 'bg-amber-400 text-amber-950' : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  Enterprise
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: Response SLA & Working Hours */}
      {activeTab === 'sla' && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-2xs space-y-6">
          <div className="border-b border-[#E2E8F0] pb-4">
            <h2 className="text-base sm:text-lg font-bold text-[#0F172A] flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#0F5132]" />
              Response SLA & Working Hours
            </h2>
            <p className="text-xs text-[#64748B]">
              Define mandatory first-contact time targets for sales executives to prevent lost enquiries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Target Response Time */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#0F172A]">
                Target Response Time (Minutes)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="5"
                  max="240"
                  value={slaConfig.target_response_minutes}
                  onChange={(e) =>
                    setSlaConfig({
                      ...slaConfig,
                      target_response_minutes: parseInt(e.target.value) || 30,
                    })
                  }
                  className="w-32 px-3 py-2 border border-[#CBD5E1] rounded-xl text-sm font-bold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                />
                <span className="text-xs text-[#64748B]">
                  Default standard is 30 minutes for hospitality inquiries.
                </span>
              </div>
            </div>

            {/* Warning Threshold */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#0F172A]">
                Warning Threshold (Minutes before Breach)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="3"
                  max="60"
                  value={slaConfig.warning_threshold_minutes}
                  onChange={(e) =>
                    setSlaConfig({
                      ...slaConfig,
                      warning_threshold_minutes: parseInt(e.target.value) || 15,
                    })
                  }
                  className="w-32 px-3 py-2 border border-[#CBD5E1] rounded-xl text-sm font-bold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
                />
                <span className="text-xs text-[#64748B]">
                  Highlight lead in amber when approaching deadline.
                </span>
              </div>
            </div>

            {/* Business Hours Toggle */}
            <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-[#0F172A] block">
                  Enforce Business Hours (9:00 AM - 7:00 PM IST)
                </span>
                <span className="text-[11px] text-[#64748B]">
                  Pause SLA timers outside business hours and during national holidays.
                </span>
              </div>
              <input
                type="checkbox"
                checked={slaConfig.business_hours_only}
                onChange={(e) =>
                  setSlaConfig({ ...slaConfig, business_hours_only: e.target.checked })
                }
                className="w-5 h-5 accent-[#0F5132] rounded cursor-pointer"
              />
            </div>

            {/* Notify on Breach Toggle */}
            <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-[#0F172A] block">
                  Notify Manager on SLA Breach
                </span>
                <span className="text-[11px] text-[#64748B]">
                  Send instant notification when a lead goes untouched beyond target time.
                </span>
              </div>
              <input
                type="checkbox"
                checked={slaConfig.notify_on_breach}
                onChange={(e) =>
                  setSlaConfig({ ...slaConfig, notify_on_breach: e.target.checked })
                }
                className="w-5 h-5 accent-[#0F5132] rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Live Preview Box */}
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
            <span className="text-xs font-bold text-[#0F5132] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> SLA Badge Preview in Lead Cards
            </span>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-lg border border-emerald-300">
                🟢 Fast Response (&lt;15m)
              </span>
              <span className="px-2.5 py-1 bg-amber-100 text-amber-800 font-bold text-xs rounded-lg border border-amber-300">
                🟡 Warning ({slaConfig.warning_threshold_minutes}m left)
              </span>
              <span className="px-2.5 py-1 bg-red-100 text-red-800 font-bold text-xs rounded-lg border border-red-300">
                🔴 SLA Breached (&gt;{slaConfig.target_response_minutes}m)
              </span>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleSaveSLA}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#0F5132] hover:bg-[#0c4128] text-white font-bold text-xs rounded-xl shadow-2xs transition-colors"
            >
              <Save className="w-4 h-4" />
              Save SLA Settings
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: Lost Reasons Manager */}
      {activeTab === 'lost_reasons' && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-2xs space-y-6">
          <div className="border-b border-[#E2E8F0] pb-4">
            <h2 className="text-base sm:text-lg font-bold text-[#0F172A] flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              Lost Reasons Manager
            </h2>
            <p className="text-xs text-[#64748B]">
              Standardized reasons prompted when sales executives move a lead to "Lost" stage.
            </p>
          </div>

          {/* Add New Reason Form */}
          <form onSubmit={handleAddReason} className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Destination wedding shifted to Goa..."
              value={newReasonText}
              onChange={(e) => setNewReasonText(e.target.value)}
              className="flex-1 px-3.5 py-2 text-xs border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5132]"
            />
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-[#0F5132] hover:bg-[#0c4128] text-white text-xs font-bold rounded-xl transition-colors shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              Add Reason
            </button>
          </form>

          {/* List of Reasons */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-xs font-bold text-[#64748B] px-2">
              <span>Reason Description</span>
              <span>Actions</span>
            </div>
            {lostReasons.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-xl border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleReason(item.id)}
                    className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      item.is_active
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {item.is_active ? 'Active' : 'Disabled'}
                  </button>
                  <span
                    className={`text-xs font-bold ${
                      item.is_active ? 'text-[#0F172A]' : 'text-[#94A3B8] line-through'
                    }`}
                  >
                    {item.reason}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleReason(item.id)}
                    className="text-xs text-[#64748B] hover:text-[#0F172A] font-semibold px-2 py-1"
                  >
                    {item.is_active ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    onClick={() => handleDeleteReason(item.id, item.reason)}
                    className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                    title="Delete Reason"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Lead Scoring Rule Weights (Enterprise) */}
      {activeTab === 'scoring' && (
        <>
          {!isScoringUnlocked ? (
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-[#0F172A]">Enterprise Feature</h3>
              <p className="text-xs text-[#64748B] max-w-md mx-auto">
                Dynamic Lead Scoring Weight configuration and AI rule adjustments are available on the <strong>Enterprise Plan</strong>.
              </p>
            </div>
          ) : (
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-2xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8F0] pb-4">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-[#0F172A] flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-[#0F5132]" />
                    Lead Scoring Rule Weights Editor
                  </h2>
                  <p className="text-xs text-[#64748B]">
                    Adjust algorithm point distribution used to qualify leads as Hot, Warm, or Cold.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResetScoring}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#64748B] hover:text-[#0F172A] border border-[#CBD5E1] rounded-xl hover:bg-[#F8FAFC]"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset
                  </button>
                  <button
                    onClick={handleSaveScoring}
                    className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold bg-[#0F5132] text-white rounded-xl shadow-2xs hover:bg-[#0c4128]"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Save Weights
                  </button>
                </div>
              </div>

              {/* Weight Sliders Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. High Budget */}
                <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-[#0F172A]">High Budget (&gt; ₹1 Lakh)</span>
                    <span className="font-black text-[#0F5132]">
                      +{scoringWeights.budget_high_weight} pts
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    value={scoringWeights.budget_high_weight}
                    onChange={(e) =>
                      setScoringWeights({
                        ...scoringWeights,
                        budget_high_weight: parseInt(e.target.value),
                      })
                    }
                    className="w-full accent-[#0F5132]"
                  />
                  <p className="text-[10px] text-[#64748B]">
                    Awarded when inquiry budget exceeds ₹1,00,000 INR.
                  </p>
                </div>

                {/* 2. Mid Budget */}
                <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-[#0F172A]">
                      Mid Budget (₹40,000 - ₹1 Lakh)
                    </span>
                    <span className="font-black text-[#0F5132]">
                      +{scoringWeights.budget_mid_weight} pts
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="40"
                    value={scoringWeights.budget_mid_weight}
                    onChange={(e) =>
                      setScoringWeights({
                        ...scoringWeights,
                        budget_mid_weight: parseInt(e.target.value),
                      })
                    }
                    className="w-full accent-[#0F5132]"
                  />
                  <p className="text-[10px] text-[#64748B]">
                    Standard weekend stay or multi-room villa bookings.
                  </p>
                </div>

                {/* 3. Large Party */}
                <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-[#0F172A]">
                      Large Group (&gt; 8 Guests)
                    </span>
                    <span className="font-black text-[#0F5132]">
                      +{scoringWeights.large_party_weight} pts
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="40"
                    value={scoringWeights.large_party_weight}
                    onChange={(e) =>
                      setScoringWeights({
                        ...scoringWeights,
                        large_party_weight: parseInt(e.target.value),
                      })
                    }
                    className="w-full accent-[#0F5132]"
                  />
                  <p className="text-[10px] text-[#64748B]">
                    Weddings, corporate offsites, and multi-family reunions.
                  </p>
                </div>

                {/* 4. High Intent Source */}
                <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-[#0F172A]">
                      High Intent Source (Direct / Referral)
                    </span>
                    <span className="font-black text-[#0F5132]">
                      +{scoringWeights.high_intent_source_weight} pts
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="40"
                    value={scoringWeights.high_intent_source_weight}
                    onChange={(e) =>
                      setScoringWeights({
                        ...scoringWeights,
                        high_intent_source_weight: parseInt(e.target.value),
                      })
                    }
                    className="w-full accent-[#0F5132]"
                  />
                  <p className="text-[10px] text-[#64748B]">
                    Direct website form or existing guest word-of-mouth referral.
                  </p>
                </div>

                {/* 5. Urgent Timeline */}
                <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-[#0F172A]">
                      Urgent Travel Date (&lt; 14 Days)
                    </span>
                    <span className="font-black text-[#0F5132]">
                      +{scoringWeights.urgent_date_weight} pts
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="40"
                    value={scoringWeights.urgent_date_weight}
                    onChange={(e) =>
                      setScoringWeights({
                        ...scoringWeights,
                        urgent_date_weight: parseInt(e.target.value),
                      })
                    }
                    className="w-full accent-[#0F5132]"
                  />
                  <p className="text-[10px] text-[#64748B]">
                    High urgency indicates imminent booking decision.
                  </p>
                </div>

                {/* 6. VIP Tag */}
                <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-[#0F172A]">
                      VIP / Corporate CXO Tag
                    </span>
                    <span className="font-black text-[#0F5132]">
                      +{scoringWeights.vip_tag_weight} pts
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    value={scoringWeights.vip_tag_weight}
                    onChange={(e) =>
                      setScoringWeights({
                        ...scoringWeights,
                        vip_tag_weight: parseInt(e.target.value),
                      })
                    }
                    className="w-full accent-[#0F5132]"
                  />
                  <p className="text-[10px] text-[#64748B]">
                    Manual VIP badge tagged by sales executives or GM.
                  </p>
                </div>
              </div>

              {/* Live Simulator Preview */}
              <div className="p-5 rounded-2xl border border-indigo-200 bg-indigo-50/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    Live Lead Scoring Simulator
                  </span>
                  {(() => {
                    const sim = calculatedSimulatorScore();
                    return (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-700">
                          Total Score: <strong>{sim.pts} pts</strong>
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                            sim.label === 'Hot'
                              ? 'bg-red-500 text-white'
                              : sim.label === 'Warm'
                              ? 'bg-amber-400 text-amber-950'
                              : 'bg-slate-300 text-slate-800'
                          }`}
                        >
                          {sim.label} Lead
                        </span>
                      </div>
                    );
                  })()}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1 text-xs">
                  <div>
                    <label className="text-[10px] text-[#64748B] font-semibold block">
                      Budget (₹)
                    </label>
                    <select
                      value={simBudget}
                      onChange={(e) => setSimBudget(parseInt(e.target.value))}
                      className="w-full p-1.5 bg-white border border-[#CBD5E1] rounded-lg font-semibold"
                    >
                      <option value={150000}>₹1,50,000</option>
                      <option value={60000}>₹60,000</option>
                      <option value={20000}>₹20,000</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-[#64748B] font-semibold block">
                      Guests
                    </label>
                    <select
                      value={simGuests}
                      onChange={(e) => setSimGuests(parseInt(e.target.value))}
                      className="w-full p-1.5 bg-white border border-[#CBD5E1] rounded-lg font-semibold"
                    >
                      <option value={12}>12 Guests</option>
                      <option value={4}>4 Guests</option>
                      <option value={2}>2 Guests</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-[#64748B] font-semibold block">
                      Source
                    </label>
                    <select
                      value={simSource}
                      onChange={(e) => setSimSource(e.target.value as any)}
                      className="w-full p-1.5 bg-white border border-[#CBD5E1] rounded-lg font-semibold"
                    >
                      <option value="Website">Direct Website</option>
                      <option value="Social">Meta Ads</option>
                      <option value="Walk-in">Walk-in</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-[#64748B] font-semibold block">
                      Days to Stay
                    </label>
                    <select
                      value={simDays}
                      onChange={(e) => setSimDays(parseInt(e.target.value))}
                      className="w-full p-1.5 bg-white border border-[#CBD5E1] rounded-lg font-semibold"
                    >
                      <option value={7}>7 Days (Urgent)</option>
                      <option value={30}>30 Days</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-[#64748B] font-semibold block">
                      VIP Tagged
                    </label>
                    <button
                      type="button"
                      onClick={() => setSimIsVip(!simIsVip)}
                      className={`w-full p-1.5 rounded-lg font-bold border ${
                        simIsVip
                          ? 'bg-amber-100 border-amber-300 text-amber-900'
                          : 'bg-white border-[#CBD5E1] text-[#64748B]'
                      }`}
                    >
                      {simIsVip ? 'VIP Yes' : 'No'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* TAB 4: Auto-Assignment Engine */}
      {activeTab === 'auto_assign' && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-2xs space-y-6">
          <div className="border-b border-[#E2E8F0] pb-4">
            <h2 className="text-base sm:text-lg font-bold text-[#0F172A] flex items-center gap-2">
              <Users2 className="w-5 h-5 text-[#0F5132]" />
              Auto-Assignment Routing Engine
            </h2>
            <p className="text-xs text-[#64748B]">
              Automatically allocate incoming web enquiries among active sales executives.
            </p>
          </div>

          <div className="space-y-4">
            {/* Enable toggle */}
            <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-[#0F172A] block">
                  Enable Lead Auto-Assignment
                </span>
                <span className="text-[11px] text-[#64748B]">
                  New inquiries from Website & Ads will be instantly assigned to sales reps.
                </span>
              </div>
              <input
                type="checkbox"
                checked={autoAssignConfig.enabled}
                onChange={(e) =>
                  setAutoAssignConfig({ ...autoAssignConfig, enabled: e.target.checked })
                }
                className="w-5 h-5 accent-[#0F5132] rounded cursor-pointer"
              />
            </div>

            {/* Mode selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#0F172A]">
                Distribution Logic
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() =>
                    setAutoAssignConfig({ ...autoAssignConfig, mode: 'round_robin' })
                  }
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    autoAssignConfig.mode === 'round_robin'
                      ? 'border-[#0F5132] bg-emerald-50/50 shadow-2xs'
                      : 'border-[#E2E8F0] hover:bg-[#F8FAFC]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#0F172A]">
                      Equal Round-Robin
                    </span>
                    {autoAssignConfig.mode === 'round_robin' && (
                      <CheckCircle2 className="w-4 h-4 text-[#0F5132]" />
                    )}
                  </div>
                  <p className="text-[11px] text-[#64748B] mt-1">
                    Equally balances active workload so all representatives receive equal volume.
                  </p>
                </div>

                <div
                  onClick={() =>
                    setAutoAssignConfig({ ...autoAssignConfig, mode: 'by_category' })
                  }
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    autoAssignConfig.mode === 'by_category'
                      ? 'border-[#0F5132] bg-emerald-50/50 shadow-2xs'
                      : 'border-[#E2E8F0] hover:bg-[#F8FAFC]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#0F172A]">
                      Category Specialization
                    </span>
                    {autoAssignConfig.mode === 'by_category' && (
                      <CheckCircle2 className="w-4 h-4 text-[#0F5132]" />
                    )}
                  </div>
                  <p className="text-[11px] text-[#64748B] mt-1">
                    Weddings routed to Pooja Sharma, Corporates to Sameer Verma, Adventures to Rohit Kumar.
                  </p>
                </div>
              </div>
            </div>

            {/* Active Executives Pool */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold text-[#0F172A]">
                Active Sales Representatives in Rotation Pool
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {['Sameer Verma', 'Pooja Sharma', 'Rohit Kumar', 'Ananya Sen'].map((exec) => {
                  const isChecked = autoAssignConfig.active_executives.includes(exec);
                  return (
                    <label
                      key={exec}
                      className="flex items-center gap-3 p-3 rounded-xl border border-[#E2E8F0] hover:bg-[#F8FAFC] cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleExecutive(exec)}
                        className="w-4 h-4 accent-[#0F5132] rounded"
                      />
                      <div>
                        <span className="text-xs font-bold text-[#0F172A] block">{exec}</span>
                        <span className="text-[10px] text-[#64748B]">Sales Executive</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleSaveAutoAssign}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#0F5132] hover:bg-[#0c4128] text-white font-bold text-xs rounded-xl shadow-2xs transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Routing Rules
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: Webhooks & Integrations (Enterprise) */}
      {activeTab === 'integrations' && (
        <>
          {!isWebhooksUnlocked ? (
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-[#0F172A]">Enterprise Feature</h3>
              <p className="text-xs text-[#64748B] max-w-md mx-auto">
                WhatsApp Cloud API, Meta Lead Ads Webhook syncing, and Zapier Webhooks are reserved for <strong>Enterprise Plan</strong> resorts.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Live Webhook Log Box */}
              {webhookLog && (
                <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-950 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>
                      [{webhookLog.timestamp}] <strong>{webhookLog.service}</strong>: {webhookLog.message}
                    </span>
                  </div>
                  <button
                    onClick={() => setWebhookLog(null)}
                    className="text-emerald-700 hover:text-emerald-900 font-bold"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* 1. WhatsApp Business Cloud API */}
                <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2.5">
                    <div>
                      <h3 className="text-sm font-bold text-[#0F172A]">
                        WhatsApp Business Cloud API
                      </h3>
                      <p className="text-[11px] text-[#64748B]">
                        Meta Graph API v20.0 direct connection
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        integrationsConfig.whatsapp_business.connected_status === 'Connected'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {integrationsConfig.whatsapp_business.connected_status}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-[#0F172A]">
                      Phone Number ID
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 109283746592019"
                      value={integrationsConfig.whatsapp_business.phone_number_id}
                      onChange={(e) =>
                        setIntegrationsConfig({
                          ...integrationsConfig,
                          whatsapp_business: {
                            ...integrationsConfig.whatsapp_business,
                            phone_number_id: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-1.5 text-xs border border-[#CBD5E1] rounded-lg"
                    />
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <button
                      onClick={() => handleTestWebhook('whatsapp')}
                      className="px-3 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] hover:bg-[#E2E8F0] text-xs font-semibold rounded-lg"
                    >
                      Test Ping
                    </button>
                    <button
                      onClick={handleSaveIntegrations}
                      className="px-3.5 py-1.5 bg-[#0F5132] text-white text-xs font-bold rounded-lg shadow-2xs hover:bg-[#0c4128]"
                    >
                      Save API
                    </button>
                  </div>
                </div>

                {/* 2. Meta Lead Ads Webhook */}
                <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2.5">
                    <div>
                      <h3 className="text-sm font-bold text-[#0F172A]">
                        Meta Lead Ads Webhook
                      </h3>
                      <p className="text-[11px] text-[#64748B]">
                        Instant ingestion of Facebook & Instagram leads
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        integrationsConfig.meta_lead_ads.connected_status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {integrationsConfig.meta_lead_ads.connected_status}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-[#0F172A]">
                      Facebook Page ID
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 108273645129384"
                      value={integrationsConfig.meta_lead_ads.page_id}
                      onChange={(e) =>
                        setIntegrationsConfig({
                          ...integrationsConfig,
                          meta_lead_ads: {
                            ...integrationsConfig.meta_lead_ads,
                            page_id: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-1.5 text-xs border border-[#CBD5E1] rounded-lg"
                    />
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <button
                      onClick={() => handleTestWebhook('meta')}
                      className="px-3 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] hover:bg-[#E2E8F0] text-xs font-semibold rounded-lg"
                    >
                      Verify Handshake
                    </button>
                    <button
                      onClick={handleSaveIntegrations}
                      className="px-3.5 py-1.5 bg-[#0F5132] text-white text-xs font-bold rounded-lg shadow-2xs hover:bg-[#0c4128]"
                    >
                      Save Webhook
                    </button>
                  </div>
                </div>

                {/* 3. Google Sheets 2-Way Sync */}
                <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2.5">
                    <div>
                      <h3 className="text-sm font-bold text-[#0F172A]">
                        Google Sheets Live Sync
                      </h3>
                      <p className="text-[11px] text-[#64748B]">
                        Mirror new leads into Google Sheets spreadsheet
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-[#0F172A]">
                      Spreadsheet ID
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                      value={integrationsConfig.google_sheets_sync.spreadsheet_id}
                      onChange={(e) =>
                        setIntegrationsConfig({
                          ...integrationsConfig,
                          google_sheets_sync: {
                            ...integrationsConfig.google_sheets_sync,
                            spreadsheet_id: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-1.5 text-xs border border-[#CBD5E1] rounded-lg"
                    />
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <button
                      onClick={() => handleTestWebhook('sheets')}
                      className="px-3 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] hover:bg-[#E2E8F0] text-xs font-semibold rounded-lg"
                    >
                      Sync Now
                    </button>
                    <button
                      onClick={handleSaveIntegrations}
                      className="px-3.5 py-1.5 bg-[#0F5132] text-white text-xs font-bold rounded-lg shadow-2xs hover:bg-[#0c4128]"
                    >
                      Save Sheets Config
                    </button>
                  </div>
                </div>

                {/* 4. Zapier Webhook Dispatch */}
                <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2.5">
                    <div>
                      <h3 className="text-sm font-bold text-[#0F172A]">
                        Zapier / Make Outbound Webhook
                      </h3>
                      <p className="text-[11px] text-[#64748B]">
                        Trigger external automations on new bookings
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-[#0F172A]">
                      Webhook URL
                    </label>
                    <input
                      type="text"
                      placeholder="https://hooks.zapier.com/hooks/catch/..."
                      value={integrationsConfig.zapier_webhook.webhook_url}
                      onChange={(e) =>
                        setIntegrationsConfig({
                          ...integrationsConfig,
                          zapier_webhook: {
                            ...integrationsConfig.zapier_webhook,
                            webhook_url: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-1.5 text-xs border border-[#CBD5E1] rounded-lg"
                    />
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <button
                      onClick={() => handleTestWebhook('zapier')}
                      className="px-3 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] hover:bg-[#E2E8F0] text-xs font-semibold rounded-lg"
                    >
                      Send Test Payload
                    </button>
                    <button
                      onClick={handleSaveIntegrations}
                      className="px-3.5 py-1.5 bg-[#0F5132] text-white text-xs font-bold rounded-lg shadow-2xs hover:bg-[#0c4128]"
                    >
                      Save Webhook
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* TAB 6: Data Backup & Full Export (Enterprise) */}
      {activeTab === 'backup' && (
        <>
          {!isBackupUnlocked ? (
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-[#0F172A]">Enterprise Feature</h3>
              <p className="text-xs text-[#64748B] max-w-md mx-auto">
                1-Click Full JSON CRM Database Backups and Complete Leads CSV archives are available on the <strong>Enterprise Plan</strong>.
              </p>
            </div>
          ) : (
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-2xs space-y-6">
              <div className="border-b border-[#E2E8F0] pb-4">
                <h2 className="text-base sm:text-lg font-bold text-[#0F172A] flex items-center gap-2">
                  <Database className="w-5 h-5 text-[#0F5132]" />
                  Data Ownership, Archival & Export
                </h2>
                <p className="text-xs text-[#64748B]">
                  Download complete raw backups of your leads, follow-ups, quotations, templates, campaigns, and settings.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* JSON Full Database Backup */}
                <div className="p-5 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-3 hover:border-emerald-300 transition-colors">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                    <Database className="w-5 h-5 text-[#0F5132]" />
                    Full CRM Database Backup (.JSON)
                  </div>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    Generates a complete snapshot containing all Leads, Follow-ups, Activity histories, Quotations, Message Templates, Campaigns, and Configurations.
                  </p>
                  <button
                    onClick={handleDownloadFullBackup}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#0F5132] hover:bg-[#0c4128] text-white text-xs font-bold rounded-xl transition-colors shadow-2xs w-full justify-center"
                  >
                    <Download className="w-4 h-4" />
                    Download Complete JSON Backup
                  </button>
                </div>

                {/* CSV Leads Master Export */}
                <div className="p-5 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-3 hover:border-emerald-300 transition-colors">
                  <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                    <Download className="w-5 h-5 text-indigo-600" />
                    Complete Leads Master Archive (.CSV)
                  </div>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    Formatted table spreadsheet containing all historical leads with contact numbers, email IDs, budget, score, tags, assigned executives, and status.
                  </p>
                  <button
                    onClick={handleDownloadAllLeadsCSV}
                    className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors shadow-2xs w-full justify-center"
                  >
                    <Download className="w-4 h-4" />
                    Download All Leads CSV
                  </button>
                </div>
              </div>

              {/* Compliance & Security badge */}
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5 text-xs">
                  <span className="font-bold text-blue-950 block">
                    DPDP Act 2023 & GDPR Compliance Note
                  </span>
                  <p className="text-blue-800 leading-relaxed">
                    Your resort data belongs entirely to you. Exports include guest consent timestamps and PII records for data portability requests.
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
