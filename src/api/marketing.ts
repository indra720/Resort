import {
  Lead,
  LeadSourceConfig,
  AudienceSegment,
  BroadcastMessage,
  LeadCaptureForm,
  ReferralRecord,
  MarketingDashboardMetrics,
  MarketingSourceMetric,
  MarketingChannelMetric,
  CampaignChannel,
} from '@/types/crm';
import { DB_KEYS, getDbItem, setDbItem } from './db';
import {
  INITIAL_SEEDED_LEAD_SOURCES,
  INITIAL_SEEDED_SEGMENTS,
  INITIAL_SEEDED_BROADCASTS,
  INITIAL_SEEDED_CAPTURE_FORMS,
  INITIAL_SEEDED_REFERRALS,
} from '@/data/seedMarketing';
import { INITIAL_SEEDED_LEADS, INITIAL_SEEDED_GUESTS } from '@/data/seedLeads';
import { getCampaigns } from './campaigns';
import { addLeadActivity } from './leads';

// ==========================================
// 1. Marketing Dashboard Analytics Engine
// ==========================================

export function getMarketingMetrics(resortId: string = 'resort-1'): MarketingDashboardMetrics {
  const allLeads = getDbItem<Lead[]>(DB_KEYS.LEADS, INITIAL_SEEDED_LEADS).filter(
    (l) => l.resort_id === resortId
  );
  const campaigns = getCampaigns(resortId);
  const leadSources = getLeadSources(resortId);

  const totalLeads = allLeads.length;
  const bookedLeads = allLeads.filter((l) => l.status === 'Booked');
  const totalBookings = bookedLeads.length;
  const totalRevenue = bookedLeads.reduce((acc, l) => acc + (l.budget_max || l.budget_min || 0), 0);
  const totalMarketingSpend = campaigns.reduce((acc, c) => acc + (c.spend || 0), 0);

  const overallCPL = totalLeads > 0 ? Math.round(totalMarketingSpend / totalLeads) : 0;
  const overallCPB = totalBookings > 0 ? Math.round(totalMarketingSpend / totalBookings) : 0;
  const overallROI =
    totalMarketingSpend > 0
      ? Math.round(((totalRevenue - totalMarketingSpend) / totalMarketingSpend) * 100)
      : 0;

  // Source distribution
  const sourceMap = new Map<string, { count: number; bookings: number; revenue: number }>();
  // Seed with configured active sources
  leadSources.forEach((src) => {
    sourceMap.set(src.name, { count: 0, bookings: 0, revenue: 0 });
  });

  allLeads.forEach((lead) => {
    const srcName = lead.source || 'Website Direct';
    const curr = sourceMap.get(srcName) || { count: 0, bookings: 0, revenue: 0 };
    curr.count += 1;
    if (lead.status === 'Booked') {
      curr.bookings += 1;
      curr.revenue += lead.budget_max || lead.budget_min || 0;
    }
    sourceMap.set(srcName, curr);
  });

  const sourcesDistribution: MarketingSourceMetric[] = Array.from(sourceMap.entries()).map(
    ([source, data]) => {
      const srcConfig = leadSources.find((s) => s.name === source);
      const estCpl = srcConfig?.estimated_cpl || 400;
      const estimatedCost = data.count * estCpl;
      const convRate = data.count > 0 ? Math.round((data.bookings / data.count) * 100) : 0;
      const cpl = estCpl;
      const cpb = data.bookings > 0 ? Math.round(estimatedCost / data.bookings) : estimatedCost;

      return {
        source,
        leadsCount: data.count,
        bookingsCount: data.bookings,
        conversionRate: convRate,
        revenue: data.revenue,
        percentageOfLeads: totalLeads > 0 ? Math.round((data.count / totalLeads) * 100) : 0,
        estimatedCost,
        cpl,
        cpb,
      };
    }
  );

  // Sort sources by leads count descending
  sourcesDistribution.sort((a, b) => b.leadsCount - a.leadsCount);

  // Channel metrics
  const channels: CampaignChannel[] = ['WhatsApp', 'Google Ads', 'Meta Ads', 'Email', 'SMS'];
  const channelPerformance: MarketingChannelMetric[] = channels.map((channel) => {
    const channelCampaigns = campaigns.filter((c) => c.channel === channel);
    const spend = channelCampaigns.reduce((acc, c) => acc + (c.spend || 0), 0);
    const leads = channelCampaigns.reduce((acc, c) => acc + (c.leads_generated || 0), 0);
    const rev = channelCampaigns.reduce((acc, c) => acc + (c.revenue_generated || 0), 0);
    const roi = spend > 0 ? Math.round(((rev - spend) / spend) * 100) : 0;

    return {
      channel,
      campaignsCount: channelCampaigns.length,
      spend,
      leads,
      revenue: rev,
      roi,
    };
  });

  return {
    totalLeads,
    totalBookings,
    totalRevenue,
    totalMarketingSpend,
    overallCPL,
    overallCPB,
    overallROI,
    sourcesDistribution,
    channelPerformance,
  };
}

