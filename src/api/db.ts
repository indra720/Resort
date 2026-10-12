import { ResortTenant, Room, Booking, User, StaffInvite, AuditLogEntry, Invoice } from '@/types';
import { MOCK_RESORT_TENANTS, MOCK_USERS, MOCK_ROOMS, MOCK_BOOKINGS } from '@/data/mockData';
import {
  INITIAL_SEEDED_LEADS,
  INITIAL_SEEDED_ACTIVITIES,
  INITIAL_SEEDED_NOTES,
  INITIAL_SEEDED_FOLLOWUPS,
  INITIAL_SEEDED_GUESTS,
} from '@/data/seedLeads';
import {
  INITIAL_SEEDED_QUOTATIONS,
  INITIAL_SEEDED_TEMPLATES,
  INITIAL_SEEDED_AUTOMATIONS,
  INITIAL_SEEDED_AUTOMATION_LOGS,
  INITIAL_SEEDED_TARGETS,
  INITIAL_AUTO_ASSIGN_CONFIG,
} from '@/data/seedAdvancedCRM';
import {
  INITIAL_SEEDED_CAMPAIGNS,
  INITIAL_SEEDED_COUPONS,
  INITIAL_SEEDED_LEAD_SOURCES,
  INITIAL_SEEDED_SEGMENTS,
  INITIAL_SEEDED_BROADCASTS,
  INITIAL_SEEDED_CAPTURE_FORMS,
  INITIAL_SEEDED_REFERRALS,
} from '@/data/seedMarketing';
import {
  INITIAL_SEEDED_LOST_REASONS,
  INITIAL_SEEDED_SCORING_WEIGHTS,
  INITIAL_SEEDED_SLA_CONFIGS,
  INITIAL_SEEDED_INTEGRATIONS,
} from '@/data/seedSettings';

export const DB_KEYS = {
  RESORTS: 'joy_resorts_tenants',
  ROOMS: 'joy_rooms_data',
  BOOKINGS: 'joy_bookings_data',
  USERS: 'joy_users_data',
  INVITES: 'joy_staff_invites',
  INVOICES: 'joy_invoices_data',
  AUDIT_LOGS: 'joy_audit_logs',
  HOUSEKEEPING_TASKS: 'joy_housekeeping_tasks',
  TAX_CONFIG: 'joy_tax_config',
  // CRM & Leads Module
  LEADS: 'joy_leads_data',
  GUESTS: 'joy_guests_data',
  FOLLOWUPS: 'joy_followups_data',
  NOTES: 'joy_notes_data',
  ACTIVITIES: 'joy_activities_data',
  // Phase 3: Advanced Sales
  QUOTATIONS: 'joy_quotations_data',
  TEMPLATES: 'joy_templates_data',
  AUTOMATIONS: 'joy_automations_data',
  AUTOMATION_LOGS: 'joy_automation_logs_data',
  SALES_TARGETS: 'joy_sales_targets_data',
  AUTO_ASSIGN_CONFIG: 'joy_auto_assign_config',
  // Phase 4: Marketing & Guest Acquisition
  CAMPAIGNS: 'joy_campaigns_data',
  COUPONS: 'joy_coupons_data',
  LEAD_SOURCES: 'joy_lead_sources_data',
  SEGMENTS: 'joy_segments_data',
  BROADCASTS: 'joy_broadcasts_data',
  CAPTURE_FORMS: 'joy_capture_forms_data',
  REFERRALS: 'joy_referrals_data',
  // Phase 5: CRM Reports & Settings
  LOST_REASONS: 'joy_lost_reasons_data',
  SCORING_WEIGHTS: 'joy_scoring_weights_data',
  SLA_CONFIG: 'joy_sla_config_data',
  INTEGRATIONS: 'joy_integrations_data',
};

// Seed rooms with resortId
const INITIAL_ROOMS: Room[] = MOCK_ROOMS.map((r, i) => ({
  ...r,
  resortId: i < 3 ? 'resort-1' : i < 6 ? 'resort-2' : 'resort-3',
}));

// Seed bookings with resortId
const INITIAL_BOOKINGS: Booking[] = MOCK_BOOKINGS.map((b, i) => ({
  ...b,
  resortId: i % 2 === 0 ? 'resort-1' : 'resort-2',
}));

