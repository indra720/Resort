import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from '@/store/useToastStore';
import {
  Star,
  MessageSquareHeart,
  Send,
  CheckCircle2,
  Award,
  ThumbsUp,
  Sparkles,
  Quote,
} from 'lucide-react';

export const FeedbackPage: React.FC = () => {
  const [overallRating, setOverallRating] = useState(5);
  const [cleanlinessRating, setCleanlinessRating] = useState(5);
  const [foodRating, setFoodRating] = useState(5);
  const [staffRating, setStaffRating] = useState(5);

  const [guestName, setGuestName] = useState('Pooja Hegde');
  const [roomNumber, setRoomNumber] = useState('V-01');
  const [comments, setComments] = useState(
    'The private plunge pool villa was immaculate! Chef Sanjeev made amazing Goan fish curry, and the housekeeping team was extremely courteous.'
  );

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    toast.success('Feedback Submitted', 'Thank you for your valuable feedback!');
  };

  const renderStars = (rating: number, setRating: (r: number) => void) => {
    return (
      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className="p-1 text-[#A1A1AA] hover:text-[#FF6B00] transition-colors focus-visible:outline-none"
            aria-label={`Rate ${star} star`}
          >
            <Star
              className={`w-6 h-6 ${
                star <= rating ? 'fill-[#FF6B00] text-[#FF6B00]' : 'text-[#2A2A35]'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const satisfactionMetrics = [
    { label: 'Room Cleanliness & Hygiene', score: '99%', val: 99 },
    { label: 'Dining & Culinary Quality', score: '98%', val: 98 },
    { label: 'Staff Attentiveness & Hospitality', score: '98%', val: 98 },
    { label: 'Villa Privacy & Pool Ambience', score: '96%', val: 96 },
  ];

  const recentReviews = [
    {
      guest: 'Vikram & Meera Malhotra',
      stay: 'Grand Pool Villa (V-03)',
      date: '04 Oct 2026',
      rating: 5,
      review:
        'The candlelit dinner on Candolim shoreline was unforgettable. Outstanding room service speed and serene beach access!',
    },
    {
      guest: 'Arjun Singhania',
      stay: 'Oceanview Suite (Suite 201)',
      date: '02 Oct 2026',
      rating: 5,
      review:
        'From express digital check-in to early breakfast delivery before our flight, Aura Palms hospitality team is gold-standard.',
    },
  ];

  return (
    <div className="w-full space-y-6 text-left">
      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F5F5F7] flex items-center gap-2">
          <MessageSquareHeart className="w-6 h-6 text-[#FF6B00]" />
          <span>Guest Stay Review & Feedback Center</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#A1A1AA]">
          Collect guest ratings, monitor service satisfaction, and uphold Aura Palms 5-star hospitality standards.
        </p>
      </div>

      {/* Main Responsive Grid Layout - Fills 100% of screen without extra empty side margins */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Feedback Submission Form (7 cols on lg, 8 on xl) */}
        <div className="lg:col-span-7 xl:col-span-8">
          <div className="p-6 sm:p-8 rounded-2xl bg-[#14141A] border border-[#2A2A35] shadow-xl">
            {isSubmitted ? (
              <div className="text-center space-y-4 py-8">
                <div className="w-16 h-16 rounded-full bg-[#22C55E]/15 border border-[#22C55E]/30 flex items-center justify-center text-[#22C55E] mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-[#F5F5F7]">Dhanyavaad (Thank You)!</h2>
                <p className="text-xs sm:text-sm text-[#A1A1AA] max-w-md mx-auto leading-relaxed">
                  Your feedback has been received and shared directly with General Manager Ananya Sharma. We hope to welcome you back to Goa soon!
                </p>
                <div className="pt-2">
                  <Button variant="outline" onClick={() => setIsSubmitted(false)}>
                    Submit Another Response
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-[#F5F5F7]">
                    Rate Your Experience
                  </h3>
                  <p className="text-xs text-[#A1A1AA]">
                    Your honest impressions guide our housekeeping, culinary, and front desk teams.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Guest Full Name"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    required
                  />
                  <Input
                    label="Room / Villa Occupied"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    required
                  />
                </div>

                {/* Ratings Grid */}
                <div className="space-y-4 pt-2 border-t border-[#2A2A35]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-[#0B0B0F]/50 border border-[#2A2A35]/60">
                    <div>
                      <span className="text-sm font-semibold text-[#F5F5F7] block">
                        Overall Resort Stay
                      </span>
                      <span className="text-xs text-[#A1A1AA]">Ambience, amenities and comfort</span>
                    </div>
                    {renderStars(overallRating, setOverallRating)}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-[#0B0B0F]/50 border border-[#2A2A35]/60">
                    <div>
                      <span className="text-sm font-semibold text-[#F5F5F7] block">
                        Room Cleanliness & Hygiene
                      </span>
                      <span className="text-xs text-[#A1A1AA]">Housekeeping and linen turnover</span>
                    </div>
                    {renderStars(cleanlinessRating, setCleanlinessRating)}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-[#0B0B0F]/50 border border-[#2A2A35]/60">
                    <div>
                      <span className="text-sm font-semibold text-[#F5F5F7] block">
                        Dining & Food Quality
                      </span>
                      <span className="text-xs text-[#A1A1AA]">Flavor, freshness and dining service</span>
                    </div>
                    {renderStars(foodRating, setFoodRating)}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-[#0B0B0F]/50 border border-[#2A2A35]/60">
                    <div>
                      <span className="text-sm font-semibold text-[#F5F5F7] block">
                        Staff Courtesy & Front Desk
                      </span>
                      <span className="text-xs text-[#A1A1AA]">Attentiveness and prompt response</span>
                    </div>
                    {renderStars(staffRating, setStaffRating)}
                  </div>
                </div>

                {/* Detailed Comments */}
                <div className="space-y-1.5 pt-2 border-t border-[#2A2A35]">
                  <label className="text-sm font-medium text-[#F5F5F7]">
                    Your Comments & Memories
                  </label>
                  <textarea
                    rows={4}
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Share your stay experience or any special compliments for the staff..."
                    className="w-full p-3.5 text-sm rounded-xl bg-[#1C1C24] text-[#F5F5F7] placeholder:text-[#A1A1AA] border border-[#2A2A35] focus:outline-none focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00]"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  rightIcon={<Send className="w-4 h-4" />}
                >
                  Submit Guest Feedback
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Right Column: Resort Satisfaction Index & Verified Accolades (5 cols on lg, 4 on xl) */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          {/* Rating Summary Card */}
          <div className="p-6 rounded-2xl bg-[#14141A] border border-[#2A2A35] shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#A1A1AA] flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#FF6B00]" /> Satisfaction Scorecard
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#22C55E]/15 border border-[#22C55E]/30 text-[#22C55E] text-[11px] font-semibold">
                Superb 4.9/5
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-extrabold text-[#F5F5F7]">4.92</span>
              <div>
                <div className="flex items-center gap-1 text-[#FF6B00]">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-[#FF6B00]" />
                  ))}
                </div>
                <span className="text-[11px] text-[#A1A1AA]">342 verified guest reviews</span>
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="space-y-3 pt-3 border-t border-[#2A2A35]">
              {satisfactionMetrics.map((m) => (
                <div key={m.label} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#A1A1AA]">{m.label}</span>
                    <span className="font-semibold text-[#F5F5F7]">{m.score}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#1C1C24] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF8A33]"
                      style={{ width: `${m.val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Guest Reviews */}
          <div className="p-6 rounded-2xl bg-[#14141A] border border-[#2A2A35] shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <Quote className="w-4 h-4 text-[#FF6B00]" />
              <h3 className="text-sm font-semibold text-[#F5F5F7]">Recent Verified Reviews</h3>
            </div>

            <div className="space-y-3.5">
              {recentReviews.map((rev, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[#0B0B0F]/70 border border-[#2A2A35] space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-semibold text-[#F5F5F7] block">{rev.guest}</span>
                      <span className="text-[10px] text-[#A1A1AA]">{rev.stay}</span>
                    </div>
                    <div className="flex items-center gap-0.5 text-[#FF6B00] shrink-0">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-[#FF6B00]" />
                      ))}
                    </div>
                  </div>
                  <p className="text-[#A1A1AA] leading-relaxed italic">"{rev.review}"</p>
                  <span className="text-[10px] text-[#A1A1AA]/70 block">{rev.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
