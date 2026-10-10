import { PlatformPlan } from '@/types';
import { PLATFORM_PLANS } from '@/data/mockData';
import { getDbItem, DB_KEYS } from './db';
import { Room, User, ResortTenant } from '@/types';

export const SAAS_PLANS: PlatformPlan[] = PLATFORM_PLANS;

export function getPlanById(planId: string): PlatformPlan | undefined {
  return SAAS_PLANS.find((p) => p.id === planId || p.name.toLowerCase().includes(planId.toLowerCase()));
}

export function getPlanByName(planName: 'Basic' | 'Pro' | 'Enterprise'): PlatformPlan {
  const match = SAAS_PLANS.find((p) => p.name.toLowerCase().startsWith(planName.toLowerCase()));
  return (
    match || {
      id: 'plan-pro',
      name: 'Pro Plan',
      priceMonthly: 27999,
      priceYearly: 279990,
      roomLimit: 30,
      userLimit: 15,
      branchLimit: 2,
      features: ['Full Operations', 'CRM & Leads', 'GST Invoices', '14-Day Trial'],
    }
  );
}

export interface LimitCheckResult {
  plan: 'Basic' | 'Pro' | 'Enterprise';
  roomLimit: number;
  roomsUsed: number;
  isRoomLimitReached: boolean;
  userLimit: number;
  usersUsed: number;
  isUserLimitReached: boolean;
  branchLimit: number;
}

/**
 * Checks a resort's current room & staff usage against their SaaS plan limits.
 */
export function checkResortLimits(resortId: string): LimitCheckResult {
  const resorts = getDbItem<ResortTenant[]>(DB_KEYS.RESORTS, []);
  const resort = resorts.find((r) => r.id === resortId);
  const planName = resort?.plan || 'Pro';
  const plan = getPlanByName(planName);

  const rooms = getDbItem<Room[]>(DB_KEYS.ROOMS, []).filter((r) => (r as any).resortId === resortId);
  const users = getDbItem<User[]>(DB_KEYS.USERS, []).filter((u) => (u as any).resortId === resortId);

  return {
    plan: planName,
    roomLimit: plan.roomLimit,
    roomsUsed: rooms.length,
    isRoomLimitReached: rooms.length >= plan.roomLimit,
    userLimit: plan.userLimit,
    usersUsed: users.length,
    isUserLimitReached: users.length >= plan.userLimit,
    branchLimit: plan.branchLimit,
  };
}
