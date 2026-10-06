import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO, isValid } from 'date-fns';

/**
 * Merge class names safely with tailwind-merge and clsx.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format any Date or ISO string to standard format: "DD MMM YYYY" (e.g., "06 Oct 2026")
 */
export function formatDate(dateInput: Date | string | number | null | undefined): string {
  if (!dateInput) return '-';

  try {
    const date = typeof dateInput === 'string' ? parseISO(dateInput) : new Date(dateInput);
    if (!isValid(date)) return '-';
    return format(date, 'dd MMM yyyy');
  } catch {
    return '-';
  }
}

/**
 * Format date with time: "DD MMM YYYY, hh:mm a" (e.g., "06 Oct 2026, 02:30 PM")
 */
export function formatDateTime(dateInput: Date | string | number | null | undefined): string {
  if (!dateInput) return '-';

  try {
    const date = typeof dateInput === 'string' ? parseISO(dateInput) : new Date(dateInput);
    if (!isValid(date)) return '-';
    return format(date, 'dd MMM yyyy, hh:mm a');
  } catch {
    return '-';
  }
}

/**
 * Format time only: "hh:mm a" (e.g., "02:30 PM")
 */
export function formatTime(dateInput: Date | string | number | null | undefined): string {
  if (!dateInput) return '-';

  try {
    const date = typeof dateInput === 'string' ? parseISO(dateInput) : new Date(dateInput);
    if (!isValid(date)) return '-';
    return format(date, 'hh:mm a');
  } catch {
    return '-';
  }
}

/**
 * Calculate Indian Goods & Services Tax (GST) for hospitality/resort billing.
 * Rates: 12% (rooms under ₹7,500 / F&B) or 18% (luxury rooms ₹7,500+).
 */
export interface GSTBreakup {
  baseAmount: number;
  gstRate: number;
  cgstAmount: number; // Half of total GST
  sgstAmount: number; // Half of total GST
  totalGst: number;
  totalWithGst: number;
}

export function calculateGST(baseAmount: number, rate: 12 | 18 = 12): GSTBreakup {
  const safeBase = Math.max(0, baseAmount);
  const totalGst = Math.round((safeBase * rate) / 100);
  const halfGst = Math.round(totalGst / 2);

  return {
    baseAmount: safeBase,
    gstRate: rate,
    cgstAmount: halfGst,
    sgstAmount: totalGst - halfGst, // accounts for any odd rupee rounding
    totalGst: totalGst,
    totalWithGst: safeBase + totalGst,
  };
}
