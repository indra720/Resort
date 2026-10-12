import {
  Lead,
  LeadStatus,
  LeadActivity,
  LeadNote,
  LeadFollowUp,
  GuestRecord,
  CRMStats,
} from '@/types/crm';
import { User } from '@/types';
import { getDbItem, setDbItem, DB_KEYS } from './db';
import { BookingRecord, createBooking } from './bookingsApi';
import { getRooms, setRoomStatusByNumber } from './roomsApi';
import { formatCompactINR } from '@/lib/formatINR';

/**
 * Normalizes phone number to 10-digit standard Indian format for comparison
 */
export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  return digits.length > 10 ? digits.slice(-10) : digits;
}

/**
 * Normalizes email address
 */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Checks for duplicate lead by phone or email within the same resort tenant.
 */
export function checkDuplicateLead(
  phone: string,
  email: string,
  resortId: string,
  excludeLeadId?: string
): { isDuplicate: boolean; existingLead?: Lead; matchField?: 'phone' | 'email' } {
  const leads = getDbItem<Lead[]>(DB_KEYS.LEADS, []);
  const cleanPhone = normalizePhone(phone);
  const cleanEmail = normalizeEmail(email);

  const resortLeads = leads.filter(
    (l) => l.resort_id === resortId && (!excludeLeadId || l.id !== excludeLeadId)
  );

  for (const l of resortLeads) {
    if (cleanPhone && normalizePhone(l.phone) === cleanPhone) {
      return { isDuplicate: true, existingLead: l, matchField: 'phone' };
    }
    if (cleanEmail && normalizeEmail(l.email) === cleanEmail) {
      return { isDuplicate: true, existingLead: l, matchField: 'email' };
    }
  }

  return { isDuplicate: false };
}

/**
 * Fetch all leads for a given resort.
 * Sales Executive sees ONLY leads assigned to them.
 * Resort Owner, Manager, Super Admin, and Receptionist see all leads of the resort.
 */
export function getLeads(resortId: string, currentUser?: User | null): Lead[] {
  const leads = getDbItem<Lead[]>(DB_KEYS.LEADS, []);
  
  // Filter by resort_id
  let result = leads.filter((l) => l.resort_id === resortId);

  // Sales Executive RBAC filter strictly inside API
  if (currentUser && currentUser.role === 'Sales Executive') {
    const currentName = currentUser.name.trim().toLowerCase();
    result = result.filter(
      (l) => l.assigned_to.trim().toLowerCase() === currentName
    );
  }

  // Sort by most recent activity / creation date descending
  return result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

/**
 * Fetch a single lead by ID, respecting tenant and role isolation.
 */
export function getLeadById(
  id: string,
  resortId: string,
  currentUser?: User | null
): Lead | undefined {
  const leads = getLeads(resortId, currentUser);
  return leads.find((l) => l.id === id);
}

/**
 * Dynamic KPI stats & tab counts calculated strictly from the store.
 */
export function getLeadStats(resortId: string, currentUser?: User | null): CRMStats {
  const leads = getLeads(resortId, currentUser);

  const totalLeads = leads.length;
  const newEnquiries = leads.filter((l) => l.status === 'New').length;
  const siteVisits = leads.filter((l) => l.status === 'Site Visit').length;
  const bookings = leads.filter((l) => l.status === 'Booked').length;

  // Calculate revenue from booked leads (using actual budget or booked deal value)
  const revenue = leads
    .filter((l) => l.status === 'Booked')
    .reduce((sum, l) => sum + (l.budget_max || l.budget_min || 0), 0);

  const statusCounts: Record<string, number> = {
    all: totalLeads,
    New: newEnquiries,
    Contacted: leads.filter((l) => l.status === 'Contacted').length,
    'Site Visit': siteVisits,
    Interested: leads.filter((l) => l.status === 'Interested').length,
    Booked: bookings,
    Lost: leads.filter((l) => l.status === 'Lost').length,
  };

  return {
    totalLeads,
    totalLeadsTrend: '+12%',
    newEnquiries,
    newEnquiriesTrend: '+8%',
    siteVisits,
    siteVisitsTrend: '+15%',
    bookings,
    bookingsTrend: '+22%',
    revenue,
    revenueFormatted: formatCompactINR(revenue),
    revenueTrend: '+18%',
    statusCounts,
  };
}

/**
 * Create a new lead.
 */
export function createLead(
  leadData: Omit<Lead, 'id' | 'lead_code' | 'created_at' | 'last_activity_at' | 'resort_id'>,
  resortId: string,
  currentUser?: User | null
): { success: boolean; data?: Lead; error?: string } {
  // Check duplicates
  const dupCheck = checkDuplicateLead(leadData.phone, leadData.email, resortId);
  if (dupCheck.isDuplicate) {
    return {
      success: false,
      error: `Duplicate Lead Detected: ${dupCheck.existingLead?.name} already exists with matching ${dupCheck.matchField} (${dupCheck.existingLead?.phone}).`,
    };
  }

  const leads = getDbItem<Lead[]>(DB_KEYS.LEADS, []);
  const resortLeads = leads.filter((l) => l.resort_id === resortId);
  const nextNum = resortLeads.length + 1;
  const leadCode = `LEAD${String(nextNum).padStart(3, '0')}`;
  const now = new Date();

  const newLead: Lead = {
    ...leadData,
    id: `lead-${resortId}-${Date.now()}`,
    resort_id: resortId,
    lead_code: leadCode,
    created_at: now.toISOString(),
    last_activity_at: now.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }) + `, ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`,
  };

  setDbItem(DB_KEYS.LEADS, [newLead, ...leads]);

  // Log activity
  addLeadActivity(newLead.id, resortId, {
    actor_name: currentUser?.name || 'Reception Desk',
    actor_role: currentUser?.role || 'Receptionist',
    type: 'created',
    title: 'Lead Created',
    description: `Created new lead via ${newLead.source} for ${newLead.interested_in}.`,
  });

  return { success: true, data: newLead };
}

