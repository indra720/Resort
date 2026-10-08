import { ActivityItem } from '@/components/ui/ActivityFeed';
import {
  BedDouble,
  UserCheck,
  CreditCard,
  Utensils,
  Sparkles,
  Wrench,
} from 'lucide-react';

// Monthly Revenue Data (in INR)
export const MONTHLY_REVENUE_DATA = [
  { month: 'May', rooms: 2850000, fnb: 820000, total: 3670000 },
  { month: 'Jun', rooms: 3100000, fnb: 950000, total: 4050000 },
  { month: 'Jul', rooms: 2700000, fnb: 790000, total: 3490000 },
  { month: 'Aug', rooms: 3450000, fnb: 1050000, total: 4500000 },
  { month: 'Sep', rooms: 3900000, fnb: 1220000, total: 5120000 },
  { month: 'Oct', rooms: 4250000, fnb: 1350000, total: 5600000 },
];

// Room Occupancy Donut Data
export const ROOM_OCCUPANCY_DATA = [
  { name: 'Occupied', value: 16, color: '#C2410C' },
  { name: 'Available', value: 8, color: '#22C55E' },
  { name: 'Cleaning', value: 4, color: '#F59E0B' },
  { name: 'Maintenance', value: 2, color: '#EF4444' },
];

// Weekly Arrivals & Departures for Front Desk / Resort Manager
export const WEEKLY_MOVEMENT_DATA = [
  { day: 'Mon', arrivals: 12, departures: 9 },
  { day: 'Tue', arrivals: 15, departures: 14 },
  { day: 'Wed', arrivals: 10, departures: 11 },
  { day: 'Thu', arrivals: 18, departures: 8 },
  { day: 'Fri', arrivals: 24, departures: 6 },
  { day: 'Sat', arrivals: 28, departures: 12 },
  { day: 'Sun', arrivals: 14, departures: 22 },
];

// Restaurant Dining Sales by Meal Period
export const RESTAURANT_SALES_DATA = [
  { meal: 'Breakfast', sales: 45000, orders: 38 },
  { meal: 'Lunch', sales: 88000, orders: 54 },
  { meal: 'Hi-Tea', sales: 26000, orders: 22 },
  { meal: 'Dinner', sales: 142000, orders: 72 },
  { meal: 'Pool Bar', sales: 58000, orders: 40 },
];

// Financial Monthly Profit & Loss (Accountant)
export const FINANCE_PNL_DATA = [
  { month: 'Jul', revenue: 3490000, expenses: 1950000, gst: 520000 },
  { month: 'Aug', revenue: 4500000, expenses: 2200000, gst: 680000 },
  { month: 'Sep', revenue: 5120000, expenses: 2450000, gst: 790000 },
  { month: 'Oct', revenue: 5600000, expenses: 2600000, gst: 870000 },
];

// Role Activities
export const SUPER_ADMIN_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    title: 'High-Value Booking Received',
    description: 'Devendra Singhania booked Pool Villa V-01 (₹84,960 total).',
    time: '12m ago',
    icon: BedDouble,
    user: 'Online Engine',
  },
  {
    id: 'act-2',
    title: 'GST Return Q2 Filed',
    description: 'GSTR-3B filed for September with ₹7.9 Lakh tax credit reconciliation.',
    time: '2h ago',
    icon: CreditCard,
    user: 'Arjun Sen (Accountant)',
  },
  {
    id: 'act-3',
    title: 'Inventory Reorder Dispatched',
    description: 'Purchase Order #PO-441 approved for Organic Spa Lotions (₹38,000).',
    time: '4h ago',
    icon: Sparkles,
    user: 'Ananya Sharma (Manager)',
  },
];

export const FRONT_DESK_ACTIVITIES: ActivityItem[] = [
  {
    id: 'fd-1',
    title: 'Guest Checked In',
    description: 'Rohan Mehra checked into Deluxe Cottage #102. Key card issued.',
    time: '10m ago',
    icon: UserCheck,
    user: 'Rajesh Patil',
  },
  {
    id: 'fd-2',
    title: 'Airport Pickup Arranged',
    description: 'Sedan dispatched for Kavita Iyer arriving at Dabolim Airport at 4:30 PM.',
    time: '45m ago',
    icon: BedDouble,
    user: 'Rajesh Patil',
  },
  {
    id: 'fd-3',
    title: 'Room Balance Cleared',
    description: 'Amitabh Joshi settled ₹12,320 via Google Pay UPI.',
    time: '2h ago',
    icon: CreditCard,
    user: 'Rajesh Patil',
  },
];

export const HOUSEKEEPING_ACTIVITIES: ActivityItem[] = [
  {
    id: 'hk-1',
    title: 'Turnover Completed',
    description: 'Room #101 cleaned and sanitized. Marked as Available.',
    time: '8m ago',
    icon: Sparkles,
    user: 'Sunita Devi',
  },
  {
    id: 'hk-2',
    title: 'Maintenance Ticket Raised',
    description: 'Villa V-02 Jacuzzi temperature sensor reported faulty.',
    time: '1h ago',
    icon: Wrench,
    user: 'Sunita Devi',
  },
  {
    id: 'hk-3',
    title: 'Linen Inventory Count',
    description: 'Fresh Egyptian Cotton sheets restocked in 2nd Floor Linen Hub.',
    time: '3h ago',
    icon: Sparkles,
    user: 'Housekeeping Team',
  },
];

export const RESTAURANT_ACTIVITIES: ActivityItem[] = [
  {
    id: 'fb-1',
    title: 'Candlelight Dinner Reserved',
    description: 'Table 7 reserved for Anniversary Dinner (4-course Goan Feast).',
    time: '15m ago',
    icon: Utensils,
    user: 'Chef Sanjeev Nair',
  },
  {
    id: 'fb-2',
    title: 'KOT #89 Served',
    description: 'Live seafood platter served to Pool Villa V-01 guests.',
    time: '32m ago',
    icon: Utensils,
    user: 'Kitchen Captain',
  },
];
