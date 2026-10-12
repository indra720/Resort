import { LeadFollowUp, Lead } from '@/types/crm';
import { User } from '@/types';
import { getDbItem, setDbItem, DB_KEYS } from './db';
import { updateLead, addLeadActivity } from './leads';

/**
 * Returns today's date formatted as YYYY-MM-DD in local time
 */
export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Computes the due category for a follow-up item dynamically.
 */
export function computeDueCategory(
  followUp: LeadFollowUp,
  todayStr: string = getTodayDateString()
): 'today' | 'overdue' | 'upcoming' | 'done' {
  if (followUp.status === 'completed') {
    return 'done';
  }

  // Extract YYYY-MM-DD from due_date or scheduled_at
  let dateStr = followUp.due_date;
  if (!dateStr && followUp.scheduled_at) {
    if (followUp.scheduled_at.includes('T')) {
      dateStr = followUp.scheduled_at.split('T')[0];
    } else if (followUp.scheduled_at.toLowerCase().includes('today')) {
      return 'today';
    } else if (followUp.scheduled_at.toLowerCase().includes('tomorrow')) {
      return 'upcoming';
    } else if (followUp.scheduled_at.toLowerCase().includes('yesterday')) {
      return 'overdue';
    } else {
      // Try parsing date string like "09 Oct 2026"
      const parsed = Date.parse(followUp.scheduled_at);
      if (!isNaN(parsed)) {
        const d = new Date(parsed);
        dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
          d.getDate()
        ).padStart(2, '0')}`;
      }
    }
  }

  if (!dateStr) {
    return 'today';
  }

  if (dateStr < todayStr) return 'overdue';
  if (dateStr === todayStr) return 'today';
  return 'upcoming';
}

/**
 * Fetch all follow-ups for a given resort, respecting RBAC for Sales Executive.
 */
export function getFollowUps(
  resortId: string,
  currentUser?: User | null,
  activeFilterTab?: 'all' | 'today' | 'overdue' | 'upcoming' | 'done'
): LeadFollowUp[] {
  const followUps = getDbItem<LeadFollowUp[]>(DB_KEYS.FOLLOWUPS, []);
  const leads = getDbItem<Lead[]>(DB_KEYS.LEADS, []);
  const todayStr = getTodayDateString();

  // 1. Filter by resort
  let list = followUps.filter((f) => f.resort_id === resortId);

  // 2. Sales Executive sees ONLY assigned follow-ups
  if (currentUser && currentUser.role === 'Sales Executive') {
    const currentName = currentUser.name.trim().toLowerCase();
    list = list.filter((f) => f.assigned_to.trim().toLowerCase() === currentName);
  }

  // 3. Hydrate lead name, phone, and dynamic due_category
  const hydrated = list.map((f) => {
    const matchedLead = leads.find((l) => l.id === f.lead_id);
    const category = computeDueCategory(f, todayStr);

    return {
      ...f,
      lead_name: f.lead_name || matchedLead?.name || 'Inquiring Guest',
      lead_phone: f.lead_phone || matchedLead?.phone || '+91 98000 00000',
      due_category: category,
      priority: f.priority || 'Medium',
    };
  });

  // 4. Tab filter if provided
  if (activeFilterTab && activeFilterTab !== 'all') {
    return hydrated.filter((f) => f.due_category === activeFilterTab);
  }

  // Sort: Overdue first, then Today, then Upcoming, then Done
  const orderWeights: Record<string, number> = { overdue: 1, today: 2, upcoming: 3, done: 4 };
  return hydrated.sort(
    (a, b) => (orderWeights[a.due_category || 'today'] || 5) - (orderWeights[b.due_category || 'today'] || 5)
  );
}

/**
 * Get dynamic counts for header badges & tabs
 */
export function getFollowUpCounts(
  resortId: string,
  currentUser?: User | null
): { all: number; today: number; overdue: number; upcoming: number; done: number } {
  const allFollowUps = getFollowUps(resortId, currentUser, 'all');

  return {
    all: allFollowUps.length,
    today: allFollowUps.filter((f) => f.due_category === 'today').length,
    overdue: allFollowUps.filter((f) => f.due_category === 'overdue').length,
    upcoming: allFollowUps.filter((f) => f.due_category === 'upcoming').length,
    done: allFollowUps.filter((f) => f.due_category === 'done').length,
  };
}

/**
 * Schedule a new follow-up
 */
export function createFollowUp(
  data: Omit<LeadFollowUp, 'id' | 'resort_id' | 'created_at' | 'status'>,
  resortId: string,
  currentUser?: User | null
): LeadFollowUp {
  const followUps = getDbItem<LeadFollowUp[]>(DB_KEYS.FOLLOWUPS, []);
  const leads = getDbItem<Lead[]>(DB_KEYS.LEADS, []);
  const matchedLead = leads.find((l) => l.id === data.lead_id);

  const newFollowUp: LeadFollowUp = {
    ...data,
    id: `flp-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    resort_id: resortId,
    lead_name: data.lead_name || matchedLead?.name,
    lead_phone: data.lead_phone || matchedLead?.phone,
    status: 'pending',
    created_at: new Date().toISOString(),
  };

  setDbItem(DB_KEYS.FOLLOWUPS, [newFollowUp, ...followUps]);

  // Update lead's next_followup_at
  const displayTime = data.due_time ? `${data.due_date}, ${data.due_time}` : data.scheduled_at;
  updateLead(data.lead_id, { next_followup_at: displayTime }, resortId, currentUser);

  // Log activity
  addLeadActivity(data.lead_id, resortId, {
    actor_name: currentUser?.name || 'Staff',
    actor_role: currentUser?.role || 'Staff',
    type: 'followup',
    title: `Follow-up Scheduled (${data.channel.toUpperCase()})`,
    description: `${data.title} set for ${displayTime}. Assigned: ${data.assigned_to}.`,
  });

  return newFollowUp;
}

