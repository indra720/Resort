// ==========================================
// CRM & LEAD MANAGEMENT TYPE DEFINITIONS
// ==========================================

export type LeadStatus =
  | 'New'
  | 'Contacted'
  | 'Site Visit'
  | 'Interested'
  | 'Booked'
  | 'Lost';

export type LeadScore = 'Hot' | 'Warm' | 'Cold';

export type LeadPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export type InterestedInType =
  | 'Weekend Stay'
  | 'Family Stay'
  | 'Luxury Stay'
  | 'Wedding'
  | 'Corporate Event'
  | 'Nature Camp'
  | 'Team Outing'
  | 'Adventure Activities'
  | 'Conference';

export type LeadSource =
  | 'Website'
  | 'Instagram'
  | 'Facebook'
  | 'Google Ads'
  | 'Walk-in'
  | 'Referral'
  | 'Travel Agent'
  | 'MakeMyTrip'
  | 'LinkedIn'
  | 'Other';

export interface Lead {
  id: string;
  resort_id: string;
  lead_code: string; // e.g. LEAD001
  name: string;
  phone: string;
  email: string;
  city: string;
  interested_in: InterestedInType;
  guests_adults: number;
  guests_children: number;
  preferred_date: string; // ISO or YYYY-MM-DD
  budget_min: number;
  budget_max: number;
  source: LeadSource;
  campaign_id?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  status: LeadStatus;
  lost_reason?: string;
  priority: LeadPriority;
  score: LeadScore;
  tags: string[];
  assigned_to: string; // Staff name e.g. "Sameer Verma"
  assigned_to_avatar?: string;
  remarks: string;
  created_at: string;
  last_activity_at: string;
  next_followup_at?: string;
  converted_booking_id?: string;
  avatar?: string;
  initials?: string;
  initials_bg?: string;
}

export interface LeadActivity {
  id: string;
  resort_id: string;
  lead_id: string;
  actor_name: string;
  actor_role: string;
  type:
    | 'status_change'
    | 'assignment'
    | 'call'
    | 'whatsapp'
    | 'email'
    | 'note'
    | 'followup'
    | 'booking_converted'
    | 'created';
  title: string;
  description: string;
  timestamp: string;
}

export interface LeadNote {
  id: string;
  resort_id: string;
  lead_id: string;
  author_name: string;
  author_role: string;
  content: string;
  created_at: string;
}

export interface LeadFollowUp {
  id: string;
  resort_id: string;
  lead_id: string;
  lead_name?: string;
  lead_phone?: string;
  title: string;
  channel: 'call' | 'whatsapp' | 'email' | 'site_visit';
  scheduled_at: string;
  due_date?: string; // YYYY-MM-DD
  due_time?: string; // e.g. "11:30 AM"
  due_category?: 'today' | 'overdue' | 'upcoming' | 'done';
  priority?: 'High' | 'Medium' | 'Low';
  assigned_to: string;
  status: 'pending' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
}

export interface GuestRecord {
  id: string;
  resortId: string;
  name: string;
  phone: string;
  email: string;
  city?: string;
  idProofType?: string;
  idProofNumber?: string;
  leadSource?: string;
  leadId?: string;
  totalStays: number;
  totalSpent: number;
  createdAt: string;
}

export interface CRMStats {
  totalLeads: number;
  totalLeadsTrend: string;
  newEnquiries: number;
  newEnquiriesTrend: string;
  siteVisits: number;
  siteVisitsTrend: string;
  bookings: number;
  bookingsTrend: string;
  revenue: number;
  revenueFormatted: string;
  revenueTrend: string;
  statusCounts: Record<string, number>;
}

// ==========================================
// PHASE 3: ADVANCED SALES & AUTOMATION TYPES
// ==========================================

export type QuotationStatus = 'Draft' | 'Sent' | 'Accepted' | 'Rejected' | 'Expired';

export interface QuotationItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Quotation {
  id: string;
  resort_id: string;
  quotation_number: string; // e.g. "QT-2026-001"
  quotation_code?: string;
  assigned_to?: string;
  lead_id?: string;
  guest_name: string;
  guest_phone: string;
  guest_email: string;
  interested_in?: InterestedInType;
  items: QuotationItem[];
  subtotal: number;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  discount_amount: number;
  tax_type: 'GST_12' | 'GST_18' | 'NONE';
  cgst_rate: number;
  sgst_rate: number;
  igst_rate: number;
  tax_amount: number;
  grand_total: number;
  status: QuotationStatus;
  valid_until: string; // YYYY-MM-DD
  notes?: string;
  created_at: string;
  created_by: string;
  converted_booking_id?: string;
  booking_id?: string;
}

export interface QuotationTotals {
  subtotal: number;
  discountAmount: number;
  discount_amount: number;
  taxableAmount: number;
  taxable_amount: number;
  cgstRate: number;
  cgst_rate: number;
  sgstRate: number;
  sgst_rate: number;
  cgstAmount: number;
  cgst_amount: number;
  sgstAmount: number;
  sgst_amount: number;
  igstRate: number;
  taxAmount: number;
  total_tax: number;
  grandTotal: number;
  grand_total: number;
  caDisclaimer: string;
  ca_disclaimer: string;
}

