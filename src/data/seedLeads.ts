import { Lead, LeadActivity, LeadNote, LeadFollowUp, GuestRecord } from '@/types/crm';

/**
 * Seed realistic Indian leads across the 3 demo resorts.
 * - resort-1 (Lakeview Sanctuary, Udaipur): ~50 leads (including the 10 screenshot leads + 15 for Sameer Verma)
 * - resort-2 (Pine Heritage Estate, Shimla): ~45 leads
 * - resort-3 (Emerald Backwaters, Kumarakom): ~45 leads
 * New resorts start with empty leads to verify zero-state handling.
 */

// 10 canonical leads from the Joy Resorts CRM reference design
const SCREENSHOT_LEADS_RESORT_1: Lead[] = [
  {
    id: 'lead-1',
    resort_id: 'resort-1',
    lead_code: 'LEAD001',
    name: 'Rahul Sharma',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    phone: '9876543210',
    email: 'rahul@gmail.com',
    city: 'Delhi, India',
    interested_in: 'Weekend Stay',
    guests_adults: 4,
    guests_children: 2,
    preferred_date: '2026-10-25',
    budget_min: 30000,
    budget_max: 50000,
    source: 'Website',
    status: 'New',
    priority: 'High',
    score: 'Hot',
    tags: ['Family', 'Nature'],
    assigned_to: 'Amit Singh',
    assigned_to_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    remarks: 'Looking for nature stay with activities for family.',
    created_at: '2026-10-08T10:30:00Z',
    last_activity_at: '08 Oct 2026, 10:30 AM',
    next_followup_at: 'Tomorrow, 10:00 AM',
  },
  {
    id: 'lead-2',
    resort_id: 'resort-1',
    lead_code: 'LEAD002',
    name: 'Priya Verma',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    phone: '8765432109',
    email: 'priya@gmail.com',
    city: 'Mumbai, India',
    interested_in: 'Family Stay',
    guests_adults: 6,
    guests_children: 1,
    preferred_date: '2026-11-15',
    budget_min: 45000,
    budget_max: 65000,
    source: 'Referral',
    status: 'Contacted',
    priority: 'Medium',
    score: 'Warm',
    tags: ['Family', 'Lake View'],
    assigned_to: 'Neha Gupta',
    assigned_to_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
    remarks: 'Prefers lake-view adjoining cottages with breakfast included.',
    created_at: '2026-10-08T09:15:00Z',
    last_activity_at: '08 Oct 2026, 09:15 AM',
    next_followup_at: '09 Oct 2026, 02:00 PM',
  },
  {
    id: 'lead-3',
    resort_id: 'resort-1',
    lead_code: 'LEAD003',
    name: 'Amit Patel',
    initials: 'AP',
    initials_bg: 'bg-indigo-600',
    phone: '7654321098',
    email: 'amit@gmail.com',
    city: 'Ahmedabad, India',
    interested_in: 'Corporate Event',
    guests_adults: 35,
    guests_children: 0,
    preferred_date: '2026-11-10',
    budget_min: 250000,
    budget_max: 400000,
    source: 'Walk-in',
    status: 'Site Visit',
    priority: 'Urgent',
    score: 'Hot',
    tags: ['Corporate', 'High Value'],
    assigned_to: 'Rohit Kumar',
    assigned_to_avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80',
    remarks: 'Needs conference hall equipped with AV projector and lawn dinner setup.',
    created_at: '2026-10-07T16:20:00Z',
    last_activity_at: '07 Oct 2026, 04:20 PM',
    next_followup_at: '10 Oct 2026, 11:30 AM',
  },
  {
    id: 'lead-4',
    resort_id: 'resort-1',
    lead_code: 'LEAD004',
    name: 'Sneha Joshi',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    phone: '9876123456',
    email: 'sneha@gmail.com',
    city: 'Pune, India',
    interested_in: 'Wedding',
    guests_adults: 120,
    guests_children: 15,
    preferred_date: '2026-12-18',
    budget_min: 800000,
    budget_max: 1200000,
    source: 'Instagram',
    status: 'Interested',
    priority: 'Urgent',
    score: 'Hot',
    tags: ['Wedding', 'VIP', 'High Value'],
    assigned_to: 'Neha Gupta',
    assigned_to_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
    remarks: 'Destination wedding inquiry. Requires poolside mandap and 20 luxury rooms.',
    created_at: '2026-10-07T13:10:00Z',
    last_activity_at: '07 Oct 2026, 01:10 PM',
    next_followup_at: '11 Oct 2026, 04:00 PM',
  },
  {
    id: 'lead-5',
    resort_id: 'resort-1',
    lead_code: 'LEAD005',
    name: 'Vikram Mehta',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    phone: '9123456789',
    email: 'vikram@gmail.com',
    city: 'Bengaluru, India',
    interested_in: 'Luxury Stay',
    guests_adults: 2,
    guests_children: 0,
    preferred_date: '2026-10-28',
    budget_min: 75000,
    budget_max: 75000,
    source: 'Google Ads',
    status: 'Booked',
    priority: 'High',
    score: 'Hot',
    tags: ['Luxury', 'Couple'],
    assigned_to: 'Amit Singh',
    assigned_to_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    remarks: 'Booked Presidential Pool Villa for 3 nights anniversary celebration.',
    created_at: '2026-10-06T17:45:00Z',
    last_activity_at: '06 Oct 2026, 05:45 PM',
    converted_booking_id: 'bkg-101',
  },
  {
    id: 'lead-6',
    resort_id: 'resort-1',
    lead_code: 'LEAD006',
    name: 'Kavita Rao',
    initials: 'KR',
    initials_bg: 'bg-pink-600',
    phone: '9988776655',
    email: 'kavita@gmail.com',
    city: 'Hyderabad, India',
    interested_in: 'Nature Camp',
    guests_adults: 8,
    guests_children: 0,
    preferred_date: '2026-11-05',
    budget_min: 40000,
    budget_max: 60000,
    source: 'Website',
    status: 'New',
    priority: 'Medium',
    score: 'Warm',
    tags: ['Nature', 'Group'],
    assigned_to: 'Pooja Soni',
    remarks: 'Inquiring about jungle trekking trails, campfire night, and tent stays.',
    created_at: '2026-10-06T11:30:00Z',
    last_activity_at: '06 Oct 2026, 11:30 AM',
    next_followup_at: '09 Oct 2026, 05:00 PM',
  },
  {
    id: 'lead-7',
    resort_id: 'resort-1',
    lead_code: 'LEAD007',
    name: 'Rohit Malhotra',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
    phone: '8899776655',
    email: 'rohit@gmail.com',
    city: 'Gurgaon, India',
    interested_in: 'Team Outing',
    guests_adults: 20,
    guests_children: 0,
    preferred_date: '2026-11-22',
    budget_min: 120000,
    budget_max: 120000,
    source: 'LinkedIn',
    status: 'Contacted',
    priority: 'Medium',
    score: 'Warm',
    tags: ['Corporate', 'Activities'],
    assigned_to: 'Rohit Kumar',
    assigned_to_avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80',
    remarks: 'One-day team engagement with paintball, rope adventure, and BBQ dinner.',
    created_at: '2026-10-05T15:20:00Z',
    last_activity_at: '05 Oct 2026, 03:20 PM',
    next_followup_at: '10 Oct 2026, 01:00 PM',
  },
  {
    id: 'lead-8',
    resort_id: 'resort-1',
    lead_code: 'LEAD008',
    name: 'Anjali Singh',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    phone: '7776665554',
    email: 'anjali@gmail.com',
    city: 'Jaipur, India',
    interested_in: 'Weekend Stay',
    guests_adults: 2,
    guests_children: 1,
    preferred_date: '2026-11-02',
    budget_min: 28000,
    budget_max: 28000,
    source: 'Website',
    status: 'Interested',
    priority: 'Medium',
    score: 'Warm',
    tags: ['Family', 'Relaxation'],
    assigned_to: 'Neha Gupta',
    assigned_to_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
    remarks: 'Wants garden cottage with quiet ambience for deep relaxation.',
    created_at: '2026-10-05T11:00:00Z',
    last_activity_at: '05 Oct 2026, 11:00 AM',
    next_followup_at: '08 Oct 2026, 06:00 PM',
  },
  {
    id: 'lead-9',
    resort_id: 'resort-1',
    lead_code: 'LEAD009',
    name: 'Sanjay Gupta',
    initials: 'SG',
    initials_bg: 'bg-sky-600',
    phone: '7665544332',
    email: 'sanjay@gmail.com',
    city: 'Kolkata, India',
    interested_in: 'Conference',
    guests_adults: 50,
    guests_children: 0,
    preferred_date: '2026-10-15',
    budget_min: 150000,
    budget_max: 150000,
    source: 'Walk-in',
    status: 'Lost',
    lost_reason: 'Dates not available',
    priority: 'Low',
    score: 'Cold',
    tags: ['Corporate'],
    assigned_to: 'Amit Singh',
    assigned_to_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    remarks: 'Dates clashed with pre-booked corporate seminar; venue unavailable.',
    created_at: '2026-10-04T16:10:00Z',
    last_activity_at: '04 Oct 2026, 04:10 PM',
  },
  {
    id: 'lead-10',
    resort_id: 'resort-1',
    lead_code: 'LEAD010',
    name: 'Neeraj Kumar',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
    phone: '9555443321',
    email: 'neeraj@gmail.com',
    city: 'Chandigarh, India',
    interested_in: 'Adventure Activities',
    guests_adults: 5,
    guests_children: 0,
    preferred_date: '2026-11-12',
    budget_min: 35000,
    budget_max: 50000,
    source: 'Website',
    status: 'Site Visit',
    priority: 'Medium',
    score: 'Warm',
    tags: ['Adventure', 'Youth'],
    assigned_to: 'Rohit Kumar',
    assigned_to_avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80',
    remarks: 'Visiting resort this Saturday to check rock climbing setup and kayak rentals.',
    created_at: '2026-10-04T10:15:00Z',
    last_activity_at: '04 Oct 2026, 10:15 AM',
    next_followup_at: '10 Oct 2026, 09:30 AM',
  },
];

