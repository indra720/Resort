import { Campaign, CampaignStatus } from '@/types/crm';
import { DB_KEYS, getDbItem, setDbItem } from './db';
import { INITIAL_SEEDED_CAMPAIGNS } from '@/data/seedMarketing';

/**
 * Calculate campaign ROI %: ((revenue - spend) / spend) * 100
 */
export function calculateCampaignROI(revenue: number, spend: number): number {
  if (spend <= 0) return 0;
  return Math.round(((revenue - spend) / spend) * 100);
}

/**
 * Fetch all campaigns for a resort
 */
export function getCampaigns(resortId?: string): Campaign[] {
  const all = getDbItem<Campaign[]>(DB_KEYS.CAMPAIGNS, INITIAL_SEEDED_CAMPAIGNS);
  if (!resortId) return all;
  return all.filter((c) => c.resort_id === resortId);
}

/**
 * Fetch a single campaign by ID
 */
export function getCampaignById(id: string, resortId?: string): Campaign | undefined {
  const all = getCampaigns(resortId);
  return all.find((c) => c.id === id);
}

/**
 * Create a new campaign
 */
export function createCampaign(
  campaignData: Omit<Campaign, 'id' | 'created_at' | 'roi_percent'>,
  resortId: string,
  _user?: any
): { success: boolean; data?: Campaign; error?: string } {
  try {
    const all = getDbItem<Campaign[]>(DB_KEYS.CAMPAIGNS, INITIAL_SEEDED_CAMPAIGNS);
    const newId = `cmp-${Date.now().toString().slice(-6)}`;
    const roi = calculateCampaignROI(
      campaignData.revenue_generated || 0,
      campaignData.spend || 0
    );

    const newCampaign: Campaign = {
      ...campaignData,
      id: newId,
      resort_id: resortId,
      roi_percent: roi,
      created_at: new Date().toISOString(),
    };

    setDbItem(DB_KEYS.CAMPAIGNS, [newCampaign, ...all]);
    return { success: true, data: newCampaign };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to create campaign' };
  }
}

/**
 * Update an existing campaign
 */
export function updateCampaign(
  id: string,
  campaignData: Partial<Campaign>,
  resortId: string,
  _user?: any
): { success: boolean; data?: Campaign; error?: string } {
  try {
    const all = getDbItem<Campaign[]>(DB_KEYS.CAMPAIGNS, INITIAL_SEEDED_CAMPAIGNS);
    const index = all.findIndex((c) => c.id === id && c.resort_id === resortId);

    if (index === -1) {
      return { success: false, error: 'Campaign not found' };
    }

    const current = all[index];
    const updatedSpend = campaignData.spend !== undefined ? campaignData.spend : current.spend;
    const updatedRevenue =
      campaignData.revenue_generated !== undefined
        ? campaignData.revenue_generated
        : current.revenue_generated;
    const updatedROI = calculateCampaignROI(updatedRevenue, updatedSpend);

    const updated: Campaign = {
      ...current,
      ...campaignData,
      spend: updatedSpend,
      revenue_generated: updatedRevenue,
      roi_percent: updatedROI,
    };

    all[index] = updated;
    setDbItem(DB_KEYS.CAMPAIGNS, all);
    return { success: true, data: updated };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update campaign' };
  }
}

/**
 * Delete a campaign
 */
export function deleteCampaign(
  id: string,
  resortId: string,
  _user?: any
): { success: boolean; error?: string } {
  try {
    const all = getDbItem<Campaign[]>(DB_KEYS.CAMPAIGNS, INITIAL_SEEDED_CAMPAIGNS);
    const filtered = all.filter((c) => !(c.id === id && c.resort_id === resortId));

    if (filtered.length === all.length) {
      return { success: false, error: 'Campaign not found' };
    }

    setDbItem(DB_KEYS.CAMPAIGNS, filtered);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete campaign' };
  }
}

/**
 * Toggle or change campaign status
 */
export function toggleCampaignStatus(
  id: string,
  newStatus: CampaignStatus,
  resortId: string,
  user?: any
): { success: boolean; data?: Campaign; error?: string } {
  return updateCampaign(id, { status: newStatus }, resortId, user);
}