export type TemplateChannel = 'whatsapp' | 'email' | 'sms';
export type TemplateCategory =
  | 'intro'
  | 'followup'
  | 'quotation'
  | 'site_visit'
  | 'booking_confirmation'
  | 'discount_offer';

export interface MessageTemplate {
  id: string;
  resort_id: string;
  name: string;
  channel: TemplateChannel;
  category: TemplateCategory;
  subject?: string; // For emails
  content: string;
  variables: string[]; // e.g. ['guest_name', 'resort_name', 'dates', 'amount']
  created_at: string;
}

export type AutomationTrigger =
  | 'lead_created'
  | 'status_changed'
  | 'idle_time'
  | 'high_budget';

export type AutomationAction =
  | 'notify_manager'
  | 'create_followup'
  | 'assign_lead'
  | 'send_template';

export interface AutomationRule {
  id: string;
  resort_id: string;
  title: string;
  description: string;
  trigger_event: AutomationTrigger;
  trigger_condition?: string;
  action_type: AutomationAction;
  action_payload: Record<string, any>;
  is_active: boolean;
  created_at: string;
  last_triggered_at?: string;
}

export interface AutomationLog {
  id: string;
  resort_id: string;
  rule_id: string;
  rule_title: string;
  lead_id: string;
  lead_name: string;
  action_taken: string;
  timestamp: string;
}

export interface SalesTarget {
  id: string;
  resort_id: string;
  executive_name: string;
  month: string; // e.g. "2026-10"
  target_revenue: number;
  achieved_revenue: number;
  target_bookings: number;
  achieved_bookings: number;
  win_rate_percentage: number;
  avg_response_minutes: number;
}

export interface LeadScoreFactor {
  factor: string;
  score: number;
  maxScore: number;
  reason: string;
}

export interface LeadScoreBreakdown {
  totalScore: number; // 0-100
  rating: 'Hot' | 'Warm' | 'Cold';
  factors: LeadScoreFactor[];
}

export interface LeadSLAStatus {
  isBreached: boolean;
  elapsedMinutes: number;
  thresholdMinutes: number;
  status: 'ok' | 'warning' | 'breached';
  label: string;
}

export interface AutoAssignmentConfig {
  enabled: boolean;
  mode: 'round_robin' | 'by_category';
  active_executives: string[];
}

// ==========================================
// Phase 4: Marketing & Guest Acquisition Types
// ==========================================

export type CampaignChannel = 'WhatsApp' | 'Email' | 'SMS' | 'Google Ads' | 'Meta Ads';
export type CampaignStatus = 'Draft' | 'Running' | 'Paused' | 'Completed';

export interface Campaign {
  id: string;
  resort_id: string;
  name: string;
  channel: CampaignChannel;
  budget: number;
  spend: number;
  start_date: string;
  end_date: string;
  target_audience: string;
  offer_code?: string;
  status: CampaignStatus;
  leads_generated: number;
  bookings_generated: number;
  revenue_generated: number;
  roi_percent: number;
  message?: string;
  created_at: string;
}

export interface Coupon {
  id: string;
  resort_id: string;
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_stay_nights: number;
  min_spend: number;
  valid_from: string;
  valid_to: string;
  usage_limit: number;
  used_count: number;
  is_active: boolean;
  created_at: string;
}

export interface CouponValidationResult {
  isValid: boolean;
  discountAmount: number;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  coupon?: Coupon;
  message: string;
}

export interface LeadSourceConfig {
  id: string;
  resort_id: string;
  name: string;
  category: 'Digital' | 'Offline' | 'Referral' | 'Direct';
  estimated_cpl: number; // Cost per lead estimate in ₹
  is_active: boolean;
  created_at: string;
}

export type AudienceFilterType =
  | 'past_guests'
  | 'corporate'
  | 'wedding'
  | 'lost_90_days'
  | 'hot_leads'
  | 'custom';

export interface AudienceSegment {
  id: string;
  resort_id: string;
  name: string;
  description: string;
  filter_type: AudienceFilterType;
  member_count: number;
  sample_tags?: string[];
  created_at: string;
}

export interface BroadcastMessage {
  id: string;
  resort_id: string;
  title: string;
  segment_id: string;
  segment_name: string;
  template_id?: string;
  channel: 'WhatsApp' | 'Email' | 'SMS';
  scheduled_at: string;
  status: 'Scheduled' | 'Sent' | 'Draft';
  estimated_reach: number;
  actual_sent: number;
  opt_in_confirmed: boolean;
  message_preview: string;
  created_at: string;
  created_by: string;
}

export type LeadCaptureFieldId =
  | 'name'
  | 'phone'
  | 'email'
  | 'city'
  | 'preferred_date'
  | 'guests'
  | 'budget'
  | 'interested_in'
  | 'remarks';