// Seed invoices with resortId
const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'TAX-INV-2026-081',
    guestName: 'Rohan Mehra',
    date: '2026-10-05',
    subTotal: 16500,
    gstRate: 12,
    gstAmount: 1980,
    grandTotal: 18480,
    status: 'Paid',
    resortId: 'resort-1',
  },
  {
    id: 'inv-2',
    invoiceNumber: 'TAX-INV-2026-082',
    guestName: 'Kavita Iyer',
    date: '2026-10-06',
    subTotal: 34500,
    gstRate: 18,
    gstAmount: 6210,
    grandTotal: 40710,
    status: 'Pending',
    resortId: 'resort-1',
  },
  {
    id: 'inv-3',
    invoiceNumber: 'TAX-INV-2026-083',
    guestName: 'Devendra Singhania',
    date: '2026-10-04',
    subTotal: 72000,
    gstRate: 18,
    gstAmount: 12960,
    grandTotal: 84960,
    status: 'Paid',
    resortId: 'resort-2',
  },
];

// Seed mock staff invitations with 7-day expiry
const INITIAL_INVITES: StaffInvite[] = [
  {
    id: 'inv-101',
    email: 'karan.receptionist@gmail.com',
    role: 'Receptionist',
    resortId: 'resort-1',
    resortName: 'Joy Resorts - Lakeview Sanctuary',
    invitedBy: 'Rajvardhan Oberoi (Resort Owner)',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    expiresAt: new Date(Date.now() + 5 * 86400000).toISOString(),
    token: 'inv_tok_rec_88291a',
    status: 'Pending',
  },
  {
    id: 'inv-102',
    email: 'meera.housekeeping@gmail.com',
    role: 'Housekeeping',
    resortId: 'resort-1',
    resortName: 'Joy Resorts - Lakeview Sanctuary',
    invitedBy: 'Ananya Sharma (Resort Manager)',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    expiresAt: new Date(Date.now() + 6 * 86400000).toISOString(),
    token: 'inv_tok_hk_33190b',
    status: 'Pending',
  },
];

/**
 * Initializes the fake localStorage database if not already present.
 */
