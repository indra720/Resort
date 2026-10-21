import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  MessageCircle,
  Mail,
  Smartphone,
  Plus,
  Search,
  Filter,
  Copy,
  Edit,
  Trash2,
  Sparkles,
  Lock,
  Eye,
  Check,
  X,
  Tag,
  Variable,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { MessageTemplate, TemplateChannel, TemplateCategory } from '@/types/crm';
import { getTemplates, createTemplate, updateTemplate, deleteTemplate, interpolateTemplate } from '@/api/templates';
import { canUse } from '@/lib/permissions';
import { toast } from '@/store/useToastStore';

export const TemplatesPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentResort } = useAuthStore();
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [channelFilter, setChannelFilter] = useState<TemplateChannel | 'ALL'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<TemplateCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [templateToEdit, setTemplateToEdit] = useState<MessageTemplate | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formChannel, setFormChannel] = useState<TemplateChannel>('whatsapp');
  const [formCategory, setFormCategory] = useState<TemplateCategory>('intro');
  const [formSubject, setFormSubject] = useState('');
  const [formContent, setFormContent] = useState('');

  const loadData = () => {
    setTemplates(getTemplates(currentResort.id, channelFilter, categoryFilter));
  };

  useEffect(() => {
    loadData();
  }, [currentResort.id, channelFilter, categoryFilter]);

  const isTemplatesUnlocked = canUse(currentResort, 'templates');

  const filteredTemplates = useMemo(() => {
    return templates.filter((t) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          t.name.toLowerCase().includes(q) ||
          t.content.toLowerCase().includes(q) ||
          (t.subject && t.subject.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [templates, searchQuery]);

  const handleOpenCreate = () => {
    setTemplateToEdit(null);
    setFormName('');
    setFormChannel('whatsapp');
    setFormCategory('intro');
    setFormSubject('');
    setFormContent('Hello {guest_name}, greetings from {resort_name}!');
    setIsEditModalOpen(true);
  };

  const handleOpenEdit = (t: MessageTemplate) => {
    setTemplateToEdit(t);
    setFormName(t.name);
    setFormChannel(t.channel);
    setFormCategory(t.category);
    setFormSubject(t.subject || '');
    setFormContent(t.content);
    setIsEditModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Delete template "${name}"?`)) {
      deleteTemplate(id, currentResort.id);
      toast.success('Template Removed', `Deleted ${name}.`);
      loadData();
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to Clipboard', 'Template text copied.');
  };

  const handleInsertVariable = (varName: string) => {
    setFormContent((prev) => `${prev} {${varName}}`);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formContent.trim()) {
      toast.error('Validation', 'Name and content are required.');
      return;
    }

    if (templateToEdit) {
      updateTemplate(
        templateToEdit.id,
        {
          name: formName.trim(),
          channel: formChannel,
          category: formCategory,
          subject: formChannel === 'email' ? formSubject.trim() : undefined,
          content: formContent.trim(),
        },
        currentResort.id
      );
      toast.success('Template Updated', 'Changes saved successfully.');
    } else {
      createTemplate(
        {
          name: formName.trim(),
          channel: formChannel,
          category: formCategory,
          subject: formChannel === 'email' ? formSubject.trim() : undefined,
          content: formContent.trim(),
        },
        currentResort.id
      );
      toast.success('Template Created', `Added "${formName}" to library.`);
    }

    setIsEditModalOpen(false);
    setTemplateToEdit(null);
    loadData();
  };

  if (!isTemplatesUnlocked) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center mb-4 shadow-sm">
          <Lock className="w-8 h-8" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 mb-2">
          Pro & Enterprise Feature
        </span>
        <h2 className="text-2xl font-black text-[#0F172A] tracking-tight mb-2">
          Message Templates Manager is Locked
        </h2>
        <p className="text-xs sm:text-sm text-[#64748B] max-w-md mb-6 leading-relaxed">
          Pre-approved WhatsApp, Email, and SMS templates with live variables and quick-dispatch actions are available on the <strong>Pro Plan</strong>.
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

  // Sample guest values for preview rendering
  const sampleValues = {
    guest_name: 'Vikram Singhania',
    resort_name: currentResort.name,
    dates: '14 Nov - 16 Nov 2026',
    amount: '48,500',
    quotation_link: 'https://joyresorts.com/quote/QT-001',
    contact_number: '+91 98200 11223',
  };

  return (
    <div className="space-y-4 sm:space-y-5 text-left text-[#0F172A] pb-28 sm:pb-12">
      
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#0F172A] flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-[#0F5132]" />
              <span>Omnichannel Message Templates</span>
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#0F5132] font-semibold border border-emerald-200">
              {currentResort.name}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Craft standardized WhatsApp, Email, and SMS responses with dynamic lead variables like &#123;guest_name&#125; and &#123;dates&#125;.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#0F5132] hover:bg-[#0B3D25] text-white rounded-xl text-xs sm:text-sm font-bold shadow-2xs transition-colors shrink-0 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Template</span>
        </button>
      </div>

      {/* 2. Channel Tabs */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-1.5 sm:p-2 shadow-2xs overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex items-center gap-1.5 min-w-max">
          {[
            { id: 'ALL', label: 'All Channels', icon: MessageSquare },
            { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
            { id: 'email', label: 'Email', icon: Mail },
            { id: 'sms', label: 'SMS', icon: Smartphone },
          ].map((ch) => {
            const Icon = ch.icon;
            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => setChannelFilter(ch.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 whitespace-nowrap ${
                  channelFilter === ch.id
                    ? 'bg-[#0F5132] text-white shadow-2xs'
                    : 'text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{ch.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Search Bar & Variables Hint */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#E2E8F0] shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates by title or message text..."
            className="w-full pl-9 pr-3 h-9 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-medium focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1 text-[11px] text-[#64748B] flex-wrap">
          <span className="font-semibold text-[#0F172A]">Available Variables:</span>
          <code className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono">&#123;guest_name&#125;</code>
          <code className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono">&#123;resort_name&#125;</code>
          <code className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono">&#123;dates&#125;</code>
          <code className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono">&#123;amount&#125;</code>
        </div>
      </div>

      {/* 4. Template Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {filteredTemplates.map((t) => {
          const previewText = interpolateTemplate(t.content, sampleValues);

          return (
            <div
              key={t.id}
              className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs p-4 flex flex-col justify-between hover:border-[#CBD5E1] transition-all space-y-3"
            >
              <div>
                {/* Card Top: Channel badge + Category + Actions */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {t.channel === 'whatsapp' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#25D366]/10 text-[#075E54] border border-[#25D366]/30 flex items-center gap-1">
                        <MessageCircle className="w-3 h-3 text-[#25D366]" /> WhatsApp
                      </span>
                    )}
                    {t.channel === 'email' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                        <Mail className="w-3 h-3 text-blue-600" /> Email
                      </span>
                    )}
                    {t.channel === 'sms' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                        <Smartphone className="w-3 h-3 text-purple-600" /> SMS
                      </span>
                    )}
                    <span className="text-[10px] font-semibold text-[#64748B] px-1.5 py-0.5 rounded bg-slate-100 uppercase tracking-wider">
                      {t.category.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleCopy(t.content)}
                      className="p-1.5 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-lg transition-colors"
                      title="Copy template text"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(t)}
                      className="p-1.5 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(t.id, t.name)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-[#0F172A] mb-1">{t.name}</h3>
                {t.subject && (
                  <p className="text-xs text-[#0F5132] font-semibold mb-2">Subject: {t.subject}</p>
                )}

                {/* Rendered Preview Bubble */}
                <div
                  className={`p-3 rounded-xl text-xs leading-relaxed whitespace-pre-wrap font-sans ${
                    t.channel === 'whatsapp'
                      ? 'bg-[#DCF8C6]/40 border border-[#25D366]/20 text-[#075E54]'
                      : t.channel === 'email'
                      ? 'bg-blue-50/40 border border-blue-100 text-[#1E3A8A]'
                      : 'bg-slate-50 border border-slate-200 text-[#334155]'
                  }`}
                >
                  {previewText}
                </div>
              </div>

              {/* Variables Used */}
              <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-[11px] text-[#64748B]">
                <span className="font-semibold">Variables:</span>
                <span className="truncate max-w-[180px]">{t.variables.join(', ') || 'None'}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit / Create Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl lg:max-w-3xl w-full p-6 sm:p-7 shadow-2xl border border-[#CBD5E1] space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <h3 className="text-base sm:text-lg font-bold text-[#0F172A] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#0F5132]" />
                <span>{templateToEdit ? 'Edit Template' : 'Create New Template'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-[#64748B] hover:text-[#0F172A]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-[#475569] mb-1">Template Name *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Luxury Villa Welcome"
                    className="w-full h-10 px-3 rounded-xl bg-white border border-[#CBD5E1] font-medium focus:outline-none focus:border-[#0F5132]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#475569] mb-1">Channel</label>
                  <select
                    value={formChannel}
                    onChange={(e) => setFormChannel(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-xl bg-white border border-[#CBD5E1] font-medium focus:outline-none"
                  >
                    <option value="whatsapp">WhatsApp</option>
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#475569] mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full h-9 px-3 rounded-xl bg-white border border-[#CBD5E1] font-medium focus:outline-none"
                  >
                    <option value="intro">Intro / Welcome</option>
                    <option value="quotation">Quotation / Tariff</option>
                    <option value="site_visit">Site Visit Inspection</option>
                    <option value="followup">Follow-up Check</option>
                    <option value="booking_confirmation">Booking Confirmation</option>
                    <option value="discount_offer">Privilege Discount</option>
                  </select>
                </div>
              </div>

              {formChannel === 'email' && (
                <div>
                  <label className="block text-[11px] font-semibold text-[#475569] mb-1">Email Subject Line</label>
                  <input
                    type="text"
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                    placeholder="e.g. Exclusive Luxury Proposal for {guest_name}"
                    className="w-full h-9 px-3 rounded-xl bg-white border border-[#CBD5E1] font-medium focus:outline-none"
                  />
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-[#475569]">Message Content *</label>
                  <span className="text-[10px] text-[#64748B]">Click chip to insert:</span>
                </div>

                {/* Variable Inserter Chips */}
                <div className="flex flex-wrap gap-1 mb-2">
                  {['guest_name', 'resort_name', 'dates', 'amount', 'quotation_link'].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => handleInsertVariable(v)}
                      className="px-2 py-0.5 rounded-md bg-emerald-50 hover:bg-emerald-100 text-[#0F5132] font-mono text-[10px] font-semibold border border-emerald-200 transition-colors"
                    >
                      + &#123;{v}&#125;
                    </button>
                  ))}
                </div>

                <textarea
                  required
                  rows={5}
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Compose message with dynamic variables..."
                  className="w-full p-2.5 rounded-xl bg-white border border-[#CBD5E1] font-sans font-medium text-xs leading-relaxed focus:outline-none focus:border-[#0F5132]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs font-semibold text-[#475569]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0F5132] hover:bg-[#0B3D25] text-white rounded-xl text-xs font-bold shadow-2xs"
                >
                  Save Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
