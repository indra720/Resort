import {
  LostReasonConfig,
  LeadScoringWeightConfig,
  SLAConfig,
  CRMIntegrationsConfig,
  AutoAssignmentConfig,
  Lead,
} from '@/types/crm';
import { DB_KEYS, getDbItem, setDbItem } from './db';
import {
  INITIAL_SEEDED_LOST_REASONS,
  INITIAL_SEEDED_SCORING_WEIGHTS,
  INITIAL_SEEDED_SLA_CONFIGS,
  INITIAL_SEEDED_INTEGRATIONS,
} from '@/data/seedSettings';
import { INITIAL_AUTO_ASSIGN_CONFIG } from '@/data/seedAdvancedCRM';
import { INITIAL_SEEDED_LEADS } from '@/data/seedLeads';

// ==========================================
// 1. Lost Reasons Management
// ==========================================

export function getLostReasons(resortId: string = 'resort-1'): LostReasonConfig[] {
  const all = getDbItem<LostReasonConfig[]>(DB_KEYS.LOST_REASONS, INITIAL_SEEDED_LOST_REASONS);
  return all.filter((r) => r.resort_id === resortId);
}

export function addLostReason(
  reason: string,
  resortId: string = 'resort-1',
  _user?: any
): { success: boolean; data?: LostReasonConfig; error?: string } {
  try {
    const trimmed = reason.trim();
    if (!trimmed) {
      return { success: false, error: 'Lost reason cannot be empty.' };
    }

    const all = getDbItem<LostReasonConfig[]>(DB_KEYS.LOST_REASONS, INITIAL_SEEDED_LOST_REASONS);
    const existing = all.find(
      (r) => r.resort_id === resortId && r.reason.toLowerCase() === trimmed.toLowerCase()
    );
    if (existing) {
      return { success: false, error: `Lost reason "${trimmed}" already exists.` };
    }

    const newReason: LostReasonConfig = {
      id: `lr-${Date.now().toString().slice(-6)}`,
      resort_id: resortId,
      reason: trimmed,
      is_active: true,
      created_at: new Date().toISOString(),
    };

    setDbItem(DB_KEYS.LOST_REASONS, [...all, newReason]);
    return { success: true, data: newReason };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to add lost reason' };
  }
}

export function toggleLostReason(
  id: string,
  resortId: string = 'resort-1',
  _user?: any
): { success: boolean; data?: LostReasonConfig; error?: string } {
  try {
    const all = getDbItem<LostReasonConfig[]>(DB_KEYS.LOST_REASONS, INITIAL_SEEDED_LOST_REASONS);
    const index = all.findIndex((r) => r.id === id && r.resort_id === resortId);
    if (index === -1) return { success: false, error: 'Lost reason not found' };

    all[index] = { ...all[index], is_active: !all[index].is_active };
    setDbItem(DB_KEYS.LOST_REASONS, all);
    return { success: true, data: all[index] };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to toggle lost reason' };
  }
}

export function deleteLostReason(
  id: string,
  resortId: string = 'resort-1',
  _user?: any
): { success: boolean; error?: string } {
  try {
    const all = getDbItem<LostReasonConfig[]>(DB_KEYS.LOST_REASONS, INITIAL_SEEDED_LOST_REASONS);
    const filtered = all.filter((r) => !(r.id === id && r.resort_id === resortId));
    if (filtered.length === all.length) return { success: false, error: 'Not found' };

    setDbItem(DB_KEYS.LOST_REASONS, filtered);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete' };
  }
}

// ==========================================
// 2. SLA Configuration
// ==========================================

export function getSLAConfig(resortId: string = 'resort-1'): SLAConfig {
  const all = getDbItem<SLAConfig[]>(DB_KEYS.SLA_CONFIG, INITIAL_SEEDED_SLA_CONFIGS);
  const found = all.find((c) => c.resort_id === resortId);
  return (
    found || {
      resort_id: resortId,
      target_response_minutes: 30,
      warning_threshold_minutes: 15,
      business_hours_only: false,
      notify_on_breach: true,
    }
  );
}

export function updateSLAConfig(
  config: Partial<SLAConfig>,
  resortId: string = 'resort-1',
  _user?: any
): { success: boolean; data?: SLAConfig; error?: string } {
  try {
    const all = getDbItem<SLAConfig[]>(DB_KEYS.SLA_CONFIG, INITIAL_SEEDED_SLA_CONFIGS);
    const index = all.findIndex((c) => c.resort_id === resortId);

    const current = getSLAConfig(resortId);
    const updated: SLAConfig = { ...current, ...config, resort_id: resortId };

    if (index >= 0) {
      all[index] = updated;
    } else {
      all.push(updated);
    }

    setDbItem(DB_KEYS.SLA_CONFIG, all);
    return { success: true, data: updated };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save SLA config' };
  }
}

