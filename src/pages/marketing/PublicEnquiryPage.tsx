import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {
  Sparkles,
  Calendar,
  Users,
  Phone,
  Mail,
  User,
  MapPin,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { submitPublicEnquiry } from '@/api/marketing';
import { InterestedInType } from '@/types/crm';
import { formatINR } from '@/lib/formatINR';
import { getDbItem, DB_KEYS } from '@/api/db';
import { ResortTenant } from '@/types';
import { MOCK_RESORT_TENANTS } from '@/data/mockData';

export const PublicEnquiryPage: React.FC = () => {
  const { resortSlug } = useParams<{ resortSlug: string }>();
  const [searchParams] = useSearchParams();

  // Extract UTM tags from query params
  const utmSource = searchParams.get('utm_source') || 'website';
  const utmMedium = searchParams.get('utm_medium') || 'direct';
  const utmCampaign = searchParams.get('utm_campaign') || 'lead_form';

  // Resolve Resort
  const [resort, setResort] = useState<ResortTenant | null>(null);

  useEffect(() => {
    const allResorts = getDbItem<ResortTenant[]>(DB_KEYS.RESORTS, MOCK_RESORT_TENANTS);
    const target =
      allResorts.find(
        (r) =>
          r.id === resortSlug ||
          r.name.toLowerCase().replace(/\s+/g, '-') === resortSlug?.toLowerCase()
      ) || allResorts[0];
    setResort(target);
  }, [resortSlug]);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [preferredDate, setPreferredDate] = useState(
    new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10)
  );
  const [guests, setGuests] = useState(2);
  const [interestedIn, setInterestedIn] = useState<InterestedInType>('Weekend Stay');
  const [budget, setBudget] = useState(25000);
  const [remarks, setRemarks] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedLeadId, setSubmittedLeadId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSubmitting(true);

    const result = submitPublicEnquiry(
      {
        name,
        phone,
        email,
        city,
        preferred_date: preferredDate,
        guests,
        interested_in: interestedIn,
        budget,
        remarks,
      },
      resort?.id || 'resort-1',
      {
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
      }
    );

    setIsSubmitting(false);

    if (result.success && result.lead) {
      setIsSubmitted(true);
      setSubmittedLeadId(result.lead.id);
    } else {
      setErrorMessage(result.error || 'Failed to submit enquiry. Please try again.');
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setName('');
    setPhone('');
    setEmail('');
    setCity('');
    setRemarks('');
  };

  const primaryColor = '#0F5132';

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-emerald-50/30 to-amber-50/20 py-8 px-4 sm:px-6 flex items-center justify-center font-sans antialiased">
      <div className="max-w-2xl lg:max-w-3xl w-full bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header Banner */}
        <div
          className="relative px-6 py-8 text-white text-center overflow-hidden"
          style={{ backgroundColor: primaryColor }}
        >
          {/* Subtle nature overlay texture */}
          <div className="absolute inset-0 bg-black/15 pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white mb-3 ring-1 ring-white/30 shadow-md">
              <Sparkles className="w-6 h-6 text-emerald-200" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              {resort ? resort.name : 'Joy Resorts & Nature Sanctuary'}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-md font-medium">
              Check availability, request tariff proposals, and unlock privileged seasonal offers.
            </p>
            <div className="mt-3 flex items-center gap-2 text-[11px] text-emerald-200 bg-black/20 px-3 py-1 rounded-full backdrop-blur-xs">
              <Clock className="w-3.5 h-3.5 text-emerald-300" />
              <span>Instant Response Guarantee: Concierge calls within 15 mins</span>
            </div>
          </div>
        </div>

        {/* Confirmation Screen */}
        {isSubmitted ? (
          <div className="p-6 sm:p-8 text-center space-y-5 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#0F5132] flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">Enquiry Confirmed!</h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
                Thank you, <strong>{name}</strong>. Your luxury stay enquiry for{' '}
                <strong>{resort?.name}</strong> has been prioritised.
              </p>
            </div>

            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-xs text-left space-y-2 text-slate-700 max-w-md mx-auto">
              <div className="flex justify-between border-b border-stone-200 pb-2">
                <span className="text-slate-500">Enquiry Reference:</span>
                <span className="font-mono font-bold text-slate-900">{submittedLeadId}</span>
              </div>
              <div className="flex justify-between border-b border-stone-200 pb-2">
                <span className="text-slate-500">Experience Type:</span>
                <span className="font-semibold text-slate-900">{interestedIn}</span>
              </div>
              <div className="flex justify-between border-b border-stone-200 pb-2">
                <span className="text-slate-500">Preferred Dates:</span>
                <span className="font-semibold text-slate-900">{preferredDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Party Size:</span>
                <span className="font-semibold text-slate-900">{guests} Guest(s)</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-900 flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>A dedicated reservation manager is preparing your tailored proposal now.</span>
            </div>

            <button
              onClick={resetForm}
              className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-black transition-colors"
            >
              Submit Another Request
            </button>
          </div>
        ) : (
          /* Enquiry Form */
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4 text-xs">
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold">
                {errorMessage}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Full Name */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Rohan Mehra"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-9 pl-9 pr-3 rounded-xl border border-stone-300 focus:outline-none focus:border-emerald-600 font-medium"
                  />
                </div>
              </div>

              {/* Mobile Phone */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Mobile Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-9 pl-9 pr-3 rounded-xl border border-stone-300 focus:outline-none focus:border-emerald-600 font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Email Address */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    placeholder="rohan@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-9 pl-9 pr-3 rounded-xl border border-stone-300 focus:outline-none focus:border-emerald-600 font-medium"
                  />
                </div>
              </div>

              {/* City */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">City / Region</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="e.g. Mumbai, Bengaluru"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full h-9 pl-9 pr-3 rounded-xl border border-stone-300 focus:outline-none focus:border-emerald-600 font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {/* Experience Type */}
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Experience / Stay Purpose
                </label>
                <select
                  value={interestedIn}
                  onChange={(e) => setInterestedIn(e.target.value as any)}
                  className="w-full h-9 px-3 rounded-xl border border-stone-300 focus:outline-none focus:border-emerald-600 font-medium bg-white"
                >
                  <option value="Weekend Stay">Weekend Nature Staycation</option>
                  <option value="Destination Wedding">Destination Wedding & Banquets</option>
                  <option value="Corporate Event">Corporate Leadership Retreat</option>
                  <option value="Day Outing">Family Day Outing & Dining</option>
                  <option value="Wellness Spa">Ayurvedic Wellness & Spa</option>
                </select>
              </div>

              {/* Guests */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Guests</label>
                <div className="relative">
                  <Users className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value) || 1)}
                    className="w-full h-9 pl-9 pr-3 rounded-xl border border-stone-300 focus:outline-none focus:border-emerald-600 font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Preferred Date */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Preferred Check-In Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="date"
                    min={new Date().toISOString().slice(0, 10)}
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full h-9 pl-9 pr-3 rounded-xl border border-stone-300 focus:outline-none focus:border-emerald-600 font-medium"
                  />
                </div>
              </div>

              {/* Estimated Budget */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Budget Expectation ({formatINR(budget)})
                </label>
                <input
                  type="range"
                  min="10000"
                  max="500000"
                  step="5000"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full accent-[#0F5132] mt-2 cursor-pointer"
                />
              </div>
            </div>

            {/* Special Remarks */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Special Requests or Dietary Preferences
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Private pool villa preferred, celebration cake for anniversary..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-emerald-600 font-medium"
              />
            </div>

            {/* Consent Notice */}
            <div className="text-[10px] text-slate-500 leading-relaxed pt-1">
              By submitting this enquiry, you authorize {resort?.name || 'Joy Resorts'} to contact
              you via phone / WhatsApp with tariff quotes and availability updates.
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl text-white font-bold text-sm tracking-wide shadow-md transition-all duration-200 hover:brightness-105 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
              style={{ backgroundColor: primaryColor }}
            >
              {isSubmitting ? (
                <span>Submitting Request...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Request Instant Tariff & Availability</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Footer */}
        <div className="bg-stone-100/70 border-t border-stone-200 py-3 px-6 text-center text-[10px] text-slate-500 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Building className="w-3 h-3 text-slate-400" />
            <span>Official Direct Booking Concierge</span>
          </span>
          <span className="font-semibold text-slate-700">JOY RESORTS SAAS</span>
        </div>
      </div>
    </div>
  );
};
