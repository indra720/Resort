import { ResortTenant, Invoice } from '@/types';
import { getDbItem, setDbItem, DB_KEYS } from './db';

export interface CreateResortPayload {
  name: string;
  city: string;
  state: string;
  totalRooms: number;
  plan: 'Basic' | 'Pro' | 'Enterprise';
  ownerName: string;
  ownerEmail: string;
  phone?: string;
}

export function getAllResorts(): ResortTenant[] {
  return getDbItem<ResortTenant[]>(DB_KEYS.RESORTS, []);
}

export function getResortById(resortId: string): ResortTenant | undefined {
  const resorts = getAllResorts();
  return resorts.find((r) => r.id === resortId);
}

/**
 * Creates a brand new resort tenant with a 14-day free trial.
 */
export function createResortTenant(payload: CreateResortPayload): ResortTenant {
  const resorts = getAllResorts();
  const codePrefix = payload.city.slice(0, 3).toUpperCase() || 'RES';
  const planMrr = payload.plan === 'Enterprise' ? 49999 : payload.plan === 'Pro' ? 27999 : 14999;

  const newResort: ResortTenant = {
    id: `resort-${Date.now()}`,
    name: payload.name,
    code: `JOY-${codePrefix}-${Math.floor(100 + Math.random() * 900)}`,
    tagline: 'Luxury • Nature • Hospitality',
    city: payload.city,
    state: payload.state,
    plan: payload.plan,
    status: 'Trial', // Default to 14-day SaaS trial
    totalRooms: payload.totalRooms || 20,
    activeUsers: 1,
    mrr: planMrr,
    ownerName: payload.ownerName,
    ownerEmail: payload.ownerEmail,
    joinedDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
  };

  const updated = [newResort, ...resorts];
  setDbItem(DB_KEYS.RESORTS, updated);
  return newResort;
}

/**
 * Upgrades or renews a resort's SaaS subscription.
 */
export function updateResortSubscription(
  resortId: string,
  newPlan: 'Basic' | 'Pro' | 'Enterprise',
  billingCycle: 'monthly' | 'yearly' = 'monthly'
): ResortTenant | undefined {
  const resorts = getAllResorts();
  const targetIndex = resorts.findIndex((r) => r.id === resortId);
  if (targetIndex === -1) return undefined;

  const mrrMap = { Basic: 14999, Pro: 27999, Enterprise: 49999 };
  const updatedResort: ResortTenant = {
    ...resorts[targetIndex],
    plan: newPlan,
    status: 'Active', // Trial converts to Active subscription
    mrr: mrrMap[newPlan],
  };

  resorts[targetIndex] = updatedResort;
  setDbItem(DB_KEYS.RESORTS, resorts);

  // Generate SaaS subscription receipt
  const invoices = getDbItem<Invoice[]>(DB_KEYS.INVOICES, []);
  const subTotal = billingCycle === 'yearly' ? mrrMap[newPlan] * 10 : mrrMap[newPlan];
  const gstAmount = Math.round(subTotal * 0.18);
  const newInvoice: Invoice = {
    id: `inv-sub-${Date.now()}`,
    invoiceNumber: `SUB-JOY-${Math.floor(1000 + Math.random() * 9000)}`,
    guestName: `${updatedResort.name} (${updatedResort.ownerName})`,
    date: new Date().toISOString().split('T')[0],
    subTotal,
    gstRate: 18,
    gstAmount,
    grandTotal: subTotal + gstAmount,
    status: 'Paid',
    resortId,
  };
  setDbItem(DB_KEYS.INVOICES, [newInvoice, ...invoices]);

  return updatedResort;
}

/**
 * Computes platform-wide metrics dynamically from all registered tenants
 * for the Super Admin Platform Owner dashboard.
 */
export function computeSaaSPlatformMetrics() {
  const resorts = getAllResorts();
  const totalResorts = resorts.length;
  const activeCount = resorts.filter((r) => r.status === 'Active').length;
  const trialCount = resorts.filter((r) => r.status === 'Trial').length;
  const suspendedCount = resorts.filter((r) => r.status === 'Suspended').length;

  const totalMRR = resorts.reduce((acc, r) => acc + (r.status !== 'Suspended' ? r.mrr : 0), 0);
  const totalARR = totalMRR * 12;

  const planCountMap: Record<string, number> = { Enterprise: 0, Pro: 0, Basic: 0 };
  resorts.forEach((r) => {
    planCountMap[r.plan] = (planCountMap[r.plan] || 0) + 1;
  });

  const planDistribution = [
    { name: 'Enterprise', value: planCountMap.Enterprise || 0, color: '#0F5132' },
    { name: 'Pro', value: planCountMap.Pro || 0, color: '#16A34A' },
    { name: 'Basic', value: planCountMap.Basic || 0, color: '#38BDF8' },
  ];

  return {
    totalResorts,
    activeCount,
    trialCount,
    suspendedCount,
    totalMRR,
    totalARR,
    planDistribution,
    resorts,
  };
}