// ==========================================
// 3. Lead Scoring Weights Editor
// ==========================================

export const DEFAULT_SCORING_WEIGHTS: LeadScoringWeightConfig = {
  budget_high_weight: 25,
  budget_mid_weight: 15,
  large_party_weight: 20,
  high_intent_source_weight: 15,
  urgent_date_weight: 15,
  vip_tag_weight: 10,
};

export function getScoringWeights(resortId: string = 'resort-1'): LeadScoringWeightConfig {
  const all = getDbItem<Record<string, LeadScoringWeightConfig>>(
    DB_KEYS.SCORING_WEIGHTS,
    INITIAL_SEEDED_SCORING_WEIGHTS
  );
  return all[resortId] || DEFAULT_SCORING_WEIGHTS;
}

export function updateScoringWeights(
  weights: Partial<LeadScoringWeightConfig>,
  resortId: string = 'resort-1',
  _user?: any
): { success: boolean; data?: LeadScoringWeightConfig; error?: string } {
  try {
    const all = getDbItem<Record<string, LeadScoringWeightConfig>>(
      DB_KEYS.SCORING_WEIGHTS,
      INITIAL_SEEDED_SCORING_WEIGHTS
    );

    const current = getScoringWeights(resortId);
    const updated: LeadScoringWeightConfig = { ...current, ...weights };

    all[resortId] = updated;
    setDbItem(DB_KEYS.SCORING_WEIGHTS, all);
    return { success: true, data: updated };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update scoring weights' };
  }
}

// ==========================================
// 4. Integrations & Webhook Mock Dispatch
// ==========================================

export function getIntegrationsConfig(resortId: string = 'resort-1'): CRMIntegrationsConfig {
  const all = getDbItem<CRMIntegrationsConfig[]>(
    DB_KEYS.INTEGRATIONS,
    INITIAL_SEEDED_INTEGRATIONS
  );
  const found = all.find((i) => i.resort_id === resortId);
  return (
    found || {
      resort_id: resortId,
      whatsapp_business: {
        enabled: false,
        phone_number_id: '',
        api_version: 'v20.0',
        connected_status: 'Disconnected',
      },
      meta_lead_ads: {
        enabled: false,
        page_id: '',
        webhook_verify_token: 'joy_resort_meta_token',
        connected_status: 'Inactive',
      },
      google_sheets_sync: {
        enabled: false,
        spreadsheet_id: '',
        sheet_name: 'Leads',
        auto_sync_on_create: false,
      },
      zapier_webhook: {
        enabled: false,
        webhook_url: '',
      },
    }
  );
}

export function updateIntegrationsConfig(
  config: Partial<CRMIntegrationsConfig>,
  resortId: string = 'resort-1',
  _user?: any
): { success: boolean; data?: CRMIntegrationsConfig; error?: string } {
  try {
    const all = getDbItem<CRMIntegrationsConfig[]>(
      DB_KEYS.INTEGRATIONS,
      INITIAL_SEEDED_INTEGRATIONS
    );
    const index = all.findIndex((i) => i.resort_id === resortId);
    const current = getIntegrationsConfig(resortId);

    const updated: CRMIntegrationsConfig = {
      ...current,
      ...config,
      resort_id: resortId,
    };

    if (index >= 0) {
      all[index] = updated;
    } else {
      all.push(updated);
    }

    setDbItem(DB_KEYS.INTEGRATIONS, all);
    return { success: true, data: updated };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save integrations config' };
  }
}

