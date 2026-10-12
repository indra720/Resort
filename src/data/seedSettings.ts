import {
  LostReasonConfig,
  LeadScoringWeightConfig,
  SLAConfig,
  CRMIntegrationsConfig,
} from '@/types/crm';

export const INITIAL_SEEDED_LOST_REASONS: LostReasonConfig[] = [
  {
    id: 'lr-001',
    resort_id: 'resort-1',
    reason: 'Too expensive / Quote above budget',
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'lr-002',
    resort_id: 'resort-1',
    reason: 'Chose competitor property',
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'lr-003',
    resort_id: 'resort-1',
    reason: 'Preferred dates not available',
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'lr-004',
    resort_id: 'resort-1',
    reason: 'Client unresponsive / No show',
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'lr-005',
    resort_id: 'resort-1',
    reason: 'Event cancelled / postponed',
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'lr-006',
    resort_id: 'resort-1',
    reason: 'Location / distance constraint',
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
  },
  // resort-2
  {
    id: 'lr-007',
    resort_id: 'resort-2',
    reason: 'Too expensive / Quote above budget',
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'lr-008',
    resort_id: 'resort-2',
    reason: 'Preferred dates not available',
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
  },
];

export const INITIAL_SEEDED_SCORING_WEIGHTS: Record<string, LeadScoringWeightConfig> = {
  'resort-1': {
    budget_high_weight: 25,
    budget_mid_weight: 15,
    large_party_weight: 20,
    high_intent_source_weight: 15,
    urgent_date_weight: 15,
    vip_tag_weight: 10,
  },
  'resort-2': {
    budget_high_weight: 25,
    budget_mid_weight: 15,
    large_party_weight: 20,
    high_intent_source_weight: 15,
    urgent_date_weight: 15,
    vip_tag_weight: 10,
  },
};

export const INITIAL_SEEDED_SLA_CONFIGS: SLAConfig[] = [
  {
    resort_id: 'resort-1',
    target_response_minutes: 30,
    warning_threshold_minutes: 15,
    business_hours_only: false,
    notify_on_breach: true,
  },
  {
    resort_id: 'resort-2',
    target_response_minutes: 45,
    warning_threshold_minutes: 20,
    business_hours_only: false,
    notify_on_breach: true,
  },
];

export const INITIAL_SEEDED_INTEGRATIONS: CRMIntegrationsConfig[] = [
  {
    resort_id: 'resort-1',
    whatsapp_business: {
      enabled: true,
      phone_number_id: '109823485723912',
      api_version: 'v20.0',
      connected_status: 'Connected',
      last_ping_at: '2026-10-12T10:30:00Z',
    },
    meta_lead_ads: {
      enabled: true,
      page_id: 'joyresorts_official',
      form_id: 'form_festive_escape_2026',
      webhook_verify_token: 'joy_meta_secure_token_8892',
      connected_status: 'Active',
      last_lead_received_at: '2026-10-12T09:15:00Z',
    },
    google_sheets_sync: {
      enabled: true,
      spreadsheet_id: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
      sheet_name: 'Joy_Resorts_Leads_2026',
      auto_sync_on_create: true,
      last_synced_at: '2026-10-12T11:00:00Z',
    },
    zapier_webhook: {
      enabled: false,
      webhook_url: 'https://hooks.zapier.com/hooks/catch/1982345/joylead/',
    },
  },
  {
    resort_id: 'resort-2',
    whatsapp_business: {
      enabled: true,
      phone_number_id: '109823485723913',
      api_version: 'v20.0',
      connected_status: 'Connected',
      last_ping_at: '2026-10-12T10:00:00Z',
    },
    meta_lead_ads: {
      enabled: false,
      page_id: '',
      webhook_verify_token: 'joy_goa_token',
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
  },
];
