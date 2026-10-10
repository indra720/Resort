import { UserRole } from '@/types';
import {
  LayoutDashboard,
  Users2,
  UserPlus,
  MessageSquareText,
  CalendarCheck,
  Users,
  PhoneCall,
  Send,
  Boxes,
  Compass,
  PartyPopper,
  FileBarChart,
  UserCog,
  Settings,
  Building2,
  CreditCard,
  Layers,
  ShieldCheck,
  LifeBuoy,
  ClipboardList,
  LucideIcon,
  DollarSign,
  Utensils,
  Sparkles,
  Wrench,
  RotateCcw,
} from 'lucide-react';

export const SUPER_ADMIN_WILDCARD = '*';

export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
  badge?: string;
  allowedRoles: UserRole[];
  isPlatformOnly?: boolean; // Only visible to Super Admin in Platform Hub mode
}

/**
 * Super Admin Exclusive Platform Management Pages
 * Other roles (Resort Owner, Manager, etc.) MUST NEVER SEE THESE.
 */
export const PLATFORM_NAV_ITEMS: NavItem[] = [
  {
    id: 'platform-dashboard',
    label: 'Platform Hub (MRR)',
    path: '/dashboard',
    icon: LayoutDashboard,
    allowedRoles: ['Super Admin'],
    isPlatformOnly: true,
  },
  {
    id: 'platform-resorts',
    label: 'Resorts (Tenants)',
    path: '/admin/resorts',
    icon: Building2,
    badge: 'Tenants',
    allowedRoles: ['Super Admin'],
    isPlatformOnly: true,
  },
  {
    id: 'platform-plans',
    label: 'Plans & Pricing',
    path: '/admin/plans',
    icon: Layers,
    allowedRoles: ['Super Admin'],
    isPlatformOnly: true,
  },
  {
    id: 'platform-subscriptions',
    label: 'Subscriptions & MRR',
    path: '/admin/subscriptions',
    icon: CreditCard,
    allowedRoles: ['Super Admin'],
    isPlatformOnly: true,
  },
  {
    id: 'platform-audit-logs',
    label: 'Audit Trail Logs',
    path: '/admin/audit-logs',
    icon: ShieldCheck,
    allowedRoles: ['Super Admin'],
    isPlatformOnly: true,
  },
  {
    id: 'platform-support',
    label: 'Support Tickets',
    path: '/admin/support-tickets',
    icon: LifeBuoy,
    allowedRoles: ['Super Admin'],
    isPlatformOnly: true,
  },
  {
    id: 'platform-settings',
    label: 'Global SaaS Config',
    path: '/admin/platform-settings',
    icon: Settings,
    allowedRoles: ['Super Admin'],
    isPlatformOnly: true,
  },
];

/**
 * Resort Tenant Operational Pages
 */
