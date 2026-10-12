import { Lead } from '@/types/crm';

/**
 * Escapes a field for CSV format
 */
function escapeCSV(val: any): string {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

/**
 * Client-side CSV export for Leads list
 */
export function exportLeadsToCSV(leads: Lead[], resortName: string = 'Joy Resorts'): void {
  const headers = [
    'Lead Code',
    'Guest Name',
    'Mobile Phone',
    'Email Address',
    'City',
    'Interested In',
    'Adults',
    'Children',
    'Preferred Date',
    'Budget Min (INR)',
    'Budget Max (INR)',
    'Lead Source',
    'Status',
    'Priority',
    'Lead Score',
    'Assigned Executive',
    'Tags',
    'Remarks',
    'Created Date',
  ];

  const rows = leads.map((l) => [
    escapeCSV(l.lead_code),
    escapeCSV(l.name),
    escapeCSV(l.phone),
    escapeCSV(l.email),
    escapeCSV(l.city),
    escapeCSV(l.interested_in),
    escapeCSV(l.guests_adults),
    escapeCSV(l.guests_children),
    escapeCSV(l.preferred_date),
    escapeCSV(l.budget_min),
    escapeCSV(l.budget_max),
    escapeCSV(l.source),
    escapeCSV(l.status),
    escapeCSV(l.priority),
    escapeCSV(l.score),
    escapeCSV(l.assigned_to),
    escapeCSV(l.tags ? l.tags.join(', ') : ''),
    escapeCSV(l.remarks || ''),
    escapeCSV(l.created_at),
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

  // Trigger browser file download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const dateStr = new Date().toISOString().split('T')[0];
  const cleanResortName = resortName.toLowerCase().replace(/[^a-z0-9]/g, '_');

  link.setAttribute('href', url);
  link.setAttribute('download', `${cleanResortName}_leads_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generates sample CSV template for users to download
 */
export function downloadSampleCSVTemplate(): void {
  const sampleHeaders = [
    'Name',
    'Phone',
    'Email',
    'City',
    'Interested In',
    'Adults',
    'Children',
    'Preferred Date',
    'Budget Min',
    'Budget Max',
    'Source',
    'Assigned To',
    'Remarks',
  ];

  const sampleRows = [
    [
      '"Vikram Malhotra"',
      '"9820011223"',
      '"vikram.m@gmail.com"',
      '"Mumbai"',
      '"Weekend Stay"',
      '2',
      '1',
      '"2026-11-20"',
      '35000',
      '50000',
      '"Website"',
      '"Sameer Verma"',
      '"Looking for lake-view cottage with breakfast"',
    ],
    [
      '"Kavita Iyer"',
      '"9841122998"',
      '"kavita.iyer@outlook.com"',
      '"Chennai"',
      '"Luxury Stay"',
      '4',
      '0',
      '"2026-12-05"',
      '75000',
      '95000',
      '"Instagram"',
      '"Neha Gupta"',
      '"Celebration stay for family anniversary"',
    ],
  ];

  const csvContent = [sampleHeaders.join(','), ...sampleRows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'sample_joy_resorts_leads_template.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