/**
 * Update an existing lead.
 */
export function updateLead(
  id: string,
  updates: Partial<Lead>,
  resortId: string,
  currentUser?: User | null
): { success: boolean; data?: Lead; error?: string } {
  const leads = getDbItem<Lead[]>(DB_KEYS.LEADS, []);
  const idx = leads.findIndex((l) => l.id === id && l.resort_id === resortId);

  if (idx === -1) {
    return { success: false, error: 'Lead not found or access denied.' };
  }

  const oldLead = leads[idx];

  // If phone or email changed, verify duplicate
  if (
    (updates.phone && updates.phone !== oldLead.phone) ||
    (updates.email && updates.email !== oldLead.email)
  ) {
    const dupCheck = checkDuplicateLead(
      updates.phone || oldLead.phone,
      updates.email || oldLead.email,
      resortId,
      id
    );
    if (dupCheck.isDuplicate) {
      return {
        success: false,
        error: `Another lead already has this ${dupCheck.matchField}: ${dupCheck.existingLead?.name}.`,
      };
    }
  }

  const now = new Date();
  const formattedNow =
    now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) +
    `, ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;

  const updatedLead: Lead = {
    ...oldLead,
    ...updates,
    last_activity_at: formattedNow,
  };

  leads[idx] = updatedLead;
  setDbItem(DB_KEYS.LEADS, leads);

  // Track status change activity
  if (updates.status && updates.status !== oldLead.status) {
    addLeadActivity(id, resortId, {
      actor_name: currentUser?.name || 'Staff',
      actor_role: currentUser?.role || 'Staff',
      type: 'status_change',
      title: `Status Changed to ${updates.status}`,
      description: `Lead moved from "${oldLead.status}" to "${updates.status}"${
        updates.lost_reason ? ` (Reason: ${updates.lost_reason})` : ''
      }.`,
    });
  }

  // Track assignment change activity
  if (updates.assigned_to && updates.assigned_to !== oldLead.assigned_to) {
    addLeadActivity(id, resortId, {
      actor_name: currentUser?.name || 'Staff',
      actor_role: currentUser?.role || 'Staff',
      type: 'assignment',
      title: 'Reassigned Executive',
      description: `Reassigned from ${oldLead.assigned_to} to ${updates.assigned_to}.`,
    });
  }

  return { success: true, data: updatedLead };
}

/**
 * Delete a lead.
 */
export function deleteLead(id: string, resortId: string): boolean {
  const leads = getDbItem<Lead[]>(DB_KEYS.LEADS, []);
  const filtered = leads.filter((l) => !(l.id === id && l.resort_id === resortId));
  if (filtered.length === leads.length) return false;

  setDbItem(DB_KEYS.LEADS, filtered);
  return true;
}

/**
 * Bulk update status for multiple leads.
 */
export function bulkUpdateLeadStatus(
  leadIds: string[],
  newStatus: LeadStatus,
  resortId: string,
  currentUser?: User | null
): number {
  let count = 0;
  for (const id of leadIds) {
    const res = updateLead(id, { status: newStatus }, resortId, currentUser);
    if (res.success) count++;
  }
  return count;
}

/**
 * Bulk assign leads to a sales executive.
 */
export function bulkAssignLeads(
  leadIds: string[],
  assigneeName: string,
  resortId: string,
  currentUser?: User | null
): number {
  let count = 0;
  for (const id of leadIds) {
    const res = updateLead(id, { assigned_to: assigneeName }, resortId, currentUser);
    if (res.success) count++;
  }
  return count;
}

/**
 * Convert Lead to Booking:
 * 1. Verifies room availability.
 * 2. Creates a Booking record in joy_bookings_data.
 * 3. Creates a Guest record in joy_guests_data.
 * 4. Sets lead status to 'Booked' and links booking ID.
 * 5. Logs activity.
 * (No invoice created here; invoice is generated at advance payment or check-out).
 */
export function convertLeadToBooking(
  leadId: string,
  bookingDetails: {
    roomNumber: string;
    checkIn: string; // YYYY-MM-DD
    checkOut: string; // YYYY-MM-DD
    totalAmount: number;
    gstAmount: number;
  },
  resortId: string,
  currentUser?: User | null
): { success: boolean; booking?: BookingRecord; guest?: GuestRecord; error?: string } {
  const leads = getDbItem<Lead[]>(DB_KEYS.LEADS, []);
  const leadIdx = leads.findIndex((l) => l.id === leadId && l.resort_id === resortId);

  if (leadIdx === -1) {
    return { success: false, error: 'Lead not found.' };
  }

  const lead = leads[leadIdx];

  // Room check
  const rooms = getRooms(resortId);
  const selectedRoom = rooms.find((r) => r.roomNumber === bookingDetails.roomNumber);
  if (!selectedRoom) {
    return { success: false, error: `Room ${bookingDetails.roomNumber} does not exist at this resort.` };
  }
  if (selectedRoom.status === 'Occupied' || selectedRoom.status === 'Maintenance') {
    return {
      success: false,
      error: `Room ${bookingDetails.roomNumber} is currently ${selectedRoom.status}. Please select an available room.`,
    };
  }

  // 1. Create Booking
  const newBooking = createBooking(
    {
      guestName: lead.name,
      guestPhone: lead.phone,
      guestEmail: lead.email,
      roomNumber: bookingDetails.roomNumber,
      checkIn: bookingDetails.checkIn,
      checkOut: bookingDetails.checkOut,
      totalAmount: bookingDetails.totalAmount,
      gstAmount: bookingDetails.gstAmount,
      paymentStatus: 'Pending',
      roomStatus: 'Reserved',
    },
    resortId
  );

  // Reserve the room
  setRoomStatusByNumber(bookingDetails.roomNumber, 'Reserved', resortId);

  // 2. Create / Link Guest record in joy_guests_data
  const guests = getDbItem<GuestRecord[]>(DB_KEYS.GUESTS, []);
  const existingGuestIdx = guests.findIndex(
    (g) => g.resortId === resortId && (normalizePhone(g.phone) === normalizePhone(lead.phone) || normalizeEmail(g.email) === normalizeEmail(lead.email))
  );

  let guestRecord: GuestRecord;
  if (existingGuestIdx >= 0) {
    guestRecord = {
      ...guests[existingGuestIdx],
      totalStays: guests[existingGuestIdx].totalStays + 1,
      totalSpent: guests[existingGuestIdx].totalSpent + bookingDetails.totalAmount,
      leadId: lead.id,
      leadSource: lead.source,
    };
    guests[existingGuestIdx] = guestRecord;
  } else {
    guestRecord = {
      id: `gst-${Date.now()}`,
      resortId,
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      city: lead.city,
      leadSource: lead.source,
      leadId: lead.id,
      totalStays: 1,
      totalSpent: bookingDetails.totalAmount,
      createdAt: new Date().toISOString(),
    };
    guests.unshift(guestRecord);
  }
  setDbItem(DB_KEYS.GUESTS, guests);

  // 3. Update Lead
  const updatedLead: Lead = {
    ...lead,
    status: 'Booked',
    converted_booking_id: newBooking.id,
    last_activity_at: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) + ', Just now',
  };
  leads[leadIdx] = updatedLead;
  setDbItem(DB_KEYS.LEADS, leads);

  // 4. Log Activity
  addLeadActivity(lead.id, resortId, {
    actor_name: currentUser?.name || 'Sales Desk',
    actor_role: currentUser?.role || 'Sales Executive',
    type: 'booking_converted',
    title: 'Converted to Booking',
    description: `Lead converted to confirmed booking #${newBooking.bookingCode} for Villa/Room ${bookingDetails.roomNumber} (Amount: ₹${bookingDetails.totalAmount.toLocaleString('en-IN')}).`,
  });

  return { success: true, booking: newBooking, guest: guestRecord };
}

