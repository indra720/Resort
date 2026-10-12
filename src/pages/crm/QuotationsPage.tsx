import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  CalendarCheck,
  MessageCircle,
  Mail,
  Printer,
  Sparkles,
  TrendingUp,
  Layers,
  Lock,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { Quotation, QuotationStatus } from '@/types/crm';
import { getQuotations, deleteQuotation } from '@/api/quotations';
import { formatINR } from '@/lib/formatINR';
import { canUse } from '@/lib/permissions';
import { toast } from '@/store/useToastStore';
import { QuotationBuilderModal } from '@/features/crm/QuotationBuilderModal';
import { QuotationPreviewModal } from '@/features/crm/QuotationPreviewModal';

export const QuotationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentResort, user, role } = useAuthStore();
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [quotationToEdit, setQuotationToEdit] = useState<Quotation | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedPreviewQuotation, setSelectedPreviewQuotation] = useState<Quotation | null>(null);

  const loadData = () => {
    const list = getQuotations(currentResort.id, user, activeTab);
    setQuotations(list);
  };

  useEffect(() => {
    loadData();
  }, [currentResort.id, user, role, activeTab]);

  // Plan Gating
  const isQuotationsUnlocked = canUse(currentResort, 'quotations');

  // Filtered
  const filteredQuotations = useMemo(() => {
    return quotations.filter((q) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        return (
          q.quotation_number.toLowerCase().includes(query) ||
          q.guest_name.toLowerCase().includes(query) ||
          q.guest_phone.includes(query) ||
          (q.interested_in && q.interested_in.toLowerCase().includes(query))
        );
      }
      return true;
    });
  }, [quotations, searchQuery]);

  // KPIs
  const allQuotations = useMemo(() => getQuotations(currentResort.id, user, 'ALL'), [currentResort.id, user, quotations]);
  const totalCount = allQuotations.length;
  const sentValue = allQuotations
    .filter((q) => q.status === 'Sent')
    .reduce((acc, q) => acc + q.grand_total, 0);
  const acceptedValue = allQuotations
    .filter((q) => q.status === 'Accepted')
    .reduce((acc, q) => acc + q.grand_total, 0);
  const acceptedCount = allQuotations.filter((q) => q.status === 'Accepted').length;
  const winRate = totalCount > 0 ? Math.round((acceptedCount / totalCount) * 100) : 0;

  const handleDelete = (id: string, num: string) => {
    if (window.confirm(`Delete quotation ${num}?`)) {
      deleteQuotation(id, currentResort.id);
      toast.success('Deleted', `Quotation ${num} removed.`);
      loadData();
    }
  };

  const openPreview = (q: Quotation) => {
    setSelectedPreviewQuotation(q);
    setIsPreviewOpen(true);
  };

  const openEdit = (q: Quotation) => {
    setQuotationToEdit(q);
    setIsBuilderOpen(true);
  };

  if (!isQuotationsUnlocked) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center mb-4 shadow-sm">
          <Lock className="w-8 h-8" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 mb-2">
          Pro & Enterprise Feature
        </span>
        <h2 className="text-2xl font-black text-[#0F172A] tracking-tight mb-2">
          Quotation & Proposal Builder is Locked
        </h2>
        <p className="text-xs sm:text-sm text-[#64748B] max-w-md mb-6 leading-relaxed">
          The customized Proposal & Quotation engine with GST tax calculation, WhatsApp dispatch, and PDF export is available on the <strong>Pro Plan</strong>.
        </p>
        <button
          type="button"
          onClick={() => navigate('/subscription')}
          className="px-5 py-2.5 bg-[#0F5132] hover:bg-[#0B3D25] text-white rounded-xl text-xs sm:text-sm font-bold shadow-2xs transition-colors"
        >
          Upgrade to Pro
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5 text-left text-[#0F172A]">
      
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#0F172A] flex items-center gap-2">
              <FileText className="w-6 h-6 text-[#0F5132]" />
              <span>Quotations & Proposals</span>
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#0F5132] font-semibold border border-emerald-200">
              {currentResort.name}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Create itemized luxury packages, calculate GST slabs, and dispatch PDF proposals to guests.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setQuotationToEdit(null);
            setIsBuilderOpen(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#0F5132] hover:bg-[#0B3D25] text-white rounded-xl text-xs sm:text-sm font-bold shadow-2xs transition-colors shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Quotation</span>
        </button>
      </div>

      {/* 2. Top KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex flex-col justify-between">
          <span className="text-xs font-semibold text-[#64748B]">Total Proposals</span>
          <div className="text-2xl sm:text-3xl font-black text-[#0F172A] mt-1">{totalCount}</div>
          <p className="text-[11px] text-[#94A3B8] mt-0.5">Curated client quotes</p>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex flex-col justify-between">
          <span className="text-xs font-semibold text-[#64748B]">Active Sent Value</span>
          <div className="text-2xl sm:text-3xl font-black text-blue-600 mt-1">{formatINR(sentValue)}</div>
          <p className="text-[11px] text-blue-700 mt-0.5">Under review by guests</p>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex flex-col justify-between">
          <span className="text-xs font-semibold text-[#64748B]">Accepted Bookings</span>
          <div className="text-2xl sm:text-3xl font-black text-[#0F5132] mt-1">{formatINR(acceptedValue)}</div>
          <p className="text-[11px] text-emerald-700 mt-0.5">{acceptedCount} quotes closed won</p>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex flex-col justify-between">
          <span className="text-xs font-semibold text-[#64748B]">Proposal Win Rate</span>
          <div className="text-2xl sm:text-3xl font-black text-[#0F172A] mt-1">{winRate}%</div>
          <p className="text-[11px] text-[#94A3B8] mt-0.5">Accepted ratio</p>
        </div>
      </div>

      {/* 3. Status Tabs */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-1.5 sm:p-2 shadow-2xs overflow-x-auto scrollbar-thin">
        <div className="flex items-center gap-1 min-w-max">
          {[
            { id: 'ALL', label: 'All Quotations', count: allQuotations.length },
            { id: 'Draft', label: 'Draft', count: allQuotations.filter((q) => q.status === 'Draft').length },
            { id: 'Sent', label: 'Sent', count: allQuotations.filter((q) => q.status === 'Sent').length },
            { id: 'Accepted', label: 'Accepted', count: allQuotations.filter((q) => q.status === 'Accepted').length },
            { id: 'Rejected', label: 'Rejected', count: allQuotations.filter((q) => q.status === 'Rejected').length },
            { id: 'Expired', label: 'Expired', count: allQuotations.filter((q) => q.status === 'Expired').length },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                activeTab === tab.id
                  ? 'bg-[#0F5132] text-white shadow-2xs'
                  : 'text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Search Bar */}
      <div className="bg-white p-3 rounded-2xl border border-[#E2E8F0] shadow-2xs flex items-center gap-2">
        <Search className="w-4 h-4 text-[#94A3B8] ml-2 shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by proposal #, guest name, phone, or experience..."
          className="w-full text-xs bg-transparent focus:outline-none font-medium"
        />
      </div>

      {/* 5. Quotations Table (Desktop) / Cards (Mobile) */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
        {filteredQuotations.length === 0 ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 text-[#64748B] flex items-center justify-center mx-auto border border-[#E2E8F0]">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-[#0F172A]">No Quotations Found</h3>
            <p className="text-xs text-[#64748B] max-w-sm mx-auto">
              {searchQuery ? 'Try matching another query or clear filters.' : 'Create your first luxury proposal tailored to a prospective guest.'}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-bold">
                    <th className="py-3 px-4">Proposal #</th>
                    <th className="py-3 px-4">Guest Details</th>
                    <th className="py-3 px-4">Experience</th>
                    <th className="py-3 px-4">Grand Total (₹)</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Valid Till</th>
                    <th className="py-3 px-4">Created By</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {filteredQuotations.map((q) => (
                    <tr key={q.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[#0F5132]">
                        <button
                          type="button"
                          onClick={() => openPreview(q)}
                          className="hover:underline flex items-center gap-1"
                        >
                          <span>{q.quotation_number}</span>
                        </button>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-[#0F172A] block">{q.guest_name}</span>
                        <span className="text-[11px] text-[#64748B]">{q.guest_phone}</span>
                      </td>
                      <td className="py-3.5 px-4 text-[#475569] font-medium">
                        {q.interested_in || 'Custom Stay'}
                      </td>
                      <td className="py-3.5 px-4 font-black text-[#0F172A]">
                        {formatINR(q.grand_total)}
                        <span className="text-[10px] text-[#64748B] font-normal block">
                          GST: {formatINR(q.tax_amount)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                            q.status === 'Accepted'
                              ? 'bg-emerald-100 text-emerald-800'
                              : q.status === 'Sent'
                              ? 'bg-blue-100 text-blue-800'
                              : q.status === 'Draft'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {q.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#64748B]">{q.valid_until}</td>
                      <td className="py-3.5 px-4 text-[#475569] font-medium">{q.created_by}</td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openPreview(q)}
                            className="p-1.5 text-[#475569] hover:text-[#0F172A] hover:bg-[#E2E8F0] rounded-lg transition-colors"
                            title="View Preview / Print"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => openEdit(q)}
                            className="p-1.5 text-[#475569] hover:text-[#0F172A] hover:bg-[#E2E8F0] rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(q.id, q.quotation_number)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden divide-y divide-[#E2E8F0]">
              {filteredQuotations.map((q) => (
                <div key={q.id} className="p-4 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-bold text-[#0F5132] text-xs block">{q.quotation_number}</span>
                      <h4 className="font-bold text-sm text-[#0F172A]">{q.guest_name}</h4>
                      <p className="text-xs text-[#64748B]">{q.guest_phone}</p>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        q.status === 'Accepted'
                          ? 'bg-emerald-100 text-emerald-800'
                          : q.status === 'Sent'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {q.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-[#F1F5F9]">
                    <span className="text-[#64748B]">{q.interested_in || 'Stay Package'}</span>
                    <span className="font-black text-sm text-[#0F172A]">{formatINR(q.grand_total)}</span>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => openPreview(q)}
                      className="px-3 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs font-semibold text-[#334155] flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => openEdit(q)}
                      className="px-3 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs font-semibold text-[#334155] flex items-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Builder Modal */}
      <QuotationBuilderModal
        isOpen={isBuilderOpen}
        onClose={() => {
          setIsBuilderOpen(false);
          setQuotationToEdit(null);
        }}
        quotationToEdit={quotationToEdit}
        onSuccess={loadData}
      />

      {/* Preview Modal */}
      <QuotationPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false);
          setSelectedPreviewQuotation(null);
        }}
        quotation={selectedPreviewQuotation}
        onRefresh={loadData}
      />
    </div>
  );
};
