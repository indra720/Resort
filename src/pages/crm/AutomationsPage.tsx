import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap,
  Plus,
  Play,
  RotateCw,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  Lock,
  History,
  Trash2,
  Sliders,
  AlertCircle,
  Bell,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { AutomationRule, AutomationLog, AutoAssignmentConfig } from '@/types/crm';
import {
  getAutomationRules,
  toggleAutomationRule,
  createAutomationRule,
  deleteAutomationRule,
  getAutomationLogs,
  getAutoAssignmentConfig,
  saveAutoAssignmentConfig,
} from '@/api/automations';
import { canUse } from '@/lib/permissions';
import { toast } from '@/store/useToastStore';

export const AutomationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentResort } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'rules' | 'assignment' | 'logs'>('rules');

  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [logs, setLogs] = useState<AutomationLog[]>([]);
  const [assignConfig, setAssignConfig] = useState<AutoAssignmentConfig>(getAutoAssignmentConfig(currentResort.id));

  // Create rule modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [ruleTitle, setRuleTitle] = useState('');
  const [ruleDescription, setRuleDescription] = useState('');
  const [triggerEvent, setTriggerEvent] = useState<AutomationRule['trigger_event']>('status_changed');
  const [actionType, setActionType] = useState<AutomationRule['action_type']>('create_followup');
  const [conditionText, setConditionText] = useState('new_status == "Site Visit"');

  const loadData = () => {
    setRules(getAutomationRules(currentResort.id));
    setLogs(getAutomationLogs(currentResort.id));
    setAssignConfig(getAutoAssignmentConfig(currentResort.id));
  };

  useEffect(() => {
    loadData();
  }, [currentResort.id]);

  const isAutomationsUnlocked = canUse(currentResort, 'automations');

  const handleToggleRule = (id: string, currentStatus: boolean) => {
    toggleAutomationRule(id, currentResort.id, !currentStatus);
    toast.success('Rule Status Updated', `Automation rule is now ${!currentStatus ? 'Active' : 'Paused'}.`);
    loadData();
  };

  const handleDeleteRule = (id: string, title: string) => {
    if (window.confirm(`Delete rule "${title}"?`)) {
      deleteAutomationRule(id, currentResort.id);
      toast.success('Rule Deleted', `${title} removed.`);
      loadData();
    }
  };

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleTitle.trim()) return;

    createAutomationRule(
      {
        title: ruleTitle.trim(),
        description: ruleDescription.trim() || 'Custom automated workflow for guest response.',
        trigger_event: triggerEvent,
        trigger_condition: conditionText.trim(),
        action_type: actionType,
        action_payload: { delay_days: 2 },
        is_active: true,
      },
      currentResort.id
    );

    toast.success('Automation Rule Created', `Active: "${ruleTitle}"`);
    setIsCreateOpen(false);
    setRuleTitle('');
    setRuleDescription('');
    loadData();
  };

  const handleToggleExecutive = (execName: string) => {
    const list = assignConfig.active_executives.includes(execName)
      ? assignConfig.active_executives.filter((e) => e !== execName)
      : [...assignConfig.active_executives, execName];

    const updated = { ...assignConfig, active_executives: list };
    setAssignConfig(updated);
    saveAutoAssignmentConfig(currentResort.id, updated);
    toast.success('Auto-Assignment Updated', `Roster updated for ${execName}.`);
  };

  const handleModeChange = (mode: 'round_robin' | 'by_category') => {
    const updated = { ...assignConfig, mode };
    setAssignConfig(updated);
    saveAutoAssignmentConfig(currentResort.id, updated);
    toast.success('Mode Changed', `Set assignment routing to ${mode === 'round_robin' ? 'Round Robin' : 'Specialization by Event Type'}.`);
  };

  if (!isAutomationsUnlocked) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center mb-4 shadow-sm">
          <Lock className="w-8 h-8" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 mb-2">
          Pro & Enterprise Feature
        </span>
        <h2 className="text-2xl font-black text-[#0F172A] tracking-tight mb-2">
          Sales Automations & SLA Rules are Locked
        </h2>
        <p className="text-xs sm:text-sm text-[#64748B] max-w-md mb-6 leading-relaxed">
          The event-driven sales automation engine, auto-assignment router, and SLA escalation alerts are available on the <strong>Pro Plan</strong>.
        </p>
        <button
          type="button"
          onClick={() => navigate('/subscription')}
          className="px-5 py-2.5 bg-[#0F5132] hover:bg-[#0B3D25] text-white rounded-xl text-xs sm:text-sm font-bold shadow-2xs transition-colors"
        >
          Upgrade to Pro
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5 text-left text-[#0F172A]">
      
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#0F172A] flex items-center gap-2">
              <Zap className="w-6 h-6 text-[#0F5132]" />
              <span>Sales Automations & Routing</span>
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#0F5132] font-semibold border border-emerald-200">
              {currentResort.name}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Configure "When... Then..." workflows, round-robin auto assignment, and SLA alerts.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#0F5132] hover:bg-[#0B3D25] text-white rounded-xl text-xs sm:text-sm font-bold shadow-2xs transition-colors shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Automation Rule</span>
        </button>
      </div>

      {/* 2. Sub-tabs */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-1.5 sm:p-2 shadow-2xs flex items-center gap-1 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('rules')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'rules'
              ? 'bg-[#0F5132] text-white shadow-2xs'
              : 'text-[#475569] hover:bg-[#F8FAFC]'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Automation Rules</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-800 font-bold">
            {rules.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('assignment')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'assignment'
              ? 'bg-[#0F5132] text-white shadow-2xs'
              : 'text-[#475569] hover:bg-[#F8FAFC]'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Auto-Assignment Router</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('logs')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'logs'
              ? 'bg-[#0F5132] text-white shadow-2xs'
              : 'text-[#475569] hover:bg-[#F8FAFC]'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Execution History Logs</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-800 font-bold">
            {logs.length}
          </span>
        </button>
      </div>

      {/* 3. TAB 1: AUTOMATION RULES CARDS */}
      {activeTab === 'rules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all shadow-2xs flex flex-col justify-between space-y-4 ${
                rule.is_active
                  ? 'bg-white border-[#E2E8F0]'
                  : 'bg-slate-50/70 border-slate-200 opacity-70'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      {rule.trigger_event.replace('_', ' ').toUpperCase()}
                    </span>
                    {rule.is_active ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        Active
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                        Paused
                      </span>
                    )}
                  </div>

                  {/* Toggle Switch */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rule.is_active}
                      onChange={() => handleToggleRule(rule.id, rule.is_active)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0F5132]"></div>
                  </label>
                </div>

                <h3 className="text-sm font-bold text-[#0F172A]">{rule.title}</h3>
                <p className="text-xs text-[#64748B] mt-1 leading-relaxed">{rule.description}</p>

                {/* When -> Then Logic Block */}
                <div className="mt-3 p-3 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-xs space-y-1.5 font-mono">
                  <div className="flex items-center gap-2 text-indigo-700">
                    <strong className="text-[11px] uppercase tracking-wider">WHEN:</strong>
                    <span>{rule.trigger_event} ({rule.trigger_condition || 'All cases'})</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-800">
                    <strong className="text-[11px] uppercase tracking-wider">THEN:</strong>
                    <span>{rule.action_type}</span>
                  </div>
                </div>
              </div>

              {/* Bottom footer */}
              <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-[11px] text-[#64748B]">
                <span>
                  {rule.last_triggered_at
                    ? `Last triggered: ${new Date(rule.last_triggered_at).toLocaleDateString()}`
                    : 'Awaiting trigger'}
                </span>
                <button
                  type="button"
                  onClick={() => handleDeleteRule(rule.id, rule.title)}
                  className="text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. TAB 2: AUTO-ASSIGNMENT ROUTER */}
      {activeTab === 'assignment' && (
        <div className="space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-[#0F172A]">Lead Routing Strategy</h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                Automatically allocate newly created enquiries from website, phone, and OTAs among sales representatives.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div
                onClick={() => handleModeChange('round_robin')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  assignConfig.mode === 'round_robin'
                    ? 'border-[#0F5132] bg-emerald-50/50'
                    : 'border-[#E2E8F0] hover:bg-[#F8FAFC]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[#0F172A]">Fair Round Robin</span>
                  {assignConfig.mode === 'round_robin' && (
                    <CheckCircle2 className="w-4 h-4 text-[#0F5132]" />
                  )}
                </div>
                <p className="text-[#64748B]">
                  Equally balances the sales workload by assigning every incoming enquiry to the active executive with the fewest active leads.
                </p>
              </div>

              <div
                onClick={() => handleModeChange('by_category')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  assignConfig.mode === 'by_category'
                    ? 'border-[#0F5132] bg-emerald-50/50'
                    : 'border-[#E2E8F0] hover:bg-[#F8FAFC]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[#0F172A]">Specialized by Event / Package</span>
                  {assignConfig.mode === 'by_category' && (
                    <CheckCircle2 className="w-4 h-4 text-[#0F5132]" />
                  )}
                </div>
                <p className="text-[#64748B]">
                  Routes high-ticket Weddings to Banquet Specialists (Pooja), Corporate retreats to B2B Reps (Sameer), and Camps to Rohit.
                </p>
              </div>
            </div>
          </div>

          {/* Active Sales Reps Roster */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-3">
            <div>
              <h3 className="text-sm font-bold text-[#0F172A]">Active Sales Representatives Roster</h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                Toggle sales executives who are currently active and available to receive new incoming leads.
              </p>
            </div>

            <div className="divide-y divide-[#E2E8F0]">
              {[
                { name: 'Sameer Verma', role: 'Senior Sales Executive', specialty: 'Corporate Offsites & Villas' },
                { name: 'Pooja Sharma', role: 'Wedding & Banquet Specialist', specialty: 'Destination Weddings' },
                { name: 'Rohit Kumar', role: 'Sales Executive', specialty: 'Family & Weekend Leisure' },
                { name: 'Ananya Sen', role: 'Guest Relations Rep', specialty: 'Wellness & Nature Camps' },
              ].map((rep) => {
                const isActive = assignConfig.active_executives.includes(rep.name);
                return (
                  <div key={rep.name} className="py-3 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="font-bold text-[#0F172A] block">{rep.name}</span>
                      <span className="text-[11px] text-[#64748B]">
                        {rep.role} • Specialty: {rep.specialty}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleExecutive(rep.name)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-100 text-slate-600 border border-slate-300'
                      }`}
                    >
                      {isActive ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : null}
                      <span>{isActive ? 'Receiving Leads' : 'On Leave / Paused'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB 3: EXECUTION LOGS */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#0F172A]">Live Rule Execution Audit Log</h3>
            <span className="text-xs text-[#64748B]">{logs.length} logged trigger events</span>
          </div>

          {logs.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#64748B]">
              No automation actions logged yet. Events will appear here as rules fire.
            </div>
          ) : (
            <div className="divide-y divide-[#E2E8F0] text-xs">
              {logs.map((log) => (
                <div key={log.id} className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-[#F8FAFC]">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-[#0F172A]">{log.rule_title}</span>
                      <span className="text-[11px] font-semibold text-[#0F5132] px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                        Lead: {log.lead_name}
                      </span>
                    </div>
                    <p className="text-xs text-[#475569] mt-0.5">{log.action_taken}</p>
                  </div>
                  <span className="text-[11px] text-[#94A3B8] shrink-0 font-medium">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create Rule Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-[#CBD5E1] space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#0F5132]" />
                <span>Create Automation Rule</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="p-1 rounded-xl text-[#64748B] hover:text-[#0F172A]"
              >
                X
              </button>
            </div>

            <form onSubmit={handleCreateRule} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-[#475569] mb-1">Rule Title *</label>
                <input
                  type="text"
                  required
                  value={ruleTitle}
                  onChange={(e) => setRuleTitle(e.target.value)}
                  placeholder="e.g. Alert Manager on Wedding Lead"
                  className="w-full h-9 px-3 rounded-xl bg-white border border-[#CBD5E1] font-medium focus:outline-none focus:border-[#0F5132]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#475569] mb-1">Description</label>
                <input
                  type="text"
                  value={ruleDescription}
                  onChange={(e) => setRuleDescription(e.target.value)}
                  placeholder="What does this rule automate?"
                  className="w-full h-9 px-3 rounded-xl bg-white border border-[#CBD5E1] font-medium focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#475569] mb-1">Trigger Event (When)</label>
                  <select
                    value={triggerEvent}
                    onChange={(e) => setTriggerEvent(e.target.value as any)}
                    className="w-full h-9 px-3 rounded-xl bg-white border border-[#CBD5E1] font-medium focus:outline-none"
                  >
                    <option value="status_changed">Status Changed</option>
                    <option value="lead_created">New Lead Created</option>
                    <option value="high_budget">High Budget Arrived</option>
                    <option value="idle_time">Idle SLA Elapsed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#475569] mb-1">Action (Then)</label>
                  <select
                    value={actionType}
                    onChange={(e) => setActionType(e.target.value as any)}
                    className="w-full h-9 px-3 rounded-xl bg-white border border-[#CBD5E1] font-medium focus:outline-none"
                  >
                    <option value="create_followup">Schedule Follow-up</option>
                    <option value="notify_manager">Alert General Manager</option>
                    <option value="assign_lead">Assign to Rep</option>
                    <option value="send_template">Send WhatsApp Template</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#475569] mb-1">Condition</label>
                <input
                  type="text"
                  value={conditionText}
                  onChange={(e) => setConditionText(e.target.value)}
                  placeholder="e.g. new_status == 'Site Visit'"
                  className="w-full h-9 px-3 rounded-xl bg-white border border-[#CBD5E1] font-mono text-xs focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs font-semibold text-[#475569]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0F5132] hover:bg-[#0B3D25] text-white rounded-xl text-xs font-bold shadow-2xs"
                >
                  Create Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
