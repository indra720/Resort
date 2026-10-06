// ==========================================
// RESORT MANAGEMENT SYSTEM - TYPE DEFINITIONS
// ==========================================

// Staff and Guest Roles
export type UserRole =
  | 'Super Admin'
  | 'Resort Manager'
  | 'Receptionist'
  | 'Housekeeping'
  | 'Restaurant/F&B'
  | 'Accountant'
  | 'Guest';

// Room and Booking Statuses
export type StatusType =
  | 'Available'
  | 'Occupied'
  | 'Reserved'
  | 'Cleaning'
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
  gstRate: 12 | 18;
  gstAmount: number;
  grandTotal: number;
  status: 'Paid' | 'Pending';
}
