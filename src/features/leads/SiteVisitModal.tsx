import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, CheckCircle2, UserCheck, Clock } from 'lucide-react';
import { Lead } from '@/types/crm';
import { useAuthStore } from '@/store/useAuthStore';
import { scheduleSiteVisit } from '@/api/followups';
import { toast } from '@/store/useToastStore';

export interface SiteVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  onSuccess: () => void;
}

export const SiteVisitModal: React.FC<SiteVisitModalProps> = ({
  isOpen,
  onClose,
  lead,
  onSuccess,
}) => {
  const { currentResort, user } = useAuthStore();
  const [visitDate, setVisitDate] = useState('');
  const [visitTime, setVisitTime] = useState('11:30 AM');
  const [assignedTo, setAssignedTo] = useState('Rohit Kumar');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (lead && isOpen) {
      // Default visit date to preferred date or 3 days from now
      setVisitDate(lead.preferred_date || new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0]);
      setVisitTime('11:30 AM');
      setAssignedTo(lead.assigned_to || 'Rohit Kumar');
      setNotes(`Guide ${lead.name} through ${lead.interested_in} facilities, villas, and lawn setup.`);
    }
  }, [lead, isOpen]);

  if (!isOpen || !lead) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitDate) return;

    setIsSubmitting(true);
    const result = scheduleSiteVisit(
      lead.id,
      {
        dateTime: `${visitDate}T${visitTime}`,
        assignedTo,
        notes,
      },
      currentResort.id,
      user
    );
    setIsSubmitting(false);

    if (result.success) {
      toast.success(
        'Site Visit Scheduled!',
        `Confirmed for ${lead.name} on ${visitDate} at ${visitTime}. Assigned to ${assignedTo}.`
      );
      onSuccess();
      onClose();
    } else {
      toast.error('Scheduling Failed', result.error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-lg p-5 sm:p-6 shadow-2xl border border-[#E2E8F0] my-auto text-left text-xs text-[#0F172A] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">Schedule Property Site Visit</h2>
              <p className="text-xs text-[#64748B]">
                Organize guided property tour for <strong>{lead.name}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#F1F5F9] flex items-center justify-center text-[#64748B] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Summary Box */}
          <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
            <div className="flex justify-between font-bold text-[#0F172A]">
              <span>{lead.name}</span>
              <span className="text-[#0F5132] font-semibold">{lead.lead_code}</span>
            </div>
            <p className="text-[#64748B]">
              {lead.phone} • {lead.city} • Interested: <strong>{lead.interested_in}</strong>
            </p>
          </div>

          {/* Date & Time Picker */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">Inspection Date *</label>
              <input
                type="date"
                required
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                className="w-full h-9 px-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#1E293B] mb-1">Preferred Time *</label>
              <select
                value={visitTime}
                onChange={(e) => setVisitTime(e.target.value)}
                className="w-full h-9 px-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30"
              >
                <option value="10:00 AM">10:00 AM (Morning Tour)</option>
                <option value="11:30 AM">11:30 AM (Pre-Lunch)</option>
                <option value="02:30 PM">02:30 PM (Afternoon)</option>
                <option value="04:30 PM">04:30 PM (Sunset Inspection)</option>
                <option value="06:00 PM">06:00 PM (Banquet Lighting Demo)</option>
              </select>
            </div>
          </div>

          {/* Assigned Executive */}
          <div>
            <label className="block font-semibold text-[#1E293B] mb-1">Lead Guide / Rep *</label>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full h-9 px-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30"
            >
              <option value="Rohit Kumar">Rohit Kumar (Site Specialist)</option>
              <option value="Amit Singh">Amit Singh</option>
              <option value="Neha Gupta">Neha Gupta</option>
              <option value="Sameer Verma">Sameer Verma (Sales Executive)</option>
              <option value="Pooja Soni">Pooja Soni</option>
            </select>
          </div>

          {/* Inspection Instructions */}
          <div>
            <label className="block font-semibold text-[#1E293B] mb-1">Inspection Notes / Prep</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Keep master suite unlocked, prepare tasting menu sample..."
              className="w-full p-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-[#0F5132] hover:bg-[#0B3D25] text-white shadow-2xs flex items-center gap-1.5 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm Site Visit</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
