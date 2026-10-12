import { SalesTarget, Lead } from '@/types/crm';
import { getDbItem, setDbItem, DB_KEYS } from './db';
import { getLeads } from './leads';

/**
 * Retrieve monthly sales targets
 */
export function getSalesTargets(resortId: string, month: string = '2026-10'): SalesTarget[] {
  const allTargets = getDbItem<SalesTarget[]>(DB_KEYS.SALES_TARGETS, []);
  return allTargets.filter((t) => t.resort_id === resortId && t.month === month);
}

/**
 * Update sales target
 */
export function updateSalesTarget(
  id: string,
  updates: Partial<SalesTarget>,
  resortId: string
): boolean {
  const allTargets = getDbItem<SalesTarget[]>(DB_KEYS.SALES_TARGETS, []);
  const idx = allTargets.findIndex((t) => t.id === id && t.resort_id === resortId);
  if (idx === -1) return false;

  allTargets[idx] = { ...allTargets[idx], ...updates };
  setDbItem(DB_KEYS.SALES_TARGETS, allTargets);
  return true;
}

/**
 * Funnel Stage Interface
 */
export interface FunnelStageData {
  stage: string;
  count: number;
  conversionRate: number; // percentage from previous stage
  overallConversionRate: number; // percentage from top of funnel
  color: string;
}

/**
 * Computes Lead-to-Booking Funnel Analytics with stage conversion %
 */
