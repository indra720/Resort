import { User, UserRole, StaffInvite } from '@/types';
import { getDbItem, setDbItem, DB_KEYS } from './db';
import { checkResortLimits } from './plansApi';

export interface UserRecord extends User {
  resortId?: string;
}

export function getStaff(resortId?: string, isSuperAdmin = false): UserRecord[] {
  const users = getDbItem<UserRecord[]>(DB_KEYS.USERS, []);
  if (isSuperAdmin && !resortId) {
    return users;
  }
  return users.filter((u) => !u.resortId || u.resortId === (resortId || 'resort-1'));
}

export function getInvites(resortId?: string): StaffInvite[] {
  const invites = getDbItem<StaffInvite[]>(DB_KEYS.INVITES, []);
  if (!resortId) return invites;
  return invites.filter((inv) => inv.resortId === resortId);
}

export function inviteStaff(
  email: string,
  role: UserRole,
  resortId: string,
  resortName: string,
  invitedBy: string
): { success: boolean; invite?: StaffInvite; inviteUrl?: string; error?: string } {
  const limits = checkResortLimits(resortId);
  if (limits.isUserLimitReached) {
    return {
      success: false,
      error: `Staff user limit reached (${limits.usersUsed}/${limits.userLimit} active users on ${limits.plan} plan). Please upgrade your subscription.`,
    };
  }

  const invites = getDbItem<StaffInvite[]>(DB_KEYS.INVITES, []);
  const token = `inv_tok_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 Days Expiry

  const newInvite: StaffInvite = {
    id: `inv-${Date.now()}`,
    email,
    role,
    resortId,
    resortName,
    invitedBy,
    createdAt: new Date().toISOString(),
    expiresAt,
    token,
    status: 'Pending',
  };

  setDbItem(DB_KEYS.INVITES, [newInvite, ...invites]);

  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  const inviteUrl = `${origin}/invite/${token}`;

  return { success: true, invite: newInvite, inviteUrl };
}

export function revokeInvite(inviteId: string): boolean {
  const invites = getDbItem<StaffInvite[]>(DB_KEYS.INVITES, []);
  const filtered = invites.filter((i) => i.id !== inviteId);
  setDbItem(DB_KEYS.INVITES, filtered);
  return true;
}

export function acceptStaffInvite(
  token: string,
  name: string,
  phone: string
): { success: boolean; user?: UserRecord; error?: string } {
  const invites = getDbItem<StaffInvite[]>(DB_KEYS.INVITES, []);
  const invite = invites.find((i) => i.token === token);

  if (!invite) {
    return { success: false, error: 'Invalid or missing invitation token.' };
  }

  if (invite.status !== 'Pending') {
    return { success: false, error: `This invitation has already been ${invite.status.toLowerCase()}.` };
  }

  // Check 7-day expiry
  if (new Date() > new Date(invite.expiresAt)) {
    invite.status = 'Expired';
    setDbItem(DB_KEYS.INVITES, invites);
    return { success: false, error: 'Invitation link has expired (7-day validity). Please request a new invite.' };
  }

  // Provision user
  const users = getDbItem<UserRecord[]>(DB_KEYS.USERS, []);
  const newUser: UserRecord = {
    id: `usr-${Date.now()}`,
    name,
    email: invite.email,
    phone: phone || '+91 98000 00000',
    role: invite.role,
    resortId: invite.resortId,
    department: invite.role === 'Housekeeping' ? 'Housekeeping & Cleanliness' : invite.role === 'Receptionist' ? 'Front Desk' : 'Operations',
  };

  users.push(newUser);
  setDbItem(DB_KEYS.USERS, users);

  // Mark invite as accepted
  invite.status = 'Accepted';
  setDbItem(DB_KEYS.INVITES, invites);

  return { success: true, user: newUser };
}
