import { MessageTemplate, TemplateChannel, TemplateCategory, Lead } from '@/types/crm';
import { User } from '@/types';
import { getDbItem, setDbItem, DB_KEYS } from './db';
import { addLeadActivity } from './leads';

/**
 * Extracts variable names from template text (e.g. {guest_name} -> 'guest_name')
 */
export function extractVariables(content: string): string[] {
  const matches = content.match(/\{([a-zA-Z0-9_]+)\}/g);
  if (!matches) return [];
  const unique = Array.from(new Set(matches.map((m) => m.slice(1, -1))));
  return unique;
}

/**
 * Interpolates variables into a template string
 */
export function interpolateTemplate(
  content: string,
  values: Record<string, string | number | undefined>
): string {
  let result = content;
  Object.keys(values).forEach((key) => {
    const val = values[key];
    const replacement = val !== undefined && val !== null ? String(val) : `{${key}}`;
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), replacement);
  });
  return result;
}

/**
 * Get templates for a resort
 */
export function getTemplates(
  resortId: string,
  channelFilter?: TemplateChannel | 'ALL',
  categoryFilter?: TemplateCategory | 'ALL'
): MessageTemplate[] {
  const list = getDbItem<MessageTemplate[]>(DB_KEYS.TEMPLATES, []);
  let filtered = list.filter((t) => t.resort_id === resortId);

  if (channelFilter && channelFilter !== 'ALL') {
    filtered = filtered.filter((t) => t.channel === channelFilter);
  }

  if (categoryFilter && categoryFilter !== 'ALL') {
    filtered = filtered.filter((t) => t.category === categoryFilter);
  }

  return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

/**
 * Get single template by ID
 */
export function getTemplateById(id: string, resortId: string): MessageTemplate | null {
  const list = getDbItem<MessageTemplate[]>(DB_KEYS.TEMPLATES, []);
  return list.find((t) => t.id === id && t.resort_id === resortId) || null;
}

/**
 * Create a new message template
 */
export function createTemplate(
  data: Omit<MessageTemplate, 'id' | 'resort_id' | 'created_at' | 'variables'>,
  resortId: string
): { success: boolean; template?: MessageTemplate; error?: string } {
  const list = getDbItem<MessageTemplate[]>(DB_KEYS.TEMPLATES, []);

  const variables = extractVariables(data.content);
  const newTemplate: MessageTemplate = {
    ...data,
    id: `tmpl-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    resort_id: resortId,
    variables,
    created_at: new Date().toISOString(),
  };

  setDbItem(DB_KEYS.TEMPLATES, [newTemplate, ...list]);
  return { success: true, template: newTemplate };
}

/**
 * Update an existing template
 */
export function updateTemplate(
  id: string,
  updates: Partial<Omit<MessageTemplate, 'id' | 'resort_id' | 'created_at'>>,
  resortId: string
): { success: boolean; error?: string } {
  const list = getDbItem<MessageTemplate[]>(DB_KEYS.TEMPLATES, []);
  const idx = list.findIndex((t) => t.id === id && t.resort_id === resortId);
  if (idx === -1) return { success: false, error: 'Template not found' };

  const current = list[idx];
  const newContent = updates.content !== undefined ? updates.content : current.content;
  const variables = extractVariables(newContent);

  list[idx] = {
    ...current,
    ...updates,
    variables,
  };

  setDbItem(DB_KEYS.TEMPLATES, list);
  return { success: true };
}

/**
 * Delete a template
 */
export function deleteTemplate(id: string, resortId: string): boolean {
  const list = getDbItem<MessageTemplate[]>(DB_KEYS.TEMPLATES, []);
  const filtered = list.filter((t) => !(t.id === id && t.resort_id === resortId));
  if (filtered.length === list.length) return false;
  setDbItem(DB_KEYS.TEMPLATES, filtered);
  return true;
}

/**
 * Send template message to lead (Mock dispatch + timeline activity log)
 */
export function sendTemplateToLead(
  leadId: string,
  templateId: string,
  resortId: string,
  resortName: string,
  currentUser?: User | null,
  overrideVariables?: Record<string, string>
): { success: boolean; renderedMessage?: string; error?: string } {
  const template = getTemplateById(templateId, resortId);
  if (!template) return { success: false, error: 'Template not found' };

  const leads = getDbItem<Lead[]>(DB_KEYS.LEADS, []);
  const lead = leads.find((l) => l.id === leadId && l.resort_id === resortId);
  if (!lead) return { success: false, error: 'Lead not found' };

  const defaultValues: Record<string, string> = {
    guest_name: lead.name,
    resort_name: resortName,
    dates: lead.preferred_date || 'Upcoming Weekend',
    amount: lead.budget_max ? lead.budget_max.toLocaleString('en-IN') : 'Customized',
    quotation_link: `https://joyresorts.com/quote/${lead.lead_code}`,
    contact_number: '+91 98200 11223',
    ...overrideVariables,
  };

  const rendered = interpolateTemplate(template.content, defaultValues);

  // Log on lead activity timeline
  addLeadActivity(leadId, resortId, {
    actor_name: currentUser?.name || 'Sales Staff',
    actor_role: currentUser?.role || 'Staff',
    type: template.channel === 'whatsapp' ? 'whatsapp' : template.channel === 'email' ? 'email' : 'note',
    title: `Template Dispatched: ${template.name}`,
    description: `Sent ${template.channel.toUpperCase()} message: "${rendered.slice(0, 120)}${rendered.length > 120 ? '...' : ''}"`,
  });

  return { success: true, renderedMessage: rendered };
}
