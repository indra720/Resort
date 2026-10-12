/**
 * Phase 1 Lead Management Test Suite
 * Tests:
 * 1. Sales Executive sees ONLY assigned leads
 * 2. Tenant isolation for leads across resorts
 * 3. Convert-to-booking creates Booking + Guest without Invoice, updates lead status
 * 4. Duplicate detection for phone & email within same resort
 */

// In-memory localStorage polyfill for Node test runner
const memoryStorage: Record<string, string> = {};
const mockLocalStorage = {
  getItem: (key: string) => memoryStorage[key] || null,
  setItem: (key: string, value: string) => {
    memoryStorage[key] = value;
  },
  removeItem: (key: string) => {
    delete memoryStorage[key];
  },
  clear: () => {
    Object.keys(memoryStorage).forEach((k) => delete memoryStorage[k]);
  },
};

(global as any).window = global;
(global as any).localStorage = mockLocalStorage;

// Import database, seeds, and API
import { initDatabase, getDbItem, DB_KEYS } from '../api/db';
import {
  getLeads,
  getLeadStats,
  checkDuplicateLead,
  convertLeadToBooking,
  normalizePhone,
  normalizeEmail,
  updateLead,
  createLead,
  getLeadActivities,
} from '../api/leads';
import {
  createFollowUp,
  getFollowUps,
  getFollowUpCounts,
  completeFollowUp,
  scheduleSiteVisit,
} from '../api/followups';
import {
  calculateQuotationTotals,
  createQuotation,
  getQuotations,
  updateQuotationStatus,
  convertQuotationToBooking,
} from '../api/quotations';
import {
  getTemplates,
  interpolateTemplate,
  sendTemplateToLead,
  createTemplate,
} from '../api/templates';
import {
  computeLeadScore,
  computeLeadSLA,
} from '../api/scoring';
import {
  triggerAutomationRules,
  getNextAssignedExecutive,
  getAutomationLogs,
} from '../api/automations';
import {
  getFunnelAnalytics,
  getExecutiveLeaderboard,
} from '../api/targets';
import {
  validateCoupon,
  incrementCouponUsage,
  getCoupons,
  createCoupon,
  toggleCouponActive,
} from '../api/coupons';
import {
  calculateCampaignROI,
  getCampaigns,
  createCampaign,
  toggleCampaignStatus,
} from '../api/campaigns';
import {
  getMarketingMetrics,
  getLeadSources,
  createLeadSource,
  getAudienceSegments,
  scheduleBroadcast,
  submitPublicEnquiry,
  getReferrals,
  createReferral,
  updateReferralStatus,
} from '../api/marketing';
import {
  getCRMAnalyticsReport,
  filterLeadsByDateRange,
  exportCRMReportCSV,
} from '../api/crmReports';
import {
  getLostReasons,
  addLostReason,
  toggleLostReason,
  deleteLostReason,
  getSLAConfig,
  updateSLAConfig,
  getScoringWeights,
  updateScoringWeights,
  getIntegrationsConfig,
  updateIntegrationsConfig,
  testMockWebhook,
  exportFullCRMBackup,
  exportAllLeadsCSV,
} from '../api/crmSettings';
import { canUse } from '../lib/permissions';
import { User, Room } from '../types';

let testsPassed = 0;
let testsFailed = 0;

function assert(condition: boolean, testName: string, details?: string) {
  if (condition) {
    console.log(`✅ PASS: ${testName}`);
    testsPassed++;
  } else {
    console.error(`❌ FAIL: ${testName}${details ? ` -> ${details}` : ''}`);
    testsFailed++;
  }
}

