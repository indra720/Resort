import { Quotation, QuotationItem, QuotationStatus, Lead, QuotationTotals } from '@/types/crm';
import { User, Booking, GuestRecord } from '@/types';
import { getDbItem, setDbItem, DB_KEYS } from './db';
import { addLeadActivity, updateLead } from './leads';

/**
 * Calculates financial subtotal, discount, tax (GST), and grand total
 */
export function calculateQuotationTotals(
  items: QuotationItem[],
  discountType: 'percentage' | 'fixed' = 'percentage',
  discountValue: number = 0,
  taxType: 'GST_12' | 'GST_18' | 'NONE' = 'GST_18'
): QuotationTotals {
  const subtotal = items.reduce((acc, item) => acc + (item.quantity * item.rate), 0);

  let discountAmount = 0;
  if (discountType === 'percentage') {
    discountAmount = Math.round((subtotal * Math.min(100, Math.max(0, discountValue))) / 100);
  } else {
    discountAmount = Math.min(subtotal, Math.max(0, discountValue));
  }

  const taxableAmount = Math.max(0, subtotal - discountAmount);

  let cgstRate = 0;
  let sgstRate = 0;
  let totalGstRate = 0;

  if (taxType === 'GST_12') {
    cgstRate = 6;
    sgstRate = 6;
    totalGstRate = 12;
  } else if (taxType === 'GST_18') {
    cgstRate = 9;
    sgstRate = 9;
    totalGstRate = 18;
  }

  const taxAmount = Math.round((taxableAmount * totalGstRate) / 100);
  const cgstAmount = Math.round((taxableAmount * cgstRate) / 100);
  const sgstAmount = Math.round((taxableAmount * sgstRate) / 100);
  const grandTotal = taxableAmount + taxAmount;
  const caDisclaimer =
    'Under Government of India GST Council regulations for hospitality (Notification No. 11/2017 - Central Tax (Rate)), rooms <= ₹7,500/night attract 12% GST and rooms > ₹7,500/night attract 18% GST. As verified by Chartered Accountant standards, taxes are split equally into CGST and SGST for intra-state guest reservations.';

  return {
    subtotal,
    discountAmount,
    discount_amount: discountAmount,
    taxableAmount,
    taxable_amount: taxableAmount,
    cgstRate,
    cgst_rate: cgstRate,
    sgstRate,
    sgst_rate: sgstRate,
    cgstAmount,
    cgst_amount: cgstAmount,
    sgstAmount,
    sgst_amount: sgstAmount,
    igstRate: 0,
    taxAmount,
    total_tax: taxAmount,
    grandTotal,
    grand_total: grandTotal,
    caDisclaimer,
    ca_disclaimer: caDisclaimer,
  };
}

/**
 * Retrieve quotations for a resort with role-based filtering
 */
