export type LeadStatus = 'New' | 'Contacted' | 'Site Visit' | 'Interested' | 'Booked' | 'Lost';

export interface AssignedStaff {
  name: string;
  avatar: string;
}

export interface FollowUpItem {
  date: string;
  title: string;
  isCompleted: boolean;
}

export interface Lead {
  id: string;
  leadNumber: number;
  leadCode: string;
  name: string;
  avatar?: string;
  initials?: string;
  initialsBg?: string;
  phone: string;
  email: string;
  location: string;
  interestedIn: string;
  status: LeadStatus;
  lastActivityDate: string;
  lastActivityTime: string;
  assignedTo: AssignedStaff;
  preferredDate: string;
  guests: string;
  source: string;
  budget: string;
  remarks: string;
  followUp: FollowUpItem;
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
  revenue: string;
  revenueTrend: string;
}

export const CRM_METRIC_STATS: CRMStats = {
  totalLeads: 482,
  totalLeadsTrend: '+12%',
  newEnquiries: 156,
  newEnquiriesTrend: '+8%',
  siteVisits: 74,
  siteVisitsTrend: '+15%',
  bookings: 38,
  bookingsTrend: '+22%',
  revenue: '₹42.5 L',
  revenueTrend: '+18%',
};

export const CRM_TABS = [
  { id: 'all', label: 'All Leads', count: 482 },
  { id: 'New', label: 'New', count: 156 },
  { id: 'Contacted', label: 'Contacted', count: 98 },
  { id: 'Site Visit', label: 'Site Visit', count: 74 },
  { id: 'Interested', label: 'Interested', count: 68 },
  { id: 'Booked', label: 'Booked', count: 38 },
  { id: 'Lost', label: 'Lost', count: 48 },
] as const;

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-1',
    leadNumber: 1,
    leadCode: 'LEAD001',
    name: 'Rahul Sharma',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    phone: '9876543210',
    email: 'rahul@gmail.com',
    location: 'Delhi, India',
    interestedIn: 'Weekend Stay',
    status: 'New',
    lastActivityDate: '08 Oct 2026',
    lastActivityTime: '10:30 AM',
    assignedTo: {
      name: 'Amit Singh',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    },
    preferredDate: '25 Oct 2026',
    guests: '4 Adults, 2 Children',
    source: 'Website',
    budget: '₹30,000 - ₹50,000',
    remarks: 'Looking for nature stay with activities for family.',
    followUp: {
      date: 'Tomorrow, 10:00 AM',
      title: 'Call to discuss package details',
      isCompleted: false,
    },
  },
  {
    id: 'lead-2',
    leadNumber: 2,
    leadCode: 'LEAD002',
    name: 'Priya Verma',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    phone: '8765432109',
    email: 'priya@gmail.com',
    location: 'Mumbai, India',
    interestedIn: 'Family Stay',
    status: 'Contacted',
    lastActivityDate: '08 Oct 2026',
    lastActivityTime: '09:15 AM',
    assignedTo: {
      name: 'Neha Gupta',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
    },
    preferredDate: '15 Nov 2026',
    guests: '6 Adults, 1 Child',
    source: 'Referral',
    budget: '₹45,000 - ₹65,000',
    remarks: 'Prefers lake-view adjoining cottages with breakfast included.',
    followUp: {
      date: '09 Oct 2026, 02:00 PM',
      title: 'Send luxury villa brochure and meal plan pricing',
      isCompleted: false,
    },
  },
  {
    id: 'lead-3',
    leadNumber: 3,
    leadCode: 'LEAD003',
    name: 'Amit Patel',
    initials: 'AP',
    initialsBg: 'bg-indigo-600',
    phone: '7654321098',
    email: 'amit@gmail.com',
    location: 'Ahmedabad, India',
    interestedIn: 'Corporate Event',
    status: 'Site Visit',
    lastActivityDate: '07 Oct 2026',
    lastActivityTime: '04:20 PM',
    assignedTo: {
      name: 'Rohit Kumar',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80',
    },
    preferredDate: '10 Nov 2026',
    guests: '35 Corporate delegates',
    source: 'Direct Walk-in',
    budget: '₹2,50,000 - ₹4,00,000',
    remarks: 'Needs conference hall equipped with AV projector and lawn dinner setup.',
    followUp: {
      date: '10 Oct 2026, 11:30 AM',
      title: 'Guide site inspection of grand conference hall and suites',
      isCompleted: false,
    },
  },
  {
    id: 'lead-4',
    leadNumber: 4,
    leadCode: 'LEAD004',
    name: 'Sneha Joshi',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    phone: '9876123456',
    email: 'sneha@gmail.com',
    location: 'Pune, India',
    interestedIn: 'Wedding Event',
    status: 'Interested',
    lastActivityDate: '07 Oct 2026',
    lastActivityTime: '01:10 PM',
    assignedTo: {
      name: 'Neha Gupta',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
    },
    preferredDate: '18 Dec 2026',
    guests: '120 Guests',
    source: 'Instagram',
    budget: '₹8,00,000 - ₹12,00,000',
    remarks: 'Destination wedding inquiry. Requires poolside mandap and 20 luxury rooms.',
    followUp: {
      date: '11 Oct 2026, 04:00 PM',
      title: 'Discuss catering menu tasting and lawn decoration choices',
      isCompleted: false,
    },
  },
  {
    id: 'lead-5',
    leadNumber: 5,
    leadCode: 'LEAD005',
    name: 'Vikram Mehta',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    phone: '9123456789',
    email: 'vikram@gmail.com',
    location: 'Bengaluru, India',
    interestedIn: 'Luxury Stay',
    status: 'Booked',
    lastActivityDate: '06 Oct 2026',
    lastActivityTime: '05:45 PM',
    assignedTo: {
      name: 'Amit Singh',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    },
    preferredDate: '28 Oct 2026',
    guests: '2 Adults',
    source: 'Google Ads',
    budget: '₹75,000',
    remarks: 'Booked Presidential Pool Villa for 3 nights anniversary celebration.',
    followUp: {
      date: '20 Oct 2026, 10:00 AM',
      title: 'Confirm airport pickup time and complimentary champagne',
      isCompleted: true,
    },
  },
  {
    id: 'lead-6',
    leadNumber: 6,
    leadCode: 'LEAD006',
    name: 'Kavita Rao',
    initials: 'KR',
    initialsBg: 'bg-pink-600',
    phone: '9988776655',
    email: 'kavita@gmail.com',
    location: 'Hyderabad, India',
    interestedIn: 'Nature Camp',
    status: 'New',
    lastActivityDate: '06 Oct 2026',
    lastActivityTime: '11:30 AM',
    assignedTo: {
      name: 'Pooja Soni',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80',
    },
    preferredDate: '05 Nov 2026',
    guests: '8 Adults (Trekkers group)',
    source: 'Website',
    budget: '₹40,000 - ₹60,000',
    remarks: 'Inquiring about jungle trekking trails, campfire night, and tent stays.',
    followUp: {
      date: '09 Oct 2026, 05:00 PM',
      title: 'Send itinerary for guided jungle nature walk',
      isCompleted: false,
    },
  },
  {
    id: 'lead-7',
    leadNumber: 7,
    leadCode: 'LEAD007',
    name: 'Rohit Malhotra',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
    phone: '8899776655',
    email: 'rohit@gmail.com',
    location: 'Gurgaon, India',
    interestedIn: 'Team Outing',
    status: 'Contacted',
    lastActivityDate: '05 Oct 2026',
    lastActivityTime: '03:20 PM',
    assignedTo: {
      name: 'Rohit Kumar',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80',
    },
    preferredDate: '22 Nov 2026',
    guests: '20 Employees',
    source: 'LinkedIn',
    budget: '₹1,20,000',
    remarks: 'One-day team engagement with paintball, rope adventure, and BBQ dinner.',
    followUp: {
      date: '10 Oct 2026, 01:00 PM',
      title: 'Follow up on corporate quotation approval',
      isCompleted: false,
    },
  },
  {
    id: 'lead-8',
    leadNumber: 8,
    leadCode: 'LEAD008',
    name: 'Anjali Singh',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    phone: '7776665554',
    email: 'anjali@gmail.com',
    location: 'Jaipur, India',
    interestedIn: 'Weekend Stay',
    status: 'Interested',
    lastActivityDate: '05 Oct 2026',
    lastActivityTime: '11:00 AM',
    assignedTo: {
      name: 'Neha Gupta',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
    },
    preferredDate: '02 Nov 2026',
    guests: '2 Adults, 1 Child',
    source: 'Website',
    budget: '₹28,000',
    remarks: 'Wants garden cottage with quiet ambience for deep relaxation.',
    followUp: {
      date: '08 Oct 2026, 06:00 PM',
      title: 'Offer festive season early-bird 10% discount code',
      isCompleted: false,
    },
  },
  {
    id: 'lead-9',
    leadNumber: 9,
    leadCode: 'LEAD009',
    name: 'Sanjay Gupta',
    initials: 'SG',
    initialsBg: 'bg-sky-600',
    phone: '7665544332',
    email: 'sanjay@gmail.com',
    location: 'Kolkata, India',
    interestedIn: 'Conference',
    status: 'Lost',
    lastActivityDate: '04 Oct 2026',
    lastActivityTime: '04:10 PM',
    assignedTo: {
      name: 'Amit Singh',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    },
    preferredDate: '15 Oct 2026',
    guests: '50 Delegates',
    source: 'Direct Walk-in',
    budget: '₹1,50,000',
    remarks: 'Dates clashed with pre-booked corporate seminar; venue unavailable.',
    followUp: {
      date: '01 Nov 2026, 10:00 AM',
      title: 'Re-engage for Q1 2027 regional summit dates',
      isCompleted: false,
    },
  },
  {
    id: 'lead-10',
    leadNumber: 10,
    leadCode: 'LEAD010',
    name: 'Neeraj Kumar',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
    phone: '9555443321',
    email: 'neeraj@gmail.com',
    location: 'Chandigarh, India',
    interestedIn: 'Adventure Activities',
    status: 'Site Visit',
    lastActivityDate: '04 Oct 2026',
    lastActivityTime: '10:15 AM',
    assignedTo: {
      name: 'Rohit Kumar',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80',
    },
    preferredDate: '12 Nov 2026',
    guests: '5 Adults',
    source: 'Website',
    budget: '₹35,000 - ₹50,000',
    remarks: 'Visiting resort this Saturday to check rock climbing setup and kayak rentals.',
    followUp: {
      date: '10 Oct 2026, 09:30 AM',
      title: 'Confirm gate entry pass for weekend site visit',
      isCompleted: false,
    },
  },
];