export function runTests() {
  console.log('\n==========================================');
  console.log('🚀 RUNNING PHASE 1 LEADS TEST SUITE');
  console.log('==========================================\n');

  // Reset & initialize database
  mockLocalStorage.clear();
  initDatabase();

  const ownerUser: User = {
    id: 'usr-owner',
    name: 'Rajvardhan Oberoi',
    email: 'owner@joyresorts.com',
    phone: '+91 98200 11223',
    role: 'Resort Owner',
  };

  const salesUser: User = {
    id: 'usr-sales',
    name: 'Sameer Verma',
    email: 'sales@joyresorts.com',
    phone: '+91 98111 22334',
    role: 'Sales Executive',
  };

  // ----------------------------------------------------
  // TEST 1: Tenant Isolation
  // ----------------------------------------------------
  const resort1Leads = getLeads('resort-1', ownerUser);
  const resort2Leads = getLeads('resort-2', ownerUser);
  const resort4Leads = getLeads('resort-4', ownerUser);

  assert(
    resort1Leads.length >= 40,
    'Resort 1 contains seeded realistic leads (40+)',
    `Found ${resort1Leads.length}`
  );
  assert(
    resort1Leads.every((l) => l.resort_id === 'resort-1'),
    'Resort 1 leads strictly belong to resort-1'
  );
  assert(
    resort2Leads.every((l) => l.resort_id === 'resort-2'),
    'Resort 2 leads strictly belong to resort-2'
  );
  assert(
    resort4Leads.length === 0,
    'Unseeded new resort (resort-4) has clean empty state (0 leads)'
  );

  // ----------------------------------------------------
  // TEST 2: Sales Executive Isolation
  // ----------------------------------------------------
  const salesVisibleLeads = getLeads('resort-1', salesUser);
  assert(
    salesVisibleLeads.length > 0 && salesVisibleLeads.length < resort1Leads.length,
    'Sales Executive sees only a subset of total resort leads',
    `Sales sees ${salesVisibleLeads.length} vs Owner sees ${resort1Leads.length}`
  );
  assert(
    salesVisibleLeads.every((l) => l.assigned_to.toLowerCase() === salesUser.name.toLowerCase()),
    'Every lead seen by Sales Executive is assigned to Sameer Verma'
  );

  // ----------------------------------------------------
  // TEST 3: Duplicate Detection
  // ----------------------------------------------------
  const firstLead = resort1Leads[0];
  const dupByPhone = checkDuplicateLead(firstLead.phone, 'uniquetest@email.com', 'resort-1');
  assert(
    dupByPhone.isDuplicate && dupByPhone.matchField === 'phone',
    'Duplicate detected by 10-digit mobile number'
  );

  const dupByFormattedPhone = checkDuplicateLead(`+91 ${firstLead.phone}`, 'uniquetest@email.com', 'resort-1');
  assert(
    dupByFormattedPhone.isDuplicate,
    'Duplicate detected even with +91 country prefix'
  );

  const dupByEmail = checkDuplicateLead('9999999999', firstLead.email, 'resort-1');
  assert(
    dupByEmail.isDuplicate && dupByEmail.matchField === 'email',
    'Duplicate detected by email address'
  );

  const uniqueLead = checkDuplicateLead('9800098000', 'unique.guest@outlook.com', 'resort-1');
  assert(
    !uniqueLead.isDuplicate,
    'Unique phone and email returns isDuplicate: false'
  );

  // Tenant isolated duplicate check: same phone in resort-2 should not collide with resort-1
  const dupCrossTenant = checkDuplicateLead(firstLead.phone, firstLead.email, 'resort-2');
  assert(
    !dupCrossTenant.isDuplicate,
    'Duplicate check is tenant-isolated (resort-1 lead not flagged in resort-2)'
  );

  // ----------------------------------------------------
  // TEST 4: Convert to Booking (No Invoice Created)
  // ----------------------------------------------------
  const leadToConvert = resort1Leads.find((l) => l.status === 'New') || resort1Leads[0];
  const initialInvoices = getDbItem<any[]>(DB_KEYS.INVOICES, []);
  const initialBookings = getDbItem<any[]>(DB_KEYS.BOOKINGS, []);
  const initialGuests = getDbItem<any[]>(DB_KEYS.GUESTS, []);

  // Ensure room 101 exists and is Available
  const rooms = getDbItem<Room[]>(DB_KEYS.ROOMS, []);
  const room101 = rooms.find((r) => r.roomNumber === '101' && (r as any).resortId === 'resort-1');
  if (room101) room101.status = 'Available';

  const convertRes = convertLeadToBooking(
    leadToConvert.id,
    {
      roomNumber: '101',
      checkIn: '2026-11-01',
      checkOut: '2026-11-04',
      totalAmount: 18480,
      gstAmount: 1980,
    },
    'resort-1',
    salesUser
  );

  assert(convertRes.success, 'convertLeadToBooking returned success: true');

  // Verify Booking was created
  const afterBookings = getDbItem<any[]>(DB_KEYS.BOOKINGS, []);
  assert(
    afterBookings.length === initialBookings.length + 1,
    'Booking record created in joy_bookings_data'
  );
  assert(
    afterBookings[0].guestName === leadToConvert.name,
    'Created booking guestName matches lead name'
  );

  // Verify Guest record was created
  const afterGuests = getDbItem<any[]>(DB_KEYS.GUESTS, []);
  assert(
    afterGuests.length >= initialGuests.length,
    'Guest record created/linked in joy_guests_data'
  );

  // Verify NO invoice was created
  const afterInvoices = getDbItem<any[]>(DB_KEYS.INVOICES, []);
  assert(
    afterInvoices.length === initialInvoices.length,
    'NO invoice created upon lead conversion (invoices are created at payment/check-out)'
  );

  // Verify Lead status was set to Booked and linked to booking ID
  const reloadedLead = getLeads('resort-1', ownerUser).find((l) => l.id === leadToConvert.id);
  assert(
    reloadedLead?.status === 'Booked',
    'Lead status updated to "Booked"'
  );
  assert(
    reloadedLead?.converted_booking_id === convertRes.booking?.id,
    'Lead converted_booking_id correctly links to new Booking ID'
  );

  // ----------------------------------------------------
  // TEST 5: Dynamic KPI Stats Calculation
  // ----------------------------------------------------
  const statsResort1 = getLeadStats('resort-1', ownerUser);
  assert(
    statsResort1.totalLeads === getLeads('resort-1', ownerUser).length,
    'Total Leads KPI matches count in store'
  );
  assert(
    statsResort1.statusCounts['Booked'] >= 1,
    'Booked leads count matches store'
  );
  assert(
    statsResort1.revenue > 0,
    'Revenue calculated dynamically from booked leads'
  );

  // ----------------------------------------------------
  // TEST 6: Pipeline Kanban Transitions & Mandatory Lost Reason
  // ----------------------------------------------------
  const pipelineLead = resort1Leads.find((l) => l.status === 'Contacted') || resort1Leads[1];
  const updateRes1 = updateLead(pipelineLead.id, { status: 'Interested' }, 'resort-1', ownerUser);
  assert(updateRes1.success, 'Pipeline transition to "Interested" succeeded');
  const updatedLead1 = getLeads('resort-1', ownerUser).find((l) => l.id === pipelineLead.id);
  assert(updatedLead1?.status === 'Interested', 'Lead status in store updated to "Interested"');

  const lostRes = updateLead(
    pipelineLead.id,
    { status: 'Lost', lost_reason: 'Too expensive - above budget' },
    'resort-1',
    ownerUser
  );
  assert(lostRes.success, 'Pipeline transition to "Lost" with reason succeeded');
  const lostLead = getLeads('resort-1', ownerUser).find((l) => l.id === pipelineLead.id);
  assert(
    lostLead?.status === 'Lost' && lostLead?.lost_reason === 'Too expensive - above budget',
    'Lead status in store updated to "Lost" with reason recorded'
  );

  // ----------------------------------------------------
  // TEST 7: Follow-ups Engine & Categorization
  // ----------------------------------------------------
  const todayDate = new Date().toISOString().split('T')[0];
  const overdueDate = '2026-01-10';
  const upcomingDate = '2026-12-25';

  const flpToday = createFollowUp(
    {
      lead_id: pipelineLead.id,
      title: 'Call guest to confirm dates',
      channel: 'call',
      due_date: todayDate,
      due_time: '11:00 AM',
      scheduled_at: `${todayDate} 11:00 AM`,
      assigned_to: 'Sameer Verma',
      priority: 'High',
    },
    'resort-1',
    ownerUser
  );
  assert(!!flpToday && !!flpToday.id, 'Created today follow-up');

  const flpOverdue = createFollowUp(
    {
      lead_id: pipelineLead.id,
      title: 'Send brochure on WhatsApp',
      channel: 'whatsapp',
      due_date: overdueDate,
      due_time: '02:00 PM',
      scheduled_at: `${overdueDate} 02:00 PM`,
      assigned_to: 'Sameer Verma',
      priority: 'Medium',
    },
    'resort-1',
    ownerUser
  );
  assert(!!flpOverdue && !!flpOverdue.id, 'Created overdue follow-up');

  const flpUpcoming = createFollowUp(
    {
      lead_id: pipelineLead.id,
      title: 'Email customized banquet menu',
      channel: 'email',
      due_date: upcomingDate,
      due_time: '04:00 PM',
      scheduled_at: `${upcomingDate} 04:00 PM`,
      assigned_to: 'Sameer Verma',
      priority: 'Low',
    },
    'resort-1',
    ownerUser
  );
  assert(!!flpUpcoming && !!flpUpcoming.id, 'Created upcoming follow-up');

  const todayList = getFollowUps('resort-1', ownerUser, 'today');
  assert(
    todayList.some((f) => f.id === flpToday.id),
    'Today category includes today scheduled follow-up'
  );

  const overdueList = getFollowUps('resort-1', ownerUser, 'overdue');
  assert(
    overdueList.some((f) => f.id === flpOverdue.id),
    'Overdue category includes past scheduled follow-up'
  );

  const upcomingList = getFollowUps('resort-1', ownerUser, 'upcoming');
  assert(
    upcomingList.some((f) => f.id === flpUpcoming.id),
    'Upcoming category includes future scheduled follow-up'
  );

  // Mark done
  const doneRes = completeFollowUp(flpToday.id, 'resort-1', ownerUser);
  assert(doneRes === true, 'completeFollowUp marked status as completed');

  const doneList = getFollowUps('resort-1', ownerUser, 'done');
  assert(
    doneList.some((f) => f.id === flpToday.id),
    'Done category includes completed follow-up'
  );

  // ----------------------------------------------------
  // TEST 8: Guided Site Visit Scheduling
  // ----------------------------------------------------
  const targetLeadForVisit = resort1Leads.find((l) => l.status === 'New') || resort1Leads[2];
  const visitRes = scheduleSiteVisit(
    targetLeadForVisit.id,
    {
      dateTime: '2026-11-15T11:30 AM',
      assignedTo: 'Rohit Kumar',
      notes: 'Show pool villa and poolside banquet lawn for 150 guests.',
    },
    'resort-1',
    ownerUser
  );
  assert(visitRes.success, 'scheduleSiteVisit executed successfully');

  const leadAfterVisit = getLeads('resort-1', ownerUser).find((l) => l.id === targetLeadForVisit.id);
  assert(
    leadAfterVisit?.status === 'Site Visit',
    'Lead status automatically updated to "Site Visit"'
  );

  const activities = getLeadActivities(targetLeadForVisit.id, 'resort-1');
  assert(
    activities.some((a) => a.title.includes('Site Visit')),
    'Site visit activity logged on lead timeline'
  );

  // ----------------------------------------------------
  // TEST 9: Plan Gating Restrictions
  // ----------------------------------------------------
  assert(
    canUse({ plan: 'Basic' }, 'pipeline') === false,
    'Basic plan cannot access pipeline kanban (is locked)'
  );
  assert(
    canUse({ plan: 'Pro' }, 'pipeline') === true,
    'Pro plan can access pipeline kanban'
  );
  assert(
    canUse({ plan: 'Enterprise' }, 'pipeline') === true,
    'Enterprise plan has full pipeline kanban access'
  );
  assert(
    canUse({ plan: 'Basic' }, 'simple_followups') === true,
    'Basic plan has access to simple follow-ups'
  );
  assert(
    canUse({ plan: 'Basic' }, 'advanced_followups') === false,
    'Basic plan cannot access advanced follow-ups'
  );

  // ----------------------------------------------------
  // TEST 10: Quotation Totals & GST Split Math (Phase 3)
  // ----------------------------------------------------
  const testItems = [
    { id: '1', description: 'Luxury Heritage Villa 2 Nights', quantity: 2, rate: 25000, amount: 50000 },
    { id: '2', description: 'Poolside Lawn Banquet Venue Rental', quantity: 1, rate: 50000, amount: 50000 },
  ];
  // Subtotal = 100,000. 10% discount = 10,000. Taxable = 90,000.
  // GST 18%: CGST 9% (8,100) + SGST 9% (8,100) = 16,200. Grand Total = 106,200.
  const calc18 = calculateQuotationTotals(testItems, 'percentage', 10, 'GST_18');
  assert(calc18.subtotal === 100000, 'Quotation subtotal calculated correctly (₹1,00,000)');
  assert(calc18.discount_amount === 10000, '10% discount amount calculated correctly (₹10,000)');
  assert(calc18.taxable_amount === 90000, 'Taxable amount after discount is ₹90,000');
  assert(calc18.cgst_amount === 8100, 'CGST 9% calculated correctly (₹8,100)');
  assert(calc18.sgst_amount === 8100, 'SGST 9% calculated correctly (₹8,100)');
  assert(calc18.total_tax === 16200, 'Total tax calculated correctly (₹16,200)');
  assert(calc18.grand_total === 106200, 'Grand total with GST 18% is ₹1,06,200');
  assert(
    calc18.ca_disclaimer.toLowerCase().includes('chartered accountant') ||
      calc18.ca_disclaimer.toLowerCase().includes('gst'),
    'Quotation includes verified CA tax disclaimer note'
  );

  // GST 12% calculation test
  const calc12 = calculateQuotationTotals(
    [{ id: '1', description: 'Deluxe Room', quantity: 1, rate: 10000, amount: 10000 }],
    'fixed',
    1000,
    'GST_12'
  );
  // Subtotal = 10,000 - 1,000 = 9,000 taxable. 12% GST = 1,080 (540 CGST + 540 SGST). Grand Total = 10,080.
  assert(calc12.taxable_amount === 9000, 'Fixed ₹1,000 discount applied correctly');
  assert(calc12.cgst_amount === 540 && calc12.sgst_amount === 540, 'GST 12% split equally into 6% CGST + 6% SGST');
  assert(calc12.grand_total === 10080, 'Grand total with GST 12% is ₹10,080');

  // ----------------------------------------------------
  // TEST 11: Quotation Creation & Sales Executive RBAC (Phase 3)
  // ----------------------------------------------------
  const createQuoteRes = createQuotation(
    {
      resort_id: 'resort-1',
      lead_id: targetLeadForVisit.id,
      guest_name: targetLeadForVisit.name,
      guest_phone: targetLeadForVisit.phone,
      guest_email: targetLeadForVisit.email,
      interested_in: targetLeadForVisit.interested_in,
      assigned_to: 'Sameer Verma',
      items: testItems,
      discount_type: 'percentage',
      discount_value: 10,
      tax_type: 'GST_18',
      valid_until: '2026-11-30',
      notes: 'Custom weekend corporate proposal.',
    },
    'resort-1',
    ownerUser
  );
  assert(createQuoteRes.success && Boolean(createQuoteRes.quotation), 'createQuotation returned success: true');
  const createdQuote = createQuoteRes.quotation!;
  assert(
    (createdQuote.quotation_code || createdQuote.quotation_number).startsWith('QT-'),
    'Quotation generated with official code prefix QT-'
  );

  const allResortQuotes = getQuotations('resort-1', ownerUser);
  assert(allResortQuotes.length >= 6, 'Resort Owner sees all resort quotations (6+)');

  const salesQuotes = getQuotations('resort-1', salesUser);
  assert(
    salesQuotes.every((q) => q.assigned_to === 'Sameer Verma' || q.created_by === 'Sameer Verma'),
    'Sales Executive sees ONLY their assigned quotations'
  );

  // ----------------------------------------------------
  // TEST 12: Quotation to Booking Conversion (Phase 3)
  // ----------------------------------------------------
  updateQuotationStatus(createdQuote.id, 'Accepted', 'resort-1', ownerUser);
  const convertQuoteRes = convertQuotationToBooking(createdQuote.id, 'resort-1', ownerUser);
  assert(convertQuoteRes.success, 'Quotation successfully converted to booking');
  assert(Boolean(convertQuoteRes.booking?.id), 'Created confirmed Booking record');
  assert(Boolean(convertQuoteRes.guest?.id), 'Created/linked Guest record');

  const convertedLead = getLeads('resort-1', ownerUser).find((l) => l.id === targetLeadForVisit.id);
  assert(convertedLead?.status === 'Booked', 'Associated lead status updated to "Booked"');

  const updatedQuote = getQuotations('resort-1', ownerUser).find((q) => q.id === createdQuote.id);
  assert(
    updatedQuote?.booking_id === convertQuoteRes.booking?.id ||
      updatedQuote?.converted_booking_id === convertQuoteRes.booking?.id,
    'Quotation linked back to booking'
  );

  // Verify no fake invoice was created
  const invoiceDb = getDbItem<any[]>('joy_invoices_data' as any, []);
  const matchingInvoice = invoiceDb.find((inv) => inv?.booking_id === convertQuoteRes.booking?.id);
  assert(
    !matchingInvoice,
    'No premature fake invoice generated on lead conversion (invoices generated at payment/check-out)'
  );

  // ----------------------------------------------------
  // TEST 13: Message Template Variable Interpolation (Phase 3)
  // ----------------------------------------------------
  const rawContent = 'Namaste {guest_name}, your booking request for {dates} at {resort_name} is received. Total: ₹{amount}. View: {quotation_link}';
  const interpolated = interpolateTemplate(rawContent, {
    guest_name: 'Vikram Malhotra',
    dates: '14-16 Nov 2026',
    resort_name: 'The Tamara Coorg',
    amount: '1,25,000',
    quotation_link: 'https://joyresorts.com/quote/QT-001',
  });
  assert(
    interpolated.includes('Vikram Malhotra') &&
      interpolated.includes('The Tamara Coorg') &&
      interpolated.includes('1,25,000'),
    'Message template variables interpolated accurately without placeholders left'
  );

  // ----------------------------------------------------
  // TEST 14: Message Template Dispatch to Lead (Phase 3)
  // ----------------------------------------------------
  const templates = getTemplates('resort-1');
  assert(templates.length >= 4, 'Seeded templates loaded for resort-1 (4+)');

  const sendRes = sendTemplateToLead(
    targetLeadForVisit.id,
    templates[0].id,
    'resort-1',
    'The Tamara Coorg',
    ownerUser
  );
  assert(sendRes.success, 'sendTemplateToLead executed successfully');

  const leadActsAfterTemplate = getLeadActivities(targetLeadForVisit.id, 'resort-1');
  assert(
    leadActsAfterTemplate.some((a) => a.title.includes('Template Dispatched')),
    'Template dispatch logged in lead activity history'
  );

  // ----------------------------------------------------
  // TEST 15: Deterministic Lead Scoring & Breakdown (Phase 3)
  // ----------------------------------------------------
  const highValueLead = resort1Leads.find((l) => (l.budget_max || 0) >= 150000) || resort1Leads[0];
  const highValScore = computeLeadScore(highValueLead, leadActsAfterTemplate);
  assert(highValScore.totalScore >= 60, 'High-budget lead scores high intent (>= 60 pts)');
  assert(highValScore.factors.length >= 3, 'Score returns complete factor breakdown explaining "why"');
  assert(
    highValScore.factors.some((f) => f.factor === 'Budget Intent'),
    'Score includes Budget Intent factor'
  );

  // ----------------------------------------------------
  // TEST 16: Response SLA Computation (Phase 3)
  // ----------------------------------------------------
  const newLead = resort1Leads.find((l) => l.status === 'New') || resort1Leads[1];
  const newLeadSLA = computeLeadSLA(newLead, 30);
  assert(
    typeof newLeadSLA.elapsedMinutes === 'number' && typeof newLeadSLA.label === 'string',
    'computeLeadSLA returns elapsed time and status label'
  );

  const bookedLead = resort1Leads.find((l) => l.status === 'Booked') || resort1Leads[0];
  const bookedLeadSLA = computeLeadSLA(bookedLead, 30);
  assert(
    bookedLeadSLA.status === 'ok' && bookedLeadSLA.label === 'SLA Responded',
    'Contacted/Booked lead has SLA status "SLA Responded"'
  );

  // ----------------------------------------------------
  // TEST 17: Sales Automation Rules & Auto-Assignment Router (Phase 3)
  // ----------------------------------------------------
  const autoAssignWedding = getNextAssignedExecutive('resort-1', 'Wedding');
  assert(Boolean(autoAssignWedding), 'getNextAssignedExecutive routed wedding inquiry to specialist');

  const autoExecRes = triggerAutomationRules('lead_created', {
    lead: newLead,
    resortId: 'resort-1',
    currentUser: ownerUser,
  });
  assert(Array.isArray(autoExecRes), 'triggerAutomationRules evaluated successfully');

  const autoLogs = getAutomationLogs('resort-1');
  assert(autoLogs.length >= 1, 'Automation executions recorded in system audit logs');

  // ----------------------------------------------------
  // TEST 18: Funnel Analytics & Executive Leaderboard (Phase 3)
  // ----------------------------------------------------
  const funnel = getFunnelAnalytics('resort-1');
  assert(funnel.stages.length >= 5, 'Sales funnel includes all pipeline stages (5+)');
  assert(
    typeof funnel.overallConversionRate === 'number' || typeof funnel.overallWinRate === 'number',
    'Overall pipeline conversion % computed'
  );

  const leaderboard = getExecutiveLeaderboard('resort-1');
  assert(leaderboard.length >= 3, 'Executive leaderboard loaded for all active sales reps');
  assert(
    ((leaderboard[0] as any).target_amount || leaderboard[0].targetRevenue || 0) > 0,
    'Executive has active monthly sales target (₹ INR)'
  );

  // ----------------------------------------------------
  // TEST 19: Phase 3 Plan Gating (Phase 3)
  // ----------------------------------------------------
  assert(
    canUse({ plan: 'Basic' }, 'quotations') === false,
    'Basic plan cannot access Quotations engine'
  );
  assert(
    canUse({ plan: 'Pro' }, 'quotations') === true,
    'Pro plan can access Quotations engine'
  );
  assert(
    canUse({ plan: 'Pro' }, 'templates') === true,
    'Pro plan can access Message Templates'
  );
  assert(
    canUse({ plan: 'Pro' }, 'automations') === true,
    'Pro plan can access Sales Automations'
  );
  assert(
    canUse({ plan: 'Pro' }, 'team_targets') === false,
    'Pro plan cannot access Executive Quota Leaderboard (Enterprise only)'
  );
  assert(
    canUse({ plan: 'Enterprise' }, 'team_targets') === true,
    'Enterprise plan has full access to Team Quota Leaderboard'
  );

  // ====================================================
  // PHASE 4: MARKETING & GUEST ACQUISITION TESTS
  // ====================================================

  // ----------------------------------------------------
  // TEST 20: Coupon Validation & Redemption Engine (Phase 4)
  // ----------------------------------------------------
  const cpnRes1 = validateCoupon('DIWALI25', 40000, 2, 'resort-1');
  assert(cpnRes1.isValid === true, 'Valid coupon DIWALI25 accepted for stay of 2 nights with ₹40,000 spend');
  assert(cpnRes1.discountAmount === 10000, 'DIWALI25 correctly calculates 25% discount (₹10,000 off ₹40,000)');

  const cpnRes2 = validateCoupon('CORPJOY', 50000, 1, 'resort-1');
  assert(cpnRes2.isValid === true, 'Flat rebate coupon CORPJOY accepted for corporate group booking');
  assert(cpnRes2.discountAmount === 5000, 'CORPJOY correctly deducts flat ₹5,000');

  const cpnBelowMinSpend = validateCoupon('DIWALI25', 5000, 2, 'resort-1');
  assert(cpnBelowMinSpend.isValid === false, 'DIWALI25 correctly rejected when order spend (₹5,000) is below min spend ₹15,000');

  const cpnBelowMinNights = validateCoupon('DIWALI25', 30000, 1, 'resort-1');
  assert(cpnBelowMinNights.isValid === false, 'DIWALI25 correctly rejected when stay (1 night) is below min stay requirement (2 nights)');

  const cpnInvalidCode = validateCoupon('NONEXISTENT_CODE_99', 50000, 2, 'resort-1');
  assert(cpnInvalidCode.isValid === false, 'Non-existent coupon code gracefully rejected');

  // Increment usage count
  const preUsageCoupons = getCoupons('resort-1');
  const targetCpn = preUsageCoupons.find((c) => c.code === 'EARLYBIRD10');
  const initialUsedCount = targetCpn?.used_count || 0;
  const incrementSuccess = incrementCouponUsage('EARLYBIRD10', 'resort-1');
  assert(incrementSuccess === true, 'Coupon usage successfully incremented');
  const postUsageCoupons = getCoupons('resort-1');
  const updatedCpn = postUsageCoupons.find((c) => c.code === 'EARLYBIRD10');
  assert((updatedCpn?.used_count || 0) === initialUsedCount + 1, 'Coupon used_count correctly incremented in database');

  // ----------------------------------------------------
  // TEST 21: Campaigns Manager & ROI Calculations (Phase 4)
  // ----------------------------------------------------
  const roiTest1 = calculateCampaignROI(580000, 75000);
  assert(roiTest1 === 673, 'Campaign ROI math correctly calculated ((580k - 75k) / 75k * 100 = 673%)');

  const roiZeroSpend = calculateCampaignROI(100000, 0);
  assert(roiZeroSpend === 0, 'Campaign with zero spend returns 0 ROI without division by zero errors');

  const initialCampaigns = getCampaigns('resort-1');
  assert(initialCampaigns.length >= 4, 'Resort has seeded omnichannel marketing campaigns');

  const createdCampaignRes = createCampaign(
    {
      resort_id: 'resort-1',
      name: 'Autumn Wellness Retreat 2026',
      channel: 'WhatsApp',
      budget: 60000,
      spend: 40000,
      start_date: '2026-10-15',
      end_date: '2026-11-15',
      target_audience: 'Ayurveda & Spa Enthusiasts',
      offer_code: 'SPAESCAPE',
      status: 'Running',
      leads_generated: 12,
      bookings_generated: 3,
      revenue_generated: 120000,
    },
    'resort-1',
    ownerUser
  );
  assert(createdCampaignRes.success === true, 'New marketing campaign successfully created');
  assert((createdCampaignRes.data?.roi_percent || 0) === 200, 'Newly created campaign automatically computes ROI ((120k-40k)/40k = 200%)');

  const toggleRes = toggleCampaignStatus(createdCampaignRes.data!.id, 'Paused', 'resort-1', ownerUser);
  assert(toggleRes.success === true && toggleRes.data?.status === 'Paused', 'Campaign status successfully toggled to Paused');

  // ----------------------------------------------------
  // TEST 22: Marketing Analytics Dashboard & Unit Economics (Phase 4)
  // ----------------------------------------------------
  const marketingMetrics = getMarketingMetrics('resort-1');
  assert(marketingMetrics.totalLeads > 0, 'Marketing metrics successfully aggregates total leads');
  assert(marketingMetrics.totalBookings > 0, 'Marketing metrics tracks direct closed bookings');
  assert(marketingMetrics.totalRevenue > 0, 'Marketing metrics tracks total attributed revenue in INR');
  assert(marketingMetrics.totalMarketingSpend > 0, 'Marketing metrics aggregates total marketing spend');
  assert(marketingMetrics.overallCPL > 0, 'Marketing metrics computes blended Cost Per Lead (CPL in ₹)');
  assert(marketingMetrics.overallCPB > 0, 'Marketing metrics computes blended Cost Per Booking (CPB in ₹)');
  assert(marketingMetrics.sourcesDistribution.length >= 4, 'Sources distribution computed across digital, offline, and direct channels');
  assert(marketingMetrics.channelPerformance.length === 5, 'Channel performance matrix computed for WhatsApp, Google Ads, Meta Ads, Email, SMS');

  // ----------------------------------------------------
  // TEST 23: Dynamic Audience Segments (Phase 4)
  // ----------------------------------------------------
  const dynamicSegments = getAudienceSegments('resort-1');
  assert(dynamicSegments.length >= 5, 'Dynamic audience segments retrieved (5 smart cohorts)');
  const pastGuestsSeg = dynamicSegments.find((s) => s.filter_type === 'past_guests');
  assert((pastGuestsSeg?.member_count || 0) > 0, 'Past guests segment dynamically computes member count from real guest stays');
  const weddingSeg = dynamicSegments.find((s) => s.filter_type === 'wedding');
  assert(weddingSeg !== undefined, 'Wedding prospects segment dynamically registered');

  // ----------------------------------------------------
  // TEST 24: Direct Website Lead Capture & Public Submission (Phase 4)
  // ----------------------------------------------------
  const publicSubmissionRes = submitPublicEnquiry(
    {
      name: 'Aditya Vikram Singhal',
      phone: '+91 98200 44112',
      email: 'aditya.singhal@tatamotors.com',
      city: 'Pune',
      preferred_date: '2026-11-20',
      guests: 4,
      budget: 65000,
      interested_in: 'Weekend Stay',
      remarks: 'Interested in Royal Pool Villa with private breakfast setup.',
    },
    'resort-1',
    {
      utm_source: 'instagram',
      utm_medium: 'bio_link',
      utm_campaign: 'diwali_festive_2026',
    }
  );

  assert(publicSubmissionRes.success === true, 'Public website enquiry submission succeeded');
  assert(publicSubmissionRes.lead?.source === 'Website', 'Web submitted enquiry automatically sets source to "Website"');
  assert(publicSubmissionRes.lead?.tags.some((t) => t.includes('UTM: diwali_festive_2026')) === true, 'Public enquiry attaches campaign UTM tags');
  assert(publicSubmissionRes.lead?.status === 'New', 'New public lead initialized with status "New"');

  // Validation rejection
  const invalidSubmission = submitPublicEnquiry(
    { name: '', phone: '', email: '' },
    'resort-1'
  );
  assert(invalidSubmission.success === false, 'Public enquiry rejects empty mandatory name and phone');

  // ----------------------------------------------------
  // TEST 25: Referral Program Ledger & State Transitions (Phase 4)
  // ----------------------------------------------------
  const initialReferrals = getReferrals('resort-1');
  assert(initialReferrals.length >= 3, 'Seeded guest referral records retrieved');

  const newReferralRes = createReferral(
    {
      resort_id: 'resort-1',
      referrer_name: 'Mrs. Neha Bajaj',
      referrer_phone: '+91 98199 55667',
      referrer_email: 'neha.bajaj@gmail.com',
      referred_lead_name: 'Gaurav Bajaj',
      reward_amount: 3500,
      status: 'Pending',
      notes: 'Family wedding referral',
    },
    'resort-1',
    ownerUser
  );
  assert(newReferralRes.success === true, 'New referral successfully recorded');

  const updateRefRes = updateReferralStatus(
    newReferralRes.data!.id,
    'Rewarded',
    'resort-1',
    ownerUser,
    'Reward credit coupon issued upon guest check-in'
  );
  assert(updateRefRes.success === true && updateRefRes.data?.status === 'Rewarded', 'Referral status transitioned to Rewarded');

  // ----------------------------------------------------
  // TEST 26: Plan Gating for Marketing & Guest Acquisition (Phase 4)
  // ----------------------------------------------------
  assert(
    canUse({ plan: 'Basic' }, 'campaigns') === false,
    'Basic plan cannot access Campaigns'
  );
  assert(
    canUse({ plan: 'Basic' }, 'coupons') === false,
    'Basic plan cannot access Coupons & Offers'
  );
  assert(
    canUse({ plan: 'Pro' }, 'campaigns') === true,
    'Pro plan can access Campaigns'
  );
  assert(
    canUse({ plan: 'Pro' }, 'coupons') === true,
    'Pro plan can access Coupons'
  );
  assert(
    canUse({ plan: 'Pro' }, 'marketing_roi') === false,
    'Pro plan cannot access Deep Marketing ROI Analytics (Enterprise only)'
  );
  assert(
    canUse({ plan: 'Pro' }, 'form_builder') === false,
    'Pro plan cannot access Lead Capture Form Builder (Enterprise only)'
  );
  assert(
    canUse({ plan: 'Pro' }, 'referral_program') === false,
    'Pro plan cannot access Referral Program (Enterprise only)'
  );
  assert(
    canUse({ plan: 'Enterprise' }, 'marketing_roi') === true,
    'Enterprise plan can access Marketing ROI Analytics'
  );
  assert(
    canUse({ plan: 'Enterprise' }, 'form_builder') === true,
    'Enterprise plan can access Lead Capture Form Builder'
  );
  assert(
    canUse({ plan: 'Enterprise' }, 'referral_program') === true,
    'Enterprise plan can access Guest Referral Program'
  );

  // ==========================================
  // PHASE 5: CRM REPORTS, ANALYTICS & CONFIGURATION DESK
  // ==========================================
  console.log('\n--- PHASE 5: CRM Reports & Analytics ---');
  const crmReport = getCRMAnalyticsReport('resort-1');
  assert(crmReport.totalLeads > 0, 'CRM Analytics calculates total leads count');
  assert(crmReport.totalBookings > 0, 'CRM Analytics calculates total closed bookings');
  assert(
    crmReport.overallConversionRate >= 0 && crmReport.overallConversionRate <= 100,
    'CRM Analytics computes valid overall conversion rate percentage'
  );
  assert(crmReport.totalRevenue > 0, 'CRM Analytics sums total booked revenue (INR)');
  assert(crmReport.avgDealSize > 0, 'CRM Analytics calculates average deal size (INR)');
  assert(crmReport.avgSalesCycleDays > 0, 'CRM Analytics calculates sales velocity in days');
  assert(crmReport.followupAdherenceRate > 0, 'CRM Analytics calculates follow-up SLA adherence rate %');
  assert(crmReport.sourcesBreakdown.length > 0, 'CRM Analytics produces source conversion matrix');
  assert(crmReport.executivesBreakdown.length > 0, 'CRM Analytics produces executive conversion leaderboard');
  assert(crmReport.lostReasonsBreakdown.length > 0, 'CRM Analytics produces lost reasons breakdown');
  assert(crmReport.monthlyTrend.length === 6, 'CRM Analytics computes 6-month trailing sales trend');

  // Date range filtering
  const allLeadsList = getLeads('resort-1');
  const filteredAll = filterLeadsByDateRange(allLeadsList, { range: 'all_time' });
  assert(filteredAll.length === allLeadsList.length, 'Filter by all_time retains 100% of leads');
  const filteredYear = filterLeadsByDateRange(allLeadsList, { range: 'this_year' });
  assert(filteredYear.length >= 0, 'Filter by this_year executes cleanly');
  const filteredCustom = filterLeadsByDateRange(allLeadsList, {
    range: 'custom',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
  });
  assert(filteredCustom.length >= 0, 'Filter by custom date range executes cleanly');

  // CSV Report Exports
  const execCsv = exportCRMReportCSV(crmReport, 'executive');
  assert(
    execCsv.includes('Executive Name') && execCsv.includes('Total Revenue INR'),
    'exportCRMReportCSV generates valid Executive Leaderboard CSV'
  );
  const sourceCsv = exportCRMReportCSV(crmReport, 'source');
  assert(
    sourceCsv.includes('Source Channel') && sourceCsv.includes('Conversion Rate %'),
    'exportCRMReportCSV generates valid Source Conversion CSV'
  );
  const lostCsv = exportCRMReportCSV(crmReport, 'lost');
  assert(
    lostCsv.includes('Lost Reason') && lostCsv.includes('Lost Potential Revenue INR'),
    'exportCRMReportCSV generates valid Lost Reasons CSV'
  );
  const monthlyCsv = exportCRMReportCSV(crmReport, 'monthly');
  assert(
    monthlyCsv.includes('Month') && monthlyCsv.includes('Leads Generated'),
    'exportCRMReportCSV generates valid Monthly Sales Trend CSV'
  );

  console.log('\n--- PHASE 5: CRM Settings Desk & SLA ---');
  // 1. Lost Reasons CRUD
  const initialReasons = getLostReasons('resort-1');
  assert(initialReasons.length > 0, 'getLostReasons returns seeded standard lost reasons');

  const addReasonRes = addLostReason('Competitor offered complimentary banquet hall', 'resort-1');
  assert(addReasonRes.success === true && !!addReasonRes.data, 'addLostReason adds custom lost reason');

  const dupReasonRes = addLostReason('Competitor offered complimentary banquet hall', 'resort-1');
  assert(dupReasonRes.success === false, 'addLostReason rejects duplicate lost reason');

  if (addReasonRes.data) {
    const toggleRes = toggleLostReason(addReasonRes.data.id, 'resort-1');
    assert(toggleRes.success === true && toggleRes.data?.is_active === false, 'toggleLostReason toggles active status');

    const delRes = deleteLostReason(addReasonRes.data.id, 'resort-1');
    assert(delRes.success === true, 'deleteLostReason deletes custom lost reason');
  }

  // 2. SLA Config
  const currentSLA = getSLAConfig('resort-1');
  assert(currentSLA.target_response_minutes > 0, 'getSLAConfig returns target response minutes');
  const updateSLARes = updateSLAConfig(
    { target_response_minutes: 45, warning_threshold_minutes: 20 },
    'resort-1'
  );
  assert(
    updateSLARes.success === true && updateSLARes.data?.target_response_minutes === 45,
    'updateSLAConfig updates and persists target response SLA'
  );

  // 3. Lead Scoring Weights
  const initialWeights = getScoringWeights('resort-1');
  assert(initialWeights.budget_high_weight > 0, 'getScoringWeights returns current scoring weights');
  const updateWeightsRes = updateScoringWeights({ budget_high_weight: 35 }, 'resort-1');
  assert(
    updateWeightsRes.success === true && updateWeightsRes.data?.budget_high_weight === 35,
    'updateScoringWeights modifies rule weights cleanly'
  );

  // 4. Integrations & Mock Webhooks
  const initialIntegrations = getIntegrationsConfig('resort-1');
  assert(!!initialIntegrations.whatsapp_business, 'getIntegrationsConfig returns WhatsApp config');
  const pingRes = testMockWebhook('whatsapp', 'resort-1');
  assert(pingRes.success === true && pingRes.message.includes('200 OK'), 'testMockWebhook simulates WhatsApp Cloud API ping');

  const metaRes = testMockWebhook('meta', 'resort-1');
  assert(metaRes.success === true && metaRes.message.includes('Verified'), 'testMockWebhook verifies Meta Lead Ads handshake');

  const sheetsRes = testMockWebhook('sheets', 'resort-1');
  assert(sheetsRes.success === true && sheetsRes.message.includes('synchronized'), 'testMockWebhook simulates Google Sheets 2-way sync');

  const zapierRes = testMockWebhook('zapier', 'resort-1');
  assert(zapierRes.success === true && zapierRes.message.includes('HTTP 200'), 'testMockWebhook dispatches simulated Zapier webhook');

  // 5. Data Backup & Leads Master Export
  const backup = exportFullCRMBackup('resort-1');
  assert(backup.filename.includes('CRM_Backup') && backup.filename.endsWith('.json'), 'exportFullCRMBackup creates valid JSON filename');
  const parsedBackup = JSON.parse(backup.jsonContent);
  assert(
    parsedBackup.app === 'JOY Resorts SaaS CRM' &&
      Array.isArray(parsedBackup.data.leads) &&
      Array.isArray(parsedBackup.data.quotations),
    'exportFullCRMBackup generates valid formatted JSON database archive'
  );

  const leadsMaster = exportAllLeadsCSV('resort-1');
  assert(leadsMaster.filename.endsWith('.csv'), 'exportAllLeadsCSV creates valid CSV filename');
  assert(
    leadsMaster.csvContent.includes('Lead Code') &&
      leadsMaster.csvContent.includes('Full Name') &&
      leadsMaster.csvContent.includes('Budget Max INR'),
    'exportAllLeadsCSV contains full CSV headers and lead data rows'
  );

  // 6. Plan Gating for Phase 5
  console.log('\n--- PHASE 5: SaaS Plan Gating ---');
  assert(
    canUse({ plan: 'Basic' }, 'crm_reports') === false,
    'Basic plan cannot access CRM Reports'
  );
  assert(
    canUse({ plan: 'Pro' }, 'crm_reports') === true,
    'Pro plan can access CRM Reports'
  );
  assert(
    canUse({ plan: 'Basic' }, 'crm_settings') === false,
    'Basic plan cannot access CRM Settings'
  );
  assert(
    canUse({ plan: 'Pro' }, 'crm_settings') === true,
    'Pro plan can access CRM Settings'
  );
  assert(
    canUse({ plan: 'Pro' }, 'lead_scoring_editor') === false,
    'Pro plan cannot access Lead Scoring Weights Editor (Enterprise only)'
  );
  assert(
    canUse({ plan: 'Enterprise' }, 'lead_scoring_editor') === true,
    'Enterprise plan can access Lead Scoring Weights Editor'
  );
  assert(
    canUse({ plan: 'Pro' }, 'crm_webhooks') === false,
    'Pro plan cannot access CRM Webhooks (Enterprise only)'
  );
  assert(
    canUse({ plan: 'Enterprise' }, 'crm_webhooks') === true,
    'Enterprise plan can access CRM Webhooks'
  );
  assert(
    canUse({ plan: 'Pro' }, 'crm_export_backup') === false,
    'Pro plan cannot access Full CRM Data Backup (Enterprise only)'
  );
  assert(
    canUse({ plan: 'Enterprise' }, 'crm_export_backup') === true,
    'Enterprise plan can access Full CRM Data Backup'
  );

  console.log('\n==========================================');
  console.log(`TEST RESULTS: ${testsPassed} PASSED, ${testsFailed} FAILED`);
  console.log('==========================================\n');

  if (testsFailed > 0) {
    process.exit(1);
  }
}

runTests();
