import { Booking } from '@/types';
import { getDbItem, setDbItem, DB_KEYS } from './db';

export interface BookingRecord extends Booking {
  resortId: string;
}

export function getBookings(resortId?: string, isSuperAdmin = false): BookingRecord[] {
  const bookings = getDbItem<BookingRecord[]>(DB_KEYS.BOOKINGS, []);
  if (isSuperAdmin && !resortId) {
    return bookings;
  }
  return bookings.filter((b) => b.resortId === (resortId || 'resort-1'));
}

export function createBooking(
  booking: Omit<Booking, 'id' | 'bookingCode'>,
  resortId: string
): BookingRecord {
  const bookings = getDbItem<BookingRecord[]>(DB_KEYS.BOOKINGS, []);
  const newBooking: BookingRecord = {
    ...booking,
    id: `bkg-${Date.now()}`,
    bookingCode: `RES-${Math.floor(1000 + Math.random() * 9000)}`,
    resortId,
  };

  setDbItem(DB_KEYS.BOOKINGS, [newBooking, ...bookings]);
  return newBooking;
}

export function updateBooking(booking: BookingRecord): boolean {
  const bookings = getDbItem<BookingRecord[]>(DB_KEYS.BOOKINGS, []);
  const idx = bookings.findIndex((b) => b.id === booking.id);
  if (idx === -1) return false;

  bookings[idx] = booking;
  setDbItem(DB_KEYS.BOOKINGS, bookings);
  return true;
}

import { createTaskOnCheckOut } from './housekeepingApi';
import { setRoomStatusByNumber } from './roomsApi';

export function checkInBooking(bookingId: string): boolean {
  const bookings = getDbItem<BookingRecord[]>(DB_KEYS.BOOKINGS, []);
  const idx = bookings.findIndex((b) => b.id === bookingId);
  if (idx === -1) return false;

  const booking = bookings[idx];
  booking.roomStatus = 'Occupied';
  bookings[idx] = booking;
  setDbItem(DB_KEYS.BOOKINGS, bookings);

  // Mark room as Occupied
  setRoomStatusByNumber(booking.roomNumber, 'Occupied', booking.resortId);
  return true;
}

export function checkOutBooking(bookingId: string): boolean {
  const bookings = getDbItem<BookingRecord[]>(DB_KEYS.BOOKINGS, []);
  const idx = bookings.findIndex((b) => b.id === bookingId);
  if (idx === -1) return false;

  const booking = bookings[idx];
  booking.roomStatus = 'Dirty';
  bookings[idx] = booking;
  setDbItem(DB_KEYS.BOOKINGS, bookings);

  // Trigger auto room dirty and housekeeping task dispatch!
  createTaskOnCheckOut(booking.roomNumber, booking.resortId, 'Villa / Room', booking.guestName);
  return true;
}
