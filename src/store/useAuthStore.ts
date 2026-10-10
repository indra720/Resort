import { create } from 'zustand';
import { User, UserRole, ResortTenant, AuditLogEntry } from '@/types';
import { MOCK_USERS, MOCK_RESORT_TENANTS } from '@/data/mockData';

interface AuthState {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  currentResort: ResortTenant;
  allResorts: ResortTenant[];
  
  // Super Admin "Enter as Resort" (Impersonation Mode)
  isImpersonating: boolean;
  impersonatedResortId: string | null;
  
  // Platform Audit Trail
  auditLogs: AuditLogEntry[];
  
  // Methods
  login: (email: string, role?: UserRole) => boolean;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
  switchResort: (resortId: string) => void;
  enterResortAsAdmin: (resortId: string) => void;
  exitResortToPlatform: () => void;
  addAuditLog: (
    action: string,
    details: string,
    severity?: 'Info' | 'Warning' | 'Critical',
    resortId?: string
  ) => void;
}

// Initial mock audit logs
const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud-1',
    timestamp: '2026-10-10 10:15 AM',
    actorName: 'Vikramaditya Singhania',
    actorEmail: 'superadmin@joyresorts.com',
    actorRole: 'Super Admin',
    action: 'Platform Tenant Initialized',
    details: 'System provisioned tenant Joy Resorts Candolim Beachfront (JOY-CAN)',
    resortId: 'resort-1',
    resortName: 'Joy Resorts Candolim Beachfront',
    severity: 'Info',
  },
  {
    id: 'aud-2',
    timestamp: '2026-10-10 11:30 AM',
    actorName: 'Rajvardhan Oberoi',
    actorEmail: 'owner@joyresorts.com',
    actorRole: 'Resort Owner',
    action: 'Executive Approval Signed',
    details: 'Approved luxury linens capex order ₹2,40,000 for Udaipur branch',
    resortId: 'resort-2',
    resortName: 'Joy Lake Palace Sanctuary, Udaipur',
    severity: 'Info',
  },
  {
    id: 'aud-3',
    timestamp: '2026-10-10 01:45 PM',
    actorName: 'Ananya Sharma',
    actorEmail: 'manager@joyresorts.com',
    actorRole: 'Resort Manager',
    action: 'Shift Handover & VIP Escalation',
    details: 'VIP check-in expedited for Presidential Pool Villa V-01',
    resortId: 'resort-1',
    resortName: 'Joy Resorts Candolim Beachfront',
    severity: 'Warning',
  },
];

/**
 * Super Admin is the default role in demo/dev mode,
 * granting full wildcard oversight over both Platform Hub & all Resorts.
 * Real user signups from public landing pages are strictly restricted to Resort Owner only.
 */
const DEFAULT_SUPER_ADMIN_USER: User = MOCK_USERS[0];

export const useAuthStore = create<AuthState>((set, get) => ({
  user: DEFAULT_SUPER_ADMIN_USER,
  role: 'Super Admin',
  isAuthenticated: true,
  currentResort: MOCK_RESORT_TENANTS[0],
  allResorts: MOCK_RESORT_TENANTS,
  isImpersonating: false,
  impersonatedResortId: null,
  auditLogs: INITIAL_AUDIT_LOGS,

  login: (email: string, selectedRole?: UserRole) => {
    const matched = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() || (selectedRole && u.role === selectedRole)
    );

    if (matched) {
      set({
        user: matched,
        role: matched.role,
        isAuthenticated: true,
        isImpersonating: false,
        impersonatedResortId: null,
      });
      get().addAuditLog('User Login', `User ${matched.name} logged in with role ${matched.role}`, 'Info');
      return true;
    }

    const defaultRole = selectedRole || 'Resort Owner';
    const fallbackUser: User = {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0],
      email: email,
      phone: '+91 98000 00000',
      role: defaultRole,
    };

    set({
      user: fallbackUser,
      role: defaultRole,
      isAuthenticated: true,
      isImpersonating: false,
      impersonatedResortId: null,
    });
    get().addAuditLog('User Registration/Login', `User ${fallbackUser.email} logged in with role ${defaultRole}`, 'Info');
    return true;
  },

  logout: () => {
    get().addAuditLog('User Logout', 'Session terminated by user', 'Info');
    set({
      user: null,
      role: 'Guest',
      isAuthenticated: false,
      isImpersonating: false,
      impersonatedResortId: null,
    });
  },

  switchRole: (newRole: UserRole) => {
    const matched = MOCK_USERS.find((u) => u.role === newRole);
    if (matched) {
      set({ user: matched, role: newRole, isImpersonating: false });
    } else {
      set((state) => ({
        role: newRole,
        user: state.user ? { ...state.user, role: newRole } : null,
        isImpersonating: false,
      }));
    }
    get().addAuditLog('Role Switched (Demo)', `Active persona changed to ${newRole}`, 'Warning');
  },

  switchResort: (resortId: string) => {
    const matched = get().allResorts.find((r) => r.id === resortId);
    if (matched) {
      set({ currentResort: matched });
      get().addAuditLog('Tenant Switched', `Switched active property context to ${matched.name}`, 'Info', matched.id);
    }
  },

  /**
   * Super Admin "Enter as Resort":
   * Allows the Platform Owner to enter any resort tenant with wildcard permissions,
   * activating the sticky warning banner and recording the action in the Audit Trail.
   */
  enterResortAsAdmin: (resortId: string) => {
    const target = get().allResorts.find((r) => r.id === resortId);
    if (target) {
      set({
        currentResort: target,
        isImpersonating: true,
        impersonatedResortId: target.id,
      });
      get().addAuditLog(
        'Super Admin Impersonation Entered',
        `Super Admin entered resort "${target.name}" (${target.code}) in direct audit mode`,
        'Critical',
        target.id
      );
    }
  },

  /**
   * Exits resort impersonation mode and returns back to the Super Admin Platform Hub.
   */
  exitResortToPlatform: () => {
    const prevResort = get().currentResort;
    set({
      isImpersonating: false,
      impersonatedResortId: null,
    });
    get().addAuditLog(
      'Super Admin Impersonation Exited',
      `Super Admin exited resort "${prevResort.name}" and returned to Platform Hub`,
      'Info',
      prevResort.id
    );
  },

  addAuditLog: (action, details, severity = 'Info', resortId) => {
    const state = get();
    const currentResort = state.currentResort;
    const newLog: AuditLogEntry = {
      id: `aud-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      actorName: state.user?.name || 'Super Admin',
      actorEmail: state.user?.email || 'superadmin@joyresorts.com',
      actorRole: state.role,
      action,
      details,
      resortId: resortId || currentResort?.id,
      resortName: currentResort?.name,
      severity,
    };
    set({ auditLogs: [newLog, ...state.auditLogs] });
  },
}));
