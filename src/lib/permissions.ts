import { UserRole } from '@/types';
import {
  LayoutDashboard,
  BedDouble,
  CalendarCheck,
  UserCheck,
  Sparkles,
  Utensils,
  Receipt,
  Users,
  Compass,
  FileBarChart,
  Boxes,
  Settings,
  MessageSquareHeart,
  LucideIcon,
} from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
  badge?: string;
  allowedRoles: UserRole[];
}

export const ALL_NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
    allowedRoles: [
      'Super Admin',
      'Resort Manager',
      'Receptionist',
      'Housekeeping',
      'Restaurant/F&B',
      'Accountant',
      'Guest',
    ],
  },
  {
    id: 'rooms',
    label: 'Rooms & Villas',
    path: '/rooms',
    icon: BedDouble,
    allowedRoles: ['Super Admin', 'Resort Manager', 'Receptionist', 'Housekeeping', 'Guest'],
  },
  {
    id: 'bookings',
    label: 'Bookings',
    path: '/bookings',
    icon: CalendarCheck,
    allowedRoles: ['Super Admin', 'Resort Manager', 'Receptionist'],
  },
  {
    id: 'my-bookings',
    label: 'My Bookings',
    path: '/my-bookings',
    icon: CalendarCheck,
    allowedRoles: ['Guest'],
  },
  {
    id: 'check-in-out',
    label: 'Check-In / Out',
    path: '/check-in-out',
    icon: UserCheck,
    allowedRoles: ['Super Admin', 'Resort Manager', 'Receptionist'],
  },
  {
    id: 'housekeeping',
    label: 'Housekeeping',
    path: '/housekeeping',
    icon: Sparkles,
    allowedRoles: ['Super Admin', 'Resort Manager', 'Housekeeping'],
  },
  {
    id: 'restaurant',
    label: 'Restaurant & F&B',
    path: '/restaurant',
    icon: Utensils,
    allowedRoles: ['Super Admin', 'Resort Manager', 'Restaurant/F&B'],
  },
  {
    id: 'billing',
    label: 'Billing & Invoices',
    path: '/billing',
    icon: Receipt,
    allowedRoles: ['Super Admin', 'Resort Manager', 'Receptionist', 'Accountant'],
  },
  {
    id: 'services',
    label: 'Resort Services',
    path: '/services',
    icon: Compass,
    allowedRoles: ['Super Admin', 'Resort Manager', 'Receptionist', 'Guest'],
  },
  {
    id: 'guests',
    label: 'Guest Directory',
    path: '/guests',
    icon: Users,
    allowedRoles: ['Super Admin', 'Resort Manager', 'Receptionist'],
  },
  {
    id: 'staff',
    label: 'Staff Directory',
    path: '/staff',
    icon: Users,
    allowedRoles: ['Super Admin', 'Resort Manager'],
  },
  {
    id: 'inventory',
    label: 'Inventory',
    path: '/inventory',
    icon: Boxes,
    allowedRoles: ['Super Admin', 'Resort Manager', 'Housekeeping', 'Restaurant/F&B'],
  },
  {
    id: 'reports',
    label: 'Financial Reports',
    path: '/reports',
    icon: FileBarChart,
    allowedRoles: ['Super Admin', 'Resort Manager', 'Accountant'],
  },
  {
    id: 'feedback',
    label: 'Feedback & Reviews',
    path: '/feedback',
    icon: MessageSquareHeart,
    allowedRoles: ['Super Admin', 'Resort Manager', 'Guest'],
  },
  {
    id: 'settings',
    label: 'Resort Settings',
    path: '/settings',
    icon: Settings,
    allowedRoles: ['Super Admin'],
  },
];

/**
 * Returns accessible sidebar navigation items for a given role.
 */
export function getNavItemsForRole(role: UserRole): NavItem[] {
  return ALL_NAV_ITEMS.filter((item) => item.allowedRoles.includes(role));
}

/**
 * Returns top 4 primary mobile bottom navigation items for a given role.
 */
export function getBottomNavItemsForRole(role: UserRole): NavItem[] {
  const roleNavItems = getNavItemsForRole(role);
  // Pick the first 4 items, 5th slot is dedicated to "More" drawer
  return roleNavItems.slice(0, 4);
}

/**
 * Checks if a specific role is allowed to view a given path.
 */
export function canRoleAccessPath(role: UserRole, path: string): boolean {
  // Public or general paths
  if (path === '/' || path === '/dashboard' || path === '/profile' || path === '/notifications') {
    return true;
  }

  const matched = ALL_NAV_ITEMS.find((item) => path.startsWith(item.path));
  if (!matched) return true; // not restricted
  return matched.allowedRoles.includes(role);
}

/**
 * Permission checks for specific UI action buttons:
 */
export const PERMISSIONS = {
  canManageRooms: (role: UserRole) => ['Super Admin', 'Resort Manager'].includes(role),
  canEditBookings: (role: UserRole) => ['Super Admin', 'Resort Manager', 'Receptionist'].includes(role),
  canProcessPayments: (role: UserRole) =>
    ['Super Admin', 'Resort Manager', 'Receptionist', 'Accountant'].includes(role),
  canUpdateCleaningStatus: (role: UserRole) =>
    ['Super Admin', 'Resort Manager', 'Housekeeping'].includes(role),
  canManageRestaurantOrders: (role: UserRole) =>
    ['Super Admin', 'Resort Manager', 'Restaurant/F&B'].includes(role),
  canExportReports: (role: UserRole) => ['Super Admin', 'Resort Manager', 'Accountant'].includes(role),
  canManageStaff: (role: UserRole) => ['Super Admin', 'Resort Manager'].includes(role),
  canBookServices: (_role: UserRole) => true,
};
