// ==========================================
// RESORT MANAGEMENT SYSTEM - TYPE DEFINITIONS
// ==========================================

// Staff and Guest Roles
export type UserRole =
  | 'Super Admin'
  | 'Resort Owner'
  | 'Resort Manager'
  | 'Sales Executive'
  | 'Receptionist'
  | 'Housekeeping'
  | 'Restaurant/F&B'
  | 'Accountant'
  | 'Guest';

// Multi-Tenant Resort Interface
export interface ResortTenant {
  id: string;
  name: string;
  code: string;
  tagline: string;
  city: string;
  state: string;
  plan: 'Basic' | 'Pro' | 'Enterprise';
  status: 'Active' | 'Trial' | 'Suspended';
  totalRooms: number;
  activeUsers: number;
  mrr: number; // in INR
  ownerName: string;
  ownerEmail: string;
  logo?: string;
  joinedDate: string;
}

// SaaS Subscription Plan
export interface PlatformPlan {
  id: string;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  roomLimit: number;
  userLimit: number;
  branchLimit: number;
  features: string[];
  isPopular?: boolean;
}

// Room and Booking Statuses
export type StatusType =
  | 'Available'
  | 'Occupied'
  | 'Reserved'
  | 'Dirty'
  | 'Cleaning'
  | 'Clean'
  | 'Maintenance'
  | 'Paid'
  | 'Pending'
  | 'Cancelled';

// User Profile Interface
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  shift?: string;
}

// Room Category & Details
export interface Room {
  id: string;
  roomNumber: string;
  category: 'Deluxe Cottage' | 'Pool Villa' | 'Luxury Suite' | 'Heritage Room';
  status: StatusType;
  floor: number;
  ratePerNight: number;
  maxGuests: number;
  amenities: string[];
}

// Booking Details
export interface Booking {
  id: string;
  bookingCode: string;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  roomNumber: string;
  checkIn: string; // ISO date
  checkOut: string; // ISO date
  totalAmount: number;
  gstAmount: number;
  paymentStatus: 'Paid' | 'Pending' | 'Cancelled';
  roomStatus: StatusType;
}

// Billing / Invoice
export interface Invoice {
  id: string;
  invoiceNumber: string;
  guestName: string;
  date: string;
  subTotal: number;
  gstRate: number;
  gstAmount: number;
  grandTotal: number;
  status: 'Paid' | 'Pending';
  resortId?: string;
}

// SaaS Audit Log Entry
export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorName: string;
  actorEmail: string;
  actorRole: UserRole;
  action: string;
  details: string;
  resortId?: string;
  resortName?: string;
  severity: 'Info' | 'Warning' | 'Critical';
}

// Resort Owner Executive Approvals
export interface ExecutiveApproval {
  id: string;
  resortId: string;
  title: string;
  type: 'Refund' | 'Capex' | 'Discount' | 'Vendor';
  amount: number;
  requestedBy: string;
  requestedDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  reason: string;
}

// Configurable Tax Settings per Resort
export interface TaxConfig {
  resortId: string;
  roomGstUnder7500: number; // default 12%
  roomGstAbove7500: number; // default 18%
  restaurantGst: number;   // default 5%
  isCompositionScheme: boolean;
  notes: string;
}

// Staff Invitation
export interface StaffInvite {
  id: string;
  email: string;
  role: UserRole;
  resortId: string;
  resortName: string;
  invitedBy: string;
  createdAt: string;
  expiresAt: string; // 7 days expiry
  token: string;
  status: 'Pending' | 'Accepted' | 'Expired' | 'Revoked';
}