// Helper generator to build realistic Indian leads
const INDIAN_FIRST_NAMES = [
  'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Reyansh', 'Muhammad', 'Sai', 'Aryan', 'Ishaan',
  'Ananya', 'Diya', 'Aadhya', 'Pari', 'Saanvi', 'Riya', 'Avani', 'Kiara', 'Myra', 'Ira',
  'Rajesh', 'Suresh', 'Manish', 'Karan', 'Deepak', 'Gaurav', 'Tarun', 'Naveen', 'Sunil', 'Harsh',
  'Pooja', 'Neha', 'Sunita', 'Kavita', 'Shweta', 'Geeta', 'Divya', 'Bhavna', 'Rashmi', 'Tanvi',
];

const INDIAN_LAST_NAMES = [
  'Sharma', 'Verma', 'Patel', 'Joshi', 'Mehta', 'Gupta', 'Singh', 'Kumar', 'Reddy', 'Nair',
  'Deshmukh', 'Chopra', 'Malhotra', 'Bhatia', 'Iyer', 'Menon', 'Rao', 'Agarwal', 'Bansal', 'Saxena',
  'Dubey', 'Tiwari', 'Mishra', 'Pandey', 'Shukla', 'Yadav', 'Kaur', 'Grewal', 'Bose', 'Chatterjee',
];

