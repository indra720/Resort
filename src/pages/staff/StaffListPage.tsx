import React, { useState, useEffect } from 'react';
import { getStaff, getInvites, inviteStaff, revokeInvite, UserRecord } from '@/api/staffApi';
import { checkResortLimits } from '@/api/plansApi';
import { useAuthStore } from '@/store/useAuthStore';
import { UserRole, StaffInvite } from '@/types';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { toast } from '@/store/useToastStore';
import { Link } from 'react-router-dom';
import {
  Users,
  PlusCircle,
  Briefcase,
  Clock,
  Shield,
  CheckCircle2,
  Mail,
  Copy,
  Check,
  AlertTriangle,
  Trash2,
  Send,
  Sparkles,
  ExternalLink,
  Crown,
  ClipboardList,
  ShieldAlert,
  KeyRound,
  CheckCircle,
  XCircle,
} from 'lucide-react';

interface RBACPermissionRow {
  roleName: UserRole;
  dashboardType: string;
  crm: boolean;
  frontDesk: boolean;
  housekeeping: boolean;
  restaurant: boolean;
  billingLedgers: boolean;
  expensesCapex: boolean;
  reportsPnl: boolean;
  staffManagement: boolean;
  saasBilling: boolean;
  authorityLevel: 'Root Owner' | 'Operational Lead' | 'Department Staff' | 'Finance Head';
}

const RBAC_MATRIX: RBACPermissionRow[] = [
  {
    roleName: 'Resort Owner',
    dashboardType: 'Multi-Property ROI & EBITDA Desk',
    crm: true,
    frontDesk: true,
    housekeeping: true,
    restaurant: true,
    billingLedgers: true,
    expensesCapex: true,
    reportsPnl: true,
    staffManagement: true,
    saasBilling: true,
    authorityLevel: 'Root Owner',
  },
  {
    roleName: 'Resort Manager',
    dashboardType: 'General Operations & Turnaround SLA',
    crm: true,
    frontDesk: true,
    housekeeping: true,
    restaurant: true,
    billingLedgers: true,
    expensesCapex: false, // Manager submits, Owner signs
    reportsPnl: true,
    staffManagement: true, // Rosters only
    saasBilling: false, // View only
    authorityLevel: 'Operational Lead',
  },
  {
    roleName: 'Accountant',
    dashboardType: 'Financial P&L, Ledgers & GSTR Desk',
    crm: false,
    frontDesk: false,
    housekeeping: false,
    restaurant: false,
    billingLedgers: true,
    expensesCapex: true,
    reportsPnl: true,
    staffManagement: false,
    saasBilling: false,
    authorityLevel: 'Finance Head',
  },
  {
    roleName: 'Receptionist',
    dashboardType: 'Front Desk Check-in & Key Allocation',
    crm: false,
    frontDesk: true,
    housekeeping: false,
    restaurant: false,
    billingLedgers: true,
    expensesCapex: false,
    reportsPnl: false,
    staffManagement: false,
    saasBilling: false,
    authorityLevel: 'Department Staff',
  },
  {
    roleName: 'Housekeeping',
    dashboardType: 'Room Cleaning, Turnaround & Maintenance',
    crm: false,
    frontDesk: false,
    housekeeping: true,
    restaurant: false,
    billingLedgers: false,
    expensesCapex: false,
    reportsPnl: false,
    staffManagement: false,
    saasBilling: false,
    authorityLevel: 'Department Staff',
  },
  {
    roleName: 'Restaurant/F&B',
    dashboardType: 'Dining Tables, KOT & Kitchen POS',
    crm: false,
    frontDesk: false,
    housekeeping: false,
    restaurant: true,
    billingLedgers: false,
    expensesCapex: false,
    reportsPnl: false,
    staffManagement: false,
    saasBilling: false,
    authorityLevel: 'Department Staff',
  },
  {
    roleName: 'Sales Executive',
    dashboardType: 'CRM Deal Pipeline & Leads SLA',
    crm: true,
    frontDesk: false,
    housekeeping: false,
    restaurant: false,
    billingLedgers: false,
    expensesCapex: false,
    reportsPnl: false,
    staffManagement: false,
    saasBilling: false,
    authorityLevel: 'Department Staff',
  },
  {
    roleName: 'Super Admin',
    dashboardType: 'Platform SaaS Hub & Multi-Tenant MRR',
    crm: true,
    frontDesk: true,
    housekeeping: true,
    restaurant: true,
    billingLedgers: true,
    expensesCapex: true,
    reportsPnl: true,
    staffManagement: true,
    saasBilling: true,
    authorityLevel: 'Root Owner',
  },
];