// ==========================================
// 2. Lead Sources Configuration
// ==========================================

export function getLeadSources(resortId?: string): LeadSourceConfig[] {
  const all = getDbItem<LeadSourceConfig[]>(DB_KEYS.LEAD_SOURCES, INITIAL_SEEDED_LEAD_SOURCES);
  if (!resortId) return all;
  return all.filter((s) => s.resort_id === resortId);
}

export function createLeadSource(
  data: Omit<LeadSourceConfig, 'id' | 'created_at' | 'resort_id'>,
  resortId: string,
  _user?: any
): { success: boolean; data?: LeadSourceConfig; error?: string } {
  try {
    const all = getDbItem<LeadSourceConfig[]>(DB_KEYS.LEAD_SOURCES, INITIAL_SEEDED_LEAD_SOURCES);
    const newSource: LeadSourceConfig = {
      ...data,
      id: `src-${Date.now().toString().slice(-6)}`,
      resort_id: resortId,
      created_at: new Date().toISOString(),
    };
    setDbItem(DB_KEYS.LEAD_SOURCES, [...all, newSource]);
    return { success: true, data: newSource };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to add source' };
  }
}

export function toggleLeadSourceActive(
  id: string,
  resortId: string,
  _user?: any
): { success: boolean; error?: string } {
  try {
    const all = getDbItem<LeadSourceConfig[]>(DB_KEYS.LEAD_SOURCES, INITIAL_SEEDED_LEAD_SOURCES);
    const index = all.findIndex((s) => s.id === id && s.resort_id === resortId);
    if (index === -1) return { success: false, error: 'Source not found' };

    all[index] = { ...all[index], is_active: !all[index].is_active };
    setDbItem(DB_KEYS.LEAD_SOURCES, all);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to toggle source' };
  }
}

// ==========================================
// 3. Audience Segments (Dynamic Member Counts)
// ==========================================

export function getAudienceSegments(resortId: string = 'resort-1'): AudienceSegment[] {
  const segments = getDbItem<AudienceSegment[]>(DB_KEYS.SEGMENTS, INITIAL_SEEDED_SEGMENTS).filter(
    (s) => s.resort_id === resortId
  );
  const leads = getDbItem<Lead[]>(DB_KEYS.LEADS, INITIAL_SEEDED_LEADS).filter(
    (l) => l.resort_id === resortId
  );
  const guests = getDbItem<any[]>(DB_KEYS.GUESTS, INITIAL_SEEDED_GUESTS).filter(
    (g) => g.resort_id === resortId
  );

  return segments.map((seg) => {
    let liveCount = seg.member_count;

    if (seg.filter_type === 'past_guests') {
      liveCount = Math.max(guests.length, leads.filter((l) => l.status === 'Booked').length);
    } else if (seg.filter_type === 'corporate') {
      liveCount = leads.filter((l) => l.interested_in === 'Corporate Event').length;
    } else if (seg.filter_type === 'wedding') {
      liveCount = leads.filter((l) => l.interested_in === 'Wedding').length;
    } else if (seg.filter_type === 'lost_90_days') {
      liveCount = leads.filter((l) => l.status === 'Lost').length;
    } else if (seg.filter_type === 'hot_leads') {
      liveCount = leads.filter(
        (l) => l.score === 'Hot' || l.status === 'Interested' || l.status === 'Site Visit'
      ).length;
    }

    return {
      ...seg,
      member_count: Math.max(liveCount, 1),
    };
  });
}

