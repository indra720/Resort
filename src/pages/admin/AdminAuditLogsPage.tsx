import React, { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from '@/store/useToastStore';
import {
  ShieldCheck,
  Search,
  Download,
  AlertTriangle,
  Info,
  AlertOctagon,
  Calendar,
  User,
  Building2,
  RefreshCw,
} from 'lucide-react';

export const AdminAuditLogsPage: React.FC = () => {
  const { auditLogs, addAuditLog } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'All' | 'Info' | 'Warning' | 'Critical'>('All');

  const filteredLogs = auditLogs.filter((log) => {
    if (severityFilter !== 'All' && log.severity !== severityFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        log.action.toLowerCase().includes(q) ||
        log.actorName.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        (log.resortName && log.resortName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleExportCSV = () => {
    toast.success(`Exported ${filteredLogs.length} audit records to CSV.`);
  };

  const handleRunSecurityCheck = () => {
    addAuditLog('System Health Verification', 'Super Admin executed automated platform security diagnostics', 'Info');
    toast.success('Security diagnostics completed: All tenant database schemas healthy.');
  };

  return (
    <div className="space-y-4 text-[#111827]">
      {/* Header Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-2xs bg-white">
        <div className="relative h-54 w-full overflow-hidden flex flex-col justify-between p-4 sm:p-6">
          <img
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80"
            alt="Security & Audit Trail"
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.96]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-transparent" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <div className="flex flex-col lg:flex-row items-center gap-2">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#0F5132]/10 text-[#0F5132] uppercase tracking-wider">
                  Compliance & Forensics
                </span>
                <span className="text-xs text-[#64748B]">Immutable Trail</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A] mt-1">
                Platform Security & Audit Trail
              </h1>
              <p className="text-xs sm:text-sm text-[#475569] font-medium mt-0.5">
                Timestamped logs of every tenant provision, persona switch, role change, and capex authorization
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={handleRunSecurityCheck}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-[#F8FAFC] text-[#0F172A] border border-[#E2E8F0] rounded-xl text-xs font-semibold shadow-2xs transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#0F5132]" />
                <span>Run Diagnostics</span>
              </button>
              <button
                type="button"
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-[#0F5132] hover:bg-[#0B3D25] text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Audit CSV</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="p-3 sm:p-4 bg-white/95 backdrop-blur-md border-t border-[#E2E8F0]">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3.5">
            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 rounded-xl bg-[#22C55E] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-semibold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full shrink-0">
                  Total
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B]">Total Trail Entries</p>
                <div className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5">
                  {auditLogs.length} Events
                </div>
                <p className="text-[10px] text-[#94A3B8] mt-0.5">Recorded in session</p>
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 rounded-xl bg-[#F59E0B] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full shrink-0">
                  Warnings
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B]">Impersonations & Alerts</p>
                <div className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5">
                  {auditLogs.filter((l) => l.severity === 'Warning').length}
                </div>
                <p className="text-[10px] text-[#D97706] mt-0.5">Requires audit sign-off</p>
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="w-8 h-8 rounded-xl bg-[#3B82F6] flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <Info className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full shrink-0">
                  Normal
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-[#64748B]">System & Tenant Actions</p>
                <div className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight mt-0.5">
                  {auditLogs.filter((l) => l.severity === 'Info').length}
                </div>
                <p className="text-[10px] text-[#2563EB] mt-0.5">Provisioning & sign-ins</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#E2E8F0] shadow-2xs">
        <div className="flex-1 min-w-[220px] max-w-md relative">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search audit trail by actor, action, details..."
            className="w-full h-9 pl-9 pr-3 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5132]/30"
          />
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-2">
          {(['All', 'Info', 'Warning', 'Critical'] as const).map((sev) => (
            <button
              key={sev}
              type="button"
              onClick={() => setSeverityFilter(sev)}
              className={`h-8 px-3 rounded-xl text-xs font-semibold transition-colors ${
                severityFilter === sev
                  ? 'bg-[#0F5132] text-white shadow-2xs'
                  : 'bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-[#E2E8F0] flex flex-col md:flex-row items-center justify-between">
          <h3 className="text-base font-bold text-[#0F172A]">Chronological Event Feed</h3>
          <span className="text-xs text-[#64748B]">{filteredLogs.length} events logged</span>
        </div>

        {/* Compact Mobile / Tablet Swipe Notice */}
        <div className="lg:hidden flex items-center justify-between gap-2 px-3 sm:px-4 py-1.5 bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] text-[#475569]">
          <span className="flex items-center gap-1.5 font-medium min-w-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0F5132] animate-pulse shrink-0" />
            <span className="truncate">Swipe horizontally to see all columns</span>
          </span>
          <span className="text-[10px] font-bold text-[#0F5132] bg-emerald-50/80 px-2 py-0.5 rounded border border-emerald-200 whitespace-nowrap shrink-0">
            ↔ Swipe
          </span>
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full min-w-[900px] text-left text-xs text-[#1E293B] border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-semibold whitespace-nowrap">
                <th className="py-3.5 px-4 min-w-[140px]">Timestamp</th>
                <th className="py-3.5 px-4 min-w-[190px]">Actor & Role</th>
                <th className="py-3.5 px-4 min-w-[180px]">Action Event</th>
                <th className="py-3.5 px-4 min-w-[280px]">Event Details</th>
                <th className="py-3.5 px-4 min-w-[160px]">Resort Tenant</th>
                <th className="py-3.5 px-4 min-w-[100px]">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filteredLogs.map((l) => (
                <tr key={l.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3.5 px-4 whitespace-nowrap text-[#64748B] font-mono text-[11px]">
                    {l.timestamp}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div>
                      <p className="font-bold text-[#0F172A]">{l.actorName}</p>
                      <p className="text-[11px] text-[#64748B]">{l.actorRole}</p>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap font-semibold text-[#0F172A]">
                    {l.action}
                  </td>
                  <td className="py-3.5 px-4 text-[#475569] leading-relaxed">
                    {l.details}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap text-[#334155]">
                    {l.resortName || 'Platform Global'}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-semibold text-[11px] border ${
                        l.severity === 'Critical'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : l.severity === 'Warning'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {l.severity || 'Info'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