export function getQuotations(
  resortId: string,
  currentUser?: User | null,
  statusFilter?: string
): Quotation[] {
  const list = getDbItem<Quotation[]>(DB_KEYS.QUOTATIONS, []);
  let filtered = list.filter((q) => q.resort_id === resortId);

  // Sales Executive sees only quotations created by them or for leads assigned to them
  if (currentUser && currentUser.role === 'Sales Executive') {
    const repName = currentUser.name.toLowerCase().trim();
    filtered = filtered.filter(
      (q) =>
        (q.created_by && q.created_by.toLowerCase().trim() === repName) ||
        (q.assigned_to && q.assigned_to.toLowerCase().trim() === repName)
    );
  }

  if (statusFilter && statusFilter !== 'ALL') {
    filtered = filtered.filter((q) => q.status === statusFilter);
  }

  return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

/**
 * Get single quotation by ID
 */
export function getQuotationById(id: string, resortId: string): Quotation | null {
  const list = getDbItem<Quotation[]>(DB_KEYS.QUOTATIONS, []);
  return list.find((q) => q.id === id && q.resort_id === resortId) || null;
}

/**
 * Create a new Quotation
 */
export function createQuotation(
  data: Partial<Quotation> & {
    guest_name: string;
    guest_phone: string;
    guest_email: string;
    items: QuotationItem[];
  },
  resortId: string,
  currentUser?: User | null
): { success: boolean; quotation?: Quotation; error?: string } {
  const allQuotations = getDbItem<Quotation[]>(DB_KEYS.QUOTATIONS, []);
  const resortQuotations = allQuotations.filter((q) => q.resort_id === resortId);

  const seq = String(resortQuotations.length + 1).padStart(3, '0');
  const quotationNumber = `QT-${new Date().getFullYear()}-${seq}`;

  const calculated = calculateQuotationTotals(
    data.items,
    data.discount_type,
    data.discount_value,
    data.tax_type
  );

  const newQuotation: Quotation = {
    discount_type: 'percentage',
    discount_value: 0,
    tax_type: 'GST_18',
    status: 'Draft',
    valid_until: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
    ...data,
    id: `qt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    resort_id: resortId,
    quotation_number: quotationNumber,
    quotation_code: quotationNumber,
    subtotal: calculated.subtotal,
    discount_amount: calculated.discountAmount,
    cgst_rate: calculated.cgstRate,
    sgst_rate: calculated.sgstRate,
    igst_rate: calculated.igstRate,
    tax_amount: calculated.taxAmount,
    grand_total: calculated.grandTotal,
    created_at: new Date().toISOString(),
    created_by: currentUser?.name || data.created_by || 'Sales Executive',
  };

  setDbItem(DB_KEYS.QUOTATIONS, [newQuotation, ...allQuotations]);

  // Log activity on linked lead
  if (data.lead_id) {
    addLeadActivity(data.lead_id, resortId, {
      actor_name: currentUser?.name || 'Sales Staff',
      actor_role: currentUser?.role || 'Staff',
      type: 'note',
      title: `Quotation Created (${quotationNumber})`,
      description: `Generated proposal for ₹${calculated.grandTotal.toLocaleString('en-IN')} with ${data.items.length} package items.`,
    });
  }

  return { success: true, quotation: newQuotation };
}

/**
 * Update an existing Quotation
 */
export function updateQuotation(
  id: string,
  updates: Partial<Quotation>,
  resortId: string,
  currentUser?: User | null
): { success: boolean; error?: string } {
  const all = getDbItem<Quotation[]>(DB_KEYS.QUOTATIONS, []);
  const idx = all.findIndex((q) => q.id === id && q.resort_id === resortId);
  if (idx === -1) return { success: false, error: 'Quotation not found.' };

  const current = all[idx];
  const items = updates.items || current.items;
  const discountType = updates.discount_type || current.discount_type;
  const discountValue = updates.discount_value !== undefined ? updates.discount_value : current.discount_value;
  const taxType = updates.tax_type || current.tax_type;

  const calculated = calculateQuotationTotals(items, discountType, discountValue, taxType);

  all[idx] = {
    ...current,
    ...updates,
    subtotal: calculated.subtotal,
    discount_amount: calculated.discountAmount,
    cgst_rate: calculated.cgstRate,
    sgst_rate: calculated.sgstRate,
    tax_amount: calculated.taxAmount,
    grand_total: calculated.grandTotal,
  };

  setDbItem(DB_KEYS.QUOTATIONS, all);

  if (current.lead_id && updates.status && updates.status !== current.status) {
    addLeadActivity(current.lead_id, resortId, {
      actor_name: currentUser?.name || 'Sales Staff',
      actor_role: currentUser?.role || 'Staff',
      type: 'status_change',
      title: `Quotation Status: ${updates.status}`,
      description: `Quotation ${current.quotation_number} status updated to ${updates.status}.`,
    });
  }

  return { success: true };
}

/**
 * Update status of quotation
 */
export function updateQuotationStatus(
  id: string,
  status: any,
  resortId: string,
  currentUser?: User | null
): { success: boolean; error?: string } {
  return updateQuotation(id, { status }, resortId, currentUser);
}

/**
 * Delete a quotation
 */
export function deleteQuotation(id: string, resortId: string): boolean {
  const all = getDbItem<Quotation[]>(DB_KEYS.QUOTATIONS, []);
  const filtered = all.filter((q) => !(q.id === id && q.resort_id === resortId));
  if (filtered.length === all.length) return false;
  setDbItem(DB_KEYS.QUOTATIONS, filtered);
  return true;
}

/**
 * Send Quotation (Mock WhatsApp / Email)
 */
export function sendQuotation(
  id: string,
  channel: 'whatsapp' | 'email',
  resortId: string,
  currentUser?: User | null
): { success: boolean; message: string } {
  const quotation = getQuotationById(id, resortId);
  if (!quotation) return { success: false, message: 'Quotation not found' };

  updateQuotation(id, { status: 'Sent' }, resortId, currentUser);

  if (quotation.lead_id) {
    addLeadActivity(quotation.lead_id, resortId, {
      actor_name: currentUser?.name || 'Sales Staff',
      actor_role: currentUser?.role || 'Staff',
      type: channel,
      title: `Quotation Dispatched via ${channel.toUpperCase()}`,
      description: `Sent proposal ${quotation.quotation_number} (₹${quotation.grand_total.toLocaleString('en-IN')}) to ${quotation.guest_name}.`,
    });
  }

  return {
    success: true,
    message: `Proposal dispatched via ${channel === 'whatsapp' ? 'WhatsApp' : 'Email'} successfully.`,
  };
}

/**
 * Convert Accepted Quotation to Booking
 */
export function convertQuotationToBooking(
  quotationId: string,
  resortId: string,
  currentUser?: User | null
): { success: boolean; booking?: Booking; guest?: GuestRecord; error?: string } {
  const quotation = getQuotationById(quotationId, resortId);
  if (!quotation) {
    return { success: false, error: 'Quotation not found' };
  }

  const bookings = getDbItem<Booking[]>(DB_KEYS.BOOKINGS, []);
  const guests = getDbItem<GuestRecord[]>(DB_KEYS.GUESTS, []);

  const bookingId = `BK-QT-${Date.now().toString().slice(-6)}`;
  const checkIn = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
  const checkOut = new Date(Date.now() + 9 * 86400000).toISOString().split('T')[0];

  const newBooking: Booking = {
    id: bookingId,
    bookingCode: bookingId,
    roomNumber: '101',
    guestName: quotation.guest_name,
    guestPhone: quotation.guest_phone,
    guestEmail: quotation.guest_email,
    checkIn,
    checkOut,
    status: 'Reserved',
    roomStatus: 'Reserved',
    totalAmount: quotation.grand_total,
    gstAmount: quotation.tax_amount,
    paymentStatus: 'Pending',
    paidAmount: 0,
    resortId,
    specialRequests: `Converted from Quotation ${quotation.quotation_number}. Notes: ${quotation.notes || ''}`,
  };

  setDbItem(DB_KEYS.BOOKINGS, [newBooking, ...bookings]);

  // Update or create Guest record
  const existingGuestIdx = guests.findIndex(
    (g) => g.phone === quotation.guest_phone && g.resortId === resortId
  );

  if (existingGuestIdx >= 0) {
    guests[existingGuestIdx].totalStays += 1;
    guests[existingGuestIdx].totalSpent += quotation.grand_total;
  } else {
    guests.push({
      id: `gst-${Date.now()}`,
      resortId,
      name: quotation.guest_name,
      phone: quotation.guest_phone,
      email: quotation.guest_email,
      totalStays: 1,
      totalSpent: quotation.grand_total,
      createdAt: new Date().toISOString(),
    });
  }
  const targetGuest = existingGuestIdx >= 0 ? guests[existingGuestIdx] : guests[guests.length - 1];
  setDbItem(DB_KEYS.GUESTS, guests);

  // Update Quotation status to Accepted and link booking
  updateQuotation(
    quotationId,
    { status: 'Accepted', converted_booking_id: bookingId, booking_id: bookingId },
    resortId,
    currentUser
  );

  // If linked to a lead, update lead to Booked
  if (quotation.lead_id) {
    updateLead(
      quotation.lead_id,
      { status: 'Booked', converted_booking_id: bookingId },
      resortId,
      currentUser
    );
    addLeadActivity(quotation.lead_id, resortId, {
      actor_name: currentUser?.name || 'Sales Staff',
      actor_role: currentUser?.role || 'Staff',
      type: 'booking_converted',
      title: 'Quotation Converted to Booking',
      description: `Reservation ${bookingId} confirmed from accepted proposal ${quotation.quotation_number} (₹${quotation.grand_total.toLocaleString('en-IN')}).`,
    });
  }

  return { success: true, booking: newBooking, guest: targetGuest };
}