// ==========================================
// LEAD ACTIVITIES
// ==========================================

export function getLeadActivities(leadId: string, resortId: string): LeadActivity[] {
  const activities = getDbItem<LeadActivity[]>(DB_KEYS.ACTIVITIES, []);
  return activities
    .filter((a) => a.lead_id === leadId && a.resort_id === resortId)
    .sort((a, b) => b.id.localeCompare(a.id));
}

export function addLeadActivity(
  leadId: string,
  resortId: string,
  activity: Omit<LeadActivity, 'id' | 'resort_id' | 'lead_id' | 'timestamp'>
): LeadActivity {
  const activities = getDbItem<LeadActivity[]>(DB_KEYS.ACTIVITIES, []);
  const now = new Date();
  const timestamp =
    now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) +
    `, ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;

  const newActivity: LeadActivity = {
    ...activity,
    id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    resort_id: resortId,
    lead_id: leadId,
    timestamp,
  };

  setDbItem(DB_KEYS.ACTIVITIES, [newActivity, ...activities]);
  return newActivity;
}

// ==========================================
// LEAD NOTES
// ==========================================

export function getLeadNotes(leadId: string, resortId: string): LeadNote[] {
  const notes = getDbItem<LeadNote[]>(DB_KEYS.NOTES, []);
  return notes
    .filter((n) => n.lead_id === leadId && n.resort_id === resortId)
    .sort((a, b) => b.id.localeCompare(a.id));
}

export function addLeadNote(
  leadId: string,
  resortId: string,
  content: string,
  currentUser?: User | null
): LeadNote {
  const notes = getDbItem<LeadNote[]>(DB_KEYS.NOTES, []);
  const now = new Date();
  const timestamp =
    now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) +
    `, ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;

  const newNote: LeadNote = {
    id: `not-${Date.now()}`,
    resort_id: resortId,
    lead_id: leadId,
    author_name: currentUser?.name || 'Staff Member',
    author_role: currentUser?.role || 'Sales Executive',
    content,
    created_at: timestamp,
  };

  setDbItem(DB_KEYS.NOTES, [newNote, ...notes]);

  // Log activity
  addLeadActivity(leadId, resortId, {
    actor_name: newNote.author_name,
    actor_role: newNote.author_role,
    type: 'note',
    title: 'Note Added',
    description: content.length > 60 ? `${content.slice(0, 60)}...` : content,
  });

  return newNote;
}

