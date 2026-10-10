import { ResortTenant, Room, Booking, User, StaffInvite, AuditLogEntry, Invoice } from '@/types';
import { MOCK_RESORT_TENANTS, MOCK_USERS, MOCK_ROOMS, MOCK_BOOKINGS } from '@/data/mockData';

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