export function getFunnelAnalytics(resortId: string): {
  stages: FunnelStageData[];
  dropOffReasons: { reason: string; count: number; percentage: number }[];
  totalLeads: number;
  totalBooked: number;
  overallWinRate: number;
  overallConversionRate?: number;
} {
  const leads = getDbItem<Lead[]>(DB_KEYS.LEADS, []).filter((l) => l.resort_id === resortId);
  const total = leads.length;

  if (total === 0) {
    return {
      stages: [],
      dropOffReasons: [],
      totalLeads: 0,
      totalBooked: 0,
      overallWinRate: 0,
    };
  }

  // Stage counts (cumulative funnel progression)
  const contactedOrBeyond = leads.filter(
    (l) => l.status === 'Contacted' || l.status === 'Site Visit' || l.status === 'Interested' || l.status === 'Booked'
  ).length;

  const visitOrBeyond = leads.filter(
    (l) => l.status === 'Site Visit' || l.status === 'Interested' || l.status === 'Booked'
  ).length;

  const interestedOrBeyond = leads.filter(
    (l) => l.status === 'Interested' || l.status === 'Booked'
  ).length;

  const bookedCount = leads.filter((l) => l.status === 'Booked').length;

  const stages: FunnelStageData[] = [
    {
      stage: '1. New Enquiries',
      count: total,
      conversionRate: 100,
      overallConversionRate: 100,
      color: '#3B82F6',
    },
    {
      stage: '2. Contacted',
      count: contactedOrBeyond,
      conversionRate: total > 0 ? Math.round((contactedOrBeyond / total) * 100) : 0,
      overallConversionRate: total > 0 ? Math.round((contactedOrBeyond / total) * 100) : 0,
      color: '#6366F1',
    },
    {
      stage: '3. Site Visit',
      count: visitOrBeyond,
      conversionRate: contactedOrBeyond > 0 ? Math.round((visitOrBeyond / contactedOrBeyond) * 100) : 0,
      overallConversionRate: total > 0 ? Math.round((visitOrBeyond / total) * 100) : 0,
      color: '#A855F7',
    },
    {
      stage: '4. Interested',
      count: interestedOrBeyond,
      conversionRate: visitOrBeyond > 0 ? Math.round((interestedOrBeyond / visitOrBeyond) * 100) : 0,
      overallConversionRate: total > 0 ? Math.round((interestedOrBeyond / total) * 100) : 0,
      color: '#F59E0B',
    },
    {
      stage: '5. Booked Stay',
      count: bookedCount,
      conversionRate: interestedOrBeyond > 0 ? Math.round((bookedCount / interestedOrBeyond) * 100) : 0,
      overallConversionRate: total > 0 ? Math.round((bookedCount / total) * 100) : 0,
      color: '#10B981',
    },
    {
      stage: '6. Confirmed / Reserved',
      count: bookedCount,
      conversionRate: 100,
      overallConversionRate: total > 0 ? Math.round((bookedCount / total) * 100) : 0,
      color: '#0F5132',
    },
  ];

  // Drop-off / Lost reasons analysis
  const lostLeads = leads.filter((l) => l.status === 'Lost');
  const reasonMap: Record<string, number> = {};
  lostLeads.forEach((l) => {
    const r = l.lost_reason || 'Other / No response';
    reasonMap[r] = (reasonMap[r] || 0) + 1;
  });

  const dropOffReasons = Object.entries(reasonMap)
    .map(([reason, count]) => ({
      reason,
      count,
      percentage: lostLeads.length > 0 ? Math.round((count / lostLeads.length) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  const overallWinRate = total > 0 ? Math.round((bookedCount / total) * 100) : 0;

  return {
    stages,
    dropOffReasons,
    totalLeads: total,
    totalBooked: bookedCount,
    overallWinRate,
    overallConversionRate: overallWinRate,
  };
}

/**
 * Dynamic Leaderboard calculated directly from active leads store
 */
export function getExecutiveLeaderboard(resortId: string): {
  executiveName: string;
  executive_name?: string;
  assignedLeads: number;
  assigned_leads?: number;
  bookedCount: number;
  booked_count?: number;
  revenue: number;
  winRate: number;
  win_rate?: number;
  targetRevenue: number;
  target_revenue?: number;
  target_amount?: number;
  targetProgressPercent: number;
  target_progress_percent?: number;
  avgResponseMinutes: number;
  avg_response_minutes?: number;
  rank: number;
}[] {
  const leads = getDbItem<Lead[]>(DB_KEYS.LEADS, []).filter((l) => l.resort_id === resortId);
  const targets = getSalesTargets(resortId, '2026-10');

  const execMap: Record<string, { assigned: number; booked: number; revenue: number }> = {};

  leads.forEach((l) => {
    const name = l.assigned_to || 'Unassigned';
    if (!execMap[name]) {
      execMap[name] = { assigned: 0, booked: 0, revenue: 0 };
    }
    execMap[name].assigned += 1;
    if (l.status === 'Booked') {
      execMap[name].booked += 1;
      execMap[name].revenue += l.budget_max || l.budget_min || 18480;
    }
  });

  const leaderboard = Object.keys(execMap).map((name) => {
    const stat = execMap[name];
    const target = targets.find((t) => t.executive_name.toLowerCase() === name.toLowerCase());
    const targetRev = target?.target_revenue || 1000000;
    const winRate = stat.assigned > 0 ? Math.round((stat.booked / stat.assigned) * 100) : 0;
    const progress = Math.min(150, Math.round((stat.revenue / targetRev) * 100));

    return {
      executiveName: name,
      executive_name: name,
      assignedLeads: stat.assigned,
      assigned_leads: stat.assigned,
      bookedCount: stat.booked,
      booked_count: stat.booked,
      revenue: stat.revenue,
      winRate,
      win_rate: winRate,
      targetRevenue: targetRev,
      target_revenue: targetRev,
      target_amount: targetRev,
      targetProgressPercent: progress,
      target_progress_percent: progress,
      avgResponseMinutes: target?.avg_response_minutes || 15,
      avg_response_minutes: target?.avg_response_minutes || 15,
      rank: 0,
    };
  });

  // Sort by revenue descending and assign rank
  leaderboard.sort((a, b) => b.revenue - a.revenue);
  leaderboard.forEach((item, idx) => {
    item.rank = idx + 1;
  });

  return leaderboard;
}
