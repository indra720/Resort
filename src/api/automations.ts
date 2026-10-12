import {
  AutomationRule,
  AutomationLog,
  AutomationTrigger,
  AutoAssignmentConfig,
  Lead,
} from '@/types/crm';
import { User } from '@/types';
import { getDbItem, setDbItem, DB_KEYS } from './db';
import { addLeadActivity, updateLead } from './leads';
import { createFollowUp } from './followups';

/**
 * Get all automation rules for a resort
 */
export function getAutomationRules(resortId: string): AutomationRule[] {
  const rules = getDbItem<AutomationRule[]>(DB_KEYS.AUTOMATIONS, []);
  return rules.filter((r) => r.resort_id === resortId);
}

/**
 * Toggle active state of a rule
 */
export function toggleAutomationRule(
  id: string,
  resortId: string,
  isActive: boolean
): boolean {
  const rules = getDbItem<AutomationRule[]>(DB_KEYS.AUTOMATIONS, []);
  const idx = rules.findIndex((r) => r.id === id && r.resort_id === resortId);
  if (idx === -1) return false;

  rules[idx].is_active = isActive;
  setDbItem(DB_KEYS.AUTOMATIONS, rules);
  return true;
}

/**
 * Create a new automation rule
 */
export function createAutomationRule(
  data: Omit<AutomationRule, 'id' | 'resort_id' | 'created_at'>,
  resortId: string
): { success: boolean; rule?: AutomationRule; error?: string } {
  const rules = getDbItem<AutomationRule[]>(DB_KEYS.AUTOMATIONS, []);
  const newRule: AutomationRule = {
    ...data,
    id: `auto-${Date.now()}`,
    resort_id: resortId,
    created_at: new Date().toISOString(),
  };

  setDbItem(DB_KEYS.AUTOMATIONS, [newRule, ...rules]);
  return { success: true, rule: newRule };
}

/**
 * Delete an automation rule
 */
export function deleteAutomationRule(id: string, resortId: string): boolean {
  const rules = getDbItem<AutomationRule[]>(DB_KEYS.AUTOMATIONS, []);
  const filtered = rules.filter((r) => !(r.id === id && r.resort_id === resortId));
  if (filtered.length === rules.length) return false;
  setDbItem(DB_KEYS.AUTOMATIONS, filtered);
  return true;
}

/**
 * Get automation execution history logs
 */
export function getAutomationLogs(resortId: string): AutomationLog[] {
  const logs = getDbItem<AutomationLog[]>(DB_KEYS.AUTOMATION_LOGS, []);
  return logs.filter((l) => l.resort_id === resortId).slice(0, 50);
}

/**
 * Execute automation rules dynamically when an event happens
 */