/**
 * Mark a follow-up as completed / done
 */
export function completeFollowUp(
  followUpId: string,
  resortId: string,
  currentUser?: User | null
): boolean {
  const followUps = getDbItem<LeadFollowUp[]>(DB_KEYS.FOLLOWUPS, []);
  const idx = followUps.findIndex((f) => f.id === followUpId && f.resort_id === resortId);
  if (idx === -1) return false;

  const target = followUps[idx];
  followUps[idx] = { ...target, status: 'completed' };
  setDbItem(DB_KEYS.FOLLOWUPS, followUps);

  // Log activity
  addLeadActivity(target.lead_id, resortId, {
    actor_name: currentUser?.name || 'Staff',
    actor_role: currentUser?.role || 'Staff',
    type: 'followup',
    title: 'Follow-up Marked Done',
    description: `Completed: ${target.title} (${target.channel.toUpperCase()})`,
  });

  return true;
}

/**
 * Reschedule an existing follow-up
 */
export function rescheduleFollowUp(
  followUpId: string,
  newDate: string,
  newTime: string,
  resortId: string,
  currentUser?: User | null
): boolean {
  const followUps = getDbItem<LeadFollowUp[]>(DB_KEYS.FOLLOWUPS, []);
  const idx = followUps.findIndex((f) => f.id === followUpId && f.resort_id === resortId);
  if (idx === -1) return false;

  const target = followUps[idx];
  const newScheduledAt = `${newDate}, ${newTime}`;
  followUps[idx] = {
    ...target,
    due_date: newDate,
    due_time: newTime,
    scheduled_at: newScheduledAt,
    status: 'pending',
  };
  setDbItem(DB_KEYS.FOLLOWUPS, followUps);

  // Update lead
  updateLead(target.lead_id, { next_followup_at: newScheduledAt }, resortId, currentUser);

  // Log activity
  addLeadActivity(target.lead_id, resortId, {
    actor_name: currentUser?.name || 'Staff',
    actor_role: currentUser?.role || 'Staff',
    type: 'followup',
    title: 'Follow-up Rescheduled',
    description: `Rescheduled to ${newScheduledAt}.`,
  });

  return true;
}

/**
 * Schedule Site Visit:
 * 1. Sets lead status to 'Site Visit'
 * 2. Creates a follow-up of channel 'site_visit'
 * 3. Logs activity
 */
export function scheduleSiteVisit(
  leadId: string,
  visitDetails: {
    dateTime: string; // "YYYY-MM-DDTHH:mm" or "YYYY-MM-DD"
    assignedTo: string;
    notes?: string;
  },
  resortId: string,
  currentUser?: User | null
): { success: boolean; followUp?: LeadFollowUp; error?: string } {
  const leads = getDbItem<Lead[]>(DB_KEYS.LEADS, []);
  const lead = leads.find((l) => l.id === leadId && l.resort_id === resortId);
  if (!lead) {
    return { success: false, error: 'Lead not found.' };
  }

  // 1. Advance lead status to 'Site Visit'
  updateLead(leadId, { status: 'Site Visit', assigned_to: visitDetails.assignedTo }, resortId, currentUser);

  // 2. Create follow-up
  const parts = visitDetails.dateTime.split('T');
  const dateStr = parts[0];
  const timeStr = parts[1] || '11:00 AM';

  const followUp = createFollowUp(
    {
      lead_id: leadId,
      lead_name: lead.name,
      lead_phone: lead.phone,
      title: `Site Inspection & Resort Tour for ${lead.name}`,
      channel: 'site_visit',
      scheduled_at: `${dateStr}, ${timeStr}`,
      due_date: dateStr,
      due_time: timeStr,
      assigned_to: visitDetails.assignedTo,
      notes: visitDetails.notes || 'Guide guest through banquet hall, villas, and amenities.',
      priority: 'High',
    },
    resortId,
    currentUser
  );

  // 3. Log activity
  addLeadActivity(leadId, resortId, {
    actor_name: currentUser?.name || 'Sales Staff',
    actor_role: currentUser?.role || 'Staff',
    type: 'status_change',
    title: 'Site Visit Confirmed',
    description: `Site visit scheduled for ${dateStr} at ${timeStr}. Assigned to ${visitDetails.assignedTo}.`,
  });

  return { success: true, followUp };
}
