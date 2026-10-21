import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, AlertCircle, Sparkles, UserPlus, Save, AlertTriangle } from 'lucide-react';
import { Lead, InterestedInType, LeadSource, LeadPriority, LeadStatus, LeadScore } from '@/types/crm';
import { leadFormSchema, LeadFormData } from './leadValidation';
import { useAuthStore } from '@/store/useAuthStore';
import { checkDuplicateLead } from '@/api/leads';
import { toast } from '@/store/useToastStore';

export interface AddEditLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadToEdit?: Lead | null;
  onSubmitLead: (data: LeadFormData) => void;
}

export const AddEditLeadModal: React.FC<AddEditLeadModalProps> = ({
  isOpen,
  onClose,
  leadToEdit,
  onSubmitLead,
}) => {
  const { currentResort, role, user } = useAuthStore();
  const [duplicateWarning, setDuplicateWarning] = useState<{
    name: string;
    phone: string;
    field: string;
  } | null>(null);

  const defaultAssignee = role === 'Sales Executive' ? (user?.name || 'Sameer Verma') : 'Sameer Verma';

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      city: 'Mumbai',
      interested_in: 'Weekend Stay',
      guests_adults: 2,
      guests_children: 0,
      preferred_date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      budget_min: 30000,
      budget_max: 50000,
      source: role === 'Receptionist' ? 'Walk-in' : 'Website',
      priority: 'Medium',
      status: 'New',
      score: 'Warm',
      tags: 'Nature, Family',
      assigned_to: defaultAssignee,
      remarks: '',
      lost_reason: '',
    },
  });

  // Watch status to dynamically show/require lost_reason
  const currentStatus = watch('status');
  const watchedPhone = watch('phone');
  const watchedEmail = watch('email');

  useEffect(() => {
    if (leadToEdit) {
      reset({
        name: leadToEdit.name,
        phone: leadToEdit.phone,
        email: leadToEdit.email,
        city: leadToEdit.city.replace(', India', ''),
        interested_in: leadToEdit.interested_in,
        guests_adults: leadToEdit.guests_adults,
        guests_children: leadToEdit.guests_children,
        preferred_date: leadToEdit.preferred_date,
        budget_min: leadToEdit.budget_min,
        budget_max: leadToEdit.budget_max,
        source: leadToEdit.source,
        priority: leadToEdit.priority,
        status: leadToEdit.status,
        score: leadToEdit.score,
        tags: leadToEdit.tags.join(', '),
        assigned_to: leadToEdit.assigned_to,
        remarks: leadToEdit.remarks || '',
        lost_reason: leadToEdit.lost_reason || '',
      });
    } else {
      reset({
        name: '',
        phone: '',
        email: '',
        city: 'Mumbai',
        interested_in: 'Weekend Stay',
        guests_adults: 2,
        guests_children: 0,
        preferred_date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        budget_min: 30000,
        budget_max: 50000,
        source: role === 'Receptionist' ? 'Walk-in' : 'Website',
        priority: 'Medium',
        status: 'New',
        score: 'Warm',
        tags: 'Nature, Family',
        assigned_to: defaultAssignee,
        remarks: '',
        lost_reason: '',
      });
    }
    setDuplicateWarning(null);
  }, [leadToEdit, isOpen, reset, role, defaultAssignee]);

  // Check duplicate on blur / change
  const handleCheckDuplicate = () => {
    if (!watchedPhone && !watchedEmail) return;
    const dup = checkDuplicateLead(
      watchedPhone || '',
      watchedEmail || '',
      currentResort.id,
      leadToEdit?.id
    );
    if (dup.isDuplicate && dup.existingLead) {
      setDuplicateWarning({
        name: dup.existingLead.name,
        phone: dup.existingLead.phone,
        field: dup.matchField || 'phone',
      });
    } else {
      setDuplicateWarning(null);
    }
  };

  const onFormSubmit = (data: LeadFormData) => {
    onSubmitLead(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-3xl lg:max-w-4xl p-6 sm:p-8 shadow-2xl border border-[#E2E8F0] my-auto text-left text-xs text-[#0F172A] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-emerald-50 text-[#0F5132] border border-emerald-200 flex items-center justify-center">
                <UserPlus className="w-4 h-4" />
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#0F172A]">
                {leadToEdit
                  ? `Edit Lead: ${leadToEdit.lead_code}`
                  : role === 'Receptionist'
                  ? 'Add Walk-in Lead'
                  : 'Add New Sales Lead'}
              </h2>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              Property context: <strong className="text-[#0F5132]">{currentResort.name}</strong>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#F1F5F9] flex items-center justify-center text-[#64748B] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Duplicate Warning Banner */}
        {duplicateWarning && (
          <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold">Duplicate Detected:</span> A lead for{' '}
              <strong>{duplicateWarning.name}</strong> ({duplicateWarning.phone}) already exists in{' '}
              {currentResort.name}. Please verify before creating another duplicate record.
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          {/* Row 1: Guest Name & City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">Guest Full Name *</label>
              <input
                type="text"
                placeholder="e.g. Dr. Siddharth Rao"
                {...register('name')}
                className={`w-full h-9 px-3 bg-[#F8FAFC] border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30 ${
                  errors.name ? 'border-rose-400 bg-rose-50/30' : 'border-[#CBD5E1]'
                }`}
              />
              {errors.name && <p className="text-[11px] text-rose-600 mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">City / Location *</label>
              <input
                type="text"
                placeholder="e.g. Mumbai, Delhi, Bengaluru"
                {...register('city')}
                className={`w-full h-9 px-3 bg-[#F8FAFC] border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30 ${
                  errors.city ? 'border-rose-400 bg-rose-50/30' : 'border-[#CBD5E1]'
                }`}
              />
              {errors.city && <p className="text-[11px] text-rose-600 mt-1">{errors.city.message}</p>}
            </div>
          </div>

          {/* Row 2: Contact Phone & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">
                Indian Mobile Number (10 digits) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#64748B]">
                  +91
                </span>
                <input
                  type="tel"
                  placeholder="9876543210"
                  {...register('phone')}
                  onBlur={handleCheckDuplicate}
                  className={`w-full h-9 pl-11 pr-3 bg-[#F8FAFC] border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30 ${
                    errors.phone ? 'border-rose-400 bg-rose-50/30' : 'border-[#CBD5E1]'
                  }`}
                />
              </div>
              {errors.phone && <p className="text-[11px] text-rose-600 mt-1">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">Email Address *</label>
              <input
                type="email"
                placeholder="siddharth@gmail.com"
                {...register('email')}
                onBlur={handleCheckDuplicate}
                className={`w-full h-9 px-3 bg-[#F8FAFC] border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30 ${
                  errors.email ? 'border-rose-400 bg-rose-50/30' : 'border-[#CBD5E1]'
                }`}
              />
              {errors.email && <p className="text-[11px] text-rose-600 mt-1">{errors.email.message}</p>}
            </div>
          </div>

          {/* Row 3: Interested Stay & Preferred Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">Interested In *</label>
              <select
                {...register('interested_in')}
                className="w-full h-9 px-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30"
              >
                <option value="Weekend Stay">Weekend Stay</option>
                <option value="Family Stay">Family Stay</option>
                <option value="Luxury Stay">Luxury Stay</option>
                <option value="Wedding">Wedding</option>
                <option value="Corporate Event">Corporate Event</option>
                <option value="Nature Camp">Nature Camp</option>
                <option value="Team Outing">Team Outing</option>
                <option value="Adventure Activities">Adventure Activities</option>
                <option value="Conference">Conference</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">Preferred Date *</label>
              <input
                type="date"
                {...register('preferred_date')}
                className="w-full h-9 px-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-[#1E293B] mb-1">Adults *</label>
                <input
                  type="number"
                  min="1"
                  {...register('guests_adults')}
                  className="w-full h-9 px-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#1E293B] mb-1">Kids</label>
                <input
                  type="number"
                  min="0"
                  {...register('guests_children')}
                  className="w-full h-9 px-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs"
                />
              </div>
            </div>
          </div>

          {/* Row 4: Budget Min & Max (₹) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">Budget Min (₹ INR) *</label>
              <input
                type="number"
                step="5000"
                {...register('budget_min')}
                className={`w-full h-9 px-3 bg-[#F8FAFC] border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30 ${
                  errors.budget_min ? 'border-rose-400 bg-rose-50/30' : 'border-[#CBD5E1]'
                }`}
              />
              {errors.budget_min && (
                <p className="text-[11px] text-rose-600 mt-1">{errors.budget_min.message}</p>
              )}
            </div>

            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">Budget Max (₹ INR) *</label>
              <input
                type="number"
                step="5000"
                {...register('budget_max')}
                className="w-full h-9 px-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30"
              />
            </div>
          </div>

          {/* Row 5: Source, Priority, Assigned To */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">Lead Source *</label>
              <select
                {...register('source')}
                className="w-full h-9 px-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs"
              >
                <option value="Website">Website</option>
                <option value="Walk-in">Walk-in</option>
                <option value="Instagram">Instagram</option>
                <option value="Facebook">Facebook</option>
                <option value="Google Ads">Google Ads</option>
                <option value="Referral">Referral</option>
                <option value="Travel Agent">Travel Agent</option>
                <option value="MakeMyTrip">MakeMyTrip</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">Priority</label>
              <select
                {...register('priority')}
                className="w-full h-9 px-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">Assigned Executive *</label>
              <select
                {...register('assigned_to')}
                className="w-full h-9 px-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs"
              >
                <option value="Sameer Verma">Sameer Verma (Sales Executive)</option>
                <option value="Amit Singh">Amit Singh</option>
                <option value="Neha Gupta">Neha Gupta</option>
                <option value="Rohit Kumar">Rohit Kumar</option>
                <option value="Pooja Soni">Pooja Soni</option>
              </select>
            </div>
          </div>

          {/* Row 6: Status & (Conditional) Lost Reason */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">Pipeline Status</label>
              <select
                {...register('status')}
                className="w-full h-9 px-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs"
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Site Visit">Site Visit</option>
                <option value="Interested">Interested</option>
                <option value="Booked">Booked</option>
                <option value="Lost">Lost</option>
              </select>
            </div>

            {currentStatus === 'Lost' && (
              <div>
                <label className="block font-semibold text-[#1E293B] mb-1">
                  Reason for Lost *
                </label>
                <select
                  {...register('lost_reason')}
                  className={`w-full h-9 px-3 bg-[#F8FAFC] border rounded-xl text-xs ${
                    errors.lost_reason ? 'border-rose-400 bg-rose-50/30' : 'border-[#CBD5E1]'
                  }`}
                >
                  <option value="">Select Lost Reason...</option>
                  <option value="Too expensive">Too expensive</option>
                  <option value="No response after follow-up">No response after follow-up</option>
                  <option value="Chose competitor">Chose competitor</option>
                  <option value="Dates not available">Dates not available</option>
                  <option value="Location too far">Location too far</option>
                </select>
                {errors.lost_reason && (
                  <p className="text-[11px] text-rose-600 mt-1">{errors.lost_reason.message}</p>
                )}
              </div>
            )}
          </div>

          {/* Remarks */}
          <div>
            <label className="block font-semibold text-[#1E293B] mb-1">Remarks & Requirements</label>
            <textarea
              rows={2}
              placeholder="e.g. Prefers private pool villa with lake view, celebrating 10th anniversary..."
              {...register('remarks')}
              className="w-full p-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30"
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-[#0F5132] hover:bg-[#0B3D25] text-white shadow-2xs flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{leadToEdit ? 'Save Changes' : 'Create Lead'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
