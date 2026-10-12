import { Lead, LeadActivity, LeadScoreBreakdown, LeadSLAStatus, LeadScoreFactor } from '@/types/crm';

/**
 * Computes deterministic Lead Score (0-100) with complete factor breakdown explaining "why"
 */
export function computeLeadScore(
  lead: Lead,
  activities: LeadActivity[] = []
): LeadScoreBreakdown {
  const factors: LeadScoreFactor[] = [];

  // 1. Budget Factor (Max 30 pts)
  const maxBudget = lead.budget_max || lead.budget_min || 0;
  if (maxBudget >= 150000) {
    factors.push({
      factor: 'Budget Intent',
      score: 30,
      maxScore: 30,
      reason: `High luxury budget (₹${maxBudget.toLocaleString('en-IN')})`,
    });
  } else if (maxBudget >= 75000) {
    factors.push({
      factor: 'Budget Intent',
      score: 20,
      maxScore: 30,
      reason: `Moderate-high stay budget (₹${maxBudget.toLocaleString('en-IN')})`,
    });
  } else if (maxBudget >= 30000) {
    factors.push({
      factor: 'Budget Intent',
      score: 12,
      maxScore: 30,
      reason: `Standard room budget (₹${maxBudget.toLocaleString('en-IN')})`,
    });
  } else {
    factors.push({
      factor: 'Budget Intent',
      score: 5,
      maxScore: 30,
      reason: 'Economy or unstated budget expectation',
    });
  }

  // 2. Lead Source Quality (Max 25 pts)
  if (lead.source === 'Referral' || lead.source === 'Walk-in') {
    factors.push({
      factor: 'Source Quality',
      score: 25,
      maxScore: 25,
      reason: `High conversion channel (${lead.source})`,
    });
  } else if (lead.source === 'Website' || lead.source === 'Google Ads') {
    factors.push({
      factor: 'Source Quality',
      score: 20,
      maxScore: 25,
      reason: `Direct high-intent enquiry (${lead.source})`,
    });
  } else if (lead.source === 'Instagram' || lead.source === 'Facebook') {
    factors.push({
      factor: 'Source Quality',
      score: 12,
      maxScore: 25,
      reason: `Social media campaign lead (${lead.source})`,
    });
  } else {
    factors.push({
      factor: 'Source Quality',
      score: 10,
      maxScore: 25,
      reason: `OTA or external aggregator source (${lead.source})`,
    });
  }

  // 3. Engagement & Interactions (Max 30 pts)
  const hasSiteVisit = lead.status === 'Site Visit' || activities.some((a) => a.title.toLowerCase().includes('site visit'));
  const callOrWaCount = activities.filter((a) => a.type === 'call' || a.type === 'whatsapp' || a.type === 'email').length;

  if (hasSiteVisit) {
    factors.push({
      factor: 'Engagement & Actions',
      score: 30,
      maxScore: 30,
      reason: 'Scheduled or completed in-person resort inspection',
    });
  } else if (callOrWaCount >= 2) {
    factors.push({
      factor: 'Engagement & Actions',
      score: 20,
      maxScore: 30,
      reason: `${callOrWaCount} direct guest conversations logged`,
    });
  } else if (callOrWaCount === 1) {
    factors.push({
      factor: 'Engagement & Actions',
      score: 12,
      maxScore: 30,
      reason: 'Initial outreach interaction recorded',
    });
  } else {
    factors.push({
      factor: 'Engagement & Actions',
      score: 5,
      maxScore: 30,
      reason: 'Awaiting initial response from guest',
    });
  }

  // 4. Requirement Type (Max 15 pts)
  if (lead.interested_in === 'Wedding' || lead.interested_in === 'Corporate Event' || lead.interested_in === 'Conference') {
    factors.push({
      factor: 'High-Yield Event Type',
      score: 15,
      maxScore: 15,
      reason: `High revenue group booking (${lead.interested_in})`,
    });
  } else if (lead.interested_in === 'Luxury Stay' || lead.interested_in === 'Family Stay') {
    factors.push({
      factor: 'High-Yield Event Type',
      score: 10,
      maxScore: 15,
      reason: `Premium multi-guest accommodation (${lead.interested_in})`,
    });
  } else {
    factors.push({
      factor: 'High-Yield Event Type',
      score: 6,
      maxScore: 15,
      reason: `Standard requirement (${lead.interested_in})`,
    });
  }

  const totalScore = Math.min(100, factors.reduce((acc, f) => acc + f.score, 0));

  let rating: 'Hot' | 'Warm' | 'Cold' = 'Warm';
  if (totalScore >= 70) rating = 'Hot';
  else if (totalScore < 40) rating = 'Cold';

  return {
    totalScore,
    rating,
    factors,
  };
}

/**
 * Computes SLA response time status for leads awaiting first contact
 */
export function computeLeadSLA(
  lead: Lead,
  thresholdMinutes: number = 30
): LeadSLAStatus {
  // If lead is already contacted, booked, site visit, or lost, SLA is satisfied
  if (lead.status !== 'New') {
    return {
      isBreached: false,
      elapsedMinutes: 0,
      thresholdMinutes,
      status: 'ok',
      label: 'SLA Responded',
    };
  }

  const createdTime = new Date(lead.created_at).getTime();
  const now = Date.now();
  const elapsedMinutes = Math.max(0, Math.floor((now - createdTime) / 60000));

  if (elapsedMinutes <= thresholdMinutes) {
    return {
      isBreached: false,
      elapsedMinutes,
      thresholdMinutes,
      status: 'ok',
      label: `Within SLA (${elapsedMinutes}m / ${thresholdMinutes}m)`,
    };
  } else if (elapsedMinutes <= 120) {
    return {
      isBreached: true,
      elapsedMinutes,
      thresholdMinutes,
      status: 'warning',
      label: `SLA Warning (${elapsedMinutes}m)`,
    };
  } else {
    const elapsedHours = Math.floor(elapsedMinutes / 60);
    return {
      isBreached: true,
      elapsedMinutes,
      thresholdMinutes,
      status: 'breached',
      label: `SLA Breached (> ${elapsedHours}h ago)`,
    };
  }
}