const CITIES = [
  'Mumbai', 'Delhi', 'Bengaluru', 'Ahmedabad', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune',
  'Jaipur', 'Lucknow', 'Chandigarh', 'Indore', 'Surat', 'Nagpur', 'Kochi', 'Bhopal',
];

const SOURCES: Lead['source'][] = [
  'Website', 'Instagram', 'Facebook', 'Google Ads', 'Walk-in', 'Referral', 'Travel Agent', 'MakeMyTrip', 'LinkedIn',
];

const INTERESTS: Lead['interested_in'][] = [
  'Weekend Stay', 'Family Stay', 'Luxury Stay', 'Wedding', 'Corporate Event', 'Nature Camp', 'Team Outing', 'Adventure Activities', 'Conference',
];

const STATUSES: Lead['status'][] = [
  'New', 'Contacted', 'Site Visit', 'Interested', 'Booked', 'Lost',
];

const LOST_REASONS = [
  'Too expensive', 'No response after follow-up', 'Chose competitor', 'Dates not available', 'Location too far',
];

const EXECUTIVES = [
  'Sameer Verma', // Demo Sales Executive role in useAuthStore
  'Amit Singh',
  'Neha Gupta',
  'Rohit Kumar',
  'Pooja Soni',
];

function generateRealisticLeads(resortId: string, count: number, startCodeIndex: number): Lead[] {
  const list: Lead[] = [];

  for (let i = 0; i < count; i++) {
    const fn = INDIAN_FIRST_NAMES[(i * 3 + 7) % INDIAN_FIRST_NAMES.length];
    const ln = INDIAN_LAST_NAMES[(i * 5 + 3) % INDIAN_LAST_NAMES.length];
    const name = `${fn} ${ln}`;
    const city = CITIES[(i * 2 + 1) % CITIES.length];
    const source = SOURCES[(i * 3) % SOURCES.length];
    const interestedIn = INTERESTS[(i * 4 + 2) % INTERESTS.length];
    
    // Status distribution: ~25% New, ~25% Contacted, ~15% Site Visit, ~15% Interested, ~12% Booked, ~8% Lost
    let status: Lead['status'] = 'New';
    const mod = i % 10;
    if (mod === 0 || mod === 1 || mod === 2) status = 'New';
    else if (mod === 3 || mod === 4) status = 'Contacted';
    else if (mod === 5) status = 'Site Visit';
    else if (mod === 6 || mod === 7) status = 'Interested';
    else if (mod === 8) status = 'Booked';
    else status = 'Lost';

    const priority: Lead['priority'] = i % 3 === 0 ? 'High' : i % 2 === 0 ? 'Medium' : 'Urgent';
    const score: Lead['score'] = status === 'Booked' || status === 'Site Visit' || priority === 'Urgent' ? 'Hot' : status === 'Lost' ? 'Cold' : 'Warm';

    // Budget determination based on stay type
    let budgetMin = 25000;
    let budgetMax = 45000;
    if (interestedIn === 'Wedding') {
      budgetMin = 600000 + (i % 5) * 100000;
      budgetMax = budgetMin + 400000;
    } else if (interestedIn === 'Corporate Event' || interestedIn === 'Conference') {
      budgetMin = 150000 + (i % 6) * 50000;
      budgetMax = budgetMin + 150000;
    } else if (interestedIn === 'Luxury Stay') {
      budgetMin = 60000 + (i % 4) * 20000;
      budgetMax = budgetMin + 40000;
    }

    const assignedTo = EXECUTIVES[i % EXECUTIVES.length];
    const codeNum = startCodeIndex + i;
    const leadCode = `LEAD${String(codeNum).padStart(3, '0')}`;
    const resortPrefix = resortId === 'resort-1' ? '98' : resortId === 'resort-2' ? '87' : '76';
    const phone = `${resortPrefix}${String(10000000 + ((codeNum * 87654321) % 89999999)).slice(0, 8)}`;
    const email = `${fn.toLowerCase()}.${ln.toLowerCase()}.${resortId}@gmail.com`;


    const day = (1 + (i % 28));
    const month = (i % 3 === 0 ? '11' : i % 2 === 0 ? '10' : '12');
    const preferredDate = `2026-${month}-${String(day).padStart(2, '0')}`;

    list.push({
      id: `lead-${resortId}-${codeNum}`,
      resort_id: resortId,
      lead_code: leadCode,
      name,
      phone,
      email,
      city: `${city}, India`,
      interested_in: interestedIn,
      guests_adults: interestedIn === 'Wedding' ? 100 : interestedIn.includes('Corporate') ? 30 : 2 + (i % 4),
      guests_children: interestedIn.includes('Family') ? 2 : 0,
      preferred_date: preferredDate,
      budget_min: budgetMin,
      budget_max: budgetMax,
      source,
      status,
      lost_reason: status === 'Lost' ? LOST_REASONS[i % LOST_REASONS.length] : undefined,
      priority,
      score,
      tags: [interestedIn.split(' ')[0], score === 'Hot' ? 'High Intent' : 'General'],
      assigned_to: assignedTo,
      remarks: `Guest inquiring regarding ${interestedIn.toLowerCase()} package rates and amenities.`,
      created_at: `2026-10-0${Math.max(1, 9 - (i % 8))}T10:00:00Z`,
      last_activity_at: `0${Math.max(1, 9 - (i % 8))} Oct 2026, 11:30 AM`,
      next_followup_at: status !== 'Booked' && status !== 'Lost' ? `1${i % 9} Oct 2026, 03:00 PM` : undefined,
      converted_booking_id: status === 'Booked' ? `bkg-${resortId}-${codeNum}` : undefined,
      initials: `${fn[0]}${ln[0]}`,
      initials_bg: i % 2 === 0 ? 'bg-emerald-600' : 'bg-blue-600',
    });
  }

  return list;
}