export function initDatabase(): void {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(DB_KEYS.RESORTS)) {
    localStorage.setItem(DB_KEYS.RESORTS, JSON.stringify(MOCK_RESORT_TENANTS));
  }
  if (!localStorage.getItem(DB_KEYS.ROOMS)) {
    localStorage.setItem(DB_KEYS.ROOMS, JSON.stringify(INITIAL_ROOMS));
  }
  if (!localStorage.getItem(DB_KEYS.BOOKINGS)) {
    localStorage.setItem(DB_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
  }
  if (!localStorage.getItem(DB_KEYS.USERS)) {
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify(MOCK_USERS));
  }
  if (!localStorage.getItem(DB_KEYS.INVITES)) {
    localStorage.setItem(DB_KEYS.INVITES, JSON.stringify(INITIAL_INVITES));
  }
  if (!localStorage.getItem(DB_KEYS.INVOICES)) {
    localStorage.setItem(DB_KEYS.INVOICES, JSON.stringify(INITIAL_INVOICES));
  }
  if (!localStorage.getItem(DB_KEYS.LEADS)) {
    localStorage.setItem(DB_KEYS.LEADS, JSON.stringify(INITIAL_SEEDED_LEADS));
  }
  if (!localStorage.getItem(DB_KEYS.ACTIVITIES)) {
    localStorage.setItem(DB_KEYS.ACTIVITIES, JSON.stringify(INITIAL_SEEDED_ACTIVITIES));
  }
  if (!localStorage.getItem(DB_KEYS.NOTES)) {
    localStorage.setItem(DB_KEYS.NOTES, JSON.stringify(INITIAL_SEEDED_NOTES));
  }
  if (!localStorage.getItem(DB_KEYS.FOLLOWUPS)) {
    localStorage.setItem(DB_KEYS.FOLLOWUPS, JSON.stringify(INITIAL_SEEDED_FOLLOWUPS));
  }
  if (!localStorage.getItem(DB_KEYS.GUESTS)) {
    localStorage.setItem(DB_KEYS.GUESTS, JSON.stringify(INITIAL_SEEDED_GUESTS));
  }
  if (!localStorage.getItem(DB_KEYS.QUOTATIONS)) {
    localStorage.setItem(DB_KEYS.QUOTATIONS, JSON.stringify(INITIAL_SEEDED_QUOTATIONS));
  }
  if (!localStorage.getItem(DB_KEYS.TEMPLATES)) {
    localStorage.setItem(DB_KEYS.TEMPLATES, JSON.stringify(INITIAL_SEEDED_TEMPLATES));
  }
  if (!localStorage.getItem(DB_KEYS.AUTOMATIONS)) {
    localStorage.setItem(DB_KEYS.AUTOMATIONS, JSON.stringify(INITIAL_SEEDED_AUTOMATIONS));
  }
  if (!localStorage.getItem(DB_KEYS.AUTOMATION_LOGS)) {
    localStorage.setItem(DB_KEYS.AUTOMATION_LOGS, JSON.stringify(INITIAL_SEEDED_AUTOMATION_LOGS));
  }
  if (!localStorage.getItem(DB_KEYS.SALES_TARGETS)) {
    localStorage.setItem(DB_KEYS.SALES_TARGETS, JSON.stringify(INITIAL_SEEDED_TARGETS));
  }
  if (!localStorage.getItem(DB_KEYS.AUTO_ASSIGN_CONFIG)) {
    localStorage.setItem(DB_KEYS.AUTO_ASSIGN_CONFIG, JSON.stringify(INITIAL_AUTO_ASSIGN_CONFIG));
  }
  // Phase 4: Marketing Seeds
  if (!localStorage.getItem(DB_KEYS.CAMPAIGNS)) {
    localStorage.setItem(DB_KEYS.CAMPAIGNS, JSON.stringify(INITIAL_SEEDED_CAMPAIGNS));
  }
  if (!localStorage.getItem(DB_KEYS.COUPONS)) {
    localStorage.setItem(DB_KEYS.COUPONS, JSON.stringify(INITIAL_SEEDED_COUPONS));
  }
  if (!localStorage.getItem(DB_KEYS.LEAD_SOURCES)) {
    localStorage.setItem(DB_KEYS.LEAD_SOURCES, JSON.stringify(INITIAL_SEEDED_LEAD_SOURCES));
  }
  if (!localStorage.getItem(DB_KEYS.SEGMENTS)) {
    localStorage.setItem(DB_KEYS.SEGMENTS, JSON.stringify(INITIAL_SEEDED_SEGMENTS));
  }
  if (!localStorage.getItem(DB_KEYS.BROADCASTS)) {
    localStorage.setItem(DB_KEYS.BROADCASTS, JSON.stringify(INITIAL_SEEDED_BROADCASTS));
  }
  if (!localStorage.getItem(DB_KEYS.CAPTURE_FORMS)) {
    localStorage.setItem(DB_KEYS.CAPTURE_FORMS, JSON.stringify(INITIAL_SEEDED_CAPTURE_FORMS));
  }
  if (!localStorage.getItem(DB_KEYS.REFERRALS)) {
    localStorage.setItem(DB_KEYS.REFERRALS, JSON.stringify(INITIAL_SEEDED_REFERRALS));
  }
  // Phase 5: CRM Settings & Config
  if (!localStorage.getItem(DB_KEYS.LOST_REASONS)) {
    localStorage.setItem(DB_KEYS.LOST_REASONS, JSON.stringify(INITIAL_SEEDED_LOST_REASONS));
  }
  if (!localStorage.getItem(DB_KEYS.SCORING_WEIGHTS)) {
    localStorage.setItem(DB_KEYS.SCORING_WEIGHTS, JSON.stringify(INITIAL_SEEDED_SCORING_WEIGHTS));
  }
  if (!localStorage.getItem(DB_KEYS.SLA_CONFIG)) {
    localStorage.setItem(DB_KEYS.SLA_CONFIG, JSON.stringify(INITIAL_SEEDED_SLA_CONFIGS));
  }
  if (!localStorage.getItem(DB_KEYS.INTEGRATIONS)) {
    localStorage.setItem(DB_KEYS.INTEGRATIONS, JSON.stringify(INITIAL_SEEDED_INTEGRATIONS));
  }
}

/**
 * Safe JSON retrieval from localStorage
 */
export function getDbItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return fallback;
  }
}

/**
 * Safe JSON storage in localStorage
 */
export function setDbItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error writing ${key} to localStorage:`, err);
  }
}