// ==========================================
// 4. Broadcast Messages
// ==========================================

export function getBroadcasts(resortId?: string): BroadcastMessage[] {
  const all = getDbItem<BroadcastMessage[]>(DB_KEYS.BROADCASTS, INITIAL_SEEDED_BROADCASTS);
  if (!resortId) return all;
  return all.filter((b) => b.resort_id === resortId);
}

export function scheduleBroadcast(
  data: Omit<BroadcastMessage, 'id' | 'created_at' | 'actual_sent'>,
  resortId: string,
  user?: any
): { success: boolean; data?: BroadcastMessage; error?: string } {
  try {
    if (!data.opt_in_confirmed) {
      return {
        success: false,
        error: 'TRAI / DND Compliance: Opt-in consent must be checked before broadcasting.',
      };
    }

    const all = getDbItem<BroadcastMessage[]>(DB_KEYS.BROADCASTS, INITIAL_SEEDED_BROADCASTS);
    const newBroadcast: BroadcastMessage = {
      ...data,
      id: `bc-${Date.now().toString().slice(-6)}`,
      resort_id: resortId,
      actual_sent: data.status === 'Sent' ? data.estimated_reach : 0,
      created_at: new Date().toISOString(),
      created_by: user?.name ? `${user.name} (${user.role || 'Staff'})` : 'Staff Admin',
    };

    setDbItem(DB_KEYS.BROADCASTS, [newBroadcast, ...all]);
    return { success: true, data: newBroadcast };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to schedule broadcast' };
  }
}

// ==========================================
// 5. Lead Capture Form Builder
// ==========================================

export function getCaptureForms(resortId?: string): LeadCaptureForm[] {
  const all = getDbItem<LeadCaptureForm[]>(DB_KEYS.CAPTURE_FORMS, INITIAL_SEEDED_CAPTURE_FORMS);
  if (!resortId) return all;
  return all.filter((f) => f.resort_id === resortId);
}

export function saveCaptureForm(
  formData: Omit<LeadCaptureForm, 'id' | 'created_at' | 'embed_code'> & { id?: string },
  resortId: string,
  _user?: any
): { success: boolean; data?: LeadCaptureForm; error?: string } {
  try {
    const all = getDbItem<LeadCaptureForm[]>(DB_KEYS.CAPTURE_FORMS, INITIAL_SEEDED_CAPTURE_FORMS);
    const formId = formData.id || `form-${Date.now().toString().slice(-6)}`;
    const embedUrl = `${window.location.origin}/enquire/${resortId}`;
    const embedSnippet = `<iframe src="${embedUrl}" width="100%" height="680" frameborder="0" style="border:none;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.08);"></iframe>`;

    const savedForm: LeadCaptureForm = {
      ...formData,
      id: formId,
      resort_id: resortId,
      embed_code: embedSnippet,
      created_at: new Date().toISOString(),
    };

    const existingIndex = all.findIndex((f) => f.id === formId);
    if (existingIndex >= 0) {
      all[existingIndex] = savedForm;
    } else {
      all.unshift(savedForm);
    }

    setDbItem(DB_KEYS.CAPTURE_FORMS, all);
    return { success: true, data: savedForm };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save capture form' };
  }
}

/**
 * Public website enquiry submission handler
 * Creates a Lead in joy_leads_data, auto-logs activity, and attaches UTM tags
 */