// Build 40 more leads for resort-1 (total ~50 leads for resort-1)
const ADDITIONAL_LEADS_RESORT_1 = generateRealisticLeads('resort-1', 40, 11);

// Build 48 leads for resort-2 (Shimla)
const LEADS_RESORT_2 = generateRealisticLeads('resort-2', 48, 101);

// Build 45 leads for resort-3 (Kumarakom)
const LEADS_RESORT_3 = generateRealisticLeads('resort-3', 45, 201);

export const INITIAL_SEEDED_LEADS: Lead[] = [
  ...SCREENSHOT_LEADS_RESORT_1,
  ...ADDITIONAL_LEADS_RESORT_1,
  ...LEADS_RESORT_2,
  ...LEADS_RESORT_3,
];

// Initial seed activities for the top leads
export const INITIAL_SEEDED_ACTIVITIES: LeadActivity[] = [
  {
    id: 'act-1',
    resort_id: 'resort-1',
    lead_id: 'lead-1',
    actor_name: 'System',
    actor_role: 'Webhook',
    type: 'created',
    title: 'Lead Created',
    description: 'Inbound enquiry received via Joy Resorts Official Website.',
    timestamp: '08 Oct 2026, 10:30 AM',
  },
  {
    id: 'act-2',
    resort_id: 'resort-1',
    lead_id: 'lead-1',
    actor_name: 'Ananya Sharma',
    actor_role: 'Resort Manager',
    type: 'assignment',
    title: 'Executive Assigned',
    description: 'Lead assigned to Amit Singh for prompt weekend stay follow-up.',
    timestamp: '08 Oct 2026, 10:45 AM',
  },
  {
    id: 'act-3',
    resort_id: 'resort-1',
    lead_id: 'lead-2',
    actor_name: 'Neha Gupta',
    actor_role: 'Sales Executive',
    type: 'call',
    title: 'Phone Consultation Completed',
    description: 'Spoke with guest regarding 3 adjoining lake-view cottages with breakfast package.',
    timestamp: '08 Oct 2026, 09:15 AM',
  },
  {
    id: 'act-4',
    resort_id: 'resort-1',
    lead_id: 'lead-3',
    actor_name: 'Rohit Kumar',
    actor_role: 'Sales Executive',
    type: 'status_change',
    title: 'Status Advanced to Site Visit',
    description: 'Guest scheduled site inspection for Grand Banquet Hall & AV setup.',
    timestamp: '07 Oct 2026, 04:20 PM',
  },
  {
    id: 'act-5',
    resort_id: 'resort-1',
    lead_id: 'lead-5',
    actor_name: 'Amit Singh',
    actor_role: 'Sales Executive',
    type: 'booking_converted',
    title: 'Converted to Confirmed Booking',
    description: 'Lead finalized Presidential Pool Villa V-01. Linked to Booking RES-8821.',
    timestamp: '06 Oct 2026, 05:45 PM',
  },
];