export function triggerAutomationRules(
  triggerEvent: AutomationTrigger,
  context: {
    lead: Lead;
    oldStatus?: string;
    newStatus?: string;
    resortId: string;
    currentUser?: User | null;
  }
): AutomationLog[] {
  const rules = getAutomationRules(context.resortId).filter(
    (r) => r.is_active && r.trigger_event === triggerEvent
  );
  if (rules.length === 0) return [];

  const logs = getDbItem<AutomationLog[]>(DB_KEYS.AUTOMATION_LOGS, []);
  const executedLogs: AutomationLog[] = [];

  for (const rule of rules) {
    let shouldExecute = false;

    if (triggerEvent === 'status_changed') {
      if (!rule.trigger_condition || rule.trigger_condition.includes(context.newStatus || '')) {
        shouldExecute = true;
      }
    } else if (triggerEvent === 'high_budget') {
      const threshold = 200000;
      if (context.lead.budget_max >= threshold) {
        shouldExecute = true;
      }
    } else if (triggerEvent === 'lead_created') {
      shouldExecute = true;
    } else if (triggerEvent === 'idle_time') {
      shouldExecute = true;
    }

    if (shouldExecute) {
      let actionTaken = '';

      if (rule.action_type === 'create_followup') {
        const delayDays = rule.action_payload.delay_days || 2;
        const targetDate = new Date(Date.now() + delayDays * 86400000)
          .toISOString()
          .split('T')[0];

        createFollowUp(
          {
            lead_id: context.lead.id,
            lead_name: context.lead.name,
            lead_phone: context.lead.phone,
            title: rule.action_payload.title || 'Automated Follow-Up Reminder',
            channel: rule.action_payload.channel || 'call',
            due_date: targetDate,
            due_time: '11:00 AM',
            scheduled_at: `${targetDate} 11:00 AM`,
            assigned_to: context.lead.assigned_to,
            priority: 'Medium',
          },
          context.resortId,
          context.currentUser
        );
        actionTaken = `Created follow-up reminder for ${targetDate}`;
      } else if (rule.action_type === 'notify_manager') {
        addLeadActivity(context.lead.id, context.resortId, {
          actor_name: 'Automation Engine',
          actor_role: 'System',
          type: 'note',
          title: `Rule Triggered: ${rule.title}`,
          description: `System alert dispatched to General Manager: ${rule.description}`,
        });
        actionTaken = 'Manager notification queued';
      } else {
        actionTaken = `Executed action: ${rule.action_type}`;
      }

      const newLog: AutomationLog = {
        id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        resort_id: context.resortId,
        rule_id: rule.id,
        rule_title: rule.title,
        lead_id: context.lead.id,
        lead_name: context.lead.name,
        action_taken: actionTaken,
        timestamp: new Date().toISOString(),
      };

      executedLogs.push(newLog);
    }
  }

  if (executedLogs.length > 0) {
    setDbItem(DB_KEYS.AUTOMATION_LOGS, [...executedLogs, ...logs]);
  }

  return executedLogs;
}

/**
 * Auto-Assignment Configuration
 */
export function getAutoAssignmentConfig(resortId: string): AutoAssignmentConfig {
  const configs = getDbItem<Record<string, AutoAssignmentConfig>>(
    DB_KEYS.AUTO_ASSIGN_CONFIG,
    {} as any
  );
  if (configs[resortId]) {
    return configs[resortId];
  }
  return {
    enabled: true,
    mode: 'round_robin',
    active_executives: ['Sameer Verma', 'Pooja Sharma', 'Rohit Kumar', 'Ananya Sen'],
  };
}

export function saveAutoAssignmentConfig(
  resortId: string,
  config: AutoAssignmentConfig
): void {
  const configs = getDbItem<Record<string, AutoAssignmentConfig>>(
    DB_KEYS.AUTO_ASSIGN_CONFIG,
    {} as any
  );
  configs[resortId] = config;
  setDbItem(DB_KEYS.AUTO_ASSIGN_CONFIG, configs);
}

/**
 * Get Next Sales Executive according to auto-assignment rules
 */
export function getNextAssignedExecutive(resortId: string, category?: string): string {
  const config = getAutoAssignmentConfig(resortId);
  if (!config.enabled || config.active_executives.length === 0) {
    return 'Sameer Verma';
  }

  if (config.mode === 'by_category' && category) {
    if (category === 'Wedding') return 'Pooja Sharma';
    if (category === 'Corporate Event' || category === 'Conference') return 'Sameer Verma';
    if (category === 'Adventure Activities' || category === 'Nature Camp') return 'Rohit Kumar';
  }

  // Round robin: pick based on leads count or random from active
  const leads = getDbItem<Lead[]>(DB_KEYS.LEADS, []).filter((l) => l.resort_id === resortId);
  const counts: Record<string, number> = {};
  config.active_executives.forEach((e) => {
    counts[e] = 0;
  });

  leads.forEach((l) => {
    if (counts[l.assigned_to] !== undefined) {
      counts[l.assigned_to] += 1;
    }
  });

  // Pick executive with least leads
  let minExec = config.active_executives[0];
  let minCount = Infinity;
  for (const exec of config.active_executives) {
    if ((counts[exec] ?? 0) < minCount) {
      minCount = counts[exec] ?? 0;
      minExec = exec;
    }
  }

  return minExec;
}
