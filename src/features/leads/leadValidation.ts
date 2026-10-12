import { z } from 'zod';
import { InterestedInType, LeadSource, LeadPriority, LeadStatus, LeadScore } from '@/types/crm';

export const leadFormSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    phone: z
      .string()
      .min(10, 'Mobile number must be at least 10 digits')
      .refine(
        (val) => {
          const digits = val.replace(/\D/g, '');
          const last10 = digits.length > 10 ? digits.slice(-10) : digits;
          // Standard Indian 10-digit mobile starts with 6, 7, 8, or 9
          return /^[6-9]\d{9}$/.test(last10);
        },
        {
          message: 'Please enter a valid 10-digit Indian mobile number (starts with 6, 7, 8, or 9)',
        }
      ),
    email: z.string().email('Please enter a valid email address'),
    city: z.string().min(2, 'City is required'),
    interested_in: z.enum([
      'Weekend Stay',
      'Family Stay',
      'Luxury Stay',
      'Wedding',
      'Corporate Event',
      'Nature Camp',
      'Team Outing',
      'Adventure Activities',
      'Conference',
    ] as [InterestedInType, ...InterestedInType[]]),
    guests_adults: z.coerce.number().min(1, 'At least 1 adult guest is required'),
    guests_children: z.coerce.number().min(0, 'Children cannot be negative'),
    preferred_date: z.string().min(1, 'Preferred date is required'),
    budget_min: z.coerce.number().min(0, 'Budget Min must be at least 0'),
    budget_max: z.coerce.number().min(0, 'Budget Max must be at least 0'),
    source: z.enum([
      'Website',
      'Instagram',
      'Facebook',
      'Google Ads',
      'Walk-in',
      'Referral',
      'Travel Agent',
      'MakeMyTrip',
      'LinkedIn',
      'Other',
    ] as [LeadSource, ...LeadSource[]]),
    priority: z.enum(['Low', 'Medium', 'High', 'Urgent'] as [LeadPriority, ...LeadPriority[]]),
    status: z.enum(['New', 'Contacted', 'Site Visit', 'Interested', 'Booked', 'Lost'] as [
      LeadStatus,
      ...LeadStatus[],
    ]),
    score: z.enum(['Hot', 'Warm', 'Cold'] as [LeadScore, ...LeadScore[]]).optional(),
    tags: z.string().optional(), // Comma-separated in form
    assigned_to: z.string().min(2, 'Assignee is required'),
    remarks: z.string().optional(),
    lost_reason: z.string().optional(),
  })
  .refine((data) => data.budget_min <= data.budget_max, {
    message: 'Budget Min cannot exceed Budget Max',
    path: ['budget_min'],
  })
  .refine(
    (data) => {
      if (data.status === 'Lost' && (!data.lost_reason || data.lost_reason.trim() === '')) {
        return false;
      }
      return true;
    },
    {
      message: 'Lost reason is required when status is Lost',
      path: ['lost_reason'],
    }
  );

export type LeadFormData = z.infer<typeof leadFormSchema>;