// ==========================================
// LEAD FOLLOW-UPS
// ==========================================

export function getLeadFollowUps(leadId: string, resortId: string): LeadFollowUp[] {
  const followUps = getDbItem<LeadFollowUp[]>(DB_KEYS.FOLLOWUPS, []);
  return followUps
    .filter((f) => f.lead_id === leadId && f.resort_id === resortId)
    .sort((a, b) => b.id.localeCompare(a.id));
}

export function addLeadFollowUp(
  leadId: string,
  resortId: string,
  followUp: Omit<LeadFollowUp, 'id' | 'resort_id' | 'lead_id' | 'created_at'>,
  currentUser?: User | null
): LeadFollowUp {
  const followUps = getDbItem<LeadFollowUp[]>(DB_KEYS.FOLLOWUPS, []);
  const newFollowUp: LeadFollowUp = {
    ...followUp,
    id: `flp-${Date.now()}`,
    resort_id: resortId,
    lead_id: leadId,
    created_at: new Date().toISOString(),
  };

  setDbItem(DB_KEYS.FOLLOWUPS, [newFollowUp, ...followUps]);

  // Update lead's next_followup_at
  updateLead(leadId, { next_followup_at: followUp.scheduled_at }, resortId, currentUser);

  // Log activity
  addLeadActivity(leadId, resortId, {
    actor_name: currentUser?.name || 'Staff',
    actor_role: currentUser?.role || 'Staff',
    type: 'followup',
    title: `Follow-up Scheduled (${followUp.channel.toUpperCase()})`,
    description: `${followUp.title} set for ${followUp.scheduled_at}.`,
  });

  return newFollowUp;
}

export function completeLeadFollowUp(
  followUpId: string,
  resortId: string,
  currentUser?: User | null
): boolean {
  const followUps = getDbItem<LeadFollowUp[]>(DB_KEYS.FOLLOWUPS, []);
  const idx = followUps.findIndex((f) => f.id === followUpId && f.resort_id === resortId);
  if (idx === -1) return false;

  followUps[idx] = { ...followUps[idx], status: 'completed' };
  setDbItem(DB_KEYS.FOLLOWUPS, followUps);

  // Log activity
  addLeadActivity(followUps[idx].lead_id, resortId, {
    actor_name: currentUser?.name || 'Staff',
    actor_role: currentUser?.role || 'Staff',
    type: 'followup',
    title: 'Follow-up Marked Completed',
    description: `Completed: ${followUps[idx].title}`,
  });

  return true;
}