export const RESORT_NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
    allowedRoles: [
      'Super Admin',
      'Resort Owner',
      'Resort Manager',
      'Sales Executive',
      'Receptionist',
      'Housekeeping',
      'Restaurant/F&B',
      'Accountant',
      'Guest',
    ],
  },
  {
    id: 'crm',
    label: 'CRM & Pipeline',
    path: '/crm',
    icon: Users2,
    allowedRoles: ['Super Admin', 'Resort Owner', 'Resort Manager', 'Sales Executive'],
  },
  {
    id: 'leads',
    label: 'Leads',
    path: '/leads',
    icon: UserPlus,
    allowedRoles: ['Super Admin', 'Resort Owner', 'Resort Manager', 'Sales Executive'],
  },
  {
    id: 'enquiries',
    label: 'Enquiries',
    path: '/enquiries',
    icon: MessageSquareText,
    allowedRoles: ['Super Admin', 'Resort Owner', 'Resort Manager', 'Sales Executive'],
  },
  {
    id: 'follow-ups',
    label: 'Follow Ups',
    path: '/follow-ups',
    icon: PhoneCall,
    allowedRoles: ['Super Admin', 'Resort Owner', 'Resort Manager', 'Sales Executive'],
  },
  {
    id: 'marketing',
    label: 'Marketing',
    path: '/marketing',
    icon: Send,
    allowedRoles: ['Super Admin', 'Resort Owner', 'Resort Manager'],
  },
  {
    id: 'front-desk',
    label: 'Check-In / Out',
    path: '/check-in-out',
    icon: CalendarCheck,
    allowedRoles: ['Super Admin', 'Resort Owner', 'Resort Manager', 'Receptionist'],
  },
  {
    id: 'rooms',
    label: 'Rooms & Villas',
    path: '/rooms',
    icon: Building2,
    allowedRoles: [
      'Super Admin',
      'Resort Owner',
      'Resort Manager',
      'Receptionist',
      'Housekeeping',
      'Guest',
    ],
  },
  {
    id: 'bookings',
    label: 'Bookings List',
    path: '/bookings',
    icon: ClipboardList,
    allowedRoles: [
      'Super Admin',
      'Resort Owner',
      'Resort Manager',
      'Sales Executive',
      'Receptionist',
    ],
  },
  {
    id: 'my-bookings',
    label: 'My Bookings',
    path: '/my-bookings',
    icon: ClipboardList,
    allowedRoles: ['Guest'],
  },
  {
    id: 'housekeeping',
    label: 'Housekeeping',
    path: '/housekeeping',
    icon: Sparkles,
    allowedRoles: ['Super Admin', 'Resort Owner', 'Resort Manager', 'Housekeeping'],
  },
  {
    id: 'maintenance',
    label: 'Maintenance',
    path: '/maintenance',
    icon: Wrench,
    allowedRoles: ['Super Admin', 'Resort Owner', 'Resort Manager', 'Housekeeping'],
  },
  {
    id: 'restaurant',
    label: 'Restaurant & F&B',
    path: '/restaurant',
    icon: Utensils,
    allowedRoles: ['Super Admin', 'Resort Owner', 'Resort Manager', 'Restaurant/F&B'],
  },
  {
    id: 'billing',
    label: 'Billing & GST',
    path: '/billing',
    icon: DollarSign,
    allowedRoles: ['Super Admin', 'Resort Owner', 'Resort Manager', 'Receptionist', 'Accountant'],
  },
  {
    id: 'payments',
    label: 'Payments',
    path: '/payments',
    icon: CreditCard,
    allowedRoles: ['Super Admin', 'Resort Owner', 'Resort Manager', 'Receptionist', 'Accountant'],
  },
  {
    id: 'refunds',
    label: 'Refunds Desk',
    path: '/refunds',
    icon: RotateCcw,
    allowedRoles: ['Super Admin', 'Resort Owner', 'Resort Manager', 'Accountant'],
  },
  {
    id: 'expenses',
    label: 'Expenses & Ledgers',
    path: '/expenses',
    icon: FileBarChart,
    allowedRoles: ['Super Admin', 'Resort Owner', 'Resort Manager', 'Accountant'],
  },
  {
    id: 'subscription',
    label: 'Subscription & Quota',
    path: '/subscription',
    icon: Layers,
    allowedRoles: ['Super Admin', 'Resort Owner', 'Resort Manager'],
  },
  {
    id: 'guests',
    label: 'Guest Directory',
    path: '/guests',
    icon: Users,
    allowedRoles: ['Super Admin', 'Resort Owner', 'Resort Manager', 'Receptionist'],
  },
  {
    id: 'inventory',
    label: 'Resort Inventory',
    path: '/inventory',
    icon: Boxes,
    allowedRoles: [
      'Super Admin',
      'Resort Owner',
      'Resort Manager',
      'Housekeeping',
      'Restaurant/F&B',
    ],
  },
  {
    id: 'services',
    label: 'Concierge & Spa',
    path: '/services',
    icon: Compass,
    allowedRoles: ['Super Admin', 'Resort Owner', 'Resort Manager', 'Receptionist', 'Guest'],
  },
  {
    id: 'activities',
    label: 'Activities',
    path: '/activities',
    icon: Compass,
    allowedRoles: ['Super Admin', 'Resort Owner', 'Resort Manager', 'Receptionist', 'Guest'],
  },
  {
    id: 'events',
    label: 'Events & Banquets',
    path: '/events',
    icon: PartyPopper,
    allowedRoles: ['Super Admin', 'Resort Owner', 'Resort Manager', 'Receptionist', 'Guest'],
  },
  {
    id: 'reports',
    label: 'Reports & P&L',
    path: '/reports',
    icon: FileBarChart,
    allowedRoles: ['Super Admin', 'Resort Owner', 'Resort Manager', 'Accountant'],
  },
  {
    id: 'users-teams',
    label: 'Staff & Roles',
    path: '/staff',
    icon: UserCog,
    allowedRoles: ['Super Admin', 'Resort Owner', 'Resort Manager'],
  },
  {
    id: 'settings',
    label: 'Resort Settings',
    path: '/settings',
    icon: Settings,
    allowedRoles: ['Super Admin', 'Resort Owner'],
  },
];