// Initial seed notes
export const INITIAL_SEEDED_NOTES: LeadNote[] = [
  {
    id: 'not-1',
    resort_id: 'resort-1',
    lead_id: 'lead-1',
    author_name: 'Amit Singh',
    author_role: 'Sales Executive',
    content: 'Guest is celebrating 10th anniversary with extended family. Highlight lake boating activities.',
    created_at: '08 Oct 2026, 11:00 AM',
  },
  {
    id: 'not-2',
    resort_id: 'resort-1',
    lead_id: 'lead-2',
    author_name: 'Neha Gupta',
    author_role: 'Sales Executive',
    content: 'Client requested pure vegetarian Jain meal options for dinner buffet.',
    created_at: '08 Oct 2026, 09:30 AM',
  },
  {
    id: 'not-3',
    resort_id: 'resort-1',
    lead_id: 'lead-4',
    author_name: 'Neha Gupta',
    author_role: 'Sales Executive',
    content: 'Needs 20 rooms blocked tentatively until end of this week. Sent royal wedding brochure on WhatsApp.',
    created_at: '07 Oct 2026, 02:00 PM',
  },
];

// Initial seed follow-ups
export const INITIAL_SEEDED_FOLLOWUPS: LeadFollowUp[] = [
  {
    id: 'flp-1',
    resort_id: 'resort-1',
    lead_id: 'lead-1',
    title: 'Call to discuss nature stay package details',
    channel: 'call',
    scheduled_at: 'Tomorrow, 10:00 AM',
    assigned_to: 'Amit Singh',
    status: 'pending',
    notes: 'Walk through family package inclusions and pool villa pictures.',
    created_at: '2026-10-08T10:30:00Z',
  },
  {
    id: 'flp-2',
    resort_id: 'resort-1',
    lead_id: 'lead-2',
    title: 'Send luxury villa brochure and meal plan pricing',
    channel: 'whatsapp',
    scheduled_at: '09 Oct 2026, 02:00 PM',
    assigned_to: 'Neha Gupta',
    status: 'pending',
    notes: 'Share PDF brochure and festive discount code.',
    created_at: '2026-10-08T09:15:00Z',
  },
  {
    id: 'flp-3',
    resort_id: 'resort-1',
    lead_id: 'lead-3',
    title: 'Guide site inspection of grand conference hall and suites',
    channel: 'site_visit',
    scheduled_at: '10 Oct 2026, 11:30 AM',
    assigned_to: 'Rohit Kumar',
    status: 'pending',
    notes: 'Keep projector running in banquet hall for demo.',
    created_at: '2026-10-07T16:20:00Z',
  },
];

// Initial guests records
export const INITIAL_SEEDED_GUESTS: GuestRecord[] = [
  {
    id: 'gst-1',
    resortId: 'resort-1',
    name: 'Vikram Mehta',
    phone: '9123456789',
    email: 'vikram@gmail.com',
    city: 'Bengaluru, India',
    leadSource: 'Google Ads',
    leadId: 'lead-5',
    totalStays: 1,
    totalSpent: 75000,
    createdAt: '2026-10-06T17:45:00Z',
  },
  {
    id: 'gst-2',
    resortId: 'resort-1',
    name: 'Rohan Mehra',
    phone: '9820044332',
    email: 'rohan.mehra@gmail.com',
    city: 'Mumbai, India',
    leadSource: 'Website',
    totalStays: 2,
    totalSpent: 36960,
    createdAt: '2026-10-05T12:00:00Z',
  },
];