export const StaffListPage: React.FC = () => {
  const { currentResort, user, role } = useAuthStore();
  const isOwner = role === 'Resort Owner' || role === 'Super Admin';
  const isManager = role === 'Resort Manager';

  const [activeTab, setActiveTab] = useState<'active' | 'invites' | 'matrix'>('active');

  const [staffList, setStaffList] = useState<UserRecord[]>([]);
  const [pendingInvites, setPendingInvites] = useState<StaffInvite[]>([]);
  const [limits, setLimits] = useState(checkResortLimits(currentResort.id));

  // Invite Modal State
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('Receptionist');
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const refreshData = () => {
    const isSuperAdmin = role === 'Super Admin';
    const staff = getStaff(currentResort.id, isSuperAdmin);
    const invites = getInvites(currentResort.id);
    const quota = checkResortLimits(currentResort.id);

    setStaffList(staff);
    setPendingInvites(invites.filter((i) => i.status === 'Pending'));
    setLimits(quota);
  };

  useEffect(() => {
    refreshData();
  }, [currentResort.id, role]);

  const handleCreateInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) {
      toast.error('Email required', 'Please provide a valid staff email address.');
      return;
    }

    const res = inviteStaff(
      inviteEmail.trim(),
      inviteRole,
      currentResort.id,
      currentResort.name,
      user?.name || (isOwner ? 'Resort Owner' : 'Resort Manager')
    );

    if (!res.success || !res.inviteUrl) {
      toast.error('Invitation Failed', res.error || 'Could not create staff invite.');
      return;
    }

    setGeneratedUrl(res.inviteUrl);
    refreshData();
    toast.success('Invite Created', `7-day valid invitation created for ${inviteEmail} as ${inviteRole}`);
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success('Copied to clipboard', 'Invite link ready to share via WhatsApp, Email, or SMS.');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRevoke = (inviteId: string) => {
    revokeInvite(inviteId);
    refreshData();
    toast.info('Invitation revoked', 'The invite token has been invalidated.');
  };

  const staffColumns: Column<UserRecord>[] = [
    {
      key: 'name',
      header: 'Employee Name',
      accessor: (u) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-center font-bold text-xs text-[#0F5132]">
            {u.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <span className="font-semibold text-[#1F2937] block">{u.name}</span>
            <span className="text-[11px] text-[#6B7280]">{u.email}</span>
          </div>
        </div>
      ),
      sortable: true,
      sortValue: (u) => u.name,
    },
    {
      key: 'role',
      header: 'Role & Permissions',
      accessor: (u) => (
        <span className="text-xs px-2.5 py-1 rounded-full bg-[#F0FDF4] text-[#0F5132] border border-[#BBF7D0] font-medium">
          {u.role}
        </span>
      ),
      sortable: true,
      sortValue: (u) => u.role,
    },
    {
      key: 'department',
      header: 'Department',
      accessor: (u) => <span className="text-xs">{u.department || 'Operations'}</span>,
    },
    {
      key: 'shift',
      header: 'Assigned Shift',
      accessor: (u) => (
        <span className="text-xs text-[#6B7280] flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[#3B82F6]" />
          {u.shift || 'General (09:00 - 18:00)'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Attendance',
      accessor: () => (
        <span className="inline-flex items-center gap-1.5 text-xs text-[#22C55E] font-medium">
          <span className="w-2 h-2 rounded-full bg-[#22C55E]" /> Active
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-5 text-left">
      {/* Role-Specific Perspective Top Banner */}
      {isOwner ? (
        <div className="p-4 bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0F5132] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
              <Crown className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#0F5132] uppercase tracking-wider">
                  Resort Owner Root Administration
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#DCFCE7] text-[#0F5132]">
                  Full RBAC Delegation Authority
                </span>
              </div>
              <p className="text-xs text-[#475569] mt-0.5">
                You hold sole authority to invite staff, assign UserRoles (Accountant, Manager, Front Desk), set compensation packages, and revoke access across all 8 resort operational dashboards.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#0F5132] text-white self-start sm:self-auto shrink-0 shadow-2xs">
            Root Authority
          </span>
        </div>
      ) : isManager ? (
        <div className="p-4 bg-gradient-to-r from-blue-50 via-sky-50/50 to-white border border-blue-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0284C7] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
              <ClipboardList className="w-5 h-5 text-sky-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#0369A1] uppercase tracking-wider">
                  General Manager Operations & Shift Roster View
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-sky-100 text-[#0369A1]">
                  Duty Management
                </span>
              </div>
              <p className="text-xs text-[#475569] mt-0.5">
                Monitor shift assignments, daily attendance, and department duty logs. Staff role elevations and salary administration are routed to Resort Owner for final confirmation.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#0284C7] text-white self-start sm:self-auto shrink-0 shadow-2xs">
            Operations Roster
          </span>
        </div>
      ) : null}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F5132]">
              {isOwner ? 'Staff Personnel & Access Delegation' : 'Staff Duty Roster & Attendance'}
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200">
              {currentResort.name}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
            Role administration, shift rostering, and SaaS staff invite links.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              setGeneratedUrl(null);
              setIsInviteOpen(true);
            }}
            leftIcon={<Send className="w-4 h-4" />}
          >
            Invite Staff Member
          </Button>
        </div>
      </div>

      {/* Plan Usage & Quota Banner */}
      <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0F5132] flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#0F172A]">Staff User Quota</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#DCFCE7] text-[#0F5132]">
                {limits.plan} Plan
              </span>
            </div>
            <p className="text-xs text-[#64748B]">
              Currently using <strong>{limits.usersUsed}</strong> of{' '}
              <strong>{limits.userLimit === Infinity ? 'Unlimited' : limits.userLimit}</strong> allowed team members.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {limits.isUserLimitReached && (
            <span className="text-xs font-bold text-red-600 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Quota Reached
            </span>
          )}
          <Link
            to="/subscription"
            className="text-xs font-bold text-[#0F5132] hover:underline flex items-center gap-1"
          >
            <span>Manage Plan & Limits</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('active')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'active'
              ? 'bg-[#0F5132] text-white shadow-2xs'
              : 'text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Active Staff ({staffList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('invites')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'invites'
              ? 'bg-[#0F5132] text-white shadow-2xs'
              : 'text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100'
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Pending Invitations ({pendingInvites.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('matrix')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'matrix'
              ? 'bg-[#0F5132] text-white shadow-2xs'
              : 'text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100'
          }`}
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>Role Permissions Matrix (RBAC)</span>
        </button>
      </div>

      {/* Main Content */}
      {activeTab === 'active' && (
        <DataTable
          data={staffList}
          columns={staffColumns}
          keyExtractor={(s) => s.id}
          searchPlaceholder="Search staff by name or role..."
          pageSize={6}
        />
      )}

      {activeTab === 'invites' && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-[#E2E8F0]">
            <h3 className="text-sm font-bold text-[#0F172A]">Sent Invitations (7-Day Validity)</h3>
            <p className="text-xs text-[#64748B]">
              Share the invitation links with your candidates or team members to activate their accounts.
            </p>
          </div>

          {pendingInvites.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#64748B]">
              No pending invitations. Click <strong>"Invite Staff Member"</strong> to invite a new colleague.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-semibold">
                    <th className="py-3 px-4">Invited Email</th>
                    <th className="py-3 px-4">Target Role</th>
                    <th className="py-3 px-4">Invited By</th>
                    <th className="py-3 px-4">Expiry</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {pendingInvites.map((inv) => {
                    const daysLeft = Math.max(
                      0,
                      Math.ceil((new Date(inv.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                    );
                    const linkUrl = `${window.location.origin}/invite/${inv.token}`;

                    return (
                      <tr key={inv.id} className="hover:bg-[#F8FAFC]">
                        <td className="py-3.5 px-4 font-semibold text-[#0F172A]">{inv.email}</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#0F5132] font-bold text-[11px] border border-emerald-200">
                            {inv.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-[#64748B]">{inv.invitedBy}</td>
                        <td className="py-3.5 px-4">
                          <span className="flex items-center gap-1 text-amber-600 font-semibold">
                            <Clock className="w-3.5 h-3.5" />
                            {daysLeft} days remaining
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => handleCopyLink(linkUrl)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Link</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRevoke(inv.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-semibold"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Revoke</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 3. Role Permissions Matrix (RBAC Tab) */}
      {activeTab === 'matrix' && (
        <div className="space-y-4">
          {/* Informational Guidance Box */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold tracking-tight">
                How Dashboard Permissions Work in This Resort Management Architecture
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                <span className="font-bold text-white block mb-1">1. Who Grants Permissions?</span>
                <p>
                  <strong>Resort Owner</strong> holds root authority over resort staff. The Owner creates accounts and binds each user to a <code>UserRole</code>. Super Admin holds platform-wide wildcard authority.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                <span className="font-bold text-white block mb-1">2. Automatic Dashboard Routing</span>
                <p>
                  When a staff member logs in, <code>DashboardRouter</code> inspects their assigned role and delivers their specialized dashboard (Receptionist, Housekeeping, Restaurant, Accountant, etc.).
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                <span className="font-bold text-white block mb-1">3. Strict Route Guards (403 Protection)</span>
                <p>
                  <code>permissions.ts</code> acts as the single source of truth. Users attempting to access unauthorized URLs or sign-offs are immediately prevented with a 403 screen.
                </p>
              </div>
            </div>
          </div>

          {/* Matrix Table */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-bold text-[#0F172A]">Complete Role-Based Access Control (RBAC) Matrix</h4>
                <p className="text-xs text-[#64748B]">
                  Live map of all 8 roles across all 9 operational modules in this resort.
                </p>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-[#0F5132] border border-emerald-200">
                Verified Active System
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-bold">
                    <th className="py-3 px-3.5">User Role</th>
                    <th className="py-3 px-3.5">Assigned Dashboard</th>
                    <th className="py-3 px-2 text-center">CRM</th>
                    <th className="py-3 px-2 text-center">Front Desk</th>
                    <th className="py-3 px-2 text-center">Housekeeping</th>
                    <th className="py-3 px-2 text-center">Dining</th>
                    <th className="py-3 px-2 text-center">Billing</th>
                    <th className="py-3 px-2 text-center">Expenses Capex</th>
                    <th className="py-3 px-2 text-center">P&L Reports</th>
                    <th className="py-3 px-2 text-center">Staff & Roles</th>
                    <th className="py-3 px-2 text-center">SaaS Billing</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {RBAC_MATRIX.map((row) => {
                    const isCurrent = row.roleName === role;
                    return (
                      <tr
                        key={row.roleName}
                        className={isCurrent ? 'bg-emerald-50/40 font-semibold' : 'hover:bg-[#F8FAFC]'}
                      >
                        <td className="py-3 px-3.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-[#0F172A]">{row.roleName}</span>
                            {isCurrent && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#0F5132] text-white">
                                You
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-[#64748B] block">{row.authorityLevel}</span>
                        </td>
                        <td className="py-3 px-3.5 text-slate-700 font-medium">{row.dashboardType}</td>
                        <td className="py-3 px-2 text-center">
                          {row.crm ? (
                            <CheckCircle className="w-4 h-4 text-emerald-600 inline" />
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>
                        <td className="py-3 px-2 text-center">
                          {row.frontDesk ? (
                            <CheckCircle className="w-4 h-4 text-emerald-600 inline" />
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>
                        <td className="py-3 px-2 text-center">
                          {row.housekeeping ? (
                            <CheckCircle className="w-4 h-4 text-emerald-600 inline" />
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>
                        <td className="py-3 px-2 text-center">
                          {row.restaurant ? (
                            <CheckCircle className="w-4 h-4 text-emerald-600 inline" />
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>
                        <td className="py-3 px-2 text-center">
                          {row.billingLedgers ? (
                            <CheckCircle className="w-4 h-4 text-emerald-600 inline" />
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>
                        <td className="py-3 px-2 text-center">
                          {row.expensesCapex ? (
                            <CheckCircle className="w-4 h-4 text-emerald-600 inline" />
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>
                        <td className="py-3 px-2 text-center">
                          {row.reportsPnl ? (
                            <CheckCircle className="w-4 h-4 text-emerald-600 inline" />
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>
                        <td className="py-3 px-2 text-center">
                          {row.staffManagement ? (
                            <CheckCircle className="w-4 h-4 text-emerald-600 inline" />
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>
                        <td className="py-3 px-2 text-center">
                          {row.saasBilling ? (
                            <CheckCircle className="w-4 h-4 text-emerald-600 inline" />
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      <Modal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        title="Invite New Staff Member"
        description={`Send a 7-day secure onboarding link for ${currentResort.name}`}
        maxWidth="md"
      >
        <div className="space-y-4 text-left">
          {limits.isUserLimitReached ? (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-800">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Staff Member Limit Reached
              </div>
              <p>
                Your resort has reached its plan allocation ({limits.usersUsed}/{limits.userLimit} staff accounts).
                Upgrade to a higher SaaS subscription tier to invite more staff members.
              </p>
              <Link
                to="/subscription"
                className="inline-block mt-1 font-bold text-[#0F5132] underline"
              >
                Upgrade Subscription Plan →
              </Link>
            </div>
          ) : !generatedUrl ? (
            <form onSubmit={handleCreateInvite} className="space-y-4">
              <Input
                label="Staff Email Address"
                type="email"
                placeholder="e.g. priya.patel@joyresorts.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
                required
              />

              <Select
                label="Designated System Role (Determines Accessible Dashboard)"
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as UserRole)}
                options={[
                  { label: 'Resort Manager (General Ops)', value: 'Resort Manager' },
                  { label: 'Receptionist (Front Desk & Check-In)', value: 'Receptionist' },
                  { label: 'Housekeeping Supervisor', value: 'Housekeeping' },
                  { label: 'Restaurant / F&B Manager (KOT & POS)', value: 'Restaurant/F&B' },
                  { label: 'Accountant (Ledgers & GST Reports)', value: 'Accountant' },
                  { label: 'Sales Executive (CRM & Leads)', value: 'Sales Executive' },
                ]}
              />

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#64748B] flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#0F5132] shrink-0 mt-0.5" />
                <span>
                  The candidate will receive an onboarding link valid for <strong>7 days</strong>. When they log in, they will automatically see the dashboard associated with their selected role.
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" type="button" onClick={() => setIsInviteOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" rightIcon={<Sparkles className="w-4 h-4" />}>
                  Generate Invitation Link
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#0F5132] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">Invitation Link Ready!</h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Share this private link with <strong>{inviteEmail}</strong> as <strong>{inviteRole}</strong>.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2 text-left">
                <span className="text-xs font-mono text-[#0F172A] truncate flex-1">
                  {generatedUrl}
                </span>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleCopyLink(generatedUrl)}
                  leftIcon={copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                >
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setGeneratedUrl(null);
                    setInviteEmail('');
                  }}
                >
                  Invite Another
                </Button>
                <Button variant="primary" onClick={() => setIsInviteOpen(false)}>
                  Done
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