export interface LeadCaptureForm {
  id: string;
  resort_id: string;
  title: string;
  description: string;
  fields: LeadCaptureFieldId[];
  primary_color: string;
  button_text: string;
  success_message: string;
  utm_campaign_default?: string;
  embed_code: string;
  created_at: string;
}

export interface ReferralRecord {
  id: string;
  resort_id: string;
  referrer_name: string;
  referrer_phone: string;
  referrer_email?: string;
  referred_lead_id?: string;
  referred_lead_name: string;
  reward_amount: number;
  status: 'Pending' | 'Rewarded' | 'Rejected';
  notes?: string;
  created_at: string;
}

export interface MarketingSourceMetric {
  source: string;
  leadsCount: number;
  bookingsCount: number;
  conversionRate: number; // %
  revenue: number;
  percentageOfLeads: number; // %
  estimatedCost: number;
  cpl: number; // Cost per lead in ₹
  cpb: number; // Cost per booking in ₹
}

export interface MarketingChannelMetric {
  channel: CampaignChannel;
  campaignsCount: number;
  spend: number;
  leads: number;
  revenue: number;
  roi: number;
}

export interface MarketingDashboardMetrics {
  totalLeads: number;
  totalBookings: number;
  totalRevenue: number;
  totalMarketingSpend: number;
  overallCPL: number;
  overallCPB: number;
  overallROI: number;
  sourcesDistribution: MarketingSourceMetric[];
  channelPerformance: MarketingChannelMetric[];
}

// ==========================================
// Phase 5: CRM Reports, Analytics & Settings Types
// ==========================================

export type DateRangeOption =
  | 'today'
  | 'this_week'
  | 'this_month'
  | 'this_quarter'
  | 'this_year'
  | 'all_time'
  | 'custom';

export interface DateRangeFilter {
  range: DateRangeOption;
  startDate?: string;
  endDate?: string;
}

export interface SourceConversionReport {
  source: string;
  leadsCount: number;
  bookingsCount: number;
  conversionRate: number; // %
  totalRevenue: number; // ₹
  avgDealSize: number; // ₹
}

export interface ExecutiveConversionReport {
  executiveName: string;
  assignedLeads: number;
  bookingsCount: number;
  conversionRate: number; // %
  totalRevenue: number; // ₹
  avgDealSize: number; // ₹
  avgCycleDays: number; // Days to close
  followupAdherenceRate: number; // % followups on time
}

export interface LostReasonReport {
  reason: string;
  count: number;
  percentage: number; // % of total lost leads
  lostPotentialRevenue: number; // ₹
}

export interface MonthlySalesTrend {
  month: string; // e.g. "Jun 2026"
  leadsCount: number;
  bookingsCount: number;
  revenue: number; // ₹
  avgDealSize: number; // ₹
}

export interface CRMAnalyticsReport {
  totalLeads: number;
  totalBookings: number;
  overallConversionRate: number; // %
  totalRevenue: number; // ₹
  avgDealSize: number; // ₹
  avgSalesCycleDays: number; // Average days from New to Booked
  followupAdherenceRate: number; // % completed on or before scheduled date
  sourcesBreakdown: SourceConversionReport[];
  executivesBreakdown: ExecutiveConversionReport[];
  lostReasonsBreakdown: LostReasonReport[];
  monthlyTrend: MonthlySalesTrend[];
}

export interface LostReasonConfig {
  id: string;
  resort_id: string;
  reason: string;
  is_active: boolean;
  created_at: string;
}

export interface LeadScoringWeightConfig {
  budget_high_weight: number; // points for > ₹1L
  budget_mid_weight: number; // points for > ₹50k
  large_party_weight: number; // points for > 10 guests
  high_intent_source_weight: number; // points for Google Ads / Website
  urgent_date_weight: number; // points for preferred date < 14 days
  vip_tag_weight: number; // points for VIP / High LTV tag
}

export interface SLAConfig {
  resort_id: string;
  target_response_minutes: number;
  warning_threshold_minutes: number;
  business_hours_only: boolean;
  notify_on_breach: boolean;
}

export interface CRMIntegrationsConfig {
  resort_id: string;
  whatsapp_business: {
    enabled: boolean;
    phone_number_id: string;
    api_version: string;
    connected_status: 'Connected' | 'Disconnected' | 'Testing';
    last_ping_at?: string;
  };
  meta_lead_ads: {
    enabled: boolean;
    page_id: string;
    form_id?: string;
    webhook_verify_token: string;
    connected_status: 'Active' | 'Inactive';
    last_lead_received_at?: string;
  };
  google_sheets_sync: {
    enabled: boolean;
    spreadsheet_id: string;
    sheet_name: string;
    auto_sync_on_create: boolean;
    last_synced_at?: string;
  };
  zapier_webhook: {
    enabled: boolean;
    webhook_url: string;
  };
}