export function testMockWebhook(
  service: 'whatsapp' | 'meta' | 'sheets' | 'zapier',
  resortId: string = 'resort-1'
): { success: boolean; message: string; timestamp: string } {
  const current = getIntegrationsConfig(resortId);
  const now = new Date().toISOString();

  if (service === 'whatsapp') {
    current.whatsapp_business.connected_status = 'Connected';
    current.whatsapp_business.last_ping_at = now;
    updateIntegrationsConfig(current, resortId);
    return {
      success: true,
      message: 'WhatsApp Cloud API Ping: HTTP 200 OK. Phone Number ID verified.',
      timestamp: now,
    };
  } else if (service === 'meta') {
    current.meta_lead_ads.connected_status = 'Active';
    current.meta_lead_ads.last_lead_received_at = now;
    updateIntegrationsConfig(current, resortId);
    return {
      success: true,
      message: 'Meta Webhook Handshake Verified: challenge accepted & token match.',
      timestamp: now,
    };
  } else if (service === 'sheets') {
    current.google_sheets_sync.last_synced_at = now;
    updateIntegrationsConfig(current, resortId);
    return {
      success: true,
      message: 'Google Sheets API: OAuth2 token active, 42 rows synchronized.',
      timestamp: now,
    };
  } else {
    return {
      success: true,
      message: 'Zapier Webhook Payload Dispatched: HTTP 200 Received.',
      timestamp: now,
    };
  }
}

// ==========================================
// 5. Full CRM Data Backup (JSON) & Leads CSV Export
// ==========================================

export function exportFullCRMBackup(resortId: string = 'resort-1'): {
  filename: string;
  jsonContent: string;
} {
  const leads = getDbItem<any[]>(DB_KEYS.LEADS, []).filter((l) => l.resort_id === resortId);
  const followups = getDbItem<any[]>(DB_KEYS.FOLLOWUPS, []).filter((f) => f.resort_id === resortId);
  const activities = getDbItem<any[]>(DB_KEYS.ACTIVITIES, []).filter((a) => a.resort_id === resortId);
  const quotations = getDbItem<any[]>(DB_KEYS.QUOTATIONS, []).filter((q) => q.resort_id === resortId);
  const templates = getDbItem<any[]>(DB_KEYS.TEMPLATES, []).filter((t) => t.resort_id === resortId);
  const campaigns = getDbItem<any[]>(DB_KEYS.CAMPAIGNS, []).filter((c) => c.resort_id === resortId);
  const coupons = getDbItem<any[]>(DB_KEYS.COUPONS, []).filter((c) => c.resort_id === resortId);
  const referrals = getDbItem<any[]>(DB_KEYS.REFERRALS, []).filter((r) => r.resort_id === resortId);
  const settings = {
    sla: getSLAConfig(resortId),
    scoring: getScoringWeights(resortId),
    integrations: getIntegrationsConfig(resortId),
  };

  const backupObj = {
    app: 'JOY Resorts SaaS CRM',
    resort_id: resortId,
    exported_at: new Date().toISOString(),
    version: '2.0.0',
    data: {
      leads,
      followups,
      activities,
      quotations,
      templates,
      campaigns,
      coupons,
      referrals,
      settings,
    },
  };

  const dateStr = new Date().toISOString().slice(0, 10);
  return {
    filename: `JOY_Resorts_${resortId}_CRM_Backup_${dateStr}.json`,
    jsonContent: JSON.stringify(backupObj, null, 2),
  };
}

export function exportAllLeadsCSV(resortId: string = 'resort-1'): {
  filename: string;
  csvContent: string;
} {
  const leads = getDbItem<Lead[]>(DB_KEYS.LEADS, INITIAL_SEEDED_LEADS).filter(
    (l) => l.resort_id === resortId
  );

  const headers = [
    'Lead Code',
    'Full Name',
    'Mobile Number',
    'Email Address',
    'City',
    'Interested In',
    'Adults',
    'Children',
    'Preferred Date',
    'Budget Min INR',
    'Budget Max INR',
    'Source Channel',
    'Status',
    'Priority',
    'Lead Score',
    'Assigned To',
    'Created Date',
    'Lost Reason',
    'Remarks',
  ].join(',');

  const rows = leads.map((l) =>
    [
      `"${l.lead_code || l.id}"`,
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.phone}"`,
      `"${l.email}"`,
      `"${l.city}"`,
      `"${l.interested_in}"`,
      l.guests_adults || 2,
      l.guests_children || 0,
      `"${l.preferred_date}"`,
      l.budget_min || 0,
      l.budget_max || 0,
      `"${l.source}"`,
      `"${l.status}"`,
      `"${l.priority}"`,
      `"${l.score}"`,
      `"${l.assigned_to}"`,
      `"${l.created_at}"`,
      `"${(l.lost_reason || '').replace(/"/g, '""')}"`,
      `"${(l.remarks || '').replace(/"/g, '""')}"`,
    ].join(',')
  );

  const dateStr = new Date().toISOString().slice(0, 10);
  return {
    filename: `JOY_Resorts_${resortId}_Leads_Export_${dateStr}.csv`,
    csvContent: headers + '\n' + rows.join('\n'),
  };
}