export const ALL_NAV_ITEMS: NavItem[] = [...PLATFORM_NAV_ITEMS, ...RESORT_NAV_ITEMS];

/**
 * Returns accessible sidebar navigation items for a given role.
 * Super Admin has wildcard '*' permission across all modules.
 * When Super Admin is in Platform mode (not impersonating), shows Platform items first.
 */
export function getNavItemsForRole(role: UserRole, isImpersonating = false): NavItem[] {
  if (role === 'Super Admin') {
    if (isImpersonating) {
      // In impersonation mode, show full resort operations items
      return RESORT_NAV_ITEMS;
    }
    // In platform mode, show SaaS platform items first, then resort shortcuts
    return [...PLATFORM_NAV_ITEMS, ...RESORT_NAV_ITEMS.filter((item) => item.id !== 'dashboard')];
  }

  // Non-Super Admin roles NEVER see platform items
  return RESORT_NAV_ITEMS.filter((item) => item.allowedRoles.includes(role));
}

/**
 * Returns top 4 primary mobile bottom navigation items for a given role.
 */
export function getBottomNavItemsForRole(role: UserRole, isImpersonating = false): NavItem[] {
  const items = getNavItemsForRole(role, isImpersonating);
  return items.slice(0, 4);
}

/**
 * Checks if a specific role is allowed to view a given path.
 * Super Admin possesses wildcard '*' permission everywhere.
 */
export function canRoleAccessPath(role: UserRole, path: string): boolean {
  if (role === 'Super Admin') return true; // Wildcard access

  // Platform admin routes are strictly forbidden for non-Super Admin
  if (path.startsWith('/admin')) {
    return false;
  }

  // Public or general paths
  if (path === '/' || path === '/dashboard' || path === '/profile' || path === '/notifications') {
    return true;
  }

  // Resort Owner owns the resort and has full operational oversight
  if (role === 'Resort Owner') {
    return true;
  }

  const matched = RESORT_NAV_ITEMS.find((item) => path.startsWith(item.path));
  if (!matched) return true;
  return matched.allowedRoles.includes(role);
}

/**
 * Permission checks for specific UI action buttons:
 * Super Admin has wildcard ('*') bypassing every check.
 */
export const PERMISSIONS = {
  hasWildcard: (role: UserRole) => role === 'Super Admin',
  canManagePlatform: (role: UserRole) => role === 'Super Admin',
  canApproveExpenses: (role: UserRole) => ['Super Admin', 'Resort Owner'].includes(role),
  canManageRooms: (role: UserRole) => ['Super Admin', 'Resort Owner', 'Resort Manager'].includes(role),
  canEditBookings: (role: UserRole) =>
    ['Super Admin', 'Resort Owner', 'Resort Manager', 'Receptionist'].includes(role),
  canProcessPayments: (role: UserRole) =>
    ['Super Admin', 'Resort Owner', 'Resort Manager', 'Receptionist', 'Accountant'].includes(role),
  canUpdateCleaningStatus: (role: UserRole) =>
    ['Super Admin', 'Resort Owner', 'Resort Manager', 'Housekeeping'].includes(role),
  canManageRestaurantOrders: (role: UserRole) =>
    ['Super Admin', 'Resort Owner', 'Resort Manager', 'Restaurant/F&B'].includes(role),
  canExportReports: (role: UserRole) =>
    ['Super Admin', 'Resort Owner', 'Resort Manager', 'Accountant'].includes(role),
  canManageStaff: (role: UserRole) => ['Super Admin', 'Resort Owner', 'Resort Manager'].includes(role),
  canBookServices: (_role: UserRole) => true,
};