export function submitPublicEnquiry(
  formData: {
    name: string;
    phone: string;
    email: string;
    city?: string;
    preferred_date?: string;
    guests?: number;
    budget?: number;
    interested_in?: any;
    remarks?: string;
  },
  resortId: string = 'resort-1',
  utmData?: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
  }
): { success: boolean; lead?: Lead; error?: string } {
  try {
    if (!formData.name.trim() || !formData.phone.trim()) {
      return { success: false, error: 'Name and Phone are mandatory fields.' };
    }

    const allLeads = getDbItem<Lead[]>(DB_KEYS.LEADS, INITIAL_SEEDED_LEADS);
    const leadId = `lead-web-${Date.now().toString().slice(-6)}`;

    const tags: string[] = ['Website Enquiry'];
    if (utmData?.utm_campaign) {
      tags.push(`UTM: ${utmData.utm_campaign}`);
    }
    if (utmData?.utm_source) {
      tags.push(`Source: ${utmData.utm_source}`);
    }

    const newLead: Lead = {
      id: leadId,
      resort_id: resortId,
      lead_code: `LEAD${Math.floor(100 + Math.random() * 899)}`,
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email?.trim() || '',
      city: formData.city?.trim() || 'Online Visitor',
      interested_in: (formData.interested_in as any) || 'Weekend Stay',
      budget_min: formData.budget ? Math.round(formData.budget * 0.8) : 20000,
      budget_max: formData.budget || 25000,
      guests_adults: formData.guests || 2,
      guests_children: 0,
      preferred_date: formData.preferred_date || new Date().toISOString().slice(0, 10),
      source: 'Website',
      status: 'New',
      priority: 'Medium',
      score: 'Warm',
      assigned_to: 'Unassigned',
      remarks: formData.remarks
        ? `${formData.remarks} [Web Form Submission]`
        : 'Submitted via website embedded enquiry form',
      tags,
      created_at: new Date().toISOString(),
      last_activity_at: new Date().toISOString(),
    };

    setDbItem(DB_KEYS.LEADS, [newLead, ...allLeads]);

    // Auto log activity
    addLeadActivity(leadId, resortId, {
      actor_name: 'Website Concierge',
      actor_role: 'System',
      type: 'created',
      title: 'Direct Website Enquiry',
      description: `Direct enquiry submitted via public embed form from ${formData.name} (${formData.phone})`,
    });

    return { success: true, lead: newLead };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to submit enquiry' };
  }
}

// ==========================================
// 6. Referral Program Management
// ==========================================

export function getReferrals(resortId?: string): ReferralRecord[] {
  const all = getDbItem<ReferralRecord[]>(DB_KEYS.REFERRALS, INITIAL_SEEDED_REFERRALS);
  if (!resortId) return all;
  return all.filter((r) => r.resort_id === resortId);
}

export function createReferral(
  data: Omit<ReferralRecord, 'id' | 'created_at'>,
  resortId: string,
  _user?: any
): { success: boolean; data?: ReferralRecord; error?: string } {
  try {
    const all = getDbItem<ReferralRecord[]>(DB_KEYS.REFERRALS, INITIAL_SEEDED_REFERRALS);
    const newReferral: ReferralRecord = {
      ...data,
      id: `ref-${Date.now().toString().slice(-6)}`,
      resort_id: resortId,
      created_at: new Date().toISOString(),
    };
    setDbItem(DB_KEYS.REFERRALS, [newReferral, ...all]);
    return { success: true, data: newReferral };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to add referral' };
  }
}

export function updateReferralStatus(
  id: string,
  status: 'Pending' | 'Rewarded' | 'Rejected',
  resortId: string,
  _user?: any,
  notes?: string
): { success: boolean; data?: ReferralRecord; error?: string } {
  try {
    const all = getDbItem<ReferralRecord[]>(DB_KEYS.REFERRALS, INITIAL_SEEDED_REFERRALS);
    const index = all.findIndex((r) => r.id === id && r.resort_id === resortId);
    if (index === -1) return { success: false, error: 'Referral record not found' };

    const updated: ReferralRecord = {
      ...all[index],
      status,
      notes: notes !== undefined ? notes : all[index].notes,
    };

    all[index] = updated;
    setDbItem(DB_KEYS.REFERRALS, all);
    return { success: true, data: updated };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update referral status' };
  }
}
